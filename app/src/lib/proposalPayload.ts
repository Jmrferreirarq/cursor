/**
 * Estrutura do payload serializado para link HTML da proposta.
 * Os dados são codificados em base64 na URL.
 */
export interface ProposalPayload {
  ref: string;
  data: string;
  cliente: string;
  projeto: string;
  local: string;
  linkGoogleMaps?: string;
  modo: string;
  area?: string;
  valorObra?: string;
  tipologia: string;
  complexidade: string;
  fasesPct: number;
  localizacao: string;
  iva: string;
  despesasReemb?: number;
  valorArq: number;
  especialidades: { nome: string; valor: number }[];
  valorEsp: number;
  orcamentacao?: number;
  total: number;
  totalSemIVA?: number;
  valorIVA?: number;
  incluirOrcamentacao: boolean;
  fasesPagamento: { nome: string; pct: number; valor: number }[];
  descricaoFases: { nome: string; pct: number; descricao: string }[];
  especialidadesDescricoes: { nome: string; descricao: string }[];
  exclusoes: string[];
  notas: string[];
  branding: {
    appName: string;
    appSlogan: string;
    architectName: string;
    architectOasrn: string;
  };
}

export function encodeProposalPayload(p: ProposalPayload): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(p))));
}

export function decodeProposalPayload(encoded: string): ProposalPayload | null {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(encoded)))) as ProposalPayload;
  } catch {
    return null;
  }
}

export function formatCurrency(v: number): string {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(v);
}
