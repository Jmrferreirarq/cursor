// Directório de Municípios — PDMs, Geoportais e Regulamentos Municipais
// FA-360 Platform — v1.0

export interface DocumentoMunicipal {
  nome: string;              // Nome legível do documento
  sigla?: string;            // Sigla curta (PDM, RUMA, RIPMA, etc.)
  descricao?: string;        // Descrição breve
  ficheiro?: string;         // Nome do ficheiro na pasta de rede (referência)
  linkOnline?: string;       // Link online (DRE, câmara, etc.)
  tipo: 'pdm' | 'regulamento' | 'planta' | 'nomenclatura' | 'outro';
}

export interface TopicoRegulamentar {
  categoria: string;         // Ex: 'Índices Urbanísticos', 'Estacionamento', etc.
  icon: string;              // Lucide icon name
  itens: string[];           // Bullet points dos requisitos a cumprir
}

export interface Municipio {
  id: string;
  nome: string;
  distrito: string;
  linkPDM?: string;          // Link directo para o PDM (SNIT ou câmara)
  linkGeoportal?: string;    // Geoportal / SIG municipal
  linkCamara?: string;       // Site da câmara municipal
  linkEurbanismo?: string;   // Plataforma e-urbanismo
  linkRMUE?: string;         // Regulamento Municipal de Urbanização e Edificação
  linkAL?: string;           // Regulamento de Alojamento Local
  notas?: string;            // Notas internas do atelier
  frequente?: boolean;       // Município onde o atelier trabalha frequentemente
  documentos?: DocumentoMunicipal[]; // Documentos locais do atelier
  topicos?: TopicoRegulamentar[];    // Resumo regulamentar estruturado
}

export interface DistritoInfo {
  id: string;
  nome: string;
}

export const DISTRITOS: DistritoInfo[] = [
  { id: 'aveiro', nome: 'Aveiro' },
  { id: 'coimbra', nome: 'Coimbra' },
  { id: 'viseu', nome: 'Viseu' },
  { id: 'porto', nome: 'Porto' },
  { id: 'lisboa', nome: 'Lisboa' },
  { id: 'leiria', nome: 'Leiria' },
  { id: 'braga', nome: 'Braga' },
  { id: 'guarda', nome: 'Guarda' },
  { id: 'outros', nome: 'Outros' },
];

export const municipios: Municipio[] = [
  // ═══════════════════════════════════════════════════════════════
  // DISTRITO DE AVEIRO (zona principal de actuação)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'aveiro',
    nome: 'Aveiro',
    distrito: 'aveiro',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkGeoportal: 'https://sig.cm-aveiro.pt/portal/',
    linkCamara: 'https://www.cm-aveiro.pt/',
    linkEurbanismo: 'https://www.cm-aveiro.pt/municipio/urbanismo',
    linkRMUE: 'https://www.cm-aveiro.pt/municipio/urbanismo/regulamentos',
    notas: 'Sede do atelier. PDM em revisão (1.ª revisão publicada). Consultar sempre o geoportal para condicionantes actualizadas. RUMA e RIPMA são documentos-chave para instrução de processos.',
    frequente: true,
    topicos: [
      {
        categoria: 'Parâmetros Urbanísticos (PDM)',
        icon: 'Ruler',
        itens: [
          'Consultar classificação e qualificação do solo no geoportal (Solo Urbano / Rústico)',
          'Verificar categoria de espaço: Espaços Centrais, Espaços Residenciais, Espaços de Actividades Económicas, etc.',
          'Índice de utilização bruto máximo — varia por categoria (ex: Espaços Centrais até 1,5)',
          'Índice de impermeabilização máximo (geralmente 70-80% em solo urbano)',
          'Cércea máxima — verificar o n.º de pisos permitido por zona (2 a 5 pisos conforme o local)',
          'Afastamentos mínimos: frente (alinhamento dominante), lateral (≥ 3m se não encostado), posterior (≥ 6m)',
          'Verificar se existe Plano de Urbanização (PU) ou Plano de Pormenor (PP) que prevaleça sobre o PDM',
        ],
      },
      {
        categoria: 'Estacionamento (RUMA)',
        icon: 'Car',
        itens: [
          'Habitação unifamiliar: mín. 1 lugar/fogo (interior ao lote)',
          'Habitação colectiva: 1 lugar/fogo + 1 lugar visitantes por cada 5 fogos',
          'Comércio/Serviços: 1 lugar / 25-50m² de área bruta (conforme zona)',
          'Dimensões mín. do lugar: 2,50m × 5,00m (perpendicular) ou 2,30m × 5,50m (paralelo)',
          'Lugares para pessoas com mobilidade reduzida: conforme DL 163/2006 (mín. 1 por cada 25 lugares)',
          'Verificar se a câmara aceita compensação (TMU) em vez de estacionamento em certas zonas centrais',
        ],
      },
      {
        categoria: 'Cedências e Infraestruturas (RUMA/RIPMA)',
        icon: 'TreePine',
        itens: [
          'Operações de loteamento: cedências para espaços verdes, equipamentos e arruamentos',
          'Área verde de cedência: conforme regulamento municipal (verificar m²/fogo ou %)',
          'Infraestruturas de arruamentos: perfil transversal mín. (faixa de rodagem + passeios ≥ 1,50m)',
          'Rede de abastecimento de água, saneamento e águas pluviais — projecto de especialidade obrigatório',
          'Rede eléctrica e telecomunicações — em canalização subterrânea',
          'Iluminação pública — conforme RIPMA (tipo de luminárias, espaçamento, eficiência energética)',
          'Paisagismo: RIPMA define exigências de arborização e mobiliário urbano em operações de loteamento',
        ],
      },
      {
        categoria: 'Acessibilidades e Espaço Público',
        icon: 'Accessibility',
        itens: [
          'Passeios mín. 1,50m livre de obstáculos (DL 163/2006 + RIPMA)',
          'Rampas de acesso: inclinação máx. 6% (8% até 5m de extensão)',
          'Passadeiras rebaixadas em todos os cruzamentos',
          'Ocupação do espaço público: regulamento próprio (esplanadas, publicidade, obras — consultar ROEP)',
        ],
      },
      {
        categoria: 'Instrução de Processos',
        icon: 'FileCheck',
        itens: [
          'Consultar elementos instrutórios exigidos pela CM Aveiro (Portaria 113/2015 + requisitos locais)',
          'Submissão por via electrónica no portal e-Urbanismo da CM Aveiro',
          'Termos de responsabilidade de todos os técnicos subscritores',
          'Memória descritiva com enquadramento no PDM e RUMA',
          'Ficha de Segurança contra Incêndios (SCIE) — obrigatória conforme utilização-tipo',
          'Projecto de térmica (SCE) — obrigatório para edificações novas e grandes reabilitações',
        ],
      },
      {
        categoria: 'Taxas e Compensações (TMU)',
        icon: 'Receipt',
        itens: [
          'Taxa Municipal de Urbanização (TMU) — cálculo conforme regulamento de taxas do município',
          'TMU varia por tipo de operação: construção nova, ampliação, loteamento, alteração de uso',
          'Compensação por não cumprimento de estacionamento (quando admissível)',
          'Taxa de ocupação do espaço público (estaleiro de obra, tapumes, etc.)',
        ],
      },
      {
        categoria: 'Condicionantes e Servidões',
        icon: 'AlertTriangle',
        itens: [
          'REN — Reserva Ecológica Nacional: consultar planta de condicionantes no SNIT/geoportal',
          'RAN — Reserva Agrícola Nacional: terrenos classificados não permitem edificação',
          'Domínio hídrico — faixas de protecção a cursos de água (margem 10m, zona inundável)',
          'Ria de Aveiro — condicionantes específicas do POOC e zona de protecção',
          'Servidões rodoviárias — faixas non aedificandi junto a estradas nacionais (EN 109, etc.)',
          'Servidões de alta tensão — afastamentos a linhas e postes eléctricos',
          'Património classificado — verificar zona de protecção de imóveis classificados',
        ],
      },
    ],
    documentos: [
      {
        nome: 'PDM — Regulamento (versão original)',
        sigla: 'PDM',
        descricao: 'Regulamento do Plano Director Municipal de Aveiro — versão base.',
        ficheiro: 'AVEIRO _ PDM REGULAMENTO.pdf',
        tipo: 'pdm',
      },
      {
        nome: 'PDM — Regulamento (1.ª revisão)',
        sigla: 'PDM Rev.1',
        descricao: 'Regulamento do PDM de Aveiro após a 1.ª revisão. Versão a usar como referência actual.',
        ficheiro: 'AVEIRO _ PDM REGULAMENTO 1ª revisão.pdf',
        tipo: 'pdm',
      },
      {
        nome: 'PDM — Planta de Ordenamento',
        sigla: 'Ordenamento',
        descricao: 'Planta de Ordenamento do PDM. Define classes e categorias de uso do solo.',
        ficheiro: 'AVEIRO_PDM ORDENAMENTO.pdf',
        tipo: 'planta',
      },
      {
        nome: 'RUMA — Regulamento de Urbanização e Mobilidade de Aveiro',
        sigla: 'RUMA',
        descricao: 'Regulamento municipal que define regras de urbanização, edificação e mobilidade. Documento essencial para instrução de processos.',
        ficheiro: 'AVEIRO_RUMA.pdf',
        tipo: 'regulamento',
      },
      {
        nome: 'RIPMA — Regulamento de Infraestruturas, Paisagem, Mobilidade e Acessibilidades',
        sigla: 'RIPMA',
        descricao: 'Regulamento publicado no DRE em 2020. Define exigências de infraestruturas, paisagismo, mobilidade e acessibilidades para operações urbanísticas.',
        ficheiro: 'AVEIRO_RIPMA_DRE2020.pdf',
        tipo: 'regulamento',
      },
      {
        nome: 'Regulamento de Ocupação do Espaço Público',
        sigla: 'ROEP',
        descricao: 'Regras para ocupação do espaço público: esplanadas, publicidade, obras na via pública, etc.',
        ficheiro: 'AVEIRO _ OCUPAÇÃO DE ESPAÇO PÚBLICO.pdf',
        tipo: 'regulamento',
      },
      {
        nome: 'Nomenclatura de Ruas',
        sigla: 'Nomenclatura',
        descricao: 'Tabela de nomenclatura / toponímia oficial das ruas do concelho de Aveiro.',
        ficheiro: 'AVEIRO_NOMENCLATURA.xlsx',
        tipo: 'nomenclatura',
      },
    ],
  },
  {
    id: 'ilhavo',
    nome: 'Ílhavo',
    distrito: 'aveiro',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkGeoportal: 'https://sig.cm-ilhavo.pt/',
    linkCamara: 'https://www.cm-ilhavo.pt/',
    linkEurbanismo: 'https://www.cm-ilhavo.pt/pages/1003',
    linkRMUE: 'https://www.cm-ilhavo.pt/pages/1003',
    notas: 'RMUE disponível no site da câmara. Regulamento de ocupação do espaço público específico. PDM e RMUE em ficheiro local.',
    frequente: true,
    topicos: [
      {
        categoria: 'Parâmetros Urbanísticos (PDM)',
        icon: 'Ruler',
        itens: [
          'Verificar classificação do solo no SNIT: Solo Urbano (Espaços Centrais, Residenciais, Actividades Económicas) / Solo Rústico',
          'Índice de utilização bruto máximo — varia por categoria de espaço',
          'Cércea máxima — geralmente 2 pisos em zonas residenciais, até 4 em centrais',
          'Índice de impermeabilização máximo',
          'Afastamentos: frontal (alinhamento dominante), lateral (≥ 3m), posterior (≥ 6m)',
          'Verificar existência de PU ou PP aplicável ao local',
        ],
      },
      {
        categoria: 'Estacionamento (RMUE)',
        icon: 'Car',
        itens: [
          'Habitação unifamiliar: mín. 1 lugar/fogo',
          'Habitação colectiva: 1 lugar/fogo + visitantes (verificar RMUE)',
          'Comércio/Serviços: conforme área bruta de construção (consultar tabela RMUE)',
          'Dimensões mín.: 2,50m × 5,00m (perpendicular)',
          'Lugares PMR: conforme DL 163/2006',
        ],
      },
      {
        categoria: 'Cedências e Infraestruturas',
        icon: 'TreePine',
        itens: [
          'Operações de loteamento: cedências para espaços verdes e equipamentos conforme RMUE',
          'Arruamentos: perfil transversal com passeios ≥ 1,50m',
          'Rede de saneamento, água e pluviais — projecto de especialidade',
          'Rede eléctrica e telecomunicações subterrânea',
        ],
      },
      {
        categoria: 'Espaço Público e Ocupação',
        icon: 'Accessibility',
        itens: [
          'Regulamento de ocupação do espaço público específico do município de Ílhavo',
          'Passeios mín. 1,50m livres de obstáculos',
          'Esplanadas, publicidade e obras — consultar regulamento próprio',
        ],
      },
      {
        categoria: 'Instrução de Processos',
        icon: 'FileCheck',
        itens: [
          'Submissão via portal e-Urbanismo da CM Ílhavo',
          'Elementos instrutórios conforme Portaria 113/2015 + exigências locais (RMUE)',
          'Termos de responsabilidade de todos os técnicos',
          'Ficha SCIE e projecto SCE obrigatórios',
        ],
      },
      {
        categoria: 'Condicionantes e Servidões',
        icon: 'AlertTriangle',
        itens: [
          'REN / RAN — consultar planta de condicionantes',
          'Proximidade à Ria de Aveiro — condicionantes do POOC / zona de protecção',
          'Costa marítima (Barra, Costa Nova) — domínio público marítimo e faixa de protecção',
          'Servidões rodoviárias (EN 109, etc.)',
          'Património classificado — Farol da Barra, vista de mar, centros históricos',
        ],
      },
    ],
    documentos: [
      {
        nome: 'PDM de Ílhavo — Regulamento',
        sigla: 'PDM',
        descricao: 'Regulamento do Plano Director Municipal de Ílhavo.',
        ficheiro: 'REG_PDM_Ilhavo.pdf',
        tipo: 'pdm',
      },
      {
        nome: 'RMUE — Regulamento Municipal de Urbanização e Edificação de Ílhavo',
        sigla: 'RMUE',
        descricao: 'Regulamento que define as regras de urbanização e edificação no concelho de Ílhavo.',
        ficheiro: 'Regulamento_Municipal_da_Urbaniza__o_e_da_Edifica__o_de__lhavo.pdf',
        tipo: 'regulamento',
      },
    ],
  },
  {
    id: 'vagos',
    nome: 'Vagos',
    distrito: 'aveiro',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkGeoportal: 'https://www.cm-vagos.pt/pages/589',
    linkCamara: 'https://www.cm-vagos.pt/',
    linkEurbanismo: 'https://www.cm-vagos.pt/pages/589',
    notas: 'Normas de instrução próprias para operações urbanísticas (2.ª alteração). Consultar documento específico.',
    frequente: true,
    topicos: [
      {
        categoria: 'Parâmetros Urbanísticos (PDM)',
        icon: 'Ruler',
        itens: [
          'Consultar planta de ordenamento no SNIT — classificação e qualificação do solo',
          'Índices de utilização e impermeabilização conforme categoria de espaço',
          'Cércea máxima e n.º de pisos por zona',
          'Afastamentos laterais e posteriores conforme regulamento do PDM',
        ],
      },
      {
        categoria: 'Instrução de Processos',
        icon: 'FileCheck',
        itens: [
          'Normas de instrução próprias do município (2.ª alteração) — documento específico obrigatório',
          'Elementos instrutórios adicionais aos da Portaria 113/2015',
          'Consultar câmara para formatos e procedimentos de submissão',
        ],
      },
      {
        categoria: 'Condicionantes',
        icon: 'AlertTriangle',
        itens: [
          'REN / RAN — consultar planta de condicionantes',
          'Zona costeira — condicionantes do POOC (praias de Vagos)',
          'Domínio hídrico (Ria de Aveiro na zona norte do concelho)',
        ],
      },
    ],
  },
  {
    id: 'ovar',
    nome: 'Ovar',
    distrito: 'aveiro',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkGeoportal: 'https://sig.cm-ovar.pt/',
    linkCamara: 'https://www.cm-ovar.pt/',
    linkEurbanismo: 'https://www.cm-ovar.pt/pt/menu/483/urbanismo.aspx',
    frequente: true,
    topicos: [
      {
        categoria: 'Parâmetros Urbanísticos (PDM)',
        icon: 'Ruler',
        itens: [
          'Consultar classificação do solo no geoportal — Espaços Urbanos, Urbanizáveis, Industriais, etc.',
          'Índices de utilização e impermeabilização por categoria de espaço',
          'Cércea máxima e afastamentos (consultar regulamento do PDM)',
          'Verificar se existe PU ou PP para a zona',
        ],
      },
      {
        categoria: 'Estacionamento',
        icon: 'Car',
        itens: [
          'Conforme regulamento municipal e RGEU',
          'Habitação: mín. 1 lugar/fogo',
          'Comércio: conforme área bruta de construção',
        ],
      },
      {
        categoria: 'Condicionantes',
        icon: 'AlertTriangle',
        itens: [
          'REN / RAN — consultar planta de condicionantes no SNIT',
          'Zona costeira — POOC (praias de Ovar/Furadouro)',
          'Ria de Aveiro — faixa de protecção e domínio hídrico',
          'Servidões rodoviárias (A1, A29, EN1)',
        ],
      },
    ],
  },
  {
    id: 'agueda',
    nome: 'Águeda',
    distrito: 'aveiro',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkGeoportal: 'https://www.cm-agueda.pt/pages/693',
    linkCamara: 'https://www.cm-agueda.pt/',
    linkEurbanismo: 'https://www.cm-agueda.pt/pages/693',
    frequente: true,
    topicos: [
      {
        categoria: 'Parâmetros Urbanísticos (PDM)',
        icon: 'Ruler',
        itens: [
          'Consultar classificação e qualificação do solo no geoportal',
          'Índices de utilização, impermeabilização e cércea máxima por zona',
          'Afastamentos mínimos conforme regulamento do PDM',
        ],
      },
      {
        categoria: 'Condicionantes',
        icon: 'AlertTriangle',
        itens: [
          'REN / RAN — consultar planta de condicionantes',
          'Zona de cheias do Rio Águeda — verificar cotas de implantação',
          'Servidões rodoviárias (A1, EN1, IC2)',
        ],
      },
    ],
  },
  {
    id: 'estarreja',
    nome: 'Estarreja',
    distrito: 'aveiro',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkCamara: 'https://www.cm-estarreja.pt/',
    linkEurbanismo: 'https://www.cm-estarreja.pt/urbanismo',
    frequente: true,
    topicos: [
      {
        categoria: 'Parâmetros Urbanísticos (PDM)',
        icon: 'Ruler',
        itens: [
          'Consultar classificação do solo e parâmetros no SNIT',
          'Índices de utilização e impermeabilização por categoria',
          'Cércea máxima e afastamentos conforme regulamento PDM',
        ],
      },
      {
        categoria: 'Condicionantes',
        icon: 'AlertTriangle',
        itens: [
          'REN / RAN — consultar planta de condicionantes',
          'Complexo químico de Estarreja — zona de protecção industrial',
          'BioRia / zona húmida — condicionantes ambientais',
          'Ria de Aveiro — domínio hídrico',
        ],
      },
    ],
  },
  {
    id: 'murtosa',
    nome: 'Murtosa',
    distrito: 'aveiro',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkCamara: 'https://www.cm-murtosa.pt/',
    frequente: false,
  },
  {
    id: 'albergaria-a-velha',
    nome: 'Albergaria-a-Velha',
    distrito: 'aveiro',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkCamara: 'https://www.cm-albergaria.pt/',
    linkEurbanismo: 'https://www.cm-albergaria.pt/urbanismo',
    frequente: false,
  },
  {
    id: 'oliveira-do-bairro',
    nome: 'Oliveira do Bairro',
    distrito: 'aveiro',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkCamara: 'https://www.cm-olb.pt/',
    frequente: false,
  },
  {
    id: 'anadia',
    nome: 'Anadia',
    distrito: 'aveiro',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkCamara: 'https://www.cm-anadia.pt/',
    frequente: false,
  },
  {
    id: 'sever-do-vouga',
    nome: 'Sever do Vouga',
    distrito: 'aveiro',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkCamara: 'https://www.cm-sever.pt/',
    notas: 'PDM e regulamento urbanístico em ficheiro local.',
    frequente: false,
    topicos: [
      {
        categoria: 'Parâmetros Urbanísticos (PDM)',
        icon: 'Ruler',
        itens: [
          'Consultar classificação do solo e parâmetros no PDM',
          'Índices e cércea máxima conforme regulamento',
          'Afastamentos mínimos conforme PDM/RU',
        ],
      },
      {
        categoria: 'Condicionantes',
        icon: 'AlertTriangle',
        itens: [
          'REN / RAN — consultar planta de condicionantes',
          'Rio Vouga e afluentes — domínio hídrico e faixas de protecção',
          'Zona serrana — condicionantes paisagísticas',
        ],
      },
    ],
    documentos: [
      {
        nome: 'PDM de Sever do Vouga — Regulamento',
        sigla: 'PDM',
        descricao: 'Regulamento do Plano Director Municipal de Sever do Vouga.',
        ficheiro: 'PDM_de_Sever_do_Vouga.pdf',
        tipo: 'pdm',
      },
      {
        nome: 'Regulamento Urbanístico de Sever do Vouga',
        sigla: 'RU',
        descricao: 'Regulamento urbanístico do município — regras de edificação e urbanização.',
        ficheiro: 'Urbanistico_do_Municipio_de_Sever_do_Vouga.pdf',
        tipo: 'regulamento',
      },
    ],
  },
  {
    id: 'oliveira-de-azemeis',
    nome: 'Oliveira de Azeméis',
    distrito: 'aveiro',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkGeoportal: 'https://www.cm-oaz.pt/urbanismo.26/geoportal_plano_diretor_municipal.60.html',
    linkCamara: 'https://www.cm-oaz.pt/',
    linkEurbanismo: 'https://www.cm-oaz.pt/urbanismo.26.html',
    notas: 'PDM e regulamento urbanístico em ficheiro local. Consultar geoportal para parâmetros urbanísticos.',
    frequente: true,
    topicos: [
      {
        categoria: 'Parâmetros Urbanísticos (PDM)',
        icon: 'Ruler',
        itens: [
          'Consultar geoportal para classificação do solo e parâmetros urbanísticos',
          'Índice de utilização, impermeabilização e cércea por categoria de espaço',
          'Afastamentos mínimos: frontal, lateral (≥ 3m) e posterior (≥ 6m)',
          'Verificar existência de PU ou PP para a zona',
        ],
      },
      {
        categoria: 'Estacionamento (RU)',
        icon: 'Car',
        itens: [
          'Habitação unifamiliar: mín. 1 lugar/fogo',
          'Habitação colectiva: conforme regulamento urbanístico municipal',
          'Comércio/Serviços: conforme área bruta (consultar tabela do RU)',
        ],
      },
      {
        categoria: 'Instrução de Processos',
        icon: 'FileCheck',
        itens: [
          'Elementos conforme Portaria 113/2015 + exigências locais do RU',
          'Submissão via portal de urbanismo da câmara',
          'Enquadramento obrigatório no PDM na memória descritiva',
        ],
      },
      {
        categoria: 'Condicionantes',
        icon: 'AlertTriangle',
        itens: [
          'REN / RAN — consultar planta de condicionantes',
          'Zona industrial — verificar compatibilidade de usos',
          'Servidões rodoviárias (A32, EN224, etc.)',
        ],
      },
    ],
    documentos: [
      {
        nome: 'PDM de Oliveira de Azeméis — Regulamento',
        sigla: 'PDM',
        descricao: 'Regulamento do Plano Director Municipal de Oliveira de Azeméis.',
        ficheiro: 'PDM_OlAzemeis.pdf',
        tipo: 'pdm',
      },
      {
        nome: 'Regulamento Urbanístico de Oliveira de Azeméis',
        sigla: 'RU',
        descricao: 'Regulamento urbanístico do município — regras de edificação e urbanização.',
        ficheiro: 'Regulamento Urbanistico_OlAzemeis.pdf',
        tipo: 'regulamento',
      },
    ],
  },
  {
    id: 'santa-maria-da-feira',
    nome: 'Santa Maria da Feira',
    distrito: 'aveiro',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkCamara: 'https://www.cm-feira.pt/',
    linkEurbanismo: 'https://www.cm-feira.pt/urbanismo',
    frequente: false,
  },
  {
    id: 'sao-joao-da-madeira',
    nome: 'São João da Madeira',
    distrito: 'aveiro',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkCamara: 'https://www.cm-sjm.pt/',
    frequente: false,
  },
  {
    id: 'vale-de-cambra',
    nome: 'Vale de Cambra',
    distrito: 'aveiro',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkCamara: 'https://www.cm-valedecambra.pt/',
    frequente: false,
  },
  {
    id: 'arouca',
    nome: 'Arouca',
    distrito: 'aveiro',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkCamara: 'https://www.cm-arouca.pt/',
    frequente: false,
  },
  {
    id: 'castelo-de-paiva',
    nome: 'Castelo de Paiva',
    distrito: 'aveiro',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkCamara: 'https://www.cm-castelo-paiva.pt/',
    frequente: false,
  },
  {
    id: 'espinho',
    nome: 'Espinho',
    distrito: 'aveiro',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkCamara: 'https://portal.cm-espinho.pt/',
    frequente: false,
  },

  // ═══════════════════════════════════════════════════════════════
  // DISTRITO DE COIMBRA
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'coimbra',
    nome: 'Coimbra',
    distrito: 'coimbra',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkGeoportal: 'https://geocoimbra.cm-coimbra.pt/',
    linkCamara: 'https://www.cm-coimbra.pt/',
    linkEurbanismo: 'https://www.cm-coimbra.pt/areas/urbanismo',
    frequente: false,
  },
  {
    id: 'cantanhede',
    nome: 'Cantanhede',
    distrito: 'coimbra',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkCamara: 'https://www.cm-cantanhede.pt/',
    linkAL: 'https://www.cm-cantanhede.pt/mcsite/Content/Default/Alojamento_Local',
    notas: 'Regulamento de Alojamento Local próprio. Consultar site da câmara.',
    frequente: true,
    topicos: [
      {
        categoria: 'Parâmetros Urbanísticos (PDM)',
        icon: 'Ruler',
        itens: [
          'Consultar classificação do solo no SNIT',
          'Índices e cércea conforme regulamento do PDM',
          'Afastamentos conforme PDM',
        ],
      },
      {
        categoria: 'Alojamento Local',
        icon: 'Hotel',
        itens: [
          'Regulamento de Alojamento Local próprio — consultar site da câmara',
          'Zonas de contenção e condições de instalação específicas',
          'Verificar compatibilidade de uso do solo com AL',
        ],
      },
      {
        categoria: 'Condicionantes',
        icon: 'AlertTriangle',
        itens: [
          'REN / RAN — consultar planta de condicionantes',
          'Servidões rodoviárias',
        ],
      },
    ],
  },
  {
    id: 'mealhada',
    nome: 'Mealhada',
    distrito: 'coimbra',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkCamara: 'https://www.cm-mealhada.pt/',
    frequente: false,
  },
  {
    id: 'figueira-da-foz',
    nome: 'Figueira da Foz',
    distrito: 'coimbra',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkCamara: 'https://www.cm-figfoz.pt/',
    frequente: false,
  },

  // ═══════════════════════════════════════════════════════════════
  // DISTRITO DE VISEU
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'viseu',
    nome: 'Viseu',
    distrito: 'viseu',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkGeoportal: 'https://sig.cm-viseu.pt/',
    linkCamara: 'https://www.cm-viseu.pt/',
    frequente: false,
  },

  // ═══════════════════════════════════════════════════════════════
  // DISTRITO DO PORTO
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'porto',
    nome: 'Porto',
    distrito: 'porto',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkGeoportal: 'https://sigweb.cm-porto.pt/maporto/',
    linkCamara: 'https://www.cm-porto.pt/',
    linkEurbanismo: 'https://balcaovirtual.cm-porto.pt/',
    frequente: false,
  },
  {
    id: 'vila-nova-de-gaia',
    nome: 'Vila Nova de Gaia',
    distrito: 'porto',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkGeoportal: 'https://sig.cm-gaia.pt/',
    linkCamara: 'https://www.cm-gaia.pt/',
    linkEurbanismo: 'https://www.cm-gaia.pt/pt/cidade/urbanismo/',
    notas: 'PDM e RMUE em ficheiro local. Município com grande volume de projectos.',
    frequente: true,
    topicos: [
      {
        categoria: 'Parâmetros Urbanísticos (PDM)',
        icon: 'Ruler',
        itens: [
          'Consultar geoportal SIG Gaia — classificação do solo e parâmetros por categoria de espaço',
          'PDM com múltiplas categorias: Espaços Centrais, Residenciais, Urbanização Programada, Actividades Económicas',
          'Índice de utilização bruto, cércea máxima e impermeabilização por zona',
          'Afastamentos: alinhamento dominante (frente), ≥ 3m (lateral), ≥ 6m (posterior)',
          'Verificar existência de PU ou PP (vários PP em Gaia: Afurada, Canidelo, etc.)',
        ],
      },
      {
        categoria: 'Estacionamento (RMUE)',
        icon: 'Car',
        itens: [
          'Habitação unifamiliar: mín. 1 lugar/fogo (interior ao lote)',
          'Habitação colectiva: 1 lugar/fogo + visitantes conforme RMUE',
          'Comércio/Serviços: 1 lugar por cada 25-50m² de ABC (varia por zona)',
          'Dimensões mín. e lugares PMR conforme DL 163/2006',
          'Gaia tem exigências elevadas de estacionamento em zonas periféricas',
        ],
      },
      {
        categoria: 'Cedências e Infraestruturas',
        icon: 'TreePine',
        itens: [
          'Loteamentos: cedências para espaços verdes, equipamentos e arruamentos conforme RMUE',
          'Perfis de arruamento definidos no RMUE — passeios ≥ 1,50m',
          'Infraestruturas: redes de água, saneamento, pluviais, electricidade e telecom subterrâneas',
        ],
      },
      {
        categoria: 'Instrução de Processos',
        icon: 'FileCheck',
        itens: [
          'Submissão via plataforma de urbanismo da CM Gaia',
          'Elementos instrutórios conforme Portaria 113/2015 + exigências do RMUE',
          'Enquadramento no PDM obrigatório na memória descritiva',
          'Termos de responsabilidade e especialidades (SCIE, SCE, acústica, etc.)',
        ],
      },
      {
        categoria: 'Condicionantes e Servidões',
        icon: 'AlertTriangle',
        itens: [
          'REN / RAN — consultar planta de condicionantes no SNIT',
          'Rio Douro — domínio hídrico e faixa de protecção',
          'Costa marítima — POOC e domínio público marítimo',
          'Servidões rodoviárias (A1, A20, A44, EN1, EN222)',
          'Metro de superfície — faixa de protecção às linhas',
          'Património classificado — Mosteiro da Serra do Pilar, centros históricos',
          'Área de Paisagem Protegida — Reserva Natural Local do Estuário do Douro',
        ],
      },
      {
        categoria: 'Taxas (TMU)',
        icon: 'Receipt',
        itens: [
          'TMU conforme regulamento de taxas do município de Gaia',
          'Valores variam significativamente por zona e tipo de operação',
          'Compensação de estacionamento quando admissível em zonas centrais',
        ],
      },
    ],
    documentos: [
      {
        nome: 'PDM de Vila Nova de Gaia — Regulamento',
        sigla: 'PDM',
        descricao: 'Regulamento do Plano Director Municipal de Vila Nova de Gaia.',
        ficheiro: 'PDM_VNGaia.pdf',
        tipo: 'pdm',
      },
      {
        nome: 'RMUE — Regulamento Municipal de Urbanização e Edificação de V.N. Gaia',
        sigla: 'RMUE',
        descricao: 'Regulamento que define as regras de urbanização e edificação no concelho de Vila Nova de Gaia.',
        ficheiro: 'rmue.VNGaia.pdf',
        tipo: 'regulamento',
      },
    ],
  },
  {
    id: 'matosinhos',
    nome: 'Matosinhos',
    distrito: 'porto',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkCamara: 'https://www.cm-matosinhos.pt/',
    frequente: false,
  },

  // ═══════════════════════════════════════════════════════════════
  // DISTRITO DA GUARDA
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'seia',
    nome: 'Seia',
    distrito: 'guarda',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkCamara: 'https://www.cm-seia.pt/',
    linkAL: 'https://www.cm-seia.pt/alojamento-local/',
    notas: 'Regulamento de Alojamento Local próprio. Serra da Estrela — condicionantes de parque natural.',
    frequente: true,
    topicos: [
      {
        categoria: 'Parâmetros Urbanísticos (PDM)',
        icon: 'Ruler',
        itens: [
          'Consultar classificação do solo no SNIT',
          'Índices e cércea conforme regulamento do PDM de Seia',
          'Zona de montanha — especificidades de edificação',
        ],
      },
      {
        categoria: 'Alojamento Local / Turismo',
        icon: 'Hotel',
        itens: [
          'Regulamento de Alojamento Local próprio — consultar site da câmara',
          'Serra da Estrela — forte procura turística, verificar condições especiais',
          'Turismo rural e de natureza — regulamentação específica',
        ],
      },
      {
        categoria: 'Condicionantes',
        icon: 'AlertTriangle',
        itens: [
          'Parque Natural da Serra da Estrela — condicionantes ambientais e paisagísticas severas',
          'ICNF — parecer obrigatório para operações dentro do parque natural',
          'REN / RAN — consultar planta de condicionantes',
          'Risco de incêndio — faixas de gestão de combustível (DL 82/2021)',
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // DISTRITO DE LISBOA
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'lisboa',
    nome: 'Lisboa',
    distrito: 'lisboa',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkGeoportal: 'https://geodados.cm-lisboa.pt/',
    linkCamara: 'https://www.lisboa.pt/',
    linkEurbanismo: 'https://informacoeseservicos.lisboa.pt/temas/urbanismo-e-obras',
    notas: 'PDM revisto em 2012. Zonas de contenção de AL activas.',
    frequente: false,
  },

  // ═══════════════════════════════════════════════════════════════
  // DISTRITO DE LEIRIA
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'leiria',
    nome: 'Leiria',
    distrito: 'leiria',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkCamara: 'https://www.cm-leiria.pt/',
    frequente: false,
  },

  // ═══════════════════════════════════════════════════════════════
  // DISTRITO DE BRAGA
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'braga',
    nome: 'Braga',
    distrito: 'braga',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkGeoportal: 'https://sig.cm-braga.pt/',
    linkCamara: 'https://www.cm-braga.pt/',
    frequente: false,
  },
];

// Link central SNIT para consulta de qualquer município
export const SNIT_URL = 'https://snit.dgterritorio.gov.pt/';
export const SNIT_VIEWER_URL = 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic';

// ═══════════════════════════════════════════════════════════════
// CHECKLIST GENÉRICO — para municípios sem dados específicos
// ═══════════════════════════════════════════════════════════════
export const TOPICOS_GENERICOS: TopicoRegulamentar[] = [
  {
    categoria: 'Parâmetros Urbanísticos (PDM)',
    icon: 'Ruler',
    itens: [
      'Consultar classificação e qualificação do solo no SNIT (Solo Urbano / Rústico)',
      'Verificar categoria de espaço (Central, Residencial, Actividades Económicas, etc.)',
      'Índice de utilização bruto máximo',
      'Índice de impermeabilização máximo',
      'Cércea máxima / N.º de pisos',
      'Afastamentos mínimos: frontal (alinhamento), lateral (≥ 3m), posterior (≥ 6m)',
      'Verificar existência de PU ou PP que prevaleça sobre o PDM',
    ],
  },
  {
    categoria: 'Estacionamento',
    icon: 'Car',
    itens: [
      'Habitação unifamiliar: mín. 1 lugar/fogo',
      'Habitação colectiva: 1 lugar/fogo + visitantes',
      'Comércio/Serviços: conforme área bruta de construção',
      'Dimensões mín.: 2,50m × 5,00m (perpendicular)',
      'Lugares PMR: conforme DL 163/2006',
    ],
  },
  {
    categoria: 'Cedências e Infraestruturas',
    icon: 'TreePine',
    itens: [
      'Operações de loteamento: cedências para espaços verdes, equipamentos e arruamentos',
      'Arruamentos: perfil transversal com passeios ≥ 1,50m',
      'Redes de água, saneamento e pluviais — projecto de especialidade',
      'Rede eléctrica e telecomunicações subterrânea',
      'Iluminação pública',
    ],
  },
  {
    categoria: 'Acessibilidades',
    icon: 'Accessibility',
    itens: [
      'Passeios mín. 1,50m livres de obstáculos (DL 163/2006)',
      'Rampas de acesso: inclinação máx. 6% (8% até 5m)',
      'Passadeiras rebaixadas em cruzamentos',
    ],
  },
  {
    categoria: 'Instrução de Processos',
    icon: 'FileCheck',
    itens: [
      'Elementos instrutórios conforme Portaria 113/2015 (ou Portaria 73/2024 Simplex)',
      'Termos de responsabilidade de todos os técnicos subscritores',
      'Memória descritiva com enquadramento no PDM',
      'Ficha SCIE — conforme utilização-tipo',
      'Projecto SCE (térmica) — obrigatório para edificações novas',
      'Projecto de acústica — conforme DL 96/2008',
    ],
  },
  {
    categoria: 'Condicionantes e Servidões',
    icon: 'AlertTriangle',
    itens: [
      'REN — Reserva Ecológica Nacional',
      'RAN — Reserva Agrícola Nacional',
      'Domínio hídrico — faixas de protecção a cursos de água',
      'Servidões rodoviárias — faixas non aedificandi junto a estradas',
      'Servidões de alta tensão',
      'Património classificado — zonas de protecção',
      'Risco de incêndio — faixas de gestão de combustível (DL 82/2021)',
    ],
  },
  {
    categoria: 'Taxas (TMU)',
    icon: 'Receipt',
    itens: [
      'Taxa Municipal de Urbanização — conforme regulamento de taxas do município',
      'Varia por tipo de operação: construção nova, ampliação, loteamento, alteração de uso',
      'Taxa de ocupação do espaço público (estaleiro, tapumes)',
    ],
  },
];
