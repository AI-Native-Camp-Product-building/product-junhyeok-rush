import type { AppState, FeedItemProgress, BlockProgress } from "./types";

const STORAGE_KEY = "claude-dopamine-sprint-web";
const STATE_VERSION = 2;
const V1_BACKUP_KEY = `${STORAGE_KEY}:v1-backup`;

// V1 types for migration
interface V1DayProgress {
  status: "locked" | "in_progress" | "completed";
  blocks: Record<string, { status: string; explainSkipped: boolean; executeScore: number | null; quizScore: number | null; timeSpentSeconds: number }>;
  completedAt: string | null;
}

interface V1State {
  stateVersion: 1;
  onboarding: {
    currentDay: number;
    currentBlock: number;
    days: Record<string, V1DayProgress>;
    completedAt: string | null;
  };
  streak: AppState["streak"];
  badges: string[];
  totalStudyMinutes: number;
  totalSessions: number;
  feedback: AppState["feedback"];
  history: AppState["history"];
}

function migrateV1toV2(oldState: Partial<V1State>): AppState {
  // Best-effort migration: each field is wrapped so a corrupted V1 partially
  // succeeds rather than blowing away all user progress.
  const base = getInitialState();
  const items: Record<string, FeedItemProgress> = {};

  try {
    const days = oldState?.onboarding?.days;
    if (days && typeof days === "object") {
      for (const [dayId, dayProgress] of Object.entries(days)) {
        try {
          if (!dayProgress || dayProgress.status === "locked") continue;

          const migratedBlocks: Record<string, BlockProgress> = {};
          const blocks = dayProgress.blocks ?? {};
          for (const [blockId, block] of Object.entries(blocks)) {
            try {
              migratedBlocks[blockId] = {
                ...block,
                status: (block.status === "completed"
                  ? "completed"
                  : block.status === "in_progress"
                    ? "in_progress"
                    : "not_started") as BlockProgress["status"],
              };
            } catch {
              // skip bad block
            }
          }

          items[dayId] = {
            status: dayProgress.status === "completed" ? "completed" : "in_progress",
            blocks: migratedBlocks,
            completedAt: dayProgress.completedAt ?? null,
          };
        } catch {
          // skip bad day
        }
      }
    }
  } catch {
    // leave items as {}
  }

  return {
    stateVersion: 2,
    feed: {
      items,
      completedAt: oldState?.onboarding?.completedAt ?? null,
    },
    streak: oldState?.streak ?? base.streak,
    badges: Array.isArray(oldState?.badges) ? oldState!.badges : base.badges,
    totalStudyMinutes:
      typeof oldState?.totalStudyMinutes === "number"
        ? oldState.totalStudyMinutes
        : base.totalStudyMinutes,
    totalSessions:
      typeof oldState?.totalSessions === "number"
        ? oldState.totalSessions
        : base.totalSessions,
    feedback: oldState?.feedback ?? base.feedback,
    history: Array.isArray(oldState?.history) ? oldState!.history : base.history,
  };
}

export function getInitialState(): AppState {
  return {
    stateVersion: STATE_VERSION as 2,
    feed: {
      items: {},
      completedAt: null,
    },
    streak: {
      current: 0,
      longest: 0,
      lastStudyDate: null,
    },
    badges: [],
    totalStudyMinutes: 0,
    totalSessions: 0,
    feedback: {
      quizResponses: [],
      skippedBlocks: [],
      blockTimeSpent: {},
      contentReactions: [],
    },
    history: [],
  };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return getInitialState();
    }
    let parsed: { stateVersion?: number } & Record<string, unknown>;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return getInitialState();
    }
    if (parsed.stateVersion === 1) {
      // Preserve raw V1 in a backup key before mutating storage so users can
      // recover progress if migration is buggy.
      try {
        localStorage.setItem(V1_BACKUP_KEY, raw);
      } catch {
        // ignore quota errors
      }
      try {
        const migrated = migrateV1toV2(parsed as Partial<V1State>);
        saveState(migrated);
        return migrated;
      } catch (err) {
        console.error("V1→V2 migration failed, returning best-effort state:", err);
        return migrateV1toV2({});
      }
    }
    if (parsed.stateVersion !== STATE_VERSION) {
      return getInitialState();
    }
    return parsed as unknown as AppState;
  } catch {
    return getInitialState();
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
