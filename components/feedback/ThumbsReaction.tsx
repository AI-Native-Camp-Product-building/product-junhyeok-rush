"use client";

import { useCallback } from "react";
import type { ContentReaction } from "@/lib/types";
import { useAppState } from "@/lib/state-context";

interface ThumbsReactionProps {
  contentId: string;
  className?: string;
}

export default function ThumbsReaction({
  contentId,
  className,
}: ThumbsReactionProps) {
  const { state, updateState } = useAppState();

  const existing = state.feedback.contentReactions.find(
    (r) => r.contentId === contentId,
  );

  const handleReact = useCallback(
    (reaction: ContentReaction["reaction"]) => {
      if (existing) return;
      updateState((prev) => ({
        ...prev,
        feedback: {
          ...prev.feedback,
          contentReactions: [
            ...prev.feedback.contentReactions,
            {
              contentId,
              reaction,
              date: new Date().toISOString(),
            },
          ],
        },
      }));
    },
    [existing, contentId, updateState],
  );

  const upSelected = existing?.reaction === "up";
  const downSelected = existing?.reaction === "down";
  const reacted = Boolean(existing);

  return (
    <div
      className={`flex items-center gap-2${className ? ` ${className}` : ""}`}
    >
      <span className="text-xs text-surface-400">도움이 됐나요?</span>
      <button
        onClick={() => handleReact("up")}
        disabled={reacted}
        aria-label="도움이 됐어요"
        className={`flex items-center justify-center w-8 h-8 rounded-lg border text-base transition-colors
          ${
            upSelected
              ? "border-accent-400 bg-accent-400/20 text-accent-400"
              : reacted
                ? "border-surface-700 bg-surface-800 text-surface-600 cursor-default"
                : "border-surface-700 bg-surface-800 text-surface-400 hover:border-accent-400 hover:text-accent-400 cursor-pointer"
          }`}
      >
        👍
      </button>
      <button
        onClick={() => handleReact("down")}
        disabled={reacted}
        aria-label="도움이 안 됐어요"
        className={`flex items-center justify-center w-8 h-8 rounded-lg border text-base transition-colors
          ${
            downSelected
              ? "border-streak-400 bg-streak-400/20 text-streak-400"
              : reacted
                ? "border-surface-700 bg-surface-800 text-surface-600 cursor-default"
                : "border-surface-700 bg-surface-800 text-surface-400 hover:border-streak-400 hover:text-streak-400 cursor-pointer"
          }`}
      >
        👎
      </button>
    </div>
  );
}
