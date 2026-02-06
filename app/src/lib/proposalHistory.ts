/**
 * Gestão do histórico de propostas geradas
 * Armazena localmente todas as propostas com links gerados
 */

export interface ProposalHistoryItem {
  id: string;
  reference: string;           // FA-XXX
  clientName: string;
  projectName: string;
  projectType: string;
  location?: string;
  totalValue: number;          // Valor total s/IVA
  totalWithVat: number;        // Valor total c/IVA
  shortLink?: string;          // Link curto (se disponível)
  longLink?: string;           // Link longo (fallback)
  createdAt: string;           // ISO date string
  expiresAt?: string;          // Data de expiração do link curto (90 dias)
}

const STORAGE_KEY = 'fa360_proposal_history';

/**
 * Carrega o histórico de propostas do localStorage
 */
export function loadProposalHistory(): ProposalHistoryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    console.error('[ProposalHistory] Erro ao carregar histórico');
    return [];
  }
}

/**
 * Guarda o histórico de propostas no localStorage
 */
function saveProposalHistory(history: ProposalHistoryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('[ProposalHistory] Erro ao guardar histórico:', e);
  }
}

/**
 * Adiciona uma proposta ao histórico
 */
export function addToProposalHistory(item: Omit<ProposalHistoryItem, 'id' | 'createdAt' | 'expiresAt'>): ProposalHistoryItem {
  const history = loadProposalHistory();
  
  // Gera ID único
  const id = `ph_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  // Calcula data de expiração (90 dias para links curtos)
  const createdAt = new Date().toISOString();
  const expiresAt = item.shortLink 
    ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
    : undefined;
  
  const newItem: ProposalHistoryItem = {
    ...item,
    id,
    createdAt,
    expiresAt,
  };
  
  // Adiciona no início (mais recente primeiro)
  history.unshift(newItem);
  
  // Limita a 100 itens para não sobrecarregar localStorage
  const trimmed = history.slice(0, 100);
  
  saveProposalHistory(trimmed);
  
  return newItem;
}

/**
 * Remove uma proposta do histórico
 */
export function removeFromProposalHistory(id: string): boolean {
  const history = loadProposalHistory();
  const index = history.findIndex(item => item.id === id);
  
  if (index === -1) return false;
  
  history.splice(index, 1);
  saveProposalHistory(history);
  
  return true;
}

/**
 * Limpa todo o histórico de propostas
 */
export function clearProposalHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Verifica se um link curto ainda está válido (não expirou)
 */
export function isLinkValid(item: ProposalHistoryItem): boolean {
  if (!item.shortLink || !item.expiresAt) return true; // Links longos não expiram
  return new Date(item.expiresAt) > new Date();
}

/**
 * Obtém o melhor link disponível para uma proposta
 */
export function getBestLink(item: ProposalHistoryItem): string | null {
  if (item.shortLink && isLinkValid(item)) {
    return item.shortLink;
  }
  return item.longLink || null;
}
