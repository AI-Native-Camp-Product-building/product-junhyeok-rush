"use client";

const STEPS = [
  { key: "explain", label: "EXPLAIN" },
  { key: "execute", label: "EXECUTE" },
  { key: "quiz", label: "QUIZ" },
] as const;

type Phase = "explain" | "execute" | "quiz";

interface BlockProgressProps {
  currentPhase: Phase;
  className?: string;
}

function getStepStatus(
  stepIndex: number,
  currentIndex: number
): "completed" | "current" | "future" {
  if (stepIndex < currentIndex) return "completed";
  if (stepIndex === currentIndex) return "current";
  return "future";
}

export default function BlockProgress({
  currentPhase,
  className = "",
}: BlockProgressProps) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentPhase);

  return (
    <div className={`flex items-center gap-0 ${className}`}>
      {STEPS.map((step, i) => {
        const status = getStepStatus(i, currentIndex);

        return (
          <div key={step.key} className="flex items-center">
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  status === "completed"
                    ? "bg-accent-500 text-white"
                    : status === "current"
                      ? "bg-accent-400 text-surface-900 ring-2 ring-accent-400/40"
                      : "bg-surface-800 text-surface-500 border border-surface-700"
                }`}
              >
                {status === "completed" ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-[10px] font-semibold tracking-wider ${
                  status === "completed"
                    ? "text-accent-400"
                    : status === "current"
                      ? "text-accent-300"
                      : "text-surface-500"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting line (not after last step) */}
            {i < STEPS.length - 1 && (
              <div
                className={`w-12 h-0.5 mx-2 mt-[-18px] transition-colors ${
                  i < currentIndex ? "bg-accent-500" : "bg-surface-700"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
