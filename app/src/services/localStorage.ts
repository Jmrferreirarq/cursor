/**
 * localStorage implementation of IStorageService.
 * Stores everything under one key for atomic reads/writes.
 */

import type { IStorageService, AppData } from './storage';
import { EMPTY_DATA } from './storage';

const STORAGE_KEY = 'fa360_data';

function safeParse(json: string | null): Partial<AppData> | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as Partial<AppData>;
  } catch {
    return null;
  }
}

function merge(raw: Partial<AppData>): AppData {
  return {
    clients: Array.isArray(raw.clients) ? raw.clients : EMPTY_DATA.clients,
    projects: Array.isArray(raw.projects) ? raw.projects : EMPTY_DATA.projects,
    proposals: Array.isArray(raw.proposals) ? raw.proposals : EMPTY_DATA.proposals,
    mediaAssets: Array.isArray(raw.mediaAssets) ? raw.mediaAssets : EMPTY_DATA.mediaAssets,
    contentPacks: Array.isArray(raw.contentPacks) ? raw.contentPacks : EMPTY_DATA.contentPacks,
    contentPosts: Array.isArray(raw.contentPosts) ? raw.contentPosts : EMPTY_DATA.contentPosts,
    editorialDNA: raw.editorialDNA ?? EMPTY_DATA.editorialDNA,
    slots: Array.isArray(raw.slots) ? raw.slots : EMPTY_DATA.slots,
    performanceEntries: Array.isArray(raw.performanceEntries) ? raw.performanceEntries : EMPTY_DATA.performanceEntries,
  };
}

export const localStorageService: IStorageService = {
  load(): AppData {
    const raw = safeParse(localStorage.getItem(STORAGE_KEY));
    if (!raw) return { ...EMPTY_DATA };
    return merge(raw);
  },

  save(data: AppData): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, exportedAt: new Date().toISOString() }));
  },

  exportToFile(data: AppData): void {
    const json = JSON.stringify({ ...data, exportedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fa360-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  async importFromFile(file: File): Promise<{ ok: boolean; data?: AppData; error?: string }> {
    try {
      const text = await file.text();
      const raw = JSON.parse(text) as Partial<AppData>;
      const data = merge(raw);
      return { ok: true, data };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  },
};
