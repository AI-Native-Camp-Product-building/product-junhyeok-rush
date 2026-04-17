"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/state-context";
import { getFeedItems, getTodaysFeedItem } from "@/lib/feed-loader";
import { getRecommendedTopic } from "@/lib/spaced-repetition";
import type { FeedItem, FeedCategory } from "@/lib/types";
import Card from "@/components/ui/Card";
import StreakCounter from "@/components/gamification/StreakCounter";

type FilterTab = "전체" | FeedCategory;

const CATEGORY_LABELS: Record<FeedCategory, string> = {
  "claude-code": "Claude Code",
  "dev-knowledge": "개발 지식",
  basics: "기초",
};

const CATEGORY_COLORS: Record<FeedCategory, string> = {
  "claude-code": "bg-accent-500/20 text-accent-300",
  "dev-knowledge": "bg-code-500/20 text-code-300",
  basics: "bg-spark-500/20 text-spark-300",
};

function CategoryBadge({ category }: { category: FeedCategory }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[category]}`}
    >
      {CATEGORY_LABELS[category]}
    </span>
  );
}

function FeedCard({
  item,
  isCompleted,
  onClick,
}: {
  item: FeedItem;
  isCompleted: boolean;
  onClick: () => void;
}) {
  const estimatedMinutes = item.blocks.length * 5;

  return (
    <Card hover onClick={onClick}>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CategoryBadge category={item.category} />
              <span className="text-xs text-surface-500">{item.date}</span>
              {isCompleted && (
                <span className="text-xs text-streak-400 font-medium">
                  완료
                </span>
              )}
            </div>
            <h3 className="text-base font-semibold text-surface-100 line-clamp-2">
              {item.title}
            </h3>
            <p className="text-sm text-surface-400 line-clamp-2">
              {item.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-surface-500">
          <span>
            {item.blocks.length}개 블록 · ~{estimatedMinutes}분
          </span>
          {isCompleted ? (
            <span className="text-streak-400">다시 학습하기</span>
          ) : (
            <span className="text-accent-400">학습 시작</span>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function FeedPage() {
  const router = useRouter();
  const { state } = useAppState();
  const [activeFilter, setActiveFilter] = useState<FilterTab>("전체");

  const allItems = getFeedItems();
  const todaysItem = getTodaysFeedItem();
  const recommendedTopicId = getRecommendedTopic(state);

  // Find feed item that contains the recommended topic
  const recommendedItem = recommendedTopicId
    ? allItems.find((item) =>
        item.blocks.some((b) => b.topicId === recommendedTopicId)
      )
    : null;

  // Filter items by category
  const filteredItems =
    activeFilter === "전체"
      ? allItems
      : allItems.filter((item) => item.category === activeFilter);

  const isItemCompleted = (itemId: string) =>
    state.feed.items[itemId]?.status === "completed";

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: "전체", label: "전체" },
    { key: "claude-code", label: "Claude Code" },
    { key: "dev-knowledge", label: "개발 지식" },
    { key: "basics", label: "기초" },
  ];

  return (
    <div className="space-y-10">
      {/* Hero + Streak */}
      <div className="text-center space-y-6 pt-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent-300 via-accent-400 to-spark-400 bg-clip-text text-transparent">
          오늘의 학습
        </h1>
        <p className="text-surface-300 text-lg max-w-xl mx-auto">
          매일 새로운 Claude Code 지식을 배워보세요
        </p>
        <StreakCounter
          current={state.streak.current}
          longest={state.streak.longest}
        />
      </div>

      {/* Today's Content */}
      {todaysItem && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-surface-400 uppercase tracking-wider">
            오늘의 콘텐츠
          </h2>
          <div className="rounded-xl border border-accent-500/30 bg-accent-500/5 p-1">
            <FeedCard
              item={todaysItem}
              isCompleted={isItemCompleted(todaysItem.id)}
              onClick={() => router.push(`/feed/${todaysItem.id}`)}
            />
          </div>
        </section>
      )}

      {/* Recommendation */}
      {recommendedItem && recommendedItem.id !== todaysItem?.id && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-surface-400 uppercase tracking-wider">
            복습 추천
          </h2>
          <div className="rounded-xl border border-spark-500/30 bg-spark-500/5 p-1">
            <FeedCard
              item={recommendedItem}
              isCompleted={isItemCompleted(recommendedItem.id)}
              onClick={() => router.push(`/feed/${recommendedItem.id}`)}
            />
          </div>
        </section>
      )}

      {/* Library */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-surface-400 uppercase tracking-wider">
          라이브러리
        </h2>

        {/* Category filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === tab.key
                  ? "bg-accent-500 text-white"
                  : "bg-surface-800 text-surface-300 hover:bg-surface-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Feed items grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-surface-500">
              이 카테고리에 콘텐츠가 없습니다.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredItems.map((item) => (
              <FeedCard
                key={item.id}
                item={item}
                isCompleted={isItemCompleted(item.id)}
                onClick={() => router.push(`/feed/${item.id}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-surface-800 bg-surface-900/40 p-4 text-center">
          <p className="text-2xl font-bold text-accent-400 tabular-nums">
            {state.totalStudyMinutes}
          </p>
          <p className="text-xs text-surface-400 mt-1">총 학습시간(분)</p>
        </div>
        <div className="rounded-xl border border-surface-800 bg-surface-900/40 p-4 text-center">
          <p className="text-2xl font-bold text-spark-400 tabular-nums">
            {Object.keys(state.feed.items).length}
          </p>
          <p className="text-xs text-surface-400 mt-1">학습한 콘텐츠</p>
        </div>
        <div className="rounded-xl border border-surface-800 bg-surface-900/40 p-4 text-center">
          <p className="text-2xl font-bold text-streak-400 tabular-nums">
            {state.streak.current}
          </p>
          <p className="text-xs text-surface-400 mt-1">현재 스트릭</p>
        </div>
      </div>
    </div>
  );
}
