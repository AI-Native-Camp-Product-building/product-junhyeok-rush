"use client";

import { useState, useMemo } from "react";
import type { CodeReadingTask } from "@/lib/types";
import CodeBlock from "@/components/ui/CodeBlock";

interface CodeReadingExecuteProps {
  content: CodeReadingTask;
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

export default function CodeReadingExecute({
  content,
  onComplete,
}: CodeReadingExecuteProps) {
  const options = useMemo(
    () => shuffleArray([content.answer, ...content.distractors]),
    [content.answer, content.distractors]
  );

  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selected === content.answer;

  const handleSelect = (option: string) => {
    if (submitted) return;
    setSelected(option);
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <CodeBlock code={content.code} language="typescript" />

      <p className="text-surface-200 font-medium">{content.question}</p>

      <div className="space-y-3">
        {options.map((option) => {
          let style = "border-surface-700 bg-surface-800 hover:border-surface-500";
          if (submitted) {
            if (option === content.answer) {
              style = "border-streak-400 bg-streak-400/10 text-streak-400";
            } else if (option === selected) {
              style = "border-error-500 bg-error-500/10 text-error-400";
            } else {
              style = "border-surface-700 bg-surface-800 opacity-50";
            }
          }

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={submitted}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${style} ${
                !submitted ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <span className="text-surface-200">{option}</span>
            </button>
          );
        })}
      </div>

      {submitted && (
        <div className="space-y-4">
          <p
            className={`text-sm font-semibold ${
              isCorrect ? "text-streak-400" : "text-reward-400"
            }`}
          >
            {isCorrect ? "정답입니다!" : "다시 생각해보세요"}
          </p>
          <div className="flex justify-end">
            <button
              onClick={() => onComplete(isCorrect ? 1 : 0)}
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
