"use client";

import { useMemo, useState } from "react";
import type { HistoryEntry } from "@/lib/types";

interface HeatmapCalendarProps {
  history: HistoryEntry[];
  className?: string;
}

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function getIntensityClass(minutes: number): string {
  if (minutes === 0) return "bg-surface-800";
  if (minutes <= 15) return "bg-accent-900";
  if (minutes <= 30) return "bg-accent-700";
  if (minutes <= 60) return "bg-accent-500";
  return "bg-accent-300";
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function HeatmapCalendar({
  history,
  className = "",
}: HeatmapCalendarProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const minutesByDate = useMemo(() => {
    const map: Record<string, number> = {};
    for (const entry of history) {
      map[entry.date] = (map[entry.date] ?? 0) + entry.duration;
    }
    return map;
  }, [history]);

  const days = useMemo(() => {
    const result: { date: Date; dateStr: string }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      result.push({ date: d, dateStr: formatDate(d) });
    }
    return result;
  }, []);

  const todayStr = formatDate(new Date());

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex gap-1.5">
        {days.map(({ date, dateStr }) => {
          const minutes = minutesByDate[dateStr] ?? 0;
          const isToday = dateStr === todayStr;
          const isHovered = hoveredDate === dateStr;

          return (
            <div key={dateStr} className="relative flex flex-col items-center gap-1">
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute bottom-full mb-1.5 z-10 whitespace-nowrap rounded-md bg-surface-800 border border-surface-800/80 px-2 py-1 text-xs text-surface-100 shadow-lg">
                  {dateStr}
                  {minutes > 0 && (
                    <span className="ml-1 text-accent-400">{minutes}분</span>
                  )}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-surface-800" />
                </div>
              )}

              {/* Cell */}
              <div
                className={[
                  "w-7 h-7 rounded-md cursor-default transition-opacity duration-150",
                  getIntensityClass(minutes),
                  isToday ? "ring-2 ring-accent-400 ring-offset-1 ring-offset-surface-900" : "",
                  isHovered ? "opacity-80" : "",
                ].join(" ")}
                onMouseEnter={() => setHoveredDate(dateStr)}
                onMouseLeave={() => setHoveredDate(null)}
              />

              {/* Day label */}
              <span className="text-[10px] text-surface-200/50">
                {DAY_LABELS[date.getDay()]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
