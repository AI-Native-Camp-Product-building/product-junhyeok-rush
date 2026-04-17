"use client";

import { useRouter } from "next/navigation";

export default function DailyFeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-surface-950 text-surface-100">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-surface-800 bg-surface-950/95 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center gap-3">
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
          <div className="flex items-center gap-2">
            <span className="font-mono text-accent-400 text-sm select-none">&gt;_</span>
            <h1 className="text-lg font-bold bg-gradient-to-r from-accent-300 to-accent-400 bg-clip-text text-transparent">
              Daily Feed
            </h1>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
}
