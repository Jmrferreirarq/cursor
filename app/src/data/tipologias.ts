// Tipologias de Edifícios e Mapeamento para Legislação Aplicável
// FA-360 Platform — v1.0

export interface Tipologia {
  id: string;
  nome: string;
  descricao: string;
  icon: string; // lucide icon name
  cor: string; // tailwind color
}

export interface TipologiaDiploma {
  diplomaId: string; // references Diploma.id from legislacao.ts
  relevancia: 'obrigatorio' | 'frequente' | 'condicional';
  nota: string; // brief explanation in Portuguese
}

export const TIPOLOGIAS: Tipologia[] = [
  {
    id: 'moradia_isolada',
    nome: 'Moradia Unifamiliar Isolada',
    descricao: 'Edifício de habitação unifamiliar isolado, sem contacto com outros edifícios',
    icon: 'Home',
    cor: 'blue',
  },
  {
    id: 'moradia_geminada',
    nome: 'Moradia Geminada',
    descricao: 'Moradia unifamiliar com uma ou mais paredes em comum com edifícios adjacentes',
    icon: 'Building',
    cor: 'amber',
  },
  {
    id: 'moradia_banda',
    nome: 'Moradia em Banda',
    descricao: 'Conjunto de moradias unifamiliares em linha, partilhando paredes laterais',
    icon: 'Building2',
    cor: 'emerald',
  },
  {
    id: 'multifamiliar',
    nome: 'Edifício Multifamiliar',
    descricao: 'Edifício de habitação colectiva com múltiplos fogos e partes comuns',
    icon: 'Building2',
    cor: 'violet',
  },
  {
    id: 'comercio_servicos',
    nome: 'Comércio e Serviços',
    descricao: 'Edifícios destinados a actividades comerciais, escritórios e prestação de serviços',
    icon: 'Warehouse',
    cor: 'rose',
  },
  {
    id: 'equipamento',
    nome: 'Equipamento Público',
    descricao: 'Equipamentos colectivos: escolas, hospitais, centros de saúde, instalações desportivas',
    icon: 'Landmark',
    cor: 'cyan',
  },
  {
    id: 'industrial',
    nome: 'Industrial / Armazém',
    descricao: 'Edifícios industriais, armazéns, oficinas e instalações de produção',
    icon: 'Factory',
    cor: 'orange',
  },
  {
    id: 'reabilitacao',
    nome: 'Reabilitação de Edifício Existente',
    descricao: 'Intervenções de reabilitação, renovação ou reconversão em edifícios existentes',
    icon: 'Hammer',
    cor: 'slate',
  },
  {
    id: 'loteamento',
    nome: 'Loteamento / Urbanização',
    descricao: 'Operações de loteamento, urbanização e infraestruturação de terrenos',
    icon: 'Map',
    cor: 'lime',
  },
  {
    id: 'turismo',
    nome: 'Empreendimento Turístico / AL',
    descricao: 'Hotéis, alojamentos locais, apartamentos turísticos e estabelecimentos hoteleiros',
    icon: 'Hotel',
    cor: 'pink',
  },
];

export const TIPOLOGIA_DIPLOMAS: Record<string, TipologiaDiploma[]> = {
  moradia_isolada: [
    {
      diplomaId: 'rjue',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para licenciamento de obras de construção nova e comunicação prévia',
    },
    {
      diplomaId: 'rjigt',
      relevancia: 'obrigatorio',
      nota: 'Necessário para verificação de conformidade com PDM e classificação do solo',
    },
    {
      diplomaId: 'rgeu',
      relevancia: 'obrigatorio',
      nota: 'Define áreas mínimas de compartimentos, pé-direito e condições de salubridade',
    },
    {
      diplomaId: 'simplex',
      relevancia: 'frequente',
      nota: 'Pode aplicar-se se a obra estiver isenta de controlo prévio ou usar comunicação prévia simplificada',
    },
    {
      diplomaId: 'acessibilidades',
      relevancia: 'condicional',
      nota: 'Aplicável apenas se o edifício tiver mais de 4 pisos acima do solo',
    },
    {
      diplomaId: 'sce-reh-recs',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para certificação energética e cumprimento de requisitos REH',
    },
    {
      diplomaId: 'portaria-349b',
      relevancia: 'obrigatorio',
      nota: 'Define parâmetros técnicos e valores de referência para cálculo energético',
    },
    {
      diplomaId: 'portaria-349d-2013',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta requisitos específicos de desempenho energético para habitação',
    },
    {
      diplomaId: 'rj-scie',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para classificação da utilização-tipo e categoria de risco',
    },
    {
      diplomaId: 'rt-scie',
      relevancia: 'obrigatorio',
      nota: 'Define requisitos técnicos de segurança contra incêndios e evacuação',
    },
    {
      diplomaId: 'rrae',
      relevancia: 'obrigatorio',
      nota: 'Estabelece requisitos de isolamento sonoro entre fogos e fachadas',
    },
    {
      diplomaId: 'rgr',
      relevancia: 'frequente',
      nota: 'Aplicável para verificação de limites de ruído ambiente e classificação da zona',
    },
    {
      diplomaId: 'rtiebt',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para projecto e execução de instalações eléctricas de baixa tensão',
    },
    {
      diplomaId: 'dl-96-2017',
      relevancia: 'obrigatorio',
      nota: 'Regime jurídico das instalações eléctricas particulares e obrigatoriedade de projecto',
    },
    {
      diplomaId: 'dl-97-2017',
      relevancia: 'frequente',
      nota: 'Aplicável se houver instalação de gás natural ou GPL canalizado',
    },
    {
      diplomaId: 'ited',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para infraestruturas de telecomunicações em edifícios novos',
    },
    {
      diplomaId: 'rjue-elementos',
      relevancia: 'obrigatorio',
      nota: 'Define elementos instrutórios obrigatórios para pedidos de licenciamento',
    },
    {
      diplomaId: 'rcd',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para elaboração de Plano de Prevenção e Gestão de RCD',
    },
    {
      diplomaId: 'agua-esgotos',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta sistemas prediais de distribuição de água e drenagem de águas residuais',
    },
    {
      diplomaId: 'lei-31-2009',
      relevancia: 'obrigatorio',
      nota: 'Define qualificação profissional exigível para subscrição de projectos',
    },
    {
      diplomaId: 'dl-273-2003',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta requisitos de segurança estrutural e estabilidade',
    },
    {
      diplomaId: 'en-1990',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para definir as combinações de acções no cálculo estrutural',
    },
    {
      diplomaId: 'en-1991',
      relevancia: 'obrigatorio',
      nota: 'Define acções em estruturas: cargas permanentes, variáveis e acidentais',
    },
    {
      diplomaId: 'en-1992',
      relevancia: 'frequente',
      nota: 'Aplicável para cálculo de estruturas de betão armado',
    },
    {
      diplomaId: 'en-1997',
      relevancia: 'frequente',
      nota: 'Aplicável para projecto geotécnico e fundações',
    },
    {
      diplomaId: 'en-1998',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para verificação de segurança sísmica em zonas de risco',
    },
    {
      diplomaId: 'dl-118-2013-solar',
      relevancia: 'obrigatorio',
      nota: 'Obriga à instalação de sistemas solares térmicos ou fotovoltaicos em edifícios novos',
    },
    {
      diplomaId: 'portaria-73-2024',
      relevancia: 'frequente',
      nota: 'Actualiza elementos instrutórios e procedimentos de licenciamento',
    },
    {
      diplomaId: 'dl-162-2019',
      relevancia: 'condicional',
      nota: 'Aplicável se houver necessidade de ligação a redes de distribuição de energia',
    },
    {
      diplomaId: 'rgc',
      relevancia: 'obrigatorio',
      nota: 'Regulamento Geral de Construção — normas gerais de construção',
    },
    {
      diplomaId: 'snit-pdm',
      relevancia: 'obrigatorio',
      nota: 'Necessário para verificação de conformidade com instrumentos de gestão territorial',
    },
  ],

  moradia_geminada: [
    {
      diplomaId: 'rjue',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para licenciamento de obras de construção nova e comunicação prévia',
    },
    {
      diplomaId: 'rjigt',
      relevancia: 'obrigatorio',
      nota: 'Necessário para verificação de conformidade com PDM e classificação do solo',
    },
    {
      diplomaId: 'rgeu',
      relevancia: 'obrigatorio',
      nota: 'Define áreas mínimas de compartimentos, pé-direito e condições de salubridade',
    },
    {
      diplomaId: 'simplex',
      relevancia: 'frequente',
      nota: 'Pode aplicar-se se a obra estiver isenta de controlo prévio ou usar comunicação prévia simplificada',
    },
    {
      diplomaId: 'acessibilidades',
      relevancia: 'condicional',
      nota: 'Aplicável apenas se o edifício tiver mais de 4 pisos acima do solo',
    },
    {
      diplomaId: 'sce-reh-recs',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para certificação energética e cumprimento de requisitos REH',
    },
    {
      diplomaId: 'portaria-349b',
      relevancia: 'obrigatorio',
      nota: 'Define parâmetros técnicos e valores de referência para cálculo energético',
    },
    {
      diplomaId: 'portaria-349d-2013',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta requisitos específicos de desempenho energético para habitação',
    },
    {
      diplomaId: 'rj-scie',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para classificação da utilização-tipo e categoria de risco',
    },
    {
      diplomaId: 'rt-scie',
      relevancia: 'obrigatorio',
      nota: 'Define requisitos técnicos de segurança contra incêndios e evacuação',
    },
    {
      diplomaId: 'rrae',
      relevancia: 'obrigatorio',
      nota: 'Estabelece requisitos de isolamento sonoro entre fogos e fachadas',
    },
    {
      diplomaId: 'rgr',
      relevancia: 'frequente',
      nota: 'Aplicável para verificação de limites de ruído ambiente e classificação da zona',
    },
    {
      diplomaId: 'rtiebt',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para projecto e execução de instalações eléctricas de baixa tensão',
    },
    {
      diplomaId: 'dl-96-2017',
      relevancia: 'obrigatorio',
      nota: 'Regime jurídico das instalações eléctricas particulares e obrigatoriedade de projecto',
    },
    {
      diplomaId: 'dl-97-2017',
      relevancia: 'frequente',
      nota: 'Aplicável se houver instalação de gás natural ou GPL canalizado',
    },
    {
      diplomaId: 'ited',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para infraestruturas de telecomunicações em edifícios novos',
    },
    {
      diplomaId: 'propriedade-horizontal',
      relevancia: 'frequente',
      nota: 'Pode aplicar-se se houver partilha de partes comuns ou constituição de condomínio',
    },
    {
      diplomaId: 'rjue-elementos',
      relevancia: 'obrigatorio',
      nota: 'Define elementos instrutórios obrigatórios para pedidos de licenciamento',
    },
    {
      diplomaId: 'rcd',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para elaboração de Plano de Prevenção e Gestão de RCD',
    },
    {
      diplomaId: 'agua-esgotos',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta sistemas prediais de distribuição de água e drenagem de águas residuais',
    },
    {
      diplomaId: 'lei-31-2009',
      relevancia: 'obrigatorio',
      nota: 'Define qualificação profissional exigível para subscrição de projectos',
    },
    {
      diplomaId: 'dl-273-2003',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta requisitos de segurança estrutural e estabilidade',
    },
    {
      diplomaId: 'en-1990',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para definir as combinações de acções no cálculo estrutural',
    },
    {
      diplomaId: 'en-1991',
      relevancia: 'obrigatorio',
      nota: 'Define acções em estruturas: cargas permanentes, variáveis e acidentais',
    },
    {
      diplomaId: 'en-1992',
      relevancia: 'frequente',
      nota: 'Aplicável para cálculo de estruturas de betão armado',
    },
    {
      diplomaId: 'en-1997',
      relevancia: 'frequente',
      nota: 'Aplicável para projecto geotécnico e fundações',
    },
    {
      diplomaId: 'en-1998',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para verificação de segurança sísmica em zonas de risco',
    },
    {
      diplomaId: 'dl-118-2013-solar',
      relevancia: 'obrigatorio',
      nota: 'Obriga à instalação de sistemas solares térmicos ou fotovoltaicos em edifícios novos',
    },
    {
      diplomaId: 'portaria-73-2024',
      relevancia: 'frequente',
      nota: 'Actualiza elementos instrutórios e procedimentos de licenciamento',
    },
    {
      diplomaId: 'dl-162-2019',
      relevancia: 'condicional',
      nota: 'Aplicável se houver necessidade de ligação a redes de distribuição de energia',
    },
    {
      diplomaId: 'rgc',
      relevancia: 'obrigatorio',
      nota: 'Regulamento Geral de Construção — normas gerais de construção',
    },
    {
      diplomaId: 'snit-pdm',
      relevancia: 'obrigatorio',
      nota: 'Necessário para verificação de conformidade com instrumentos de gestão territorial',
    },
  ],

  moradia_banda: [
    {
      diplomaId: 'rjue',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para licenciamento de obras de construção nova e comunicação prévia',
    },
    {
      diplomaId: 'rjigt',
      relevancia: 'obrigatorio',
      nota: 'Necessário para verificação de conformidade com PDM e classificação do solo',
    },
    {
      diplomaId: 'rgeu',
      relevancia: 'obrigatorio',
      nota: 'Define áreas mínimas de compartimentos, pé-direito e condições de salubridade',
    },
    {
      diplomaId: 'simplex',
      relevancia: 'frequente',
      nota: 'Pode aplicar-se se a obra estiver isenta de controlo prévio ou usar comunicação prévia simplificada',
    },
    {
      diplomaId: 'acessibilidades',
      relevancia: 'condicional',
      nota: 'Aplicável apenas se o edifício tiver mais de 4 pisos acima do solo',
    },
    {
      diplomaId: 'sce-reh-recs',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para certificação energética e cumprimento de requisitos REH',
    },
    {
      diplomaId: 'portaria-349b',
      relevancia: 'obrigatorio',
      nota: 'Define parâmetros técnicos e valores de referência para cálculo energético',
    },
    {
      diplomaId: 'portaria-349d-2013',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta requisitos específicos de desempenho energético para habitação',
    },
    {
      diplomaId: 'rj-scie',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para classificação da utilização-tipo e categoria de risco',
    },
    {
      diplomaId: 'rt-scie',
      relevancia: 'obrigatorio',
      nota: 'Define requisitos técnicos de segurança contra incêndios e evacuação',
    },
    {
      diplomaId: 'rrae',
      relevancia: 'obrigatorio',
      nota: 'Estabelece requisitos de isolamento sonoro entre fogos e fachadas',
    },
    {
      diplomaId: 'rgr',
      relevancia: 'frequente',
      nota: 'Aplicável para verificação de limites de ruído ambiente e classificação da zona',
    },
    {
      diplomaId: 'rtiebt',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para projecto e execução de instalações eléctricas de baixa tensão',
    },
    {
      diplomaId: 'dl-96-2017',
      relevancia: 'obrigatorio',
      nota: 'Regime jurídico das instalações eléctricas particulares e obrigatoriedade de projecto',
    },
    {
      diplomaId: 'dl-97-2017',
      relevancia: 'frequente',
      nota: 'Aplicável se houver instalação de gás natural ou GPL canalizado',
    },
    {
      diplomaId: 'ited',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para infraestruturas de telecomunicações em edifícios novos',
    },
    {
      diplomaId: 'propriedade-horizontal',
      relevancia: 'frequente',
      nota: 'Pode aplicar-se se houver partilha de partes comuns ou constituição de condomínio',
    },
    {
      diplomaId: 'rjue-elementos',
      relevancia: 'obrigatorio',
      nota: 'Define elementos instrutórios obrigatórios para pedidos de licenciamento',
    },
    {
      diplomaId: 'rcd',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para elaboração de Plano de Prevenção e Gestão de RCD',
    },
    {
      diplomaId: 'agua-esgotos',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta sistemas prediais de distribuição de água e drenagem de águas residuais',
    },
    {
      diplomaId: 'lei-31-2009',
      relevancia: 'obrigatorio',
      nota: 'Define qualificação profissional exigível para subscrição de projectos',
    },
    {
      diplomaId: 'dl-273-2003',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta requisitos de segurança estrutural e estabilidade',
    },
    {
      diplomaId: 'en-1990',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para definir as combinações de acções no cálculo estrutural',
    },
    {
      diplomaId: 'en-1991',
      relevancia: 'obrigatorio',
      nota: 'Define acções em estruturas: cargas permanentes, variáveis e acidentais',
    },
    {
      diplomaId: 'en-1992',
      relevancia: 'frequente',
      nota: 'Aplicável para cálculo de estruturas de betão armado',
    },
    {
      diplomaId: 'en-1997',
      relevancia: 'frequente',
      nota: 'Aplicável para projecto geotécnico e fundações',
    },
    {
      diplomaId: 'en-1998',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para verificação de segurança sísmica em zonas de risco',
    },
    {
      diplomaId: 'dl-118-2013-solar',
      relevancia: 'obrigatorio',
      nota: 'Obriga à instalação de sistemas solares térmicos ou fotovoltaicos em edifícios novos',
    },
    {
      diplomaId: 'portaria-73-2024',
      relevancia: 'frequente',
      nota: 'Actualiza elementos instrutórios e procedimentos de licenciamento',
    },
    {
      diplomaId: 'dl-162-2019',
      relevancia: 'condicional',
      nota: 'Aplicável se houver necessidade de ligação a redes de distribuição de energia',
    },
    {
      diplomaId: 'rgc',
      relevancia: 'obrigatorio',
      nota: 'Regulamento Geral de Construção — normas gerais de construção',
    },
    {
      diplomaId: 'snit-pdm',
      relevancia: 'obrigatorio',
      nota: 'Necessário para verificação de conformidade com instrumentos de gestão territorial',
    },
  ],

  multifamiliar: [
    {
      diplomaId: 'rjue',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para licenciamento de obras de construção nova e comunicação prévia',
    },
    {
      diplomaId: 'rjigt',
      relevancia: 'obrigatorio',
      nota: 'Necessário para verificação de conformidade com PDM e classificação do solo',
    },
    {
      diplomaId: 'rgeu',
      relevancia: 'obrigatorio',
      nota: 'Define áreas mínimas de compartimentos, pé-direito e condições de salubridade',
    },
    {
      diplomaId: 'simplex',
      relevancia: 'frequente',
      nota: 'Pode aplicar-se se a obra estiver isenta de controlo prévio ou usar comunicação prévia simplificada',
    },
    {
      diplomaId: 'acessibilidades',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para edifícios de habitação colectiva com espaços comuns acessíveis',
    },
    {
      diplomaId: 'sce-reh-recs',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para certificação energética e cumprimento de requisitos REH',
    },
    {
      diplomaId: 'portaria-349b',
      relevancia: 'obrigatorio',
      nota: 'Define parâmetros técnicos e valores de referência para cálculo energético',
    },
    {
      diplomaId: 'portaria-349d-2013',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta requisitos específicos de desempenho energético para habitação',
    },
    {
      diplomaId: 'rj-scie',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para classificação da utilização-tipo e categoria de risco',
    },
    {
      diplomaId: 'rt-scie',
      relevancia: 'obrigatorio',
      nota: 'Define requisitos técnicos de segurança contra incêndios e evacuação',
    },
    {
      diplomaId: 'rrae',
      relevancia: 'obrigatorio',
      nota: 'Estabelece requisitos de isolamento sonoro entre fogos e fachadas',
    },
    {
      diplomaId: 'rgr',
      relevancia: 'frequente',
      nota: 'Aplicável para verificação de limites de ruído ambiente e classificação da zona',
    },
    {
      diplomaId: 'rtiebt',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para projecto e execução de instalações eléctricas de baixa tensão',
    },
    {
      diplomaId: 'dl-96-2017',
      relevancia: 'obrigatorio',
      nota: 'Regime jurídico das instalações eléctricas particulares e obrigatoriedade de projecto',
    },
    {
      diplomaId: 'dl-97-2017',
      relevancia: 'frequente',
      nota: 'Aplicável se houver instalação de gás natural ou GPL canalizado',
    },
    {
      diplomaId: 'ited',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para infraestruturas de telecomunicações em edifícios novos',
    },
    {
      diplomaId: 'propriedade-horizontal',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para constituição de propriedade horizontal e definição de fracções autónomas',
    },
    {
      diplomaId: 'dl-95-2019',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta requisitos de acessibilidade e mobilidade condicionada em edifícios de habitação colectiva',
    },
    {
      diplomaId: 'ascensores',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para edifícios com mais de 3 pisos acima do solo',
    },
    {
      diplomaId: 'avac',
      relevancia: 'frequente',
      nota: 'Aplicável para sistemas de ventilação e qualidade do ar interior em espaços comuns',
    },
    {
      diplomaId: 'rece',
      relevancia: 'obrigatorio',
      nota: 'Regulamento de Desempenho Energético para Edifícios de Comércio e Serviços — aplicável a partes comuns',
    },
    {
      diplomaId: 'regulamento-estacionamento',
      relevancia: 'obrigatorio',
      nota: 'Define requisitos de estacionamento e lugares reservados para pessoas com mobilidade reduzida',
    },
    {
      diplomaId: 'rjue-elementos',
      relevancia: 'obrigatorio',
      nota: 'Define elementos instrutórios obrigatórios para pedidos de licenciamento',
    },
    {
      diplomaId: 'rcd',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para elaboração de Plano de Prevenção e Gestão de RCD',
    },
    {
      diplomaId: 'agua-esgotos',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta sistemas prediais de distribuição de água e drenagem de águas residuais',
    },
    {
      diplomaId: 'lei-31-2009',
      relevancia: 'obrigatorio',
      nota: 'Define qualificação profissional exigível para subscrição de projectos',
    },
    {
      diplomaId: 'dl-273-2003',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta requisitos de segurança estrutural e estabilidade',
    },
    {
      diplomaId: 'en-1990',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para definir as combinações de acções no cálculo estrutural',
    },
    {
      diplomaId: 'en-1991',
      relevancia: 'obrigatorio',
      nota: 'Define acções em estruturas: cargas permanentes, variáveis e acidentais',
    },
    {
      diplomaId: 'en-1992',
      relevancia: 'frequente',
      nota: 'Aplicável para cálculo de estruturas de betão armado',
    },
    {
      diplomaId: 'en-1997',
      relevancia: 'frequente',
      nota: 'Aplicável para projecto geotécnico e fundações',
    },
    {
      diplomaId: 'en-1998',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para verificação de segurança sísmica em zonas de risco',
    },
    {
      diplomaId: 'dl-118-2013-solar',
      relevancia: 'obrigatorio',
      nota: 'Obriga à instalação de sistemas solares térmicos ou fotovoltaicos em edifícios novos',
    },
    {
      diplomaId: 'portaria-73-2024',
      relevancia: 'frequente',
      nota: 'Actualiza elementos instrutórios e procedimentos de licenciamento',
    },
    {
      diplomaId: 'dl-162-2019',
      relevancia: 'condicional',
      nota: 'Aplicável se houver necessidade de ligação a redes de distribuição de energia',
    },
    {
      diplomaId: 'rgc',
      relevancia: 'obrigatorio',
      nota: 'Regulamento Geral de Construção — normas gerais de construção',
    },
    {
      diplomaId: 'snit-pdm',
      relevancia: 'obrigatorio',
      nota: 'Necessário para verificação de conformidade com instrumentos de gestão territorial',
    },
  ],

  comercio_servicos: [
    {
      diplomaId: 'rjue',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para licenciamento de obras de construção nova e comunicação prévia',
    },
    {
      diplomaId: 'rjigt',
      relevancia: 'obrigatorio',
      nota: 'Necessário para verificação de conformidade com PDM e classificação do solo',
    },
    {
      diplomaId: 'rgeu',
      relevancia: 'obrigatorio',
      nota: 'Define áreas mínimas de compartimentos, pé-direito e condições de salubridade',
    },
    {
      diplomaId: 'simplex',
      relevancia: 'frequente',
      nota: 'Pode aplicar-se se a obra estiver isenta de controlo prévio ou usar comunicação prévia simplificada',
    },
    {
      diplomaId: 'acessibilidades',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para edifícios que recebem público',
    },
    {
      diplomaId: 'sce-reh-recs',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para certificação energética e cumprimento de requisitos RECS',
    },
    {
      diplomaId: 'portaria-349b',
      relevancia: 'obrigatorio',
      nota: 'Define parâmetros técnicos e valores de referência para cálculo energético',
    },
    {
      diplomaId: 'portaria-349d-2013',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta requisitos específicos de desempenho energético para comércio e serviços',
    },
    {
      diplomaId: 'rj-scie',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para classificação da utilização-tipo (UT II, III, IV) e categoria de risco',
    },
    {
      diplomaId: 'rt-scie',
      relevancia: 'obrigatorio',
      nota: 'Define requisitos técnicos de segurança contra incêndios mais exigentes para comércio',
    },
    {
      diplomaId: 'rrae',
      relevancia: 'obrigatorio',
      nota: 'Estabelece requisitos de isolamento sonoro entre espaços comerciais e habitação',
    },
    {
      diplomaId: 'rgr',
      relevancia: 'frequente',
      nota: 'Aplicável para verificação de limites de ruído ambiente e classificação da zona',
    },
    {
      diplomaId: 'rtiebt',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para projecto e execução de instalações eléctricas de baixa tensão',
    },
    {
      diplomaId: 'dl-96-2017',
      relevancia: 'obrigatorio',
      nota: 'Regime jurídico das instalações eléctricas particulares e obrigatoriedade de projecto',
    },
    {
      diplomaId: 'dl-97-2017',
      relevancia: 'frequente',
      nota: 'Aplicável se houver instalação de gás natural ou GPL canalizado',
    },
    {
      diplomaId: 'ited',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para infraestruturas de telecomunicações em edifícios novos',
    },
    {
      diplomaId: 'propriedade-horizontal',
      relevancia: 'frequente',
      nota: 'Aplicável se houver fracções comerciais em edifício misto',
    },
    {
      diplomaId: 'dl-95-2019',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta requisitos de acessibilidade e mobilidade condicionada em edifícios que recebem público',
    },
    {
      diplomaId: 'ascensores',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para edifícios com mais de 3 pisos acima do solo',
    },
    {
      diplomaId: 'avac',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para sistemas de climatização, ventilação e qualidade do ar interior',
    },
    {
      diplomaId: 'rece',
      relevancia: 'obrigatorio',
      nota: 'Regulamento de Desempenho Energético para Edifícios de Comércio e Serviços',
    },
    {
      diplomaId: 'regulamento-estacionamento',
      relevancia: 'obrigatorio',
      nota: 'Define requisitos de estacionamento e lugares reservados para pessoas com mobilidade reduzida',
    },
    {
      diplomaId: 'rjue-elementos',
      relevancia: 'obrigatorio',
      nota: 'Define elementos instrutórios obrigatórios para pedidos de licenciamento',
    },
    {
      diplomaId: 'rcd',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para elaboração de Plano de Prevenção e Gestão de RCD',
    },
    {
      diplomaId: 'agua-esgotos',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta sistemas prediais de distribuição de água e drenagem de águas residuais',
    },
    {
      diplomaId: 'lei-31-2009',
      relevancia: 'obrigatorio',
      nota: 'Define qualificação profissional exigível para subscrição de projectos',
    },
    {
      diplomaId: 'dl-273-2003',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta requisitos de segurança estrutural e estabilidade',
    },
    {
      diplomaId: 'en-1990',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para definir as combinações de acções no cálculo estrutural',
    },
    {
      diplomaId: 'en-1991',
      relevancia: 'obrigatorio',
      nota: 'Define acções em estruturas: cargas permanentes, variáveis e acidentais',
    },
    {
      diplomaId: 'en-1992',
      relevancia: 'frequente',
      nota: 'Aplicável para cálculo de estruturas de betão armado',
    },
    {
      diplomaId: 'en-1997',
      relevancia: 'frequente',
      nota: 'Aplicável para projecto geotécnico e fundações',
    },
    {
      diplomaId: 'en-1998',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para verificação de segurança sísmica em zonas de risco',
    },
    {
      diplomaId: 'dl-118-2013-solar',
      relevancia: 'obrigatorio',
      nota: 'Obriga à instalação de sistemas solares térmicos ou fotovoltaicos em edifícios novos',
    },
    {
      diplomaId: 'portaria-73-2024',
      relevancia: 'frequente',
      nota: 'Actualiza elementos instrutórios e procedimentos de licenciamento',
    },
    {
      diplomaId: 'dl-162-2019',
      relevancia: 'condicional',
      nota: 'Aplicável se houver necessidade de ligação a redes de distribuição de energia',
    },
    {
      diplomaId: 'rgc',
      relevancia: 'obrigatorio',
      nota: 'Regulamento Geral de Construção — normas gerais de construção',
    },
    {
      diplomaId: 'snit-pdm',
      relevancia: 'obrigatorio',
      nota: 'Necessário para verificação de conformidade com instrumentos de gestão territorial',
    },
  ],

  equipamento: [
    {
      diplomaId: 'rjue',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para licenciamento de obras de construção nova e comunicação prévia',
    },
    {
      diplomaId: 'rjigt',
      relevancia: 'obrigatorio',
      nota: 'Necessário para verificação de conformidade com PDM e classificação do solo',
    },
    {
      diplomaId: 'rgeu',
      relevancia: 'obrigatorio',
      nota: 'Define áreas mínimas de compartimentos, pé-direito e condições de salubridade',
    },
    {
      diplomaId: 'simplex',
      relevancia: 'frequente',
      nota: 'Pode aplicar-se se a obra estiver isenta de controlo prévio ou usar comunicação prévia simplificada',
    },
    {
      diplomaId: 'acessibilidades',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para equipamentos públicos que recebem público',
    },
    {
      diplomaId: 'sce-reh-recs',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para certificação energética e cumprimento de requisitos RECS',
    },
    {
      diplomaId: 'portaria-349b',
      relevancia: 'obrigatorio',
      nota: 'Define parâmetros técnicos e valores de referência para cálculo energético',
    },
    {
      diplomaId: 'portaria-349d-2013',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta requisitos específicos de desempenho energético para equipamentos',
    },
    {
      diplomaId: 'rj-scie',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para classificação da utilização-tipo (UT V, VI, VII) e categoria de risco',
    },
    {
      diplomaId: 'rt-scie',
      relevancia: 'obrigatorio',
      nota: 'Define requisitos técnicos de segurança contra incêndios muito exigentes para equipamentos',
    },
    {
      diplomaId: 'rrae',
      relevancia: 'obrigatorio',
      nota: 'Estabelece requisitos de isolamento sonoro específicos para equipamentos escolares e hospitalares',
    },
    {
      diplomaId: 'rgr',
      relevancia: 'frequente',
      nota: 'Aplicável para verificação de limites de ruído ambiente e classificação da zona',
    },
    {
      diplomaId: 'rtiebt',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para projecto e execução de instalações eléctricas de baixa tensão',
    },
    {
      diplomaId: 'dl-96-2017',
      relevancia: 'obrigatorio',
      nota: 'Regime jurídico das instalações eléctricas particulares e obrigatoriedade de projecto',
    },
    {
      diplomaId: 'dl-97-2017',
      relevancia: 'frequente',
      nota: 'Aplicável se houver instalação de gás natural ou GPL canalizado',
    },
    {
      diplomaId: 'ited',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para infraestruturas de telecomunicações em edifícios novos',
    },
    {
      diplomaId: 'dl-38-2013',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta requisitos específicos de segurança contra incêndios em equipamentos escolares',
    },
    {
      diplomaId: 'ccp',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para contratação pública de projectos e obras de equipamentos',
    },
    {
      diplomaId: 'portaria-701h',
      relevancia: 'obrigatorio',
      nota: 'Define conteúdo obrigatório dos projectos de execução para obras públicas',
    },
    {
      diplomaId: 'nfpa-piscinas',
      relevancia: 'condicional',
      nota: 'Aplicável se houver piscinas ou instalações aquáticas no equipamento',
    },
    {
      diplomaId: 'ascensores',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para edifícios com mais de 3 pisos acima do solo',
    },
    {
      diplomaId: 'avac',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para sistemas de climatização, ventilação e qualidade do ar interior',
    },
    {
      diplomaId: 'rece',
      relevancia: 'obrigatorio',
      nota: 'Regulamento de Desempenho Energético para Edifícios de Comércio e Serviços',
    },
    {
      diplomaId: 'regulamento-estacionamento',
      relevancia: 'obrigatorio',
      nota: 'Define requisitos de estacionamento e lugares reservados para pessoas com mobilidade reduzida',
    },
    {
      diplomaId: 'rjue-elementos',
      relevancia: 'obrigatorio',
      nota: 'Define elementos instrutórios obrigatórios para pedidos de licenciamento',
    },
    {
      diplomaId: 'rcd',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para elaboração de Plano de Prevenção e Gestão de RCD',
    },
    {
      diplomaId: 'agua-esgotos',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta sistemas prediais de distribuição de água e drenagem de águas residuais',
    },
    {
      diplomaId: 'lei-31-2009',
      relevancia: 'obrigatorio',
      nota: 'Define qualificação profissional exigível para subscrição de projectos',
    },
    {
      diplomaId: 'dl-273-2003',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta requisitos de segurança estrutural e estabilidade',
    },
    {
      diplomaId: 'en-1990',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para definir as combinações de acções no cálculo estrutural',
    },
    {
      diplomaId: 'en-1991',
      relevancia: 'obrigatorio',
      nota: 'Define acções em estruturas: cargas permanentes, variáveis e acidentais',
    },
    {
      diplomaId: 'en-1992',
      relevancia: 'frequente',
      nota: 'Aplicável para cálculo de estruturas de betão armado',
    },
    {
      diplomaId: 'en-1997',
      relevancia: 'frequente',
      nota: 'Aplicável para projecto geotécnico e fundações',
    },
    {
      diplomaId: 'en-1998',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para verificação de segurança sísmica em zonas de risco',
    },
    {
      diplomaId: 'dl-118-2013-solar',
      relevancia: 'obrigatorio',
      nota: 'Obriga à instalação de sistemas solares térmicos ou fotovoltaicos em edifícios novos',
    },
    {
      diplomaId: 'portaria-73-2024',
      relevancia: 'frequente',
      nota: 'Actualiza elementos instrutórios e procedimentos de licenciamento',
    },
    {
      diplomaId: 'dl-162-2019',
      relevancia: 'condicional',
      nota: 'Aplicável se houver necessidade de ligação a redes de distribuição de energia',
    },
    {
      diplomaId: 'rgc',
      relevancia: 'obrigatorio',
      nota: 'Regulamento Geral de Construção — normas gerais de construção',
    },
    {
      diplomaId: 'snit-pdm',
      relevancia: 'obrigatorio',
      nota: 'Necessário para verificação de conformidade com instrumentos de gestão territorial',
    },
  ],

  industrial: [
    {
      diplomaId: 'rjue',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para licenciamento de obras de construção nova e comunicação prévia',
    },
    {
      diplomaId: 'rjigt',
      relevancia: 'obrigatorio',
      nota: 'Necessário para verificação de conformidade com PDM e classificação do solo',
    },
    {
      diplomaId: 'rgeu',
      relevancia: 'obrigatorio',
      nota: 'Define áreas mínimas de compartimentos, pé-direito e condições de salubridade',
    },
    {
      diplomaId: 'simplex',
      relevancia: 'frequente',
      nota: 'Pode aplicar-se se a obra estiver isenta de controlo prévio ou usar comunicação prévia simplificada',
    },
    {
      diplomaId: 'acessibilidades',
      relevancia: 'condicional',
      nota: 'Aplicável apenas se o edifício receber público ou tiver mais de 4 pisos',
    },
    {
      diplomaId: 'sce-reh-recs',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para certificação energética e cumprimento de requisitos RECS',
    },
    {
      diplomaId: 'portaria-349b',
      relevancia: 'obrigatorio',
      nota: 'Define parâmetros técnicos e valores de referência para cálculo energético',
    },
    {
      diplomaId: 'portaria-349d-2013',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta requisitos específicos de desempenho energético para edifícios industriais',
    },
    {
      diplomaId: 'rj-scie',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para classificação da utilização-tipo (UT VIII, IX) e categoria de risco',
    },
    {
      diplomaId: 'rt-scie',
      relevancia: 'obrigatorio',
      nota: 'Define requisitos técnicos de segurança contra incêndios para instalações industriais',
    },
    {
      diplomaId: 'rrae',
      relevancia: 'frequente',
      nota: 'Aplicável para verificação de isolamento sonoro, com requisitos menos exigentes que habitação',
    },
    {
      diplomaId: 'rgr',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para verificação de limites de ruído ambiente e classificação da zona',
    },
    {
      diplomaId: 'rtiebt',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para projecto e execução de instalações eléctricas de baixa tensão',
    },
    {
      diplomaId: 'dl-96-2017',
      relevancia: 'obrigatorio',
      nota: 'Regime jurídico das instalações eléctricas particulares e obrigatoriedade de projecto',
    },
    {
      diplomaId: 'dl-97-2017',
      relevancia: 'frequente',
      nota: 'Aplicável se houver instalação de gás natural ou GPL canalizado',
    },
    {
      diplomaId: 'ited',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para infraestruturas de telecomunicações em edifícios novos',
    },
    {
      diplomaId: 'dl-267-2002',
      relevancia: 'condicional',
      nota: 'Aplicável se houver armazenamento de produtos perigosos ou actividades de risco',
    },
    {
      diplomaId: 'dl-151b-2013',
      relevancia: 'condicional',
      nota: 'Aplicável para instalações com actividades potencialmente poluidoras',
    },
    {
      diplomaId: 'rjue-elementos',
      relevancia: 'obrigatorio',
      nota: 'Define elementos instrutórios obrigatórios para pedidos de licenciamento',
    },
    {
      diplomaId: 'rcd',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para elaboração de Plano de Prevenção e Gestão de RCD',
    },
    {
      diplomaId: 'agua-esgotos',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta sistemas prediais de distribuição de água e drenagem de águas residuais',
    },
    {
      diplomaId: 'lei-31-2009',
      relevancia: 'obrigatorio',
      nota: 'Define qualificação profissional exigível para subscrição de projectos',
    },
    {
      diplomaId: 'dl-273-2003',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta requisitos de segurança estrutural e estabilidade',
    },
    {
      diplomaId: 'en-1990',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para definir as combinações de acções no cálculo estrutural',
    },
    {
      diplomaId: 'en-1991',
      relevancia: 'obrigatorio',
      nota: 'Define acções em estruturas: cargas permanentes, variáveis e acidentais',
    },
    {
      diplomaId: 'en-1992',
      relevancia: 'frequente',
      nota: 'Aplicável para cálculo de estruturas de betão armado',
    },
    {
      diplomaId: 'en-1997',
      relevancia: 'frequente',
      nota: 'Aplicável para projecto geotécnico e fundações',
    },
    {
      diplomaId: 'en-1998',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para verificação de segurança sísmica em zonas de risco',
    },
    {
      diplomaId: 'dl-118-2013-solar',
      relevancia: 'obrigatorio',
      nota: 'Obriga à instalação de sistemas solares térmicos ou fotovoltaicos em edifícios novos',
    },
    {
      diplomaId: 'portaria-73-2024',
      relevancia: 'frequente',
      nota: 'Actualiza elementos instrutórios e procedimentos de licenciamento',
    },
    {
      diplomaId: 'dl-162-2019',
      relevancia: 'condicional',
      nota: 'Aplicável se houver necessidade de ligação a redes de distribuição de energia',
    },
    {
      diplomaId: 'rgc',
      relevancia: 'obrigatorio',
      nota: 'Regulamento Geral de Construção — normas gerais de construção',
    },
    {
      diplomaId: 'snit-pdm',
      relevancia: 'obrigatorio',
      nota: 'Necessário para verificação de conformidade com instrumentos de gestão territorial',
    },
  ],

  reabilitacao: [
    {
      diplomaId: 'rjue',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para licenciamento de obras de reabilitação e comunicação prévia',
    },
    {
      diplomaId: 'rjigt',
      relevancia: 'obrigatorio',
      nota: 'Necessário para verificação de conformidade com PDM e classificação do solo',
    },
    {
      diplomaId: 'rgeu',
      relevancia: 'obrigatorio',
      nota: 'Define áreas mínimas de compartimentos, pé-direito e condições de salubridade',
    },
    {
      diplomaId: 'simplex',
      relevancia: 'frequente',
      nota: 'Pode aplicar-se se a obra estiver isenta de controlo prévio ou usar comunicação prévia simplificada',
    },
    {
      diplomaId: 'reru',
      relevancia: 'obrigatorio',
      nota: 'Regime excecional de reabilitação urbana — pode dispensar requisitos técnicos actuais',
    },
    {
      diplomaId: 'rjru',
      relevancia: 'obrigatorio',
      nota: 'Define Áreas de Reabilitação Urbana (ARU) e benefícios fiscais para reabilitação',
    },
    {
      diplomaId: 'acessibilidades',
      relevancia: 'condicional',
      nota: 'Aplicável consoante a tipologia do edifício e extensão da intervenção',
    },
    {
      diplomaId: 'sce-reh-recs',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para certificação energética, com requisitos adaptados à reabilitação',
    },
    {
      diplomaId: 'portaria-349b',
      relevancia: 'obrigatorio',
      nota: 'Define parâmetros técnicos e valores de referência para cálculo energético',
    },
    {
      diplomaId: 'portaria-349d-2013',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta requisitos específicos de desempenho energético para reabilitação',
    },
    {
      diplomaId: 'rj-scie',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para classificação da utilização-tipo e categoria de risco',
    },
    {
      diplomaId: 'rt-scie',
      relevancia: 'obrigatorio',
      nota: 'Define requisitos técnicos de segurança contra incêndios, com adaptações para reabilitação',
    },
    {
      diplomaId: 'rrae',
      relevancia: 'obrigatorio',
      nota: 'Estabelece requisitos de isolamento sonoro, com possibilidade de dispensa parcial',
    },
    {
      diplomaId: 'rgr',
      relevancia: 'frequente',
      nota: 'Aplicável para verificação de limites de ruído ambiente e classificação da zona',
    },
    {
      diplomaId: 'rtiebt',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para projecto e execução de instalações eléctricas de baixa tensão',
    },
    {
      diplomaId: 'dl-96-2017',
      relevancia: 'obrigatorio',
      nota: 'Regime jurídico das instalações eléctricas particulares e obrigatoriedade de projecto',
    },
    {
      diplomaId: 'dl-97-2017',
      relevancia: 'frequente',
      nota: 'Aplicável se houver instalação ou renovação de gás natural ou GPL canalizado',
    },
    {
      diplomaId: 'ited',
      relevancia: 'frequente',
      nota: 'Aplicável em grandes remodelações que impliquem renovação de infraestruturas',
    },
    {
      diplomaId: 'patrimonio',
      relevancia: 'condicional',
      nota: 'Obrigatório se o edifício estiver classificado ou em zona de protecção',
    },
    {
      diplomaId: 'rjue-elementos',
      relevancia: 'obrigatorio',
      nota: 'Define elementos instrutórios obrigatórios para pedidos de licenciamento',
    },
    {
      diplomaId: 'rcd',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para elaboração de Plano de Prevenção e Gestão de RCD',
    },
    {
      diplomaId: 'agua-esgotos',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta sistemas prediais de distribuição de água e drenagem de águas residuais',
    },
    {
      diplomaId: 'lei-31-2009',
      relevancia: 'obrigatorio',
      nota: 'Define qualificação profissional exigível para subscrição de projectos',
    },
    {
      diplomaId: 'dl-273-2003',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta requisitos de segurança estrutural e estabilidade',
    },
    {
      diplomaId: 'en-1990',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para definir as combinações de acções no cálculo estrutural',
    },
    {
      diplomaId: 'en-1991',
      relevancia: 'obrigatorio',
      nota: 'Define acções em estruturas: cargas permanentes, variáveis e acidentais',
    },
    {
      diplomaId: 'en-1992',
      relevancia: 'frequente',
      nota: 'Aplicável para cálculo de estruturas de betão armado',
    },
    {
      diplomaId: 'en-1997',
      relevancia: 'frequente',
      nota: 'Aplicável para projecto geotécnico e fundações',
    },
    {
      diplomaId: 'en-1998',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para verificação de segurança sísmica em zonas de risco',
    },
    {
      diplomaId: 'dl-118-2013-solar',
      relevancia: 'condicional',
      nota: 'Aplicável em grandes renovações que impliquem renovação de sistemas técnicos',
    },
    {
      diplomaId: 'portaria-73-2024',
      relevancia: 'frequente',
      nota: 'Actualiza elementos instrutórios e procedimentos de licenciamento',
    },
    {
      diplomaId: 'dl-162-2019',
      relevancia: 'condicional',
      nota: 'Aplicável se houver necessidade de ligação a redes de distribuição de energia',
    },
    {
      diplomaId: 'rgc',
      relevancia: 'obrigatorio',
      nota: 'Regulamento Geral de Construção — normas gerais de construção',
    },
    {
      diplomaId: 'snit-pdm',
      relevancia: 'obrigatorio',
      nota: 'Necessário para verificação de conformidade com instrumentos de gestão territorial',
    },
  ],

  loteamento: [
    {
      diplomaId: 'rjue',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para licenciamento de operações de loteamento e urbanização',
    },
    {
      diplomaId: 'rjigt',
      relevancia: 'obrigatorio',
      nota: 'Necessário para verificação de conformidade com PDM e classificação do solo',
    },
    {
      diplomaId: 'simplex',
      relevancia: 'frequente',
      nota: 'Pode aplicar-se se a operação estiver isenta de controlo prévio',
    },
    {
      diplomaId: 'dl-555-cedencias',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta cedências obrigatórias para espaços públicos e equipamentos',
    },
    {
      diplomaId: 'regulamento-estacionamento',
      relevancia: 'obrigatorio',
      nota: 'Define requisitos de estacionamento e lugares reservados em espaços públicos',
    },
    {
      diplomaId: 'ren',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para verificação de sobreposição com Reserva Ecológica Nacional',
    },
    {
      diplomaId: 'ran',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para verificação de sobreposição com Reserva Agrícola Nacional',
    },
    {
      diplomaId: 'lei-agua',
      relevancia: 'frequente',
      nota: 'Aplicável para identificação de linhas de água e domínio público hídrico',
    },
    {
      diplomaId: 'servidoes',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para identificação de servidões administrativas que afectam o terreno',
    },
    {
      diplomaId: 'rcd',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para elaboração de Plano de Prevenção e Gestão de RCD',
    },
    {
      diplomaId: 'dl-273-2003',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta requisitos de segurança estrutural para infraestruturas',
    },
    {
      diplomaId: 'dl-151b-2013',
      relevancia: 'condicional',
      nota: 'Aplicável para instalações com actividades potencialmente poluidoras',
    },
    {
      diplomaId: 'snit-pdm',
      relevancia: 'obrigatorio',
      nota: 'Necessário para verificação de conformidade com instrumentos de gestão territorial',
    },
    {
      diplomaId: 'augi',
      relevancia: 'condicional',
      nota: 'Aplicável para infraestruturas de telecomunicações em urbanizações (ITUR)',
    },
    {
      diplomaId: 'ited',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para infraestruturas de telecomunicações em urbanizações (ITUR)',
    },
  ],

  turismo: [
    {
      diplomaId: 'rjue',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para licenciamento de obras de construção nova e comunicação prévia',
    },
    {
      diplomaId: 'rjigt',
      relevancia: 'obrigatorio',
      nota: 'Necessário para verificação de conformidade com PDM e classificação do solo',
    },
    {
      diplomaId: 'rgeu',
      relevancia: 'obrigatorio',
      nota: 'Define áreas mínimas de compartimentos, pé-direito e condições de salubridade',
    },
    {
      diplomaId: 'simplex',
      relevancia: 'frequente',
      nota: 'Pode aplicar-se se a obra estiver isenta de controlo prévio ou usar comunicação prévia simplificada',
    },
    {
      diplomaId: 'acessibilidades',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para estabelecimentos hoteleiros e alojamentos que recebem público',
    },
    {
      diplomaId: 'sce-reh-recs',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para certificação energética e cumprimento de requisitos RECS',
    },
    {
      diplomaId: 'portaria-349b',
      relevancia: 'obrigatorio',
      nota: 'Define parâmetros técnicos e valores de referência para cálculo energético',
    },
    {
      diplomaId: 'portaria-349d-2013',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta requisitos específicos de desempenho energético para turismo',
    },
    {
      diplomaId: 'rj-scie',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para classificação da utilização-tipo (UT II) e categoria de risco',
    },
    {
      diplomaId: 'rt-scie',
      relevancia: 'obrigatorio',
      nota: 'Define requisitos técnicos de segurança contra incêndios para estabelecimentos hoteleiros',
    },
    {
      diplomaId: 'rrae',
      relevancia: 'obrigatorio',
      nota: 'Estabelece requisitos de isolamento sonoro entre unidades de alojamento',
    },
    {
      diplomaId: 'rgr',
      relevancia: 'frequente',
      nota: 'Aplicável para verificação de limites de ruído ambiente e classificação da zona',
    },
    {
      diplomaId: 'rtiebt',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para projecto e execução de instalações eléctricas de baixa tensão',
    },
    {
      diplomaId: 'dl-96-2017',
      relevancia: 'obrigatorio',
      nota: 'Regime jurídico das instalações eléctricas particulares e obrigatoriedade de projecto',
    },
    {
      diplomaId: 'dl-97-2017',
      relevancia: 'frequente',
      nota: 'Aplicável se houver instalação de gás natural ou GPL canalizado',
    },
    {
      diplomaId: 'ited',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para infraestruturas de telecomunicações em edifícios novos',
    },
    {
      diplomaId: 'dl-39-2008',
      relevancia: 'obrigatorio',
      nota: 'Regime jurídico de instalação e exploração de empreendimentos turísticos',
    },
    {
      diplomaId: 'dl-128-2014',
      relevancia: 'frequente',
      nota: 'Regime jurídico do alojamento local — aplicável para conversão para AL',
    },
    {
      diplomaId: 'nfpa-piscinas',
      relevancia: 'condicional',
      nota: 'Aplicável se houver piscinas ou instalações aquáticas no empreendimento',
    },
    {
      diplomaId: 'ascensores',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para edifícios com mais de 3 pisos acima do solo',
    },
    {
      diplomaId: 'avac',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para sistemas de climatização, ventilação e qualidade do ar interior',
    },
    {
      diplomaId: 'rece',
      relevancia: 'obrigatorio',
      nota: 'Regulamento de Desempenho Energético para Edifícios de Comércio e Serviços',
    },
    {
      diplomaId: 'regulamento-estacionamento',
      relevancia: 'obrigatorio',
      nota: 'Define requisitos de estacionamento e lugares reservados para pessoas com mobilidade reduzida',
    },
    {
      diplomaId: 'rjue-elementos',
      relevancia: 'obrigatorio',
      nota: 'Define elementos instrutórios obrigatórios para pedidos de licenciamento',
    },
    {
      diplomaId: 'rcd',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para elaboração de Plano de Prevenção e Gestão de RCD',
    },
    {
      diplomaId: 'agua-esgotos',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta sistemas prediais de distribuição de água e drenagem de águas residuais',
    },
    {
      diplomaId: 'lei-31-2009',
      relevancia: 'obrigatorio',
      nota: 'Define qualificação profissional exigível para subscrição de projectos',
    },
    {
      diplomaId: 'dl-273-2003',
      relevancia: 'obrigatorio',
      nota: 'Regulamenta requisitos de segurança estrutural e estabilidade',
    },
    {
      diplomaId: 'en-1990',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para definir as combinações de acções no cálculo estrutural',
    },
    {
      diplomaId: 'en-1991',
      relevancia: 'obrigatorio',
      nota: 'Define acções em estruturas: cargas permanentes, variáveis e acidentais',
    },
    {
      diplomaId: 'en-1992',
      relevancia: 'frequente',
      nota: 'Aplicável para cálculo de estruturas de betão armado',
    },
    {
      diplomaId: 'en-1997',
      relevancia: 'frequente',
      nota: 'Aplicável para projecto geotécnico e fundações',
    },
    {
      diplomaId: 'en-1998',
      relevancia: 'obrigatorio',
      nota: 'Obrigatório para verificação de segurança sísmica em zonas de risco',
    },
    {
      diplomaId: 'dl-118-2013-solar',
      relevancia: 'obrigatorio',
      nota: 'Obriga à instalação de sistemas solares térmicos ou fotovoltaicos em edifícios novos',
    },
    {
      diplomaId: 'portaria-73-2024',
      relevancia: 'frequente',
      nota: 'Actualiza elementos instrutórios e procedimentos de licenciamento',
    },
    {
      diplomaId: 'dl-162-2019',
      relevancia: 'condicional',
      nota: 'Aplicável se houver necessidade de ligação a redes de distribuição de energia',
    },
    {
      diplomaId: 'rgc',
      relevancia: 'obrigatorio',
      nota: 'Regulamento Geral de Construção — normas gerais de construção',
    },
    {
      diplomaId: 'snit-pdm',
      relevancia: 'obrigatorio',
      nota: 'Necessário para verificação de conformidade com instrumentos de gestão territorial',
    },
  ],

  // ─── DIPLOMAS TRANSVERSAIS (adicionados a todas as tipologias de habitação) ───
  // Nota: estes são adicionados programaticamente abaixo
};

// Adicionar diplomas transversais a tipologias relevantes
const DIPLOMAS_HABITACAO: TipologiaDiploma[] = [
  { diplomaId: 'codigo-civil', relevancia: 'frequente', nota: 'Direito de propriedade, vizinhança (distâncias, vistas), empreitada e garantia de 5 anos (Art. 1225.º)' },
  { diplomaId: 'ficha-tecnica-habitacao', relevancia: 'obrigatorio', nota: 'Ficha Técnica da Habitação obrigatória na primeira venda de imóveis para habitação' },
  { diplomaId: 'cimi-cimt', relevancia: 'condicional', nota: 'Avaliação patrimonial (VPT), taxas de IMI/IMT e benefícios fiscais em reabilitação' },
];

const DIPLOMAS_NAO_HABITACAO: TipologiaDiploma[] = [
  { diplomaId: 'codigo-civil', relevancia: 'frequente', nota: 'Direito de propriedade, relações de vizinhança, contrato de empreitada e responsabilidade civil' },
  { diplomaId: 'cimi-cimt', relevancia: 'condicional', nota: 'Avaliação patrimonial tributária e taxas de IMI aplicáveis ao imóvel' },
];

// Tipologias de habitação recebem FTH + CC + CIMI
for (const tipId of ['moradia_isolada', 'moradia_geminada', 'moradia_banda', 'multifamiliar']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(...DIPLOMAS_HABITACAO);
  }
}

// Tipologias não-habitação recebem CC + CIMI (sem FTH)
for (const tipId of ['comercio_servicos', 'equipamento', 'industrial', 'turismo']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(...DIPLOMAS_NAO_HABITACAO);
  }
}

// Reabilitação recebe tudo (FTH pode ser necessária na venda após reabilitação)
if (TIPOLOGIA_DIPLOMAS['reabilitacao']) {
  TIPOLOGIA_DIPLOMAS['reabilitacao'].push(
    { diplomaId: 'codigo-civil', relevancia: 'frequente' as const, nota: 'Garantia de 5 anos do empreiteiro (Art. 1225.º), relações de vizinhança e servidões prediais' },
    { diplomaId: 'ficha-tecnica-habitacao', relevancia: 'frequente' as const, nota: 'Necessária na venda do imóvel reabilitado para habitação' },
    { diplomaId: 'cimi-cimt', relevancia: 'frequente' as const, nota: 'Isenção de IMI/IMT em ARU (Art. 45.º EBF) — benefícios fiscais significativos para reabilitação' },
  );
}

// Portarias Simplex 2024 — transversais a todas as tipologias
const PORTARIAS_SIMPLEX: TipologiaDiploma[] = [
  { diplomaId: 'portaria-75-2024', relevancia: 'frequente', nota: 'Comunicação prévia simplificada com código de validação automático (Simplex)' },
  { diplomaId: 'portaria-71a-2024', relevancia: 'obrigatorio', nota: 'Novos modelos de termos de responsabilidade dos técnicos (obrigatórios desde março 2024)' },
  { diplomaId: 'portaria-71b-2024', relevancia: 'obrigatorio', nota: 'Livro de obra electrónico — substitui o livro de obra em papel' },
  { diplomaId: 'portaria-71c-2024', relevancia: 'frequente', nota: 'Ficha de elementos estatísticos para o INE' },
];

for (const tipId of Object.keys(TIPOLOGIA_DIPLOMAS)) {
  TIPOLOGIA_DIPLOMAS[tipId].push(...PORTARIAS_SIMPLEX);
}

// Loteamento recebe CC + CIMI
if (TIPOLOGIA_DIPLOMAS['loteamento']) {
  TIPOLOGIA_DIPLOMAS['loteamento'].push(
    { diplomaId: 'codigo-civil', relevancia: 'frequente' as const, nota: 'Servidões prediais, direito de propriedade e relações de vizinhança entre lotes' },
    { diplomaId: 'cimi-cimt', relevancia: 'condicional' as const, nota: 'Avaliação patrimonial dos lotes e taxas de IMI/IMT na transmissão' },
  );
}
