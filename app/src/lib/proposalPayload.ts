/**
 * Estrutura do payload serializado para link HTML da proposta.
 * Os dados são comprimidos com LZ-String para URLs mais curtas.
 * Links antigos (base64) continuam a funcionar.
 * Validação com Zod ao decodificar.
 */

import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import { z } from 'zod';

/** Texto de apresentação (fallback para links antigos) */
export const TEXTO_APRESENTACAO_DEFAULT = 'Fundada em 2017 pelo arquiteto José Ferreira, a Ferreirarquitetos é uma referência no setor de arquitetura em Portugal, em especial na região de Aveiro. Com uma combinação de precisão e criatividade portuguesa, a nossa equipa dedica-se a transformar visões em realidade, garantindo projetos simultaneamente inovadores e funcionais.\n\nDesde projetos residenciais a comerciais e industriais, a nossa abordagem meticulosa e detalhada tem sido reconhecida por diversos prémios, nomeadamente a Medalha de Prata nos Prémios Lusófonos de Arquitetura e Design de Interiores em 2021. Alguns dos nossos projetos mais notáveis incluem o JL_Consultório em Aveiro e o Izakaya Matsuri no Alboi.\n\nNa Ferreirarquitetos, acreditamos que cada projeto é uma oportunidade para abrir portas a novas possibilidades, mantendo o compromisso com a excelência e a satisfação do cliente. Com uma equipa dedicada e qualificada, estamos preparados para enfrentar novos desafios e criar espaços que inspiram.';

export type Lang = 'pt' | 'en';

const langSchema = z.enum(['pt', 'en']).optional();

const brandingSchema = z.object({
  appName: z.string(),
  appSlogan: z.string().optional().default(''),
  architectName: z.string().optional().default(''),
  architectOasrn: z.string().optional().default(''),
});

const fasesPagamentoSchema = z.array(z.object({
  nome: z.string(),
  pct: z.number().optional(),
  valor: z.number().optional(),
  isHeader: z.boolean().optional(),
}));

const extrasComDescricaoSchema = z.array(z.object({
  id: z.string().optional(),
  nome: z.string(),
  valor: z.number(),
  descricao: z.string(),
  ocultarValor: z.boolean().optional(),
  sobConsulta: z.boolean().optional(),
  sobConsultaPrevia: z.boolean().optional(),
  formula: z.string().optional(),
})).optional().default([]);

export const proposalPayloadSchema = z.object({
  lang: langSchema,
  ref: z.string(),
  data: z.string(),
  cliente: z.string(),
  projeto: z.string(),
  local: z.string(),
  linkGoogleMaps: z.string().optional(),
  modo: z.string(),
  area: z.string().optional(),
  valorObra: z.string().optional(),
  tipologia: z.string(),
  complexidade: z.string(),
  pisos: z.number().optional(),
  fasesPct: z.number(),
  localizacao: z.string(),
  iva: z.string(),
  despesasReemb: z.number().optional(),
  valorArq: z.number(),
  especialidades: z.array(z.object({ nome: z.string(), valor: z.number() })).default([]),
  valorEsp: z.number(),
  extras: z.array(z.object({ nome: z.string(), valor: z.number() })).default([]),
  valorExtras: z.number(),
  total: z.number(),
  totalSemIVA: z.number().optional(),
  valorIVA: z.number().optional(),
  fasesPagamento: fasesPagamentoSchema.default([]),
  descricaoFases: z.array(z.object({ nome: z.string(), pct: z.number(), descricao: z.string() })).default([]),
  notaBim: z.string().optional(),
  notaReunioes: z.string().optional(),
  apresentacao: z.string().optional(),
  especialidadesDescricoes: z.array(z.object({ nome: z.string(), descricao: z.string() })).default([]),
  exclusoes: z.array(z.string()).default([]),
  notas: z.array(z.string()).default([]),
  duracaoEstimada: z.array(z.object({ nome: z.string(), duracao: z.string() })).optional().default([]),
  extrasComDescricao: extrasComDescricaoSchema,
  branding: brandingSchema,
});

export type ProposalPayload = z.infer<typeof proposalPayloadSchema>;

/** Codifica com compressão LZ-String (URL-safe, link mais curto) */
export function encodeProposalPayload(p: ProposalPayload): string {
  const json = JSON.stringify(p);
  return compressToEncodedURIComponent(json);
}

function tryParseJson(json: string): unknown {
  try {
    return JSON.parse(json) as unknown;
  } catch {
    return null;
  }
}

/** Decodifica: tenta LZ-String, depois base64 (links antigos). Valida com Zod. */
export function decodeProposalPayload(encoded: string): ProposalPayload | null {
  const raw = encoded || '';
  let parsed: unknown = null;
  try {
    const decompressed = decompressFromEncodedURIComponent(raw);
    if (decompressed) parsed = tryParseJson(decompressed);
  } catch {
    /* não é LZ; tentar base64 */
  }
  if (!parsed) {
    try {
      let b64 = raw.replace(/-/g, '+').replace(/_/g, '/');
      const pad = b64.length % 4;
      if (pad) b64 += '='.repeat(4 - pad);
      const json = decodeURIComponent(escape(atob(b64)));
      parsed = tryParseJson(json);
    } catch {
      return null;
    }
  }
  if (!parsed || typeof parsed !== 'object') return null;
  const result = proposalPayloadSchema.safeParse(parsed);
  return result.success ? result.data : null;
}

export function formatCurrency(v: number, lang: Lang = 'pt'): string {
  const locale = lang === 'en' ? 'en-GB' : 'pt-PT';
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(v);
}
