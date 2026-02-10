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

// Receptáculos postais — obrigatórios em todos os edifícios
const DIPLOMAS_RECEPTACULO_POSTAL: TipologiaDiploma[] = [
  { diplomaId: 'receptaculo-postal-dr8-90', relevancia: 'obrigatorio', nota: 'Instalação obrigatória de caixa de correio — dimensões e localização junto à entrada' },
  { diplomaId: 'receptaculo-postal-dr21-98', relevancia: 'obrigatorio', nota: 'Actualização das regras — baterias de caixas em habitação colectiva' },
];

for (const tipId of ['moradia_isolada', 'moradia_geminada', 'moradia_banda', 'multifamiliar', 'comercio_servicos', 'equipamento', 'turismo', 'reabilitacao']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(...DIPLOMAS_RECEPTACULO_POSTAL);
  }
}

// Residências de ensino superior — tipologias relevantes
const DIPLOMA_RESIDENCIAS: TipologiaDiploma = {
  diplomaId: 'residencias-ensino-superior',
  relevancia: 'condicional',
  nota: 'Aplicável apenas a residências estudantis. Define áreas mínimas, espaços comuns e acessibilidades.',
};

for (const tipId of ['multifamiliar', 'equipamento', 'reabilitacao']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(DIPLOMA_RESIDENCIAS);
  }
}

// Reabilitação — diplomas complementares específicos
if (TIPOLOGIA_DIPLOMAS['reabilitacao']) {
  TIPOLOGIA_DIPLOMAS['reabilitacao'].push(
    { diplomaId: 'portaria-301-2019', relevancia: 'obrigatorio' as const, nota: 'Acessibilidades em reabilitação — soluções alternativas quando o DL 163/2006 não é integralmente cumprível' },
    { diplomaId: 'portaria-304-2014', relevancia: 'obrigatorio' as const, nota: 'Complemento ao RERU — identifica elementos funcionais e condições mínimas de habitabilidade' },
    { diplomaId: 'fnre', relevancia: 'condicional' as const, nota: 'Fundo de financiamento para reabilitação — informação útil para clientes em ARU' },
  );
}

// DR 5/2019 Conceitos Técnicos — transversal a todas as tipologias
const DIPLOMA_CONCEITOS: TipologiaDiploma = {
  diplomaId: 'dr-5-2019',
  relevancia: 'obrigatorio',
  nota: 'Definições oficiais: área de implantação, construção, cércea, índices — referência obrigatória para interpretar PDMs',
};

for (const tipId of Object.keys(TIPOLOGIA_DIPLOMAS)) {
  TIPOLOGIA_DIPLOMAS[tipId].push(DIPLOMA_CONCEITOS);
}

// Fichas SCE e qualificação profissional — transversal a todas as tipologias
const DIPLOMAS_TRANSVERSAIS_NOVOS: TipologiaDiploma[] = [
  { diplomaId: 'portaria-349a-2013', relevancia: 'obrigatorio', nota: 'Ficha de síntese SCE obrigatória na instrução do processo de licenciamento' },
  { diplomaId: 'lei-40-2015', relevancia: 'frequente', nota: 'Qualificação dos técnicos — quem pode subscrever cada projecto' },
  { diplomaId: 'lei-75-2013', relevancia: 'condicional', nota: 'Competências das câmaras municipais em matéria de urbanismo' },
];

for (const tipId of Object.keys(TIPOLOGIA_DIPLOMAS)) {
  TIPOLOGIA_DIPLOMAS[tipId].push(...DIPLOMAS_TRANSVERSAIS_NOVOS);
}

// Portaria 349-C/2013 RECS — comércio/serviços, equipamento, turismo, industrial
const DIPLOMA_RECS: TipologiaDiploma = {
  diplomaId: 'portaria-349c-2013',
  relevancia: 'obrigatorio',
  nota: 'Requisitos energéticos para edifícios de comércio e serviços — AVAC, iluminação, ventilação',
};

for (const tipId of ['comercio_servicos', 'equipamento', 'turismo', 'industrial']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(DIPLOMA_RECS);
  }
}

// Licenciamento Zero — comércio/serviços e turismo
const DIPLOMA_LICENCIAMENTO_ZERO: TipologiaDiploma = {
  diplomaId: 'dl-48-2011',
  relevancia: 'frequente',
  nota: 'Licenciamento Zero — dispensa de licença para estabelecimentos comerciais e restauração',
};

for (const tipId of ['comercio_servicos', 'turismo']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(DIPLOMA_LICENCIAMENTO_ZERO);
  }
}

// Gás — todas as tipologias com cozinhas/aquecimento
const DIPLOMA_GAS: TipologiaDiploma = {
  diplomaId: 'dl-521-99',
  relevancia: 'frequente',
  nota: 'Regulamento base de instalações de gás — ventilação, condutas e segurança',
};

for (const tipId of ['moradia_isolada', 'moradia_geminada', 'moradia_banda', 'multifamiliar', 'comercio_servicos', 'turismo', 'reabilitacao']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(DIPLOMA_GAS);
  }
}

// Estruturas (RSA/REBAP) — todas as tipologias com projecto de estruturas
const DIPLOMAS_ESTRUTURAS_HISTORICOS: TipologiaDiploma[] = [
  { diplomaId: 'rsa', relevancia: 'condicional', nota: 'RSA — regulamento anterior aos Eurocódigos, referência para edifícios existentes' },
  { diplomaId: 'rebap', relevancia: 'condicional', nota: 'REBAP — betão armado, referência para verificação de estruturas existentes' },
];

for (const tipId of ['moradia_isolada', 'moradia_geminada', 'moradia_banda', 'multifamiliar', 'comercio_servicos', 'equipamento', 'industrial', 'reabilitacao']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(...DIPLOMAS_ESTRUTURAS_HISTORICOS);
  }
}

// TMU — todas excepto reabilitação (que pode ter isenção)
const DIPLOMA_TMU: TipologiaDiploma = {
  diplomaId: 'portaria-216e-2008',
  relevancia: 'frequente',
  nota: 'Cálculo da TMU — taxa pela realização de infraestruturas urbanísticas',
};

for (const tipId of ['moradia_isolada', 'moradia_geminada', 'moradia_banda', 'multifamiliar', 'comercio_servicos', 'equipamento', 'industrial', 'turismo', 'loteamento']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(DIPLOMA_TMU);
  }
}

// Reabilitação — diplomas adicionais
if (TIPOLOGIA_DIPLOMAS['reabilitacao']) {
  TIPOLOGIA_DIPLOMAS['reabilitacao'].push(
    { diplomaId: 'lei-32-2012', relevancia: 'frequente' as const, nota: 'Alteração ao RJRU — ARU, benefícios fiscais, instrumentos de intervenção' },
    { diplomaId: 'dl-80-2006', relevancia: 'condicional' as const, nota: 'RCCTE revogado — referência para edifícios licenciados entre 2006 e 2013' },
    { diplomaId: 'portaria-216e-2008', relevancia: 'condicional' as const, nota: 'TMU — pode haver isenção em ARU, verificar regulamento municipal' },
  );
}

// Turismo — classificação de empreendimentos
if (TIPOLOGIA_DIPLOMAS['turismo']) {
  TIPOLOGIA_DIPLOMAS['turismo'].push(
    { diplomaId: 'portaria-327-2008', relevancia: 'obrigatorio' as const, nota: 'Classificação de empreendimentos turísticos — requisitos por estrela, áreas mínimas' },
  );
}

// Radão — moradias e multifamiliar em zonas graníticas
const DIPLOMA_RADAO: TipologiaDiploma = {
  diplomaId: 'lei-108-2018',
  relevancia: 'condicional',
  nota: 'Protecção contra radão — relevante em zonas graníticas, caves e pisos térreos',
};

for (const tipId of ['moradia_isolada', 'moradia_geminada', 'moradia_banda', 'multifamiliar', 'equipamento']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(DIPLOMA_RADAO);
  }
}

// Propriedade horizontal — multifamiliar e reabilitação
for (const tipId of ['multifamiliar', 'reabilitacao']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(
      { diplomaId: 'dl-268-94', relevancia: 'frequente' as const, nota: 'Obras em fracções e partes comuns — autorização do condomínio' },
    );
  }
}

// NZEB — todos os edifícios novos
const DIPLOMA_NZEB: TipologiaDiploma = {
  diplomaId: 'dl-101d-2020-nzeb',
  relevancia: 'obrigatorio',
  nota: 'NZEB obrigatório desde 2021 — classe energética A, integração de renováveis',
};

for (const tipId of ['moradia_isolada', 'moradia_geminada', 'moradia_banda', 'multifamiliar', 'comercio_servicos', 'equipamento', 'industrial', 'turismo']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(DIPLOMA_NZEB);
  }
}

// ═══════════════════════════════════════════════════════════════
// MAPEAMENTO DOS 29 DIPLOMAS RESTANTES
// ═══════════════════════════════════════════════════════════════

// --- Acessibilidade via pública — todas as tipologias com acesso público ---
for (const tipId of ['moradia_isolada', 'moradia_geminada', 'moradia_banda', 'multifamiliar', 'comercio_servicos', 'equipamento', 'turismo', 'loteamento', 'reabilitacao']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(
      { diplomaId: 'acessibilidade-via-publica', relevancia: 'frequente' as const, nota: 'Acessibilidade na via pública — passeios, passadeiras, rampas de acesso ao edifício' },
    );
  }
}

// --- DL 101-D/2020 (alteração ao SCE) — todas as tipologias ---
for (const tipId of Object.keys(TIPOLOGIA_DIPLOMAS)) {
  TIPOLOGIA_DIPLOMAS[tipId].push(
    { diplomaId: 'dl-101-d-2020', relevancia: 'obrigatorio' as const, nota: 'Alteração ao SCE — requisitos energéticos actualizados para REH e RECS' },
  );
}

// --- DL 224/2015 (alteração SCIE) — todas as tipologias ---
for (const tipId of Object.keys(TIPOLOGIA_DIPLOMAS)) {
  TIPOLOGIA_DIPLOMAS[tipId].push(
    { diplomaId: 'dl-224-2015', relevancia: 'frequente' as const, nota: 'Alteração ao DL 220/2008 — clarificações ao regime SCIE' },
  );
}

// --- Portaria 424/2025 (instalações eléctricas) — todas com projecto eléctrico ---
for (const tipId of ['moradia_isolada', 'moradia_geminada', 'moradia_banda', 'multifamiliar', 'comercio_servicos', 'equipamento', 'industrial', 'turismo', 'reabilitacao']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(
      { diplomaId: 'portaria-424-2025', relevancia: 'frequente' as const, nota: 'Regulamentação complementar de instalações eléctricas de BT' },
    );
  }
}

// --- DL 92/2017 (gás — alteração) — tipologias com gás ---
for (const tipId of ['moradia_isolada', 'moradia_geminada', 'moradia_banda', 'multifamiliar', 'comercio_servicos', 'turismo', 'reabilitacao']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(
      { diplomaId: 'dl-92-2017', relevancia: 'frequente' as const, nota: 'Alteração ao regime de gás — actualização das regras de segurança' },
    );
  }
}

// --- Domínio público marítimo — loteamento e turismo (zona costeira) ---
for (const tipId of ['loteamento', 'turismo', 'equipamento']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(
      { diplomaId: 'dominio-publico-maritimo', relevancia: 'condicional' as const, nota: 'Domínio público marítimo — aplicável a projectos em zona costeira' },
    );
  }
}

// --- NRAU e Lei 6/2006 (arrendamento) — multifamiliar, reabilitação, comércio ---
for (const tipId of ['multifamiliar', 'reabilitacao', 'comercio_servicos']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(
      { diplomaId: 'nrau', relevancia: 'condicional' as const, nota: 'NRAU — regime de arrendamento, relevante se o imóvel vai ser arrendado' },
      { diplomaId: 'lei-6-2006', relevancia: 'condicional' as const, nota: 'NRAU versão base — tipos de contrato, duração e actualização de rendas' },
    );
  }
}

// --- Mais Habitação — habitação e reabilitação ---
for (const tipId of ['moradia_isolada', 'moradia_geminada', 'moradia_banda', 'multifamiliar', 'reabilitacao']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(
      { diplomaId: 'mais-habitacao', relevancia: 'condicional' as const, nota: 'Mais Habitação — incentivos, alterações ao RJUE e arrendamento acessível' },
    );
  }
}

// --- EOA (Estatuto OA) — transversal (exercício profissional) ---
for (const tipId of Object.keys(TIPOLOGIA_DIPLOMAS)) {
  TIPOLOGIA_DIPLOMAS[tipId].push(
    { diplomaId: 'eoa', relevancia: 'condicional' as const, nota: 'Estatuto da Ordem dos Arquitectos — direitos e deveres profissionais' },
  );
}

// --- Regime arbóreo — loteamento e equipamento ---
for (const tipId of ['loteamento', 'equipamento', 'moradia_isolada', 'moradia_geminada', 'moradia_banda']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(
      { diplomaId: 'regime-arboreo', relevancia: 'condicional' as const, nota: 'Protecção de arvoredo — abate de árvores pode exigir autorização' },
    );
  }
}

// --- Eurocódigos em falta (EC3 aço, EC5 madeira) — estruturas ---
for (const tipId of ['moradia_isolada', 'moradia_geminada', 'moradia_banda', 'multifamiliar', 'comercio_servicos', 'equipamento', 'industrial', 'reabilitacao']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(
      { diplomaId: 'en-1993', relevancia: 'condicional' as const, nota: 'Eurocódigo 3 — estruturas de aço (se aplicável)' },
      { diplomaId: 'en-1995', relevancia: 'condicional' as const, nota: 'Eurocódigo 5 — estruturas de madeira (se aplicável)' },
      { diplomaId: 'eurocod-6', relevancia: 'condicional' as const, nota: 'Eurocódigo 6 — estruturas de alvenaria (se aplicável)' },
    );
  }
}

// --- Portaria 101/96 (estaleiros) — todas com fase de obra ---
for (const tipId of Object.keys(TIPOLOGIA_DIPLOMAS)) {
  TIPOLOGIA_DIPLOMAS[tipId].push(
    { diplomaId: 'portaria-101-96', relevancia: 'frequente' as const, nota: 'Segurança em estaleiros — andaimes, trabalhos em altura, escavações' },
  );
}

// --- DL 142/2008 (RJCN — conservação da natureza) --- 
for (const tipId of ['loteamento', 'equipamento', 'moradia_isolada', 'turismo']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(
      { diplomaId: 'dl-142-2008', relevancia: 'condicional' as const, nota: 'Conservação da natureza — áreas protegidas, Rede Natura, habitats' },
    );
  }
}

// --- Lei Bases da Habitação ---
for (const tipId of ['moradia_isolada', 'moradia_geminada', 'moradia_banda', 'multifamiliar', 'reabilitacao']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(
      { diplomaId: 'lei-bases-habitacao', relevancia: 'condicional' as const, nota: 'Lei de Bases da Habitação — direito à habitação, função social da propriedade' },
    );
  }
}

// --- Autoprotecção SCIE --- 
for (const tipId of ['multifamiliar', 'comercio_servicos', 'equipamento', 'industrial', 'turismo']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(
      { diplomaId: 'dl-220-2008-autoproteccao', relevancia: 'frequente' as const, nota: 'Medidas de autoprotecção SCIE — planos de segurança, formação, simulacros' },
    );
  }
}

// --- LBPSOTU (Lei 31/2014) ---
for (const tipId of ['loteamento', 'equipamento']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(
      { diplomaId: 'lei-31-2014', relevancia: 'condicional' as const, nota: 'Lei de Bases do Solo e Ordenamento — classificação do solo, programação territorial' },
    );
  }
}

// --- DL 309/2002 (uso balnear) ---
for (const tipId of ['turismo', 'equipamento']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(
      { diplomaId: 'dl-309-2002', relevancia: 'condicional' as const, nota: 'Qualidade das águas balneares — piscinas e zonas de banho' },
    );
  }
}

// --- Rectificação receptáculo postal (informativo, ligado aos outros) ---
for (const tipId of ['multifamiliar', 'comercio_servicos', 'reabilitacao']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(
      { diplomaId: 'receptaculo-postal-retificacao-22e-98', relevancia: 'condicional' as const, nota: 'Rectificação ao DR 21/98 — leitura conjunta com os receptáculos postais' },
    );
  }
}

// --- Portaria 232/2008 (revogada, referência histórica) ---
for (const tipId of ['reabilitacao']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(
      { diplomaId: 'portaria-232-2008', relevancia: 'condicional' as const, nota: 'Elementos instrutórios (revogada) — referência para processos antigos transitados' },
    );
  }
}

// --- SCIE: Portaria 773/2009 e Lei 123/2019 ---
for (const tipId of ['multifamiliar', 'comercio_servicos', 'equipamento', 'industrial', 'turismo']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(
      { diplomaId: 'portaria-773-2009', relevancia: 'condicional' as const, nota: 'Procedimentos administrativos SCIE — registo ANPC, credenciação' },
      { diplomaId: 'lei-123-2019', relevancia: 'frequente' as const, nota: 'Alteração ao RJ-SCIE — actualizações de 2019' },
    );
  }
}

// --- Portaria 138/2005 (ascensores) --- 
for (const tipId of ['multifamiliar', 'comercio_servicos', 'equipamento', 'turismo', 'reabilitacao']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(
      { diplomaId: 'portaria-138-2005', relevancia: 'frequente' as const, nota: 'Ascensores e plataformas elevatórias — dimensões mínimas para acessibilidade' },
    );
  }
}

// --- Portaria 53/71 (higiene e segurança) ---
for (const tipId of ['industrial', 'equipamento', 'comercio_servicos']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(
      { diplomaId: 'portaria-53-71', relevancia: 'condicional' as const, nota: 'Higiene e segurança no trabalho — condições em estabelecimentos' },
    );
  }
}

// --- DL 129/2002 (RRAE versão base) --- 
for (const tipId of ['reabilitacao']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(
      { diplomaId: 'dl-129-2002', relevancia: 'condicional' as const, nota: 'RRAE versão base — referência para edifícios licenciados entre 2002 e 2008' },
    );
  }
}

// --- Portaria 420/2015 (avaliação de imóveis) ---
for (const tipId of ['moradia_isolada', 'moradia_geminada', 'moradia_banda', 'multifamiliar', 'comercio_servicos', 'reabilitacao']) {
  if (TIPOLOGIA_DIPLOMAS[tipId]) {
    TIPOLOGIA_DIPLOMAS[tipId].push(
      { diplomaId: 'portaria-420-2015', relevancia: 'condicional' as const, nota: 'Avaliação de imóveis — coeficientes VPT para cálculo de IMI' },
    );
  }
}

// --- RUEA (Açores) — condicional em todas ---
for (const tipId of Object.keys(TIPOLOGIA_DIPLOMAS)) {
  TIPOLOGIA_DIPLOMAS[tipId].push(
    { diplomaId: 'ruea', relevancia: 'condicional' as const, nota: 'Regime especial dos Açores — apenas aplicável na Região Autónoma' },
  );
}
