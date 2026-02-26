/**
 * Auto-creates a compliance checklist when a proposal is accepted.
 * Maps project types (from calculator) to tipologias (from legislation module).
 */

import { TIPOLOGIA_DIPLOMAS } from '@/data/tipologias';
import { REQUISITOS_POR_DIPLOMA, type EstadoRequisito } from '@/data/requisitosConformidade';

const CHECKLISTS_KEY = 'fa360_checklists';

interface SavedChecklist {
  id: string;
  nome: string;
  tipologia: string;
  projectId?: string;
  criadoEm: string;
  atualizadoEm: string;
  items: Record<string, EstadoRequisito>;
  notas: Record<string, string>;
}

const PROJECT_TYPE_TO_TIPOLOGIA: Record<string, string> = {
  habitacao_unifamiliar: 'moradia_isolada',
  habitacao_moradia: 'moradia_isolada',
  habitacao_apartamento: 'multifamiliar',
  habitacao_multifamiliar: 'multifamiliar',
  habitacao_coletiva: 'multifamiliar',
  comercio_servicos: 'comercio_servicos',
  comercio: 'comercio_servicos',
  escritorio: 'comercio_servicos',
  restaurante: 'comercio_servicos',
  clinica: 'comercio_servicos',
  hotel: 'turismo',
  industrial: 'industrial',
  industria: 'industrial',
  logistica: 'industrial',
  laboratorio: 'industrial',
  armazem_comercial: 'industrial',
  equipamentos: 'equipamento',
  reabilitacao: 'reabilitacao',
  reabilitacao_integral: 'reabilitacao',
  restauro: 'reabilitacao',
  urbanismo: 'loteamento',
  loteamento_urbano: 'loteamento',
  loteamento_industrial: 'loteamento',
  destaque_parcela: 'loteamento',
  reparcelamento: 'loteamento',
  praia_apm: 'equipamento',
  praia_aps: 'equipamento',
  praia_apc: 'equipamento',
  praia_eap: 'equipamento',
  praia_appd: 'equipamento',
  praia_ab: 'equipamento',
  praia_ar: 'equipamento',
  praia_ec: 'equipamento',
};

export function mapProjectTypeToTipologia(projectType: string): string | null {
  return PROJECT_TYPE_TO_TIPOLOGIA[projectType] || null;
}

export function createChecklistForProject(
  projectId: string,
  projectName: string,
  projectType: string,
): boolean {
  const tipologiaId = mapProjectTypeToTipologia(projectType);
  if (!tipologiaId) return false;

  const tipDiplomas = TIPOLOGIA_DIPLOMAS[tipologiaId];
  if (!tipDiplomas?.length) return false;

  const items: Record<string, EstadoRequisito> = {};
  for (const td of tipDiplomas) {
    const reqs = REQUISITOS_POR_DIPLOMA[td.diplomaId];
    if (reqs) {
      for (const r of reqs) {
        items[r.id] = 'pendente';
      }
    }
  }

  const now = new Date().toISOString();
  const checklist: SavedChecklist = {
    id: `chk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    nome: projectName,
    tipologia: tipologiaId,
    projectId,
    criadoEm: now,
    atualizadoEm: now,
    items,
    notas: {},
  };

  try {
    const raw = localStorage.getItem(CHECKLISTS_KEY);
    const existing: SavedChecklist[] = raw ? JSON.parse(raw) : [];
    const alreadyExists = existing.some((c) => c.projectId === projectId);
    if (alreadyExists) return true;
    existing.unshift(checklist);
    localStorage.setItem(CHECKLISTS_KEY, JSON.stringify(existing));
    return true;
  } catch {
    return false;
  }
}

export function getChecklistForProject(projectId: string): SavedChecklist | null {
  try {
    const raw = localStorage.getItem(CHECKLISTS_KEY);
    const lists: SavedChecklist[] = raw ? JSON.parse(raw) : [];
    return lists.find((c) => c.projectId === projectId) || null;
  } catch {
    return null;
  }
}
