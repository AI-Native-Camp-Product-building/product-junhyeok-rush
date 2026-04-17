"use client";

interface ProgressBarProps {
  value: number;
  label?: string;
  color?: "accent" | "spark" | "streak";
  size?: "sm" | "default";
  trackColor?: "surface-800" | "surface-900";
  className?: string;
}

const colorMap: Record<NonNullable<ProgressBarProps["color"]>, string> = {
  accent: "bg-accent-400",
  spark: "bg-spark-400",
  streak: "bg-streak-400",
};

const trackColorMap: Record<
  NonNullable<ProgressBarProps["trackColor"]>,
  string
> = {
  "surface-800": "bg-surface-800",
  "surface-900": "bg-surface-900",
};

export default function ProgressBar({
  value,
  label,
  color = "accent",
  size = "default",
  trackColor = "surface-800",
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const heightClass = size === "sm" ? "h-1.5" : "h-2";

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <p className="mb-1 text-sm text-surface-200">{label}</p>
      )}
      <div
        className={`w-full ${heightClass} rounded-full ${trackColorMap[trackColor]} overflow-hidden`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "진행률"}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorMap[color]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
