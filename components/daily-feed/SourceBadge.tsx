"use client";

import type { SourceType } from "@/lib/daily-feed-types";

const SOURCE_CONFIG: Record<SourceType, { label: string; icon: string; color: string }> = {
  x: {
    label: "X",
    icon: "𝕏",
    color: "bg-surface-800 text-surface-200",
  },
  linkedin: {
    label: "LinkedIn",
    icon: "in",
    color: "bg-code-500/15 text-code-400",
  },
  youtube: {
    label: "YouTube",
    icon: "▶",
    color: "bg-error-500/15 text-error-400",
  },
  rss: {
    label: "RSS",
    icon: "◉",
    color: "bg-spark-500/15 text-spark-400",
  },
  other: {
    label: "기타",
    icon: "◇",
    color: "bg-surface-800 text-surface-300",
  },
};

interface SourceBadgeProps {
  sourceType: SourceType;
  sourceName: string;
  className?: string;
}

export default function SourceBadge({ sourceType, sourceName, className = "" }: SourceBadgeProps) {
  const config = SOURCE_CONFIG[sourceType];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${config.color} ${className}`}
    >
      <span className="font-mono text-[10px] leading-none">{config.icon}</span>
      <span className="truncate max-w-[120px]">{sourceName}</span>
    </span>
  );
}
