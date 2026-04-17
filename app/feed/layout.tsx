"use client";

import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/state-context";
import ProgressBar from "@/components/ui/ProgressBar";

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { state } = useAppState();

  // Compute today's overall progress from feed items
  const itemEntries = Object.entries(state.feed.items);
  const totalItems = itemEntries.length;
  const completedItems = itemEntries.filter(
    ([, progress]) => progress.status === "completed"
  ).length;
  const overallProgress =
    totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  return (
    <div className="min-h-screen bg-surface-950 text-surface-100">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-surface-800 bg-surface-950/95 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between gap-4">
          {/* Left: logo + title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.push("/")}
              className="shrink-0 text-surface-400 hover:text-surface-200 transition-colors text-sm flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              홈
            </button>
            <h1 className="text-lg font-bold bg-gradient-to-r from-accent-300 to-accent-400 bg-clip-text text-transparent truncate">
              오늘의 학습
            </h1>
          </div>

          {/* Right: compact streak */}
          <div className="shrink-0 flex items-center gap-1.5 text-sm">
            <span className="text-accent-400 font-bold tabular-nums">
              {state.streak.current}
            </span>
            <span className="text-lg leading-none">🔥</span>
            <span className="text-surface-500 text-xs hidden sm:inline">
              연속
            </span>
          </div>
        </div>

        {/* Progress bar */}
        {totalItems > 0 && (
          <div className="mx-auto max-w-4xl px-4 pb-3">
            <ProgressBar
              value={overallProgress}
              label={`학습 진행률 ${completedItems}/${totalItems}`}
              color="accent"
              size="sm"
            />
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
}
