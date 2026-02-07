/**
 * Abstract storage interface.
 * Today → localStorage. Tomorrow → Supabase / Firebase.
 * Components never touch storage directly — they use contexts that call this.
 */

import type {
  Client, Project, Proposal,
  MediaAsset, ContentPack, ContentPost,
  EditorialDNA, PublicationSlot, PerformanceEntry,
} from '@/types';

export interface AppData {
  clients: Client[];
  projects: Project[];
  proposals: Proposal[];
  mediaAssets: MediaAsset[];
  contentPacks: ContentPack[];
  contentPosts: ContentPost[];
  editorialDNA: EditorialDNA | null;
  slots: PublicationSlot[];
  performanceEntries: PerformanceEntry[];
}

export const EMPTY_DATA: AppData = {
  clients: [],
  projects: [],
  proposals: [],
  mediaAssets: [],
  contentPacks: [],
  contentPosts: [],
  editorialDNA: null,
  slots: [],
  performanceEntries: [],
};

export interface IStorageService {
  load(): AppData;
  save(data: AppData): void;
  exportToFile(data: AppData): void;
  importFromFile(file: File): Promise<{ ok: boolean; data?: AppData; error?: string }>;
}
