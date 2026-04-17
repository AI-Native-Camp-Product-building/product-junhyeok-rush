import type { FeedItem, Block, FeedCategory } from "@/lib/types";
import { feedItems } from "@/data/feed";

/**
 * 전체 피드 아이템을 날짜 역순으로 반환합니다.
 */
export function getFeedItems(): FeedItem[] {
  return [...feedItems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * 특정 피드 아이템을 ID로 찾아 반환합니다.
 */
export function getFeedItem(id: string): FeedItem | undefined {
  return feedItems.find((item) => item.id === id);
}

/**
 * 특정 피드 아이템의 특정 블록을 반환합니다.
 */
export function getFeedBlock(
  itemId: string,
  blockId: string
): Block | undefined {
  const item = getFeedItem(itemId);
  if (!item) return undefined;
  return item.blocks.find((b) => b.id === blockId);
}

/**
 * 카테고리별 피드 아이템을 날짜 역순으로 반환합니다.
 */
export function getFeedItemsByCategory(category: FeedCategory): FeedItem[] {
  return getFeedItems().filter((item) => item.category === category);
}

/**
 * 오늘 날짜의 피드 아이템을 반환합니다.
 */
export function getTodaysFeedItem(): FeedItem | undefined {
  const today = new Date().toISOString().split("T")[0];
  return feedItems.find((item) => item.date === today);
}
