/**
 * Guia de Construção — Faseamento e Custos Estimados
 * Para anexar às propostas de honorários
 */

// ═══════════════════════════════════════════════════════════════════
// FASEAMENTO DE OBRA POR CATEGORIA
// ═══════════════════════════════════════════════════════════════════

export interface ConstructionPhase {
  id: string;
  name: string;
  duration: string;
  description: string;
  tips?: string;
}

export interface CategoryPhases {
  category: string;
  description: string;
  totalDuration: string;
  phases: ConstructionPhase[];
}

export const CONSTRUCTION_PHASES: CategoryPhases[] = [
  {
    category: 'Habitação',
    description: 'Moradias unifamiliares, apartamentos e habitação coletiva',
    totalDuration: '12–18 meses',
    phases: [
      {
        id: 'hab_1',
        name: '1. Preparação e Fundações',
        duration: '1–2 meses',
        description: 'Limpeza do terreno, implantação topográfica, escavações, fundações (sapatas/estacas), impermeabilização.',
        tips: 'Realizar estudo geotécnico antes de iniciar. Verificar nível freático.',
      },
      {
        id: 'hab_2',
        name: '2. Estrutura',
        duration: '2–4 meses',
        description: 'Execução de pilares, vigas, lajes. Estrutura em betão armado ou metálica conforme projeto.',
        tips: 'Respeitar tempos de cura do betão. Coordenar com especialidades (negativos).',
      },
      {
        id: 'hab_3',
        name: '3. Alvenarias e Cobertura',
        duration: '1–2 meses',
        description: 'Paredes exteriores e interiores, cobertura (telha, terraço), impermeabilizações.',
        tips: 'Executar cobertura antes das chuvas. Verificar pontes térmicas.',
      },
      {
        id: 'hab_4',
        name: '4. Instalações Técnicas',
        duration: '2–3 meses',
        description: 'Redes de água, esgotos, eletricidade, telecomunicações, AVAC, gás.',
        tips: 'Fotografar todas as instalações antes de fechar paredes. Testar pressões.',
      },
      {
        id: 'hab_5',
        name: '5. Revestimentos e Acabamentos',
        duration: '3–4 meses',
        description: 'Rebocos, isolamentos, pavimentos, revestimentos cerâmicos, pinturas, carpintarias.',
        tips: 'Deixar secar rebocos antes de pintar. Proteger pavimentos durante obra.',
      },
      {
        id: 'hab_6',
        name: '6. Arranjos Exteriores',
        duration: '1–2 meses',
        description: 'Muros, pavimentos exteriores, piscina, jardim, portões, iluminação exterior.',
        tips: 'Executar após conclusão da construção principal para evitar danos.',
      },
      {
        id: 'hab_7',
        name: '7. Limpeza e Entrega',
        duration: '2–4 semanas',
        description: 'Limpeza final, verificações, testes de equipamentos, elaboração de telas finais.',
        tips: 'Solicitar manuais de equipamentos. Verificar garantias.',
      },
    ],
  },
  {
    category: 'Reabilitação',
    description: 'Reabilitação urbana, restauro e conservação de edifícios existentes',
    totalDuration: '8–24 meses',
    phases: [
      {
        id: 'reab_1',
        name: '1. Levantamento e Demolições',
        duration: '1–2 meses',
        description: 'Levantamento do existente, demolições seletivas, escoramento provisório, remoção de entulho.',
        tips: 'Documentar fotograficamente o estado inicial. Verificar elementos a preservar.',
      },
      {
        id: 'reab_2',
        name: '2. Consolidação Estrutural',
        duration: '2–4 meses',
        description: 'Reforço de fundações, paredes, pavimentos e cobertura. Tratamento de patologias.',
        tips: 'Contratar engenheiro de estruturas especializado em reabilitação.',
      },
      {
        id: 'reab_3',
        name: '3. Instalações Técnicas',
        duration: '2–3 meses',
        description: 'Novas redes técnicas compatíveis com o existente. Soluções à vista ou em rodapés técnicos.',
        tips: 'Minimizar abertura de roços em paredes de pedra/tijolo maciço.',
      },
      {
        id: 'reab_4',
        name: '4. Revestimentos e Restauro',
        duration: '2–4 meses',
        description: 'Restauro de elementos originais, novos revestimentos, carpintarias, serralharias.',
        tips: 'Preservar elementos com valor patrimonial. Usar materiais compatíveis.',
      },
      {
        id: 'reab_5',
        name: '5. Acabamentos e Entrega',
        duration: '1–2 meses',
        description: 'Pinturas, equipamentos, limpeza final, documentação.',
        tips: 'Registar intervenções para futuras manutenções.',
      },
    ],
  },
  {
    category: 'Comércio e Serviços',
    description: 'Lojas, escritórios, restaurantes, clínicas e espaços comerciais',
    totalDuration: '4–12 meses',
    phases: [
      {
        id: 'com_1',
        name: '1. Preparação do Espaço',
        duration: '2–4 semanas',
        description: 'Demolições interiores, preparação de infraestruturas, verificação de condições existentes.',
        tips: 'Confirmar capacidade elétrica e de AVAC do edifício.',
      },
      {
        id: 'com_2',
        name: '2. Instalações Técnicas',
        duration: '1–2 meses',
        description: 'Eletricidade, dados, AVAC, extração de fumos (restauração), água e esgotos.',
        tips: 'Prever potência para equipamentos específicos do negócio.',
      },
      {
        id: 'com_3',
        name: '3. Divisórias e Tetos',
        duration: '2–4 semanas',
        description: 'Paredes em gesso cartonado, tetos falsos, isolamentos acústicos.',
        tips: 'Usar sistemas certificados para proteção contra incêndio.',
      },
      {
        id: 'com_4',
        name: '4. Acabamentos',
        duration: '1–2 meses',
        description: 'Pavimentos, pinturas, carpintarias, mobiliário fixo, sinalética.',
        tips: 'Coordenar com fornecedores de mobiliário e equipamentos.',
      },
      {
        id: 'com_5',
        name: '5. Equipamentos e Abertura',
        duration: '2–4 semanas',
        description: 'Instalação de equipamentos, testes, licenciamento, abertura ao público.',
        tips: 'Agendar vistorias com antecedência. Preparar plano de emergência.',
      },
    ],
  },
  {
    category: 'Indústria',
    description: 'Naves industriais, armazéns e espaços logísticos',
    totalDuration: '8–18 meses',
    phases: [
      {
        id: 'ind_1',
        name: '1. Infraestruturas',
        duration: '1–2 meses',
        description: 'Preparação do terreno, redes enterradas, fundações.',
        tips: 'Dimensionar para cargas de equipamentos industriais.',
      },
      {
        id: 'ind_2',
        name: '2. Estrutura',
        duration: '2–4 meses',
        description: 'Estrutura metálica ou pré-fabricada, cobertura.',
        tips: 'Prever portões e acessos para veículos pesados.',
      },
      {
        id: 'ind_3',
        name: '3. Fechamentos e Pavimentos',
        duration: '1–2 meses',
        description: 'Painéis de fachada, pavimento industrial, cais de carga.',
        tips: 'Escolher pavimento adequado ao tipo de atividade (químicos, cargas, etc.).',
      },
      {
        id: 'ind_4',
        name: '4. Instalações Técnicas',
        duration: '2–3 meses',
        description: 'Eletricidade industrial, ar comprimido, AVAC, sprinklers.',
        tips: 'Prever expansão futura nas instalações.',
      },
      {
        id: 'ind_5',
        name: '5. Zonas Administrativas',
        duration: '1–2 meses',
        description: 'Escritórios, vestiários, refeitório, acabamentos.',
        tips: 'Separar zona limpa de zona industrial.',
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════
// CUSTOS ESTIMADOS DE CONSTRUÇÃO (€/m²)
// ═══════════════════════════════════════════════════════════════════

export interface ConstructionCost {
  typologyId: string;
  typologyName: string;
  category: string;
  minCost: number;    // €/m² - Acabamentos básicos
  medCost: number;    // €/m² - Acabamentos médios
  maxCost: number;    // €/m² - Acabamentos premium
  notes?: string;
}

export const CONSTRUCTION_COSTS: ConstructionCost[] = [
  // Habitação
  { typologyId: 'habitacao_unifamiliar', typologyName: 'Habitação unifamiliar', category: 'Habitação', minCost: 1200, medCost: 1600, maxCost: 2500, notes: 'Inclui arranjos exteriores básicos' },
  { typologyId: 'habitacao_coletiva', typologyName: 'Habitação coletiva', category: 'Habitação', minCost: 1000, medCost: 1400, maxCost: 2000, notes: 'Economia de escala em projetos maiores' },
  { typologyId: 'habitacao_apartamento', typologyName: 'Apartamento (remodelação)', category: 'Habitação', minCost: 800, medCost: 1200, maxCost: 1800, notes: 'Sem estrutura, apenas interiores' },
  { typologyId: 'habitacao_moradia', typologyName: 'Moradia', category: 'Habitação', minCost: 1300, medCost: 1700, maxCost: 2800, notes: 'Inclui garagem e exteriores' },
  
  // Reabilitação
  { typologyId: 'reabilitacao', typologyName: 'Reabilitação urbana', category: 'Reabilitação', minCost: 1000, medCost: 1500, maxCost: 2200, notes: 'Variável conforme estado do existente' },
  { typologyId: 'reabilitacao_integral', typologyName: 'Reabilitação integral', category: 'Reabilitação', minCost: 1200, medCost: 1800, maxCost: 2800, notes: 'Inclui reforço estrutural' },
  { typologyId: 'restauro', typologyName: 'Restauro / conservação', category: 'Reabilitação', minCost: 1500, medCost: 2200, maxCost: 3500, notes: 'Técnicas especializadas, materiais tradicionais' },
  
  // Comércio e Serviços
  { typologyId: 'comercio', typologyName: 'Comércio / loja', category: 'Comércio e Serviços', minCost: 600, medCost: 1000, maxCost: 1800, notes: 'Fit-out interior' },
  { typologyId: 'escritorio', typologyName: 'Escritório', category: 'Comércio e Serviços', minCost: 500, medCost: 900, maxCost: 1500, notes: 'Open-space ou gabinetes' },
  { typologyId: 'restaurante', typologyName: 'Restaurante / bar', category: 'Comércio e Serviços', minCost: 1000, medCost: 1600, maxCost: 2500, notes: 'Inclui cozinha industrial' },
  { typologyId: 'hotel', typologyName: 'Hotel / hotelaria', category: 'Comércio e Serviços', minCost: 1200, medCost: 1800, maxCost: 3000, notes: 'Por quarto: 80.000€–150.000€' },
  { typologyId: 'clinica', typologyName: 'Clínica / consultório', category: 'Comércio e Serviços', minCost: 800, medCost: 1300, maxCost: 2000, notes: 'Requisitos técnicos específicos' },
  { typologyId: 'armazem_comercial', typologyName: 'Armazém comercial', category: 'Comércio e Serviços', minCost: 400, medCost: 600, maxCost: 900, notes: 'Construção simples' },
  
  // Indústria
  { typologyId: 'industria', typologyName: 'Indústria', category: 'Indústria', minCost: 500, medCost: 800, maxCost: 1400, notes: 'Sem equipamentos de produção' },
  { typologyId: 'logistica', typologyName: 'Logística / armazém', category: 'Indústria', minCost: 350, medCost: 550, maxCost: 800, notes: 'Nave + escritórios básicos' },
  { typologyId: 'laboratorio', typologyName: 'Laboratório', category: 'Indústria', minCost: 1500, medCost: 2200, maxCost: 3500, notes: 'Requisitos técnicos elevados' },
  
  // Equipamentos
  { typologyId: 'equip_educacao', typologyName: 'Educação', category: 'Equipamentos', minCost: 1200, medCost: 1600, maxCost: 2200, notes: 'Escolas, universidades' },
  { typologyId: 'equip_saude', typologyName: 'Saúde', category: 'Equipamentos', minCost: 2000, medCost: 3000, maxCost: 4500, notes: 'Hospitais, centros de saúde' },
  { typologyId: 'equip_cultura', typologyName: 'Cultura', category: 'Equipamentos', minCost: 1500, medCost: 2200, maxCost: 3500, notes: 'Museus, bibliotecas, teatros' },
  { typologyId: 'equip_desporto', typologyName: 'Desporto', category: 'Equipamentos', minCost: 800, medCost: 1200, maxCost: 2000, notes: 'Pavilhões, ginásios' },
];

// ═══════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Obter fases de construção para uma categoria
 */
export function getPhasesByCategory(category: string): CategoryPhases | undefined {
  // Mapear categorias específicas para categorias genéricas
  const categoryMap: Record<string, string> = {
    'Habitação': 'Habitação',
    'Reabilitação': 'Reabilitação',
    'Comércio e Serviços': 'Comércio e Serviços',
    'Indústria': 'Indústria',
    'Equipamentos': 'Comércio e Serviços', // Equipamentos usam fases similares a comércio
  };
  
  const mappedCategory = categoryMap[category] || category;
  return CONSTRUCTION_PHASES.find((p) => p.category === mappedCategory);
}

/**
 * Obter custos estimados para uma tipologia
 */
export function getCostsByTypology(typologyId: string): ConstructionCost | undefined {
  return CONSTRUCTION_COSTS.find((c) => c.typologyId === typologyId);
}

/**
 * Calcular estimativa de custo total
 */
export function calculateConstructionEstimate(typologyId: string, area: number): {
  min: number;
  med: number;
  max: number;
} | null {
  const costs = getCostsByTypology(typologyId);
  if (!costs || area <= 0) return null;
  
  return {
    min: Math.round(costs.minCost * area),
    med: Math.round(costs.medCost * area),
    max: Math.round(costs.maxCost * area),
  };
}
