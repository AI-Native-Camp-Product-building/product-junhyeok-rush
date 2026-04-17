// === Daily Feed API Route: L1 memory → L2 store → L3 pipeline ===
//
// Cache hierarchy:
//   L1 = in-memory per-instance cache (lib/feed-cache.ts)
//   L2 = persistent store — filesystem in dev, Vercel Blob in prod
//        (lib/feed-store.ts), written by cron warm-feed at 08:00 KST
//   L3 = full pipeline rebuild (~30-90s, last resort)

import { NextResponse } from "next/server";
import { buildFeed } from "@/lib/feed-builder";
import { readStoredFeed, writeStoredFeed } from "@/lib/feed-store";
import {
  getCachedFeed,
  getKstDateKey,
  loadFeedSingleFlight,
  setCachedFeed,
} from "@/lib/feed-cache";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
} as const;

export async function GET() {
  try {
    const today = getKstDateKey();

    // L1: in-memory
    const l1 = getCachedFeed(today);
    if (l1) {
      return NextResponse.json(l1, { headers: CACHE_HEADERS });
    }

    // L2: persistent store (filesystem or Vercel Blob)
    const l2 = await readStoredFeed(today);
    if (l2) {
      setCachedFeed(today, l2);
      return NextResponse.json(l2, { headers: CACHE_HEADERS });
    }

    // L3: rebuild via single-flight. Degraded results are not persisted so
    // that the next request retries the full pipeline.
    const result = await loadFeedSingleFlight(today, async () => {
      const built = await buildFeed(today);
      if (!built.degraded) {
        setCachedFeed(today, built.response);
        await writeStoredFeed(today, built.response);
      }
      return built.response;
    });

    return NextResponse.json(result, { headers: CACHE_HEADERS });
  } catch (error) {
    console.error("Daily feed API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
