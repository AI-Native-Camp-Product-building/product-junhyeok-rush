"use client";

import { useState, useMemo } from "react";
import type { ConceptMatchingTask } from "@/lib/types";

interface ConceptMatchingExecuteProps {
  content: ConceptMatchingTask;
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

export default function ConceptMatchingExecute({
  content,
  onComplete,
}: ConceptMatchingExecuteProps) {
  const leftItems = content.pairs.map((p) => p.left);
  const shuffledRight = useMemo(
    () => shuffleArray(content.pairs.map((p) => p.right)),
    [content.pairs]
  );

  // matches[leftIndex] = rightValue or null
  const [matches, setMatches] = useState<(string | null)[]>(
    () => new Array(content.pairs.length).fill(null)
  );
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleLeftClick = (idx: number) => {
    if (submitted) return;
    setSelectedLeft(idx);
  };

  const handleRightClick = (rightValue: string) => {
    if (submitted || selectedLeft === null) return;

    setMatches((prev) => {
      const next = [...prev];
      // Remove this right value from any other slot
      for (let i = 0; i < next.length; i++) {
        if (next[i] === rightValue) next[i] = null;
      }
      next[selectedLeft] = rightValue;
      return next;
    });
    setSelectedLeft(null);
  };

  const allMatched = matches.every((m) => m !== null);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const correctCount = matches.reduce((acc, match, idx) => {
    return acc + (match === content.pairs[idx].right ? 1 : 0);
  }, 0);
  const score = correctCount / content.pairs.length;

  const usedRight = new Set(matches.filter(Boolean));

  return (
    <div className="space-y-6">
      <p className="text-surface-200 text-sm">{content.instructions}</p>

      <div className="grid grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
            개념
          </p>
          {leftItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleLeftClick(idx)}
              disabled={submitted}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                selectedLeft === idx
                  ? "border-accent-400 bg-accent-400/10"
                  : matches[idx]
                    ? submitted
                      ? matches[idx] === content.pairs[idx].right
                        ? "border-streak-400 bg-streak-400/10"
                        : "border-error-500 bg-error-500/10"
                      : "border-accent-500/50 bg-surface-800"
                    : "border-surface-700 bg-surface-800 hover:border-surface-500"
              }`}
            >
              <span className="text-surface-200">{item}</span>
              {matches[idx] && (
                <span className="block mt-1 text-xs text-accent-400">
                  &rarr; {matches[idx]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Right column */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
            설명
          </p>
          {shuffledRight.map((item) => (
            <button
              key={item}
              onClick={() => handleRightClick(item)}
              disabled={submitted || selectedLeft === null}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                usedRight.has(item)
                  ? "border-surface-700 bg-surface-800 opacity-40"
                  : selectedLeft !== null
                    ? "border-surface-700 bg-surface-800 hover:border-accent-400 cursor-pointer"
                    : "border-surface-700 bg-surface-800"
              }`}
            >
              <span className="text-surface-200">{item}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Submit / Result */}
      {!submitted && allMatched && (
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
              : `${correctCount}/${content.pairs.length} 정답 - 다시 생각해보세요`}
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
