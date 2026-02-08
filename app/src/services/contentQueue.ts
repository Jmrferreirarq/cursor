/**
 * Content Queue Service — Queue-driven Calendar engine for FA-360.
 * Manages auto-scheduling, batch processing, priority scoring,
 * heavy/light classification, and calendar rule enforcement.
 */

import type {
  ContentPost, MediaAsset, ContentPack, PublicationSlot,
  EditorialDNA, PostStatus, PostWeight, ContentChannel,
} from '@/types';

// ── Constants ──

export const QUEUE_COLUMNS: { id: PostStatus; label: string; color: string }[] = [
  { id: 'inbox', label: 'Inbox', color: 'bg-slate-500' },
  { id: 'generated', label: 'Gerado', color: 'bg-blue-500' },
  { id: 'review', label: 'Em Revisão', color: 'bg-amber-500' },
  { id: 'approved', label: 'Aprovado', color: 'bg-emerald-500' },
  { id: 'scheduled', label: 'Agendado', color: 'bg-violet-500' },
  { id: 'published', label: 'Publicado', color: 'bg-primary' },
  { id: 'measured', label: 'Medido', color: 'bg-pink-500' },
  { id: 'rejected', label: 'Rejeitado', color: 'bg-red-500' },
];

// Heavy formats that count towards the 3/week limit
const HEAVY_FORMATS = ['carrossel', 'carousel', 'reel', 'case-study', 'video-editado', 'ig-carrossel'];
const HEAVY_CHANNELS: ContentChannel[] = ['ig-carrossel', 'ig-reels', 'youtube'];

// ── Weight Classification ──

export function classifyWeight(post: ContentPost, asset?: MediaAsset): PostWeight {
  // Explicit override
  if (post.weight) return post.weight;

  const format = post.format.toLowerCase();
  const channel = post.channel;

  // Heavy: Reel editado, Carrossel 6-10 slides, Case Study LinkedIn, YouTube
  if (HEAVY_FORMATS.some((f) => format.includes(f))) return 'heavy';
  if (HEAVY_CHANNELS.includes(channel)) return 'heavy';
  if (asset?.type === 'video') return 'heavy';

  // Light: Foto única, Stories, Threads, Pinterest pins, repost adaptado
  return 'light';
}

// ── Priority Scoring ──

export function calculateScore(
  post: ContentPost,
  asset?: MediaAsset,
  allPosts: ContentPost[] = [],
  dna?: EditorialDNA | null,
): number {
  let score = 50; // Base score

  // Asset quality
  if (asset?.qualityScore) {
    score += (asset.qualityScore - 50) * 0.3; // Up to ±15 points
  }

  // Freshness: newer assets get bonus
  if (asset?.uploadedAt) {
    const daysSinceUpload = (Date.now() - new Date(asset.uploadedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpload < 3) score += 15;
    else if (daysSinceUpload < 7) score += 10;
    else if (daysSinceUpload < 14) score += 5;
    else if (daysSinceUpload > 30) score -= 5;
  }

  // Pillar diversity: bonus if this pillar is underrepresented in recent posts
  if (post.pillar && allPosts.length > 0) {
    const recentPosts = allPosts.filter((p) =>
      ['scheduled', 'published', 'measured'].includes(p.status) &&
      p.scheduledDate &&
      new Date(p.scheduledDate).getTime() > Date.now() - 14 * 24 * 60 * 60 * 1000
    );
    const pillarCount = recentPosts.filter((p) => p.pillar === post.pillar).length;
    const avgPillarCount = recentPosts.length / Math.max(1, dna?.pillars?.length || 6);
    if (pillarCount < avgPillarCount) score += 10; // Underrepresented
    if (pillarCount > avgPillarCount * 1.5) score -= 10; // Overrepresented
  }

  // Project diversity: penalize if same project posted recently
  if (post.projectId && allPosts.length > 0) {
    const recentSameProject = allPosts.filter((p) =>
      p.projectId === post.projectId &&
      ['scheduled', 'published'].includes(p.status) &&
      p.scheduledDate &&
      new Date(p.scheduledDate).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    );
    if (recentSameProject.length > 2) score -= 15;
    else if (recentSameProject.length > 0) score -= 5;
  }

  // Core vs derivative: cores get priority
  if (post.isCore) score += 10;

  // Objective bonus
  if (post.objective === 'autoridade-tecnica') score += 5;

  return Math.max(0, Math.min(100, Math.round(score)));
}

// ── Auto-Schedule Engine ──

interface ScheduleRules {
  maxHeavyPerWeek: number;   // default 3
  maxLightPerWeek: number;   // default 4 (light fills remaining)
  coresPerDay: number;       // default 1
  noRepeatProjectDays: number; // default 2
  noRepeatFormatDays: number;  // default 2
  bufferCount: number;         // default 3
}

const DEFAULT_RULES: ScheduleRules = {
  maxHeavyPerWeek: 3,
  maxLightPerWeek: 4,
  coresPerDay: 1,
  noRepeatProjectDays: 2,
  noRepeatFormatDays: 2,
  bufferCount: 3,
};

interface DayAssignment {
  date: string; // YYYY-MM-DD
  core?: ContentPost;
  derivatives: ContentPost[];
  weight: PostWeight;
}

/**
 * Auto-schedule approved posts for the next N days.
 * Returns a list of post updates (id + scheduledDate + status).
 */
export function autoSchedule(
  approvedPosts: ContentPost[],
  existingScheduled: ContentPost[],
  days: number = 14,
  rules: ScheduleRules = DEFAULT_RULES,
  slots: PublicationSlot[] = [],
): { postId: string; scheduledDate: string; status: PostStatus }[] {
  const updates: { postId: string; scheduledDate: string; status: PostStatus }[] = [];

  // Sort approved by score (highest first)
  const sorted = [...approvedPosts]
    .filter((p) => p.isCore !== false) // Cores first
    .sort((a, b) => (b.score || 50) - (a.score || 50));

  const derivatives = approvedPosts.filter((p) => p.isCore === false && p.parentPostId);

  // Build existing schedule map
  const scheduleMap = new Map<string, ContentPost[]>();
  existingScheduled.forEach((p) => {
    if (p.scheduledDate) {
      const date = p.scheduledDate.slice(0, 10);
      if (!scheduleMap.has(date)) scheduleMap.set(date, []);
      scheduleMap.get(date)!.push(p);
    }
  });

  // Generate dates for next N days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dates: string[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i + 1); // Start from tomorrow
    dates.push(d.toISOString().slice(0, 10));
  }

  // Track weekly heavy counts
  const getWeekKey = (date: string) => {
    const d = new Date(date);
    const start = new Date(d);
    start.setDate(start.getDate() - start.getDay()); // Sunday
    return start.toISOString().slice(0, 10);
  };

  const weeklyHeavy = new Map<string, number>();
  existingScheduled.forEach((p) => {
    if (p.scheduledDate && p.weight === 'heavy') {
      const wk = getWeekKey(p.scheduledDate.slice(0, 10));
      weeklyHeavy.set(wk, (weeklyHeavy.get(wk) || 0) + 1);
    }
  });

  // Track recent assignments for anti-repetition
  const recentProjects: string[] = [];
  const recentFormats: string[] = [];

  // Fill each date
  for (const date of dates) {
    const existing = scheduleMap.get(date) || [];
    const existingCores = existing.filter((p) => p.isCore !== false);
    if (existingCores.length >= rules.coresPerDay) continue; // Day full

    const weekKey = getWeekKey(date);
    const heavyThisWeek = weeklyHeavy.get(weekKey) || 0;

    // Find best candidate for this day
    let bestIdx = -1;
    for (let i = 0; i < sorted.length; i++) {
      const candidate = sorted[i];

      // Check heavy limit
      const w = candidate.weight || 'light';
      if (w === 'heavy' && heavyThisWeek >= rules.maxHeavyPerWeek) continue;

      // Anti-repetition: project
      if (candidate.projectId && recentProjects.slice(-rules.noRepeatProjectDays).includes(candidate.projectId)) continue;

      // Anti-repetition: format
      if (recentFormats.slice(-rules.noRepeatFormatDays).includes(candidate.format)) continue;

      bestIdx = i;
      break;
    }

    if (bestIdx === -1) continue;

    const chosen = sorted.splice(bestIdx, 1)[0];
    updates.push({ postId: chosen.id, scheduledDate: date, status: 'scheduled' });

    // Track
    if (chosen.projectId) recentProjects.push(chosen.projectId);
    recentFormats.push(chosen.format);
    if ((chosen.weight || 'light') === 'heavy') {
      weeklyHeavy.set(weekKey, heavyThisWeek + 1);
    }

    // Schedule derivatives on same date
    if (chosen.derivativeIds) {
      const dervs = derivatives.filter((d) => chosen.derivativeIds!.includes(d.id));
      dervs.forEach((d) => {
        updates.push({ postId: d.id, scheduledDate: date, status: 'scheduled' });
      });
    }
  }

  return updates;
}

// ── Batch Generation (from assets → queue items) ──

export interface BatchGeneratedPost {
  post: Omit<ContentPost, 'id'>;
  derivativePosts: Omit<ContentPost, 'id'>[];
}

/**
 * Generate queue items from an asset + its content pack.
 * Creates 1 core post + N derivative posts for each channel.
 */
export function generateQueueItems(
  asset: MediaAsset,
  pack: ContentPack,
  projectId?: string,
  pillar?: string,
): BatchGeneratedPost {
  const now = new Date().toISOString();

  // Determine core channel (best fit)
  const coreChannel = determineCoreChannel(asset, pack);
  const coreCopy = pack.copies.find((c) => c.channel === coreChannel && c.lang === 'pt');
  const coreCopyEn = pack.copies.find((c) => c.channel === coreChannel && c.lang === 'en');

  const corePost: Omit<ContentPost, 'id'> = {
    assetId: asset.id,
    contentPackId: pack.id,
    channel: coreChannel,
    format: determineFormat(coreChannel, asset),
    copyPt: coreCopy?.text || '',
    copyEn: coreCopyEn?.text || '',
    hashtags: pack.hashtags,
    cta: pack.cta,
    status: 'review',
    createdAt: now,
    score: 50,
    weight: classifyWeight({ channel: coreChannel, format: determineFormat(coreChannel, asset) } as ContentPost, asset),
    isCore: true,
    pillar: pillar || guessPillar(asset),
    projectId,
    objective: asset.objective,
  };

  // Generate derivative posts for other channels
  const otherChannels = getDerivativeChannels(coreChannel);
  const derivativePosts: Omit<ContentPost, 'id'>[] = otherChannels.map((ch) => {
    const copyPt = pack.copies.find((c) => c.channel === ch && c.lang === 'pt');
    const copyEn = pack.copies.find((c) => c.channel === ch && c.lang === 'en');
    return {
      assetId: asset.id,
      contentPackId: pack.id,
      channel: ch,
      format: determineFormat(ch, asset),
      copyPt: copyPt?.text || '',
      copyEn: copyEn?.text || '',
      hashtags: pack.hashtags,
      cta: pack.cta,
      status: 'review' as PostStatus,
      createdAt: now,
      score: 40,
      weight: classifyWeight({ channel: ch, format: determineFormat(ch, asset) } as ContentPost, asset),
      isCore: false,
      pillar: pillar || guessPillar(asset),
      projectId,
      objective: asset.objective,
    };
  });

  return { post: corePost, derivativePosts };
}

// ── Buffer Management ──

/**
 * Check if we have enough buffer posts (pre-approved light posts as emergency reserves).
 */
export function checkBufferStatus(posts: ContentPost[]): { count: number; needed: number; ok: boolean } {
  const buffers = posts.filter((p) => p.isBuffer && p.status === 'approved');
  return { count: buffers.length, needed: DEFAULT_RULES.bufferCount, ok: buffers.length >= DEFAULT_RULES.bufferCount };
}

// ── Calendar Validation ──

export interface CalendarConflict {
  date: string;
  type: 'no-core' | 'too-many-heavy' | 'project-repeat' | 'format-repeat' | 'pillar-imbalance';
  message: string;
}

/**
 * Validate a scheduled calendar against the rules.
 */
export function validateCalendar(posts: ContentPost[], days: number = 14): CalendarConflict[] {
  const conflicts: CalendarConflict[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const scheduled = posts.filter((p) =>
    ['scheduled', 'published', 'measured'].includes(p.status) && p.scheduledDate
  );

  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);

    const dayPosts = scheduled.filter((p) => p.scheduledDate?.slice(0, 10) === dateStr);
    const cores = dayPosts.filter((p) => p.isCore !== false);

    // No core for this day
    if (cores.length === 0 && i > 0) {
      conflicts.push({ date: dateStr, type: 'no-core', message: `Sem core para ${formatDatePt(dateStr)}` });
    }

    // Check project repeat with previous day
    if (i > 0) {
      const prevDate = new Date(d);
      prevDate.setDate(prevDate.getDate() - 1);
      const prevStr = prevDate.toISOString().slice(0, 10);
      const prevPosts = scheduled.filter((p) => p.scheduledDate?.slice(0, 10) === prevStr);

      cores.forEach((core) => {
        if (core.projectId && prevPosts.some((p) => p.projectId === core.projectId && p.isCore !== false)) {
          conflicts.push({ date: dateStr, type: 'project-repeat', message: `Mesmo projeto em dias seguidos (${formatDatePt(dateStr)})` });
        }
      });

      // Format repeat check (>2 consecutive days)
      if (i >= 2) {
        const prev2Date = new Date(d);
        prev2Date.setDate(prev2Date.getDate() - 2);
        const prev2Str = prev2Date.toISOString().slice(0, 10);
        const prev2Posts = scheduled.filter((p) => p.scheduledDate?.slice(0, 10) === prev2Str);

        cores.forEach((core) => {
          const sameFormatYesterday = prevPosts.some((p) => p.format === core.format && p.isCore !== false);
          const sameFormat2Ago = prev2Posts.some((p) => p.format === core.format && p.isCore !== false);
          if (sameFormatYesterday && sameFormat2Ago) {
            conflicts.push({ date: dateStr, type: 'format-repeat', message: `Formato "${core.format}" repetido 3+ dias seguidos` });
          }
        });
      }
    }
  }

  // Weekly heavy check
  const weekMap = new Map<string, ContentPost[]>();
  scheduled.forEach((p) => {
    if (p.scheduledDate && p.weight === 'heavy') {
      const d = new Date(p.scheduledDate);
      const weekStart = new Date(d);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const key = weekStart.toISOString().slice(0, 10);
      if (!weekMap.has(key)) weekMap.set(key, []);
      weekMap.get(key)!.push(p);
    }
  });

  weekMap.forEach((heavyPosts, weekKey) => {
    if (heavyPosts.length > DEFAULT_RULES.maxHeavyPerWeek) {
      conflicts.push({
        date: weekKey,
        type: 'too-many-heavy',
        message: `${heavyPosts.length} posts pesados na semana de ${formatDatePt(weekKey)} (máx. ${DEFAULT_RULES.maxHeavyPerWeek})`,
      });
    }
  });

  return conflicts;
}

// ── Status Transitions ──

/**
 * Get valid next statuses for a given status.
 */
export function getValidTransitions(status: PostStatus): PostStatus[] {
  const transitions: Record<PostStatus, PostStatus[]> = {
    inbox: ['generated', 'rejected'],
    generated: ['review', 'rejected'],
    review: ['approved', 'rejected'],
    approved: ['scheduled', 'review'], // Can send back
    scheduled: ['published', 'approved'], // Can unschedule
    published: ['measured'],
    measured: [],
    rejected: ['review'], // Can retry
  };
  return transitions[status] || [];
}

/**
 * When moving to approved, auto-schedule if possible.
 * When a core is rejected, cascade to derivatives.
 */
export function handleStatusChange(
  post: ContentPost,
  newStatus: PostStatus,
  allPosts: ContentPost[],
): { updates: Partial<ContentPost>[]; warnings: string[] } {
  const updates: Partial<ContentPost>[] = [{ id: post.id, status: newStatus } as Partial<ContentPost> & { id: string }];
  const warnings: string[] = [];

  // Auto-mark measured if has metrics
  if (newStatus === 'published' && post.metrics) {
    (updates[0] as Record<string, unknown>).status = 'measured';
    (updates[0] as Record<string, unknown>).measuredAt = new Date().toISOString();
  }

  // Reject cascade: if core rejected, reject all derivatives
  if (newStatus === 'rejected' && post.isCore && post.derivativeIds) {
    post.derivativeIds.forEach((did) => {
      const deriv = allPosts.find((p) => p.id === did);
      if (deriv && !['published', 'measured'].includes(deriv.status)) {
        updates.push({
          id: did,
          status: 'rejected',
          rejectionReason: `Core rejeitado: ${post.rejectionReason || 'sem motivo'}`,
        } as Partial<ContentPost> & { id: string });
      }
    });
    warnings.push(`${post.derivativeIds.length} derivado(s) também rejeitados`);
  }

  return { updates, warnings };
}

// ── Helpers ──

function determineCoreChannel(asset: MediaAsset, pack: ContentPack): ContentChannel {
  // Video → Reels/TikTok, Image → Feed/LinkedIn
  if (asset.type === 'video') return 'ig-reels';
  if (asset.objective === 'autoridade-tecnica') return 'linkedin';
  if (asset.mediaType === 'detalhe' || asset.mediaType === 'obra') return 'ig-feed';
  if (pack.copies.some((c) => c.channel === 'ig-carrossel')) return 'ig-carrossel';
  return 'ig-feed';
}

function getDerivativeChannels(coreChannel: ContentChannel): ContentChannel[] {
  const all: ContentChannel[] = ['ig-feed', 'ig-reels', 'ig-stories', 'ig-carrossel', 'linkedin', 'tiktok', 'pinterest', 'threads'];
  return all.filter((ch) => ch !== coreChannel).slice(0, 4); // Max 4 derivatives
}

function determineFormat(channel: ContentChannel, asset: MediaAsset): string {
  const formats: Record<string, string> = {
    'ig-feed': asset.type === 'video' ? 'Vídeo Feed' : 'Foto Feed',
    'ig-reels': 'Reel 9:16',
    'ig-stories': 'Story 9:16',
    'ig-carrossel': 'Carrossel',
    'linkedin': 'Post LinkedIn',
    'tiktok': 'TikTok 9:16',
    'pinterest': 'Pin Vertical',
    'youtube': 'YouTube 16:9',
    'threads': 'Thread texto',
  };
  return formats[channel] || 'Post';
}

function guessPillar(asset: MediaAsset): string {
  const map: Record<string, string> = {
    'obra': 'p5', 'render': 'p6', 'detalhe': 'p2',
    'equipa': 'p1', 'before-after': 'p3',
  };
  return map[asset.mediaType] || 'p1';
}

function formatDatePt(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short' });
}

// ── Stats ──

export function getQueueStats(posts: ContentPost[]) {
  const byStatus: Record<PostStatus, number> = {
    inbox: 0, generated: 0, review: 0, approved: 0,
    scheduled: 0, published: 0, measured: 0, rejected: 0,
  };
  posts.forEach((p) => { byStatus[p.status] = (byStatus[p.status] || 0) + 1; });

  const heavyScheduled = posts.filter((p) => p.status === 'scheduled' && p.weight === 'heavy').length;
  const lightScheduled = posts.filter((p) => p.status === 'scheduled' && p.weight === 'light').length;
  const coresTotal = posts.filter((p) => p.isCore).length;
  const bufferStatus = checkBufferStatus(posts);

  return { byStatus, heavyScheduled, lightScheduled, coresTotal, bufferStatus };
}
