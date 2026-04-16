"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { DailyFeedItem, DailyFeedResponse } from "@/lib/daily-feed-types";

interface HeroItem {
  category: string;
  source: string;
  title: string;
}

const FALLBACK_ITEMS: HeroItem[] = [
  { category: "workflow", source: "@danshipper", title: "Claude Code Agent SDK로 멀티 에이전트 파이프라인 구축하기" },
  { category: "update", source: "@koylanai", title: "Claude Code 4.6 — 1M 컨텍스트 윈도우 실전 활용법" },
  { category: "methodology", source: "까칠한AI", title: "CLAUDE.md 작성 전략 — 에이전트 성능을 2배로" },
];

function extractSource(item: DailyFeedItem): string {
  if (item.sourceType === "x" && item.sourceUrl) {
    const match = item.sourceUrl.match(/x\.com\/([^/]+)/);
    if (match) return `@${match[1]}`;
  }
  return item.sourceName;
}

export function HeroSection() {
  const [heroItems, setHeroItems] = useState<HeroItem[]>(FALLBACK_ITEMS);
  const [itemCount, setItemCount] = useState(3);

  const todayKst = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  useEffect(() => {
    fetch("/api/daily-feed")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: DailyFeedResponse | null) => {
        if (!data?.items?.length) return;
        setItemCount(data.items.length);
        setHeroItems(
          data.items.slice(0, 3).map((item) => ({
            category: item.category,
            source: extractSource(item),
            title: item.title,
          }))
        );
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative min-h-[80vh] flex items-center">
      {/* Subtle gradient mesh — Camp style, barely visible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(80% 50% at 50% -10%, rgba(192,240,251,0.04), transparent), radial-gradient(60% 40% at 100% 100%, rgba(255,234,0,0.02), transparent)",
        }}
      />

      <div className="max-w-5xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-[1fr_420px] gap-16 items-center">
          {/* Left: Copy */}
          <div className="space-y-7">
            <div className="flex items-center gap-2 text-surface-500 text-sm font-mono">
              <span className="text-accent-400">&gt;_</span>
              <span>daily-feed</span>
              <span className="inline-block w-[7px] h-[18px] bg-accent-400/70 animate-pulse ml-0.5" />
            </div>

            <h1 className="text-[2.8rem] sm:text-[3.4rem] font-bold leading-[1.12] tracking-[-1.2px] text-surface-50">
              어제의 나는
              <br />
              오늘의 메타를
              <br />
              <span className="text-accent-400">모른다</span>
            </h1>

            <p className="text-surface-400 text-lg leading-relaxed max-w-md">
              Claude Code 생태계는 매일 변합니다.
              <br />
              11개 채널에서 수집된 트렌드를
              <br />
              <span className="text-surface-200">30분 안에 따라잡으세요.</span>
            </p>

            <div className="flex items-center gap-4 pt-2">
              <Link
                href="/daily-feed"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-accent-400 text-surface-950 text-sm font-semibold hover:bg-accent-hover transition-colors duration-150"
              >
                오늘의 피드 보기
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <a
                href="https://ainativecamp-production.up.railway.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-surface-500 hover:text-surface-300 transition-colors"
              >
                AI Native Camp에서 시작 &rarr;
              </a>
            </div>
          </div>

          {/* Right: Terminal card */}
          <div className="rounded-xl border border-surface-700 bg-surface-800 overflow-hidden">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-700">
              <span className="text-accent-400 font-mono text-sm">&gt;_</span>
              <span className="text-surface-500 font-mono text-xs">
                nudget-feed — today
              </span>
            </div>

            {/* Terminal body */}
            <div className="p-5 font-mono text-[13px] leading-relaxed space-y-4">
              {/* Command */}
              <div>
                <span className="text-surface-500">$</span>{" "}
                <span className="text-accent-400">fetch</span>{" "}
                <span className="text-surface-300">--today --filter claude-code</span>
              </div>

              {/* Results — live from /api/daily-feed, fallback to static */}
              <div className="space-y-3 pt-1">
                <div className="text-surface-500 text-xs uppercase tracking-wider">
                  {itemCount} items found · {todayKst}
                </div>

                {heroItems.map((item, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-surface-700 bg-surface-900/50 space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-400/10 text-accent-400 font-semibold">
                        {item.category}
                      </span>
                      <span className="text-surface-500 text-[11px]">
                        {item.source}
                      </span>
                    </div>
                    <div className="text-surface-200 text-xs">{item.title}</div>
                  </div>
                ))}
              </div>

              {/* Quiz prompt */}
              <div className="pt-2 border-t border-surface-700/50">
                <span className="text-surface-500">$</span>{" "}
                <span className="text-accent-400">quiz</span>{" "}
                <span className="text-surface-400">--start</span>
                <span className="inline-block w-[7px] h-[14px] bg-accent-400/50 animate-pulse ml-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
