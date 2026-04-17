"use client";

import { useState, useEffect, useCallback } from "react";

interface TimerProps {
  initialSeconds: number;
  onComplete: () => void;
  className?: string;
}

export default function Timer({ initialSeconds, onComplete, className = "" }: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [running, setRunning] = useState(true);

  const handleComplete = useCallback(onComplete, [onComplete]);

  useEffect(() => {
    if (!running) return;
    if (secondsLeft <= 0) {
      handleComplete();
      return;
    }
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, secondsLeft, handleComplete]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const nearEnd = secondsLeft < 60 && secondsLeft > 0;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <span
        className={`font-mono text-3xl font-medium text-accent-400 tabular-nums ${nearEnd ? "animate-pulse" : ""}`}
        aria-live="polite"
        aria-label={`남은 시간 ${minutes}분 ${seconds}초`}
      >
        {display}
      </span>
      <button
        onClick={() => setRunning((r) => !r)}
        aria-label={running ? "타이머 일시정지" : "타이머 재개"}
        className="px-3 py-1 rounded-md text-sm bg-surface-800 border border-surface-700 text-surface-200 hover:border-surface-600 transition-colors"
      >
        {running ? "일시정지" : "재개"}
      </button>
    </div>
  );
}
