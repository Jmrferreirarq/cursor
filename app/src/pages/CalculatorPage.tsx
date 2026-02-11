import { useEffect, useMemo, useRef, useState } from 'react';
// react-dom: apenas usado para ProposalDocument (importação mantida para compatibilidade)
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  ArrowRightLeft,
  Ruler,
  Building2,
  Home,
  TrendingUp,
  Euro,
  RotateCcw,
  FileText,
  FileDown,
  Link2,
  Lock,
  History,
  X,
} from 'lucide-react';
import { encodeProposalPayload, formatCurrency as formatCurrencyPayload, type ProposalPayload } from '../lib/proposalPayload';
import { generateProposalPdf } from '../lib/generateProposalPdf';
import { saveProposal } from '../lib/supabase';
import { addToProposalHistory } from '../lib/proposalHistory';
// ProposalDocument é usado via ProposalPreviewPaginated (não precisa de import direto aqui)
import { ProposalPreviewPaginated } from '../components/proposals/ProposalPreviewPaginated';
import { ProposalHistoryModal } from '../components/proposals/ProposalHistoryModal';
import { IchpopCalculatorCard } from '../components/calculators/IchpopCalculatorCard';
import { ICHPOP_PHASES } from '../data/calculatorConstants';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { ClientAutocomplete } from '../components/clients/ClientAutocomplete';
import { t, formatDate, formatCurrency as formatCurrencyLocale } from '../locales';
import { toast } from 'sonner';
import type { Client } from '../types';
import { municipios, type ParametrosUrbanisticos } from '../data/municipios';

const APP_NAME = import.meta.env.VITE_APP_NAME ?? 'FA-360';
const APP_SLOGAN = import.meta.env.VITE_APP_SLOGAN ?? '';
const ARCHITECT_NAME = import.meta.env.VITE_ARCHITECT_NAME ?? '';
const ARCHITECT_OASRN = import.meta.env.VITE_ARCHITECT_OASRN ?? '';
const CONTACT_MORADA = import.meta.env.VITE_CONTACT_MORADA ?? 'Avenida Europa, 914 · 3810-138 Aveiro';
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL ?? 'jmrferreirarq@gmail.com';
const CONTACT_PHONE = import.meta.env.VITE_CONTACT_PHONE ?? '+351 910 662 814';
const CONTACT_WEBSITE = import.meta.env.VITE_CONTACT_WEBSITE ?? 'www.ferreira-arquitetos.pt';

const calculators = [
  {
    id: 'honorarios',
    name: 'Honorários de Arquitetura',
    description: 'Por área ou % da obra (referência ICHPOP/OA)',
    icon: Calculator,
  },
  {
    id: 'ichpop',
    name: 'Percentagens ICHPOP',
    description: 'Referência rápida por fase do projeto',
    icon: FileText,
  },
  {
    id: 'areas',
    name: 'Conversor de Áreas',
    description: 'm², ft², ha, ac, palmo², vara²...',
    icon: Ruler,
  },
  {
    id: 'custo',
    name: 'Custo de Construção',
    description: 'Estimativa com ajuste regional',
    icon: Building2,
  },
  {
    id: 'imovel',
    name: 'Avaliação Imobiliária',
    description: 'Valor de mercado por localização',
    icon: Home,
  },
];

// Especialidades: minValor + taxa €/m² (valor = max(minValor, área × rate))
// Valores reduzidos ~15-20% para maior competitividade (2024-02)
const ESPECIALIDADES_SUGESTAO: Record<string, { minValor: number; rate: number }> = {
  estruturas: { minValor: 700, rate: 5 },
  aguas_esgotos: { minValor: 400, rate: 2.5 },
  gas: { minValor: 350, rate: 1.5 },
  eletrico: { minValor: 500, rate: 3.5 },
  ited: { minValor: 300, rate: 1.2 },
  avac: { minValor: 600, rate: 4 },
  termico: { minValor: 400, rate: 3 },
  scie: { minValor: 400, rate: 2.5 },
  domotica: { minValor: 350, rate: 1.5 },
  paisagismo: { minValor: 650, rate: 4 },
  interiores: { minValor: 800, rate: 6.5 },
  geotecnia: { minValor: 1200, rate: 0 }, // valor fixo mínimo
  coord_especialidades: { minValor: 400, rate: 2 },
  conservacao: { minValor: 1000, rate: 6.5 },
  acustica: { minValor: 400, rate: 2.5 },
  iluminacao: { minValor: 350, rate: 1.5 },
  // Loteamento / Infraestruturas
  infra_viarias: { minValor: 1500, rate: 4 },
  infra_pluviais: { minValor: 800, rate: 2.5 },
  infra_ip: { minValor: 600, rate: 1.5 },
  topografia: { minValor: 1200, rate: 3 },
};

// --- Fase 2: Modelo Paramétrico de Custos de Infraestruturas ---
type CatalogoItem = { id: string; nome: string; unidade: 'ml' | 'lote' | 'm2' | 'vg'; custoUnitario: number; custoRamal?: number; pctHonorario: number };
const CATALOGO_CUSTOS_INFRA: CatalogoItem[] = [
  { id: 'infra_viarias', nome: 'Infraestruturas viárias', unidade: 'ml', custoUnitario: 220, pctHonorario: 0.065 },
  { id: 'aguas_esgotos', nome: 'Rede de abastecimento de água', unidade: 'ml', custoUnitario: 55, custoRamal: 400, pctHonorario: 0.07 },
  { id: 'infra_pluviais', nome: 'Drenagem pluvial', unidade: 'ml', custoUnitario: 50, pctHonorario: 0.065 },
  { id: 'aguas_esgotos_dom', nome: 'Drenagem doméstica', unidade: 'ml', custoUnitario: 60, custoRamal: 450, pctHonorario: 0.07 },
  { id: 'eletrico', nome: 'Rede elétrica (MT/BT)', unidade: 'lote', custoUnitario: 2000, pctHonorario: 0.08 },
  { id: 'infra_ip', nome: 'Iluminação pública', unidade: 'ml', custoUnitario: 100, pctHonorario: 0.07 },
  { id: 'ited', nome: 'ITED / Telecomunicações', unidade: 'lote', custoUnitario: 550, pctHonorario: 0.06 },
  { id: 'gas', nome: 'Rede de gás', unidade: 'ml', custoUnitario: 40, custoRamal: 280, pctHonorario: 0.065 },
  { id: 'paisagismo', nome: 'Arranjos exteriores', unidade: 'm2', custoUnitario: 35, pctHonorario: 0.08 },
  { id: 'topografia', nome: 'Levantamento topográfico', unidade: 'm2', custoUnitario: 0.8, pctHonorario: 1.0 },
  { id: 'geotecnia', nome: 'Estudo geotécnico', unidade: 'vg', custoUnitario: 1200, pctHonorario: 1.0 },
];

const BANDAS_PRECISAO: Record<string, { label: string; margem: number; descricao: string }> = {
  classe_5: { label: 'Estudo de viabilidade', margem: 0.45, descricao: '±40–50%' },
  classe_4: { label: 'PIP / Estudo prévio', margem: 0.30, descricao: '±25–35%' },
  classe_3: { label: 'Projeto de licenciamento', margem: 0.175, descricao: '±15–20%' },
};

// Especialidades de projeto (subconsultores/parceiros)
const ESPECIALIDADES: { id: string; name: string }[] = [
  { id: 'estruturas', name: 'Estruturas e fundações' },
  { id: 'aguas_esgotos', name: 'Águas e saneamento' },
  { id: 'gas', name: 'Redes de gás' },
  { id: 'eletrico', name: 'Instalações elétricas' },
  { id: 'ited', name: 'ITED (telecomunicações)' },
  { id: 'avac', name: 'AVAC / climatização' },
  { id: 'termico', name: 'Estudo térmico' },
  { id: 'scie', name: 'SCIE (segurança contra incêndios)' },
  { id: 'domotica', name: 'Domótica e GTC' },
  { id: 'paisagismo', name: 'Arranjos exteriores' },
  { id: 'interiores', name: 'Arquitetura de interiores' },
  { id: 'geotecnia', name: 'Geotecnia' },
  { id: 'coord_especialidades', name: 'Coordenação de especialidades' },
  { id: 'conservacao', name: 'Conservação e restauro' },
  { id: 'acustica', name: 'Estudo acústico' },
  { id: 'iluminacao', name: 'Iluminação' },
  // Loteamento / Infraestruturas urbanas
  { id: 'infra_viarias', name: 'Infraestruturas viárias e pavimentos' },
  { id: 'infra_pluviais', name: 'Rede de águas pluviais e drenagem' },
  { id: 'infra_ip', name: 'Iluminação pública (IP)' },
  { id: 'topografia', name: 'Topografia e levantamento' },
];

// Extras opcionais (serviços adicionais que o cliente pode optar por incluir)
const EXTRAS_PROPOSTA: { id: string; nome: string; tipo: 'fixo' | 'por_m2' | 'por_visita' | 'por_avenca'; valorSugerido: number; taxaPorM2?: number; taxaPorVisita?: number; taxaPorMes?: number; tetoMinimo?: number; unitLabel?: string; categoria: 'arq' | 'esp'; tier?: 'base' | 'completa' }[] = [
  { id: 'projeto_execucao_base', nome: 'Projeto de Execução (base)', tipo: 'por_m2', valorSugerido: 0, tetoMinimo: 2500, taxaPorM2: 15, categoria: 'arq', tier: 'base' },
  { id: 'projeto_execucao_completa', nome: 'Projeto de Execução (completa)', tipo: 'por_m2', valorSugerido: 0, tetoMinimo: 4000, taxaPorM2: 22, categoria: 'arq', tier: 'completa' },
  { id: 'orcamentacao', nome: 'Orçamentação e medição', tipo: 'por_m2', valorSugerido: 0, tetoMinimo: 250, taxaPorM2: 3.5, categoria: 'arq' },
  { id: 'maquete', nome: 'Maquete física ou virtual', tipo: 'fixo', valorSugerido: 1500, categoria: 'arq' },
  { id: 'renderizacoes', nome: 'Renderizações / imagens 3D', tipo: 'fixo', valorSugerido: 400, categoria: 'arq' },
  { id: 'fotografia_obra', nome: 'Fotografia de obra', tipo: 'fixo', valorSugerido: 1250, categoria: 'arq' },
  { id: 'estudo_viabilidade', nome: 'Estudo de viabilidade', tipo: 'fixo', valorSugerido: 1500, categoria: 'arq' },
  { id: 'relatorio_tecnico', nome: 'Relatório técnico / parecer', tipo: 'fixo', valorSugerido: 800, categoria: 'arq' },
  { id: 'plantas_asbuilt', nome: 'Plantas as-built / levantamento', tipo: 'por_m2', valorSugerido: 0, taxaPorM2: 3, categoria: 'arq' },
  { id: 'fiscalizacao_visita', nome: 'Fiscalização de obra – por visita', tipo: 'por_visita', valorSugerido: 250, taxaPorVisita: 250, categoria: 'arq' },
  { id: 'fiscalizacao_avenca', nome: 'Fiscalização de obra – por avença', tipo: 'por_avenca', valorSugerido: 600, taxaPorMes: 600, categoria: 'arq' },
  { id: 'alteracao_projeto_obra', nome: 'Alteração de projeto durante o decurso da obra', tipo: 'fixo', valorSugerido: 1500, categoria: 'arq' },
  { id: 'consulta_processo_camarario', nome: 'Consulta processo camarário', tipo: 'fixo', valorSugerido: 200, categoria: 'arq' },
  { id: 'reunioes_adicionais', nome: 'Reuniões adicionais', tipo: 'por_visita', valorSugerido: 150, taxaPorVisita: 150, unitLabel: 'reunião', categoria: 'arq' },
  { id: 'deslocacoes', nome: 'Deslocações fora da área acordada', tipo: 'fixo', valorSugerido: 150, categoria: 'arq' },
  { id: 'certificacao_energetica', nome: 'Certificação energética', tipo: 'fixo', valorSugerido: 350, categoria: 'arq' },
  { id: 'fotogrametria', nome: 'Fotogrametria / levantamento aéreo', tipo: 'fixo', valorSugerido: 1500, categoria: 'arq' },
  { id: 'ensaios_in_situ', nome: 'Ensaios in situ (termografia, acústica)', tipo: 'fixo', valorSugerido: 500, categoria: 'esp' },
  { id: 'simulacao_energetica', nome: 'Simulação energética dinâmica (SCE)', tipo: 'fixo', valorSugerido: 800, categoria: 'esp' },
];

// Descrições breves dos extras (para a proposta)
const EXTRAS_DESCRICOES: Record<string, string> = {
  projeto_execucao_base: 'Projeto de execução base: 3-6 pormenores construtivos tipo, especificações de materiais genéricas e compatibilização básica com especialidades. Adequado para obras com empreiteiro experiente. Valor: teto mínimo + €/m² conforme área.',
  projeto_execucao_completa: 'Projeto de execução completa: 10-15 pormenores construtivos detalhados, mapas de vãos completos, detalhes de remates e encontros, especificações de materiais específicas e compatibilização BIM total. Recomendado para garantir qualidade e reduzir imprevistos em obra. Valor: teto mínimo + €/m² conforme área.',
  orcamentacao: 'Mapas de quantidades, medições e orçamentação para apoio à adjudicação da obra.',
  maquete: 'Maquete física ou modelo 3D para estudo ou apresentação.',
  renderizacoes: 'Imagens fotorrealistas e vistas 3D para divulgação ou aprovação.',
  fotografia_obra: 'Registo fotográfico final da obra concluída (sessão única). Realizado pelo fotógrafo Ivo Tavares (ivotavares.net). Valor indicativo entre 1000€ e 1500€ conforme âmbito.',
  estudo_viabilidade: 'Análise preliminar de viabilidade técnica, regulamentar ou económica.',
  relatorio_tecnico: 'Relatório, parecer ou diagnose técnica conforme solicitação.',
  plantas_asbuilt: 'Levantamento e plantas do edificado existente.',
  fiscalizacao_visita: 'Fiscalização de obra por visita (valor por visita).',
  fiscalizacao_avenca: 'Fiscalização de obra por avença mensal.',
  alteracao_projeto_obra: 'Alterações ao projeto de arquitetura solicitadas pelo cliente durante o decurso da obra. 1500€ para projetos até 250 m²; superior a 250 m² sob consulta prévia.',
  consulta_processo_camarario: 'Consulta ao processo camarário e respetiva sugestão de valor (análise de viabilidade, parecer sobre licenciamento ou documentação municipal).',
  reunioes_adicionais: 'Reuniões adicionais além das incluídas no âmbito (apresentações, validações ou diligências). Valor por reunião.',
  deslocacoes: 'Deslocações fora da área previamente acordada.',
  certificacao_energetica: 'Certificado de desempenho energético do edifício.',
  fotogrametria: 'Levantamento topográfico ou fotogramétrico por via aérea.',
  ensaios_in_situ: 'Ensaios termográficos, acústicos ou outros in situ.',
  simulacao_energetica: 'Simulação dinâmica para certificação ou projeto de eficiência energética.',
};

// Nota metodologia BIM (proposta)
const NOTA_BIM = 'Todo o processo é desenvolvido em metodologia BIM (Building Information Modeling / Modelação da Informação da Construção), utilizando modelos digitais 3D que integram informação geométrica e alfanumérica do edificado. O desenvolvimento contempla imagens interiores e exteriores não fotorealistas de apoio à decisão, bem como pormenorização genérica de pontos-chave da construção.';


// Formatar duração em semanas e meses (4 semanas ≈ 1 mês)
function formatarDuracaoSemanasMeses(d: { min: number; max: number; labelKey?: string }, lang: 'pt' | 'en' = 'pt', t?: (key: string, l: 'pt' | 'en') => string): string {
  if (d.labelKey && t) return t(`duration.${d.labelKey}`, lang);
  if (d.labelKey) return lang === 'en' ? (d.labelKey === 'conformeAnaliseCamara' ? 'As per Council analysis' : 'As per notification') : (d.labelKey === 'conformeAnaliseCamara' ? 'Conforme análise da Câmara' : 'Conforme notificação');
  if (d.min <= 0 && d.max <= 0) return '';
  const sep = lang === 'en' ? '.' : ',';
  const fmt = (n: number) => (n % 1 === 0 ? String(n) : parseFloat(n.toFixed(2)).toString().replace('.', sep));
  const mMin = d.min / 4;
  const mMax = d.max / 4;
  const semStr = lang === 'en' ? 'weeks' : 'semanas';
  const mesesStr = mMin === mMax
    ? (mMin === 1 ? (lang === 'en' ? '1 month' : '1 mês') : (lang === 'en' ? `${fmt(mMin)} months` : `${fmt(mMin)} meses`))
    : (lang === 'en' ? `${fmt(mMin)}–${fmt(mMax)} months` : `${fmt(mMin)}–${fmt(mMax)} meses`);
  return `${d.min}–${d.max} ${semStr} (${mesesStr})`;
}

// Duração estimada por fase (semanas) – margem para os projetistas
const DURACAO_ESTIMADA_FASES: { id: string; min: number; max: number; labelKey?: string }[] = [
  { id: 'estudo', min: 2, max: 3 },
  { id: 'ante', min: 3, max: 4 },
  { id: 'licenciamento_entrega', min: 2, max: 6 },
  { id: 'licenciamento_notificacao', min: 0, max: 0, labelKey: 'conformeAnaliseCamara' },
  { id: 'aprovacao_final', min: 0, max: 0, labelKey: 'conformeNotificacao' },
];

// Exclusões genéricas de arquitetura (aplicadas por defeito; exceções por tipologia/categoria abaixo)
const EXCLUSOES_GENERICAS_ARQ = [
  'arq_fiscalizacao', 'arq_coord_seguranca', 'arq_licenciamentos', 'arq_geotecnia', 'arq_maquetes',
  'arq_fotogrametria', 'arq_especialidades', 'arq_projeto_execucao', 'arq_alteracoes_briefing', 'arq_deslocacoes', 'arq_tramites',
  'arq_obra_clandestina', 'arq_alteracoes_posteriores', 'arq_certificacao', 'arq_acompanhamento',
  'arq_impressao', 'arq_taxas_entidades', 'arq_mapa_quantidades',
];

// Exceções por CATEGORIA (herdadas por todas as tipologias da categoria)
const CATEGORIA_EXCECOES_REMOVER: Record<string, string[]> = {
  Urbanismo: ['arq_fiscalizacao', 'arq_coord_seguranca', 'arq_certificacao', 'arq_acompanhamento', 'arq_geotecnia'],
  'Apoios de Praia': ['arq_geotecnia', 'arq_certificacao', 'arq_obra_clandestina'],
  Loteamento: ['arq_certificacao', 'arq_acompanhamento'],
};

// Exceções por TIPOLOGIA (sobrepõe-se à categoria; exclusões a remover das genéricas)
const TIPOLOGIA_EXCECOES_REMOVER: Record<string, string[]> = {
  interiores: ['arq_fiscalizacao', 'arq_coord_seguranca', 'arq_geotecnia'],
  paisagismo: ['arq_fiscalizacao', 'arq_coord_seguranca', 'arq_geotecnia'],
  restauro: ['arq_certificacao'],
};

// Exclusões EXTRA por tipologia (a acrescentar além das genéricas)
const EXCLUSOES_EXTRA_TIPOLOGIA: Record<string, string[]> = {
  urbanismo: ['arq_eia', 'arq_consultas_publicas'],
  interiores: ['arq_fornecimento_mobiliario'],
  restauro: ['arq_arqueologia'],
  paisagismo: ['arq_plantio_manutencao'],
  // Loteamento — exclusões específicas
  loteamento_urbano: ['arq_lot_alvara', 'arq_lot_cedencias', 'arq_lot_caducidade', 'arq_lot_topografia', 'arq_lot_estudo_hidraulico', 'arq_lot_pareceres_apa', 'arq_lot_exec_infra', 'arq_lot_registos', 'arq_lot_arq_moradias'],
  loteamento_industrial: ['arq_lot_alvara', 'arq_lot_cedencias', 'arq_lot_caducidade', 'arq_lot_topografia', 'arq_lot_estudo_hidraulico', 'arq_lot_pareceres_apa', 'arq_lot_exec_infra', 'arq_lot_registos', 'arq_lot_arq_moradias'],
  destaque_parcela: ['arq_lot_alvara', 'arq_lot_topografia', 'arq_lot_registos'],
  reparcelamento: ['arq_lot_alvara', 'arq_lot_cedencias', 'arq_lot_topografia', 'arq_lot_pareceres_apa', 'arq_lot_registos'],
  // Apoios de Praia — exclusões específicas do domínio hídrico
  praia_apm: ['arq_poc_concessao', 'arq_poc_ambiental'],
  praia_aps: ['arq_poc_concessao', 'arq_poc_ambiental'],
  praia_apc: ['arq_poc_concessao', 'arq_poc_ambiental'],
  praia_eap: ['arq_poc_concessao', 'arq_poc_ambiental'],
  praia_appd: ['arq_poc_concessao', 'arq_poc_ambiental'],
  praia_ab: ['arq_poc_concessao', 'arq_poc_ambiental'],
  praia_ar: ['arq_poc_concessao', 'arq_poc_ambiental'],
  praia_ec: ['arq_poc_concessao', 'arq_poc_ambiental'],
};

// Exclusões de arquitetura (não incluídas nos honorários)
const EXCLUSOES_ARQUITETURA: { id: string; label: string }[] = [
  { id: 'arq_fiscalizacao', label: 'Fiscalização de obra (geralmente paga separadamente)' },
  { id: 'arq_coord_seguranca', label: 'Coordenação de segurança em obra' },
  { id: 'arq_licenciamentos', label: 'Licenciamentos, taxas e emolumentos' },
  { id: 'arq_geotecnia', label: 'Estudos geotécnicos' },
  { id: 'arq_maquetes', label: 'Maquetes físicas ou virtuais' },
  { id: 'arq_fotogrametria', label: 'Fotografias aéreas / fotogrametria' },
  { id: 'arq_especialidades', label: 'Projetos de especialidades (quando não incluídos)' },
  { id: 'arq_projeto_execucao', label: 'Projeto de Execução (quando não incluído; pormenores genéricos estão incluídos no licenciamento)' },
  { id: 'arq_alteracoes_briefing', label: 'Alterações de briefing ou programa após aprovação' },
  { id: 'arq_deslocacoes', label: 'Deslocações fora da área acordada' },
  { id: 'arq_tramites', label: 'Trâmites com entidades terceiras (sem previsão contratual)' },
  { id: 'arq_obra_clandestina', label: 'Obra clandestina / regularização posterior' },
  { id: 'arq_alteracoes_posteriores', label: 'Projetos de alteração posteriores à licença' },
  { id: 'arq_certificacao', label: 'Certificação energética' },
  { id: 'arq_acompanhamento', label: 'Acompanhamento de concurso de empreitada' },
  // Extras por tipologia
  { id: 'arq_eia', label: 'Estudos de impacto ambiental' },
  { id: 'arq_consultas_publicas', label: 'Consultas públicas e participação cidadã' },
  { id: 'arq_fornecimento_mobiliario', label: 'Fornecimento e aquisição de mobiliário' },
  { id: 'arq_arqueologia', label: 'Arqueologia e acompanhamento em obra' },
  { id: 'arq_plantio_manutencao', label: 'Plantio, rega e manutenção do espaço exterior' },
  { id: 'arq_impressao', label: 'Impressão de projetos (disponibilizados em formato digital)' },
  { id: 'arq_taxas_entidades', label: 'Taxas ANEPC, ADENE, Gás, Colectores e outras entidades licenciadoras' },
  { id: 'arq_mapa_quantidades', label: 'Mapas de quantidades e listas de materiais' },
  // Loteamento
  { id: 'arq_lot_alvara', label: 'Alvará de loteamento e respetivas taxas urbanísticas' },
  { id: 'arq_lot_cedencias', label: 'Cedências ao domínio público (terrenos, infraestruturas)' },
  { id: 'arq_lot_caducidade', label: 'Processos de caducidade ou renovação de alvará' },
  { id: 'arq_lot_topografia', label: 'Levantamento topográfico e geotécnico' },
  { id: 'arq_lot_estudo_hidraulico', label: 'Estudos hidráulicos específicos / bacias de retenção' },
  { id: 'arq_lot_pareceres_apa', label: 'Pareceres APA / ICNF / domínio hídrico / REN-RAN' },
  { id: 'arq_lot_exec_infra', label: 'Projeto de execução de infraestruturas (arruamentos, redes)' },
  { id: 'arq_lot_registos', label: 'Registos, escrituras e operações de destaque/retificação' },
  { id: 'arq_lot_arq_moradias', label: 'Projetos de arquitetura das moradias/edifícios dos lotes individuais' },
  // Apoios de Praia (POC)
  { id: 'arq_poc_concessao', label: 'Processo de concessão / TUPEM (domínio público marítimo)' },
  { id: 'arq_poc_ambiental', label: 'Estudos ambientais e pareceres APA / ICNF (domínio hídrico)' },
];

// Exclusões por especialidade (id da especialidade -> lista de exclusões)
const EXCLUSOES_ESPECIALIDADES: Record<string, { id: string; label: string }[]> = {
  estruturas: [
    { id: 'estr_ensaios', label: 'Ensaios de materiais e betão' },
    { id: 'estr_reforcos', label: 'Reforços estruturais de emergência' },
    { id: 'estr_demolicoes', label: 'Demolições especiais ou controladas' },
    { id: 'estr_monitorizacao', label: 'Monitorização estrutural em obra' },
  ],
  aguas_esgotos: [
    { id: 'agua_etar', label: 'Equipamentos de ETAR / fossa séptica' },
    { id: 'agua_bombas', label: 'Bombas e sistemas de pressão' },
    { id: 'agua_rega', label: 'Projeto de rega e drenagem superficial' },
    { id: 'agua_materiais', label: 'Especificação de materiais e equipamentos' },
  ],
  gas: [
    { id: 'gas_central', label: 'Central de GPL / equipamentos' },
    { id: 'gas_certificacao', label: 'Certificação e inspeção de instalações' },
    { id: 'gas_materiais', label: 'Especificação de materiais' },
  ],
  eletrico: [
    { id: 'elet_quadros', label: 'Quadros elétricos e proteções' },
    { id: 'elet_geradores', label: 'Grupos eletrogéneos / UPS' },
    { id: 'elet_fotovoltaico', label: 'Instalação fotovoltaica' },
    { id: 'elet_materiais', label: 'Especificação de equipamentos e materiais' },
  ],
  ited: [
    { id: 'ited_cablagem', label: 'Cablagem estruturada e passagens' },
    { id: 'ited_equipamentos', label: 'Equipamentos ativos (routers, switches)' },
    { id: 'ited_antena', label: 'Instalação de antena coletiva' },
  ],
  avac: [
    { id: 'avac_equipamentos', label: 'Equipamentos de climatização (máquinas)' },
    { id: 'avac_etiquetagem', label: 'Etiquetagem energética e registos' },
    { id: 'avac_manutencao', label: 'Projeto de manutenção' },
    { id: 'avac_materiais', label: 'Especificação de materiais e condutas' },
  ],
  termico: [
    { id: 'termico_ensaios', label: 'Ensaios in situ (termografia)' },
    { id: 'termico_simulacao', label: 'Simulação dinâmica (SCE)' },
    { id: 'termico_certificacao', label: 'Certificação energética' },
  ],
  scie: [
    { id: 'scie_equipamentos', label: 'Extintores, detetores, sinalização' },
    { id: 'scie_evacuacao', label: 'Projeto de evacuação e sinais' },
    { id: 'scie_fumos', label: 'Controlo de fumo e compartimentação especial' },
    { id: 'scie_vistoria', label: 'Vistoria e conformidade com bombeiros' },
  ],
  domotica: [
    { id: 'domo_equipamentos', label: 'Equipamentos e controladores' },
    { id: 'domo_cablagem', label: 'Cablagem dedicada' },
    { id: 'domo_integracao', label: 'Integração com terceiros (alarmes, AVAC)' },
  ],
  paisagismo: [
    { id: 'pais_plantas', label: 'Fornecimento de plantas e terra' },
    { id: 'pais_irrigacao', label: 'Sistema de irrigação completo' },
    { id: 'pais_iluminacao', label: 'Iluminação exterior' },
    { id: 'pais_equipamentos', label: 'Equipamentos de jardim (mobiliário, fontes)' },
  ],
  interiores: [
    { id: 'int_mobiliario', label: 'Projeto de mobiliário à medida' },
    { id: 'int_materiais', label: 'Especificação de acabamentos e materiais' },
    { id: 'int_decoration', label: 'Decoração e consultoria de imagem' },
  ],
  geotecnia: [
    { id: 'geo_sondagens', label: 'Sondagens e ensaios de campo' },
    { id: 'geo_laboratorio', label: 'Ensaios de laboratório' },
    { id: 'geo_monitorizacao', label: 'Monitorização geotécnica em obra' },
    { id: 'geo_reforco', label: 'Projeto de reforço de taludes/aterros' },
  ],
  coord_especialidades: [
    { id: 'coord_reunioes', label: 'Reuniões presenciais extra' },
    { id: 'coord_alteracoes', label: 'Alterações às especialidades após aprovação' },
    { id: 'coord_vistoria', label: 'Vistorias conjuntas de especialidades' },
  ],
  conservacao: [
    { id: 'cons_ensaios', label: 'Ensaios e análises de materiais históricos' },
    { id: 'cons_arqueologia', label: 'Arqueologia e acompanhamento' },
    { id: 'cons_restauro', label: 'Restauro de elementos artísticos específicos' },
  ],
  acustica: [
    { id: 'acus_ensaios', label: 'Ensaios acústicos in situ' },
    { id: 'acus_simulacao', label: 'Simulação computacional' },
    { id: 'acus_isolamento', label: 'Especificação de materiais de isolamento' },
  ],
  iluminacao: [
    { id: 'ilum_equipamentos', label: 'Equipamentos e luminárias' },
    { id: 'ilum_cablagem', label: 'Cablagem dedicada' },
    { id: 'ilum_certificacao', label: 'Cálculo de luminotécnica certificado' },
  ],
};

// Tipologia -> especialidades associadas (quais fazem sentido para cada tipo de projeto)
const TIPOLOGIA_ESPECIALIDADES: Record<string, string[]> = {
  habitacao_unifamiliar: ['estruturas', 'aguas_esgotos', 'eletrico', 'ited', 'termico', 'acustica', 'paisagismo', 'coord_especialidades'],
  habitacao_coletiva: ['estruturas', 'aguas_esgotos', 'gas', 'eletrico', 'ited', 'avac', 'termico', 'acustica', 'scie', 'coord_especialidades'],
  habitacao_apartamento: ['estruturas', 'aguas_esgotos', 'eletrico', 'ited', 'termico', 'acustica', 'coord_especialidades'],
  habitacao_moradia: ['estruturas', 'aguas_esgotos', 'eletrico', 'ited', 'termico', 'acustica', 'paisagismo', 'coord_especialidades'],
  reabilitacao: ['estruturas', 'aguas_esgotos', 'eletrico', 'termico', 'conservacao', 'coord_especialidades'],
  reabilitacao_integral: ['estruturas', 'aguas_esgotos', 'eletrico', 'termico', 'conservacao', 'paisagismo', 'coord_especialidades'],
  restauro: ['estruturas', 'conservacao', 'geotecnia', 'termico', 'coord_especialidades'],
  comercio: ['estruturas', 'aguas_esgotos', 'eletrico', 'avac', 'termico', 'scie', 'iluminacao', 'coord_especialidades'],
  escritorio: ['estruturas', 'aguas_esgotos', 'eletrico', 'ited', 'avac', 'termico', 'acustica', 'scie', 'domotica', 'coord_especialidades'],
  restaurante: ['estruturas', 'aguas_esgotos', 'gas', 'eletrico', 'avac', 'termico', 'acustica', 'scie', 'coord_especialidades'],
  hotel: ['estruturas', 'aguas_esgotos', 'gas', 'eletrico', 'ited', 'avac', 'termico', 'acustica', 'scie', 'domotica', 'paisagismo', 'interiores', 'coord_especialidades'],
  clinica: ['estruturas', 'aguas_esgotos', 'eletrico', 'avac', 'termico', 'scie', 'acustica', 'coord_especialidades'],
  armazem_comercial: ['estruturas', 'aguas_esgotos', 'eletrico', 'avac', 'termico', 'scie', 'coord_especialidades'],
  industria: ['estruturas', 'aguas_esgotos', 'eletrico', 'avac', 'termico', 'scie', 'geotecnia', 'coord_especialidades'],
  logistica: ['estruturas', 'aguas_esgotos', 'eletrico', 'avac', 'termico', 'scie', 'coord_especialidades'],
  laboratorio: ['estruturas', 'aguas_esgotos', 'eletrico', 'avac', 'termico', 'scie', 'acustica', 'coord_especialidades'],
  equip_educacao: ['estruturas', 'aguas_esgotos', 'eletrico', 'avac', 'termico', 'acustica', 'scie', 'paisagismo', 'coord_especialidades'],
  equip_saude: ['estruturas', 'aguas_esgotos', 'gas', 'eletrico', 'avac', 'termico', 'scie', 'acustica', 'coord_especialidades'],
  equip_cultura: ['estruturas', 'aguas_esgotos', 'eletrico', 'avac', 'termico', 'acustica', 'iluminacao', 'paisagismo', 'coord_especialidades'],
  equip_desporto: ['estruturas', 'aguas_esgotos', 'eletrico', 'avac', 'termico', 'acustica', 'scie', 'iluminacao', 'paisagismo', 'coord_especialidades'],
  equip_administrativo: ['estruturas', 'aguas_esgotos', 'eletrico', 'avac', 'termico', 'acustica', 'scie', 'coord_especialidades'],
  equip_religioso: ['estruturas', 'aguas_esgotos', 'eletrico', 'avac', 'termico', 'conservacao', 'iluminacao', 'coord_especialidades'],
  equip_funerario: ['estruturas', 'aguas_esgotos', 'eletrico', 'avac', 'termico', 'scie', 'coord_especialidades'],
  equip_social: ['estruturas', 'aguas_esgotos', 'eletrico', 'avac', 'termico', 'acustica', 'scie', 'paisagismo', 'coord_especialidades'],
  urbanismo: ['geotecnia', 'coord_especialidades'],
  interiores: ['eletrico', 'avac', 'termico', 'iluminacao', 'domotica'],
  paisagismo: ['aguas_esgotos', 'eletrico', 'iluminacao'],
  anexo: ['estruturas', 'aguas_esgotos', 'eletrico', 'termico', 'coord_especialidades'],
  agricola: ['estruturas', 'aguas_esgotos', 'eletrico', 'termico', 'coord_especialidades'],
  // Loteamento / Operações urbanísticas
  loteamento_urbano: ['topografia', 'geotecnia', 'aguas_esgotos', 'infra_pluviais', 'infra_viarias', 'eletrico', 'infra_ip', 'ited', 'gas', 'paisagismo', 'acustica', 'coord_especialidades'],
  loteamento_industrial: ['topografia', 'geotecnia', 'aguas_esgotos', 'infra_pluviais', 'infra_viarias', 'eletrico', 'infra_ip', 'ited', 'coord_especialidades'],
  destaque_parcela: ['topografia', 'coord_especialidades'],
  reparcelamento: ['topografia', 'geotecnia', 'aguas_esgotos', 'infra_pluviais', 'infra_viarias', 'eletrico', 'infra_ip', 'coord_especialidades'],
  // Apoios de Praia (POC Alcobaça–Cabo Espichel)
  praia_apm: ['estruturas', 'eletrico', 'coord_especialidades'],
  praia_aps: ['estruturas', 'aguas_esgotos', 'eletrico', 'scie', 'coord_especialidades'],
  praia_apc: ['estruturas', 'aguas_esgotos', 'eletrico', 'avac', 'scie', 'coord_especialidades'],
  praia_eap: ['estruturas', 'aguas_esgotos', 'gas', 'eletrico', 'avac', 'scie', 'coord_especialidades'],
  praia_appd: ['estruturas', 'eletrico', 'coord_especialidades'],
  praia_ab: ['estruturas', 'coord_especialidades'],
  praia_ar: ['estruturas', 'eletrico', 'coord_especialidades'],
  praia_ec: ['estruturas', 'aguas_esgotos', 'eletrico', 'scie', 'coord_especialidades'],
};

// Tipologias: minValor = base mínima do projeto; rate = €/m² (acrescenta aos m²)
const TIPOLOGIAS_HONORARIOS: { id: string; name: string; minValor: number; rate: number; categoria: string }[] = [
  // Habitação (mín. 1.500–2.000€)
  { id: 'habitacao_unifamiliar', name: 'Habitação unifamiliar', minValor: 2000, rate: 28, categoria: 'Habitação' },
  { id: 'habitacao_coletiva', name: 'Habitação coletiva', minValor: 1800, rate: 25, categoria: 'Habitação' },
  { id: 'habitacao_apartamento', name: 'Apartamento', minValor: 1500, rate: 25, categoria: 'Habitação' },
  { id: 'habitacao_moradia', name: 'Moradia', minValor: 2000, rate: 28, categoria: 'Habitação' },
  // Reabilitação (mín. 2.000–3.500€)
  { id: 'reabilitacao', name: 'Reabilitação urbana', minValor: 2500, rate: 32, categoria: 'Reabilitação' },
  { id: 'reabilitacao_integral', name: 'Reabilitação integral', minValor: 3000, rate: 35, categoria: 'Reabilitação' },
  { id: 'restauro', name: 'Restauro / conservação', minValor: 3500, rate: 45, categoria: 'Reabilitação' },
  // Comércio e Serviços (mín. 2.000–3.000€)
  { id: 'comercio', name: 'Comércio / loja', minValor: 2000, rate: 35, categoria: 'Comércio e Serviços' },
  { id: 'escritorio', name: 'Escritório', minValor: 2000, rate: 30, categoria: 'Comércio e Serviços' },
  { id: 'restaurante', name: 'Restaurante / bar', minValor: 2500, rate: 38, categoria: 'Comércio e Serviços' },
  { id: 'hotel', name: 'Hotel / hotelaria', minValor: 4000, rate: 40, categoria: 'Comércio e Serviços' },
  { id: 'clinica', name: 'Clínica / consultório', minValor: 2500, rate: 35, categoria: 'Comércio e Serviços' },
  { id: 'armazem_comercial', name: 'Armazém comercial', minValor: 1800, rate: 22, categoria: 'Comércio e Serviços' },
  // Indústria (mín. 1.800–2.500€)
  { id: 'industria', name: 'Indústria', minValor: 2500, rate: 28, categoria: 'Indústria' },
  { id: 'logistica', name: 'Logística / armazém', minValor: 1800, rate: 22, categoria: 'Indústria' },
  { id: 'laboratorio', name: 'Laboratório', minValor: 3000, rate: 38, categoria: 'Indústria' },
  // Equipamentos (mín. 3.000–8.000€)
  { id: 'equip_educacao', name: 'Educação (escola, universidade)', minValor: 5000, rate: 42, categoria: 'Equipamentos' },
  { id: 'equip_saude', name: 'Saúde (hospital, centro de saúde)', minValor: 8000, rate: 48, categoria: 'Equipamentos' },
  { id: 'equip_cultura', name: 'Cultura (museu, biblioteca, teatro)', minValor: 5000, rate: 45, categoria: 'Equipamentos' },
  { id: 'equip_desporto', name: 'Desporto (ginásio, pavilhão)', minValor: 4000, rate: 38, categoria: 'Equipamentos' },
  { id: 'equip_administrativo', name: 'Administrativo público', minValor: 5000, rate: 40, categoria: 'Equipamentos' },
  { id: 'equip_religioso', name: 'Religioso (igreja, capela)', minValor: 3500, rate: 35, categoria: 'Equipamentos' },
  { id: 'equip_funerario', name: 'Funerário', minValor: 3000, rate: 35, categoria: 'Equipamentos' },
  { id: 'equip_social', name: 'Ação social (creche, lar)', minValor: 4500, rate: 40, categoria: 'Equipamentos' },
  // Especiais
  { id: 'urbanismo', name: 'Urbanismo / plano diretor', minValor: 2500, rate: 15, categoria: 'Urbanismo' },
  { id: 'interiores', name: 'Arquitetura de interiores', minValor: 2500, rate: 45, categoria: 'Especiais' },
  { id: 'paisagismo', name: 'Arranjos exteriores', minValor: 2000, rate: 25, categoria: 'Especiais' },
  { id: 'anexo', name: 'Anexo / ampliação', minValor: 1200, rate: 30, categoria: 'Especiais' },
  { id: 'agricola', name: 'Agrícola / rural', minValor: 1500, rate: 22, categoria: 'Especiais' },
  // Loteamento / Operações urbanísticas
  { id: 'loteamento_urbano', name: 'Loteamento urbano', minValor: 4000, rate: 10, categoria: 'Loteamento' },
  { id: 'loteamento_industrial', name: 'Loteamento industrial / logístico', minValor: 3500, rate: 8, categoria: 'Loteamento' },
  { id: 'destaque_parcela', name: 'Destaque de parcela', minValor: 1500, rate: 3, categoria: 'Loteamento' },
  { id: 'reparcelamento', name: 'Reparcelamento', minValor: 2500, rate: 6, categoria: 'Loteamento' },
  // Apoios de Praia — POC Alcobaça–Cabo Espichel (Regulamento de Gestão das Praias Marítimas)
  { id: 'praia_apm', name: 'Apoio de Praia Mínimo (APM)', minValor: 1200, rate: 55, categoria: 'Apoios de Praia' },
  { id: 'praia_aps', name: 'Apoio de Praia Simples (APS)', minValor: 2000, rate: 45, categoria: 'Apoios de Praia' },
  { id: 'praia_apc', name: 'Apoio de Praia Completo (APC)', minValor: 3500, rate: 40, categoria: 'Apoios de Praia' },
  { id: 'praia_eap', name: 'Equipamento c/ funções Apoio Praia (EAP)', minValor: 4000, rate: 42, categoria: 'Apoios de Praia' },
  { id: 'praia_appd', name: 'Apoio Praia Prática Desportiva (APPD)', minValor: 1500, rate: 48, categoria: 'Apoios de Praia' },
  { id: 'praia_ab', name: 'Apoio Balnear (AB)', minValor: 800, rate: 50, categoria: 'Apoios de Praia' },
  { id: 'praia_ar', name: 'Apoio Recreativo (AR)', minValor: 1000, rate: 45, categoria: 'Apoios de Praia' },
  { id: 'praia_ec', name: 'Equipamento Complementar (Ec)', minValor: 1200, rate: 50, categoria: 'Apoios de Praia' },
];

// Tipologias onde o número de pisos influencia os honorários (multiplicador)
const TIPOLOGIAS_COM_PISOS: string[] = [
  'habitacao_unifamiliar', 'habitacao_coletiva', 'habitacao_apartamento', 'habitacao_moradia',
  'reabilitacao', 'reabilitacao_integral', 'restauro',
  'comercio', 'escritorio', 'restaurante', 'hotel', 'clinica', 'armazem_comercial',
  'industria', 'logistica', 'laboratorio',
  'equip_educacao', 'equip_saude', 'equip_cultura', 'equip_desporto', 'equip_administrativo',
  'equip_religioso', 'equip_funerario', 'equip_social',
  'anexo',
];

// Custos de construção por m² (valores indicativos, mercado português 2024-2025)
// min = económico, med = médio, max = premium
const CUSTOS_CONSTRUCAO_M2: Record<string, { min: number; med: number; max: number; duracao: string }> = {
  // Habitação
  habitacao_unifamiliar: { min: 1000, med: 1400, max: 2000, duracao: '12-18 meses' },
  habitacao_coletiva: { min: 900, med: 1200, max: 1600, duracao: '18-30 meses' },
  habitacao_apartamento: { min: 500, med: 800, max: 1200, duracao: '3-6 meses' },
  habitacao_moradia: { min: 1000, med: 1400, max: 2000, duracao: '12-18 meses' },
  // Reabilitação
  reabilitacao: { min: 600, med: 900, max: 1300, duracao: '6-12 meses' },
  reabilitacao_integral: { min: 800, med: 1100, max: 1500, duracao: '10-16 meses' },
  restauro: { min: 1000, med: 1400, max: 2200, duracao: '12-24 meses' },
  // Comércio e Serviços
  comercio: { min: 500, med: 800, max: 1200, duracao: '2-4 meses' },
  escritorio: { min: 450, med: 700, max: 1000, duracao: '2-4 meses' },
  restaurante: { min: 700, med: 1000, max: 1500, duracao: '3-5 meses' },
  hotel: { min: 1200, med: 1600, max: 2200, duracao: '18-30 meses' },
  clinica: { min: 800, med: 1100, max: 1600, duracao: '4-8 meses' },
  armazem_comercial: { min: 350, med: 500, max: 700, duracao: '4-8 meses' },
  // Indústria
  industria: { min: 400, med: 600, max: 900, duracao: '6-12 meses' },
  logistica: { min: 300, med: 450, max: 650, duracao: '4-8 meses' },
  laboratorio: { min: 900, med: 1300, max: 1800, duracao: '6-12 meses' },
  // Equipamentos
  equip_educacao: { min: 900, med: 1200, max: 1600, duracao: '12-24 meses' },
  equip_saude: { min: 1400, med: 1800, max: 2500, duracao: '18-36 meses' },
  equip_cultura: { min: 1200, med: 1600, max: 2200, duracao: '18-30 meses' },
  equip_desporto: { min: 700, med: 1000, max: 1400, duracao: '8-16 meses' },
  equip_administrativo: { min: 900, med: 1200, max: 1600, duracao: '12-24 meses' },
  equip_religioso: { min: 800, med: 1100, max: 1500, duracao: '10-18 meses' },
  equip_funerario: { min: 600, med: 900, max: 1200, duracao: '6-12 meses' },
  equip_social: { min: 900, med: 1200, max: 1600, duracao: '12-20 meses' },
  // Especiais
  urbanismo: { min: 0, med: 0, max: 0, duracao: 'N/A' },
  interiores: { min: 400, med: 700, max: 1200, duracao: '2-4 meses' },
  paisagismo: { min: 80, med: 150, max: 300, duracao: '1-3 meses' },
  anexo: { min: 800, med: 1100, max: 1500, duracao: '3-6 meses' },
  agricola: { min: 300, med: 500, max: 800, duracao: '4-8 meses' },
  // Loteamento (infraestruturas urbanísticas por m² de terreno)
  loteamento_urbano: { min: 80, med: 130, max: 200, duracao: '12-24 meses' },
  loteamento_industrial: { min: 60, med: 100, max: 160, duracao: '10-20 meses' },
  destaque_parcela: { min: 0, med: 0, max: 0, duracao: '3-6 meses' },
  reparcelamento: { min: 50, med: 90, max: 140, duracao: '8-16 meses' },
  // Apoios de Praia (construção modular/leve, ambiente marítimo)
  praia_apm: { min: 800, med: 1200, max: 1800, duracao: '2-4 meses' },
  praia_aps: { min: 900, med: 1300, max: 1900, duracao: '3-5 meses' },
  praia_apc: { min: 1000, med: 1400, max: 2000, duracao: '4-8 meses' },
  praia_eap: { min: 1100, med: 1500, max: 2200, duracao: '6-10 meses' },
  praia_appd: { min: 700, med: 1000, max: 1500, duracao: '2-4 meses' },
  praia_ab: { min: 600, med: 900, max: 1300, duracao: '1-2 meses' },
  praia_ar: { min: 600, med: 900, max: 1400, duracao: '2-3 meses' },
  praia_ec: { min: 800, med: 1200, max: 1800, duracao: '2-4 meses' },
};

// Multiplicador por pisos: 1–2 → 1.0, 3 → 1.05, 4+ → 1.10
function multPisos(numPisos: number): number {
  if (numPisos <= 0 || numPisos <= 2) return 1;
  if (numPisos === 3) return 1.05;
  return 1.1;
}

// Escalões para curva de decrescimento: [área máx m², multiplicador da taxa]
// Ex: até 100m² taxa total, 101–300 a 90%, 301–500 a 85%, >500 a 80%
const ESCALOES_DECRESCIMENTO: [number, number][] = [
  [100, 1],
  [300, 0.9],
  [500, 0.85],
  [1000, 0.8],
  [Infinity, 0.75],
];

// ── Loteamento: Condicionantes urbanísticas ──
const CONDICIONANTES_LOTEAMENTO: { id: string; label: string; impacto: 'baixo' | 'medio' | 'alto' }[] = [
  { id: 'ren', label: 'REN (Reserva Ecológica Nacional)', impacto: 'alto' },
  { id: 'ran', label: 'RAN (Reserva Agrícola Nacional)', impacto: 'alto' },
  { id: 'dominio_hidrico', label: 'Domínio hídrico / linhas de água', impacto: 'alto' },
  { id: 'patrimonio', label: 'Património classificado / zona proteção', impacto: 'medio' },
  { id: 'arruamentos_novos', label: 'Arruamentos novos necessários', impacto: 'medio' },
  { id: 'infra_criticas', label: 'Infraestruturas críticas (rede elétrica MT/AT, gás)', impacto: 'medio' },
  { id: 'servidoes', label: 'Servidões administrativas', impacto: 'medio' },
  { id: 'topografia_acentuada', label: 'Topografia acentuada (declive >15%)', impacto: 'medio' },
  { id: 'zona_inundavel', label: 'Zona inundável / risco', impacto: 'alto' },
  { id: 'acesso_condicionado', label: 'Acesso condicionado / sem frente de estrada', impacto: 'baixo' },
  { id: 'pp_vigente', label: 'Plano de Pormenor (PP) vigente', impacto: 'baixo' },
  { id: 'alvara_anterior', label: 'Alvará de loteamento anterior', impacto: 'baixo' },
];

// ── Loteamento: Cave, Piscina e Arranjos Exteriores ──
const BASEMENT_OPTIONS = {
  nenhuma: { label: 'Sem cave', factor: 1.00 },
  parcial: { label: 'Cave parcial', factor: 1.12 },
  total:   { label: 'Cave total', factor: 1.20 },
} as const;

const POOL_OPTIONS = {
  nenhuma:  { label: 'Sem piscina', factor: 1.00 },
  skimmer:  { label: 'Piscina skimmer', factor: 1.03 },
  overflow: { label: 'Piscina overflow', factor: 1.06 },
} as const;

const POOL_SIZE_LABELS: Record<string, string> = {
  pequena: 'Pequena (< 20 m2)',
  media:   'Media (20-40 m2)',
  grande:  'Grande (> 40 m2)',
};

const EXTERNAL_WORKS_LEVELS = {
  base:     { label: 'Base (minimo regulamentar)', factor: 1.0 },
  completo: { label: 'Completo (projeto de exteriores)', factor: 1.4 },
} as const;

// Add-ons por unidade — valores medianos dos ranges de mercado
const CATALOGO_ADDONS: Record<string, { nome: string; valor: number }> = {
  // Licenciamento
  pool_arch_lic:   { nome: 'Arquitetura piscina (lic.)', valor: 650 },
  pool_eng_lic:    { nome: 'Estruturas+hidraulica piscina (lic.)', valor: 1050 },
  pool_coord_lic:  { nome: 'Coordenacao piscina (lic.)', valor: 175 },
  // Execucao
  pool_arch_exec:  { nome: 'Arquitetura piscina (exec.)', valor: 1050 },
  pool_eng_exec:   { nome: 'Estruturas+hidraulica piscina (exec.)', valor: 1650 },
  pool_coord_exec: { nome: 'Coordenacao piscina (exec.)', valor: 250 },
  // Cave (quando rampas/contencoes complexas)
  basement_arch:   { nome: 'Arquitetura cave (rampas/org.)', valor: 600 },
  basement_eng:    { nome: 'Estruturas cave (contencoes)', valor: 1000 },
};

// IDs de infraestrutura afetados pelo multiplicador de cave
const BASEMENT_AFFECTED_IDS = new Set(['aguas_esgotos', 'aguas_esgotos_dom', 'infra_pluviais', 'geotecnia']);

// Fases específicas de loteamento (substituem ICHPOP)
const FASES_LOTEAMENTO: { id: string; name: string; pct: number; desc: string; descricao: string }[] = [
  {
    id: 'lot_viabilidade',
    name: 'Estudo de viabilidade | Adjudicação',
    pct: 25,
    desc: 'Análise e cenários',
    descricao: 'Recolha e validação de dados (PDM, condicionantes, servidões, infraestruturas existentes). Desenvolvimento de 2–3 cenários de implantação com variação de nº de lotes, acessos e cedências. Quadro de áreas comparativo e recomendação técnica. Entrega ao cliente para decisão.',
  },
  {
    id: 'lot_pip',
    name: 'Pedido de Informação Prévia (PIP)',
    pct: 15,
    desc: 'Submissão PIP (opcional)',
    descricao: 'Elaboração e submissão do PIP à Câmara Municipal para validação prévia da solução urbanística. Inclui memória descritiva, peças desenhadas e quadro regulamentar. Fase opcional — se não contratada, a percentagem redistribui-se.',
  },
  {
    id: 'lot_projeto',
    name: 'Projeto de Loteamento | Entrega',
    pct: 30,
    desc: 'Entrega na Câmara',
    descricao: 'Elaboração do projeto de loteamento para licenciamento: planta de síntese, planta de implantação, quadro de áreas e lotes, perfis, memória descritiva e justificativa, regulamento do loteamento e peças complementares exigidas. Entrega do processo completo na Câmara Municipal.',
  },
  {
    id: 'lot_notificacoes',
    name: 'Notificações e Diligências',
    pct: 20,
    desc: 'Análise na Câmara',
    descricao: 'Acompanhamento do processo na Câmara Municipal. Resposta a notificações, pedidos de esclarecimento e diligências de entidades consultadas (APA, ICNF, gestoras de infraestruturas). Inclui 1 ciclo de revisão por notificação.',
  },
  {
    id: 'lot_aprovacao',
    name: 'Aprovação Final | Alvará',
    pct: 10,
    desc: 'Entrega final',
    descricao: 'Entrega das peças finais para emissão do alvará de loteamento. Inclui eventual retificação de áreas após topografia definitiva e compatibilização com condições impostas pela Câmara.',
  },
];

// Gera assunções automáticas com base nas condicionantes selecionadas
function gerarAssuncoesLoteamento(condicionantes: Set<string>, temTopografia: boolean): string[] {
  const assuncoes: string[] = [];
  if (!temTopografia) {
    assuncoes.push('Áreas e limites de propriedade a confirmar após levantamento topográfico.');
  }
  if (condicionantes.has('ren')) {
    assuncoes.push('Delimitação da REN conforme carta em vigor; sujeita a confirmação pela CCDR.');
  }
  if (condicionantes.has('ran')) {
    assuncoes.push('Área da RAN conforme carta em vigor; desanexação não contemplada nesta proposta.');
  }
  if (condicionantes.has('dominio_hidrico')) {
    assuncoes.push('Linhas de água identificadas em cartografia; delimitação definitiva sujeita a validação pela APA.');
  }
  if (condicionantes.has('arruamentos_novos')) {
    assuncoes.push('Novos arruamentos sujeitos a aprovação camarária e dimensionamento conforme regulamento municipal.');
  }
  if (condicionantes.has('infra_criticas')) {
    assuncoes.push('Ligações a infraestruturas existentes sujeitas a parecer das entidades gestoras (EDP, Águas, Gás).');
  }
  if (condicionantes.has('zona_inundavel')) {
    assuncoes.push('Zona inundável identificada; solução sujeita a estudo hidráulico específico (não incluído).');
  }
  if (condicionantes.has('patrimonio')) {
    assuncoes.push('Proximidade a património classificado; sujeito a parecer da DGPC/DRC.');
  }
  if (condicionantes.size === 0) {
    assuncoes.push('Inexistência de condicionantes não identificadas à data da proposta.');
  }
  assuncoes.push('Acessos existentes ao prédio em condições de utilização.');
  // P5: Cláusula de reorçamentação para condicionantes novas
  assuncoes.push('Se surgirem condicionantes não identificadas à data (REN, RAN, servidões, áreas protegidas), será apresentada adenda com impacto no prazo e orçamento, sujeita a aprovação do cliente.');
  // P6: Especialidades (licenciamento) vs Execução (obra)
  assuncoes.push('Os projetos de especialidades incluídos destinam-se ao licenciamento urbanístico. Projetos de execução para obra (detalhe construtivo, mapas de quantidades, cadernos de encargos) constituem fase posterior, não incluída salvo indicação expressa.');
  // P7: Alterações pedidas pela Câmara
  assuncoes.push('Estão incluídas até 2 rondas de resposta a notificações da CM. Alterações substanciais ao projeto motivadas por exigências da CM fora do briefing inicial serão orçamentadas separadamente, mediante proposta de trabalhos adicionais.');
  return assuncoes;
}

// Calcula complexidade sugerida com base nas condicionantes
function calcularComplexidadeLoteamento(condicionantes: Set<string>): string {
  let score = 0;
  for (const id of condicionantes) {
    const cond = CONDICIONANTES_LOTEAMENTO.find(c => c.id === id);
    if (!cond) continue;
    if (cond.impacto === 'alto') score += 3;
    else if (cond.impacto === 'medio') score += 2;
    else score += 1;
  }
  if (score >= 6) return 'alta';
  if (score >= 3) return 'media';
  return 'baixa';
}

// ── Loteamento: Entregáveis (checklist) ──
const ENTREGAVEIS_LOTEAMENTO: { id: string; label: string; obrigatorio: boolean }[] = [
  { id: 'viability_report', label: 'Relatório de viabilidade urbanística', obrigatorio: true },
  { id: 'alternatives', label: 'Alternativas de implantação (A/B/C)', obrigatorio: true },
  { id: 'synthesis_plan', label: 'Planta de síntese do loteamento', obrigatorio: true },
  { id: 'descriptive_report', label: 'Memória descritiva e justificativa', obrigatorio: true },
  { id: 'areas_table', label: 'Quadro de áreas e lotes', obrigatorio: true },
  { id: 'pip', label: 'Pedido de Informação Prévia (PIP)', obrigatorio: false },
  { id: 'licensing_submission', label: 'Preparação e submissão do licenciamento', obrigatorio: true },
  { id: 'specialties_coord', label: 'Coordenação de especialidades de infraestruturas', obrigatorio: false },
  { id: 'regulation', label: 'Regulamento do loteamento', obrigatorio: false },
  { id: 'massing_3d', label: 'Volumetria 3D (apoio à decisão)', obrigatorio: false },
];

// Gera dependências automáticas (separadas das assunções)
function gerarDependenciasLoteamento(
  condicionantes: Set<string>,
  temTopografia: boolean,
  cenarios: { accessModel: string; viaInternaComprimento: string }[],
): string[] {
  const deps: string[] = [];
  if (!temTopografia) {
    deps.push('Necessário levantamento topográfico para fechar áreas, cedências e cotas de infraestruturas.');
  }
  if (condicionantes.has('ren') || condicionantes.has('ran')) {
    deps.push('Parecer da CCDR para delimitação de REN/RAN — pode condicionar a área útil de loteamento.');
  }
  if (condicionantes.has('dominio_hidrico')) {
    deps.push('Parecer da APA para delimitação do domínio hídrico e faixa non aedificandi.');
  }
  if (cenarios.some(c => c.accessModel === 'via_interna' || c.accessModel === 'misto')) {
    deps.push('Dimensionamento da via interna sujeito a validação camarária (perfil transversal tipo, pavimentação, infraestruturas).');
  }
  if (condicionantes.has('infra_criticas')) {
    deps.push('Confirmação de capacidade de redes junto das entidades gestoras (EDP, Águas, Gás).');
  }
  return deps;
}

// Labels para access_model
const ACCESS_MODEL_LABELS: Record<string, string> = {
  direto_frente: 'Acesso direto pela frente',
  misto: 'Misto (frente + via interna parcial)',
  via_interna: 'Via interna (arruamento novo)',
};

// Labels para housing_type
const HOUSING_TYPE_LABELS: Record<string, string> = {
  isoladas: 'Moradias isoladas',
  geminadas: 'Moradias geminadas',
  em_banda: 'Moradias em banda',
  misto: 'Misto (isoladas + geminadas)',
};

// ── Inferência automática de tipologia habitacional por largura de lote ──
// Regras baseadas em afastamentos regulamentares típicos (PDM genérico):
//   Isoladas:  2×3m (laterais) + ≥8m edifício → ≥14m de frente
//   Geminadas: 1×3m (1 lateral) + parede meeira + ≥5m → ≥8m
//   Em banda:  paredes meieiras ambos lados → ≥5.5m
const HOUSING_WIDTH_RULES: { tipo: string; minWidth: number; label: string; cor: string }[] = [
  { tipo: 'isoladas',  minWidth: 14,  label: 'Isoladas',           cor: 'emerald' },
  { tipo: 'geminadas', minWidth: 8,   label: 'Geminadas',          cor: 'amber' },
  { tipo: 'em_banda',  minWidth: 5.5, label: 'Em banda',           cor: 'rose' },
];

function inferirTipoHabitacao(larguraLote: number): { tipo: string; label: string; cor: string; todas: string[] } {
  const compativeis = HOUSING_WIDTH_RULES.filter(r => larguraLote >= r.minWidth);
  if (compativeis.length === 0) {
    return { tipo: 'inviavel', label: 'Lote muito estreito', cor: 'red', todas: [] };
  }
  // O primeiro compatível é o "melhor" (isoladas > geminadas > banda)
  return { ...compativeis[0], todas: compativeis.map(c => c.tipo) };
}

function calcularLarguraLote(frenteTerreno: number, numLotes: number, accessModel: string): number {
  if (numLotes <= 0 || frenteTerreno <= 0) return 0;
  // Se via interna, a frente útil não é directamente divisível — usamos 85% como factor de correcção
  const factor = accessModel === 'via_interna' ? 0.85 : accessModel === 'misto' ? 0.90 : 1.0;
  return (frenteTerreno * factor) / numLotes;
}

// Sugere n.º máximo de lotes por tipologia, dado a frente do terreno
// Desconta 2×3m = 6m para afastamentos laterais extremos do prédio
function sugerirLotesPorFrente(frenteTerreno: number): { tipo: string; label: string; lotes: number; largura: number; cor: string }[] {
  if (frenteTerreno <= 0) return [];
  const frenteUtil = Math.max(0, frenteTerreno - 6); // 3m afastamento cada lado
  return HOUSING_WIDTH_RULES.map(r => {
    let lotes = Math.floor(frenteUtil / r.minWidth);
    // Geminadas devem ser par (duas a duas)
    if (r.tipo === 'geminadas' && lotes % 2 !== 0) lotes = Math.max(0, lotes - 1);
    const largura = lotes > 0 ? frenteUtil / lotes : 0;
    return { tipo: r.tipo, label: r.label, lotes, largura, cor: r.cor };
  }).filter(s => s.lotes > 0);
}

// Labels para objetivo principal
const OBJETIVO_LABELS: Record<string, string> = {
  max_lotes: 'Maximizar nº de lotes',
  max_area_lote: 'Maximizar área por lote',
  reduzir_infra: 'Reduzir custos de infraestrutura',
  acelerar_licenciamento: 'Acelerar licenciamento',
};

// Descrições das especialidades (para a proposta)
const DESCRICOES_ESPECIALIDADES: Record<string, string> = {
  estruturas: 'Projeto de estruturas e fundações — dimensionamento conforme regulamentação aplicável (incluindo ação sísmica EC8). Não inclui campanhas geotécnicas, ensaios ou estudos específicos extraordinários.',
  aguas_esgotos: 'Projeto de águas prediais, residuais e pluviais, assegurando a gestão eficiente de águas no edifício e o cumprimento ambiental.',
  gas: 'Projeto de redes de gás, dimensionamento e traçado das instalações em conformidade com a regulamentação de segurança.',
  eletrico: 'Projeto de instalações elétricas, distribuição de energia, proteções e circuitos, de acordo com as normas técnicas.',
  ited: 'Projeto de infraestruturas de telecomunicações no edifício (telefone, internet, televisão), garantindo a conectividade.',
  avac: 'Projeto de climatização e ventilação, sistemas de regulação de temperatura e qualidade do ar interior.',
  termico: 'Estudo térmico e eficiência energética do edifício, conformidade com RCCTE/SCE e certificação energética.',
  scie: 'Ficha ou projeto de segurança contra incêndios em edifícios (SCIE), cumprimento das normas de evacuação e proteção.',
  domotica: 'Projeto de sistemas de automação e gestão técnica centralizada (GTC) do edifício.',
  paisagismo: 'Projeto de arranjos exteriores ao nível de licenciamento: conceito geral, planta de implantação, definição de áreas permeáveis/impermeáveis e enquadramento paisagístico. Não inclui caderno de encargos, medições detalhadas ou projeto de execução de paisagismo.',
  interiores: 'Projeto de arquitetura de interiores, layout, acabamentos e equipamentos dos espaços.',
  geotecnia: 'Estudo geotécnico, caracterização do terreno e definição de soluções de fundações e contenções.',
  coord_especialidades: 'Coordenação e compatibilização dos projetos de especialidades com o projeto de arquitetura/urbanismo. Inclui reuniões de coordenação (quinzenais), compatibilização de peças desenhadas (BIM quando aplicável), compilação de peças finais para entrega à CM, e resposta técnica a notificações de entidades consultadas (SMAS, ANEPC, etc.).',
  conservacao: 'Projeto de conservação e restauro, intervenção em património edificado com critérios de preservação.',
  acustica: 'Estudo acústico, controlo de ruído e melhoria da qualidade sonora nos espaços.',
  iluminacao: 'Projeto de iluminação, natural e artificial, e integração com a arquitetura.',
  // Loteamento / Infraestruturas
  infra_viarias: 'Projeto de infraestruturas viárias, arruamentos, passeios, pavimentos e sinalização, incluindo perfis transversais e longitudinais.',
  infra_pluviais: 'Projeto de rede de águas pluviais e sistema de drenagem superficial e enterrada do loteamento.',
  infra_ip: 'Projeto de iluminação pública (IP), incluindo dimensionamento da rede, seleção de luminárias e postos de transformação.',
  topografia: 'Levantamento topográfico, altimétrico e planimétrico do terreno para suporte ao projeto de loteamento.',
};

const constructionRates: Record<string, number> = {
  economica: 700,
  media: 1000,
  alta: 1500,
  luxo: 2200,
};

const regionMultipliers: Record<string, number> = {
  lisboa: 1.15,
  litoral: 1.05,
  interior: 0.88,
};

const locationRates: Record<string, number> = {
  lisboa: 4500,
  porto: 3800,
  algarve: 4200,
  coimbra: 2800,
  braga: 2600,
  aveiro: 3200,
  leiria: 2500,
  interior: 1800,
};

const typeMultipliers: Record<string, number> = {
  apartamento: 1,
  moradia: 1.15,
  loja: 1.3,
  escritorio: 1.25,
};

const conditionMultipliers: Record<string, number> = {
  novo: 1,
  bom: 0.95,
  medio: 0.85,
  recuperar: 0.7,
};

// Area units: value in m² per 1 unit
const AREA_TO_M2: Record<string, number> = {
  m2: 1,
  ft2: 0.092903,
  in2: 0.00064516,
  yd2: 0.836127,
  ha: 10000,
  ac: 4046.86,
  palmo2: 0.0484,   // 1 palmo = 0.22m → 0.22²
  vara2: 6.97,      // 1 vara = 2.64m → 2.64²
};

export default function CalculatorPage() {
  const { language } = useLanguage();
  const lang = language;
  const { saveCalculatorProposal, proposals } = useData();
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);
  const [showProposalsList, setShowProposalsList] = useState(false);

  // Honorários
  const [honorMode, setHonorMode] = useState<'area' | 'pct'>('area');
  const [area, setArea] = useState('');
  const [projectType, setProjectType] = useState('');
  const [complexity, setComplexity] = useState('');
  const [valorObra, setValorObra] = useState('');
  const [pctHonor, setPctHonor] = useState('8');
  const [curvaDecrescimento, setCurvaDecrescimento] = useState(false);
  const [fasesIncluidas, setFasesIncluidas] = useState<Set<string>>(
    new Set(['estudo', 'ante', 'licenciamento_entrega', 'licenciamento_notificacao', 'aprovacao_final'])
  );
  const [honorLocalizacao, setHonorLocalizacao] = useState<string>('litoral');
  const [numPisos, setNumPisos] = useState('');
  const [clienteNome, setClienteNome] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [projetoNome, setProjetoNome] = useState('');
  const [referenciaProposta, setReferenciaProposta] = useState('');
  const [localProposta, setLocalPropostaRaw] = useState('');
  // Auto-correção: "Camara" → "Câmara", "camara" → "Câmara"
  const setLocalProposta = (val: string) => {
    setLocalPropostaRaw(val.replace(/\bCamar[aá]\b/gi, 'Câmara'));
  };
  const [linkGoogleMaps, setLinkGoogleMaps] = useState('');
  const [extrasValores, setExtrasValores] = useState<Record<string, string>>({});
  const [despesasReembolsaveis, setDespesasReembolsaveis] = useState('');
  const [especialidadesValores, setEspecialidadesValores] = useState<Record<string, string>>({});
  const [exclusoesSelecionadas, setExclusoesSelecionadas] = useState<Set<string>>(new Set());
  const [linkPropostaExibido, setLinkPropostaExibido] = useState<string | null>(null);
  const [linkPropostaCurto, setLinkPropostaCurto] = useState<string | null>(null);
  const [linkPropostaHash, setLinkPropostaHash] = useState<string | null>(null);
  const [propostaFechada, setPropostaFechada] = useState(false);
  const [gerandoLink, setGerandoLink] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const previewRef = useRef<HTMLDivElement | null>(null);

  // CERTO: Novas opções para melhorar propostas
  const [mostrarResumo, setMostrarResumo] = useState(true);
  const [mostrarPacotes, setMostrarPacotes] = useState(false);
  const [mostrarCenarios, setMostrarCenarios] = useState(true);
  const [mostrarGuiaObra, setMostrarGuiaObra] = useState(true);
  const [mostrarFases, setMostrarFases] = useState(true);
  const [mostrarEspecialidades, setMostrarEspecialidades] = useState(true);
  const [mostrarExtras, setMostrarExtras] = useState(true);
  const [mostrarExclusoes, setMostrarExclusoes] = useState(true);
  const [mostrarCondicoes, setMostrarCondicoes] = useState(true);
  const [mostrarMapa, setMostrarMapa] = useState(true);
  const [mostrarEquipa, setMostrarEquipa] = useState(true);
  const [notasAdicionais, setNotasAdicionais] = useState('');
  const [notasExtras, setNotasExtras] = useState('');
  const [areaUnit, setAreaUnit] = useState('m2');

  // ── Campos específicos de loteamento ──
  // Cabeçalho / terreno
  const [lotIdentificacao, setLotIdentificacao] = useState('');
  const [lotAreaTerreno, setLotAreaTerreno] = useState('');
  const [lotFonteArea, setLotFonteArea] = useState('');
  const [lotAreaEstudo, setLotAreaEstudo] = useState('');
  const [lotNumLotes, setLotNumLotes] = useState('');
  const [lotFrenteTerreno, setLotFrenteTerreno] = useState(''); // frente do terreno (m) — driver principal
  const [lotNumAlternativas, setLotNumAlternativas] = useState('2');

  // Terreno — profundidade
  const [lotProfundidade, setLotProfundidade] = useState(''); // profundidade estimada do terreno (m)

  // Contexto urbanístico
  const [lotMunicipioId, setLotMunicipioId] = useState(''); // id do município seleccionado
  const [lotInstrumento, setLotInstrumento] = useState<string>('PDM'); // PDM/PU/PP/outro
  const [lotClassificacaoSolo, setLotClassificacaoSolo] = useState(''); // ex: "Solo Urbano — Espaços Residenciais"
  const [lotAlturaMaxima, setLotAlturaMaxima] = useState('');
  const [lotAfastamentoFrontal, setLotAfastamentoFrontal] = useState('');
  const [lotAfastamentoLateral, setLotAfastamentoLateral] = useState('');
  const [lotAfastamentoPosterior, setLotAfastamentoPosterior] = useState('');
  const [lotAreaMinimaLote, setLotAreaMinimaLote] = useState('');
  const [lotIndiceConstrucao, setLotIndiceConstrucao] = useState('');
  const [lotIndiceImplantacao, setLotIndiceImplantacao] = useState('');
  const [lotProfundidadeMaxConstrucao, setLotProfundidadeMaxConstrucao] = useState('');
  const [lotPercentagemCedencias, setLotPercentagemCedencias] = useState('15'); // default 15%

  // Município seleccionado (computed)
  const lotMunicipioSel = useMemo(() => {
    if (!lotMunicipioId) return null;
    return municipios.find(m => m.id === lotMunicipioId) ?? null;
  }, [lotMunicipioId]);

  // Lista de municípios para dropdown (frequentes primeiro)
  const lotMunicipiosOptions = useMemo(() => {
    const freq = municipios.filter(m => m.frequente).sort((a, b) => a.nome.localeCompare(b.nome));
    const outros = municipios.filter(m => !m.frequente).sort((a, b) => a.nome.localeCompare(b.nome));
    return { freq, outros };
  }, []);

  // Preencher parâmetros ao mudar município
  const preencherParametrosMunicipio = (params: ParametrosUrbanisticos | undefined) => {
    if (!params) return;
    if (params.alturaMaxima) setLotAlturaMaxima(params.alturaMaxima);
    if (params.afastamentoFrontal) setLotAfastamentoFrontal(params.afastamentoFrontal);
    if (params.afastamentoLateral) setLotAfastamentoLateral(params.afastamentoLateral);
    if (params.afastamentoPosterior) setLotAfastamentoPosterior(params.afastamentoPosterior);
    if (params.areaMinimaLote) setLotAreaMinimaLote(params.areaMinimaLote);
    if (params.indiceConstrucao) setLotIndiceConstrucao(params.indiceConstrucao);
    if (params.indiceImplantacao) setLotIndiceImplantacao(params.indiceImplantacao);
    if (params.profundidadeMaxConstrucao) setLotProfundidadeMaxConstrucao(params.profundidadeMaxConstrucao);
    if (params.percentagemCedencias) setLotPercentagemCedencias(params.percentagemCedencias);
  };

  // Programa
  const [lotTipoHabitacao, setLotTipoHabitacao] = useState<string>('isoladas'); // isoladas/geminadas/em_banda/misto
  const [lotObjetivoPrincipal, setLotObjetivoPrincipal] = useState<string>('max_lotes'); // max_lotes/max_area_lote/reduzir_infra/acelerar_licenciamento

  // Documentos disponíveis
  const [lotTemTopografia, setLotTemTopografia] = useState(false);
  const [lotTemCaderneta, setLotTemCaderneta] = useState(false);
  const [lotTemExtratoPDM, setLotTemExtratoPDM] = useState(false);

  // Cenários A/B/C (enriquecidos com access_model)
  type LotCenario = { lotes: string; areaMedia: string; cedencias: string; nota: string; accessModel: string; viaInternaComprimento: string; tipoHabitacao: string };
  const cenarioDefault: LotCenario = { lotes: '', areaMedia: '', cedencias: '', nota: '', accessModel: 'direto_frente', viaInternaComprimento: '', tipoHabitacao: 'auto' };
  const [lotCenarioA, setLotCenarioA] = useState<LotCenario>({ ...cenarioDefault });
  const [lotCenarioB, setLotCenarioB] = useState<LotCenario>({ ...cenarioDefault });
  const [lotCenarioC, setLotCenarioC] = useState<LotCenario>({ ...cenarioDefault });

  // Condicionantes urbanísticas
  const [lotCondicionantes, setLotCondicionantes] = useState<Set<string>>(new Set());

  // Entregáveis (checklist que alimenta o resumo)
  const [lotEntregaveis, setLotEntregaveis] = useState<Set<string>>(new Set([
    'viability_report', 'alternatives', 'synthesis_plan', 'descriptive_report', 'licensing_submission',
  ]));

  // Equipamentos e caves
  const [lotBasement, setLotBasement] = useState<'nenhuma'|'parcial'|'total'>('nenhuma');
  const [lotBasementArea, setLotBasementArea] = useState('');
  const [lotPool, setLotPool] = useState<'nenhuma'|'skimmer'|'overflow'>('nenhuma');
  const [lotPoolPerUnit, setLotPoolPerUnit] = useState(true);
  const [lotPoolUnits, setLotPoolUnits] = useState('');
  const [lotPoolSize, setLotPoolSize] = useState<'pequena'|'media'|'grande'>('media');
  const [lotWaterproofing, setLotWaterproofing] = useState<'normal'|'alta'>('normal');
  const [lotExternalWorks, setLotExternalWorks] = useState<'base'|'completo'>('base');

  // Assunções + Dependências (separadas)
  const [lotAssuncoesManuais, setLotAssuncoesManuais] = useState('');
  const [lotDependenciasManuais, setLotDependenciasManuais] = useState('');

  // Fase 2: Modelo paramétrico de custos de infraestruturas
  const [lotCenarioRef, setLotCenarioRef] = useState<'A' | 'B' | 'C'>('A');
  const [lotCenarioRecomendado, setLotCenarioRecomendado] = useState<'A' | 'B' | 'C' | ''>('');
  const [lotCustosInfraOverrides, setLotCustosInfraOverrides] = useState<Record<string, string>>({});
  const [lotContingenciaOverride, setLotContingenciaOverride] = useState('');

  // Helper: é tipologia de loteamento?
  const isLoteamento = ['loteamento_urbano', 'loteamento_industrial', 'destaque_parcela', 'reparcelamento'].includes(projectType);

  // Sincronizar Área principal com Área em estudo para loteamento
  useEffect(() => {
    if (isLoteamento && lotAreaEstudo && !area) {
      setArea(lotAreaEstudo);
    }
  }, [isLoteamento, lotAreaEstudo]); // eslint-disable-line react-hooks/exhaustive-deps

  // Função: calcular custos paramétricos de infraestruturas (Fase 2)
  // Aceita cenário opcional — se omitido, usa lotCenarioRef
  type InfraCustoItem = { infraId: string; nome: string; unidade: string; quantidade: number; custoUnitario: number; custoRamal: number; subtotal: number; honorarioProjeto: number };
  type InfraResult = { items: InfraCustoItem[]; contingenciaPct: number; subtotalObra: number; totalComContingencia: number; bandaClasse: string; margemPct: number; custoMin: number; custoMax: number };
  const calcularCustosInfra = (cenarioOverride?: 'A' | 'B' | 'C'): InfraResult => {
    const emptyResult: InfraResult = { items: [], contingenciaPct: 0, subtotalObra: 0, totalComContingencia: 0, bandaClasse: 'classe_5', margemPct: 45, custoMin: 0, custoMax: 0 };
    // Cenário de referência (ou override)
    const refKey = cenarioOverride ?? lotCenarioRef;
    const cenRef = refKey === 'C' ? lotCenarioC : refKey === 'B' ? lotCenarioB : lotCenarioA;
    const numLotes = Math.max(0, parseInt(cenRef.lotes, 10) || parseInt(lotNumLotes, 10) || 0);
    if (numLotes <= 0) return emptyResult;
    const temViaInterna = cenRef.accessModel === 'via_interna' || cenRef.accessModel === 'misto';
    const viaComp = Math.max(0, parseFloat(cenRef.viaInternaComprimento) || 0);
    const frenteTerreno = Math.max(0, parseFloat(lotFrenteTerreno) || 0);
    // Comprimento de rede: se via interna, usar comprimento; senão ~80% da frente
    const comprimentoRede = temViaInterna && viaComp > 0 ? viaComp : frenteTerreno * 0.8;
    const areaEstudo = Math.max(0, parseFloat(lotAreaEstudo) || 0);
    const pctCedInfra = Math.max(0, parseFloat(lotPercentagemCedencias) || 15) / 100;
    const areaVerde = areaEstudo * pctCedInfra; // cedências verdes (% do município)
    // Especialidades relevantes para o tipo de loteamento
    const espIds = new Set(TIPOLOGIA_ESPECIALIDADES[projectType] ?? []);
    // Calcular cada item
    const items: InfraCustoItem[] = CATALOGO_CUSTOS_INFRA
      .filter(cat => {
        // Filtrar: só incluir infras relevantes para o projectType
        // aguas_esgotos_dom mapeia para aguas_esgotos na tipologia
        if (cat.id === 'aguas_esgotos_dom') return espIds.has('aguas_esgotos');
        return espIds.has(cat.id);
      })
      .map(cat => {
        const overrideUnit = parseFloat(lotCustosInfraOverrides[cat.id] || '') || 0;
        const custoUnit = overrideUnit > 0 ? overrideUnit : cat.custoUnitario;
        const ramal = cat.custoRamal ?? 0;
        let quantidade = 0;
        let subtotal = 0;
        if (cat.unidade === 'ml') {
          quantidade = comprimentoRede;
          subtotal = quantidade * custoUnit + (ramal > 0 ? ramal * numLotes : 0);
        } else if (cat.unidade === 'lote') {
          quantidade = numLotes;
          subtotal = quantidade * custoUnit;
        } else if (cat.unidade === 'm2') {
          quantidade = cat.id === 'topografia' ? areaEstudo : areaVerde;
          subtotal = quantidade * custoUnit;
        } else { // vg
          quantidade = 1;
          subtotal = custoUnit;
        }
        subtotal = Math.round(subtotal);
        // Multiplicador de cave (aguas, pluviais, geotecnia)
        const bFactor = BASEMENT_OPTIONS[lotBasement].factor;
        if (BASEMENT_AFFECTED_IDS.has(cat.id) && bFactor > 1) {
          subtotal = Math.round(subtotal * bFactor);
        }
        // Multiplicador de arranjos exteriores (paisagismo)
        if (cat.id === 'paisagismo') {
          const extFactor = EXTERNAL_WORKS_LEVELS[lotExternalWorks].factor;
          subtotal = Math.round(subtotal * extFactor);
        }
        const honorarioProjeto = Math.round(subtotal * cat.pctHonorario);
        return { infraId: cat.id, nome: cat.nome, unidade: cat.unidade, quantidade: Math.round(quantidade * 10) / 10, custoUnitario: custoUnit, custoRamal: ramal, subtotal, honorarioProjeto };
      });
    const subtotalObra = items.reduce((s, i) => s + i.subtotal, 0);
    // Contingência
    const overrideCont = parseFloat(lotContingenciaOverride);
    let contingenciaPct: number;
    if (!isNaN(overrideCont) && lotContingenciaOverride.trim() !== '') {
      contingenciaPct = overrideCont;
    } else {
      contingenciaPct = 10;
      if (!lotTemTopografia) contingenciaPct += 5;
      if (complexity === 'alta') contingenciaPct += 5;
      const criticas = ['ren_ran', 'dominio_hidrico', 'servidoes', 'zona_inundavel'];
      const temCriticas = criticas.some(c => lotCondicionantes.has(c));
      if (temCriticas) contingenciaPct += 5;
      // Impermeabilização complexa (lençol freático / solos problemáticos)
      if (lotWaterproofing === 'alta') contingenciaPct += 3;
    }
    const totalComContingencia = Math.round(subtotalObra * (1 + contingenciaPct / 100));
    // Banda de precisão
    let bandaClasse = 'classe_5';
    if (fasesIncluidas.has('lot_projeto') || fasesIncluidas.has('lot_notificacoes')) {
      bandaClasse = 'classe_3';
    } else if (fasesIncluidas.has('lot_pip')) {
      bandaClasse = 'classe_4';
    }
    const margem = BANDAS_PRECISAO[bandaClasse]?.margem ?? 0.45;
    const custoMin = Math.round(totalComContingencia * (1 - margem));
    const custoMax = Math.round(totalComContingencia * (1 + margem));
    return { items, contingenciaPct, subtotalObra, totalComContingencia, bandaClasse, margemPct: margem * 100, custoMin, custoMax };
  };

  // ── Add-ons de piscina (por unidade) ──
  const calcularAddonsPool = (): { items: { id: string; nome: string; unidades: number; valorUnit: number; subtotal: number }[]; total: number } => {
    if (lotPool === 'nenhuma') return { items: [], total: 0 };
    const nUnits = lotPoolPerUnit
      ? Math.max(0, parseInt(lotPoolUnits, 10) || parseInt(lotNumLotes, 10) || 0)
      : 1; // piscina comum = 1 unidade
    if (nUnits <= 0) return { items: [], total: 0 };
    const addonIds: string[] = [];
    // Licenciamento
    if (fasesIncluidas.has('lot_projeto') || fasesIncluidas.has('lot_notificacoes')) {
      addonIds.push('pool_arch_lic', 'pool_eng_lic', 'pool_coord_lic');
    }
    const poolFactor = POOL_OPTIONS[lotPool].factor;
    const items = addonIds.map(id => {
      const cat = CATALOGO_ADDONS[id];
      if (!cat) return null;
      const valorUnit = Math.round(cat.valor * poolFactor);
      return { id, nome: cat.nome, unidades: nUnits, valorUnit, subtotal: Math.round(valorUnit * nUnits) };
    }).filter((x): x is NonNullable<typeof x> => x !== null);
    return { items, total: items.reduce((s, i) => s + i.subtotal, 0) };
  };

  // ── Gerador de opções de cotação (Base / +Cave / +Piscina / +Ambos) ──
  const gerarOpcoesCotacao = (): { label: string; totalSemIVA: number; totalComIVA: number; deltaBase?: number }[] => {
    if (lotBasement === 'nenhuma' && lotPool === 'nenhuma') return [];
    // Valores actuais (com cave + pool se configurados)
    const valorArqAtual = calculateHonorariosArquiteturaBase();
    const valorEspAtual = calculateHonorariosEspecialidades();
    const addonsAtual = calcularAddonsPool();
    const despReemb = parseFloat(despesasReembolsaveis) || 0;
    const servicosAtual = valorArqAtual + valorEspAtual + addonsAtual.total;
    const ivaAtual = servicosAtual * 0.23;
    const totalSemIVAAtual = servicosAtual + despReemb;
    const totalComIVAAtual = totalSemIVAAtual + ivaAtual;

    // Calcular delta de cave (diferença nos honorários de especialidades via infra)
    const bFactor = BASEMENT_OPTIONS[lotBasement].factor;
    const basementDeltaEsp = bFactor > 1 ? Math.round(valorEspAtual * (1 - 1 / bFactor)) : 0;
    // Calcular delta de paisagismo (external works)
    const extFactor = EXTERNAL_WORKS_LEVELS[lotExternalWorks].factor;
    const extDelta = extFactor > 1 ? Math.round(valorEspAtual * 0.05 * (extFactor - 1)) : 0; // ~5% do esp é paisagismo
    const caveDelta = basementDeltaEsp + extDelta;
    const poolDelta = addonsAtual.total;

    const opcoes: { label: string; totalSemIVA: number; totalComIVA: number; deltaBase?: number }[] = [];

    // Base (sem cave, sem pool)
    const baseSemIVA = totalSemIVAAtual - caveDelta - poolDelta;
    const baseIVA = (baseSemIVA - despReemb) * 0.23;
    opcoes.push({ label: 'Base', totalSemIVA: Math.round(baseSemIVA), totalComIVA: Math.round(baseSemIVA + baseIVA) });

    if (lotBasement !== 'nenhuma' && lotPool === 'nenhuma') {
      // Só cave
      opcoes.push({ label: `+ ${BASEMENT_OPTIONS[lotBasement].label}`, totalSemIVA: Math.round(totalSemIVAAtual), totalComIVA: Math.round(totalComIVAAtual), deltaBase: Math.round(caveDelta) });
    } else if (lotBasement === 'nenhuma' && lotPool !== 'nenhuma') {
      // Só pool
      opcoes.push({ label: `+ ${POOL_OPTIONS[lotPool].label}`, totalSemIVA: Math.round(totalSemIVAAtual), totalComIVA: Math.round(totalComIVAAtual), deltaBase: Math.round(poolDelta) });
    } else {
      // Ambos — mostrar separados e combinado
      const caveOnlySemIVA = baseSemIVA + caveDelta;
      const caveOnlyIVA = (caveOnlySemIVA - despReemb) * 0.23;
      opcoes.push({ label: `+ ${BASEMENT_OPTIONS[lotBasement].label}`, totalSemIVA: Math.round(caveOnlySemIVA), totalComIVA: Math.round(caveOnlySemIVA + caveOnlyIVA), deltaBase: Math.round(caveDelta) });

      const poolOnlySemIVA = baseSemIVA + poolDelta;
      const poolOnlyIVA = (poolOnlySemIVA - despReemb) * 0.23;
      opcoes.push({ label: `+ ${POOL_OPTIONS[lotPool].label}`, totalSemIVA: Math.round(poolOnlySemIVA), totalComIVA: Math.round(poolOnlySemIVA + poolOnlyIVA), deltaBase: Math.round(poolDelta) });

      // Combinado (desconto 3%)
      const combinadoDelta = Math.round((caveDelta + poolDelta) * 0.97);
      const combinadoSemIVA = baseSemIVA + combinadoDelta;
      const combinadoIVA = (combinadoSemIVA - despReemb) * 0.23;
      opcoes.push({ label: `+ ${BASEMENT_OPTIONS[lotBasement].label} + ${POOL_OPTIONS[lotPool].label}`, totalSemIVA: Math.round(combinadoSemIVA), totalComIVA: Math.round(combinadoSemIVA + combinadoIVA), deltaBase: Math.round(combinadoDelta) });
    }
    return opcoes;
  };

  // Áreas
  const [areaValue, setAreaValue] = useState('');
  const [fromUnit, setFromUnit] = useState('m2');
  const [toUnit, setToUnit] = useState('ft2');

  // Custo
  const [custoArea, setCustoArea] = useState('');
  const [custoTipo, setCustoTipo] = useState('media');
  const [custoRegiao, setCustoRegiao] = useState('litoral');

  // Imóvel
  const [imovelArea, setImovelArea] = useState('');
  const [imovelLocal, setImovelLocal] = useState('lisboa');
  const [imovelTipo, setImovelTipo] = useState('apartamento');
  const [imovelEstado, setImovelEstado] = useState('bom');

  const formatCurrency = (value: number, l?: 'pt' | 'en') =>
    formatCurrencyLocale(value, l ?? lang);

  // Hash para detetar alterações na proposta após gerar link
  const computeProposalHash = useMemo(() => {
    const data = {
      honorMode, area, projectType, complexity, valorObra, pctHonor,
      curvaDecrescimento, fasesIncluidas: Array.from(fasesIncluidas).sort().join(','),
      honorLocalizacao, numPisos, clienteNome, projetoNome, referenciaProposta,
      localProposta, linkGoogleMaps, extrasValores, despesasReembolsaveis,
      especialidadesValores, exclusoesSelecionadas: Array.from(exclusoesSelecionadas).sort().join(','),
      mostrarResumo, mostrarPacotes, mostrarCenarios, mostrarGuiaObra,
    };
    return JSON.stringify(data);
  }, [
    honorMode, area, projectType, complexity, valorObra, pctHonor,
    curvaDecrescimento, fasesIncluidas, honorLocalizacao, numPisos,
    clienteNome, projetoNome, referenciaProposta, localProposta, linkGoogleMaps,
    extrasValores, despesasReembolsaveis, especialidadesValores, exclusoesSelecionadas,
    mostrarResumo, mostrarPacotes, mostrarCenarios, mostrarGuiaObra,
  ]);

  // Verificar se o link está desatualizado
  const linkDesatualizado = linkPropostaExibido && linkPropostaHash && computeProposalHash !== linkPropostaHash;

  const calculateHonorariosArquiteturaBase = (): number => {
    if (honorMode === 'area') {
      const areaNum = parseFloat(area) || 0;
      const tipologia = TIPOLOGIAS_HONORARIOS.find((t) => t.id === projectType);
      const minValor = tipologia?.minValor ?? 1500;
      const rate = tipologia?.rate ?? 25;
      const mult = complexity === 'alta' ? 1.3 : complexity === 'baixa' ? 0.8 : 1;
      let variavel: number;
      if (curvaDecrescimento && areaNum > 100) {
        variavel = 0;
        let prevMax = 0;
        for (const [maxArea, multEscalao] of ESCALOES_DECRESCIMENTO) {
          const areaNoEscalao = Math.min(areaNum, maxArea) - prevMax;
          if (areaNoEscalao > 0) variavel += areaNoEscalao * rate * mult * multEscalao;
          if (areaNum <= maxArea) break;
          prevMax = maxArea;
        }
      } else {
        variavel = areaNum * rate * mult;
      }
      let val = minValor + variavel;
      const fasesList = isLoteamento ? FASES_LOTEAMENTO : ICHPOP_PHASES;
      const pctFases = Array.from(fasesIncluidas).reduce(
        (s, id) => s + (fasesList.find((p) => p.id === id)?.pct ?? 0),
        0
      );
      val = (val * pctFases) / 100;
      const multRegiao = regionMultipliers[honorLocalizacao] ?? 1;
      const pisosNum = parseInt(numPisos, 10) || 0;
      const multPisosVal = TIPOLOGIAS_COM_PISOS.includes(projectType) ? multPisos(pisosNum) : 1;
      return val * multRegiao * multPisosVal;
    }
    const obra = parseFloat(valorObra) || 0;
    const pct = parseFloat(pctHonor) || 8;
    let val = (obra * pct) / 100;
    const fasesList = isLoteamento ? FASES_LOTEAMENTO : ICHPOP_PHASES;
    const pctFases = Array.from(fasesIncluidas).reduce(
      (s, id) => s + (fasesList.find((p) => p.id === id)?.pct ?? 0),
      0
    );
    val = (val * pctFases) / 100;
    const multRegiao = regionMultipliers[honorLocalizacao] ?? 1;
    return val * multRegiao;
  };

  const calculateHonorariosEspecialidades = (): number => {
    const espIds = TIPOLOGIA_ESPECIALIDADES[projectType] ?? [];
    return espIds.reduce((s, id) => s + (parseFloat(especialidadesValores[id] || '0') || 0), 0);
  };

  const calculateHonorarios = () =>
    totalComIVA;

  const convertArea = () => {
    const value = parseFloat(areaValue) || 0;
    const m2 = value * (AREA_TO_M2[fromUnit] ?? 1);
    const result = m2 / (AREA_TO_M2[toUnit] ?? 1);
    return result;
  };

  const calculateCusto = () => {
    const areaNum = parseFloat(custoArea) || 0;
    const rate = constructionRates[custoTipo] || 1000;
    const region = regionMultipliers[custoRegiao] || 1;
    return areaNum * rate * region;
  };

  const calculateImovel = () => {
    const areaNum = parseFloat(imovelArea) || 0;
    const locRate = locationRates[imovelLocal] || 3000;
    const typeMult = typeMultipliers[imovelTipo] || 1;
    const condMult = conditionMultipliers[imovelEstado] || 1;
    return areaNum * locRate * typeMult * condMult;
  };

  const preencherSugestoesEspecialidades = () => {
    let areaRef = 0;
    if (honorMode === 'area') {
      areaRef = parseFloat(area) || 0;
    } else {
      const obra = parseFloat(valorObra) || 0;
      areaRef = obra > 0 ? Math.round(obra / 1000) : 0; // estimativa: ~1000€/m²
    }
    if (areaRef <= 0) {
      toast.error('Indica a área (m²) ou o valor da obra para obter sugestões.');
      return;
    }
    const espIds = TIPOLOGIA_ESPECIALIDADES[projectType] ?? [];
    const next: Record<string, string> = {};
    for (const id of espIds) {
      const sug = ESPECIALIDADES_SUGESTAO[id];
      if (!sug) continue;
      const variavel = sug.rate > 0 ? areaRef * sug.rate : 0;
      const val = Math.round(Math.max(sug.minValor, variavel) / 50) * 50;
      next[id] = String(val);
    }
    setEspecialidadesValores((prev) => ({ ...prev, ...next }));
    toast.success('Sugestões preenchidas. Ajusta os valores conforme necessário.');
  };

  const getExclusoesArquiteturaParaTipologia = (tipologia: string): string[] => {
    const cat = TIPOLOGIAS_HONORARIOS.find((t) => t.id === tipologia)?.categoria;
    const remover = TIPOLOGIA_EXCECOES_REMOVER[tipologia] ?? (cat ? CATEGORIA_EXCECOES_REMOVER[cat] ?? [] : []);
    const base = EXCLUSOES_GENERICAS_ARQ.filter((id) => !remover.includes(id));
    const extras = EXCLUSOES_EXTRA_TIPOLOGIA[tipologia] ?? [];
    return [...base, ...extras];
  };

  // Auto-aplica exclusões genéricas de arquitetura quando a tipologia muda
  useEffect(() => {
    if (activeCalculator !== 'honorarios') return;
    setExclusoesSelecionadas((prev) => {
      const next = new Set(prev);
      EXCLUSOES_ARQUITETURA.forEach((e) => next.delete(e.id));
      getExclusoesArquiteturaParaTipologia(projectType).forEach((id) => next.add(id));
      return next;
    });
  }, [projectType, activeCalculator]);

  // Atualiza designação do projeto quando a tipologia é selecionada
  useEffect(() => {
    if (activeCalculator !== 'honorarios') return;
    if (projectType) {
      const tipologia = TIPOLOGIAS_HONORARIOS.find((t) => t.id === projectType);
      if (tipologia) setProjetoNome(`Projeto ${tipologia.name}`);
    } else {
      setProjetoNome('');
    }
  }, [projectType, activeCalculator]);

  // Ajustar fases incluídas quando se muda entre loteamento e edificação
  useEffect(() => {
    if (activeCalculator !== 'honorarios' || !projectType) return;
    const lotTipos = ['loteamento_urbano', 'loteamento_industrial', 'destaque_parcela', 'reparcelamento'];
    const isLot = lotTipos.includes(projectType);
    const currentIsLot = Array.from(fasesIncluidas).some(id => id.startsWith('lot_'));
    // Se mudou de tipo (loteamento <-> edificação), resetar fases
    if (isLot && !currentIsLot) {
      // Mudou para loteamento — definir fases de loteamento
      const defaultFases = projectType === 'destaque_parcela'
        ? ['lot_viabilidade', 'lot_projeto', 'lot_aprovacao']
        : ['lot_viabilidade', 'lot_pip', 'lot_projeto', 'lot_notificacoes', 'lot_aprovacao'];
      setFasesIncluidas(new Set(defaultFases));
    } else if (!isLot && currentIsLot) {
      // Mudou de loteamento para edificação — resetar fases ICHPOP
      setFasesIncluidas(new Set(['estudo', 'ante', 'licenciamento_entrega', 'licenciamento_notificacao', 'aprovacao_final']));
    }
  }, [projectType, activeCalculator]);

  // Auto-set complexidade a partir de condicionantes (loteamento)
  useEffect(() => {
    if (!isLoteamento || activeCalculator !== 'honorarios') return;
    if (lotCondicionantes.size > 0) {
      setComplexity(calcularComplexidadeLoteamento(lotCondicionantes));
    } else {
      setComplexity('media');
    }
  }, [lotCondicionantes, isLoteamento, activeCalculator]);

  // Auto-preencher sugestões de especialidades quando a tipologia ou área mudam
  useEffect(() => {
    if (activeCalculator !== 'honorarios' || !projectType) return;
    // Para loteamento, usar modelo paramétrico (Fase 2)
    if (isLoteamento) {
      const ci = calcularCustosInfra();
      if (ci.items.length === 0) return;
      const next: Record<string, string> = {};
      for (const item of ci.items) {
        const espId = item.infraId === 'aguas_esgotos_dom' ? 'aguas_esgotos' : item.infraId;
        const prev = parseFloat(next[espId] || '0');
        const val = Math.round((prev + item.honorarioProjeto) / 50) * 50;
        next[espId] = String(val);
      }
      // Coordenação de especialidades: ~2% do total de obra
      const espIds = TIPOLOGIA_ESPECIALIDADES[projectType] ?? [];
      if (espIds.includes('coord_especialidades')) {
        const coordVal = Math.round((ci.totalComContingencia * 0.02) / 50) * 50;
        next['coord_especialidades'] = String(Math.max(400, coordVal));
      }
      setEspecialidadesValores((prev) => ({ ...prev, ...next }));
      return;
    }
    // Edifícios: modelo original minValor + rate * area
    let areaRef = 0;
    if (honorMode === 'area') {
      areaRef = parseFloat(area) || 0;
    } else {
      const obra = parseFloat(valorObra) || 0;
      areaRef = obra > 0 ? Math.round(obra / 1000) : 0;
    }
    if (areaRef <= 0) return;
    const espIds = TIPOLOGIA_ESPECIALIDADES[projectType] ?? [];
    if (espIds.length === 0) return;
    const next: Record<string, string> = {};
    for (const id of espIds) {
      const sug = ESPECIALIDADES_SUGESTAO[id];
      if (!sug) continue;
      const variavel = sug.rate > 0 ? areaRef * sug.rate : 0;
      const val = Math.round(Math.max(sug.minValor, variavel) / 50) * 50;
      next[id] = String(val);
    }
    setEspecialidadesValores((prev) => ({ ...prev, ...next }));
  }, [projectType, activeCalculator, area, valorObra, honorMode, isLoteamento, lotFrenteTerreno, lotNumLotes, lotAreaEstudo, lotCenarioRef, lotCenarioA, lotCenarioB, lotCenarioC, lotCustosInfraOverrides, lotContingenciaOverride, lotTemTopografia, complexity, lotCondicionantes]);

  // Atualiza extras com fórmula (tetoMinimo + taxaPorM2) quando a área muda
  useEffect(() => {
    if (activeCalculator !== 'honorarios') return;
    const areaRef = honorMode === 'area' ? parseFloat(area) || 0 : Math.round((parseFloat(valorObra) || 0) / 1000);
    if (areaRef <= 0) return;
    const next: Record<string, string> = {};
    for (const e of EXTRAS_PROPOSTA) {
      if (e.tipo !== 'por_m2' || e.taxaPorM2 == null) continue;
      const base = e.tetoMinimo ?? 0;
      const val = Math.round((base + areaRef * e.taxaPorM2) / 50) * 50;
      if (val > 0) next[e.id] = String(val);
    }
    if (Object.keys(next).length > 0) {
      setExtrasValores((prev) => ({ ...prev, ...next }));
    }
  }, [area, valorObra, honorMode, activeCalculator]);

  const preencherSugestoesExclusoes = () => {
    const next = new Set<string>(getExclusoesArquiteturaParaTipologia(projectType));
    const espIds = (TIPOLOGIA_ESPECIALIDADES[projectType] ?? []).filter(
      (id) => parseFloat(especialidadesValores[id] || '0') > 0
    );
    espIds.forEach((espId) => {
      (EXCLUSOES_ESPECIALIDADES[espId] ?? []).forEach((e) => next.add(e.id));
    });
    setExclusoesSelecionadas(next);
    toast.success('Exclusões sugeridas. Marca/desmarca conforme o contrato.');
  };

  const preencherSugestoesExtras = () => {
    const next: Record<string, string> = {};
    for (const e of EXTRAS_PROPOSTA) {
      if (e.tipo === 'por_visita' || e.tipo === 'por_avenca') continue; // manual: utilizador indica quantidade
      let val: number;
      if (e.tipo === 'por_m2' && e.taxaPorM2 != null) {
        const base = e.tetoMinimo ?? 0;
        val = Math.round((base + areaRef * e.taxaPorM2) / 50) * 50;
      } else {
        val = e.valorSugerido;
      }
      if (val > 0) next[e.id] = String(val);
    }
    setExtrasValores((prev) => ({ ...prev, ...next }));
    toast.success('Sugestões de extras preenchidas.');
  };

  const toggleExclusao = (id: string) => {
    setExclusoesSelecionadas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const valorArqBase = calculateHonorariosArquiteturaBase();
  const despesasReemb = parseFloat(despesasReembolsaveis) || 0;
  const valorArq = valorArqBase + despesasReemb;
  const valorEsp = calculateHonorariosEspecialidades();
  const areaRef = honorMode === 'area' ? parseFloat(area) || 0 : Math.round((parseFloat(valorObra) || 0) / 1000);
  const valorExtras = EXTRAS_PROPOSTA.reduce((s, e) => s + (parseFloat(extrasValores[e.id] || '0') || 0), 0);
  const totalServicosSemIVA = valorArqBase + valorEsp;
  const totalSemIVA = totalServicosSemIVA + despesasReemb;
  const valorIVA = totalServicosSemIVA * 0.23;
  const totalComIVA = totalSemIVA + valorIVA;

  const gerarReferenciaAuto = (): string => {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const parteData = `${yy}${mm}`;
    let parteCliente = '';
    if (clienteNome.trim()) {
      const words = clienteNome.trim().split(/\s+/).filter(Boolean);
      if (words.length >= 2) {
        parteCliente = (words[0][0] + words[words.length - 1][0]).toUpperCase();
      } else if (words.length === 1 && words[0].length >= 2) {
        parteCliente = words[0].slice(0, 2).toUpperCase();
      } else {
        parteCliente = words[0]?.slice(0, 2).toUpperCase() ?? '';
      }
    }
    let parteLocal = '';
    if (localProposta.trim()) {
      const words = localProposta.trim().split(/\s+/).filter(Boolean);
      const ultima = words[words.length - 1] ?? '';
      parteLocal = (ultima.length >= 3 ? ultima.slice(0, 3) : ultima).toUpperCase().replace(/[ÃÁÀÂ]/g, 'A').replace(/[ÕÓÒÔ]/g, 'O').replace(/[ÊÉÈ]/g, 'E');
    } else {
      const abrev: Record<string, string> = { lisboa: 'LIS', litoral: 'LIT', interior: 'INT' };
      parteLocal = abrev[honorLocalizacao] ?? honorLocalizacao.slice(0, 3).toUpperCase();
    }
    if (!parteCliente && !parteLocal) return `REF_${parteData}`;
    const partes = [parteCliente, parteLocal, parteData].filter(Boolean);
    return partes.join('_');
  };

  const referenciaExibida = referenciaProposta.trim() || gerarReferenciaAuto();

  // Handler para quando um cliente existente é selecionado
  const handleClientSelect = (client: Client | null) => {
    setSelectedClient(client);
    if (client) {
      // Auto-preencher local se disponível e campo estiver vazio
      if (client.municipality && !localProposta.trim()) {
        setLocalProposta(client.municipality);
      }
    }
  };

  const validarProposta = (): boolean => {
    if (!clienteNome.trim()) {
      toast.error(t('proposalValidation.clientRequired', lang));
      return false;
    }
    if (honorMode === 'area') {
      const areaNum = parseFloat(area) || 0;
      if (areaNum <= 0) {
        toast.error(t('proposalValidation.areaRequired', lang));
        return false;
      }
    } else {
      const obra = parseFloat(valorObra) || 0;
      if (obra <= 0) {
        toast.error(t('proposalValidation.valorObraRequired', lang));
        return false;
      }
    }
    if (!projectType) {
      toast.error(t('proposalValidation.typologyRequired', lang));
      return false;
    }
    return true;
  };

  const exportHonorariosPDF = async () => {
    if (!validarProposta() || !previewPayload) return;
    
    // Guardar proposta e cliente automaticamente
    saveCalculatorProposal({
      clientName: clienteNome.trim(),
      reference: referenciaExibida,
      projectName: projetoNome.trim(),
      projectType: projectType,
      location: localProposta.trim() || undefined,
      area: parseFloat(area) || undefined,
      architectureValue: valorArq,
      specialtiesValue: valorEsp,
      extrasValue: valorExtras,
      totalValue: totalSemIVA,
      totalWithVat: totalComIVA,
      vatRate: 23,
    });
    
    // ABORDAGEM: Clonar o preview DOM que já está renderizado corretamente
    // Evita TODOS os problemas de React re-render + createPortal + position:fixed
    toast.loading('A preparar PDF...', { id: 'pdf-progress' });
    
    // Obter o preview que já está visível e funcional no ecrã
    const previewEl = previewRef.current;
    if (!previewEl) {
      toast.dismiss('pdf-progress');
      toast.error('Preview não encontrado. Abre a pré-visualização primeiro.');
      return;
    }
    
    // Criar div limpo com o conteúdo do preview (innerHTML preserva inline styles)
    const captureDiv = document.createElement('div');
    captureDiv.style.cssText = [
      'width:794px',
      'min-width:794px',
      'background:#ffffff',
      'color:#1F2328',
      'overflow:visible',
      "font-family:'DM Sans','Segoe UI',system-ui,sans-serif",
    ].join(';');
    captureDiv.innerHTML = previewEl.innerHTML;
    document.body.appendChild(captureDiv);
    
    // Forçar reflow e aguardar layout completo
    void captureDiv.offsetHeight;
    await new Promise((r) => setTimeout(r, 400));
    await new Promise((r) => requestAnimationFrame(r));
    
    try {
      // Verificar que o div tem conteúdo com altura real
      if (captureDiv.offsetHeight < 100) {
        throw new Error(`Div de captura sem altura (height=${captureDiv.offsetHeight})`);
      }
      
      const baseName = `${(referenciaExibida || 'Proposta').replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}`;
      await generateProposalPdf(captureDiv, {
        filename: `${baseName}.pdf`,
        reference: referenciaExibida,
        branding: previewPayload.branding,
        lang,
        onProgress: (msg) => toast.loading(msg, { id: 'pdf-progress' }),
      });
      toast.dismiss('pdf-progress');
      toast.success('PDF guardado com sucesso!');
    } catch (e) {
      console.error('Erro ao gerar PDF:', e);
      toast.dismiss('pdf-progress');
      toast.error(`Erro ao gerar PDF: ${e instanceof Error ? e.message : 'desconhecido'}`);
    } finally {
      // Remover div de captura do DOM
      try { document.body.removeChild(captureDiv); } catch { /* ignore */ }
    }
  };

  const LOCALIZACAO_LABELS: Record<string, string> = { lisboa: 'Lisboa (+15%)', litoral: 'Litoral (+5%)', interior: 'Interior (−12%)' };

  const buildProposalPayload = (): ProposalPayload => {
    const currentPhases = isLoteamento ? FASES_LOTEAMENTO : ICHPOP_PHASES;
    const soma = Array.from(fasesIncluidas).reduce((s, i) => s + (currentPhases.find((x) => x.id === i)?.pct ?? 0), 0);
    const headerLabel = isLoteamento ? 'Urbanismo (até aprovação)' : t('proposal.paymentPhasesArq', lang);
    const fasesPagamento: { nome: string; pct?: number; valor?: number; isHeader?: boolean }[] = [
      { nome: `${headerLabel} — 100%`, isHeader: true },
      ...Array.from(fasesIncluidas).map((id) => {
        const p = currentPhases.find((x) => x.id === id);
        if (!p) return null;
        const v = soma > 0 ? (valorArq * p.pct) / soma : 0;
        const nome = isLoteamento ? p.name : t(`phases.${id}_name`, lang);
        return { nome, pct: p.pct, valor: v };
      }).filter(Boolean) as { nome: string; pct: number; valor: number }[],
    ];
    if (valorEsp > 0) {
      fasesPagamento.push({ nome: `${t('proposal.paymentPhasesEsp', lang)} — 100%`, isHeader: true });
      fasesPagamento.push({ nome: t('specialties.deliver1', lang), pct: 50, valor: valorEsp * 0.5 });
      fasesPagamento.push({ nome: t('specialties.deliver2', lang), pct: 50, valor: valorEsp * 0.5 });
    }
    const espComValor = ((TIPOLOGIA_ESPECIALIDADES[projectType] ?? []) as string[])
      .filter((id) => parseFloat(especialidadesValores[id] || '0') > 0)
      .map((id) => ({
        nome: ESPECIALIDADES.find((e) => e.id === id)?.name ?? id,
        valor: parseFloat(especialidadesValores[id] || '0'),
      }));
    const exclusoesLabels: string[] = [];
    Array.from(exclusoesSelecionadas).forEach((id) => {
      const arq = EXCLUSOES_ARQUITETURA.find((e) => e.id === id);
      if (arq) exclusoesLabels.push(arq.label);
      else {
        for (const arr of Object.values(EXCLUSOES_ESPECIALIDADES)) {
          const found = arr.find((e) => e.id === id);
          if (found) { exclusoesLabels.push(found.label); break; }
        }
      }
    });
    const descricaoFases = Array.from(fasesIncluidas).map((id) => {
      const p = currentPhases.find((x) => x.id === id);
      if (!p) return null;
      const nome = isLoteamento ? p.name : t(`phases.${id}_name`, lang);
      const descricao = isLoteamento ? (p as typeof FASES_LOTEAMENTO[number]).descricao ?? '' : t(`phases.${id}_desc`, lang);
      return { nome, pct: p.pct, descricao };
    }).filter(Boolean) as { nome: string; pct: number; descricao: string }[];
    const especialidadesDescricoes = espComValor.map((e) => {
      const espId = ESPECIALIDADES.find((x) => x.name === e.nome)?.id;
      return { nome: e.nome, descricao: espId ? (DESCRICOES_ESPECIALIDADES[espId] ?? '') : '' };
    });
    const payload: ProposalPayload = {
      lang,
      ref: referenciaExibida,
      data: formatDate(new Date(), lang),
      cliente: clienteNome,
      projeto: projetoNome,
      local: localProposta.replace(/\bCamara\b/gi, 'Câmara').replace(/\bCamará\b/gi, 'Câmara'),
      linkGoogleMaps: linkGoogleMaps.trim() || undefined,
      modo: honorMode === 'area' ? `${t('calc.modeByArea', lang)} (${area} m²)` : `${t('calc.modeByPct', lang)} (${valorObra}€)`,
      area: honorMode === 'area' ? area : undefined,
      valorObra: honorMode === 'pct' ? valorObra : undefined,
      tipologia: TIPOLOGIAS_HONORARIOS.find((tp) => tp.id === projectType)?.name ?? '',
      complexidade: complexity ? t(`complexity.${complexity}`, lang) : '',
      ...(TIPOLOGIAS_COM_PISOS.includes(projectType) && numPisos.trim() ? { pisos: parseInt(numPisos, 10) || undefined } : {}),
      fasesPct: Array.from(fasesIncluidas).reduce((s, id) => s + (currentPhases.find((p) => p.id === id)?.pct ?? 0), 0),
      localizacao: (localProposta.trim() || (LOCALIZACAO_LABELS[honorLocalizacao] ?? honorLocalizacao)).replace(/\bCamara\b/gi, 'Câmara').replace(/\bCamará\b/gi, 'Câmara'),
      iva: '23%',
      despesasReemb: parseFloat(despesasReembolsaveis) || undefined,
      valorArq,
      especialidades: espComValor,
      valorEsp,
      extras: EXTRAS_PROPOSTA.filter((e) => parseFloat(extrasValores[e.id] || '0') > 0).map((e) => ({
        nome: e.nome,
        valor: parseFloat(extrasValores[e.id] || '0'),
      })),
      valorExtras,
      total: totalComIVA,
      totalSemIVA,
      valorIVA,
      fasesPagamento,
      descricaoFases,
      notaBim: isLoteamento
        ? 'A proposta é desenvolvida com recurso a modelo digital urbanístico, compatibilização de peças desenhadas e coordenação de especialidades de infraestruturas. A metodologia inclui análise georreferenciada, sobreposição de condicionantes e produção de peças em formato editável (DWG/PDF).'
        : t('longText.notaBim', lang),
      notaReunioes: isLoteamento
        ? `Estão incluídas 8 reuniões de trabalho (presenciais ou remotas): apresentação de cenários, validação com o cliente, diligências na Câmara Municipal e coordenação com entidades. Reuniões adicionais serão faturadas a 75€/h.`
        : (honorMode === 'pct' ? t('longText.reunioesModoPct', lang) : areaRef <= 150 ? t('longText.reunioesAte150', lang) : areaRef <= 300 ? t('longText.reunioes150a300', lang) : t('longText.reunioesAcima300', lang)),
      apresentacao: t('longText.apresentacao', lang),
      especialidadesDescricoes,
      exclusoes: exclusoesLabels,
      // Dados de loteamento (opcionais, presentes apenas para tipologias de loteamento)
      ...(isLoteamento ? {
        isLoteamento: true,
        lotIdentificacao: lotIdentificacao.trim() || undefined,
        lotAreaTerreno: lotAreaTerreno.trim() || undefined,
        lotFonteArea: lotFonteArea || undefined,
        lotAreaEstudo: lotAreaEstudo.trim() || undefined,
        lotNumLotes: lotNumLotes.trim() || undefined,
        lotFrenteTerreno: lotFrenteTerreno.trim() || undefined,
        lotNumAlternativas: parseInt(lotNumAlternativas) || 2,
        // Contexto urbanistico
        lotInstrumento: lotInstrumento || undefined,
        lotClassificacaoSolo: lotClassificacaoSolo.trim() || undefined,
        lotMunicipio: lotMunicipioSel?.nome || undefined,
        lotProfundidade: lotProfundidade.trim() || undefined,
        lotParametros: {
          alturaMaxima: lotAlturaMaxima.trim() || undefined,
          afastamentoFrontal: lotAfastamentoFrontal.trim() || undefined,
          afastamentoLateral: lotAfastamentoLateral.trim() || undefined,
          afastamentoPosterior: lotAfastamentoPosterior.trim() || undefined,
          areaMinimaLote: lotAreaMinimaLote.trim() || undefined,
          indiceConstrucao: lotIndiceConstrucao.trim() || undefined,
          indiceImplantacao: lotIndiceImplantacao.trim() || undefined,
          profundidadeMaxConstrucao: lotProfundidadeMaxConstrucao.trim() || undefined,
          percentagemCedencias: lotPercentagemCedencias.trim() || undefined,
        },
        // Programa
        lotTipoHabitacao: HOUSING_TYPE_LABELS[lotTipoHabitacao] ?? lotTipoHabitacao,
        lotObjetivo: OBJETIVO_LABELS[lotObjetivoPrincipal] ?? lotObjetivoPrincipal,
        // Cenarios com access_model + largura estimada + tipo habitação
        // Auto-cálculo de areaMedia e cedencias como fallback quando o utilizador não preenche
        lotCenarios: [lotCenarioA, lotCenarioB, ...(lotNumAlternativas === '3' ? [lotCenarioC] : [])].map((cen, i) => {
          if (!cen.lotes) return null;
          const frente = parseFloat(lotFrenteTerreno) || 0;
          const nLotes = parseInt(cen.lotes, 10) || 0;
          const largura = calcularLarguraLote(frente, nLotes, cen.accessModel);
          const inferido = largura > 0 ? inferirTipoHabitacao(largura) : null;
          const tipoEfetivo = cen.tipoHabitacao === 'auto' && inferido ? inferido.tipo : cen.tipoHabitacao;
          // Auto-cálculo: cedências e área média/lote (fallback quando campo vazio)
          const areaEst = parseFloat(lotAreaEstudo) || 0;
          const pctCed = parseFloat(lotPercentagemCedencias) || 15;
          const cedenciasAuto = areaEst > 0 ? Math.round(areaEst * pctCed / 100) : 0;
          const areaMediaAuto = areaEst > 0 && nLotes > 0 ? Math.round((areaEst - cedenciasAuto) / nLotes) : 0;
          return {
            ...cen,
            // Usar valor manual se preenchido, senão o auto-calculado
            areaMedia: cen.areaMedia || (areaMediaAuto > 0 ? String(areaMediaAuto) : ''),
            cedencias: cen.cedencias || (cedenciasAuto > 0 ? String(cedenciasAuto) : ''),
            label: String.fromCharCode(65 + i), // A, B, C
            accessModelLabel: ACCESS_MODEL_LABELS[cen.accessModel] ?? cen.accessModel,
            larguraEstimada: largura > 0 ? `${largura.toFixed(1)}m` : undefined,
            tipoHabitacaoLabel: HOUSING_TYPE_LABELS[tipoEfetivo] ?? inferido?.label ?? '—',
          };
        }).filter((x): x is NonNullable<typeof x> => x !== null),
        lotCondicionantes: Array.from(lotCondicionantes).map(id => {
          const c = CONDICIONANTES_LOTEAMENTO.find(x => x.id === id);
          return c ? c.label : id;
        }),
        lotComplexidadeSugerida: calcularComplexidadeLoteamento(lotCondicionantes),
        // Entregaveis
        lotEntregaveis: ENTREGAVEIS_LOTEAMENTO.filter(e => lotEntregaveis.has(e.id)).map(e => e.label),
        // Assuncoes e dependencias (separadas)
        lotAssuncoes: [
          ...gerarAssuncoesLoteamento(lotCondicionantes, lotTemTopografia || lotFonteArea === 'topografia'),
          ...(lotAssuncoesManuais.trim() ? lotAssuncoesManuais.trim().split('\n').filter(Boolean) : []),
        ],
        lotDependencias: [
          ...gerarDependenciasLoteamento(lotCondicionantes, lotTemTopografia || lotFonteArea === 'topografia', [lotCenarioA, lotCenarioB, ...(lotNumAlternativas === '3' ? [lotCenarioC] : [])]),
          ...(lotDependenciasManuais.trim() ? lotDependenciasManuais.trim().split('\n').filter(Boolean) : []),
        ],
        // Fase 2: Custos paramétricos de infraestruturas (por cenário)
        ...(() => {
          const ci = calcularCustosInfra();
          const banda = BANDAS_PRECISAO[ci.bandaClasse];
          // Calcular para CADA cenário (P1: infraestruturas por cenário A/B/C)
          const labels: ('A' | 'B' | 'C')[] = lotNumAlternativas === '3' ? ['A', 'B', 'C'] : ['A', 'B'];
          const perCenario = labels.map(lbl => {
            const r = calcularCustosInfra(lbl);
            return { label: lbl, subtotal: r.subtotalObra, total: r.totalComContingencia, min: r.custoMin, max: r.custoMax, contingenciaPct: r.contingenciaPct };
          });
          return {
            lotCustosInfra: ci.items.map(i => ({
              nome: i.nome, unidade: i.unidade, quantidade: i.quantidade,
              custoUnitario: i.custoUnitario, custoRamal: i.custoRamal > 0 ? i.custoRamal : undefined,
              subtotal: i.subtotal, honorario: i.honorarioProjeto,
            })),
            lotContingenciaPct: ci.contingenciaPct,
            lotCustoObraSubtotal: ci.subtotalObra,
            lotCustoObraTotal: ci.totalComContingencia,
            lotCustoObraMin: ci.custoMin,
            lotCustoObraMax: ci.custoMax,
            lotBandaPrecisao: banda?.label ?? '',
            lotBandaDescricao: banda?.descricao ?? '',
            // Per-scenario breakdown (P1)
            lotCustosInfraPorCenario: perCenario,
            // Cenário recomendado (P2)
            lotCenarioRecomendado: lotCenarioRecomendado || undefined,
          };
        })(),
        // Equipamentos (cave, piscina, exteriores)
        lotBasement: lotBasement !== 'nenhuma' ? BASEMENT_OPTIONS[lotBasement].label : undefined,
        lotBasementArea: lotBasement !== 'nenhuma' && lotBasementArea ? lotBasementArea : undefined,
        lotPool: lotPool !== 'nenhuma' ? POOL_OPTIONS[lotPool].label : undefined,
        lotPoolUnits: lotPool !== 'nenhuma' ? (parseInt(lotPoolUnits, 10) || parseInt(lotNumLotes, 10) || 0) : undefined,
        lotPoolSize: lotPool !== 'nenhuma' ? POOL_SIZE_LABELS[lotPoolSize] : undefined,
        lotPoolPerUnit: lotPool !== 'nenhuma' ? lotPoolPerUnit : undefined,
        lotExternalWorks: EXTERNAL_WORKS_LEVELS[lotExternalWorks].label,
        lotWaterproofing: lotWaterproofing === 'alta' ? 'Alta (lencol freatico / solos problematicos)' : 'Normal',
        // Add-ons piscina
        ...(() => {
          const ap = calcularAddonsPool();
          if (ap.items.length === 0) return {};
          return {
            lotAddonsPool: ap.items.map(i => ({ nome: i.nome, unidades: i.unidades, valorUnit: i.valorUnit, subtotal: i.subtotal })),
            lotAddonsPoolTotal: ap.total,
          };
        })(),
        // Opcoes de cotacao
        ...(() => {
          const opcoes = gerarOpcoesCotacao();
          if (opcoes.length === 0) return {};
          return { lotOpcoesCotacao: opcoes };
        })(),
        // Nota: lotInvestimentoPromotor é calculado em render time no ProposalDocument
        // para não aumentar o tamanho do payload comprimido (link público)
      } : {}),
      notas: isLoteamento ? [
        t('notes.validity', lang),
        t('notes.paymentTranches', lang),
        'Alterações ao programa/briefing após validação do cenário selecionado serão objeto de proposta complementar.',
        t('notes.vatLegal', lang),
        'Visitas ao local e diligências na Câmara Municipal incluídas (até ao limite de reuniões definido).',
        'Proposta não inclui acompanhamento de obra, fiscalização ou projeto de execução de infraestruturas (salvo se indicado nas especialidades).',
        'Inclui 2 ciclos de revisão por fase + 1 ciclo de resposta a notificações da Câmara Municipal.',
        t('notes.revisionLimit', lang),
        t('notes.notificationCycles', lang),
        'O licenciamento é de loteamento — não inclui projetos de arquitetura das moradias/edifícios dos lotes individuais.',
        t('notes.clientResponseTime', lang),
        ...(lotFonteArea !== 'topografia' ? ['Áreas e limites de propriedade sujeitos a confirmação por levantamento topográfico (não incluído).'] : []),
      ] : [
        t('notes.validity', lang),
        t('notes.paymentTranches', lang),
        t('notes.changesAfterStudy', lang),
        t('notes.vatLegal', lang),
        t('notes.siteVisits', lang),
        t('notes.noSupervision', lang),
        t('notes.pormenoresNote', lang),
        // Notas de proteção de margem (CERTO)
        t('notes.revisionLimit', lang),
        t('notes.notificationCycles', lang),
        t('notes.licensingNotExecution', lang),
        t('notes.clientResponseTime', lang),
      ],
      duracaoEstimada: isLoteamento
        ? FASES_LOTEAMENTO.filter(f => fasesIncluidas.has(f.id)).map(f => ({
            nome: f.name,
            duracao: f.id === 'lot_viabilidade' ? '3-4 semanas'
              : f.id === 'lot_pip' ? '2-4 meses (inclui análise Câmara)'
              : f.id === 'lot_projeto' ? '4-6 semanas'
              : f.id === 'lot_notificacoes' ? '2-6 meses (conforme Câmara)'
              : f.id === 'lot_aprovacao' ? '2-4 semanas'
              : 'A definir',
          }))
        : DURACAO_ESTIMADA_FASES.map((d) => {
            const duracao = formatarDuracaoSemanasMeses(d, lang, t);
            const nome = t(`phases.${d.id}_name`, lang);
            return { nome, duracao };
          }).filter((x) => x.duracao),
      extrasComDescricao: [
        // Projeto de Execução Base
        ...(() => {
          const execBase = EXTRAS_PROPOSTA.find((e) => e.id === 'projeto_execucao_base');
          const valorInput = parseFloat(extrasValores['projeto_execucao_base'] || '0') || 0;
          const teto = execBase?.tetoMinimo ?? 2500;
          const taxa = execBase?.taxaPorM2 ?? 15;
          const raw = teto + areaRef * taxa;
          const valorCalculado = areaRef > 0 ? Math.round(raw / 50) * 50 : 0;
          const valor = valorInput > 0 ? valorInput : (areaRef > 0 ? valorCalculado : 0);
          const rawRounded = Math.round(raw);
          const foiArredondado = valorCalculado !== rawRounded;
          const formula = areaRef > 0
            ? foiArredondado
              ? `${teto}€ + (${areaRef} m² × ${taxa}€/m²) = ${rawRounded}€ (arred. ${formatCurrencyPayload(valorCalculado, lang)})`
              : `${teto}€ + (${areaRef} m² × ${taxa}€/m²) = ${formatCurrencyPayload(valorCalculado, lang)}`
            : undefined;
          return [{
            id: 'projeto_execucao_base',
            nome: lang === 'en' ? 'Execution Project (base)' : 'Projeto de Execução (base)',
            valor,
            descricao: EXTRAS_DESCRICOES['projeto_execucao_base'] ?? '',
            ocultarValor: false,
            sobConsulta: valor <= 0,
            formula,
          }];
        })(),
        // Projeto de Execução Completa
        ...(() => {
          const execCompleta = EXTRAS_PROPOSTA.find((e) => e.id === 'projeto_execucao_completa');
          const valorInput = parseFloat(extrasValores['projeto_execucao_completa'] || '0') || 0;
          const teto = execCompleta?.tetoMinimo ?? 4000;
          const taxa = execCompleta?.taxaPorM2 ?? 22;
          const raw = teto + areaRef * taxa;
          const valorCalculado = areaRef > 0 ? Math.round(raw / 50) * 50 : 0;
          const valor = valorInput > 0 ? valorInput : (areaRef > 0 ? valorCalculado : 0);
          const rawRounded = Math.round(raw);
          const foiArredondado = valorCalculado !== rawRounded;
          const formula = areaRef > 0
            ? foiArredondado
              ? `${teto}€ + (${areaRef} m² × ${taxa}€/m²) = ${rawRounded}€ (arred. ${formatCurrencyPayload(valorCalculado, lang)})`
              : `${teto}€ + (${areaRef} m² × ${taxa}€/m²) = ${formatCurrencyPayload(valorCalculado, lang)}`
            : undefined;
          return [{
            id: 'projeto_execucao_completa',
            nome: lang === 'en' ? 'Execution Project (complete)' : 'Projeto de Execução (completa)',
            valor,
            descricao: EXTRAS_DESCRICOES['projeto_execucao_completa'] ?? '',
            ocultarValor: false,
            sobConsulta: valor <= 0,
            formula,
            // Marcar como recomendado para destaque visual
          }];
        })(),
        ...((): { id: string; nome: string; valor: number; descricao: string; ocultarValor: boolean; sobConsulta: boolean; formula?: string }[] => {
          const orcExtra = EXTRAS_PROPOSTA.find((e) => e.id === 'orcamentacao');
          const valorInput = parseFloat(extrasValores['orcamentacao'] || '0') || 0;
          const teto = orcExtra?.tetoMinimo ?? 250;
          const taxa = orcExtra?.taxaPorM2 ?? 3.5;
          const raw = teto + areaRef * taxa;
          const valorCalculado = areaRef > 0 ? Math.round(raw / 50) * 50 : 0;
          const valor = areaRef > 0 ? valorCalculado : valorInput;
          if (valor <= 0) return [];
          // Fórmula clara: mostra cálculo exato e, se arredondado, explica
          const rawRounded = Math.round(raw);
          const foiArredondado = valorCalculado !== rawRounded;
          const formula = areaRef > 0
            ? foiArredondado
              ? `${teto}€ + (${areaRef} m² × ${taxa}€/m²) = ${rawRounded}€ (arred. ${formatCurrencyPayload(valorCalculado, lang)})`
              : `${teto}€ + (${areaRef} m² × ${taxa}€/m²) = ${formatCurrencyPayload(valorCalculado, lang)}`
            : undefined;
          return [{
            id: 'orcamentacao',
            nome: t('extras.orcamentacaoMedicao', lang),
            valor,
            descricao: EXTRAS_DESCRICOES['orcamentacao'] ?? '',
            ocultarValor: false,
            sobConsulta: false,
            formula,
          }];
        })(),
        ...EXTRAS_PROPOSTA.filter((e) => e.id !== 'projeto_execucao_base' && e.id !== 'projeto_execucao_completa' && e.id !== 'orcamentacao' && parseFloat(extrasValores[e.id] || '0') > 0).map((e) => ({
          id: e.id,
          nome: e.nome,
          valor: parseFloat(extrasValores[e.id] || '0'),
          descricao: EXTRAS_DESCRICOES[e.id] ?? '',
          ocultarValor: e.id === 'fotografia_obra',
          sobConsulta: e.id === 'alteracao_projeto_obra' && areaRef > 250,
          sobConsultaPrevia: e.id === 'alteracao_projeto_obra' && areaRef > 250,
        })),
      ],
      branding: { appName: APP_NAME, appSlogan: APP_SLOGAN, architectName: ARCHITECT_NAME, architectOasrn: ARCHITECT_OASRN ?? '', morada: CONTACT_MORADA, email: CONTACT_EMAIL, telefone: CONTACT_PHONE, website: CONTACT_WEBSITE },
      // CERTO: Novos campos para melhorar propostas
      mostrarResumo,
      mostrarPacotes,
      mostrarCenarios,
      mostrarGuiaObra,
      // Resumo executivo automático
      ...(mostrarResumo ? {
        resumoExecutivo: isLoteamento ? {
          incluido: [
            ...(lotFrenteTerreno ? [`Frente do terreno: ${lotFrenteTerreno} m (driver principal de custo)`] : []),
            `Análise urbanística e condicionantes (${lotInstrumento || 'PDM'}, servidões, REN/RAN)`,
            `${lotNumAlternativas} alternativas de implantação com quadro de áreas`,
            ...ENTREGAVEIS_LOTEAMENTO.filter(e => lotEntregaveis.has(e.id)).map(e => e.label),
            ...(espComValor.length > 0 ? ['Coordenação de especialidades de infraestruturas'] : []),
            `${Array.from(fasesIncluidas).reduce((s, id) => s + (currentPhases.find((p) => p.id === id)?.pct ?? 0), 0)}% das fases de urbanismo`,
            '8 reuniões até aprovação (incluindo diligências na Câmara)',
            '2 ciclos revisão/fase + 1 ciclo notificações (limite contratual)',
          ],
          naoIncluido: [
            'Taxas e emolumentos camarários',
            ...(!lotTemTopografia && lotFonteArea !== 'topografia' ? ['Levantamento topográfico / geotécnico'] : []),
            'Pareceres externos (APA/ICNF/infraestruturas)',
            'Projetos de execução de infraestruturas (se não incluídos)',
            'Projetos de arquitetura das moradias dos lotes',
            'Alterações de briefing após validação do cenário',
          ],
          prazoEstimado: lotCondicionantes.size >= 3 ? '18-24 meses (típico)' : lotCondicionantes.size >= 1 ? '12-18 meses (típico)' : '10-14 meses (típico)',
          proximoPasso: 'Adjudicação + reunião de arranque',
        } : {
          incluido: [
            'Projeto de Arquitetura até decisão municipal',
            'Assistência à Obra (8 visitas incluídas)',
            'Imagens 3D não fotorealistas (apoio à decisão)',
            'Pormenorização genérica de pontos-chave',
            ...(espComValor.length > 0 ? ['Projetos de Especialidades'] : []),
            `${Array.from(fasesIncluidas).reduce((s, id) => s + (currentPhases.find((p) => p.id === id)?.pct ?? 0), 0)}% das fases ICHPOP`,
            `${honorMode === 'pct' ? '8-12' : areaRef <= 150 ? '6-8' : areaRef <= 300 ? '8-12' : '12-15'} reuniões até aprovação`,
            '2 ciclos revisão/fase + 1 ciclo notificações (limite contratual)',
          ],
          naoIncluido: [
            'Projeto de Execução (detalhe construtivo para obra)',
            'Direção/Fiscalização de obra',
            'Taxas e emolumentos camarários',
            'Ciclos adicionais por alteração de briefing',
          ],
          prazoEstimado: '10-14 meses (típico)',
          proximoPasso: 'Adjudicação + reunião de arranque',
        },
      } : {}),
      // Cenários de prazo automáticos
      ...(mostrarCenarios ? {
        cenariosPrazo: isLoteamento ? {
          melhorCaso: lotCondicionantes.size >= 3 ? '12-14 meses' : '6-8 meses',
          casoTipico: lotCondicionantes.size >= 3 ? '18-24 meses' : lotCondicionantes.size >= 1 ? '12-18 meses' : '10-14 meses',
          piorCaso: lotCondicionantes.size >= 3 ? '30+ meses' : '18+ meses',
        } : {
          melhorCaso: '6-8 meses',
          casoTipico: '10-14 meses',
          piorCaso: '18+ meses',
        },
      } : {}),
      // Pacotes de serviço (se ativado)
      ...(mostrarPacotes ? {
        pacotes: [
          {
            id: 'essencial' as const,
            nome: t('proposal.packageEssential', lang),
            descricao: t('proposal.packageEssentialDesc', lang),
            valor: totalComIVA,
            recomendado: false,
            itens: [
              'Projeto de Arquitetura',
              ...(espComValor.length > 0 ? ['Projetos de Especialidades'] : []),
              'Acompanhamento até licenciamento',
            ],
          },
          {
            id: 'obra_tranquila' as const,
            nome: t('proposal.packageComfort', lang),
            descricao: t('proposal.packageComfortDesc', lang),
            // Usa Execução Completa (4000 + 22€/m²) no pacote Obra Tranquila
            valor: Math.round((totalComIVA + (4000 + areaRef * 22) * 1.23 + (250 + areaRef * 3.5) * 1.23) / 100) * 100,
            recomendado: true,
            itens: [
              'Tudo do Essencial',
              'Projeto de Execução (completa)',
              'Orçamentação e medições',
              'Reduz derrapagens em obra',
            ],
          },
          {
            id: 'experiencia' as const,
            nome: t('proposal.packageExperience', lang),
            descricao: t('proposal.packageExperienceDesc', lang),
            // Usa Execução Completa (4000 + 22€/m²) no pacote Experiência
            valor: Math.round((totalComIVA + (4000 + areaRef * 22) * 1.23 + (250 + areaRef * 3.5) * 1.23 + 1500 * 1.23 + 400 * 1.23) / 100) * 100,
            recomendado: false,
            itens: [
              'Tudo do Obra Tranquila',
              'Renderizações 3D',
              'Maquete virtual',
              'Ajuda na decisão, reduz revisões',
            ],
          },
        ],
      } : {}),
      // Guia de Obra - custos de construção estimados
      ...(mostrarGuiaObra && projectType ? (() => {
        const custos = CUSTOS_CONSTRUCAO_M2[projectType];
        if (!custos || custos.min === 0) return {};
        const areaCalc = honorMode === 'area' ? parseFloat(area) || 0 : Math.round((parseFloat(valorObra) || 0) / 1000);
        if (areaCalc <= 0) return {};
        return {
          tipologiaId: projectType,
          tipologiaCategoria: TIPOLOGIAS_HONORARIOS.find((t) => t.id === projectType)?.categoria ?? '',
          areaNum: areaCalc,
          custosConstrucao: {
            min: custos.min,
            med: custos.med,
            max: custos.max,
            minTotal: Math.round(areaCalc * custos.min),
            medTotal: Math.round(areaCalc * custos.med),
            maxTotal: Math.round(areaCalc * custos.max),
            duracao: custos.duracao,
          },
        };
      })() : {}),
    };
    return payload;
  };

  const previewPayload = useMemo(() => {
    if (activeCalculator !== 'honorarios') return null;
    return buildProposalPayload();
  }, [
    activeCalculator, lang, referenciaExibida, clienteNome, projetoNome, localProposta, linkGoogleMaps,
    honorMode, area, valorObra, projectType, complexity, numPisos, fasesIncluidas, honorLocalizacao,
    despesasReembolsaveis, valorArq, especialidadesValores, valorEsp, extrasValores, valorExtras,
    totalComIVA, totalSemIVA, valorIVA, exclusoesSelecionadas, areaRef,
    mostrarResumo, mostrarPacotes, mostrarCenarios, mostrarGuiaObra,
  ]);

  // O useEffect de auto-export já não é necessário — o export direto via DOM cobre ambos os casos

  const obterLinkProposta = async () => {
    if (!validarProposta()) return;
    
    setGerandoLink(true);
    
    try {
      // Limpar estado
      setLinkPropostaCurto(null);
      setLinkPropostaExibido(null);
      
      const payload = buildProposalPayload();
      const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '';
      
      let isShortLink = false;
      let finalUrl: string;
      
      // Gerar URL longa como base — usar domínio fixo se configurado
      const publicOrigin = import.meta.env.VITE_PUBLIC_URL || window.location.origin;
      const encoded = encodeProposalPayload(payload);
      const longUrl = `${publicOrigin}${base}/public/proposta?d=${encoded}&lang=${lang}`;
      finalUrl = longUrl;
      
      // Tentar gerar link curto via API (só em produção)
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      if (!isLocalhost) {
        try {
          const response = await fetch('/api/proposals/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              payload,
              reference: referenciaExibida,
              clientName: clienteNome.trim(),
              projectName: projetoNome.trim(),
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.shortId) {
              finalUrl = `${publicOrigin}${base}/p/${data.shortId}`;
              isShortLink = true;
              console.log('[Link] Link curto criado:', finalUrl);
            }
          }
        } catch (e) {
          console.warn('[Link] API falhou, usando link longo:', e);
        }
      }
      
      if (!isShortLink) {
        console.log('[Link] Link longo usado');
      }
      
      // Guardar proposta localmente
      saveCalculatorProposal({
        clientName: clienteNome.trim(),
        reference: referenciaExibida,
        projectName: projetoNome.trim(),
        projectType: projectType,
        location: localProposta.trim() || undefined,
        area: parseFloat(area) || undefined,
        architectureValue: valorArq,
        specialtiesValue: valorEsp,
        extrasValue: valorExtras,
        totalValue: totalSemIVA,
        totalWithVat: totalComIVA,
        vatRate: 23,
        proposalUrl: finalUrl,
        calculatorState: {
          honorMode,
          area,
          projectType,
          complexity,
          valorObra,
          pctHonor,
          curvaDecrescimento,
          fasesIncluidas: Array.from(fasesIncluidas),
          honorLocalizacao,
          numPisos,
          extrasValores,
          despesasReembolsaveis,
          especialidadesValores,
          exclusoesSelecionadas: Array.from(exclusoesSelecionadas),
          notasAdicionais,
          notasExtras,
          mostrarResumo,
          mostrarFases,
          mostrarEspecialidades,
          mostrarExtras,
          mostrarExclusoes,
          mostrarCondicoes,
          mostrarMapa,
          mostrarEquipa,
          mostrarCenarios,
          mostrarGuiaObra,
          linkGoogleMaps,
          areaUnit,
          // Loteamento
          lotIdentificacao, lotAreaTerreno, lotFonteArea, lotAreaEstudo, lotNumLotes, lotFrenteTerreno,
          lotProfundidade, lotMunicipioId,
          lotNumAlternativas, lotInstrumento, lotClassificacaoSolo,
          lotAlturaMaxima, lotAfastamentoFrontal, lotAfastamentoLateral, lotAfastamentoPosterior,
          lotAreaMinimaLote, lotIndiceConstrucao, lotIndiceImplantacao,
          lotProfundidadeMaxConstrucao, lotPercentagemCedencias,
          lotTipoHabitacao, lotObjetivoPrincipal,
          lotTemTopografia, lotTemCaderneta, lotTemExtratoPDM,
          lotCenarioA, lotCenarioB, lotCenarioC,
          lotCondicionantes: Array.from(lotCondicionantes),
          lotEntregaveis: Array.from(lotEntregaveis),
          lotAssuncoesManuais, lotDependenciasManuais,
          // Fase 2: Custos paramétricos
          lotCenarioRef, lotCenarioRecomendado, lotCustosInfraOverrides, lotContingenciaOverride,
        },
      });
      
      // Guardar no histórico de propostas
      addToProposalHistory({
        reference: referenciaExibida,
        clientName: clienteNome.trim(),
        projectName: projetoNome.trim(),
        projectType: projectType,
        location: localProposta.trim() || undefined,
        totalValue: totalSemIVA,
        totalWithVat: totalComIVA,
        shortLink: isShortLink ? finalUrl : undefined,
        longLink: longUrl,
      });
      
      setLinkPropostaExibido(finalUrl);
      setLinkPropostaHash(computeProposalHash);
      
      // Copiar link (pode falhar em alguns contextos)
      try {
        await navigator.clipboard.writeText(finalUrl);
        toast.success(isShortLink ? 'Link curto copiado!' : 'Link da proposta copiado!');
      } catch {
        // Clipboard bloqueado - mostrar link para copiar manualmente
        toast.success(isShortLink ? 'Link curto gerado!' : 'Link gerado! Clica para copiar.');
      }
      
    } catch (err) {
      console.error('[Link] Erro ao gerar link:', err);
      // Mostrar erro detalhado na consola
      if (err instanceof Error) {
        console.error('[Link] Detalhes:', err.message, err.stack);
      }
      toast.error('Erro ao gerar link - ver consola (F12)');
    } finally {
      setGerandoLink(false);
    }
  };

  const unitLabel: Record<string, string> = {
    m2: 'm²', ft2: 'ft²', in2: 'in²', yd2: 'yd²', ha: 'ha', ac: 'ac',
    palmo2: 'palmo²', vara2: 'vara²',
  };

  const resetCalculator = () => {
    setActiveCalculator(null);
    setHonorMode('area');
    setArea('');
    setProjectType('');
    setNumPisos('');
    setComplexity('');
    setValorObra('');
    setPctHonor('8');
    setCurvaDecrescimento(false);
    setFasesIncluidas(new Set(['estudo', 'ante', 'licenciamento_entrega', 'licenciamento_notificacao', 'aprovacao_final']));
    setHonorLocalizacao('litoral');
    setClienteNome('');
    setProjetoNome('');
    setReferenciaProposta('');
    setLocalProposta('');
    setLinkGoogleMaps('');
    setExtrasValores({});
    setLinkPropostaExibido(null);
    setLinkPropostaCurto(null);
    setLinkPropostaHash(null);
    setPropostaFechada(false);
    setDespesasReembolsaveis('');
    setEspecialidadesValores({});
    setExclusoesSelecionadas(new Set());
    setAreaValue('');
    setFromUnit('m2');
    setToUnit('ft2');
    setCustoArea('');
    setCustoTipo('media');
    setCustoRegiao('litoral');
    setImovelArea('');
    setImovelLocal('lisboa');
    setImovelTipo('apartamento');
    setImovelEstado('bom');
    // Reset campos de loteamento
    setLotIdentificacao('');
    setLotAreaTerreno('');
    setLotFonteArea('');
    setLotAreaEstudo('');
    setLotNumLotes('');
    setLotFrenteTerreno('');
    setLotProfundidade('');
    setLotMunicipioId('');
    setLotNumAlternativas('2');
    setLotInstrumento('PDM');
    setLotClassificacaoSolo('');
    setLotAlturaMaxima('');
    setLotAfastamentoFrontal('');
    setLotAfastamentoLateral('');
    setLotAfastamentoPosterior('');
    setLotAreaMinimaLote('');
    setLotIndiceConstrucao('');
    setLotIndiceImplantacao('');
    setLotProfundidadeMaxConstrucao('');
    setLotPercentagemCedencias('15');
    setLotTipoHabitacao('isoladas');
    setLotObjetivoPrincipal('max_lotes');
    setLotTemTopografia(false);
    setLotTemCaderneta(false);
    setLotTemExtratoPDM(false);
    setLotCenarioA({ ...cenarioDefault });
    setLotCenarioB({ ...cenarioDefault });
    setLotCenarioC({ ...cenarioDefault });
    setLotCondicionantes(new Set());
    setLotEntregaveis(new Set(['viability_report', 'alternatives', 'synthesis_plan', 'descriptive_report', 'licensing_submission']));
    setLotAssuncoesManuais('');
    setLotDependenciasManuais('');
    // Fase 2: Custos paramétricos
    setLotCenarioRef('A');
    setLotCenarioRecomendado('');
    setLotCustosInfraOverrides({});
    setLotContingenciaOverride('');
  };

  // Carregar proposta guardada na calculadora
  const loadProposal = (proposal: typeof proposals[0]) => {
    if (!proposal.calculatorState) {
      toast.error('Esta proposta não tem dados da calculadora guardados.');
      return;
    }
    
    const state = proposal.calculatorState;
    
    // Restaurar estado da calculadora
    setActiveCalculator('honorarios');
    setHonorMode(state.honorMode);
    setArea(state.area);
    setProjectType(state.projectType);
    setComplexity(state.complexity);
    setValorObra(state.valorObra);
    setPctHonor(state.pctHonor);
    setCurvaDecrescimento(state.curvaDecrescimento);
    setFasesIncluidas(new Set(state.fasesIncluidas));
    setHonorLocalizacao(state.honorLocalizacao);
    setNumPisos(state.numPisos);
    setExtrasValores(state.extrasValores);
    setDespesasReembolsaveis(state.despesasReembolsaveis);
    setEspecialidadesValores(state.especialidadesValores);
    setExclusoesSelecionadas(new Set(state.exclusoesSelecionadas));
    setLinkGoogleMaps(state.linkGoogleMaps);
    setAreaUnit(state.areaUnit || 'm2');
    
    // Restaurar opções de visualização
    setMostrarResumo(state.mostrarResumo);
    setMostrarFases(state.mostrarFases);
    setMostrarEspecialidades(state.mostrarEspecialidades);
    setMostrarExtras(state.mostrarExtras);
    setMostrarExclusoes(state.mostrarExclusoes);
    setMostrarCondicoes(state.mostrarCondicoes);
    setMostrarMapa(state.mostrarMapa);
    setMostrarEquipa(state.mostrarEquipa);
    setMostrarCenarios(state.mostrarCenarios);
    setMostrarGuiaObra(state.mostrarGuiaObra);
    setNotasAdicionais(state.notasAdicionais);
    setNotasExtras(state.notasExtras);
    
    // Restaurar dados do cliente/projeto
    setClienteNome(proposal.clientName);
    setProjetoNome(proposal.projectName || '');
    setReferenciaProposta(proposal.reference || '');
    setLocalProposta(proposal.location || '');
    
    // Restaurar campos de loteamento (se existirem)
    if (state.lotIdentificacao !== undefined) {
      setLotIdentificacao(state.lotIdentificacao || '');
      setLotAreaTerreno(state.lotAreaTerreno || '');
      setLotFonteArea(state.lotFonteArea || '');
      setLotAreaEstudo(state.lotAreaEstudo || '');
      setLotNumLotes(state.lotNumLotes || '');
      setLotFrenteTerreno(state.lotFrenteTerreno || '');
      setLotProfundidade(state.lotProfundidade || '');
      setLotMunicipioId(state.lotMunicipioId || '');
      setLotNumAlternativas(state.lotNumAlternativas || '2');
      setLotInstrumento(state.lotInstrumento || 'PDM');
      setLotClassificacaoSolo(state.lotClassificacaoSolo || '');
      setLotAlturaMaxima(state.lotAlturaMaxima || '');
      setLotAfastamentoFrontal(state.lotAfastamentoFrontal || '');
      setLotAfastamentoLateral(state.lotAfastamentoLateral || '');
      setLotAfastamentoPosterior(state.lotAfastamentoPosterior || '');
      setLotAreaMinimaLote(state.lotAreaMinimaLote || '');
      setLotIndiceConstrucao(state.lotIndiceConstrucao || '');
      setLotIndiceImplantacao(state.lotIndiceImplantacao || '');
      setLotProfundidadeMaxConstrucao(state.lotProfundidadeMaxConstrucao || '');
      setLotPercentagemCedencias(state.lotPercentagemCedencias || '15');
      setLotTipoHabitacao(state.lotTipoHabitacao || 'isoladas');
      setLotObjetivoPrincipal(state.lotObjetivoPrincipal || 'max_lotes');
      setLotTemTopografia(state.lotTemTopografia || false);
      setLotTemCaderneta(state.lotTemCaderneta || false);
      setLotTemExtratoPDM(state.lotTemExtratoPDM || false);
      if (state.lotCenarioA) setLotCenarioA({ ...cenarioDefault, ...state.lotCenarioA, tipoHabitacao: state.lotCenarioA.tipoHabitacao || 'auto' });
      if (state.lotCenarioB) setLotCenarioB({ ...cenarioDefault, ...state.lotCenarioB, tipoHabitacao: state.lotCenarioB.tipoHabitacao || 'auto' });
      if (state.lotCenarioC) setLotCenarioC({ ...cenarioDefault, ...state.lotCenarioC, tipoHabitacao: state.lotCenarioC.tipoHabitacao || 'auto' });
      setLotCondicionantes(new Set(state.lotCondicionantes || []));
      setLotEntregaveis(new Set(state.lotEntregaveis || ['viability_report', 'alternatives', 'synthesis_plan', 'descriptive_report', 'licensing_submission']));
      setLotAssuncoesManuais(state.lotAssuncoesManuais || '');
      setLotDependenciasManuais(state.lotDependenciasManuais || '');
      // Fase 2: Custos paramétricos
      setLotCenarioRef(state.lotCenarioRef || 'A');
      setLotCenarioRecomendado(state.lotCenarioRecomendado || '');
      setLotCustosInfraOverrides(state.lotCustosInfraOverrides || {});
      setLotContingenciaOverride(state.lotContingenciaOverride || '');
    }

    // Limpar estados de link
    setLinkPropostaExibido(null);
    setLinkPropostaCurto(null);
    setLinkPropostaHash(null);
    setPropostaFechada(false);
    
    setShowProposalsList(false);
    toast.success(`Proposta ${proposal.reference} carregada!`);
  };

  // Portal de captura eliminado — PDF agora usa createRoot direto (ver exportHonorariosPDF)

  return (
    <>
      {/* Portal de captura eliminado — PDF usa createRoot direto */}
      <div className="space-y-6 min-h-[50vh]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Calculator className="w-4 h-4" />
            <span className="text-sm">Ferramentas de Cálculo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Calculadoras</h1>
        </div>
        <div className="flex gap-2">
          {proposals.length > 0 && (
            <button
              onClick={() => setShowProposalsList(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors w-fit"
            >
              <History className="w-4 h-4" />
              <span>Propostas ({proposals.length})</span>
            </button>
          )}
          {activeCalculator && (
            <button
              onClick={resetCalculator}
              className="flex items-center gap-2 px-4 py-2.5 bg-muted border border-border rounded-lg hover:bg-muted/80 transition-colors w-fit"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Limpar</span>
            </button>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {calculators.map((calc, index) => (
          <motion.button
            key={calc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setActiveCalculator(calc.id)}
            className={`p-5 bg-card border rounded-xl text-left transition-all ${
              activeCalculator === calc.id
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-border hover:border-muted-foreground/30'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <calc.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{calc.name}</h3>
                <p className="text-sm text-muted-foreground">{calc.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeCalculator === 'honorarios' && (
          <motion.div
            key="honorarios"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Honorários de Arquitetura</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Cliente</label>
                <ClientAutocomplete
                  value={clienteNome}
                  onChange={setClienteNome}
                  onClientSelect={handleClientSelect}
                  placeholder="Nome do cliente"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Projeto</label>
                <input
                  type="text"
                  value={projetoNome}
                  onChange={(e) => setProjetoNome(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                  placeholder="Designação do projeto"
                />
                <p className="text-xs text-muted-foreground mt-1">Preenchido pela tipologia. Podes editar.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Referência (opcional)</label>
                <input
                  type="text"
                  value={referenciaProposta || gerarReferenciaAuto()}
                  onChange={(e) => setReferenciaProposta(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                  placeholder="Cliente + Local + Data (YYMM)"
                />
                <p className="text-xs text-muted-foreground mt-1">Automática: sigla Cliente + Local + Data. Podes editar.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Local</label>
                <input
                  type="text"
                  value={localProposta}
                  onChange={(e) => setLocalProposta(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                  placeholder="Ex: Câmara Aveiro"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Link Google Maps</label>
                <input
                  type="url"
                  value={linkGoogleMaps}
                  onChange={(e) => setLinkGoogleMaps(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                  placeholder="https://www.google.com/maps/place/..."
                />
                <p className="text-xs text-muted-foreground mt-1">Colar o link obtido em «Partilhar» no Google Maps.</p>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="honorMode"
                  checked={honorMode === 'area'}
                  onChange={() => setHonorMode('area')}
                  className="rounded-full"
                />
                <span>Por área (€/m²)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="honorMode"
                  checked={honorMode === 'pct'}
                  onChange={() => setHonorMode('pct')}
                  className="rounded-full"
                />
                <span>Por % da obra (ICHPOP)</span>
              </label>
            </div>

            <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-sm font-medium mb-3">{isLoteamento ? 'Fases do loteamento' : 'Fases incluídas no serviço'}</p>
              <p className="text-xs text-muted-foreground mb-3">
                {isLoteamento
                  ? 'Urbanismo (viabilidade → aprovação). Especialidades de infraestruturas são contratadas separadamente.'
                  : 'Base (até licenciamento aprovado). Pormenores genéricos incluídos no licenciamento. Fiscalização e Projeto de Execução são extras.'}
              </p>
              <div className="flex flex-wrap gap-4">
                {(isLoteamento ? FASES_LOTEAMENTO : ICHPOP_PHASES).map((phase) => (
                  <label key={phase.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fasesIncluidas.has(phase.id)}
                      onChange={(e) => {
                        const next = new Set(fasesIncluidas);
                        if (e.target.checked) next.add(phase.id);
                        else next.delete(phase.id);
                        setFasesIncluidas(next);
                      }}
                    />
                    <span className="text-sm">
                      {phase.name} ({phase.pct}%)
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <span className="text-xs text-muted-foreground">
                  Total fases:{' '}
                  {Array.from(fasesIncluidas).reduce(
                    (s, id) => s + ((isLoteamento ? FASES_LOTEAMENTO : ICHPOP_PHASES).find((p) => p.id === id)?.pct ?? 0),
                    0
                  )}
                  %
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-muted-foreground">Localização:</span>
                  <select
                    value={honorLocalizacao}
                    onChange={(e) => setHonorLocalizacao(e.target.value)}
                    className="text-xs px-2 py-1 bg-muted border border-border rounded"
                  >
                    <option value="litoral">Litoral (+5%)</option>
                    <option value="lisboa">Lisboa (+15%)</option>
                    <option value="interior">Interior (−12%)</option>
                  </select>
                </label>
                <label className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Despesas reembolsáveis (€):</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={despesasReembolsaveis}
                    onChange={(e) => setDespesasReembolsaveis(e.target.value)}
                    className="text-xs w-24 px-2 py-1 bg-muted border border-border rounded"
                    placeholder="0"
                  />
                </label>
              </div>
            </div>

            <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div>
                  <p className="text-sm font-medium">Especialidades associadas à tipologia</p>
                  <p className="text-xs text-muted-foreground">
                    Valores por especialidade (mín. + €/m²). Usa a área indicada acima. Preenche os m² e clica em «Preencher sugestões».
                  </p>
                </div>
                <button
                  type="button"
                  onClick={preencherSugestoesEspecialidades}
                  className="text-xs px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg font-medium transition-colors"
                >
                  Preencher sugestões
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {((TIPOLOGIA_ESPECIALIDADES[projectType] ?? []) as string[]).map((espId) => {
                  const esp = ESPECIALIDADES.find((e) => e.id === espId);
                  const sug = ESPECIALIDADES_SUGESTAO[espId];
                  if (!esp) return null;
                  const refHint = sug
                    ? sug.rate === 0
                      ? `mín. ${sug.minValor}€`
                      : `mín. ${sug.minValor}€ + ${sug.rate}€/m²`
                    : null;
                  return (
                    <label key={espId} className="flex items-center gap-2">
                      <span className="text-sm flex-1 truncate" title={esp.name}>
                        {esp.name}
                        {refHint && (
                          <span className="text-muted-foreground font-normal ml-1">({refHint})</span>
                        )}
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={especialidadesValores[espId] ?? ''}
                        onChange={(e) =>
                          setEspecialidadesValores((prev) => ({
                            ...prev,
                            [espId]: e.target.value,
                          }))
                        }
                        className="w-24 px-2 py-1.5 text-sm bg-muted border border-border rounded"
                        placeholder="€"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            {/* CERTO: Opções de apresentação da proposta */}
            <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/30 scroll-mt-4">
              <div className="mb-3">
                <p className="text-sm font-medium text-primary">Opções de apresentação (CERTO)</p>
                <p className="text-xs text-muted-foreground">
                  Melhora a clareza e taxa de fecho da proposta.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mostrarResumo}
                    onChange={(e) => setMostrarResumo(e.target.checked)}
                    className="rounded border-border"
                  />
                  <div>
                    <span className="text-sm font-medium">Resumo Executivo</span>
                    <p className="text-xs text-muted-foreground">Decisão em 60 segundos</p>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mostrarCenarios}
                    onChange={(e) => setMostrarCenarios(e.target.checked)}
                    className="rounded border-border"
                  />
                  <div>
                    <span className="text-sm font-medium">Cenários de Prazo</span>
                    <p className="text-xs text-muted-foreground">Melhor/típico/pior caso</p>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mostrarPacotes}
                    onChange={(e) => setMostrarPacotes(e.target.checked)}
                    className="rounded border-border"
                  />
                  <div>
                    <span className="text-sm font-medium">Pacotes de Serviço</span>
                    <p className="text-xs text-muted-foreground">Essencial/Obra Tranquila/Experiência</p>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mostrarGuiaObra}
                    onChange={(e) => setMostrarGuiaObra(e.target.checked)}
                    className="rounded border-border"
                  />
                  <div>
                    <span className="text-sm font-medium">Estimativa de Obra</span>
                    <p className="text-xs text-muted-foreground">Custos €/m² (mín/méd/máx) + prazo</p>
                  </div>
                </label>
              </div>
            </div>

            <div id="extras-proposta" className="mb-6 p-4 bg-muted/30 rounded-lg border border-border scroll-mt-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div>
                  <p className="text-sm font-medium">Extras opcionais</p>
                  <p className="text-xs text-muted-foreground">
                    Indicação orientativa para o cliente. Não entram na cotação final; são meramente informativos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={preencherSugestoesExtras}
                  className="text-xs px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg font-medium transition-colors"
                >
                  Preencher sugestões
                </button>
              </div>
              {/* Projeto de Execução - duas opções lado a lado */}
              <div className="mb-4 p-3 rounded-lg border border-primary/30 bg-primary/5">
                <p className="text-xs font-medium text-primary mb-3">Projeto de Execução (pormenores genéricos incluídos no licenciamento):</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Execução Base */}
                  {(() => {
                    const execBase = EXTRAS_PROPOSTA.find((x) => x.id === 'projeto_execucao_base');
                    const tetoBase = execBase?.tetoMinimo ?? 2500;
                    const taxaBase = execBase?.taxaPorM2 ?? 15;
                    const hintBase = `${tetoBase}€ + ${taxaBase}€/m²`;
                    return (
                      <div className={`p-3 rounded-lg border ${extrasValores['projeto_execucao_base'] ? 'border-primary bg-primary/10' : 'border-border bg-muted/30'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold">Base</span>
                          <span className="text-xs text-muted-foreground">({hintBase})</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">3-6 pormenores tipo, especificações genéricas</p>
                        <input
                          type="number"
                          min="0"
                          step="50"
                          value={extrasValores['projeto_execucao_base'] ?? ''}
                          onChange={(ev) => setExtrasValores((prev) => ({ ...prev, projeto_execucao_base: ev.target.value, projeto_execucao_completa: '' }))}
                          className="w-full px-2 py-1.5 text-sm bg-background border border-border rounded"
                          placeholder="€"
                        />
                      </div>
                    );
                  })()}
                  {/* Execução Completa */}
                  {(() => {
                    const execCompleta = EXTRAS_PROPOSTA.find((x) => x.id === 'projeto_execucao_completa');
                    const tetoCompleta = execCompleta?.tetoMinimo ?? 4000;
                    const taxaCompleta = execCompleta?.taxaPorM2 ?? 22;
                    const hintCompleta = `${tetoCompleta}€ + ${taxaCompleta}€/m²`;
                    return (
                      <div className={`p-3 rounded-lg border-2 ${extrasValores['projeto_execucao_completa'] ? 'border-primary bg-primary/10' : 'border-primary/50 bg-primary/5'} relative`}>
                        <div className="absolute -top-2 right-2 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded font-medium">
                          Recomendado
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-primary">Completa</span>
                          <span className="text-xs text-muted-foreground">({hintCompleta})</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">10-15 pormenores, mapas de vãos, compatibilização BIM</p>
                        <input
                          type="number"
                          min="0"
                          step="50"
                          value={extrasValores['projeto_execucao_completa'] ?? ''}
                          onChange={(ev) => setExtrasValores((prev) => ({ ...prev, projeto_execucao_completa: ev.target.value, projeto_execucao_base: '' }))}
                          className="w-full px-2 py-1.5 text-sm bg-background border border-border rounded"
                          placeholder="€"
                        />
                      </div>
                    );
                  })()}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {EXTRAS_PROPOSTA.filter((e) => e.id !== 'projeto_execucao_base' && e.id !== 'projeto_execucao_completa').map((e) => {
                  const hint = e.tipo === 'por_m2' && e.taxaPorM2
                      ? (e.tetoMinimo ? `${e.tetoMinimo}€ + ${e.taxaPorM2}€/m²` : `${e.taxaPorM2}€/m²`)
                      : e.tipo === 'por_visita' && e.taxaPorVisita ? `${e.taxaPorVisita} €/${(e as { unitLabel?: string }).unitLabel || 'visita'}` : e.tipo === 'por_avenca' && e.taxaPorMes ? `${e.taxaPorMes} €/mês` : e.valorSugerido > 0 ? `sug. ${e.valorSugerido}€` : null;
                  return (
                    <label key={e.id} className="flex items-center gap-2">
                      <span className="text-sm flex-1 truncate" title={e.nome}>
                        {e.nome}
                        {hint && <span className="text-muted-foreground font-normal ml-1">({hint})</span>}
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={extrasValores[e.id] ?? ''}
                        onChange={(ev) => setExtrasValores((prev) => ({ ...prev, [e.id]: ev.target.value }))}
                        className="w-24 px-2 py-1.5 text-sm bg-muted border border-border rounded"
                        placeholder="€"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div>
                  <p className="text-sm font-medium">Exclusões (não incluídas nos honorários)</p>
                  <p className="text-xs text-muted-foreground">
                    Exclusões genéricas aplicadas automaticamente conforme a tipologia. «Preencher sugestões» acrescenta as das especialidades.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={preencherSugestoesExclusoes}
                  className="text-xs px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg font-medium transition-colors"
                >
                  Preencher sugestões
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Arquitetura</p>
                  {getExclusoesArquiteturaParaTipologia(projectType).map((id) => {
                    const e = EXCLUSOES_ARQUITETURA.find((x) => x.id === id);
                    if (!e) return null;
                    return (
                      <label key={e.id} className="flex items-start gap-2 cursor-pointer mb-1.5">
                        <input
                          type="checkbox"
                          checked={exclusoesSelecionadas.has(e.id)}
                          onChange={() => toggleExclusao(e.id)}
                          className="mt-0.5"
                        />
                        <span className="text-sm">{e.label}</span>
                      </label>
                    );
                  })}
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Especialidades</p>
                  {((TIPOLOGIA_ESPECIALIDADES[projectType] ?? []) as string[])
                    .filter((espId) => parseFloat(especialidadesValores[espId] || '0') > 0)
                    .map((espId) => {
                      const esp = ESPECIALIDADES.find((x) => x.id === espId);
                      const exclList = EXCLUSOES_ESPECIALIDADES[espId] ?? [];
                      if (exclList.length === 0) return null;
                      return (
                        <div key={espId} className="mb-3">
                          <p className="text-xs font-medium text-muted-foreground mb-1">{esp?.name}</p>
                          {exclList.map((e) => (
                            <label key={e.id} className="flex items-start gap-2 cursor-pointer mb-1">
                              <input
                                type="checkbox"
                                checked={exclusoesSelecionadas.has(e.id)}
                                onChange={() => toggleExclusao(e.id)}
                                className="mt-0.5"
                              />
                              <span className="text-sm">{e.label}</span>
                            </label>
                          ))}
                        </div>
                      );
                    })}
                  {((TIPOLOGIA_ESPECIALIDADES[projectType] ?? []) as string[])
                    .filter((espId) => parseFloat(especialidadesValores[espId] || '0') > 0)
                    .some((espId) => (EXCLUSOES_ESPECIALIDADES[espId] ?? []).length > 0)
                    ? null
                    : (
                    <p className="text-xs text-muted-foreground italic">Adiciona especialidades acima para ver exclusões sugeridas.</p>
                  )}
                </div>
              </div>
            </div>

            {honorMode === 'area' ? (
              <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isLoteamento ? 'Área em estudo (m²)' : 'Área (m²) *'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={area}
                    onChange={(e) => {
                      setArea(e.target.value);
                      if (isLoteamento) setLotAreaEstudo(e.target.value);
                    }}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                    placeholder={isLoteamento ? 'Preenchido na secção abaixo' : 'Ex: 150'}
                  />
                  {isLoteamento && lotAreaEstudo && area === lotAreaEstudo && (
                    <p className="text-[10px] text-blue-400 mt-0.5">Calculado a partir da area em estudo</p>
                  )}
                  {isLoteamento && lotAreaEstudo && area !== lotAreaEstudo && (
                    <button
                      onClick={() => setArea(lotAreaEstudo)}
                      className="text-[10px] text-blue-400 hover:text-blue-300 mt-0.5"
                    >
                      Sincronizar com area em estudo ({lotAreaEstudo} m2)
                    </button>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tipologia</label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                  >
                    <option value="">— Selecionar tipologia —</option>
                    {['Habitação', 'Reabilitação', 'Comércio e Serviços', 'Indústria', 'Equipamentos', 'Loteamento', 'Urbanismo', 'Especiais', 'Apoios de Praia']
                      .filter((cat) => TIPOLOGIAS_HONORARIOS.some((t) => t.categoria === cat))
                      .map((cat) => (
                      <optgroup key={cat} label={cat}>
                        {TIPOLOGIAS_HONORARIOS.filter((t) => t.categoria === cat).map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} — min. {t.minValor.toLocaleString('pt-PT')}€ + {t.rate}€/m²
                          </option>
                        ))}
                      </optgroup>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Complexidade</label>
                  <select
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value)}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                  >
                    <option value="">— Selecionar complexidade —</option>
                    <option value="baixa">Baixa (×0.8)</option>
                    <option value="media">Média (×1.0)</option>
                    <option value="alta">Alta (×1.3)</option>
                  </select>
                </div>
                {TIPOLOGIAS_COM_PISOS.includes(projectType) && (
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('calc.pisosLabel', lang)}</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={numPisos}
                      onChange={(e) => setNumPisos(e.target.value)}
                      className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                      placeholder={lang === 'en' ? '1–2 (no adjustment)' : '1–2 (sem ajuste)'}
                    />
                    <p className="text-xs text-muted-foreground mt-1">{t('calc.pisosHint', lang)}</p>
                  </div>
                )}
                {!isLoteamento && (
                  <div className="flex flex-col gap-3 items-end pb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={curvaDecrescimento}
                        onChange={(e) => setCurvaDecrescimento(e.target.checked)}
                      />
                      <span className="text-sm">Curva de decrescimento (área &gt;100 m²)</span>
                    </label>
                  </div>
                )}
              </div>

              {/* --- SECCAO LOTEAMENTO --- */}
              {isLoteamento && (
                <div className="mt-4 p-5 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-5">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full" />
                    Dados do Loteamento
                  </h3>

                  {/* 1. Identificacao e terreno */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Identificacao predial</label>
                      <input type="text" value={lotIdentificacao} onChange={(e) => setLotIdentificacao(e.target.value)}
                        className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                        placeholder="Ex: Art. 1234 - Rustico, Seccao B" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Fonte da area</label>
                      <select value={lotFonteArea} onChange={(e) => setLotFonteArea(e.target.value)}
                        className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none">
                        <option value="">-- Selecionar --</option>
                        <option value="matriz">Caderneta predial (matriz)</option>
                        <option value="topografia">Levantamento topografico</option>
                        <option value="escritura">Escritura / registo predial</option>
                        <option value="estimativa">Estimativa (a confirmar)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Frente do terreno (m)</label>
                      <input type="number" min="1" value={lotFrenteTerreno} onChange={(e) => setLotFrenteTerreno(e.target.value)}
                        className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none" placeholder="81" />
                      <p className="text-[10px] text-amber-400 mt-0.5">Driver principal de custo</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Profundidade est. (m)</label>
                      <input type="number" min="1" value={lotProfundidade} onChange={(e) => setLotProfundidade(e.target.value)}
                        className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none" placeholder="40" />
                      {parseFloat(lotProfundidadeMaxConstrucao) > 0 && parseFloat(lotProfundidade) > parseFloat(lotProfundidadeMaxConstrucao) && (
                        <p className="text-[10px] text-red-400 mt-0.5">Excede prof. max. construcao ({lotProfundidadeMaxConstrucao}m)</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Area total (m2)</label>
                      <input type="number" min="0" value={lotAreaTerreno} onChange={(e) => setLotAreaTerreno(e.target.value)}
                        className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                        placeholder={parseFloat(lotFrenteTerreno) > 0 && parseFloat(lotProfundidade) > 0 ? `auto: ${(parseFloat(lotFrenteTerreno) * parseFloat(lotProfundidade)).toFixed(0)}` : '5000'} />
                      {!lotAreaTerreno && parseFloat(lotFrenteTerreno) > 0 && parseFloat(lotProfundidade) > 0 && (
                        <p className="text-[10px] text-blue-400 mt-0.5">
                          Est.: {(parseFloat(lotFrenteTerreno) * parseFloat(lotProfundidade)).toFixed(0)} m2
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Area em estudo (m2)</label>
                      <input type="number" min="0" value={lotAreaEstudo} onChange={(e) => setLotAreaEstudo(e.target.value)}
                        className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none" placeholder="4200" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">N. lotes pretendidos</label>
                      <input type="number" min="1" max="50" value={lotNumLotes} onChange={(e) => setLotNumLotes(e.target.value)}
                        className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none" placeholder="6" />
                    </div>
                  </div>
                  {/* Validações de terreno */}
                  {(() => {
                    const frente = parseFloat(lotFrenteTerreno) || 0;
                    const areaEst = parseFloat(lotAreaEstudo) || 0;
                    const profund = parseFloat(lotProfundidade) || 0;
                    const nLotes = parseInt(lotNumLotes, 10) || 0;
                    const avisos: { msg: string; tipo: 'erro' | 'aviso' }[] = [];
                    if (frente > 0 && areaEst > 0 && profund <= 0 && frente > 0) {
                      const profImplicita = areaEst / frente;
                      if (profImplicita > 200) avisos.push({ msg: `Profundidade implicita muito elevada (${profImplicita.toFixed(0)}m) — verificar area ou frente`, tipo: 'aviso' });
                    }
                    if (frente > 0 && nLotes > 0) {
                      const largura = frente / nLotes;
                      if (largura < 5) avisos.push({ msg: `Largura media por lote (${largura.toFixed(1)}m) inferior ao minimo viavel (~5.5m para banda)`, tipo: 'erro' });
                      else if (largura < 5.5) avisos.push({ msg: `Largura por lote (${largura.toFixed(1)}m) no limite para habitacao em banda`, tipo: 'aviso' });
                    }
                    if (areaEst > 0 && nLotes > 0) {
                      const areaPorLote = areaEst / nLotes;
                      if (areaPorLote < 100) avisos.push({ msg: `Area media por lote (${areaPorLote.toFixed(0)} m2) abaixo dos 100 m2 — verificar viabilidade`, tipo: 'erro' });
                      else if (areaPorLote < 200) avisos.push({ msg: `Area media por lote (${areaPorLote.toFixed(0)} m2) abaixo do recomendado (200-300 m2)`, tipo: 'aviso' });
                    }
                    if (frente > 0 && frente < 10) avisos.push({ msg: `Frente do terreno (${frente}m) muito reduzida para loteamento`, tipo: 'aviso' });
                    if (nLotes > 20) avisos.push({ msg: `Numero elevado de lotes (${nLotes}) — considerar faseamento ou via interna`, tipo: 'aviso' });
                    if (avisos.length === 0) return null;
                    return (
                      <div className="space-y-1">
                        {avisos.map((a, i) => (
                          <p key={i} className={`text-[11px] px-3 py-1.5 rounded-lg ${a.tipo === 'erro' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                            {a.tipo === 'erro' ? '⚠' : '△'} {a.msg}
                          </p>
                        ))}
                      </div>
                    );
                  })()}
                  {/* Sugestão automática de lotes por tipologia */}
                  {(() => {
                    const frente = parseFloat(lotFrenteTerreno) || 0;
                    const sugestoes = sugerirLotesPorFrente(frente);
                    if (sugestoes.length === 0) return null;
                    return (
                      <div className="px-4 py-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium text-blue-400">Sugestao automatica — {frente}m de frente (util: {Math.max(0, frente - 6).toFixed(0)}m)</p>
                          <button
                            onClick={() => {
                              const s = sugestoes;
                              if (s.length >= 1) {
                                setLotCenarioA(prev => ({ ...prev, lotes: String(s[0].lotes), tipoHabitacao: 'auto' }));
                                setLotNumAlternativas(s.length >= 3 ? '3' : '2');
                              }
                              if (s.length >= 2) {
                                setLotCenarioB(prev => ({ ...prev, lotes: String(s[1].lotes), tipoHabitacao: 'auto' }));
                              }
                              if (s.length >= 3) {
                                setLotCenarioC(prev => ({ ...prev, lotes: String(s[2].lotes), tipoHabitacao: 'auto' }));
                              }
                              // Preencher N. lotes pretendidos com a sugestão intermédia
                              if (s.length >= 2) setLotNumLotes(String(s[1].lotes));
                              else if (s.length >= 1) setLotNumLotes(String(s[0].lotes));
                              toast.success(`Cenarios preenchidos: ${s.map(x => `${x.lotes} ${x.label.toLowerCase()}`).join(' | ')}`);
                            }}
                            className="px-3 py-1 text-[10px] rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors font-medium"
                          >
                            Preencher cenarios
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {sugestoes.map(s => {
                            const prof = parseFloat(lotProfundidade) || 0;
                            const areaLoteEst = prof > 0 ? Math.round(s.largura * prof) : 0;
                            const profMax = parseFloat(lotProfundidadeMaxConstrucao) || 0;
                            const excedeProfMax = profMax > 0 && prof > profMax;
                            return (
                              <button key={s.tipo}
                                onClick={() => setLotNumLotes(String(s.lotes))}
                                className="flex flex-col items-center gap-0.5 p-2 rounded-lg bg-muted/50 border border-border hover:border-blue-500/40 transition-colors cursor-pointer group"
                              >
                                <span className={`text-lg font-bold ${s.tipo === 'isoladas' ? 'text-emerald-400' : s.tipo === 'geminadas' ? 'text-amber-400' : 'text-rose-400'}`}>
                                  {s.lotes}
                                </span>
                                <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">{s.label}</span>
                                <span className="text-[9px] text-muted-foreground">~{s.largura.toFixed(1)}m/lote</span>
                                {areaLoteEst > 0 && (
                                  <span className="text-[9px] text-blue-400">~{areaLoteEst} m2/lote</span>
                                )}
                                {excedeProfMax && (
                                  <span className="text-[8px] text-red-400">Prof. &gt; {profMax}m</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

                  {/* 2. Contexto urbanistico */}
                  <div className="p-4 bg-muted/30 border border-border rounded-lg space-y-3">
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      Contexto urbanistico
                    </p>
                    {/* Município + Instrumento */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Municipio</label>
                        <select
                          value={lotMunicipioId}
                          onChange={(e) => {
                            const id = e.target.value;
                            setLotMunicipioId(id);
                            const mun = municipios.find(m => m.id === id);
                            if (mun?.parametros) {
                              preencherParametrosMunicipio(mun.parametros);
                              toast.success(`Parametros de ${mun.nome} pre-preenchidos (editaveis)`);
                            }
                          }}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none"
                        >
                          <option value="">-- Selecionar --</option>
                          <optgroup label="Frequentes">
                            {lotMunicipiosOptions.freq.map(m => (
                              <option key={m.id} value={m.id}>{m.nome}</option>
                            ))}
                          </optgroup>
                          <optgroup label="Outros">
                            {lotMunicipiosOptions.outros.map(m => (
                              <option key={m.id} value={m.id}>{m.nome}</option>
                            ))}
                          </optgroup>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Instrumento</label>
                        <select value={lotInstrumento} onChange={(e) => setLotInstrumento(e.target.value)}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none">
                          <option value="PDM">PDM</option>
                          <option value="PU">PU (Plano de Urbanizacao)</option>
                          <option value="PP">PP (Plano de Pormenor)</option>
                          <option value="outro">Outro</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium mb-1">Classificacao do solo</label>
                        <input type="text" value={lotClassificacaoSolo} onChange={(e) => setLotClassificacaoSolo(e.target.value)}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none"
                          placeholder="Ex: Solo Urbano - Espacos Residenciais" />
                      </div>
                    </div>
                    {/* Badge do município + Repor */}
                    {lotMunicipioSel?.parametros && (
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-[10px] font-medium">
                          {lotMunicipioSel.nome} ({lotInstrumento})
                        </span>
                        <button
                          onClick={() => {
                            preencherParametrosMunicipio(lotMunicipioSel.parametros);
                            toast.success('Parametros repostos');
                          }}
                          className="px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-muted transition-colors"
                        >
                          Repor valores PDM
                        </button>
                      </div>
                    )}
                    {/* Parâmetros urbanísticos — 2 linhas */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Altura max.</label>
                        <input type="text" value={lotAlturaMaxima} onChange={(e) => setLotAlturaMaxima(e.target.value)}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none" placeholder="7m / 2 pisos" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Afast. frontal</label>
                        <input type="text" value={lotAfastamentoFrontal} onChange={(e) => setLotAfastamentoFrontal(e.target.value)}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none" placeholder="Alinham. dominante" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Afast. lateral (m)</label>
                        <input type="text" value={lotAfastamentoLateral} onChange={(e) => setLotAfastamentoLateral(e.target.value)}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none" placeholder="3" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Afast. posterior (m)</label>
                        <input type="text" value={lotAfastamentoPosterior} onChange={(e) => setLotAfastamentoPosterior(e.target.value)}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none" placeholder="6" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Area min. lote (m2)</label>
                        <input type="text" value={lotAreaMinimaLote} onChange={(e) => setLotAreaMinimaLote(e.target.value)}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none" placeholder="300" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Indice constr.</label>
                        <input type="text" value={lotIndiceConstrucao} onChange={(e) => setLotIndiceConstrucao(e.target.value)}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none" placeholder="0.6" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Indice implant.</label>
                        <input type="text" value={lotIndiceImplantacao} onChange={(e) => setLotIndiceImplantacao(e.target.value)}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none" placeholder="0.4" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Prof. max. constr. (m)</label>
                        <input type="text" value={lotProfundidadeMaxConstrucao} onChange={(e) => setLotProfundidadeMaxConstrucao(e.target.value)}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none" placeholder="17" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Cedencias (%)</label>
                        <input type="text" value={lotPercentagemCedencias} onChange={(e) => setLotPercentagemCedencias(e.target.value)}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none" placeholder="15" />
                      </div>
                    </div>
                    {/* Documentos disponiveis */}
                    <div className="flex flex-wrap gap-4 pt-1">
                      <p className="text-xs font-medium text-muted-foreground">Documentos disponiveis:</p>
                      {[
                        { id: 'topo', label: 'Levant. topografico', val: lotTemTopografia, set: setLotTemTopografia },
                        { id: 'cad', label: 'Caderneta predial', val: lotTemCaderneta, set: setLotTemCaderneta },
                        { id: 'pdm', label: 'Extrato PDM/PU/PP', val: lotTemExtratoPDM, set: setLotTemExtratoPDM },
                      ].map(d => (
                        <label key={d.id} className="flex items-center gap-1.5 text-xs cursor-pointer">
                          <input type="checkbox" checked={d.val} onChange={(e) => d.set(e.target.checked)} />
                          <span>{d.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 3. Programa */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Tipo de habitacao (geral)</label>
                      <select value={lotTipoHabitacao} onChange={(e) => setLotTipoHabitacao(e.target.value)}
                        className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none">
                        {Object.entries(HOUSING_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                      <p className="text-[10px] text-muted-foreground mt-1">Cada cenario pode ter tipologia propria (calculada pela largura do lote).</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Objetivo principal</label>
                      <select value={lotObjetivoPrincipal} onChange={(e) => setLotObjetivoPrincipal(e.target.value)}
                        className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none">
                        {Object.entries(OBJETIVO_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* 4. Condicionantes urbanisticas */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Condicionantes urbanisticas</label>
                    <p className="text-xs text-muted-foreground mb-2">Afetam complexidade, prazo e previsibilidade de custos.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {CONDICIONANTES_LOTEAMENTO.map((c) => (
                        <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" checked={lotCondicionantes.has(c.id)}
                            onChange={(e) => {
                              const next = new Set(lotCondicionantes);
                              if (e.target.checked) next.add(c.id); else next.delete(c.id);
                              setLotCondicionantes(next);
                            }} />
                          <span>{c.label}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${c.impacto === 'alto' ? 'bg-red-500/10 text-red-400' : c.impacto === 'medio' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'}`}>{c.impacto}</span>
                        </label>
                      ))}
                    </div>
                    {lotCondicionantes.size > 0 && (
                      <p className="text-xs text-amber-400 mt-2">
                        Complexidade sugerida: <strong className="uppercase">{calcularComplexidadeLoteamento(lotCondicionantes)}</strong>
                      </p>
                    )}
                  </div>

                  {/* 4b. Equipamentos e Caves */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Equipamentos e caves</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {/* Cave */}
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Cave</label>
                        <select value={lotBasement} onChange={(e) => setLotBasement(e.target.value as typeof lotBasement)}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none">
                          {Object.entries(BASEMENT_OPTIONS).map(([k, v]) => <option key={k} value={k}>{v.label}{v.factor > 1 ? ` (×${v.factor})` : ''}</option>)}
                        </select>
                        {lotBasement !== 'nenhuma' && (
                          <input type="number" min="0" value={lotBasementArea} onChange={(e) => setLotBasementArea(e.target.value)}
                            className="w-full mt-1.5 px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none"
                            placeholder="Area cave (m2, opcional)" />
                        )}
                      </div>
                      {/* Piscina */}
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Piscina</label>
                        <select value={lotPool} onChange={(e) => setLotPool(e.target.value as typeof lotPool)}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none">
                          {Object.entries(POOL_OPTIONS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                        </select>
                        {lotPool !== 'nenhuma' && (
                          <div className="space-y-1.5 mt-1.5">
                            <select value={lotPoolSize} onChange={(e) => setLotPoolSize(e.target.value as typeof lotPoolSize)}
                              className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none">
                              {Object.entries(POOL_SIZE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                            <label className="flex items-center gap-2 text-xs cursor-pointer">
                              <input type="checkbox" checked={lotPoolPerUnit} onChange={(e) => setLotPoolPerUnit(e.target.checked)} />
                              <span>Piscina por moradia (vs. piscina comum)</span>
                            </label>
                            {lotPoolPerUnit && (
                              <input type="number" min="0" value={lotPoolUnits} onChange={(e) => setLotPoolUnits(e.target.value)}
                                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none"
                                placeholder={`Moradias com piscina (max ${lotNumLotes || '?'})`} />
                            )}
                          </div>
                        )}
                      </div>
                      {/* Arranjos ext. + Impermeabilização */}
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">Arranjos exteriores</label>
                          <select value={lotExternalWorks} onChange={(e) => setLotExternalWorks(e.target.value as typeof lotExternalWorks)}
                            className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none">
                            {Object.entries(EXTERNAL_WORKS_LEVELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">Impermeabilizacao</label>
                          <select value={lotWaterproofing} onChange={(e) => setLotWaterproofing(e.target.value as typeof lotWaterproofing)}
                            className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none">
                            <option value="normal">Normal</option>
                            <option value="alta">Alta (lencol freatico / solos problematicos)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    {/* Hint: piscina sem exteriores = risco */}
                    {lotPool !== 'nenhuma' && lotExternalWorks === 'base' && (
                      <p className="text-[11px] px-3 py-1.5 mt-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Piscina sem arranjos exteriores completos aumenta risco de patologias e conflitos de obra. Considere nivel &quot;Completo&quot;.
                      </p>
                    )}
                  </div>

                  {/* 5. Cenarios A/B/C (com access_model) */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <label className="text-sm font-medium">Cenarios de loteamento</label>
                      <select value={lotNumAlternativas} onChange={(e) => setLotNumAlternativas(e.target.value)}
                        className="px-3 py-1.5 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none">
                        <option value="2">2 alternativas (A/B)</option>
                        <option value="3">3 alternativas (A/B/C)</option>
                      </select>
                    </div>
                    <div className={`grid grid-cols-1 ${lotNumAlternativas === '3' ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
                      {[
                        { label: 'Cenario A', state: lotCenarioA, setter: setLotCenarioA },
                        { label: 'Cenario B', state: lotCenarioB, setter: setLotCenarioB },
                        ...(lotNumAlternativas === '3' ? [{ label: 'Cenario C', state: lotCenarioC, setter: setLotCenarioC }] : []),
                      ].map(({ label, state, setter }) => {
                        const frente = parseFloat(lotFrenteTerreno) || 0;
                        const nLotes = parseInt(state.lotes, 10) || 0;
                        const largura = calcularLarguraLote(frente, nLotes, state.accessModel);
                        const inferido = largura > 0 ? inferirTipoHabitacao(largura) : null;
                        const tipoEfetivo = state.tipoHabitacao === 'auto' && inferido ? inferido.tipo : state.tipoHabitacao;
                        const conflito = state.tipoHabitacao !== 'auto' && inferido && !inferido.todas.includes(state.tipoHabitacao);
                        // Auto-cálculos
                        const areaEst = parseFloat(lotAreaEstudo) || 0;
                        const pctCed = parseFloat(lotPercentagemCedencias) || 15;
                        const cedenciasAuto = areaEst > 0 ? Math.round(areaEst * pctCed / 100) : 0;
                        const areaMediaAuto = areaEst > 0 && nLotes > 0 ? Math.round((areaEst - cedenciasAuto) / nLotes) : 0;
                        return (
                        <div key={label} className={`p-3 bg-muted/50 border rounded-lg space-y-2 ${conflito ? 'border-red-500/60' : 'border-border'}`}>
                          <p className="text-sm font-semibold">{label}</p>
                          <input type="number" min="1" value={state.lotes} onChange={(e) => setter({ ...state, lotes: e.target.value })}
                            className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none" placeholder="N. lotes" />
                          <select value={state.accessModel} onChange={(e) => setter({ ...state, accessModel: e.target.value })}
                            className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none">
                            {Object.entries(ACCESS_MODEL_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                          </select>
                          {(state.accessModel === 'via_interna' || state.accessModel === 'misto') && (
                            <input type="number" min="0" value={state.viaInternaComprimento}
                              onChange={(e) => setter({ ...state, viaInternaComprimento: e.target.value })}
                              className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none"
                              placeholder="Comprimento via interna (m)" />
                          )}
                          {/* Largura estimada + tipo habitação sugerido */}
                          {largura > 0 && inferido && (
                            <div className={`px-3 py-2 rounded-lg text-xs space-y-1 ${conflito ? 'bg-red-500/10 border border-red-500/30' : 'bg-blue-500/10 border border-blue-500/20'}`}>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Largura estimada/lote:</span>
                                <span className="font-semibold">{largura.toFixed(1)} m</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Tipologia compativel:</span>
                                <span className={`font-semibold ${inferido.tipo === 'inviavel' ? 'text-red-400' : inferido.tipo === 'isoladas' ? 'text-emerald-400' : inferido.tipo === 'geminadas' ? 'text-amber-400' : 'text-rose-400'}`}>
                                  {inferido.label}
                                </span>
                              </div>
                              {inferido.todas.length > 1 && (
                                <p className="text-[10px] text-muted-foreground">
                                  Tambem viavel: {inferido.todas.slice(1).map(t => HOUSING_TYPE_LABELS[t]).join(', ')}
                                </p>
                              )}
                              {conflito && (
                                <p className="text-[10px] text-red-400 font-medium mt-1">
                                  Atencao: "{HOUSING_TYPE_LABELS[state.tipoHabitacao]}" nao e viavel com {largura.toFixed(1)}m de frente. Necessita min. {HOUSING_WIDTH_RULES.find(r => r.tipo === state.tipoHabitacao)?.minWidth ?? '?'}m.
                                </p>
                              )}
                            </div>
                          )}
                          {/* Tipo de habitação por cenário */}
                          <select value={state.tipoHabitacao} onChange={(e) => setter({ ...state, tipoHabitacao: e.target.value })}
                            className={`w-full px-3 py-2 bg-muted border rounded-lg text-sm focus:border-primary focus:outline-none ${conflito ? 'border-red-500/50 text-red-400' : 'border-border'}`}>
                            <option value="auto">Automatico ({inferido ? inferido.label : '—'})</option>
                            {Object.entries(HOUSING_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                          </select>
                          {/* Área média/lote — auto-calculado com override */}
                          <div className="relative">
                            <input type="number" min="0" value={state.areaMedia} onChange={(e) => setter({ ...state, areaMedia: e.target.value })}
                              className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none"
                              placeholder={areaMediaAuto > 0 ? `auto: ${areaMediaAuto} m2` : 'Area media/lote (m2)'} />
                            {state.areaMedia && areaMediaAuto > 0 && (
                              <button onClick={() => setter({ ...state, areaMedia: '' })} title="Repor automatico"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground hover:text-foreground">↺</button>
                            )}
                          </div>
                          {/* Cedências estimadas — auto-calculado com override */}
                          <div className="relative">
                            <input type="text" value={state.cedencias} onChange={(e) => setter({ ...state, cedencias: e.target.value })}
                              className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none"
                              placeholder={cedenciasAuto > 0 ? `auto: ${cedenciasAuto} m2 (${pctCed}%)` : 'Cedencias estimadas (m2)'} />
                            {state.cedencias && cedenciasAuto > 0 && (
                              <button onClick={() => setter({ ...state, cedencias: '' })} title="Repor automatico"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground hover:text-foreground">↺</button>
                            )}
                          </div>
                          <input type="text" value={state.nota} onChange={(e) => setter({ ...state, nota: e.target.value })}
                            className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none" placeholder="Nota / risco (1 linha)" />
                          {/* Validações do cenário */}
                          {(() => {
                            const alertas: string[] = [];
                            const areaMinPDM = parseFloat(lotAreaMinimaLote) || 0;
                            const areaLoteEfetiva = parseFloat(state.areaMedia) || areaMediaAuto;
                            if (areaMinPDM > 0 && areaLoteEfetiva > 0 && areaLoteEfetiva < areaMinPDM) {
                              alertas.push(`Area/lote (${areaLoteEfetiva} m2) inferior ao minimo PDM (${areaMinPDM} m2)`);
                            }
                            if (nLotes > 0 && largura > 0 && largura < 5) {
                              alertas.push(`Largura/lote (${largura.toFixed(1)}m) inviavel — minimo ~5.5m`);
                            }
                            if (nLotes > 15 && state.accessModel === 'direto_frente') {
                              alertas.push(`${nLotes} lotes com acesso directo a frente — considerar via interna`);
                            }
                            if (alertas.length === 0) return null;
                            return (
                              <div className="space-y-1 mt-1">
                                {alertas.map((a, i) => (
                                  <p key={i} className="text-[10px] px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20">{a}</p>
                                ))}
                              </div>
                            );
                          })()}
                        </div>);
                      })}
                    </div>
                  </div>

                  {/* 6. Entregaveis (checklist) */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Entregaveis incluidos</label>
                    <p className="text-xs text-muted-foreground mb-2">Alimentam automaticamente o resumo da proposta.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {ENTREGAVEIS_LOTEAMENTO.map((e) => (
                        <label key={e.id} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" checked={lotEntregaveis.has(e.id)}
                            disabled={e.obrigatorio}
                            onChange={(ev) => {
                              const next = new Set(lotEntregaveis);
                              if (ev.target.checked) next.add(e.id); else next.delete(e.id);
                              setLotEntregaveis(next);
                            }} />
                          <span className={e.obrigatorio ? 'text-muted-foreground' : ''}>{e.label}</span>
                          {e.obrigatorio && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400">obrigatorio</span>}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 6b. Estimativa de Custo de Infraestruturas (Fase 2) */}
                  {(() => {
                    const infra = calcularCustosInfra();
                    const banda = BANDAS_PRECISAO[infra.bandaClasse];
                    return (
                      <div>
                        <label className="block text-sm font-medium mb-2">Estimativa de Custo de Infraestruturas</label>
                        <p className="text-xs text-muted-foreground mb-3">Modelo paramétrico — valores de referência para planeamento do investimento.</p>
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Cenário de referência:</span>
                            {(['A', 'B', 'C'] as const).filter(c => c !== 'C' || lotNumAlternativas === '3').map(c => (
                              <button key={c} onClick={() => setLotCenarioRef(c)}
                                className={`px-3 py-1 text-xs rounded-lg border transition-colors ${lotCenarioRef === c ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border hover:border-primary/50'}`}>
                                Cenário {c}
                              </button>
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Recomendado p/ licenciar:</span>
                            <select
                              value={lotCenarioRecomendado}
                              onChange={e => setLotCenarioRecomendado(e.target.value as 'A' | 'B' | 'C' | '')}
                              className="text-xs px-2 py-1 rounded-lg border border-border bg-background"
                            >
                              <option value="">Não definido</option>
                              {(['A', 'B', 'C'] as const).filter(c => c !== 'C' || lotNumAlternativas === '3').map(c => (
                                <option key={c} value={c}>Cenário {c}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="text-left py-1.5 pr-2 font-medium">Infraestrutura</th>
                                <th className="text-center py-1.5 px-2 font-medium w-14">Unid.</th>
                                <th className="text-right py-1.5 px-2 font-medium w-16">Qtd.</th>
                                <th className="text-right py-1.5 px-2 font-medium w-24">P. Unit. (€)</th>
                                <th className="text-right py-1.5 px-2 font-medium w-20">Ramal (€)</th>
                                <th className="text-right py-1.5 pl-2 font-medium w-24">Subtotal (€)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {infra.items.map((item) => (
                                <tr key={item.infraId} className="border-b border-border/50 hover:bg-muted/50">
                                  <td className="py-1.5 pr-2">{item.nome}</td>
                                  <td className="text-center py-1.5 px-2 text-muted-foreground">{item.unidade}</td>
                                  <td className="text-right py-1.5 px-2">{item.quantidade}</td>
                                  <td className="text-right py-1.5 px-2">
                                    <input type="number" min="0" step="1"
                                      value={lotCustosInfraOverrides[item.infraId] ?? ''}
                                      placeholder={String(CATALOGO_CUSTOS_INFRA.find(c => c.id === item.infraId)?.custoUnitario ?? '')}
                                      onChange={(e) => setLotCustosInfraOverrides(prev => ({ ...prev, [item.infraId]: e.target.value }))}
                                      className="w-20 px-1.5 py-0.5 text-xs text-right bg-muted border border-border rounded" />
                                  </td>
                                  <td className="text-right py-1.5 px-2 text-muted-foreground">
                                    {item.custoRamal > 0 ? `${item.custoRamal}` : '—'}
                                  </td>
                                  <td className="text-right py-1.5 pl-2 font-medium">{item.subtotal.toLocaleString('pt-PT')}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="border-t border-border">
                                <td colSpan={5} className="py-1.5 pr-2 text-right font-medium">Subtotal obra</td>
                                <td className="text-right py-1.5 pl-2 font-medium">{infra.subtotalObra.toLocaleString('pt-PT')} €</td>
                              </tr>
                              <tr className="border-b border-border/50">
                                <td colSpan={4} className="py-1.5 pr-2 text-right">Contingência</td>
                                <td className="text-right py-1.5 px-2">
                                  <input type="number" min="0" max="50" step="1"
                                    value={lotContingenciaOverride}
                                    placeholder={String(infra.contingenciaPct)}
                                    onChange={(e) => setLotContingenciaOverride(e.target.value)}
                                    className="w-14 px-1.5 py-0.5 text-xs text-right bg-muted border border-border rounded" />
                                  <span className="ml-0.5">%</span>
                                </td>
                                <td className="text-right py-1.5 pl-2">
                                  {(infra.totalComContingencia - infra.subtotalObra).toLocaleString('pt-PT')} €
                                </td>
                              </tr>
                              <tr className="bg-muted/30 font-semibold">
                                <td colSpan={5} className="py-2 pr-2 text-right">Total estimado (obra)</td>
                                <td className="text-right py-2 pl-2">{infra.totalComContingencia.toLocaleString('pt-PT')} €</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                        <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs">
                          <span className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 font-medium">
                            {banda?.label} — {banda?.descricao}
                          </span>
                          <span className="text-muted-foreground">
                            Intervalo: {infra.custoMin.toLocaleString('pt-PT')} € – {infra.custoMax.toLocaleString('pt-PT')} €
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const ci = calcularCustosInfra();
                            const next: Record<string, string> = {};
                            for (const item of ci.items) {
                              // Mapear infra -> especialidade: aguas_esgotos_dom -> aguas_esgotos
                              const espId = item.infraId === 'aguas_esgotos_dom' ? 'aguas_esgotos' : item.infraId;
                              // Se já existe valor para esta esp (ex: aguas_esgotos), somar
                              const prev = parseFloat(next[espId] || '0');
                              const val = Math.round((prev + item.honorarioProjeto) / 50) * 50;
                              next[espId] = String(val);
                            }
                            setEspecialidadesValores(prev => ({ ...prev, ...next }));
                            toast.success('Honorários de especialidades atualizados a partir do custo estimado de obra.');
                          }}
                          className="mt-3 px-3 py-1.5 text-xs rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
                          Atualizar honorários de especialidades
                        </button>
                      </div>
                    );
                  })()}

                  {/* 7. Assuncoes + Dependencias (separadas) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Assuncoes de base</label>
                      <div className="text-xs text-muted-foreground space-y-1 mb-2">
                        {gerarAssuncoesLoteamento(lotCondicionantes, lotTemTopografia || lotFonteArea === 'topografia').map((a, i) => (
                          <p key={i} className="flex items-start gap-1.5">
                            <span className="mt-0.5 w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0" />
                            {a}
                          </p>
                        ))}
                      </div>
                      <textarea value={lotAssuncoesManuais} onChange={(e) => setLotAssuncoesManuais(e.target.value)}
                        className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none"
                        rows={2} placeholder="Assuncoes adicionais (uma por linha)..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Dependencias</label>
                      <div className="text-xs text-muted-foreground space-y-1 mb-2">
                        {gerarDependenciasLoteamento(lotCondicionantes, lotTemTopografia || lotFonteArea === 'topografia', [lotCenarioA, lotCenarioB, ...(lotNumAlternativas === '3' ? [lotCenarioC] : [])]).map((d, i) => (
                          <p key={i} className="flex items-start gap-1.5">
                            <span className="mt-0.5 w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />
                            {d}
                          </p>
                        ))}
                      </div>
                      <textarea value={lotDependenciasManuais} onChange={(e) => setLotDependenciasManuais(e.target.value)}
                        className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:border-primary focus:outline-none"
                        rows={2} placeholder="Dependencias adicionais (uma por linha)..." />
                    </div>
                  </div>
                </div>
              )}
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Valor da Obra (€) *</label>
                  <input
                    type="number"
                    min="0"
                    value={valorObra}
                    onChange={(e) => setValorObra(e.target.value)}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                    placeholder="Ex: 200000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">% Honorários</label>
                  <input
                    type="number"
                    min="3"
                    max="15"
                    step="0.5"
                    value={pctHonor}
                    onChange={(e) => setPctHonor(e.target.value)}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Típico: 5–12%</p>
                </div>
              </div>
            )}

            <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl space-y-4">
              {referenciaExibida && (
                <div className="flex justify-between items-center pb-2 border-b border-primary/20">
                  <span className="text-muted-foreground">Referência</span>
                  <span className="font-semibold">{referenciaExibida}</span>
                </div>
              )}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Honorários de arquitetura</span>
                  <span className="font-semibold">{formatCurrency(valorArq)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Especialidades</span>
                  <span className="font-semibold">{formatCurrency(valorEsp)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-primary/20">
                  <span className="font-medium">Total (sem IVA)</span>
                  <span className="font-semibold">{formatCurrency(totalSemIVA)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">IVA (23%)</span>
                  <span className="font-semibold">{formatCurrency(valorIVA)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-primary/20">
                  <span className="font-medium">Total (com IVA)</span>
                  <span className="text-xl font-bold text-primary">{formatCurrency(totalComIVA)}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Referência orientativa. Tabelas OA não são vinculativas.
              </p>

              <div className="mt-6 space-y-4">
                <p className="text-sm font-medium">Previsualização da proposta (folhas A4)</p>
                <div className="flex justify-center overflow-x-auto overflow-y-auto py-4 max-h-[calc(100vh-16rem)]" style={{ backgroundColor: 'hsl(var(--muted) / 0.3)' }}>
                  <div className="relative">
                    {previewPayload && <ProposalPreviewPaginated ref={previewRef} payload={previewPayload} lang={lang} />}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {!propostaFechada ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (validarProposta()) {
                            setPropostaFechada(true);
                            toast.success(t('calcProposalClosed', lang));
                          }
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        <Lock className="w-4 h-4" />
                        {t('calcCloseProposal', lang)}
                      </button>
                      <span className="text-xs text-muted-foreground">
                        {t('calcReadyToSendHint', lang)}
                      </span>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <p className="text-sm font-medium text-primary">{t('calcReadyToSend', lang)}</p>
                        <button
                          type="button"
                          onClick={() => setPropostaFechada(false)}
                          className="text-xs text-muted-foreground hover:text-foreground underline"
                        >
                          {t('calcReopenProposal', lang)}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <button
                          type="button"
                          onClick={exportHonorariosPDF}
                          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                        >
                          <FileDown className="w-4 h-4" />
                          Exportar PDF
                        </button>
                        <button
                          type="button"
                          onClick={obterLinkProposta}
                          disabled={gerandoLink}
                          className="flex items-center gap-2 px-4 py-2.5 bg-muted border border-border rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors disabled:opacity-50"
                        >
                          {gerandoLink ? (
                            <>
                              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              A gerar...
                            </>
                          ) : (
                            <>
                              <Link2 className="w-4 h-4" />
                              Obter link HTML
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowHistoryModal(true)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-muted border border-border rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors"
                          title="Ver histórico de propostas"
                        >
                          <History className="w-4 h-4" />
                          Histórico
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">{t('calcReadyToSendHint', lang)}</p>
                    </div>
                  )}
                  {linkPropostaExibido && (
                    <div className={`rounded-lg border p-3 ${linkDesatualizado ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/30' : 'border-green-400 bg-green-50 dark:bg-green-950/30'}`}>
                      {linkDesatualizado ? (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-amber-600 dark:text-amber-400">⚠️</span>
                          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Link desatualizado — os valores foram alterados</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-green-600 dark:text-green-400">✓</span>
                          <p className="text-xs font-semibold text-green-700 dark:text-green-400">
                            Link da proposta copiado!
                          </p>
                        </div>
                      )}
                      
                      {/* Link da proposta */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={linkPropostaExibido}
                          className={`flex-1 min-w-0 px-3 py-2 text-xs bg-background border rounded font-mono ${linkDesatualizado ? 'border-amber-300 opacity-60' : 'border-green-300'}`}
                          onClick={(e) => {
                            (e.target as HTMLInputElement).select();
                            navigator.clipboard.writeText(linkPropostaExibido);
                            toast.success('Link copiado!');
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(linkPropostaExibido);
                            toast.success('Link copiado!');
                          }}
                          className="shrink-0 px-3 py-2 text-sm font-medium bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          Copiar
                        </button>
                        {linkDesatualizado ? (
                          <button
                            type="button"
                            onClick={obterLinkProposta}
                            className="shrink-0 px-3 py-2 text-sm font-medium bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
                          >
                            Regenerar
                          </button>
                        ) : (
                          <a
                            href={linkPropostaExibido}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                          >
                            Abrir
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeCalculator === 'ichpop' && <IchpopCalculatorCard />}

        {activeCalculator === 'areas' && (
          <motion.div
            key="areas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Conversor de Áreas</h3>
            <div className="flex flex-col sm:flex-row items-end gap-4 mb-6 flex-wrap">
              <div className="flex-1 min-w-[120px]">
                <label className="block text-sm font-medium mb-2">Valor *</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={areaValue}
                  onChange={(e) => setAreaValue(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                  placeholder="Ex: 100"
                />
              </div>
              <div className="w-full sm:w-28">
                <label className="block text-sm font-medium mb-2">De</label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                >
                  {Object.keys(AREA_TO_M2).map((u) => (
                    <option key={u} value={u}>{unitLabel[u] ?? u}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-center pb-3">
                <ArrowRightLeft className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="w-full sm:w-28">
                <label className="block text-sm font-medium mb-2">Para</label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                >
                  {Object.keys(AREA_TO_M2).map((u) => (
                    <option key={u} value={u}>{unitLabel[u] ?? u}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Ruler className="w-4 h-4" />
                <span className="text-sm">Resultado</span>
              </div>
              <p className="text-4xl font-bold text-primary">
                {convertArea().toLocaleString('pt-PT', { maximumFractionDigits: 4 })}{' '}
                <span className="text-2xl">{unitLabel[toUnit] ?? toUnit}</span>
              </p>
            </div>
          </motion.div>
        )}

        {activeCalculator === 'custo' && (
          <motion.div
            key="custo"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Custo de Construção</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Área (m²) *</label>
                <input
                  type="number"
                  min="0"
                  value={custoArea}
                  onChange={(e) => setCustoArea(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                  placeholder="Ex: 200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tipo</label>
                <select
                  value={custoTipo}
                  onChange={(e) => setCustoTipo(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                >
                  <option value="economica">Económica (700€/m²)</option>
                  <option value="media">Média (1.000€/m²)</option>
                  <option value="alta">Alta Qualidade (1.500€/m²)</option>
                  <option value="luxo">Luxo (2.200€/m²)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Região</label>
                <select
                  value={custoRegiao}
                  onChange={(e) => setCustoRegiao(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                >
                  <option value="lisboa">Lisboa (+15%)</option>
                  <option value="litoral">Litoral (+5%)</option>
                  <option value="interior">Interior (−12%)</option>
                </select>
              </div>
            </div>
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Building2 className="w-4 h-4" />
                <span className="text-sm">Custo Estimado</span>
              </div>
              <p className="text-4xl font-bold text-primary">
                {custoArea ? formatCurrency(calculateCusto()) : '---'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Aproximado. Exclui terreno, licenças e projectos. Custo real varia com especificações.
              </p>
            </div>
          </motion.div>
        )}

        {activeCalculator === 'imovel' && (
          <motion.div
            key="imovel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Avaliação Imobiliária</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Área (m²) *</label>
                <input
                  type="number"
                  min="0"
                  value={imovelArea}
                  onChange={(e) => setImovelArea(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                  placeholder="Ex: 120"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Localização</label>
                <select
                  value={imovelLocal}
                  onChange={(e) => setImovelLocal(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                >
                  <option value="lisboa">Lisboa</option>
                  <option value="porto">Porto</option>
                  <option value="algarve">Algarve</option>
                  <option value="aveiro">Aveiro</option>
                  <option value="coimbra">Coimbra</option>
                  <option value="leiria">Leiria</option>
                  <option value="braga">Braga</option>
                  <option value="interior">Interior</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tipo</label>
                <select
                  value={imovelTipo}
                  onChange={(e) => setImovelTipo(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                >
                  <option value="apartamento">Apartamento</option>
                  <option value="moradia">Moradia</option>
                  <option value="loja">Loja</option>
                  <option value="escritorio">Escritório</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Estado</label>
                <select
                  value={imovelEstado}
                  onChange={(e) => setImovelEstado(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                >
                  <option value="novo">Novo</option>
                  <option value="bom">Bom</option>
                  <option value="medio">Médio</option>
                  <option value="recuperar">A recuperar</option>
                </select>
              </div>
            </div>
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Valor Estimado</span>
              </div>
              <p className="text-4xl font-bold text-primary">
                {imovelArea ? formatCurrency(calculateImovel()) : '---'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Valor de mercado orientativo. Para avaliação oficial, consulte avaliador credenciado.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!activeCalculator && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-muted-foreground"
        >
          <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Selecione uma calculadora acima para começar</p>
        </motion.div>
      )}
    </div>

    {/* Modal de Propostas Guardadas */}
    <AnimatePresence>
      {showProposalsList && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowProposalsList(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <History className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Propostas Guardadas</h2>
                  <p className="text-sm text-muted-foreground">{proposals.length} proposta{proposals.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button
                onClick={() => setShowProposalsList(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {proposals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhuma proposta guardada</p>
                </div>
              ) : (
                proposals.map((proposal) => (
                  <button
                    key={proposal.id}
                    onClick={() => loadProposal(proposal)}
                    className="w-full p-4 bg-muted/50 hover:bg-muted border border-border rounded-xl text-left transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-primary">{proposal.reference || 'Sem referência'}</span>
                          {proposal.calculatorState ? (
                            <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-500 rounded-full">Editável</span>
                          ) : (
                            <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-500 rounded-full">Só visualização</span>
                          )}
                        </div>
                        <p className="text-sm font-medium truncate">{proposal.clientName}</p>
                        {proposal.projectName && (
                          <p className="text-sm text-muted-foreground truncate">{proposal.projectName}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>{proposal.createdAt}</span>
                          {proposal.location && <span>• {proposal.location}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{formatCurrency(proposal.totalWithVat)}</p>
                        <p className="text-xs text-muted-foreground">c/ IVA</p>
                      </div>
                    </div>
                    {proposal.proposalUrl && (
                      <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">{proposal.proposalUrl}</span>
                        <span className="text-xs text-primary group-hover:underline">Abrir na calculadora →</span>
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Modal de histórico de propostas */}
    <ProposalHistoryModal 
      isOpen={showHistoryModal} 
      onClose={() => setShowHistoryModal(false)} 
    />
    </>
  );
}
