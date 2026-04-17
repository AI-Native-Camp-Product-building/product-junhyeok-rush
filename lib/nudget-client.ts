// === Nudget API Client (Server-side only) ===

const BASE_URL = "https://nudget.app/api";

function getApiKey(): string {
  const key = process.env.NUDGET_API_KEY;
  if (!key) {
    throw new Error("NUDGET_API_KEY environment variable is not set");
  }
  return key;
}

async function nudgetFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        "X-API-Key": getApiKey(),
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error(
        `Nudget API error: ${res.status} ${res.statusText} for ${path}`
      );
      return null;
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error(`Nudget API fetch failed for ${path}:`, error);
    return null;
  }
}

// === Nudget API Response Types ===

export interface NudgetContentItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  sourceType: string;
  publishedAt: string;
  tags?: string[];
}

export interface NudgetDigestResponse {
  id: string;
  date: string;
  items: NudgetContentItem[];
  totalItems: number;
}

export interface NudgetSubscription {
  id: string;
  url: string;
  rssUrl: string | null;
  name: string;
  status: string; // "active" | "inactive" | etc.
  lastCheckedAt: string;
  errorMessage: string | null;
  lookupStrategy: string; // "twitter" | "linkedin" | "selector" | ...
  createdAt: string;
  updatedAt: string;
  contentCount: string; // returned as string by Nudget API
}

export interface NudgetSubscriptionsResponse {
  items: NudgetSubscription[];
}

export interface NudgetSubscriptionContentsResponse {
  items: NudgetContentItem[];
  page: number;
  limit: number;
  total: number;
}

// === API Methods ===

export async function getTodayDigest(): Promise<NudgetDigestResponse | null> {
  return nudgetFetch<NudgetDigestResponse>("/digests/today");
}

export async function getSubscriptionContents(
  subscriptionId: string,
  page = 1,
  limit = 20
): Promise<NudgetSubscriptionContentsResponse | null> {
  return nudgetFetch<NudgetSubscriptionContentsResponse>(
    `/subscriptions/${subscriptionId}/contents?page=${page}&limit=${limit}`
  );
}

export async function getContentItem(
  id: string
): Promise<NudgetContentItem | null> {
  return nudgetFetch<NudgetContentItem>(`/content-items/${id}`);
}

export async function getSubscriptions(): Promise<
  NudgetSubscription[] | null
> {
  const res = await nudgetFetch<NudgetSubscriptionsResponse>("/subscriptions");
  return res?.items ?? null;
}
