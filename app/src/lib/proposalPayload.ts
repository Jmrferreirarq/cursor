/**
 * Estrutura do payload serializado para link HTML da proposta.
 * Os dados são codificados em base64 na URL.
 */

/** Texto de apresentação (fallback para links antigos) */
export const TEXTO_APRESENTACAO_DEFAULT = 'Fundada em 2017 pelo arquiteto José Ferreira, a Ferreirarquitetos é uma referência no setor de arquitetura em Portugal, em especial na região de Aveiro. Com uma combinação de precisão e criatividade portuguesa, a nossa equipa dedica-se a transformar visões em realidade, garantindo projetos simultaneamente inovadores e funcionais.\n\nDesde projetos residenciais a comerciais e industriais, a nossa abordagem meticulosa e detalhada tem sido reconhecida por diversos prémios, nomeadamente a Medalha de Prata nos Prémios Lusófonos de Arquitetura e Design de Interiores em 2021. Alguns dos nossos projetos mais notáveis incluem o JL_Consultório em Aveiro e o Izakaya Matsuri no Alboi.\n\nNa Ferreirarquitetos, acreditamos que cada projeto é uma oportunidade para abrir portas a novas possibilidades, mantendo o compromisso com a excelência e a satisfação do cliente. Com uma equipa dedicada e qualificada, estamos preparados para enfrentar novos desafios e criar espaços que inspiram.';

export type Lang = 'pt' | 'en';

export interface ProposalPayload {
  lang?: Lang;
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
  pisos?: number;
  fasesPct: number;
  localizacao: string;
  iva: string;
  despesasReemb?: number;
  valorArq: number;
  especialidades: { nome: string; valor: number }[];
  valorEsp: number;
  extras: { nome: string; valor: number }[];
  valorExtras: number;
  total: number;
  totalSemIVA?: number;
  valorIVA?: number;
  fasesPagamento: { nome: string; pct: number; valor: number }[];
  descricaoFases: { nome: string; pct: number; descricao: string }[];
  notaBim?: string;
  apresentacao?: string;
  especialidadesDescricoes: { nome: string; descricao: string }[];
  exclusoes: string[];
  notas: string[];
  duracaoEstimada?: { nome: string; duracao: string }[];
  extrasComDescricao?: { id?: string; nome: string; valor: number; descricao: string; ocultarValor?: boolean; sobConsulta?: boolean; sobConsultaPrevia?: boolean; formula?: string }[];
  branding: {
    appName: string;
    appSlogan: string;
    architectName: string;
    architectOasrn: string;
  };
}

/** Codifica para base64 URL-safe (+ → -, / → _, sem padding) */
export function encodeProposalPayload(p: ProposalPayload): string {
  const json = JSON.stringify(p);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Decodifica base64 URL-safe */
export function decodeProposalPayload(encoded: string): ProposalPayload | null {
  try {
    let b64 = (encoded || '').replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64.length % 4;
    if (pad) b64 += '='.repeat(4 - pad);
    const json = decodeURIComponent(escape(atob(b64)));
    return JSON.parse(json) as ProposalPayload;
  } catch {
    return null;
  }
}

export function formatCurrency(v: number, lang: Lang = 'pt'): string {
  const locale = lang === 'en' ? 'en-GB' : 'pt-PT';
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(v);
}
