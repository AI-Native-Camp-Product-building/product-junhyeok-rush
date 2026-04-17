// === Daily Feed Types (Nudget API → LLM Pipeline → Frontend) ===

export type FeedCategory = "update" | "workflow" | "methodology" | "tool" | "other";
export type SourceType = "x" | "linkedin" | "youtube" | "rss" | "other";

export interface QuizQuestion {
  id: string;
  question: string;
  answer: string;
  distractors: string[];
  explanation?: string;
}

export interface DailyFeedItem {
  id: string;
  date: string;
  title: string;
  summary: string;
  keyPoints: string[];
  sourceUrl: string;
  sourceType: SourceType;
  sourceName: string;
  category: FeedCategory;
  quiz?: QuizQuestion[];
  nudgetContentId: string;
}

export interface DailyFeedResponse {
  items: DailyFeedItem[];
  date: string;
  totalFiltered: number;
  totalRaw: number;
}
