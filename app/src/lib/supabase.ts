/**
 * API client para armazenamento de propostas via Vercel/Upstash
 * Permite gerar links curtos em vez de URLs com payload codificado
 */

/** Verifica se o serviço de links curtos está disponível (sempre true em produção) */
export function isSupabaseConfigured(): boolean {
  // Em produção (Vercel), as APIs estão sempre disponíveis
  // Em localhost, também tentamos usar as APIs
  return true;
}

/** Interface para proposta guardada */
export interface StoredProposal {
  payload: Record<string, unknown>;
  reference: string;
  clientName: string;
  projectName: string;
  createdAt: string;
  views: number;
}

/**
 * Guarda uma proposta via API e retorna o ID curto
 */
export async function saveProposal(
  payload: Record<string, unknown>,
  reference: string,
  clientName: string,
  projectName: string
): Promise<{ shortId: string; error: string | null }> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000); // 8s client timeout
    const response = await fetch('/api/proposals/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payload,
        reference,
        clientName,
        projectName,
      }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return { shortId: '', error: data.error || 'Erro ao guardar proposta' };
    }

    const data = await response.json();
    return { shortId: data.shortId, error: null };
  } catch (e) {
    console.error('Erro ao guardar proposta:', e);
    return { shortId: '', error: 'Erro de conexão ou timeout' };
  }
}

/**
 * Obtém uma proposta pelo ID curto via API
 */
export async function getProposalByShortId(
  shortId: string
): Promise<{ proposal: StoredProposal | null; error: string | null }> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000); // 8s client timeout
    const response = await fetch(`/api/proposals/${shortId}`, { signal: ctrl.signal });
    clearTimeout(timer);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return { proposal: null, error: data.error || 'Proposta não encontrada' };
    }

    const data = await response.json();
    return { 
      proposal: {
        payload: data.payload,
        reference: data.reference,
        clientName: data.clientName,
        projectName: data.projectName,
        createdAt: data.createdAt,
        views: data.views,
      }, 
      error: null 
    };
  } catch (e) {
    console.error('Erro ao obter proposta:', e);
    return { proposal: null, error: 'Erro de conexão ou timeout' };
  }
}
