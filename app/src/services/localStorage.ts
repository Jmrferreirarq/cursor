/**
 * localStorage implementation of IStorageService.
 * Stores everything under one key for atomic reads/writes.
 */

import type { IStorageService, AppData } from './storage';
import { EMPTY_DATA, DATA_VERSION } from './storage';

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
    specialists: Array.isArray(raw.specialists) ? raw.specialists : EMPTY_DATA.specialists,
    licenses: Array.isArray(raw.licenses) ? raw.licenses : EMPTY_DATA.licenses,
    constructionVisits: Array.isArray(raw.constructionVisits) ? raw.constructionVisits : EMPTY_DATA.constructionVisits,
    trashAssets: Array.isArray(raw.trashAssets) ? raw.trashAssets : EMPTY_DATA.trashAssets,
    trashPacks: Array.isArray(raw.trashPacks) ? raw.trashPacks : EMPTY_DATA.trashPacks,
    trashPosts: Array.isArray(raw.trashPosts) ? raw.trashPosts : EMPTY_DATA.trashPosts,
  };
}

/** Remove src de vídeos para reduzir tamanho (localStorage ~5MB). Mantém thumbnail. */
function stripVideoSrc(assets: { src?: string; thumbnail?: string; type?: string }[]): typeof assets {
  return assets.map((a) =>
    a.type === 'video' && a.src ? { ...a, src: undefined } : a
  );
}

function migrate(data: AppData): AppData {
  const version = data._version ?? 0;
  if (version >= DATA_VERSION) return data;

  let result = { ...data };

  // v1 → v2: adicionar clientId aos projetos (ligando por nome ao cliente),
  // separar proposalIds de projectIds no cliente, e copiar paymentTranches aceites para o projeto
  if (version < 2) {
    const clients = result.clients ?? [];
    const proposals = result.proposals ?? [];

    // Construir mapa clientName → clientId (case-insensitive)
    const clientByName = new Map<string, string>();
    for (const c of clients) {
      clientByName.set(c.name.trim().toLowerCase(), c.id);
    }

    // Construir mapa clientId → proposalIds
    const proposalsByClient = new Map<string, string[]>();
    for (const p of proposals) {
      if (p.clientId) {
        const arr = proposalsByClient.get(p.clientId) ?? [];
        arr.push(p.id);
        proposalsByClient.set(p.clientId, arr);
      }
    }

    // Construir mapa proposalId → paymentTranches (para propostas aceites)
    const tranchesByProposal = new Map<string, typeof proposals[0]['paymentTranches']>();
    for (const p of proposals) {
      if (p.status === 'accepted' && p.paymentTranches?.length) {
        tranchesByProposal.set(p.id, p.paymentTranches);
      }
    }

    // Construir mapa projectName+clientName → proposalId (para ligar projetos criados via acceptProposal)
    const proposalByProjectKey = new Map<string, string>();
    for (const p of proposals) {
      if (p.status === 'accepted' && p.projectName) {
        const key = `${p.projectName.trim().toLowerCase()}|${p.clientName.trim().toLowerCase()}`;
        proposalByProjectKey.set(key, p.id);
      }
    }

    // Migrar projetos
    result.projects = (result.projects ?? []).map((proj) => {
      const clientName = (proj.client ?? '').trim().toLowerCase();
      const clientId = proj.clientId ?? clientByName.get(clientName);
      const projKey = `${proj.name.trim().toLowerCase()}|${clientName}`;
      const linkedProposalId = proposalByProjectKey.get(projKey);
      const proposalIds = proj.proposalIds ?? (linkedProposalId ? [linkedProposalId] : []);
      const paymentTranches = proj.paymentTranches
        ?? (linkedProposalId ? tranchesByProposal.get(linkedProposalId) : undefined);

      return {
        ...proj,
        clientId: clientId ?? proj.clientId,
        proposalIds,
        ...(paymentTranches ? { paymentTranches } : {}),
      };
    });

    // Migrar clientes: separar proposals de projects no array projects[]
    result.clients = (result.clients ?? []).map((c) => {
      const allLinked = c.projects ?? [];
      const clientProposalIds = proposalsByClient.get(c.id) ?? [];
      const projectIds = allLinked.filter((id) => !clientProposalIds.includes(id));
      return {
        ...c,
        projects: projectIds,
        proposalIds: Array.from(new Set([...(c.proposalIds ?? []), ...clientProposalIds])),
      };
    });
  }

  return { ...result, _version: DATA_VERSION };
}

export const localStorageService: IStorageService = {
  load(): AppData {
    const raw = safeParse(localStorage.getItem(STORAGE_KEY));
    if (!raw) return { ...EMPTY_DATA };
    return migrate(merge(raw));
  },

  save(data: AppData): void {
    const payload = { ...data, _version: DATA_VERSION, exportedAt: new Date().toISOString() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      // QuotaExceededError: vídeos em data URL podem exceder ~5MB
      if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.code === 22)) {
        const stripped = {
          ...payload,
          mediaAssets: stripVideoSrc(payload.mediaAssets),
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(stripped));
        } catch {
          // Ainda falha: guardar sem media assets
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ ...payload, mediaAssets: [] })
          );
        }
      } else {
        throw e;
      }
    }
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
      const data = migrate(merge(raw));
      return { ok: true, data };
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  },
};
