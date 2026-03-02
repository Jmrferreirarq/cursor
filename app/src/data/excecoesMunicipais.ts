// Exceções e Notas Regulamentares por Município
// FA-360 Platform — v1.0
// Fonte: PDMs, Deliberações CM, Despachos e jurisprudência administrativa

export interface ExcecaoMunicipal {
  id: string;
  municipio: string;          // nome normalizado do município
  diplomaRef: string;         // id do diploma de referência (ex: 'rjue', 'rjigt')
  categoria: 'parametro' | 'isencao' | 'procedimento' | 'condicionante' | 'prazo';
  tipologias?: string[];       // tipologia ids a que se aplica (vazio = todas)
  titulo: string;
  descricao: string;
  fonte: string;               // ex: "PDM Aveiro — Art. 45.º" ou "Deliberação CM 2023/14"
  dataVigor?: string;          // ISO date
  validadoEm?: string;         // data da última verificação
}

export const EXCECOES_MUNICIPAIS: ExcecaoMunicipal[] = [

  // ─── AVEIRO ──────────────────────────────────────────────────────
  {
    id: 'avr-01',
    municipio: 'Aveiro',
    diplomaRef: 'rjue',
    categoria: 'isencao',
    tipologias: ['reabilitacao'],
    titulo: 'Isenção de comunicação prévia em reabilitação ≤ 150 m²',
    descricao: 'Em Aveiro, intervenções de reabilitação até 150 m² em edifícios existentes podem estar isentas de controlo prévio ao abrigo do DL 10/2024 (Simplex), desde que não alterem estrutura nem uso.',
    fonte: 'DL 10/2024 + Despacho CM Aveiro',
    dataVigor: '2024-04-01',
    validadoEm: '2025-01-01',
  },
  {
    id: 'avr-02',
    municipio: 'Aveiro',
    diplomaRef: 'rjigt',
    categoria: 'parametro',
    tipologias: ['moradia_isolada', 'moradia_geminada'],
    titulo: 'Cércea máxima em zonas de expansão — 2 pisos + sótão',
    descricao: 'Nas zonas de expansão urbana do PDM de Aveiro, a cércea máxima é 6,5 m (2 pisos acima do solo). Sótão habitável permitido se recuado ≥ 1,5 m do plano de fachada.',
    fonte: 'PDM Aveiro — Art. 48.º, §2',
    dataVigor: '2020-06-15',
    validadoEm: '2025-01-01',
  },
  {
    id: 'avr-03',
    municipio: 'Aveiro',
    diplomaRef: 'rjigt',
    categoria: 'parametro',
    titulo: 'Índice de impermeabilização máximo em solo urbano consolidado',
    descricao: 'Solo urbano consolidado em Aveiro: índice de impermeabilização máximo de 0,70. Zonas de baixa densidade: máximo de 0,50. Obrigatória câmara de retenção se impermeabilização > 0,60.',
    fonte: 'PDM Aveiro — Art. 52.º',
    dataVigor: '2020-06-15',
    validadoEm: '2025-01-01',
  },

  // ─── BRAGA ───────────────────────────────────────────────────────
  {
    id: 'bga-01',
    municipio: 'Braga',
    diplomaRef: 'rjigt',
    categoria: 'parametro',
    tipologias: ['moradia_isolada', 'moradia_geminada', 'moradia_banda'],
    titulo: 'Cércea máxima na Zona Histórica — 10 m',
    descricao: 'Na zona histórica e de transição de Braga (ARU), a cércea máxima é 10 m (≈ 3 pisos). Obrigatório parecer DRCN para edifícios classificados ou em zona de proteção.',
    fonte: 'PDM Braga 2015 — Art. 45.º + Carta Património',
    dataVigor: '2015-09-01',
    validadoEm: '2025-01-01',
  },
  {
    id: 'bga-02',
    municipio: 'Braga',
    diplomaRef: 'rjue',
    categoria: 'procedimento',
    titulo: 'Submissão exclusivamente digital no e-Urbanismo',
    descricao: 'Câmara Municipal de Braga exige submissão de todos os pedidos de licenciamento, comunicação prévia e isenções exclusivamente via plataforma e-Urbanismo. Não aceita entrega presencial de processos novos desde 2023.',
    fonte: 'Deliberação CM Braga n.º 45/2023',
    dataVigor: '2023-01-02',
    validadoEm: '2025-01-01',
  },
  {
    id: 'bga-03',
    municipio: 'Braga',
    diplomaRef: 'rjigt',
    categoria: 'condicionante',
    titulo: 'Zona de risco sísmico moderado — reforço estrutural obrigatório',
    descricao: 'O território de Braga insere-se em zona sísmica 2.3 (EC8). Nos projetos de reabilitação estrutural e construção nova, é obrigatória a análise de risco sísmico e eventual reforço de fundações.',
    fonte: 'NP EN 1998-1 + Portaria 701-H/2008',
    dataVigor: '2010-01-01',
    validadoEm: '2025-01-01',
  },

  // ─── PORTO ───────────────────────────────────────────────────────
  {
    id: 'prt-01',
    municipio: 'Porto',
    diplomaRef: 'rjigt',
    categoria: 'condicionante',
    titulo: 'ARU — Área de Reabilitação Urbana cobre grande parte do centro',
    descricao: 'O Porto tem extensa ARU que abrange grande parte da cidade consolidada. Projetos em ARU beneficiam de regime especial de reabilitação (menor exigência de estacionamento, possibilidade de isenção de algumas especialidades) mas requerem parecer da SRU Porto Vivo.',
    fonte: 'Delimitação ARU Porto — Aviso 13869/2012',
    dataVigor: '2012-11-01',
    validadoEm: '2025-01-01',
  },
  {
    id: 'prt-02',
    municipio: 'Porto',
    diplomaRef: 'rjue',
    categoria: 'procedimento',
    titulo: 'Projetos em zona histórica — obrigatoriedade de parecer DRCN',
    descricao: 'Edifícios na Zona de Proteção do Centro Histórico do Porto (classificado pela UNESCO) requerem parecer prévio da Direção Regional de Cultura do Norte. Prazo de resposta DRCN: 30 dias úteis.',
    fonte: 'Lei 107/2001 + PDM Porto',
    dataVigor: '2006-09-01',
    validadoEm: '2025-01-01',
  },
  {
    id: 'prt-03',
    municipio: 'Porto',
    diplomaRef: 'rjigt',
    categoria: 'parametro',
    tipologias: ['multifamiliar', 'comercio_servicos'],
    titulo: 'Estacionamento — redução em ARU',
    descricao: 'Em ARU do Porto, a obrigação de estacionamento privado pode ser reduzida a 50% ou dispensada mediante deliberação camarária, quando demonstrada impossibilidade técnica ou inviabilidade económica.',
    fonte: 'PDM Porto — Art. 73.º + Regulamento Camarário',
    dataVigor: '2021-07-01',
    validadoEm: '2025-01-01',
  },

  // ─── LISBOA ──────────────────────────────────────────────────────
  {
    id: 'lx-01',
    municipio: 'Lisboa',
    diplomaRef: 'rjue',
    categoria: 'procedimento',
    titulo: 'Lisboa Urbanismo — plataforma própria para licenciamentos',
    descricao: 'A CML utiliza plataforma própria "Lisboa Urbanismo" (diferente do portal nacional). Todos os processos devem ser submetidos nesta plataforma. Requer registo prévio e autenticação com Chave Móvel.',
    fonte: 'Deliberação CML 2019/22',
    dataVigor: '2020-01-01',
    validadoEm: '2025-01-01',
  },
  {
    id: 'lx-02',
    municipio: 'Lisboa',
    diplomaRef: 'rjigt',
    categoria: 'condicionante',
    tipologias: ['reabilitacao', 'multifamiliar'],
    titulo: 'AUGI — Áreas Urbanas de Génese Ilegal com regras próprias',
    descricao: 'Várias zonas de Lisboa têm estatuto AUGI. Nestes territórios, as operações urbanísticas estão sujeitas a regras de reconversão específicas (Lei 91/95) que prevalecem sobre o PDM.',
    fonte: 'Lei 91/95 (Alterada L 165/99) + PDM Lisboa',
    dataVigor: '1995-09-01',
    validadoEm: '2025-01-01',
  },

  // ─── COIMBRA ─────────────────────────────────────────────────────
  {
    id: 'cim-01',
    municipio: 'Coimbra',
    diplomaRef: 'rjigt',
    categoria: 'condicionante',
    titulo: 'Zona de proteção do patrimônio classificado — Alta de Coimbra',
    descricao: 'A Alta de Coimbra (Universidade) é Património Mundial UNESCO. Toda a construção em zona de proteção (100 m) exige parecer DRCN e sujeita-se a condicionantes específicas de volumetria e materiais.',
    fonte: 'Decreto 25/2013 + PDM Coimbra',
    dataVigor: '2013-06-21',
    validadoEm: '2025-01-01',
  },

  // ─── SINTRA ──────────────────────────────────────────────────────
  {
    id: 'sin-01',
    municipio: 'Sintra',
    diplomaRef: 'rjigt',
    categoria: 'condicionante',
    titulo: 'Parque Natural Sintra-Cascais — condicionantes de edificação',
    descricao: 'Grande parte do território de Sintra insere-se no PNSAC (Parque Natural Sintra-Cascais). Construção nova extremamente restrita. Reabilitação permitida com parecer da ICNF. Ocupações e usos regulamentados pelo POPNSC.',
    fonte: 'RCM 1-B/2004 — POPNSC + PDM Sintra',
    dataVigor: '2004-01-04',
    validadoEm: '2025-01-01',
  },

  // ─── CASCAIS ─────────────────────────────────────────────────────
  {
    id: 'csc-01',
    municipio: 'Cascais',
    diplomaRef: 'rjige',
    categoria: 'procedimento',
    titulo: 'Plataforma própria CascaisUrbanismo para comunicações prévias',
    descricao: 'Cascais tem plataforma própria para comunicações prévias de obras. Licenciamentos mais complexos transitam para o Portal Nacional. Verificar sempre o tipo de operação antes da submissão.',
    fonte: 'Deliberação CM Cascais 2022',
    dataVigor: '2022-09-01',
    validadoEm: '2025-01-01',
  },

  // ─── SETÚBAL ─────────────────────────────────────────────────────
  {
    id: 'stb-01',
    municipio: 'Setúbal',
    diplomaRef: 'rjigt',
    categoria: 'condicionante',
    tipologias: ['moradia_isolada', 'loteamento'],
    titulo: 'REN — extensa área de Reserva Ecológica Nacional',
    descricao: 'Setúbal tem vasta área classificada como REN, especialmente na frente costeira e áreas de cheias. Edificação em REN é proibida salvo exceções tipificadas no DL 166/2008. Obrigatória consulta prévia à ARH/APA.',
    fonte: 'DL 166/2008 (alt. DL 239/2012) + PDM Setúbal',
    dataVigor: '2008-08-12',
    validadoEm: '2025-01-01',
  },

  // ─── OVAR ────────────────────────────────────────────────────────
  {
    id: 'ovr-01',
    municipio: 'Ovar',
    diplomaRef: 'rjigt',
    categoria: 'parametro',
    tipologias: ['moradia_isolada', 'moradia_geminada'],
    titulo: 'Afastamentos mínimos aos limites de propriedade — 5 m',
    descricao: 'O PDM de Ovar fixa afastamento mínimo de 5 m aos limites laterais e posterior para habitação unifamiliar em solo urbano consolidado. Exceção possível em construção geminada se aprovado na operação de loteamento.',
    fonte: 'PDM Ovar — Art. 38.º',
    dataVigor: '2019-03-01',
    validadoEm: '2025-01-01',
  },

  // ─── VAGOS ───────────────────────────────────────────────────────
  {
    id: 'vgs-01',
    municipio: 'Vagos',
    diplomaRef: 'rjigt',
    categoria: 'parametro',
    titulo: 'Índice de utilização do solo urbano — 0,4 a 0,8',
    descricao: 'O PDM de Vagos define índice de utilização entre 0,4 e 0,8 consoante a categoria de espaço urbano. Espaços de actividades económicas: máximo 1,0. Verificar sempre a planta de ordenamento para a parcela específica.',
    fonte: 'PDM Vagos — Regulamento Art. 25.º',
    dataVigor: '2017-07-01',
    validadoEm: '2025-01-01',
  },

  // ─── ÍLHAVO ──────────────────────────────────────────────────────
  {
    id: 'ilv-01',
    municipio: 'Ílhavo',
    diplomaRef: 'rjigt',
    categoria: 'condicionante',
    titulo: 'Zona costeira e REN — restrições severas à construção',
    descricao: 'Ílhavo tem faixa costeira significativa sujeita à Reserva Ecológica Nacional e ao Domínio Público Marítimo (50 m). Toda a construção nesta faixa é proibida. As candidaturas a apoios de praia (POC) requerem parecer APA.',
    fonte: 'DL 166/2008 + DL 226-A/2007 + POC Ovar-Marinha Grande',
    dataVigor: '2007-07-31',
    validadoEm: '2025-01-01',
  },
];

// Helper: obter exceções para um município (case-insensitive, partial match)
export function getExcecoesMunicipio(municipio: string): ExcecaoMunicipal[] {
  if (!municipio) return [];
  const q = municipio.toLowerCase().trim();
  return EXCECOES_MUNICIPAIS.filter((e) => e.municipio.toLowerCase().includes(q) || q.includes(e.municipio.toLowerCase()));
}

// Helper: obter exceções para um município + tipologia
export function getExcecoesMunicipioTipologia(municipio: string, tipologiaId: string): ExcecaoMunicipal[] {
  return getExcecoesMunicipio(municipio).filter(
    (e) => !e.tipologias || e.tipologias.length === 0 || e.tipologias.includes(tipologiaId),
  );
}

export const CATEGORIA_EXCECAO_CONFIG: Record<ExcecaoMunicipal['categoria'], { label: string; color: string; icon: string }> = {
  parametro:      { label: 'Parâmetro', color: 'bg-blue-500/20 text-blue-400 border-blue-500/20', icon: 'Ruler' },
  isencao:        { label: 'Isenção', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20', icon: 'CheckCircle2' },
  procedimento:   { label: 'Procedimento', color: 'bg-violet-500/20 text-violet-400 border-violet-500/20', icon: 'ClipboardList' },
  condicionante:  { label: 'Condicionante', color: 'bg-red-500/20 text-red-400 border-red-500/20', icon: 'AlertTriangle' },
  prazo:          { label: 'Prazo', color: 'bg-amber-500/20 text-amber-400 border-amber-500/20', icon: 'Clock' },
};
