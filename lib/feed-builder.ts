// === Feed Builder: Nudget → filter → transform → quiz pipeline ===
//
// Extracted from the route handler so that both the public API route and
// the cron warm-feed route can reuse the same pipeline without HTTP indirection.

import { getTodayDigest } from "./nudget-client";
import { filterContent } from "./content-filter";
import { transformItems } from "./nudget-transformer";
import { generateQuizzes } from "./quiz-generator";
import type { DailyFeedResponse } from "./daily-feed-types";

export interface PipelineResult {
  response: DailyFeedResponse;
  degraded: boolean;
}

/**
 * Builds the daily feed for the given KST date by running the full
 * Nudget → filter → transform → quiz pipeline. Expensive (~30-90s) because
 * of multiple gpt-4o calls; callers should use caching (L1 in-memory and/or
 * L2 persistent store) to avoid repeated builds.
 */
export async function buildFeed(today: string): Promise<PipelineResult> {
  const digest = await getTodayDigest();
  if (!digest || !digest.items || digest.items.length === 0) {
    return {
      response: {
        items: [],
        date: today,
        totalFiltered: 0,
        totalRaw: 0,
      },
      degraded: false,
    };
  }

  const totalRaw = digest.items.length;

  const { filtered, categories, degraded } = await filterContent(digest.items);
  const feedItems = await transformItems(filtered, categories, today);
  const itemsWithQuiz = await generateQuizzes(feedItems);

  return {
    response: {
      items: itemsWithQuiz,
      date: today,
      totalFiltered: itemsWithQuiz.length,
      totalRaw,
    },
    degraded,
  };
}
