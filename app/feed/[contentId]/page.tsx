"use client";

import { use, useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/state-context";
import { getFeedItem } from "@/lib/feed-loader";
import { calculateStreak } from "@/lib/streak";
import { checkBadges } from "@/lib/badges";

import BlockProgress from "@/components/feed/BlockProgress";
import ExplainCard from "@/components/feed/ExplainCard";
import ExecuteTask from "@/components/feed/ExecuteTask";
import QuizQuestion from "@/components/feed/QuizQuestion";
import CelebrationAnimation from "@/components/gamification/CelebrationAnimation";

type Phase = "explain" | "execute" | "quiz" | "complete";

export default function ContentPage({
  params,
}: {
  params: Promise<{ contentId: string }>;
}) {
  const { contentId } = use(params);
  const router = useRouter();
  const { state, updateState } = useAppState();

  const [blockIndex, setBlockIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("explain");
  const [executeScore, setExecuteScore] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [allBlocksDone, setAllBlocksDone] = useState(false);

  const startTimeRef = useRef<number>(Date.now());

  const feedItem = getFeedItem(contentId);
  const block = feedItem?.blocks[blockIndex];

  // Mark item as in_progress on mount
  useEffect(() => {
    if (!feedItem) return;
    updateState((prev) => {
      const itemProgress = prev.feed.items[contentId];
      if (itemProgress?.status === "completed") return prev;
      return {
        ...prev,
        feed: {
          ...prev.feed,
          items: {
            ...prev.feed.items,
            [contentId]: itemProgress ?? {
              status: "in_progress" as const,
              blocks: {},
              completedAt: null,
            },
          },
        },
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId]);

  const handleExplainComplete = useCallback(() => {
    setPhase("execute");
  }, []);

  const handleExplainSkip = useCallback(() => {
    setPhase("execute");
  }, []);

  const handleExecuteComplete = useCallback((score: number) => {
    setExecuteScore(score);
    setPhase("quiz");
  }, []);

  const handleQuizComplete = useCallback(
    (score: number, total: number) => {
      setQuizScore(score);
      setQuizTotal(total);

      if (!feedItem || !block) return;

      const timeSpentSeconds = Math.round(
        (Date.now() - startTimeRef.current) / 1000
      );
      const timeSpentMinutes = Math.round(timeSpentSeconds / 60);

      updateState((prev) => {
        const itemProgress = prev.feed.items[contentId] ?? {
          status: "in_progress" as const,
          blocks: {},
          completedAt: null,
        };

        const updatedBlock = {
          status: "completed" as const,
          explainSkipped: false,
          executeScore: score,
          quizScore: score,
          timeSpentSeconds,
        };

        const updatedBlocks = {
          ...itemProgress.blocks,
          [block.id]: updatedBlock,
        };

        // Check if all blocks in this feed item are completed
        const itemComplete =
          feedItem.blocks.length > 0 &&
          feedItem.blocks.every(
            (b) => updatedBlocks[b.id]?.status === "completed"
          );

        const updatedItemProgress = {
          ...itemProgress,
          blocks: updatedBlocks,
          status: itemComplete
            ? ("completed" as const)
            : ("in_progress" as const),
          completedAt: itemComplete
            ? new Date().toISOString()
            : itemProgress.completedAt,
        };

        // Calculate streak
        const updatedStreak = calculateStreak(prev.streak);

        // Build history entry
        const historyEntry = {
          date: new Date().toISOString(),
          dayId: contentId,
          duration: timeSpentMinutes,
          quizScore: score,
          quizTotal: total,
        };

        const nextState = {
          ...prev,
          feed: {
            ...prev.feed,
            items: {
              ...prev.feed.items,
              [contentId]: updatedItemProgress,
            },
          },
          streak: updatedStreak,
          totalStudyMinutes: prev.totalStudyMinutes + timeSpentMinutes,
          totalSessions: prev.totalSessions + 1,
          history: [...prev.history, historyEntry],
        };

        // Check for new badges
        const earned = checkBadges(nextState);
        if (earned.length > 0) {
          nextState.badges = [...nextState.badges, ...earned];
          setTimeout(() => {
            setNewBadges(earned);
            setShowCelebration(true);
          }, 0);
        }

        if (itemComplete) {
          setTimeout(() => setAllBlocksDone(true), 0);
        }

        return nextState;
      });

      setPhase("complete");
    },
    [contentId, feedItem, block, updateState]
  );

  const handleNextBlock = useCallback(() => {
    if (!feedItem) return;
    if (blockIndex < feedItem.blocks.length - 1) {
      setBlockIndex((prev) => prev + 1);
      setPhase("explain");
      setExecuteScore(0);
      setQuizScore(0);
      setQuizTotal(0);
      startTimeRef.current = Date.now();
    }
  }, [feedItem, blockIndex]);

  const isLastBlock = feedItem
    ? blockIndex === feedItem.blocks.length - 1
    : true;

  // Error state
  if (!feedItem || !block) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-surface-400 text-lg">
          존재하지 않는 콘텐츠입니다.
        </p>
        <button
          onClick={() => router.push("/feed")}
          className="text-accent-400 hover:text-accent-300 text-sm transition-colors"
        >
          피드로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header: block progress + block counter + timer */}
      <div className="flex items-center justify-between">
        <BlockProgress
          currentPhase={phase === "complete" ? "quiz" : phase}
        />
        <div className="flex items-center gap-3">
          {feedItem.blocks.length > 1 && (
            <span className="text-xs text-surface-500 tabular-nums">
              블록 {blockIndex + 1}/{feedItem.blocks.length}
            </span>
          )}
          <div className="text-sm text-surface-400 tabular-nums">
            {Math.round((Date.now() - startTimeRef.current) / 60000) || 0}분
            경과
          </div>
        </div>
      </div>

      {/* Content title + block title */}
      <div className="space-y-1">
        <p className="text-xs font-semibold text-accent-400 uppercase tracking-wider">
          {feedItem.title}
        </p>
        <h2 className="text-2xl font-bold text-surface-50">{block.title}</h2>
      </div>

      {/* Phase content */}
      <div className="rounded-xl border border-surface-800 bg-surface-900/40 p-6">
        {phase === "explain" && (
          <ExplainCard
            content={block.explain}
            onComplete={handleExplainComplete}
            onSkip={handleExplainSkip}
            blockId={block.id}
          />
        )}

        {phase === "execute" && (
          <div className="space-y-4">
            <ExecuteTask
              content={block.execute}
              onComplete={handleExecuteComplete}
            />
            <button
              onClick={() => handleExecuteComplete(0)}
              className="block mx-auto text-xs text-surface-500 hover:text-surface-300 transition-colors"
            >
              건너뛰기
            </button>
          </div>
        )}

        {phase === "quiz" && (
          <div className="space-y-4">
            <QuizQuestion
              questions={block.quiz.questions}
              onComplete={handleQuizComplete}
              topicId={block.topicId}
              dayId={contentId}
              blockId={block.id}
            />
            <button
              onClick={() =>
                handleQuizComplete(0, block.quiz.questions.length)
              }
              className="block mx-auto text-xs text-surface-500 hover:text-surface-300 transition-colors"
            >
              건너뛰기
            </button>
          </div>
        )}

        {phase === "complete" && (
          <div className="space-y-8">
            {/* Results */}
            <div className="text-center space-y-4 py-4">
              <div className="text-5xl font-bold text-accent-400">
                {allBlocksDone ? "학습 완료!" : "블록 완료!"}
              </div>
              <p className="text-surface-300">학습 결과를 확인하세요</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-surface-700 bg-surface-800/50 p-4 text-center">
                <p className="text-xs text-surface-400 mb-1">실습 점수</p>
                <p className="text-2xl font-bold text-spark-400">
                  {executeScore}
                </p>
              </div>
              <div className="rounded-xl border border-surface-700 bg-surface-800/50 p-4 text-center">
                <p className="text-xs text-surface-400 mb-1">퀴즈 점수</p>
                <p className="text-2xl font-bold text-accent-400">
                  {quizScore}/{quizTotal}
                </p>
              </div>
            </div>

            {/* New badges */}
            {newBadges.length > 0 && (
              <div className="text-center space-y-2">
                <p className="text-sm text-streak-400 font-semibold">
                  새로운 뱃지를 획득했습니다!
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-center gap-3 pt-2">
              {isLastBlock || allBlocksDone ? (
                <>
                  <button
                    onClick={() => router.push("/feed")}
                    className="px-6 py-3 rounded-xl border border-surface-700 text-surface-200 hover:border-surface-500 font-medium transition-colors"
                  >
                    피드로 돌아가기
                  </button>
                  <button
                    onClick={() => router.push("/feed")}
                    className="px-6 py-3 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-semibold transition-colors"
                  >
                    다음 추천 보기
                  </button>
                </>
              ) : (
                <button
                  onClick={handleNextBlock}
                  className="px-8 py-3 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-semibold transition-colors"
                >
                  다음 블록으로
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Celebration animation */}
      <CelebrationAnimation
        show={showCelebration}
        type={newBadges.length > 0 ? "badge" : "confetti"}
        onComplete={() => setShowCelebration(false)}
      />
    </div>
  );
}
