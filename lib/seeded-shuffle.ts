// === Seeded Fisher-Yates shuffle ===
//
// Deterministic shuffle that produces stable output for the same seed but
// varied output across different seeds. Used by QuizCard to randomize answer
// option positions per question.id without leaking the correct answer's
// position to a fixed slot.

/**
 * xmur3 string hash → 32-bit seed.
 * Simple, fast, and good enough for non-cryptographic shuffling.
 */
function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

/**
 * mulberry32 PRNG seeded from a 32-bit integer.
 */
function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Returns a new array with `items` shuffled deterministically by `seed`.
 * Same seed → same order; different seeds → different orders.
 */
export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  const out = items.slice();
  if (out.length <= 1) return out;
  const seedFn = xmur3(seed);
  const rand = mulberry32(seedFn());
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
