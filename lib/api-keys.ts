// === API Keys: issue + validate via Vercel Blob ===
//
// Each key gets its own Blob object at api-keys/{key}.json. Validation is a
// simple existence check (head). Records hold non-sensitive metadata only;
// the key itself is the security token.

import { randomBytes } from "crypto";

export interface ApiKeyRecord {
  key: string;
  createdAt: string;
}

const KEY_PREFIX = "rush_sk_";
const KEY_HEX_LEN = 48; // 24 bytes → 192 bits of entropy
const KEY_PATTERN = new RegExp(`^${KEY_PREFIX}[a-f0-9]{${KEY_HEX_LEN}}$`);

const USE_BLOB = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

function blobPath(key: string): string {
  return `api-keys/${key}.json`;
}

/** Generates a fresh random API key (not persisted). */
export function generateKey(): string {
  return `${KEY_PREFIX}${randomBytes(KEY_HEX_LEN / 2).toString("hex")}`;
}

/** Issues a new API key and persists it to the Blob store. */
export async function issueApiKey(): Promise<ApiKeyRecord> {
  const key = generateKey();
  const record: ApiKeyRecord = {
    key,
    createdAt: new Date().toISOString(),
  };

  if (!USE_BLOB) {
    // Dev convenience: return the key without persistence. Validation in
    // dev accepts any well-formed key (see validateApiKey).
    return record;
  }

  const { put } = await import("@vercel/blob");
  await put(blobPath(key), JSON.stringify(record), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: false,
  });

  return record;
}

/** Validates an API key by checking its Blob existence. */
export async function validateApiKey(key: string | null | undefined): Promise<boolean> {
  if (!key || !KEY_PATTERN.test(key)) return false;

  if (!USE_BLOB) {
    // Dev: accept any well-formed key (no persistence available).
    return true;
  }

  try {
    const { head } = await import("@vercel/blob");
    await head(blobPath(key));
    return true;
  } catch {
    return false;
  }
}
