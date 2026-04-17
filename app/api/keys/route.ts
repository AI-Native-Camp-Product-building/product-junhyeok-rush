// === POST /api/keys ===
//
// Issues a fresh API key. No auth required — this endpoint is the public
// onboarding for the /api/insights endpoint.

import { NextResponse } from "next/server";
import { issueApiKey } from "@/lib/api-keys";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const record = await issueApiKey();
    return NextResponse.json({
      key: record.key,
      createdAt: record.createdAt,
      usage: {
        endpoint: "GET /api/insights",
        header: "X-API-Key: <your-key>",
        example: `curl -H "X-API-Key: ${record.key}" https://rush-theta.vercel.app/api/insights`,
      },
    });
  } catch (error) {
    console.error("[/api/keys] issue failed:", error);
    return NextResponse.json(
      { error: "Failed to issue API key" },
      { status: 500 }
    );
  }
}
