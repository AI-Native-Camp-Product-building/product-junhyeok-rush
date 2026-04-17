"use client";

interface StreakCounterProps {
  current: number;
  longest: number;
  className?: string;
}

export default function StreakCounter({
  current,
  longest,
  className = "",
}: StreakCounterProps) {
  const isActive = current > 0;
  const hasGlow = current >= 7;

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div
        className={[
          "text-6xl font-bold tabular-nums transition-colors duration-300",
          isActive ? "text-accent-400" : "text-surface-800",
          isActive ? "animate-streak-pulse" : "",
          hasGlow ? "streak-glow" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span>{current}</span>
        <span className="ml-1 text-5xl">🔥</span>
      </div>
      <p className="text-sm text-surface-200 tracking-wide">현재 연속</p>
      <p className="text-xs text-surface-200/60 mt-0.5">
        최장 기록: <span className="font-semibold text-surface-200">{longest}일</span>
      </p>

    </div>
  );
}
