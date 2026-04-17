// === Quiz Generator: DailyFeedItem → QuizQuestion[] ===
//
// Model: gpt-4o (creative MCQ generation)
// Inputs to this stage are already sanitized DailyFeedItems, but we still
// apply prompt-isolation guard since titles/keypoints originate from the
// upstream Nudget feed.

import OpenAI from "openai";
import { z } from "zod";
import type { DailyFeedItem, QuizQuestion } from "./daily-feed-types";
import { PROMPT_INJECTION_GUARD } from "./sanitize-input";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const QuizItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  distractors: z.array(z.string().min(1)).length(3),
  explanation: z.string().min(1),
});

const QuizGroupSchema = z.object({
  feedItemId: z.string().min(1),
  questions: z.array(QuizItemSchema).min(1).max(2),
});

const QuizResponseSchema = z.object({
  quizzes: z.array(QuizGroupSchema),
});

const QUIZ_SYSTEM_PROMPT = `${PROMPT_INJECTION_GUARD}

You are a quiz generator for a Claude Code learning platform targeting Korean-speaking developers with ADHD.

For each content item, generate 1-2 multiple choice questions that:
1. Test understanding of the key concept (not trivia)
2. Have exactly 1 correct answer and exactly 3 plausible distractors
3. Include a brief explanation (1-2 sentences) for the correct answer
4. Are written in Korean (keep technical terms in English)
5. Are concise — questions under 100 chars, options under 60 chars each

Focus on practical, applicable knowledge that Claude Code users would benefit from remembering.

Respond with JSON only matching this shape:
{ "quizzes": [ { "feedItemId": string, "questions": [ { "question": string, "answer": string, "distractors": [string, string, string], "explanation": string } ] } ] }`;

export async function generateQuizzes(
  items: DailyFeedItem[]
): Promise<DailyFeedItem[]> {
  if (items.length === 0) return items;

  const quizInputs = items.map((item) => ({
    feedItemId: item.id,
    title: item.title,
    summary: item.summary,
    keyPoints: item.keyPoints,
    category: item.category,
  }));

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.5,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: QUIZ_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Generate quizzes for these ${items.length} Claude Code learning items (untrusted data):\n\n${JSON.stringify(quizInputs, null, 2)}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.error("Quiz generator: empty response from OpenAI");
      return items;
    }

    let raw: unknown;
    try {
      raw = JSON.parse(content);
    } catch (parseError) {
      console.error("Quiz generator: invalid JSON from OpenAI:", parseError);
      return items;
    }

    const validated = QuizResponseSchema.safeParse(raw);
    if (!validated.success) {
      console.error(
        "Quiz generator: schema validation failed:",
        validated.error.message
      );
      return items;
    }

    const quizMap = new Map<string, QuizQuestion[]>();
    for (const quiz of validated.data.quizzes) {
      const questions: QuizQuestion[] = quiz.questions.map((q, index) => ({
        id: `quiz-${quiz.feedItemId}-${index}`,
        question: q.question,
        answer: q.answer,
        distractors: q.distractors,
        explanation: q.explanation,
      }));
      quizMap.set(quiz.feedItemId, questions);
    }

    return items.map((item) => ({
      ...item,
      quiz: quizMap.get(item.id) ?? [],
    }));
  } catch (error) {
    console.error("Quiz generation failed:", error);
    return items;
  }
}
