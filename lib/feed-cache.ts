// === Feed Cache: KST 날짜 기반 in-memory 캐시 (TTL: 1시간) + single-flight ===

import type { DailyFeedResponse } from "./daily-feed-types";

interface CacheEntry {
  data: DailyFeedResponse;
  timestamp: number;
}

const TTL_MS = 60 * 60 * 1000; // 1시간
const MAX_ENTRIES = 50;

const cache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<DailyFeedResponse>>();

/**
 * Returns YYYY-MM-DD in Asia/Seoul (KST). Used as the canonical cache key so
 * that all Korean users see the same daily digest regardless of the server's
 * UTC clock.
 */
export function getKstDateKey(now: Date = new Date()): string {
  // en-CA gives ISO-style YYYY-MM-DD output.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function getCachedFeed(date: string): DailyFeedResponse | null {
  const entry = cache.get(date);
  if (!entry) return null;

  if (Date.now() - entry.timestamp > TTL_MS) {
    cache.delete(date);
    return null;
  }

  return entry.data;
}

export function setCachedFeed(date: string, data: DailyFeedResponse): void {
  cache.set(date, { data, timestamp: Date.now() });

  // Simple cap: drop the oldest insertion-order entry when over the limit.
  // Map preserves insertion order, so the first key is the oldest.
  while (cache.size > MAX_ENTRIES) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey === undefined) break;
    cache.delete(oldestKey);
  }
}

/**
 * Single-flight wrapper: if multiple requests for the same `date` arrive
 * concurrently, only the first call invokes `loader`. All others await the
 * shared promise. The in-flight entry is cleared when the loader settles so
 * that subsequent (post-failure) requests can retry.
 */
export async function loadFeedSingleFlight(
  date: string,
  loader: () => Promise<DailyFeedResponse>
): Promise<DailyFeedResponse> {
  const existing = inFlight.get(date);
  if (existing) return existing;

  const promise = (async () => {
    try {
      return await loader();
    } finally {
      inFlight.delete(date);
    }
  })();

  inFlight.set(date, promise);
  return promise;
}
