"use client";

interface FeedHeaderProps {
  date: string;
  itemCount: number;
  className?: string;
}

export default function FeedHeader({ date, itemCount, className = "" }: FeedHeaderProps) {
  const formatted = new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="font-mono text-accent-400 text-sm select-none">&gt;_</span>
        <h1 className="text-2xl font-bold text-surface-50">오늘의 피드</h1>
      </div>
      <div className="flex items-center gap-3 text-sm text-surface-400">
        <span>{formatted}</span>
        <span className="w-1 h-1 rounded-full bg-surface-600" />
        <span>
          <span className="text-accent-400 font-semibold tabular-nums">{itemCount}</span>개 아이템
        </span>
      </div>
    </div>
  );
}
