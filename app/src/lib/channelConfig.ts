/**
 * Mapeamento de ContentChannel para metadados (label, cor, URL do perfil).
 * A URL é derivada do StudioProfile para ficar sempre atualizada.
 */

import type { ContentChannel } from '@/types';
import type { StudioProfile } from '@/types';

export interface ChannelMeta {
  label: string;
  short: string;
  emoji: string;
  dotColor: string;
  /** Obtém a URL do perfil a partir do StudioProfile */
  getUrl: (profile: StudioProfile) => string | undefined;
}

export const CHANNEL_META: Record<ContentChannel, ChannelMeta> = {
  'ig-feed': {
    label: 'Instagram Feed',
    short: 'IG',
    emoji: '📸',
    dotColor: 'bg-pink-500',
    getUrl: (p) => p.social?.instagram,
  },
  'ig-reels': {
    label: 'Instagram Reels',
    short: 'Reels',
    emoji: '🎬',
    dotColor: 'bg-pink-400',
    getUrl: (p) => p.social?.instagram,
  },
  'ig-stories': {
    label: 'Instagram Stories',
    short: 'Stories',
    emoji: '⭕',
    dotColor: 'bg-pink-300',
    getUrl: (p) => p.social?.instagram,
  },
  'ig-carrossel': {
    label: 'Instagram Carrossel',
    short: 'Carrossel',
    emoji: '🖼️',
    dotColor: 'bg-pink-600',
    getUrl: (p) => p.social?.instagram,
  },
  linkedin: {
    label: 'LinkedIn',
    short: 'LI',
    emoji: '💼',
    dotColor: 'bg-blue-600',
    getUrl: (p) => p.social?.linkedinCompany || p.social?.linkedinPersonal,
  },
  tiktok: {
    label: 'TikTok',
    short: 'TT',
    emoji: '🎵',
    dotColor: 'bg-gray-800',
    getUrl: (p) => p.social?.tiktok,
  },
  pinterest: {
    label: 'Pinterest',
    short: 'PT',
    emoji: '📌',
    dotColor: 'bg-red-500',
    getUrl: (p) => p.social?.pinterest,
  },
  youtube: {
    label: 'YouTube',
    short: 'YT',
    emoji: '▶️',
    dotColor: 'bg-red-600',
    getUrl: (p) => p.social?.youtube,
  },
  threads: {
    label: 'Threads',
    short: 'TH',
    emoji: '🔗',
    dotColor: 'bg-gray-600',
    getUrl: (p) => p.social?.threads,
  },
};

export function getChannelUrl(channel: ContentChannel, profile: StudioProfile): string | undefined {
  return CHANNEL_META[channel]?.getUrl(profile);
}

export function getChannelLabel(channel: ContentChannel): string {
  return CHANNEL_META[channel]?.label ?? channel;
}

export function getChannelShort(channel: ContentChannel): string {
  return CHANNEL_META[channel]?.short ?? channel;
}

export function getChannelDotColor(channel: ContentChannel): string {
  return CHANNEL_META[channel]?.dotColor ?? 'bg-muted-foreground';
}
