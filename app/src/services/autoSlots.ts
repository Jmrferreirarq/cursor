/**
 * Automatic slot suggestion engine.
 * Suggests the best asset for each slot based on:
 * - Novelty (newer = better)
 * - Diversity (avoid same project/type in consecutive slots)
 * - Quality score
 * - Pillar match
 */

import type { MediaAsset, PublicationSlot, ContentPost, ContentChannel, EditorialDNA } from '@/types';

export interface SlotSuggestion {
  slotId: string;
  slot: PublicationSlot;
  suggestedAssetId: string | null;
  suggestedAsset: MediaAsset | null;
  reason: string;
  score: number;
  date: string; // ISO date for the next occurrence of this slot
}

/**
 * Get the next N weeks of slot suggestions.
 */
export function generateCalendarSuggestions(
  slots: PublicationSlot[],
  assets: MediaAsset[],
  existingPosts: ContentPost[],
  editorialDNA: EditorialDNA | null,
  weeksAhead = 4
): SlotSuggestion[] {
  const suggestions: SlotSuggestion[] = [];
  const today = new Date();
  const usedAssetIds = new Set<string>();

  // Track recently used assets from existing posts
  existingPosts.forEach((p) => {
    if (p.assetId && (p.status === 'scheduled' || p.status === 'published')) {
      usedAssetIds.add(p.assetId);
    }
  });

  // Available assets (ready or analyzed)
  const availableAssets = assets.filter(
    (a) => (a.status === 'pronto' || a.status === 'analisado') && !usedAssetIds.has(a.id)
  );

  for (let week = 0; week < weeksAhead; week++) {
    for (const slot of slots) {
      // Calculate next date for this slot
      const date = getNextDate(today, slot.dayOfWeek, week);
      const dateStr = date.toISOString().slice(0, 10);

      // Check if there's already a post scheduled for this date
      const existingPost = existingPosts.find(
        (p) => p.scheduledDate?.startsWith(dateStr) || p.slotId === slot.id
      );
      if (existingPost) continue;

      // Score each available asset for this slot
      const scored = availableAssets.map((asset) => ({
        asset,
        score: scoreAssetForSlot(asset, slot, editorialDNA, usedAssetIds, week),
      })).sort((a, b) => b.score - a.score);

      const best = scored[0];

      suggestions.push({
        slotId: slot.id,
        slot,
        suggestedAssetId: best?.asset.id || null,
        suggestedAsset: best?.asset || null,
        reason: best ? buildReason(best.asset, slot, best.score) : 'Sem assets disponíveis — faz upload de mais conteúdo.',
        score: best?.score || 0,
        date: dateStr,
      });

      // Mark as used to avoid suggesting the same asset twice
      if (best) {
        usedAssetIds.add(best.asset.id);
      }
    }
  }

  return suggestions;
}

function getNextDate(from: Date, dayOfWeek: number, weeksAhead: number): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + ((dayOfWeek - d.getDay() + 7) % 7) + weeksAhead * 7);
  // If it's today and in the first week, still use it
  if (weeksAhead === 0 && d < from) {
    d.setDate(d.getDate() + 7);
  }
  return d;
}

function scoreAssetForSlot(
  asset: MediaAsset,
  slot: PublicationSlot,
  editorialDNA: EditorialDNA | null,
  alreadyUsed: Set<string>,
  weekOffset: number
): number {
  let score = 50; // Base score

  // Novelty: newer assets get higher score
  const ageMs = Date.now() - new Date(asset.uploadedAt).getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  if (ageDays < 7) score += 20;
  else if (ageDays < 14) score += 15;
  else if (ageDays < 30) score += 10;
  else score += 5;

  // Quality score bonus
  if (asset.qualityScore != null) {
    score += Math.round(asset.qualityScore / 5); // 0-20 bonus
  }

  // Pillar match
  if (slot.pillar && editorialDNA) {
    const pillar = editorialDNA.pillars.find((p) => p.id === slot.pillar);
    if (pillar) {
      const pillarName = pillar.name.toLowerCase();
      // Check if asset type matches pillar theme
      if (
        (pillarName.includes('obra') && (asset.mediaType === 'obra' || asset.mediaType === 'before-after')) ||
        (pillarName.includes('detalhe') && asset.mediaType === 'detalhe') ||
        (pillarName.includes('material') && (asset.mediaType === 'detalhe' || asset.tags.some((t) => t.toLowerCase().includes('material')))) ||
        (pillarName.includes('equipa') && asset.mediaType === 'equipa') ||
        (pillarName.includes('resultado') && (asset.mediaType === 'render' || asset.objective === 'portfolio')) ||
        (pillarName.includes('processo') && asset.mediaType === 'obra')
      ) {
        score += 15;
      }
    }
  }

  // Channel compatibility
  if (slot.channels.length > 0) {
    // Video assets are better for reels/stories/tiktok
    if (asset.type === 'video' && slot.channels.some((ch) => ['ig-reels', 'ig-stories', 'tiktok', 'youtube'].includes(ch))) {
      score += 10;
    }
    // Image assets are better for feed/pinterest/linkedin
    if (asset.type === 'image' && slot.channels.some((ch) => ['ig-feed', 'pinterest', 'linkedin', 'ig-carrossel'].includes(ch))) {
      score += 10;
    }
  }

  // Diversity penalty: already used
  if (alreadyUsed.has(asset.id)) {
    score -= 30;
  }

  // Less restrictions = better
  if (asset.restrictions.length === 0) score += 5;

  // Has tags = better organized
  if (asset.tags.length >= 3) score += 5;

  // Week offset penalty (prefer near-term suggestions)
  score -= weekOffset * 2;

  return Math.max(0, score);
}

function buildReason(asset: MediaAsset, slot: PublicationSlot, score: number): string {
  const reasons: string[] = [];

  const ageMs = Date.now() - new Date(asset.uploadedAt).getTime();
  const ageDays = Math.round(ageMs / (1000 * 60 * 60 * 24));
  if (ageDays < 7) reasons.push('conteúdo recente');
  if (asset.qualityScore && asset.qualityScore > 70) reasons.push('alta qualidade');
  if (asset.tags.length >= 3) reasons.push('bem classificado');

  if (reasons.length === 0) reasons.push('disponível e adequado');

  return `Sugestão: ${asset.name} (${reasons.join(', ')}) — score ${score}`;
}

/**
 * Auto-fill the calendar for the next N weeks.
 * Creates posts in "idea" status for each unoccupied slot.
 */
export function autoFillCalendar(
  suggestions: SlotSuggestion[]
): Omit<ContentPost, 'id'>[] {
  return suggestions
    .filter((s) => s.suggestedAsset)
    .map((s) => ({
      assetId: s.suggestedAssetId!,
      slotId: s.slotId,
      channel: s.slot.channels[0] || 'ig-feed' as ContentChannel,
      format: '1:1',
      copyPt: '',
      copyEn: '',
      hashtags: [],
      cta: '',
      status: 'idea' as const,
      scheduledDate: s.date,
      createdAt: new Date().toISOString(),
    }));
}
