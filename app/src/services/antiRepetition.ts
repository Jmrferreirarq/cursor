/**
 * Anti-repetition system for the Content Factory.
 * Prevents repeating phrases, structures, and content patterns.
 * Uses a simple hash-based approach to detect similarity.
 */

// Simple hash function for strings
function simpleHash(str: string): number {
  let hash = 0;
  const s = str.toLowerCase().replace(/[^a-záàâãéèêíïóôõúüçñ\s]/gi, '').trim();
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

// Extract n-grams from text
function extractNgrams(text: string, n: number): string[] {
  const words = text.toLowerCase()
    .replace(/[^\wáàâãéèêíïóôõúüçñ\s]/gi, '')
    .split(/\s+/)
    .filter((w) => w.length > 2);
  
  const ngrams: string[] = [];
  for (let i = 0; i <= words.length - n; i++) {
    ngrams.push(words.slice(i, i + n).join(' '));
  }
  return ngrams;
}

// Calculate Jaccard similarity between two sets
function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  const intersection = new Set([...a].filter((x) => b.has(x)));
  const union = new Set([...a, ...b]);
  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

export interface SimilarityResult {
  isTooSimilar: boolean;
  similarityScore: number; // 0-1
  matchedPost?: { id: string; copyPt: string; channel: string };
  suggestion?: string;
}

/**
 * Check if a new copy is too similar to existing published copies.
 * @param newCopy - The new copy text to check
 * @param existingPosts - Array of already published/scheduled posts
 * @param threshold - Similarity threshold (default 0.4 = 40%)
 */
export function checkSimilarity(
  newCopy: string,
  existingPosts: { id: string; copyPt: string; copyEn: string; channel: string }[],
  threshold = 0.4
): SimilarityResult {
  if (!newCopy || existingPosts.length === 0) {
    return { isTooSimilar: false, similarityScore: 0 };
  }

  const newNgrams = new Set(extractNgrams(newCopy, 3));
  if (newNgrams.size === 0) {
    return { isTooSimilar: false, similarityScore: 0 };
  }

  let maxSimilarity = 0;
  let matchedPost: SimilarityResult['matchedPost'] | undefined;

  for (const post of existingPosts) {
    const existingNgrams = new Set([
      ...extractNgrams(post.copyPt, 3),
      ...extractNgrams(post.copyEn, 3),
    ]);

    const similarity = jaccardSimilarity(newNgrams, existingNgrams);
    
    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      matchedPost = { id: post.id, copyPt: post.copyPt.slice(0, 80), channel: post.channel };
    }
  }

  const isTooSimilar = maxSimilarity >= threshold;

  return {
    isTooSimilar,
    similarityScore: Math.round(maxSimilarity * 100) / 100,
    matchedPost: isTooSimilar ? matchedPost : undefined,
    suggestion: isTooSimilar
      ? `Este conteúdo tem ${Math.round(maxSimilarity * 100)}% de semelhança com um post já existente (${matchedPost?.channel}). Tenta reformular ou usar uma abordagem diferente.`
      : undefined,
  };
}

/**
 * Generate an editorial hash for a piece of content.
 * Used to track what structures/formats have been used.
 */
export function editorialHash(text: string): string {
  const h = simpleHash(text);
  return `eh-${Math.abs(h).toString(36)}`;
}

/**
 * Check if we're over-using a specific channel.
 * Returns a warning if > 40% of recent posts go to one channel.
 */
export function checkChannelBalance(
  recentPosts: { channel: string }[],
  windowSize = 20
): { balanced: boolean; warnings: string[] } {
  const window = recentPosts.slice(0, windowSize);
  if (window.length < 5) return { balanced: true, warnings: [] };

  const counts: Record<string, number> = {};
  window.forEach((p) => { counts[p.channel] = (counts[p.channel] || 0) + 1; });

  const warnings: string[] = [];
  for (const [channel, count] of Object.entries(counts)) {
    const ratio = count / window.length;
    if (ratio > 0.4) {
      warnings.push(`Canal "${channel}" representa ${Math.round(ratio * 100)}% dos últimos ${window.length} posts. Diversifica para melhores resultados.`);
    }
  }

  return { balanced: warnings.length === 0, warnings };
}
