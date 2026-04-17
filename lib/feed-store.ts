// === Feed Store: L2 persistent cache (dev: filesystem, prod: Vercel Blob) ===
//
// Backend detection: if BLOB_READ_WRITE_TOKEN is set (Vercel auto-provides
// when a Blob store is linked), use Vercel Blob. Otherwise fall back to
// local filesystem at .omc/daily-feed-cache/{date}.json for dev experience.
//
// The L1 in-memory cache in lib/feed-cache.ts sits in front of this store;
// L2 serves cold/new instances and survives server restarts.

import { promises as fs } from "fs";
import path from "path";
import type { DailyFeedResponse } from "./daily-feed-types";

const USE_BLOB = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const DEV_CACHE_DIR = path.join(process.cwd(), ".omc", "daily-feed-cache");

function blobKey(date: string): string {
  return `daily-feed/${date}.json`;
}

function devPath(date: string): string {
  return path.join(DEV_CACHE_DIR, `${date}.json`);
}

/**
 * Read the cached feed for a given KST date key. Returns null on miss or
 * any error (callers fall back to rebuilding). Errors are logged but not
 * thrown so a broken store never blocks user requests.
 */
export async function readStoredFeed(
  date: string
): Promise<DailyFeedResponse | null> {
  if (USE_BLOB) {
    try {
      const { get } = await import("@vercel/blob");
      const result = await get(blobKey(date), { access: "private" });
      if (!result || result.statusCode !== 200) return null;
      const text = await new Response(result.stream).text();
      return JSON.parse(text) as DailyFeedResponse;
    } catch (err) {
      // 404 / not-found is a normal miss for new dates.
      const msg = err instanceof Error ? err.message : String(err);
      if (!/not.found|404/i.test(msg)) {
        console.error("[feed-store] Blob read failed:", err);
      }
      return null;
    }
  }

  try {
    const raw = await fs.readFile(devPath(date), "utf-8");
    return JSON.parse(raw) as DailyFeedResponse;
  } catch (err) {
    const e = err as NodeJS.ErrnoException;
    if (e.code !== "ENOENT") {
      console.error("[feed-store] Dev read failed:", err);
    }
    return null;
  }
}

/**
 * Write the feed for the given date to the persistent store. Non-blocking
 * semantics: errors are swallowed (logged) so a failed write does not break
 * the request path. The L1 cache is still populated via the caller.
 */
export async function writeStoredFeed(
  date: string,
  data: DailyFeedResponse
): Promise<void> {
  if (USE_BLOB) {
    try {
      const { put } = await import("@vercel/blob");
      await put(blobKey(date), JSON.stringify(data), {
        access: "private",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
    } catch (err) {
      console.error("[feed-store] Blob write failed:", err);
    }
    return;
  }

  try {
    await fs.mkdir(DEV_CACHE_DIR, { recursive: true });
    await fs.writeFile(devPath(date), JSON.stringify(data), "utf-8");
  } catch (err) {
    console.error("[feed-store] Dev write failed:", err);
  }
}
