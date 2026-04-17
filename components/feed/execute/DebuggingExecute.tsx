"use client";

import { useState } from "react";
import type { DebuggingTask } from "@/lib/types";
import CodeBlock from "@/components/ui/CodeBlock";

interface DebuggingExecuteProps {
  content: DebuggingTask;
  onComplete: (score: number) => void;
}

export default function DebuggingExecute({
  content,
  onComplete,
}: DebuggingExecuteProps) {
  const [showCorrect, setShowCorrect] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswer = (correct: boolean) => {
    setIsCorrect(correct);
    setAnswered(true);
    if (correct) {
      setShowCorrect(true);
    }
  };

  const revealHint = () => {
    if (revealedHints < content.hints.length) {
      setRevealedHints((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-3">
          버그가 있는 코드
        </h4>
        <CodeBlock code={content.buggyCode} language="typescript" />
      </div>

      <div className="bg-surface-800 border border-surface-700 rounded-lg p-4">
        <p className="text-sm text-surface-200 leading-relaxed">
          <span className="font-semibold text-spark-400">버그 설명: </span>
          {content.bugDescription}
        </p>
      </div>

      {/* Hints */}
      {content.hints.length > 0 && (
        <div className="space-y-2">
          {content.hints.slice(0, revealedHints).map((hint, i) => (
            <div
              key={i}
              className="bg-surface-800 border border-surface-700 rounded-lg px-4 py-2 text-sm text-surface-200"
            >
              <span className="text-accent-400 font-semibold">
                힌트 {i + 1}:{" "}
              </span>
              {hint}
            </div>
          ))}
          {!answered && revealedHints < content.hints.length && (
            <button
              onClick={revealHint}
              className="text-sm text-accent-400 hover:text-accent-300 transition-colors"
            >
              힌트 보기 ({revealedHints}/{content.hints.length})
            </button>
          )}
        </div>
      )}

      {/* Answer buttons */}
      {!answered && (
        <div className="space-y-3">
          <p className="text-sm text-surface-200 font-medium">
            이 버그를 찾을 수 있나요?
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleAnswer(true)}
              className="px-4 py-2 rounded-lg bg-streak-500 hover:bg-streak-600 text-white text-sm font-medium transition-colors"
            >
              버그를 찾았어요
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="px-4 py-2 rounded-lg border border-surface-700 text-surface-200 hover:border-surface-500 text-sm transition-colors"
            >
              모르겠어요
            </button>
          </div>
        </div>
      )}

      {/* Result */}
      {answered && (
        <div className="space-y-4">
          <p
            className={`text-sm font-semibold ${
              isCorrect ? "text-streak-400" : "text-reward-400"
            }`}
          >
            {isCorrect ? "정답입니다!" : "다시 생각해보세요"}
          </p>

          {/* Show corrected code */}
          <div>
            <h4 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-3">
              수정된 코드
            </h4>
            <CodeBlock code={content.correctCode} language="typescript" />
          </div>

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
