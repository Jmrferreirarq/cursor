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
  },
  {
    id: 'estarreja',
    nome: 'Estarreja',
    distrito: 'aveiro',
    linkPDM: 'https://snit.dgterritorio.gov.pt/Viewer/ViewerPublic?token=a2ca8ef0-22d3-4ca8-b5bf-e449dadd6255',
    linkCamara: 'https://www.cm-estarreja.pt/',
    linkEurbanismo: 'https://www.cm-estarreja.pt/urbanismo',
    frequente: true,
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
