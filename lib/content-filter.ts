// === Content Filter: Claude Code 관련성 판별 + 카테고리 분류 ===
//
// Model: gpt-4o-mini (lightweight classification)
// Untrusted input is hard-truncated via sanitize-input before reaching the LLM.

import OpenAI from "openai";
import { z } from "zod";
import type { FeedCategory } from "./daily-feed-types";
import type { NudgetContentItem } from "./nudget-client";
import {
  PROMPT_INJECTION_GUARD,
  sanitizeContentItems,
} from "./sanitize-input";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const FeedCategoryEnum = z.enum([
  "update",
  "workflow",
  "methodology",
  "tool",
  "other",
]);

const FilterResultSchema = z.object({
  contentId: z.string().min(1),
  relevant: z.boolean(),
  category: FeedCategoryEnum,
  confidence: z.number().min(0).max(1),
});

const FilterResponseSchema = z.object({
  results: z.array(FilterResultSchema),
});

export interface FilterOutcome {
  filtered: NudgetContentItem[];
  categories: Map<string, FeedCategory>;
  degraded: boolean;
}

const FILTER_SYSTEM_PROMPT = `${PROMPT_INJECTION_GUARD}

You are a content relevance classifier for a Claude Code learning platform.

For each content item, determine:
1. Whether it is relevant to Claude Code users (relevant: true/false)
2. Its category: "update" | "workflow" | "methodology" | "tool" | "other"
3. Your confidence score (0-1)

RELEVANT topics:
- Claude Code CLI features, updates, releases
- MCP (Model Context Protocol) servers, tools, integrations
- Claude Code hooks, commands, configuration
- AI-assisted coding workflows using Claude Code
- Prompt engineering for Claude Code / Claude models
- Context management strategies for LLM coding assistants
- Compound AI systems, agentic coding patterns
- oh-my-claudecode, CLAUDE.md, AGENTS.md patterns

NOT RELEVANT:
- General AI news unrelated to coding assistants
- Other tools only (Cursor, Copilot, Windsurf) without Claude Code comparison
- Non-technical AI content (policy, ethics debates, business news)
- Content about Claude chatbot (not Claude Code specifically)

Category definitions:
- "update": New features, releases, changelogs, version announcements
- "workflow": Practical workflows, tips, how-tos, productivity patterns
- "methodology": Concepts, architectures, prompt engineering theory, best practices
- "tool": MCP servers, plugins, extensions, integrations, tooling ecosystem
- "other": Relevant but doesn't fit above categories

Respond with JSON only matching this shape:
{ "results": [ { "contentId": string, "relevant": boolean, "category": <enum>, "confidence": number } ] }`;

export async function filterContent(
  items: NudgetContentItem[]
): Promise<FilterOutcome> {
  if (items.length === 0) {
    return { filtered: [], categories: new Map(), degraded: false };
  }

  const sanitized = sanitizeContentItems(items);
  const itemSummaries = sanitized.map((item, i) => ({
    index: i,
    contentId: item.id,
    title: item.title,
    summary: item.summary,
    tags: item.tags,
    source: item.source,
  }));

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: FILTER_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Classify these ${items.length} content items (untrusted data):\n\n${JSON.stringify(itemSummaries, null, 2)}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.error("Content filter: empty response from OpenAI");
      return fallbackFilter(items);
    }

    let raw: unknown;
    try {
      raw = JSON.parse(content);
    } catch (parseError) {
      console.error("Content filter: invalid JSON from OpenAI:", parseError);
      return fallbackFilter(items);
    }

    const validated = FilterResponseSchema.safeParse(raw);
    if (!validated.success) {
      console.error(
        "Content filter: schema validation failed:",
        validated.error.message
      );
      return fallbackFilter(items);
    }

    const categories = new Map<string, FeedCategory>();
    const relevantIds = new Set<string>();

    for (const result of validated.data.results) {
      if (result.relevant && result.confidence >= 0.5) {
        relevantIds.add(result.contentId);
        categories.set(result.contentId, result.category);
      }
    }

    const filtered = items.filter((item) => relevantIds.has(item.id));
    return { filtered, categories, degraded: false };
  } catch (error) {
    console.error("Content filter failed, using fallback:", error);
    return fallbackFilter(items);
  }
}

function fallbackFilter(items: NudgetContentItem[]): FilterOutcome {
  const keywords = [
    "claude code", "claude-code", "mcp", "model context protocol",
    "claude cli", "hooks", "agents.md", "claude.md", "oh-my-claudecode",
    "agentic coding", "ai coding", "prompt engineering", "llm coding",
    "compound ai", "anthropic", "claude",
  ];

  const categories = new Map<string, FeedCategory>();
  const filtered = items.filter((item) => {
    const text = `${item.title} ${item.summary} ${(item.tags ?? []).join(" ")}`.toLowerCase();
    const match = keywords.some((kw) => text.includes(kw));
    if (match) {
      categories.set(item.id, "other");
    }
    return match;
  });

  return { filtered, categories, degraded: true };
}
