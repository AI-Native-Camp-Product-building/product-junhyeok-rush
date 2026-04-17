"use client";

import { useState } from "react";
import { BADGES } from "@/lib/badges";

interface BadgeGridProps {
  unlockedBadges: string[];
  className?: string;
}

export default function BadgeGrid({
  unlockedBadges,
  className = "",
}: BadgeGridProps) {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const unlockedCount = BADGES.filter((b) => unlockedBadges.includes(b.id)).length;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <p className="text-sm font-semibold text-surface-200">
        <span className="text-accent-400">{unlockedCount}</span>
        <span className="text-surface-200/60">/9 달성</span>
      </p>

      <div className="grid grid-cols-3 gap-3">
        {BADGES.map((badge) => {
          const unlocked = unlockedBadges.includes(badge.id);
          return (
            <div
              key={badge.id}
              className="relative flex flex-col items-center gap-1.5"
              onMouseEnter={() => unlocked && setTooltip(badge.id)}
              onMouseLeave={() => setTooltip(null)}
            >
              {/* Badge tile */}
              <div
                className={[
                  "relative w-16 h-16 rounded-2xl flex items-center justify-center text-3xl",
                  "border transition-all duration-200",
                  unlocked
                    ? "bg-surface-800 border-accent-800/60 badge-shine"
                    : "bg-surface-800/50 border-surface-800 grayscale opacity-50",
                ].join(" ")}
              >
                {unlocked ? (
                  badge.icon
                ) : (
                  <span className="relative">
                    <span className="opacity-30">{badge.icon}</span>
                    <span className="absolute inset-0 flex items-center justify-center text-base">
                      🔒
                    </span>
                  </span>
                )}
              </div>

              {/* Name */}
              <span
                className={[
                  "text-xs text-center leading-tight max-w-[4.5rem]",
                  unlocked ? "text-surface-200" : "text-surface-800",
                ].join(" ")}
              >
                {unlocked ? badge.name : "???"}
              </span>

              {/* Tooltip */}
              {tooltip === badge.id && (
                <div className="absolute bottom-full mb-2 z-10 w-36 rounded-lg bg-surface-800 border border-accent-800/50 px-2.5 py-1.5 text-xs text-surface-100 text-center shadow-xl">
                  {badge.description}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-surface-800" />
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
