import type { AppState } from "./types";

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  check: (state: AppState) => boolean;
}

export const BADGES: BadgeDefinition[] = [
  {
    id: "first-sprint",
    name: "첫 학습",
    description: "첫 번째 학습 완료!",
    icon: "\u{1F331}",
    check: (state) => state.history.length >= 1,
  },
  {
    id: "three-day-streak",
    name: "3일 연속",
    description: "스트릭 3일 달성!",
    icon: "\u{1F525}",
    check: (state) => state.streak.longest >= 3,
  },
  {
    id: "week-warrior",
    name: "7일 연속",
    description: "일주일 연속 학습!",
    icon: "\u26A1",
    check: (state) => state.streak.longest >= 7,
  },
  {
    id: "two-week-streak",
    name: "14일 연속",
    description: "2주 연속 학습!",
    icon: "\u{1F48E}",
    check: (state) => state.streak.longest >= 14,
  },
  {
    id: "month-streak",
    name: "30일 연속",
    description: "한 달 연속 학습!",
    icon: "\u{1F451}",
    check: (state) => state.streak.longest >= 30,
  },
  {
    id: "five-topics",
    name: "5개 토픽 완료",
    description: "다섯 가지 토픽 정복!",
    icon: "\u{1F4DA}",
    check: (state) => {
      const completedItems = Object.values(state.feed.items).filter(
        (item) => item.status === "completed"
      );
      return completedItems.length >= 5;
    },
  },
  {
    id: "all-core-topics",
    name: "기초 완전 정복",
    description: "기초 카테고리 전체 마스터!",
    icon: "\u{1F393}",
    check: (state) => {
      const completedItems = Object.values(state.feed.items).filter(
        (item) => item.status === "completed"
      );
      return completedItems.length >= 30;
    },
  },
  {
    id: "quiz-perfect",
    name: "퀴즈 100% 정답",
    description: "완벽한 퀴즈 점수!",
    icon: "\u{1F9E0}",
    check: (state) =>
      state.history.some(
        (entry) => entry.quizTotal > 0 && entry.quizScore === entry.quizTotal
      ),
  },
  {
    id: "study-300min",
    name: "총 학습 300분 돌파",
    description: "총 5시간 학습 돌파!",
    icon: "\u23F1\uFE0F",
    check: (state) => state.totalStudyMinutes >= 300,
  },
];

/** Check all badges against current state, return newly unlocked badge IDs */
export function checkBadges(state: AppState): string[] {
  return BADGES.filter(
    (badge) => !state.badges.includes(badge.id) && badge.check(state)
  ).map((badge) => badge.id);
}

/** Get badge definition by ID */
export function getBadge(id: string): BadgeDefinition | undefined {
  return BADGES.find((badge) => badge.id === id);
}
