"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import type { QuizQuestion as QuizQuestionType } from "@/lib/types";
import { useAppState } from "@/lib/state-context";

interface QuizQuestionProps {
  questions: QuizQuestionType[];
  onComplete: (score: number, total: number) => void;
  topicId: string;
  dayId: string;
  blockId: string;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function QuizQuestion({
  questions,
  onComplete,
  topicId,
  dayId,
  blockId,
}: QuizQuestionProps) {
  const { updateState } = useAppState();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const questionStartRef = useRef<number>(Date.now());

  // Shuffle options per question, memoized for the full set
  const shuffledOptions = useMemo(
    () =>
      questions.map((q) => shuffleArray([q.answer, ...q.distractors])),
    [questions]
  );

  const current = questions[currentIndex];
  const options = shuffledOptions[currentIndex];
  const isCorrect = selected === current.answer;
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSelect = useCallback(
    (option: string) => {
      if (answered) return;

      const timeMs = Date.now() - questionStartRef.current;
      const correct = option === current.answer;

      setSelected(option);
      setAnswered(true);

      if (correct) {
        setCorrectCount((prev) => prev + 1);
      }

      // Record quiz response
      updateState((prev) => ({
        ...prev,
        feedback: {
          ...prev.feedback,
          quizResponses: [
            ...prev.feedback.quizResponses,
            {
              date: new Date().toISOString(),
              dayId,
              blockId,
              topicId,
              correct,
              timeMs,
            },
          ],
        },
      }));
    },
    [answered, current.answer, updateState, dayId, blockId, topicId]
  );

  const handleNext = () => {
    if (isLastQuestion) {
      const finalCorrect = correctCount;
      setShowSummary(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelected(null);
    setAnswered(false);
    setRevealedHints(0);
    questionStartRef.current = Date.now();
  };

  const revealHint = () => {
    if (revealedHints < current.hints.length) {
      setRevealedHints((prev) => prev + 1);
    }
  };

  // Summary screen
  if (showSummary) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4 py-8">
          <div className="text-4xl font-bold text-accent-400">
            {correctCount}/{questions.length}
          </div>
          <p className="text-surface-200 text-lg">
            {correctCount === questions.length
              ? "완벽합니다!"
              : correctCount >= questions.length / 2
                ? "잘 하셨습니다!"
                : "다음에 더 잘할 수 있어요!"}
          </p>

          {/* Per-question breakdown */}
          <div className="flex justify-center gap-2 mt-4">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < correctCount ? "bg-streak-400" : "bg-error-500"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => onComplete(correctCount, questions.length)}
            className="px-6 py-2.5 rounded-lg bg-accent-500 hover:bg-accent-600 text-white font-medium transition-colors"
          >
            계속하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-surface-400">
          {currentIndex + 1}/{questions.length}
        </span>
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentIndex
                  ? "bg-accent-400"
                  : i < currentIndex
                    ? "bg-accent-600"
                    : "bg-surface-700"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <p className="text-surface-100 font-medium text-lg leading-relaxed">
        {current.question}
      </p>

      {/* Hints */}
      {current.hints.length > 0 && !answered && (
        <div className="space-y-2">
          {current.hints.slice(0, revealedHints).map((hint, i) => (
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
          {revealedHints < current.hints.length && (
            <button
              onClick={revealHint}
              className="text-sm text-accent-400 hover:text-accent-300 transition-colors"
            >
              힌트 보기 ({revealedHints}/{current.hints.length})
            </button>
          )}
        </div>
      )}

      {/* Options */}
      <div className="space-y-3">
        {options.map((option) => {
          let style =
            "border-surface-700 bg-surface-800 hover:border-surface-500";
          if (answered) {
            if (option === current.answer) {
              style = "border-streak-400 bg-streak-400/10";
            } else if (option === selected) {
              style = "border-error-500 bg-error-500/10";
            } else {
              style = "border-surface-700 bg-surface-800 opacity-50";
            }
          }

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={answered}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${style} ${
                !answered ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <span className="text-surface-200">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback + Next */}
      {answered && (
        <div className="space-y-4">
          <p
            className={`text-sm font-semibold ${
              isCorrect ? "text-streak-400" : "text-reward-400"
            }`}
          >
            {isCorrect ? "정답!" : `오답 - 정답: ${current.answer}`}
          </p>
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-lg bg-accent-500 hover:bg-accent-600 text-white font-medium transition-colors"
            >
              {isLastQuestion ? "결과 보기" : "다음 문제"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
