"use client";

import type { DailyFeedItem } from "@/lib/daily-feed-types";
import FeedCard from "./FeedCard";

interface FeedCardListProps {
  items: DailyFeedItem[];
  className?: string;
}

export default function FeedCardList({ items, className = "" }: FeedCardListProps) {
  // Group items by date
  const grouped = items.reduce<Record<string, DailyFeedItem[]>>((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  if (items.length === 0) {
    return (
      <div className="text-center py-16 space-y-3">
        <div className="text-4xl">📭</div>
        <p className="text-surface-400 text-sm">오늘은 새로운 콘텐츠가 없습니다</p>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {sortedDates.map((date) => {
        const dateLabel = new Date(date).toLocaleDateString("ko-KR", {
          month: "long",
          day: "numeric",
          weekday: "short",
        });

        return (
          <section key={date} className="space-y-3">
            <h2 className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
              {dateLabel}
            </h2>
            <div className="grid gap-4">
              {grouped[date].map((item) => (
                <FeedCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
