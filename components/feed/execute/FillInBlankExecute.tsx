"use client";

import { useState } from "react";
import type { FillInBlankTask } from "@/lib/types";

interface FillInBlankExecuteProps {
  content: FillInBlankTask;
  onComplete: (score: number) => void;
}

export default function FillInBlankExecute({
  content,
  onComplete,
}: FillInBlankExecuteProps) {
  const [selections, setSelections] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (position: number, value: string) => {
    if (submitted) return;
    setSelections((prev) => ({ ...prev, [position]: value }));
  };

  const allFilled = content.blanks.every(
    (blank) => selections[blank.position] !== undefined && selections[blank.position] !== ""
  );

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const correctCount = content.blanks.reduce((acc, blank) => {
    return acc + (selections[blank.position] === blank.correct ? 1 : 0);
  }, 0);
  const score = correctCount / content.blanks.length;

  // Build the code display with blanks replaced by dropdowns
  const renderTemplate = () => {
    const parts: { text: string; blankIndex: number | null }[] = [];
    let lastEnd = 0;

    // Sort blanks by position
    const sorted = [...content.blanks].sort((a, b) => a.position - b.position);

    for (const blank of sorted) {
      if (blank.position > lastEnd) {
        parts.push({
          text: content.codeTemplate.slice(lastEnd, blank.position),
          blankIndex: null,
        });
      }
      parts.push({ text: "", blankIndex: sorted.indexOf(blank) });
      // Advance past a placeholder marker (e.g., "___")
      const marker = content.codeTemplate.indexOf("___", blank.position);
      lastEnd =
        marker !== -1 && marker === blank.position ? marker + 3 : blank.position;
    }

    if (lastEnd < content.codeTemplate.length) {
      parts.push({
        text: content.codeTemplate.slice(lastEnd),
        blankIndex: null,
      });
    }

    return parts;
  };

  const parts = renderTemplate();

  return (
    <div className="space-y-6">
      {/* Code template with blanks */}
      <div className="bg-surface-900 border border-surface-700 rounded-lg p-4 overflow-x-auto">
        <pre className="font-mono text-sm text-surface-200 whitespace-pre-wrap leading-relaxed">
          {parts.map((part, i) => {
            if (part.blankIndex !== null) {
              const blank = content.blanks[part.blankIndex];
              const selected = selections[blank.position] ?? "";
              const isCorrectAnswer =
                submitted && selected === blank.correct;
              const isWrongAnswer =
                submitted && selected !== blank.correct && selected !== "";

              return (
                <select
                  key={`blank-${i}`}
                  value={selected}
                  onChange={(e) =>
                    handleChange(blank.position, e.target.value)
                  }
                  disabled={submitted}
                  className={`inline-block mx-1 px-2 py-1 rounded text-sm font-mono border transition-colors ${
                    isCorrectAnswer
                      ? "border-streak-400 bg-streak-400/10 text-streak-400"
                      : isWrongAnswer
                        ? "border-error-500 bg-error-500/10 text-error-400"
                        : "border-accent-400 bg-surface-800 text-surface-200"
                  }`}
                >
                  <option value="">___</option>
                  {blank.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              );
            }
            return <span key={`text-${i}`}>{part.text}</span>;
          })}
        </pre>
      </div>

      {/* Show correct answers if wrong */}
      {submitted &&
        content.blanks.some(
          (blank) => selections[blank.position] !== blank.correct
        ) && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
              정답
            </p>
            {content.blanks.map((blank, i) => (
              <div
                key={i}
                className={`text-sm px-3 py-1 rounded ${
                  selections[blank.position] === blank.correct
                    ? "text-streak-400"
                    : "text-reward-400"
                }`}
              >
                빈칸 {i + 1}: <span className="font-mono">{blank.correct}</span>
              </div>
            ))}
          </div>
        )}

      {/* Submit / Result */}
      {!submitted && allFilled && (
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
              : `${correctCount}/${content.blanks.length} 정답 - 다시 생각해보세요`}
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
