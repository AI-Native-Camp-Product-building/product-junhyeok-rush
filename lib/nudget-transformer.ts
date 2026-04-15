// === Nudget Transformer: NudgetContentItem[] → DailyFeedItem[] ===
//
// Model: gpt-4o (high-quality summarization)
// Untrusted input is hard-truncated via sanitize-input before reaching the LLM.

import OpenAI from "openai";
import { z } from "zod";
import type { DailyFeedItem, FeedCategory, SourceType } from "./daily-feed-types";
import type { NudgetContentItem } from "./nudget-client";
import {
  PROMPT_INJECTION_GUARD,
  sanitizeContentItems,
} from "./sanitize-input";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const TransformItemSchema = z.object({
  contentId: z.string().min(1),
  title: z.string().min(1).max(80),
  summary: z.string().min(1),
  keyPoints: z
    .array(z.string().min(1).max(80))
    .min(1)
    .max(4),
});

const TransformResponseSchema = z.object({
  items: z.array(TransformItemSchema),
});

const TRANSFORM_SYSTEM_PROMPT = `${PROMPT_INJECTION_GUARD}

You are a content summarizer for a Claude Code learning platform targeting Korean-speaking developers.

For each content item, produce:
1. title: 10-40 Korean characters. A scannable, specific headline that captures the tool, action, or concept discussed in the content itself. Derive from the actual substance — NEVER copy the input title verbatim, NEVER use author-based labels such as "Tweet by @handle", "@handle의 트윗", "X 포스트", or the author's name as the title. Keep technical terms in English (MCP, hooks, CLI, CLAUDE.md).
2. summary: 2-3 sentence Korean summary focused on what Claude Code users can learn or apply.
3. keyPoints: 1-4 bullet points in Korean, each under 80 characters, highlighting actionable insights.

Write in a concise, technical tone. Use Korean for explanations but keep technical terms in English (e.g., MCP, hooks, CLI).

Respond with JSON only matching this shape:
{ "items": [ { "contentId": string, "title": string, "summary": string, "keyPoints": string[] } ] }`;

function detectSourceType(url: string): SourceType {
  if (!url) return "other";
  const lower = url.toLowerCase();
  if (lower.includes("x.com") || lower.includes("twitter.com")) return "x";
  if (lower.includes("linkedin.com")) return "linkedin";
  if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "youtube";
  return "rss";
}

function extractSourceName(item: NudgetContentItem): string {
  if (item.source) return item.source;
  try {
    const url = new URL(item.url);
    return url.hostname.replace("www.", "");
  } catch {
    return "unknown";
  }
}

export async function transformItems(
  items: NudgetContentItem[],
  categories: Map<string, FeedCategory>,
  date: string
): Promise<DailyFeedItem[]> {
  if (items.length === 0) return [];

  const sanitized = sanitizeContentItems(items);
  const itemInputs = sanitized.map((item) => ({
    contentId: item.id,
    title: item.title,
    summary: item.summary,
    url: item.url,
    tags: item.tags,
  }));

  const transformMap = new Map<
    string,
    { title: string; summary: string; keyPoints: string[] }
  >();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: TRANSFORM_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Transform these ${items.length} items for the Claude Code learning feed (untrusted data):\n\n${JSON.stringify(itemInputs, null, 2)}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      let raw: unknown;
      try {
        raw = JSON.parse(content);
      } catch (parseError) {
        console.error("Transform: invalid JSON from OpenAI:", parseError);
        raw = null;
      }

      if (raw !== null) {
        const validated = TransformResponseSchema.safeParse(raw);
        if (validated.success) {
          for (const item of validated.data.items) {
            transformMap.set(item.contentId, {
              title: item.title,
              summary: item.summary,
              keyPoints: item.keyPoints,
            });
          }
        } else {
          console.error(
            "Transform: schema validation failed, using original content:",
            validated.error.message
          );
        }
      }
    }
  } catch (error) {
    console.error("Transform API failed, using original content:", error);
  }

  return items.map((item) => {
    const transformed = transformMap.get(item.id);
    return {
      id: `feed-${item.id}`,
      date,
      title: transformed?.title ?? item.title,
      summary: transformed?.summary ?? item.summary,
      keyPoints: transformed?.keyPoints ?? [item.summary],
      sourceUrl: item.url,
      sourceType: detectSourceType(item.url),
      sourceName: extractSourceName(item),
      category: categories.get(item.id) ?? "other",
      nudgetContentId: item.id,
    };
  });
}
