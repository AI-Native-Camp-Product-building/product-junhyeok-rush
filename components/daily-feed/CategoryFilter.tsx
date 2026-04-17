"use client";

import type { FeedCategory } from "@/lib/daily-feed-types";

type FilterOption = "all" | FeedCategory;

const FILTER_OPTIONS: { key: FilterOption; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "update", label: "업데이트" },
  { key: "workflow", label: "워크플로우" },
  { key: "methodology", label: "방법론" },
  { key: "tool", label: "도구" },
];

interface CategoryFilterProps {
  active: FilterOption;
  onChange: (filter: FilterOption) => void;
  className?: string;
}

export default function CategoryFilter({ active, onChange, className = "" }: CategoryFilterProps) {
  return (
    <div className={`flex gap-2 overflow-x-auto pb-1 ${className}`}>
      {FILTER_OPTIONS.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            active === opt.key
              ? "bg-accent-500 text-white shadow-sm shadow-accent-500/25"
              : "bg-surface-800 text-surface-300 hover:bg-surface-700 hover:text-surface-200"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export type { FilterOption };
