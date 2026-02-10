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
  // Contactos para rodapé e capa
  morada: z.string().optional().default(''),
  email: z.string().optional().default(''),
  telefone: z.string().optional().default(''),
  website: z.string().optional().default(''),
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

/** Schema para pacotes de serviço */
const pacoteSchema = z.object({
  id: z.enum(['essencial', 'obra_tranquila', 'experiencia']),
  nome: z.string(),
  descricao: z.string(),
  valor: z.number(),
  recomendado: z.boolean().optional(),
  itens: z.array(z.string()).default([]),
});

/** Schema para cenários de prazo */
const cenarioPrazoSchema = z.object({
  melhorCaso: z.string(),
  casoTipico: z.string(),
  piorCaso: z.string(),
});

/** Schema para resumo executivo */
const resumoExecutivoSchema = z.object({
  incluido: z.array(z.string()).default([]),
  naoIncluido: z.array(z.string()).default([]),
  prazoEstimado: z.string().optional(),
  proximoPasso: z.string().optional(),
});

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
  complexidade: z.string().optional().default(''),
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
  // Novos campos para melhorias CERTO
  resumoExecutivo: resumoExecutivoSchema.optional(),
  pacotes: z.array(pacoteSchema).optional(),
  cenariosPrazo: cenarioPrazoSchema.optional(),
  mostrarPacotes: z.boolean().optional().default(false),
  mostrarResumo: z.boolean().optional().default(false),
  mostrarCenarios: z.boolean().optional().default(false),
  // Guia de Obra - faseamento e custos de construção
  mostrarGuiaObra: z.boolean().optional().default(false),
  tipologiaId: z.string().optional(),
  tipologiaCategoria: z.string().optional(),
  areaNum: z.number().optional(),
  // Estimativa de custos de construção
  custosConstrucao: z.object({
    min: z.number(),
    med: z.number(),
    max: z.number(),
    minTotal: z.number(),
    medTotal: z.number(),
    maxTotal: z.number(),
    duracao: z.string(),
  }).optional(),
  // ── Campos de Loteamento ──
  isLoteamento: z.boolean().optional(),
  lotIdentificacao: z.string().optional(),
  lotAreaTerreno: z.string().optional(),
  lotFonteArea: z.string().optional(),
  lotAreaEstudo: z.string().optional(),
  lotNumLotes: z.string().optional(),
  lotFrenteTerreno: z.string().optional(),
  lotProfundidade: z.string().optional(),
  lotMunicipio: z.string().optional(),
  lotNumAlternativas: z.number().optional(),
  // Contexto urbanistico
  lotInstrumento: z.string().optional(),
  lotClassificacaoSolo: z.string().optional(),
  lotParametros: z.object({
    alturaMaxima: z.string().optional(),
    afastamentoFrontal: z.string().optional(),
    afastamentoLateral: z.string().optional(),
    afastamentoPosterior: z.string().optional(),
    areaMinimaLote: z.string().optional(),
    indiceConstrucao: z.string().optional(),
    indiceImplantacao: z.string().optional(),
    profundidadeMaxConstrucao: z.string().optional(),
    percentagemCedencias: z.string().optional(),
  }).optional(),
  // Programa
  lotTipoHabitacao: z.string().optional(),
  lotObjetivo: z.string().optional(),
  // Cenarios com access_model + largura estimada + tipo habitação
  lotCenarios: z.array(z.object({
    label: z.string(),
    lotes: z.string(),
    areaMedia: z.string().optional(),
    cedencias: z.string().optional(),
    nota: z.string().optional(),
    accessModel: z.string().optional(),
    accessModelLabel: z.string().optional(),
    viaInternaComprimento: z.string().optional(),
    larguraEstimada: z.string().optional(),
    tipoHabitacao: z.string().optional(),
    tipoHabitacaoLabel: z.string().optional(),
  })).optional(),
  lotCondicionantes: z.array(z.string()).optional(),
  lotComplexidadeSugerida: z.string().optional(),
  lotEntregaveis: z.array(z.string()).optional(),
  lotAssuncoes: z.array(z.string()).optional(),
  lotDependencias: z.array(z.string()).optional(),
  // Fase 2: Modelo paramétrico de custos de infraestruturas
  lotCustosInfra: z.array(z.object({
    nome: z.string(),
    unidade: z.string(),
    quantidade: z.number(),
    custoUnitario: z.number(),
    custoRamal: z.number().optional(),
    subtotal: z.number(),
    honorario: z.number(),
  })).optional(),
  lotContingenciaPct: z.number().optional(),
  lotCustoObraSubtotal: z.number().optional(),
  lotCustoObraTotal: z.number().optional(),
  lotCustoObraMin: z.number().optional(),
  lotCustoObraMax: z.number().optional(),
  lotBandaPrecisao: z.string().optional(),
  lotBandaDescricao: z.string().optional(),
  // Equipamentos (cave, piscina, exteriores)
  lotBasement: z.string().optional(),
  lotBasementArea: z.string().optional(),
  lotPool: z.string().optional(),
  lotPoolUnits: z.number().optional(),
  lotPoolSize: z.string().optional(),
  lotPoolPerUnit: z.boolean().optional(),
  lotExternalWorks: z.string().optional(),
  lotWaterproofing: z.string().optional(),
  // Add-ons de piscina
  lotAddonsPool: z.array(z.object({
    nome: z.string(),
    unidades: z.number(),
    valorUnit: z.number(),
    subtotal: z.number(),
  })).optional(),
  lotAddonsPoolTotal: z.number().optional(),
  // Opcoes de cotacao
  lotOpcoesCotacao: z.array(z.object({
    label: z.string(),
    totalSemIVA: z.number(),
    totalComIVA: z.number(),
    deltaBase: z.number().optional(),
  })).optional(),
  // Investimento global do promotor
  lotInvestimentoPromotor: z.object({
    infraTotal: z.number(),
    honorariosTotal: z.number(),
    construcaoAreaMediaLote: z.number(),
    construcaoNLotes: z.number(),
    construcaoMin: z.number(),
    construcaoMed: z.number(),
    construcaoMax: z.number(),
    construcaoTotalMin: z.number(),
    construcaoTotalMed: z.number(),
    construcaoTotalMax: z.number(),
    investimentoTotalMin: z.number(),
    investimentoTotalMed: z.number(),
    investimentoTotalMax: z.number(),
    invDuracao: z.string().optional(),
    invNota: z.string().optional(),
  }).optional(),
});

export type ProposalPayload = z.infer<typeof proposalPayloadSchema>;

/** Chaves minificadas para reduzir tamanho do JSON antes da compressão */
const MINIFY_KEYS: Record<string, string> = {
  lang: 'l', ref: 'r', data: 'da', cliente: 'c', projeto: 'p', local: 'lo', linkGoogleMaps: 'lm',
  modo: 'm', area: 'a', valorObra: 'vo', tipologia: 't', complexidade: 'co', pisos: 'pi', fasesPct: 'fp',
  localizacao: 'loc', iva: 'i', despesasReemb: 'dr', valorArq: 'va', especialidades: 'e', valorEsp: 've',
  extras: 'ex', valorExtras: 'vex', total: 'to', totalSemIVA: 'ts', valorIVA: 'vi', fasesPagamento: 'fap',
  descricaoFases: 'df', notaBim: 'nb', notaReunioes: 'nr', apresentacao: 'ap', especialidadesDescricoes: 'ed',
  exclusoes: 'excl', notas: 'nt', duracaoEstimada: 'de', extrasComDescricao: 'ecd', branding: 'b',
  appName: 'an', appSlogan: 'as', architectName: 'acn', architectOasrn: 'ao', morada: 'mor', email: 'em', telefone: 'tel', website: 'ws',
  nome: 'n', valor: 'v', pct: 'pc', descricao: 'd', duracao: 'du', id: 'id', ocultarValor: 'ov',
  sobConsulta: 'sc', sobConsultaPrevia: 'scp', formula: 'f', isHeader: 'ih',
  // Novos campos CERTO
  resumoExecutivo: 're', pacotes: 'pak', cenariosPrazo: 'cp', mostrarPacotes: 'mp', mostrarResumo: 'mr',
  mostrarCenarios: 'mc', incluido: 'inc', naoIncluido: 'ninc', prazoEstimado: 'pe', proximoPasso: 'pp',
  melhorCaso: 'mec', casoTipico: 'ct', piorCaso: 'pic', recomendado: 'rec', itens: 'it',
  // Guia de Obra
  mostrarGuiaObra: 'mgo', tipologiaId: 'tid', tipologiaCategoria: 'tca', areaNum: 'arn',
  // Custos de construção
  custosConstrucao: 'cc', min: 'mi', med: 'me', max: 'ma', minTotal: 'mit', medTotal: 'met', maxTotal: 'mat',
  // Loteamento
  isLoteamento: 'isl', lotIdentificacao: 'lid', lotAreaTerreno: 'lat', lotFonteArea: 'lfa',
  lotAreaEstudo: 'lae', lotNumLotes: 'lnl', lotFrenteTerreno: 'lft', lotProfundidade: 'lpf', lotMunicipio: 'lmu',
  lotNumAlternativas: 'lna',
  lotInstrumento: 'lin', lotClassificacaoSolo: 'lcls', lotParametros: 'lpm',
  alturaMaxima: 'alm', afastamentoFrontal: 'aff', afastamentoLateral: 'afl', afastamentoPosterior: 'afp',
  areaMinimaLote: 'aml', indiceConstrucao: 'icn', indiceImplantacao: 'iim',
  profundidadeMaxConstrucao: 'pmc', percentagemCedencias: 'pcd',
  lotTipoHabitacao: 'lth', lotObjetivo: 'lob',
  lotCenarios: 'lce', lotCondicionantes: 'lco', lotComplexidadeSugerida: 'lcs',
  lotEntregaveis: 'len', lotAssuncoes: 'las', lotDependencias: 'ldp',
  label: 'lb', lotes: 'lt', areaMedia: 'am', cedencias: 'ced', nota: 'no',
  accessModel: 'acm', accessModelLabel: 'aml2', viaInternaComprimento: 'vic',
  // Fase 2: Custos infra
  lotCustosInfra: 'lci', lotContingenciaPct: 'lcpct', lotCustoObraSubtotal: 'lcos',
  lotCustoObraTotal: 'lcot', lotCustoObraMin: 'lcomn', lotCustoObraMax: 'lcomx',
  lotBandaPrecisao: 'lbp', lotBandaDescricao: 'lbd',
  quantidade: 'qt', custoUnitario: 'cu', custoRamal: 'cr', subtotal: 'st', honorario: 'hon', unidade: 'un',
  // Equipamentos
  lotBasement: 'lbs', lotBasementArea: 'lba', lotPool: 'lpl', lotPoolUnits: 'lpu',
  lotPoolSize: 'lps', lotPoolPerUnit: 'lppu', lotExternalWorks: 'lew', lotWaterproofing: 'lwp',
  lotAddonsPool: 'lap', lotAddonsPoolTotal: 'lapt', lotOpcoesCotacao: 'loc2',
  unidades: 'uns', valorUnit: 'vu', deltaBase: 'db',
  lotInvestimentoPromotor: 'lip', infraTotal: 'itr', honorariosTotal: 'htr',
  construcaoAreaMediaLote: 'caml', construcaoNLotes: 'cnl',
  construcaoMin: 'cmi', construcaoMed: 'cme', construcaoMax: 'cma',
  construcaoTotalMin: 'ctmi', construcaoTotalMed: 'ctme', construcaoTotalMax: 'ctma',
  investimentoTotalMin: 'itmi', investimentoTotalMed: 'itme', investimentoTotalMax: 'itma',
  invDuracao: 'idr', invNota: 'inr',
};

const EXPAND_KEYS: Record<string, string> = Object.fromEntries(
  Object.entries(MINIFY_KEYS).map(([k, v]) => [v, k])
);

function minifyValue(val: unknown, context: 'root' | 'fase' | 'esp' | 'ext' | 'branding'): unknown {
  if (val === null || val === undefined) return val;
  if (Array.isArray(val)) return val.map((item) => minifyValue(item, context));
  if (typeof val !== 'object') return val;

  const obj = val as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    if (v === '' || (Array.isArray(v) && v.length === 0)) continue;
    const short = MINIFY_KEYS[k] ?? k;
    const innerCtx = k === 'branding' ? 'branding' : k === 'fasesPagamento' ? 'fase' : k === 'especialidades' || k === 'especialidadesDescricoes' ? 'esp' : k === 'extrasComDescricao' ? 'ext' : 'root';
    result[short] = typeof v === 'object' && v !== null && !Array.isArray(v) ? minifyValue(v, innerCtx) : v;
  }
  return result;
}

function expandValue(val: unknown): unknown {
  if (val === null || val === undefined) return val;
  if (Array.isArray(val)) return val.map(expandValue);
  if (typeof val !== 'object') return val;

  const obj = val as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    const full = EXPAND_KEYS[k] ?? k;
    result[full] = typeof v === 'object' && v !== null && !Array.isArray(v) ? expandValue(v) : v;
  }
  return result;
}

/** Omite apresentacao se for o texto default (economiza ~500 caracteres) */
function minifyPayload(p: ProposalPayload): Record<string, unknown> {
  const copy = { ...p } as Record<string, unknown>;
  if (copy.apresentacao === TEXTO_APRESENTACAO_DEFAULT) delete copy.apresentacao;
  return minifyValue(copy, 'root') as Record<string, unknown>;
}

/** Codifica com minificação + compressão LZ-String (URL mais curta) */
export function encodeProposalPayload(p: ProposalPayload): string {
  const minified = minifyPayload(p);
  const json = JSON.stringify(minified);
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
    console.log('[Decode] LZ decompressed:', decompressed ? 'success' : 'null');
    if (decompressed) parsed = tryParseJson(decompressed);
  } catch (e) {
    console.log('[Decode] LZ error:', e);
    /* não é LZ; tentar base64 */
  }
  if (!parsed) {
    try {
      let b64 = raw.replace(/-/g, '+').replace(/_/g, '/');
      const pad = b64.length % 4;
      if (pad) b64 += '='.repeat(4 - pad);
      const json = decodeURIComponent(escape(atob(b64)));
      parsed = tryParseJson(json);
      console.log('[Decode] Base64 parsed:', parsed ? 'success' : 'null');
    } catch (e) {
      console.log('[Decode] Base64 error:', e);
      return null;
    }
  }
  if (!parsed || typeof parsed !== 'object') {
    console.log('[Decode] Parsed is null or not object');
    return null;
  }
  const expanded = expandValue(parsed);
  console.log('[Decode] Expanded object keys:', Object.keys(expanded as object));
  const result = proposalPayloadSchema.safeParse(expanded);
  if (!result.success) {
    console.error('[Decode] Schema validation FAILED:', JSON.stringify(result.error, null, 2));
  } else {
    console.log('[Decode] Schema validation: success');
  }
  return result.success ? result.data : null;
}

export function formatCurrency(v: number, lang: Lang = 'pt'): string {
  const locale = lang === 'en' ? 'en-GB' : 'pt-PT';
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(v);
}
