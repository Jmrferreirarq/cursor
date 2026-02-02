import { useEffect, useMemo, useRef, useState } from 'react';
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
} from 'lucide-react';
import { encodeProposalPayload, formatCurrency as formatCurrencyPayload, type ProposalPayload } from '../lib/proposalPayload';
import { ProposalDocument } from '../components/proposals/ProposalDocument';
import { IchpopCalculatorCard } from '../components/calculators/IchpopCalculatorCard';
import { ICHPOP_PHASES } from '../data/calculatorConstants';
import { useLanguage } from '../context/LanguageContext';
import { t, formatDate, formatCurrency as formatCurrencyLocale } from '../locales';
import { toast } from 'sonner';

const APP_NAME = import.meta.env.VITE_APP_NAME ?? 'FA-360';
const APP_SLOGAN = import.meta.env.VITE_APP_SLOGAN ?? '';
const ARCHITECT_NAME = import.meta.env.VITE_ARCHITECT_NAME ?? '';
const ARCHITECT_OASRN = import.meta.env.VITE_ARCHITECT_OASRN ?? '';

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
const ESPECIALIDADES_SUGESTAO: Record<string, { minValor: number; rate: number }> = {
  estruturas: { minValor: 800, rate: 6 },
  aguas_esgotos: { minValor: 500, rate: 3 },
  gas: { minValor: 400, rate: 2 },
  eletrico: { minValor: 600, rate: 4 },
  ited: { minValor: 350, rate: 1.5 },
  avac: { minValor: 700, rate: 5 },
  termico: { minValor: 500, rate: 3.5 },
  scie: { minValor: 500, rate: 3 },
  domotica: { minValor: 400, rate: 2 },
  paisagismo: { minValor: 800, rate: 5 },
  interiores: { minValor: 1000, rate: 8 },
  geotecnia: { minValor: 1500, rate: 0 }, // valor fixo mínimo
  coord_especialidades: { minValor: 500, rate: 2.5 },
  conservacao: { minValor: 1200, rate: 8 },
  acustica: { minValor: 500, rate: 3 },
  iluminacao: { minValor: 400, rate: 2 },
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
];

// Extras opcionais (serviços adicionais que o cliente pode optar por incluir)
const EXTRAS_PROPOSTA: { id: string; nome: string; tipo: 'fixo' | 'por_m2' | 'por_visita' | 'por_avenca'; valorSugerido: number; taxaPorM2?: number; taxaPorVisita?: number; taxaPorMes?: number; tetoMinimo?: number; unitLabel?: string; categoria: 'arq' | 'esp' }[] = [
  { id: 'projeto_execucao_completo', nome: 'Projeto de Execução (completo)', tipo: 'por_m2', valorSugerido: 0, tetoMinimo: 2500, taxaPorM2: 15, categoria: 'arq' },
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
  projeto_execucao_completo: 'Projeto de execução completo: pormenorização integral de elementos construtivos, especificação de materiais, compatibilização com especialidades e informação necessária à empreitada. Valor indicativo: teto mínimo + €/m² conforme área. Âmbito e tempo de execução comparável ou superior ao licenciamento.',
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
const NOTA_BIM = 'Todo o processo é desenvolvido em metodologia BIM (Building Information Modeling / Modelação da Informação da Construção), utilizando modelos digitais 3D que integram informação geométrica e alfanumérica do edificado. O desenvolvimento contempla imagens interiores não fotorealistas e imagens exteriores de todas as fases do projeto.';


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
  'arq_fotogrametria', 'arq_especialidades', 'arq_projeto_execucao_completo', 'arq_alteracoes_briefing', 'arq_deslocacoes', 'arq_tramites',
  'arq_obra_clandestina', 'arq_alteracoes_posteriores', 'arq_certificacao', 'arq_acompanhamento',
  'arq_impressao', 'arq_taxas_entidades', 'arq_mapa_quantidades',
];

// Exceções por CATEGORIA (herdadas por todas as tipologias da categoria)
const CATEGORIA_EXCECOES_REMOVER: Record<string, string[]> = {
  Urbanismo: ['arq_fiscalizacao', 'arq_coord_seguranca', 'arq_certificacao', 'arq_acompanhamento', 'arq_geotecnia'],
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
  { id: 'arq_projeto_execucao_completo', label: 'Projeto de Execução completo (quando não incluído; pormenores genéricos estão incluídos no licenciamento)' },
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

// Descrições das especialidades (para a proposta)
const DESCRICOES_ESPECIALIDADES: Record<string, string> = {
  estruturas: 'Projeto de estruturas e fundações, análise e dimensionamento para garantir segurança e durabilidade, em conformidade com as normas em vigor (s/ estudo sísmico).',
  aguas_esgotos: 'Projeto de águas prediais, residuais e pluviais, assegurando a gestão eficiente de águas no edifício e o cumprimento ambiental.',
  gas: 'Projeto de redes de gás, dimensionamento e traçado das instalações em conformidade com a regulamentação de segurança.',
  eletrico: 'Projeto de instalações elétricas, distribuição de energia, proteções e circuitos, de acordo com as normas técnicas.',
  ited: 'Projeto de infraestruturas de telecomunicações no edifício (telefone, internet, televisão), garantindo a conectividade.',
  avac: 'Projeto de climatização e ventilação, sistemas de regulação de temperatura e qualidade do ar interior.',
  termico: 'Estudo térmico e eficiência energética do edifício, conformidade com RCCTE/SCE e certificação energética.',
  scie: 'Ficha ou projeto de segurança contra incêndios em edifícios (SCIE), cumprimento das normas de evacuação e proteção.',
  domotica: 'Projeto de sistemas de automação e gestão técnica centralizada (GTC) do edifício.',
  paisagismo: 'Projeto de arranjos exteriores, espaços exteriores, vegetação, pavimentos e elementos de jardim.',
  interiores: 'Projeto de arquitetura de interiores, layout, acabamentos e equipamentos dos espaços.',
  geotecnia: 'Estudo geotécnico, caracterização do terreno e definição de soluções de fundações e contenções.',
  coord_especialidades: 'Coordenação e compatibilização dos projetos de especialidades com o projeto de arquitetura.',
  conservacao: 'Projeto de conservação e restauro, intervenção em património edificado com critérios de preservação.',
  acustica: 'Estudo acústico, controlo de ruído e melhoria da qualidade sonora nos espaços.',
  iluminacao: 'Projeto de iluminação, natural e artificial, e integração com a arquitetura.',
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
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);

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
  const [projetoNome, setProjetoNome] = useState('');
  const [referenciaProposta, setReferenciaProposta] = useState('');
  const [localProposta, setLocalProposta] = useState('');
  const [linkGoogleMaps, setLinkGoogleMaps] = useState('');
  const [extrasValores, setExtrasValores] = useState<Record<string, string>>({});
  const [despesasReembolsaveis, setDespesasReembolsaveis] = useState('');
  const [especialidadesValores, setEspecialidadesValores] = useState<Record<string, string>>({});
  const [exclusoesSelecionadas, setExclusoesSelecionadas] = useState<Set<string>>(new Set());
  const [linkPropostaExibido, setLinkPropostaExibido] = useState<string | null>(null);
  const [propostaFechada, setPropostaFechada] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

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
      const pctFases = Array.from(fasesIncluidas).reduce(
        (s, id) => s + (ICHPOP_PHASES.find((p) => p.id === id)?.pct ?? 0),
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
    const pctFases = Array.from(fasesIncluidas).reduce(
      (s, id) => s + (ICHPOP_PHASES.find((p) => p.id === id)?.pct ?? 0),
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
    if (!pdfRef.current) return;
    if (!validarProposta()) return;
    try {
      await document.fonts.ready;
    } catch {
      /* ignore */
    }
    const baseName = `orcamento-${referenciaExibida.replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}`;
    const opt = {
      margin: [20, 20, 20, 20] as [number, number, number, number],
      filename: `${baseName}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.95 },
      html2canvas: { scale: 1.5, useCORS: true, logging: false, width: 794 },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'], avoid: ['li', 'tr', '.pdf-no-break'] },
    };
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const pageOfFormat = t('proposalPageOf', lang);
      const pdf = await html2pdf().set(opt).from(pdfRef.current).toPdf().get('pdf');
      const total = pdf.internal.getNumberOfPages();
      const w = pdf.internal.pageSize.getWidth();
      const h = pdf.internal.pageSize.getHeight();
      for (let i = 1; i <= total; i++) {
        pdf.setPage(i);
        pdf.setFontSize(9);
        pdf.setTextColor(89);
        const label = pageOfFormat.replace('{page}', String(i)).replace('{total}', String(total));
        pdf.text(label, w / 2, h - 12, { align: 'center' });
      }
      pdf.save(opt.filename);
      toast.success('PDF guardado');
    } catch (e) {
      toast.error('Erro ao gerar PDF');
    }
  };

  const LOCALIZACAO_LABELS: Record<string, string> = { lisboa: 'Lisboa (+15%)', litoral: 'Litoral (+5%)', interior: 'Interior (−12%)' };

  const buildProposalPayload = (): ProposalPayload => {
    const soma = Array.from(fasesIncluidas).reduce((s, i) => s + (ICHPOP_PHASES.find((x) => x.id === i)?.pct ?? 0), 0);
    const fasesPagamento: { nome: string; pct?: number; valor?: number; isHeader?: boolean }[] = [
      { nome: `${t('proposal.paymentPhasesArq', lang)} — 100%`, isHeader: true },
      ...Array.from(fasesIncluidas).map((id) => {
        const p = ICHPOP_PHASES.find((x) => x.id === id);
        if (!p) return null;
        const v = soma > 0 ? (valorArq * p.pct) / soma : 0;
        const nome = t(`phases.${id}_name`, lang);
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
      const p = ICHPOP_PHASES.find((x) => x.id === id);
      if (!p) return null;
      const nome = t(`phases.${id}_name`, lang);
      const descricao = t(`phases.${id}_desc`, lang);
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
      local: localProposta,
      linkGoogleMaps: linkGoogleMaps.trim() || undefined,
      modo: honorMode === 'area' ? `${t('calc.modeByArea', lang)} (${area} m²)` : `${t('calc.modeByPct', lang)} (${valorObra}€)`,
      area: honorMode === 'area' ? area : undefined,
      valorObra: honorMode === 'pct' ? valorObra : undefined,
      tipologia: TIPOLOGIAS_HONORARIOS.find((tp) => tp.id === projectType)?.name ?? '',
      complexidade: complexity ? t(`complexity.${complexity}`, lang) : '',
      ...(TIPOLOGIAS_COM_PISOS.includes(projectType) && numPisos.trim() ? { pisos: parseInt(numPisos, 10) || undefined } : {}),
      fasesPct: Array.from(fasesIncluidas).reduce((s, id) => s + (ICHPOP_PHASES.find((p) => p.id === id)?.pct ?? 0), 0),
      localizacao: localProposta.trim() || (LOCALIZACAO_LABELS[honorLocalizacao] ?? honorLocalizacao),
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
      notaBim: t('longText.notaBim', lang),
      notaReunioes: honorMode === 'pct' ? t('longText.reunioesModoPct', lang) : areaRef <= 150 ? t('longText.reunioesAte150', lang) : areaRef <= 300 ? t('longText.reunioes150a300', lang) : t('longText.reunioesAcima300', lang),
      apresentacao: t('longText.apresentacao', lang),
      especialidadesDescricoes,
      exclusoes: exclusoesLabels,
      notas: [
        t('notes.validity', lang),
        t('notes.paymentTranches', lang),
        t('notes.changesAfterStudy', lang),
        t('notes.vatLegal', lang),
        t('notes.noSupervision', lang),
        t('notes.pormenoresNote', lang),
      ],
      duracaoEstimada: DURACAO_ESTIMADA_FASES.map((d) => {
        const duracao = formatarDuracaoSemanasMeses(d, lang, t);
        const nome = t(`phases.${d.id}_name`, lang);
        return { nome, duracao };
      }).filter((x) => x.duracao),
      extrasComDescricao: [
        (() => {
          const execExtra = EXTRAS_PROPOSTA.find((e) => e.id === 'projeto_execucao_completo');
          const valorInput = parseFloat(extrasValores['projeto_execucao_completo'] || '0') || 0;
          const teto = execExtra?.tetoMinimo ?? 2500;
          const taxa = execExtra?.taxaPorM2 ?? 15;
          const raw = teto + areaRef * taxa;
          const valorCalculado = areaRef > 0 ? Math.round(raw / 50) * 50 : 0;
          const valor = areaRef > 0 ? valorCalculado : valorInput;
          const formula = valor > 0 && areaRef > 0
            ? raw === valorCalculado
              ? `${teto}€ + (${areaRef} m² × ${taxa}€/m²) = ${formatCurrencyPayload(valorCalculado, lang)}`
              : `${teto}€ + (${areaRef} m² × ${taxa}€/m²) = ${Math.round(raw)}€ → ${formatCurrencyPayload(valorCalculado, lang)}`
            : undefined;
          return {
            id: 'projeto_execucao_completo',
            nome: t('extras.execucaoCompleto', lang),
            valor,
            descricao: EXTRAS_DESCRICOES['projeto_execucao_completo'] ?? '',
            ocultarValor: false,
            sobConsulta: valor <= 0,
            formula,
          };
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
          const formula = areaRef > 0
            ? raw === valorCalculado
              ? `${teto}€ + (${areaRef} m² × ${taxa}€/m²) = ${formatCurrencyPayload(valorCalculado, lang)}`
              : `${teto}€ + (${areaRef} m² × ${taxa}€/m²) = ${Math.round(raw)}€ → ${formatCurrencyPayload(valorCalculado, lang)}`
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
        ...EXTRAS_PROPOSTA.filter((e) => e.id !== 'projeto_execucao_completo' && e.id !== 'orcamentacao' && parseFloat(extrasValores[e.id] || '0') > 0).map((e) => ({
          id: e.id,
          nome: e.nome,
          valor: parseFloat(extrasValores[e.id] || '0'),
          descricao: EXTRAS_DESCRICOES[e.id] ?? '',
          ocultarValor: e.id === 'fotografia_obra',
          sobConsulta: e.id === 'alteracao_projeto_obra' && areaRef > 250,
          sobConsultaPrevia: e.id === 'alteracao_projeto_obra' && areaRef > 250,
        })),
      ],
      branding: { appName: APP_NAME, appSlogan: APP_SLOGAN, architectName: ARCHITECT_NAME, architectOasrn: ARCHITECT_OASRN ?? '' },
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
  ]);

  const obterLinkProposta = () => {
    if (!validarProposta()) return;
    const payload = buildProposalPayload();
    const encoded = encodeProposalPayload(payload);
    const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '';
    const url = `${window.location.origin}${base}/public/proposta?d=${encoded}&lang=${lang}`;
    setLinkPropostaExibido(url);
    navigator.clipboard.writeText(url).then(() => toast.success('Link copiado para a área de transferência')).catch(() => {});
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
  };

  return (
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
        {activeCalculator && (
          <button
            onClick={resetCalculator}
            className="flex items-center gap-2 px-4 py-2.5 bg-muted border border-border rounded-lg hover:bg-muted/80 transition-colors w-fit"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Limpar</span>
          </button>
        )}
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
                <input
                  type="text"
                  value={clienteNome}
                  onChange={(e) => setClienteNome(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
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
              <p className="text-sm font-medium mb-3">Fases incluídas no serviço</p>
              <p className="text-xs text-muted-foreground mb-3">Base (até licenciamento aprovado). Pormenores genéricos incluídos no licenciamento. Fiscalização e Projeto de Execução completo são extras.</p>
              <div className="flex flex-wrap gap-4">
                {ICHPOP_PHASES.map((phase) => (
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
                    (s, id) => s + (ICHPOP_PHASES.find((p) => p.id === id)?.pct ?? 0),
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
              {(() => {
                const execExtra = EXTRAS_PROPOSTA.find((x) => x.id === 'projeto_execucao_completo');
                const teto = execExtra?.tetoMinimo ?? 0;
                const taxa = execExtra?.taxaPorM2 ?? 0;
                const hint = teto > 0 && taxa > 0 ? `${teto}€ + ${taxa}€/m²` : taxa > 0 ? `${taxa}€/m²` : null;
                return (
                <div className="mb-4 p-3 rounded-lg border border-primary/30 bg-primary/5">
                  <p className="text-xs font-medium text-primary mb-2">Projeto de Execução completo (pormenores genéricos incluídos no licenciamento):</p>
                  <label className="flex items-center gap-3">
                    <span className="text-sm font-medium">Projeto de Execução (completo)</span>
                    {hint && <span className="text-xs text-muted-foreground">({hint})</span>}
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={extrasValores['projeto_execucao_completo'] ?? ''}
                      onChange={(ev) => setExtrasValores((prev) => ({ ...prev, projeto_execucao_completo: ev.target.value }))}
                      className="w-24 px-2 py-1.5 text-sm bg-background border border-border rounded"
                      placeholder="€"
                    />
                  </label>
                </div>
                );
              })()}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {EXTRAS_PROPOSTA.filter((e) => e.id !== 'projeto_execucao_completo').map((e) => {
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Área (m²) *</label>
                  <input
                    type="number"
                    min="0"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                    placeholder="Ex: 150"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tipologia</label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                  >
                    <option value="">— Selecionar tipologia —</option>
                    {['Habitação', 'Reabilitação', 'Comércio e Serviços', 'Indústria', 'Equipamentos', 'Urbanismo', 'Especiais']
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
              </div>
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
                <p className="text-sm font-medium">Previsualização da proposta</p>
                <div
                  ref={pdfRef}
                  className="bg-white text-black rounded-lg overflow-hidden"
                  style={{ width: '210mm', maxWidth: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
                >
                  {previewPayload && <ProposalDocument payload={previewPayload} lang={lang} />}
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
                    <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium text-primary">{t('calcReadyToSend', lang)}</p>
                        <button
                          type="button"
                          onClick={() => setPropostaFechada(false)}
                          className="text-xs text-muted-foreground hover:text-foreground underline"
                        >
                          {t('calcReopenProposal', lang)}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">{t('calcReadyToSendHint', lang)}</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={exportHonorariosPDF}
                          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                          <FileDown className="w-4 h-4" />
                          Exportar PDF
                        </button>
                        <button
                          type="button"
                          onClick={obterLinkProposta}
                          className="flex items-center gap-2 px-4 py-2 bg-muted border border-border rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors"
                        >
                          <Link2 className="w-4 h-4" />
                          Obter link HTML
                        </button>
                      </div>
                    </div>
                  )}
                  {linkPropostaExibido && (
                    <div className="rounded-lg border border-border bg-muted/30 p-3">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Link da proposta (copiado para a área de transferência):</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={linkPropostaExibido}
                          className="flex-1 min-w-0 px-3 py-2 text-sm bg-background border border-border rounded font-mono"
                          onClick={(e) => (e.target as HTMLInputElement).select()}
                        />
                        <a
                          href={linkPropostaExibido}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                        >
                          Abrir
                        </a>
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
  );
}
