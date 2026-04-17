"use client";

import { useState, useMemo } from "react";
import type { SequenceOrderingTask } from "@/lib/types";

interface SequenceOrderingExecuteProps {
  content: SequenceOrderingTask;
  onComplete: (score: number) => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function SequenceOrderingExecute({
  content,
  onComplete,
}: SequenceOrderingExecuteProps) {
  const [items, setItems] = useState<string[]>(() =>
    shuffleArray(content.items)
  );
  const [submitted, setSubmitted] = useState(false);

  const moveUp = (idx: number) => {
    if (submitted || idx === 0) return;
    setItems((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  };

  const moveDown = (idx: number) => {
    if (submitted || idx === items.length - 1) return;
    setItems((prev) => {
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  };

  const correctCount = items.reduce(
    (acc, item, idx) => acc + (item === content.items[idx] ? 1 : 0),
    0
  );
  const score = correctCount / content.items.length;

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <p className="text-surface-200 text-sm">{content.instructions}</p>

      <div className="space-y-2">
        {items.map((item, idx) => {
          let itemStyle = "border-surface-700 bg-surface-800";
          if (submitted) {
            if (item === content.items[idx]) {
              itemStyle = "border-streak-400 bg-streak-400/10";
            } else {
              itemStyle = "border-error-500 bg-error-500/10";
            }
          }

          return (
            <div
              key={`${item}-${idx}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${itemStyle}`}
            >
              {/* Position number */}
              <span className="text-xs font-mono text-surface-500 w-6 text-center">
                {idx + 1}
              </span>

              {/* Item text */}
              <span className="flex-1 text-sm text-surface-200">{item}</span>

              {/* Move buttons */}
              {!submitted && (
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-1 rounded hover:bg-surface-700 text-surface-400 hover:text-surface-200 disabled:opacity-30 disabled:cursor-default transition-colors"
                    aria-label="위로 이동"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === items.length - 1}
                    className="p-1 rounded hover:bg-surface-700 text-surface-400 hover:text-surface-200 disabled:opacity-30 disabled:cursor-default transition-colors"
                    aria-label="아래로 이동"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {/* Submitted: show correct position */}
              {submitted && item !== content.items[idx] && (
                <span className="text-xs text-surface-400">
                  (정답: {content.items.indexOf(item) + 1}번)
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit / Result */}
      {!submitted && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-lg bg-accent-500 hover:bg-accent-600 text-white font-medium transition-colors"
          >
            제출하기
          </button>
        </div>
      )}

      {submitted && (
        <div className="space-y-4">
          <p
            className={`text-sm font-semibold ${
              score === 1 ? "text-streak-400" : "text-reward-400"
            }`}
          >
            {score === 1
              ? "정답입니다!"
              : `${correctCount}/${content.items.length} 정답 - 다시 생각해보세요`}
          </p>
          <div className="flex justify-end">
            <button
              onClick={() => onComplete(score)}
              className="px-6 py-2.5 rounded-lg bg-accent-500 hover:bg-accent-600 text-white font-medium transition-colors"
            >
              계속하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
