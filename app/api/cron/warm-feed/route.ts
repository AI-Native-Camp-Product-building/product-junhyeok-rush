// === Cron: Warm Daily Feed ===
//
// Proactively runs the full pipeline and writes to the L2 store so that the
// 9 AM KST briefing never hits a cold 85s build. Schedule lives in
// vercel.json (cron runs at 23:00 UTC = 08:00 KST, one hour before briefing).
//
// Auth: verifies Authorization: Bearer ${CRON_SECRET}. Vercel Cron Jobs
// automatically set this header when CRON_SECRET is configured as a project
// env var. For local manual testing, pass the same header.

import { NextResponse } from "next/server";
import { buildFeed } from "@/lib/feed-builder";
import { writeStoredFeed } from "@/lib/feed-store";
import { getKstDateKey, setCachedFeed } from "@/lib/feed-cache";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // Vercel Functions max (5 min, covers 85s pipeline)

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  // Auth gate: require bearer match when CRON_SECRET is configured.
  // When unset (local dev convenience), allow without auth.
  if (cronSecret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const startedAt = Date.now();
  const today = getKstDateKey();

  try {
    const built = await buildFeed(today);
    const elapsedMs = Date.now() - startedAt;

    // Always persist — even degraded fallback results are usable and beat
    // forcing every visitor through a 286s cold rebuild. The next cron run
    // overwrites with a full-pipeline result if conditions improve.
    await writeStoredFeed(today, built.response);
    setCachedFeed(today, built.response);

    return NextResponse.json({
      status: built.degraded ? "degraded" : "ok",
      date: today,
      totalRaw: built.response.totalRaw,
      totalFiltered: built.response.totalFiltered,
      elapsedMs,
      ...(built.degraded && {
        note: "Pipeline ran in degraded mode (keyword fallback); store updated anyway.",
      }),
    });
  } catch (error) {
    console.error("[cron/warm-feed] build failed:", error);
    return NextResponse.json(
      {
        status: "error",
        date: today,
        error: error instanceof Error ? error.message : String(error),
        elapsedMs: Date.now() - startedAt,
      },
      { status: 500 }
    );
  }
}
