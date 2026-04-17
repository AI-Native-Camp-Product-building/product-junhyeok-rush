"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { DailyFeedItem, DailyFeedResponse } from "@/lib/daily-feed-types";
import { getMockFeedItems } from "@/lib/mock-feed-data";
import { SourceBadge, QuizCard } from "@/components/daily-feed";
import { safeHref } from "@/lib/sanitize-input";

export default function DailyFeedItemPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = use(params);
  const router = useRouter();
  const [item, setItem] = useState<DailyFeedItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadItem() {
      const isDev = process.env.NODE_ENV === "development";
      try {
        const res = await fetch("/api/daily-feed");
        if (res.ok) {
          const data: DailyFeedResponse = await res.json();
          const found = data.items.find((i) => i.id === itemId);
          if (cancelled) return;
          if (found) {
            setItem(found);
          } else if (isDev) {
            setItem(getMockFeedItems().find((i) => i.id === itemId) ?? null);
          } else {
            setItem(null);
          }
        } else if (isDev) {
          if (cancelled) return;
          setItem(getMockFeedItems().find((i) => i.id === itemId) ?? null);
        } else {
          if (cancelled) return;
          setError("콘텐츠를 불러오지 못했습니다.");
        }
      } catch {
        if (cancelled) return;
        if (isDev) {
          setItem(getMockFeedItems().find((i) => i.id === itemId) ?? null);
        } else {
          setError("콘텐츠를 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadItem();
    return () => {
      cancelled = true;
    };
  }, [itemId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-3/4 bg-surface-800 rounded-lg animate-pulse" />
        <div className="h-4 w-1/2 bg-surface-800/60 rounded animate-pulse" />
        <div className="h-64 bg-surface-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 space-y-3">
        <div className="text-4xl">⚠️</div>
        <p className="text-error-400 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-accent-400 hover:text-accent-300 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-surface-400 text-lg">존재하지 않는 콘텐츠입니다.</p>
        <button
          onClick={() => router.push("/daily-feed")}
          className="text-accent-400 hover:text-accent-300 text-sm transition-colors"
        >
          피드로 돌아가기
        </button>
      </div>
    );
  }

  const hasQuiz = item.quiz && item.quiz.length > 0;
  const safeSourceUrl = safeHref(item.sourceUrl);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <SourceBadge sourceType={item.sourceType} sourceName={item.sourceName} />
          <span className="text-xs text-surface-500">{item.date}</span>
        </div>
        <h1 className="text-2xl font-bold text-surface-50 leading-snug">
          {item.title}
        </h1>
        <p className="text-surface-300 leading-relaxed">{item.summary}</p>
      </div>

      {/* Key points */}
      {item.keyPoints.length > 0 && (
        <div className="rounded-xl border border-surface-700 bg-surface-800/50 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-surface-400 uppercase tracking-wider">
            핵심 포인트
          </h2>
          <ul className="space-y-2">
            {item.keyPoints.map((point, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-surface-200 pl-3 border-l-2 border-accent-500/30"
              >
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Source link */}
      {safeSourceUrl && (
        <a
          href={safeSourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-surface-700 text-sm text-surface-300 hover:border-surface-500 hover:text-surface-100 transition-colors"
        >
          원문 보기
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}

      {/* Quiz section */}
      {hasQuiz && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-accent-400 text-sm select-none">&gt;_</span>
            <h2 className="text-lg font-bold text-surface-50">이해도 퀴즈</h2>
          </div>
          <QuizCard
            questions={item.quiz!}
            onComplete={(score, total) => {
              // Could persist score to state here in the future
              console.log(`Quiz completed: ${score}/${total}`);
            }}
          />
        </div>
      )}

      {/* Back to feed */}
      <div className="pt-4 border-t border-surface-800">
        <button
          onClick={() => router.push("/daily-feed")}
          className="text-sm text-surface-400 hover:text-surface-200 transition-colors inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          피드로 돌아가기
        </button>
      </div>
    </div>
  );
}
