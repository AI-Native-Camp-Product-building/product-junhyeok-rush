"use client";

import Link from "next/link";
import type { DailyFeedItem, FeedCategory } from "@/lib/daily-feed-types";
import { safeHref } from "@/lib/sanitize-input";
import SourceBadge from "./SourceBadge";

const CATEGORY_PILL: Record<FeedCategory, { label: string; color: string }> = {
  update: { label: "업데이트", color: "bg-streak-500/15 text-streak-400" },
  workflow: { label: "워크플로우", color: "bg-accent-500/15 text-accent-300" },
  methodology: { label: "방법론", color: "bg-spark-500/15 text-spark-300" },
  tool: { label: "도구", color: "bg-code-500/15 text-code-400" },
  other: { label: "기타", color: "bg-surface-700 text-surface-300" },
};

interface FeedCardProps {
  item: DailyFeedItem;
  className?: string;
}

export default function FeedCard({ item, className = "" }: FeedCardProps) {
  const pill = CATEGORY_PILL[item.category];
  const hasQuiz = item.quiz && item.quiz.length > 0;
  const safeSourceUrl = safeHref(item.sourceUrl);

  return (
    <article
      className={`bg-surface-800 border border-surface-700 rounded-xl p-5 space-y-3 transition-all duration-200 hover:border-surface-600 hover:scale-[1.01] ${className}`}
    >
      {/* Top row: source + category */}
      <div className="flex items-center gap-2 flex-wrap">
        <SourceBadge sourceType={item.sourceType} sourceName={item.sourceName} />
        <span
          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${pill.color}`}
        >
          {pill.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-surface-50 leading-snug line-clamp-2">
        {item.title}
      </h3>

      {/* Summary */}
      <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
        {item.summary}
      </p>

      {/* Key points */}
      {item.keyPoints.length > 0 && (
        <ul className="space-y-1.5">
          {item.keyPoints.map((point, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-surface-200 pl-3 border-l-2 border-accent-500/30"
            >
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Bottom actions */}
      <div className="flex items-center justify-between pt-1">
        {safeSourceUrl ? (
          <a
            href={safeSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-surface-400 hover:text-surface-200 transition-colors inline-flex items-center gap-1"
          >
            원문 보기
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        ) : (
          <span />
        )}
        {hasQuiz && (
          <Link
            href={`/daily-feed/${item.id}`}
            className="text-sm font-medium text-accent-400 hover:text-accent-300 transition-colors inline-flex items-center gap-1"
          >
            퀴즈 풀기
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </article>
  );
}
