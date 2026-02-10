// Requisitos de Conformidade — mapeamento diploma → itens verificáveis por fase
// FA-360 Platform — v1.0

export type FaseProjeto = 'estudo_previo' | 'ante_projecto' | 'licenciamento' | 'execucao' | 'obra';
export type Criticidade = 'critico' | 'importante' | 'informativo';
export type EstadoRequisito = 'pendente' | 'conforme' | 'nao_aplicavel';

export interface Requisito {
  id: string;
  diplomaId: string;
  texto: string;
  detalhe?: string;
  fase: FaseProjeto;
  criticidade: Criticidade;
}

export interface FaseInfo {
  id: FaseProjeto;
  nome: string;
  descricao: string;
  icon: string;
  cor: string;
}

export const FASES_PROJECTO: FaseInfo[] = [
  { id: 'estudo_previo',  nome: 'Estudo Prévio',         descricao: 'Análise do terreno, PDM, condicionantes e viabilidade', icon: 'Search',    cor: 'blue' },
  { id: 'ante_projecto',  nome: 'Ante-Projecto',         descricao: 'Desenvolvimento volumétrico, funcional e regulamentar',  icon: 'PenTool',   cor: 'violet' },
  { id: 'licenciamento',  nome: 'Licenciamento',         descricao: 'Submissão, elementos instrutórios e câmara municipal',   icon: 'FileCheck', cor: 'amber' },
  { id: 'execucao',       nome: 'Projecto de Execução',  descricao: 'Especialidades, pormenorização técnica e cálculos',      icon: 'Ruler',     cor: 'emerald' },
  { id: 'obra',           nome: 'Obra',                  descricao: 'Estaleiro, coordenação, certificações e conclusão',      icon: 'HardHat',   cor: 'orange' },
];

// ═══════════════════════════════════════════════════════════════
// REQUISITOS POR DIPLOMA
// Cada diploma gera requisitos accionáveis concretos
// ═══════════════════════════════════════════════════════════════

export const REQUISITOS_POR_DIPLOMA: Record<string, Requisito[]> = {

  // ─── URBANISMO ──────────────────────────────────────
  'rjue': [
    { id: 'rjue-01', diplomaId: 'rjue', texto: 'Identificar o tipo de procedimento aplicável (licença, comunicação prévia ou isenção)', detalhe: 'Art. 4.º e Art. 6.º do RJUE — a escolha do procedimento condiciona todo o processo', fase: 'estudo_previo', criticidade: 'critico' },
    { id: 'rjue-02', diplomaId: 'rjue', texto: 'Verificar se a operação está isenta de controlo prévio', detalhe: 'Art. 6.º e 6.º-A do RJUE (ampliado pelo Simplex DL 10/2024)', fase: 'estudo_previo', criticidade: 'critico' },
    { id: 'rjue-03', diplomaId: 'rjue', texto: 'Obter Informação Prévia (PIP) se necessário', detalhe: 'Art. 14.º — recomendado em terrenos com dúvidas sobre viabilidade construtiva', fase: 'estudo_previo', criticidade: 'importante' },
    { id: 'rjue-04', diplomaId: 'rjue', texto: 'Submeter pedido de licenciamento com todos os elementos', detalhe: 'Art. 20.º — elementos instrutórios conforme portaria', fase: 'licenciamento', criticidade: 'critico' },
    { id: 'rjue-05', diplomaId: 'rjue', texto: 'Responder a notificações / pedidos de esclarecimento da câmara', detalhe: 'Art. 11.º — prazo de resposta pode condicionar o deferimento', fase: 'licenciamento', criticidade: 'critico' },
    { id: 'rjue-06', diplomaId: 'rjue', texto: 'Obter autorização de utilização após conclusão da obra', detalhe: 'Art. 62.º — necessária para ocupação legal do edifício', fase: 'obra', criticidade: 'critico' },
  ],

  'rjigt': [
    { id: 'rjigt-01', diplomaId: 'rjigt', texto: 'Consultar o PDM do município no SNIT ou geoportal municipal', detalhe: 'Verificar a planta de ordenamento e a planta de condicionantes', fase: 'estudo_previo', criticidade: 'critico' },
    { id: 'rjigt-02', diplomaId: 'rjigt', texto: 'Confirmar a classificação do solo (urbano / rústico)', detalhe: 'Art. 10.º — determina a edificabilidade do terreno', fase: 'estudo_previo', criticidade: 'critico' },
    { id: 'rjigt-03', diplomaId: 'rjigt', texto: 'Verificar qualificação do solo e categoria de espaço', detalhe: 'Solo urbano: urbanizado, de urbanização programada ou urbanização diferida', fase: 'estudo_previo', criticidade: 'critico' },
    { id: 'rjigt-04', diplomaId: 'rjigt', texto: 'Registar os parâmetros urbanísticos aplicáveis (índice utilização, cércea, imp.)', detalhe: 'Extrair do PDM: índice de utilização, índice de impermeabilização, cércea máxima, n.º de pisos', fase: 'estudo_previo', criticidade: 'critico' },
  ],

  'snit-pdm': [
    { id: 'snit-01', diplomaId: 'snit-pdm', texto: 'Consultar a planta de ordenamento no SNIT (snit.dgterritorio.gov.pt)', detalhe: 'Identificar a categoria de espaço onde o terreno se insere', fase: 'estudo_previo', criticidade: 'critico' },
    { id: 'snit-02', diplomaId: 'snit-pdm', texto: 'Consultar a planta de condicionantes no SNIT', detalhe: 'Identificar REN, RAN, servidões, domínio hídrico e outras restrições', fase: 'estudo_previo', criticidade: 'critico' },
    { id: 'snit-03', diplomaId: 'snit-pdm', texto: 'Verificar existência de Plano de Urbanização (PU) ou Plano de Pormenor (PP)', detalhe: 'PU e PP prevalecem sobre o PDM na área abrangida', fase: 'estudo_previo', criticidade: 'importante' },
  ],

  'simplex': [
    { id: 'simplex-01', diplomaId: 'simplex', texto: 'Verificar novas isenções de controlo prévio (DL 10/2024)', detalhe: 'Art. 6.º-A RJUE — lista alargada de operações isentas', fase: 'estudo_previo', criticidade: 'importante' },
    { id: 'simplex-02', diplomaId: 'simplex', texto: 'Confirmar eliminação do alvará de construção', detalhe: 'Simplex eliminou alvará — verificar se câmara já adoptou', fase: 'licenciamento', criticidade: 'informativo' },
  ],

  'rjue-elementos': [
    { id: 'elem-01', diplomaId: 'rjue-elementos', texto: 'Reunir todos os elementos instrutórios conforme Portaria 113/2015 (actualizada)', detalhe: 'Plantas, cortes, alçados, memória descritiva, termos de responsabilidade, etc.', fase: 'licenciamento', criticidade: 'critico' },
    { id: 'elem-02', diplomaId: 'rjue-elementos', texto: 'Obter termos de responsabilidade de todos os técnicos subscritores', detalhe: 'Arquitecto, engenheiro de estabilidade, SCIE, térmico, acústico, etc.', fase: 'licenciamento', criticidade: 'critico' },
    { id: 'elem-03', diplomaId: 'rjue-elementos', texto: 'Verificar se a plataforma e-Urbanismo exige formato digital específico', detalhe: 'Algumas câmaras exigem submissão exclusivamente digital', fase: 'licenciamento', criticidade: 'importante' },
  ],

  'portaria-73-2024': [
    { id: 'p73-01', diplomaId: 'portaria-73-2024', texto: 'Confirmar lista simplificada de elementos (Simplex)', detalhe: 'Portaria 73/2024 actualiza e simplifica a lista de elementos da Portaria 113/2015', fase: 'licenciamento', criticidade: 'importante' },
  ],

  // ─── EDIFICAÇÕES ──────────────────────────────────────
  'rgeu': [
    { id: 'rgeu-01', diplomaId: 'rgeu', texto: 'Verificar áreas mínimas dos compartimentos (quartos, cozinha, IS)', detalhe: 'Art. 66.º e 67.º — quartos ≥ 9m² (casal ≥ 10,5m²), cozinha ≥ 6m²', fase: 'ante_projecto', criticidade: 'critico' },
    { id: 'rgeu-02', diplomaId: 'rgeu', texto: 'Verificar pé-direito mínimo regulamentar', detalhe: 'Art. 65.º — 2,40m habitação, 3,00m comércio', fase: 'ante_projecto', criticidade: 'critico' },
    { id: 'rgeu-03', diplomaId: 'rgeu', texto: 'Verificar iluminação natural — vãos ≥ 1/8 da área do compartimento', detalhe: 'Art. 71.º — todos os compartimentos habitáveis devem ter luz natural', fase: 'ante_projecto', criticidade: 'critico' },
    { id: 'rgeu-04', diplomaId: 'rgeu', texto: 'Verificar ventilação natural dos compartimentos', detalhe: 'Art. 71.º — abertura de ventilação em todos os compartimentos habitáveis', fase: 'ante_projecto', criticidade: 'importante' },
    { id: 'rgeu-05', diplomaId: 'rgeu', texto: 'Dimensionar escadas e circulações (largura mínima)', detalhe: 'Art. 73.º — escadas ≥ 1,10m; corredores ≥ 1,10m (Art. 75.º)', fase: 'ante_projecto', criticidade: 'importante' },
  ],

  'agua-esgotos': [
    { id: 'agua-01', diplomaId: 'agua-esgotos', texto: 'Elaborar projecto de redes prediais de distribuição de água', detalhe: 'DR 23/95, Título III — dimensionamento de redes de água fria e quente', fase: 'execucao', criticidade: 'critico' },
    { id: 'agua-02', diplomaId: 'agua-esgotos', texto: 'Elaborar projecto de redes de drenagem de águas residuais', detalhe: 'DR 23/95, Título V — redes de esgotos domésticos', fase: 'execucao', criticidade: 'critico' },
    { id: 'agua-03', diplomaId: 'agua-esgotos', texto: 'Elaborar projecto de redes de drenagem de águas pluviais', detalhe: 'Dimensionamento de caleiras, tubos de queda e colectores pluviais', fase: 'execucao', criticidade: 'critico' },
  ],

  'rcd': [
    { id: 'rcd-01', diplomaId: 'rcd', texto: 'Elaborar Plano de Prevenção e Gestão de RCD (PPGRCD)', detalhe: 'DL 46/2008, Art. 2.º — obrigatório para obras com alvará', fase: 'obra', criticidade: 'critico' },
    { id: 'rcd-02', diplomaId: 'rcd', texto: 'Implementar registo de movimento de resíduos em obra', detalhe: 'Guias de transporte e destino final de RCD', fase: 'obra', criticidade: 'importante' },
  ],

  'ascensores': [
    { id: 'asc-01', diplomaId: 'ascensores', texto: 'Verificar obrigatoriedade de ascensor (> 3 pisos acima do solo)', detalhe: 'DL 320/2002 — obrigatório em edifícios com mais de 3 pisos', fase: 'ante_projecto', criticidade: 'critico' },
    { id: 'asc-02', diplomaId: 'ascensores', texto: 'Dimensionar caixa de elevador conforme normas', detalhe: 'Dimensões mínimas para elevador acessível: cabina ≥ 1,10 × 1,40m', fase: 'execucao', criticidade: 'importante' },
  ],

  // ─── ACESSIBILIDADES ──────────────────────────────────
  'acessibilidades': [
    { id: 'acess-01', diplomaId: 'acessibilidades', texto: 'Garantir percurso acessível desde a via pública até à entrada', detalhe: 'Secção 2.1 — largura livre ≥ 1,20m, piso regular e antiderrapante', fase: 'ante_projecto', criticidade: 'critico' },
    { id: 'acess-02', diplomaId: 'acessibilidades', texto: 'Dimensionar rampas de acesso (inclinação ≤ 6-8%)', detalhe: 'Secção 2.3 — comprimento máximo de lanço e patamares de descanso', fase: 'ante_projecto', criticidade: 'critico' },
    { id: 'acess-03', diplomaId: 'acessibilidades', texto: 'Prever instalação sanitária adaptada', detalhe: 'Secção 2.9 — zona de manobra ø1,50m, barras de apoio, sanita acessível', fase: 'ante_projecto', criticidade: 'critico' },
    { id: 'acess-04', diplomaId: 'acessibilidades', texto: 'Verificar largura de portas acessíveis (≥ 0,87m livre)', detalhe: 'Portas de entrada, interiores e de IS adaptada', fase: 'ante_projecto', criticidade: 'importante' },
    { id: 'acess-05', diplomaId: 'acessibilidades', texto: 'Prever estacionamento reservado para mobilidade reduzida', detalhe: 'Localização junto à entrada, dimensões alargadas (≥ 2,50 × 5,00m + faixa lateral)', fase: 'ante_projecto', criticidade: 'importante' },
  ],

  'dl-95-2019': [
    { id: 'dl95-01', diplomaId: 'dl-95-2019', texto: 'Verificar requisito de fogos adaptáveis em edifícios multifamiliares novos', detalhe: 'DL 95/2019 — percentagem de fogos adaptáveis conforme tipologia', fase: 'ante_projecto', criticidade: 'critico' },
  ],

  // ─── SEGURANÇA CONTRA INCÊNDIOS ──────────────────────
  'rj-scie': [
    { id: 'scie-01', diplomaId: 'rj-scie', texto: 'Identificar a utilização-tipo do edifício (UT I a XII)', detalhe: 'Art. 8.º — UT I (habitação), UT VII (comércio), etc.', fase: 'estudo_previo', criticidade: 'critico' },
    { id: 'scie-02', diplomaId: 'rj-scie', texto: 'Determinar a categoria de risco (1.ª a 4.ª)', detalhe: 'Art. 12.º e Anexo III — baseado em altura, efectivo, área', fase: 'estudo_previo', criticidade: 'critico' },
    { id: 'scie-03', diplomaId: 'rj-scie', texto: 'Elaborar projecto de SCIE / ficha de segurança', detalhe: 'Art. 17.º — obrigatório para 2.ª categoria ou superior; 1.ª cat. pode usar ficha', fase: 'licenciamento', criticidade: 'critico' },
  ],

  'rt-scie': [
    { id: 'rtscie-01', diplomaId: 'rt-scie', texto: 'Dimensionar vias de evacuação (largura, distância, UP)', detalhe: 'Título V — caminhos de evacuação, saídas e unidades de passagem', fase: 'execucao', criticidade: 'critico' },
    { id: 'rtscie-02', diplomaId: 'rt-scie', texto: 'Definir resistência ao fogo dos elementos estruturais', detalhe: 'Título III — REI/EI conforme categoria de risco e UT', fase: 'execucao', criticidade: 'critico' },
    { id: 'rtscie-03', diplomaId: 'rt-scie', texto: 'Especificar reacção ao fogo dos revestimentos', detalhe: 'Título III — classes de reacção ao fogo (A1 a F) para paredes, tectos e pavimentos', fase: 'execucao', criticidade: 'importante' },
    { id: 'rtscie-04', diplomaId: 'rt-scie', texto: 'Prever sistemas de detecção, alarme e extinção', detalhe: 'Título VIII — SADI, extintores, bocas de incêndio, sprinklers conforme UT/cat.', fase: 'execucao', criticidade: 'importante' },
    { id: 'rtscie-05', diplomaId: 'rt-scie', texto: 'Prever iluminação e sinalização de emergência', detalhe: 'Título VIII — blocos autónomos, sinalética fotoluminescente', fase: 'execucao', criticidade: 'importante' },
  ],

  'dl-220-2008-autoproteccao': [
    { id: 'auto-01', diplomaId: 'dl-220-2008-autoproteccao', texto: 'Definir medidas de autoprotecção exigidas', detalhe: 'Registos de segurança, plano de prevenção, plano de emergência conforme UT/cat.', fase: 'obra', criticidade: 'importante' },
  ],

  // ─── ACÚSTICA ──────────────────────────────────────
  'rrae': [
    { id: 'rrae-01', diplomaId: 'rrae', texto: 'Elaborar projecto de condicionamento acústico', detalhe: 'Verificação de DnTw, L\'nTw, D2m,nTw e LAr,nT conforme Art. 5.º', fase: 'execucao', criticidade: 'critico' },
    { id: 'rrae-02', diplomaId: 'rrae', texto: 'Verificar isolamento sonoro entre fogos (DnTw ≥ 50 dB)', detalhe: 'Quadro I do RRAE — paredes e pavimentos entre fogos', fase: 'execucao', criticidade: 'critico' },
    { id: 'rrae-03', diplomaId: 'rrae', texto: 'Verificar isolamento a ruídos de percussão (L\'nTw ≤ 60 dB)', detalhe: 'Pavimentos entre fogos — necessidade de piso flutuante ou equivalente', fase: 'execucao', criticidade: 'critico' },
    { id: 'rrae-04', diplomaId: 'rrae', texto: 'Verificar isolamento da fachada (D2m,nTw)', detalhe: 'Valor depende da classificação do local (zona sensível/mista)', fase: 'execucao', criticidade: 'importante' },
  ],

  'rgr': [
    { id: 'rgr-01', diplomaId: 'rgr', texto: 'Classificar a zona do terreno (sensível ou mista)', detalhe: 'Art. 3.º — consultar mapa de ruído municipal', fase: 'estudo_previo', criticidade: 'importante' },
    { id: 'rgr-02', diplomaId: 'rgr', texto: 'Verificar compatibilidade de uso com limites de exposição ao ruído', detalhe: 'Art. 11.º — Lden e Ln conforme zona', fase: 'estudo_previo', criticidade: 'importante' },
  ],

  // ─── DESEMPENHO ENERGÉTICO ──────────────────────────
  'sce-reh-recs': [
    { id: 'sce-01', diplomaId: 'sce-reh-recs', texto: 'Identificar a zona climática do município (inverno e verão)', detalhe: 'Portaria 349-B/2013, Tabela I.01 — I1/I2/I3 e V1/V2/V3', fase: 'execucao', criticidade: 'critico' },
    { id: 'sce-02', diplomaId: 'sce-reh-recs', texto: 'Verificar coeficientes U da envolvente (paredes, cobertura, pavimentos)', detalhe: 'Umáx por zona climática — paredes, coberturas e envidraçados', fase: 'execucao', criticidade: 'critico' },
    { id: 'sce-03', diplomaId: 'sce-reh-recs', texto: 'Calcular necessidades de aquecimento (Nic) e arrefecimento (Nvc)', detalhe: 'Verificação REH — Nic ≤ Ni e Nvc ≤ Nv', fase: 'execucao', criticidade: 'critico' },
    { id: 'sce-04', diplomaId: 'sce-reh-recs', texto: 'Obter certificado energético por perito qualificado', detalhe: 'Obrigatório para edifícios novos e existentes em venda/arrendamento', fase: 'obra', criticidade: 'critico' },
  ],

  'dl-118-2013-solar': [
    { id: 'solar-01', diplomaId: 'dl-118-2013-solar', texto: 'Dimensionar sistema solar térmico para AQS (ou alternativa)', detalhe: 'REH Art. 27.º — 50% das necessidades de AQS por renováveis se exposição adequada', fase: 'execucao', criticidade: 'critico' },
    { id: 'solar-02', diplomaId: 'dl-118-2013-solar', texto: 'Justificar alternativa se solar térmico inviável', detalhe: 'Bomba de calor, biomassa ou outra fonte renovável equivalente', fase: 'execucao', criticidade: 'importante' },
  ],

  'portaria-349b': [
    { id: 'p349b-01', diplomaId: 'portaria-349b', texto: 'Consultar valores de referência de U por zona climática', detalhe: 'Tabela I.05A — Umáx para paredes, coberturas, pavimentos e envidraçados', fase: 'execucao', criticidade: 'importante' },
  ],

  'portaria-349d-2013': [
    { id: 'p349d-01', diplomaId: 'portaria-349d-2013', texto: 'Verificar pontes térmicas lineares na envolvente', detalhe: 'Pontes térmicas planas e lineares — ψ linear conforme tipo de ligação', fase: 'execucao', criticidade: 'importante' },
  ],

  'dl-162-2019': [
    { id: 'auto-e-01', diplomaId: 'dl-162-2019', texto: 'Avaliar viabilidade de painéis fotovoltaicos em autoconsumo', detalhe: 'DL 162/2019 — regime de autoconsumo individual ou colectivo', fase: 'execucao', criticidade: 'informativo' },
  ],

  // ─── INSTALAÇÕES ELÉCTRICAS ──────────────────────────
  'rtiebt': [
    { id: 'rtiebt-01', diplomaId: 'rtiebt', texto: 'Elaborar projecto de instalações eléctricas (RTIEBT)', detalhe: 'Dimensionamento de circuitos, quadros, protecções diferenciais e disjuntores', fase: 'execucao', criticidade: 'critico' },
    { id: 'rtiebt-02', diplomaId: 'rtiebt', texto: 'Dimensionar protecções em zonas especiais (casas de banho)', detalhe: 'Parte 7 — zonas de protecção 0, 1 e 2 em instalações sanitárias', fase: 'execucao', criticidade: 'importante' },
  ],

  'dl-96-2017': [
    { id: 'dl96-01', diplomaId: 'dl-96-2017', texto: 'Obter certificação da instalação eléctrica por entidade inspectora', detalhe: 'Inspecção obrigatória antes da ligação à rede', fase: 'obra', criticidade: 'critico' },
  ],

  'rece': [
    { id: 'rece-01', diplomaId: 'rece', texto: 'Prever pré-instalação de pontos de carregamento de veículos eléctricos', detalhe: 'Obrigatório em edifícios novos com estacionamento — tubagem e potência reservada', fase: 'execucao', criticidade: 'importante' },
  ],

  // ─── GÁS ──────────────────────────────────────
  'dl-97-2017': [
    { id: 'gas-01', diplomaId: 'dl-97-2017', texto: 'Elaborar projecto de instalação de gás (se aplicável)', detalhe: 'DL 97/2017 — gás natural ou GPL canalizado', fase: 'execucao', criticidade: 'importante' },
    { id: 'gas-02', diplomaId: 'dl-97-2017', texto: 'Verificar ventilação adequada para aparelhos a gás', detalhe: 'Ventilação natural obrigatória em compartimentos com aparelhos a gás', fase: 'execucao', criticidade: 'critico' },
  ],

  // ─── TELECOMUNICAÇÕES ──────────────────────────────
  'ited': [
    { id: 'ited-01', diplomaId: 'ited', texto: 'Elaborar projecto ITED (obrigatório em edifícios novos)', detalhe: 'DL 123/2009 — armário de telecomunicações (ATE), tubagens e cablagem', fase: 'execucao', criticidade: 'critico' },
    { id: 'ited-02', diplomaId: 'ited', texto: 'Prever ITUR em operações de loteamento', detalhe: 'Art. 23.º — infraestruturas de telecomunicações em urbanizações', fase: 'execucao', criticidade: 'importante' },
  ],

  // ─── CONDICIONANTES TERRITORIAIS ──────────────────────
  'ren': [
    { id: 'ren-01', diplomaId: 'ren', texto: 'Verificar se o terreno tem sobreposição com REN', detalhe: 'Consultar na planta de condicionantes do PDM ou no SNIT', fase: 'estudo_previo', criticidade: 'critico' },
    { id: 'ren-02', diplomaId: 'ren', texto: 'Se em REN: verificar usos compatíveis ou pedir autorização', detalhe: 'Art. 20.º e 22.º — acções permitidas e processo de autorização', fase: 'estudo_previo', criticidade: 'critico' },
  ],

  'ran': [
    { id: 'ran-01', diplomaId: 'ran', texto: 'Verificar se o terreno tem sobreposição com RAN', detalhe: 'Terrenos em RAN: construção proibida salvo excepções (Art. 21.º)', fase: 'estudo_previo', criticidade: 'critico' },
    { id: 'ran-02', diplomaId: 'ran', texto: 'Se em RAN: avaliar viabilidade de desanexação', detalhe: 'Art. 23.º — procedimento junto da DRAP', fase: 'estudo_previo', criticidade: 'critico' },
  ],

  'lei-agua': [
    { id: 'agua-h-01', diplomaId: 'lei-agua', texto: 'Identificar linhas de água e domínio público hídrico', detalhe: 'Faixas non aedificandi junto a cursos de água — parecer da APA', fase: 'estudo_previo', criticidade: 'importante' },
  ],

  'servidoes': [
    { id: 'serv-01', diplomaId: 'servidoes', texto: 'Identificar servidões administrativas que afectam o terreno', detalhe: 'Rodoviárias, ferroviárias, de alta tensão, militares, aeronáuticas, gasodutos', fase: 'estudo_previo', criticidade: 'critico' },
    { id: 'serv-02', diplomaId: 'servidoes', texto: 'Verificar faixas de protecção de estradas nacionais/municipais', detalhe: 'Servidão rodoviária — distâncias mínimas ao eixo da via', fase: 'estudo_previo', criticidade: 'importante' },
  ],

  'patrimonio': [
    { id: 'pat-01', diplomaId: 'patrimonio', texto: 'Verificar se existem imóveis classificados num raio de 50m', detalhe: 'Art. 43.º LBPC — zona de protecção automática de 50m', fase: 'estudo_previo', criticidade: 'critico' },
    { id: 'pat-02', diplomaId: 'patrimonio', texto: 'Se em zona de protecção: obter parecer da DGPC/DRC', detalhe: 'Art. 45.º — parecer vinculativo para obras em zona de monumento classificado', fase: 'licenciamento', criticidade: 'critico' },
  ],

  'dl-151b-2013': [
    { id: 'aia-01', diplomaId: 'dl-151b-2013', texto: 'Verificar se o projecto está sujeito a AIA', detalhe: 'Anexo I e II — loteamentos de grande dimensão, industria, infraestruturas', fase: 'estudo_previo', criticidade: 'importante' },
  ],

  'dl-142-2008': [
    { id: 'nat-01', diplomaId: 'dl-142-2008', texto: 'Verificar se o terreno está em área protegida ou Natura 2000', detalhe: 'Parques nacionais, reservas naturais, ZEC, ZPE — parecer ICNF obrigatório', fase: 'estudo_previo', criticidade: 'critico' },
  ],

  'regime-arboreo': [
    { id: 'arb-01', diplomaId: 'regime-arboreo', texto: 'Verificar existência de sobreiros ou azinheiras no terreno', detalhe: 'Abate proibido sem autorização ICNF — medidas compensatórias obrigatórias', fase: 'estudo_previo', criticidade: 'importante' },
  ],

  // ─── SEGURANÇA ESTRUTURAL ──────────────────────────
  'en-1990': [
    { id: 'ec0-01', diplomaId: 'en-1990', texto: 'Definir combinações de acções para cálculo estrutural', detalhe: 'Anexo A1 — ELU e ELS com coeficientes parciais de segurança', fase: 'execucao', criticidade: 'critico' },
  ],

  'en-1991': [
    { id: 'ec1-01', diplomaId: 'en-1991', texto: 'Definir sobrecargas de utilização conforme uso', detalhe: 'Parte 1-1 — habitação: 2,0 kN/m², escritórios: 3,0 kN/m², comércio: 4,0 kN/m²', fase: 'execucao', criticidade: 'critico' },
  ],

  'en-1992': [
    { id: 'ec2-01', diplomaId: 'en-1992', texto: 'Elaborar projecto de estabilidade em betão armado', detalhe: 'Dimensionamento de fundações, pilares, vigas e lajes conforme EN 1992', fase: 'execucao', criticidade: 'critico' },
  ],

  'en-1997': [
    { id: 'ec7-01', diplomaId: 'en-1997', texto: 'Realizar estudo geotécnico / sondagens do terreno', detalhe: 'Ensaios SPT, CPT — categoria geotécnica e tipo de fundação', fase: 'execucao', criticidade: 'critico' },
    { id: 'ec7-02', diplomaId: 'en-1997', texto: 'Dimensionar fundações conforme condições do solo', detalhe: 'Sapatas, estacas ou pegões — capacidade de carga e assentamentos', fase: 'execucao', criticidade: 'critico' },
  ],

  'en-1998': [
    { id: 'ec8-01', diplomaId: 'en-1998', texto: 'Verificar zonação sísmica do local e espectro de resposta', detalhe: 'Anexo NA — zonas sísmicas de Portugal (acção tipo 1 e tipo 2)', fase: 'execucao', criticidade: 'critico' },
    { id: 'ec8-02', diplomaId: 'en-1998', texto: 'Garantir ductilidade adequada da estrutura', detalhe: 'Regras de ductilidade para betão armado em zona sísmica', fase: 'execucao', criticidade: 'critico' },
  ],

  // ─── SEGURANÇA EM ESTALEIROS ──────────────────────────
  'dl-273-2003': [
    { id: 'est-01', diplomaId: 'dl-273-2003', texto: 'Elaborar Plano de Segurança e Saúde (PSS)', detalhe: 'Art. 11.º — obrigatório, elaborado em fase de projecto e desenvolvido em obra', fase: 'obra', criticidade: 'critico' },
    { id: 'est-02', diplomaId: 'dl-273-2003', texto: 'Designar coordenador de segurança em projecto e em obra', detalhe: 'Art. 9.º e 10.º — responsável pela coordenação de segurança', fase: 'execucao', criticidade: 'critico' },
    { id: 'est-03', diplomaId: 'dl-273-2003', texto: 'Efectuar comunicação prévia à ACT', detalhe: 'Obrigatória antes do início da obra — formulário ACT', fase: 'obra', criticidade: 'critico' },
    { id: 'est-04', diplomaId: 'dl-273-2003', texto: 'Elaborar compilação técnica da obra', detalhe: 'Art. 16.º — dossier com toda a informação relevante para futuras intervenções', fase: 'obra', criticidade: 'importante' },
  ],

  // ─── HABITAÇÃO ──────────────────────────────────────
  'propriedade-horizontal': [
    { id: 'ph-01', diplomaId: 'propriedade-horizontal', texto: 'Prever constituição de propriedade horizontal (fracções autónomas)', detalhe: 'Art. 1415.º CC — cada fracção deve ser independente e autónoma', fase: 'ante_projecto', criticidade: 'importante' },
  ],

  'nrau': [
    { id: 'nrau-01', diplomaId: 'nrau', texto: 'Verificar enquadramento no regime de arrendamento (se aplicável)', detalhe: 'NRAU — tipos de contrato, rendas e obrigações do senhorio', fase: 'estudo_previo', criticidade: 'informativo' },
  ],

  // ─── REABILITAÇÃO ──────────────────────────────────
  'reru': [
    { id: 'reru-01', diplomaId: 'reru', texto: 'Verificar elegibilidade para regime excepcional RERU', detalhe: 'Art. 2.º — edifícios >30 anos ou em ARU', fase: 'estudo_previo', criticidade: 'critico' },
    { id: 'reru-02', diplomaId: 'reru', texto: 'Identificar dispensas de requisitos aplicáveis', detalhe: 'Art. 3.º — dispensa de RGEU, acústica, térmica, acessibilidades', fase: 'licenciamento', criticidade: 'critico' },
  ],

  'rjru': [
    { id: 'rjru-01', diplomaId: 'rjru', texto: 'Verificar se o imóvel está em Área de Reabilitação Urbana (ARU)', detalhe: 'Art. 2.º — benefícios fiscais e incentivos em ARU', fase: 'estudo_previo', criticidade: 'importante' },
    { id: 'rjru-02', diplomaId: 'rjru', texto: 'Requerer benefícios fiscais (IVA 6%, isenção IMI/IMT)', detalhe: 'Art. 44.º — incentivos para obras de reabilitação em ARU', fase: 'licenciamento', criticidade: 'importante' },
  ],

  // ─── TURISMO ──────────────────────────────────────
  'dl-39-2008': [
    { id: 'tur-01', diplomaId: 'dl-39-2008', texto: 'Classificar a tipologia do empreendimento turístico', detalhe: 'Art. 2.º — hotel, aparthotel, aldeamento, turismo de habitação, etc.', fase: 'estudo_previo', criticidade: 'critico' },
    { id: 'tur-02', diplomaId: 'dl-39-2008', texto: 'Verificar requisitos específicos da classificação (estrelas)', detalhe: 'Art. 6.º — áreas mínimas, equipamentos e serviços por categoria', fase: 'ante_projecto', criticidade: 'critico' },
  ],

  'dl-128-2014': [
    { id: 'al-01', diplomaId: 'dl-128-2014', texto: 'Registar estabelecimento de alojamento local na câmara', detalhe: 'Art. 12.º — registo obrigatório antes do início da exploração', fase: 'obra', criticidade: 'critico' },
    { id: 'al-02', diplomaId: 'dl-128-2014', texto: 'Verificar se a localização está em zona de contenção', detalhe: 'Algumas câmaras municipais limitam novos registos de AL em certas zonas', fase: 'estudo_previo', criticidade: 'importante' },
  ],

  // ─── LOTEAMENTO ──────────────────────────────────────
  'dl-555-cedencias': [
    { id: 'ced-01', diplomaId: 'dl-555-cedencias', texto: 'Calcular áreas de cedência para espaços verdes e equipamentos', detalhe: 'Art. 43.º e 44.º RJUE — parâmetros de cedência conforme PDM', fase: 'ante_projecto', criticidade: 'critico' },
    { id: 'ced-02', diplomaId: 'dl-555-cedencias', texto: 'Verificar compensações urbanísticas se não houver cedência efectiva', detalhe: 'Art. 44.º-A — Taxa Municipal de Urbanização (TMU)', fase: 'licenciamento', criticidade: 'importante' },
  ],

  'regulamento-estacionamento': [
    { id: 'est-park-01', diplomaId: 'regulamento-estacionamento', texto: 'Dimensionar estacionamento conforme PDM (n.º de lugares por fogo/m²)', detalhe: 'Habitação: geralmente 1 lugar/fogo; comércio: ~1/50m²', fase: 'ante_projecto', criticidade: 'critico' },
    { id: 'est-park-02', diplomaId: 'regulamento-estacionamento', texto: 'Prever lugares reservados para mobilidade reduzida', detalhe: 'Mínimo obrigatório conforme DL 163/2006', fase: 'ante_projecto', criticidade: 'importante' },
  ],

  // ─── PROFISSÃO ──────────────────────────────────────
  'lei-31-2009': [
    { id: 'prof-01', diplomaId: 'lei-31-2009', texto: 'Verificar qualificação profissional do projectista para a categoria da obra', detalhe: 'Art. 2.º e 4.º — categorias I a IV e habilitações exigidas', fase: 'licenciamento', criticidade: 'critico' },
  ],

  'avac': [
    { id: 'avac-01', diplomaId: 'avac', texto: 'Verificar caudais mínimos de ar novo para o edifício', detalhe: 'Portaria 353-A/2013 — caudais por pessoa ou por m² conforme actividade', fase: 'execucao', criticidade: 'importante' },
  ],

  // ─── CÓDIGO CIVIL ──────────────────────────────────────
  'codigo-civil': [
    { id: 'cc-01', diplomaId: 'codigo-civil', texto: 'Verificar distâncias mínimas de janelas e vistas ao limite da propriedade', detalhe: 'Art. 1360.º — distância mínima de 1,50m para janelas, portas, varandas e terraços com vista directa', fase: 'ante_projecto', criticidade: 'critico' },
    { id: 'cc-02', diplomaId: 'codigo-civil', texto: 'Verificar servidões prediais existentes (passagem, vistas, águas)', detalhe: 'Art. 1543.º a 1575.º — servidões podem condicionar o projecto', fase: 'estudo_previo', criticidade: 'importante' },
    { id: 'cc-03', diplomaId: 'codigo-civil', texto: 'Incluir cláusulas de garantia de 5 anos no contrato de empreitada', detalhe: 'Art. 1225.º — responsabilidade do empreiteiro por defeitos durante 5 anos após entrega', fase: 'obra', criticidade: 'importante' },
  ],

  // ─── FICHA TÉCNICA DA HABITAÇÃO ──────────────────────────
  'ficha-tecnica-habitacao': [
    { id: 'fth-01', diplomaId: 'ficha-tecnica-habitacao', texto: 'Elaborar Ficha Técnica da Habitação (FTH) antes da venda', detalhe: 'DL 68/2004 — obrigatória na primeira transmissão de imóveis para habitação', fase: 'obra', criticidade: 'critico' },
    { id: 'fth-02', diplomaId: 'ficha-tecnica-habitacao', texto: 'Incluir na FTH: materiais, sistemas construtivos, instalações e acabamentos', detalhe: 'Modelo aprovado pela Portaria 817/2004 — descrição completa do imóvel', fase: 'obra', criticidade: 'importante' },
  ],

  // ─── PORTARIAS SIMPLEX 2024 ──────────────────────────────
  'portaria-75-2024': [
    { id: 'p75-01', diplomaId: 'portaria-75-2024', texto: 'Verificar se o projecto é elegível para comunicação prévia com código de validação', detalhe: 'Portaria 75/2024 — submissão na plataforma electrónica com validação automática', fase: 'licenciamento', criticidade: 'importante' },
  ],

  'portaria-71a-2024': [
    { id: 'p71a-01', diplomaId: 'portaria-71a-2024', texto: 'Utilizar os novos modelos de termos de responsabilidade (Simplex)', detalhe: 'Portaria 71-A/2024 — modelos actualizados para projectistas e directores de obra', fase: 'licenciamento', criticidade: 'critico' },
  ],

  'portaria-71b-2024': [
    { id: 'p71b-01', diplomaId: 'portaria-71b-2024', texto: 'Preencher o livro de obra em formato electrónico na plataforma', detalhe: 'Portaria 71-B/2024 — substitui o livro de obra em papel', fase: 'obra', criticidade: 'critico' },
  ],

  'portaria-71c-2024': [
    { id: 'p71c-01', diplomaId: 'portaria-71c-2024', texto: 'Preencher a ficha de elementos estatísticos (INE)', detalhe: 'Portaria 71-C/2024 — dados estatísticos obrigatórios sobre a operação urbanística', fase: 'licenciamento', criticidade: 'importante' },
  ],

  // ─── CÓDIGO DO IMI/IMT ──────────────────────────────────
  'cimi-cimt': [
    { id: 'cimi-01', diplomaId: 'cimi-cimt', texto: 'Verificar benefícios fiscais de IMI/IMT em reabilitação urbana (ARU)', detalhe: 'Art. 45.º EBF — isenção de IMI (3-5 anos) e IMT para imóveis reabilitados em ARU', fase: 'estudo_previo', criticidade: 'informativo' },
  ],

  // ═══════════════════════════════════════════════════════════════
  // DIPLOMAS ADICIONADOS — expansão de cobertura
  // ═══════════════════════════════════════════════════════════════

  // ─── URBANISMO (complementos) ──────────────────────────
  'ruea': [
    { id: 'ruea-01', diplomaId: 'ruea', texto: 'Verificar aplicabilidade do RUEA (Açores) ao projecto', detalhe: 'Regime urbanístico específico da Região Autónoma dos Açores', fase: 'estudo_previo', criticidade: 'importante' },
  ],

  'dl-48-2011': [
    { id: 'dl48-01', diplomaId: 'dl-48-2011', texto: 'Verificar se a actividade está isenta de licenciamento (Licenciamento Zero)', detalhe: 'DL 48/2011 — isenta certas actividades económicas de licenciamento municipal', fase: 'estudo_previo', criticidade: 'importante' },
    { id: 'dl48-02', diplomaId: 'dl-48-2011', texto: 'Confirmar se basta mera comunicação prévia para a ocupação do espaço público', detalhe: 'Art. 3.º — regime simplificado para esplanadas, toldos, vitrinas, etc.', fase: 'licenciamento', criticidade: 'informativo' },
  ],

  'augi': [
    { id: 'augi-01', diplomaId: 'augi', texto: 'Verificar se o terreno está em área AUGI (área urbana de génese ilegal)', detalhe: 'Lei 91/95 — regime especial para reconversão urbanística', fase: 'estudo_previo', criticidade: 'critico' },
    { id: 'augi-02', diplomaId: 'augi', texto: 'Identificar obrigações de reconversão e infra-estruturação', detalhe: 'Comissão de administração conjunta, projecto de reconversão', fase: 'licenciamento', criticidade: 'importante' },
  ],

  'lei-31-2014': [
    { id: 'lei31-14-01', diplomaId: 'lei-31-2014', texto: 'Enquadrar a operação na Lei de Bases da Política de Solos', detalhe: 'Lei 31/2014 — princípios gerais de uso do solo e direitos dos proprietários', fase: 'estudo_previo', criticidade: 'informativo' },
  ],

  'mais-habitacao': [
    { id: 'mh-01', diplomaId: 'mais-habitacao', texto: 'Verificar benefícios do programa Mais Habitação', detalhe: 'Lei 56/2023 — conversão de comércio para habitação, IVA 6%, licenciamento simplificado', fase: 'estudo_previo', criticidade: 'importante' },
    { id: 'mh-02', diplomaId: 'mais-habitacao', texto: 'Confirmar se a conversão de uso para habitação é elegível', detalhe: 'Art. 4.º — isenção de taxas para conversão de comércios/serviços em habitação', fase: 'licenciamento', criticidade: 'importante' },
  ],

  'lei-75-2013': [
    { id: 'lei75-01', diplomaId: 'lei-75-2013', texto: 'Confirmar competências da câmara municipal na operação urbanística', detalhe: 'Art. 33.º — competências próprias das câmaras em matéria de urbanismo', fase: 'licenciamento', criticidade: 'informativo' },
  ],

  'portaria-216e-2008': [
    { id: 'p216e-01', diplomaId: 'portaria-216e-2008', texto: 'Verificar cálculo da TMU aplicável ao projecto', detalhe: 'Portaria 216-E/2008 — parâmetros para cálculo de taxas municipais de urbanização', fase: 'licenciamento', criticidade: 'importante' },
  ],

  // ─── EDIFICAÇÕES (complementos) ──────────────────────────
  'acessibilidade-via-publica': [
    { id: 'avp-01', diplomaId: 'acessibilidade-via-publica', texto: 'Garantir acessibilidade na via pública adjacente ao projecto', detalhe: 'PNPA — Plano Nacional de Promoção da Acessibilidade, alinhado com DL 163/2006', fase: 'ante_projecto', criticidade: 'importante' },
  ],

  'portaria-138-2005': [
    { id: 'p138-01', diplomaId: 'portaria-138-2005', texto: 'Verificar obrigatoriedade de ascensor e monta-cargas conforme uso', detalhe: 'Portaria 138/2005 — especificações técnicas de elevadores em edifícios', fase: 'ante_projecto', criticidade: 'importante' },
    { id: 'p138-02', diplomaId: 'portaria-138-2005', texto: 'Dimensionar cabina de elevador para acessibilidade (≥ 1,10 × 1,40m)', detalhe: 'Requisitos de dimensões mínimas para utilização por PMR', fase: 'execucao', criticidade: 'importante' },
  ],

  'dl-309-2002': [
    { id: 'dl309-01', diplomaId: 'dl-309-2002', texto: 'Verificar requisitos de segurança para piscinas (se aplicável)', detalhe: 'DL 309/2002 — instalação e funcionamento de recintos com diversões aquáticas', fase: 'ante_projecto', criticidade: 'importante' },
    { id: 'dl309-02', diplomaId: 'dl-309-2002', texto: 'Prever vedações, sinalética e equipamentos de segurança', detalhe: 'Vedação perimetral, profundidades, sistema de filtragem e desinfecção', fase: 'execucao', criticidade: 'importante' },
  ],

  'dl-267-2002': [
    { id: 'dl267-01', diplomaId: 'dl-267-2002', texto: 'Verificar requisitos de instalação de equipamentos sob pressão (gás)', detalhe: 'DL 267/2002 — redes e ramais de gás, equipamentos de queima e ventilação', fase: 'execucao', criticidade: 'importante' },
  ],

  'nfpa-piscinas': [
    { id: 'nfpa-01', diplomaId: 'nfpa-piscinas', texto: 'Aplicar normas NFPA para piscinas (se projecto inclui piscina)', detalhe: 'NFPA 303 — protecção contra incêndio e segurança em instalações aquáticas', fase: 'execucao', criticidade: 'informativo' },
  ],

  'residencias-ensino-superior': [
    { id: 'res-01', diplomaId: 'residencias-ensino-superior', texto: 'Verificar requisitos específicos para residências de estudantes', detalhe: 'Regime aplicável a residências para ensino superior — áreas mínimas, acessibilidade', fase: 'ante_projecto', criticidade: 'importante' },
  ],

  'receptaculo-postal-dr8-90': [
    { id: 'rp1-01', diplomaId: 'receptaculo-postal-dr8-90', texto: 'Prever receptáculos postais conforme regulamento', detalhe: 'DR 8/90 — caixa de correio obrigatória por fogo, localização acessível', fase: 'execucao', criticidade: 'informativo' },
  ],

  'receptaculo-postal-dr21-98': [
    { id: 'rp2-01', diplomaId: 'receptaculo-postal-dr21-98', texto: 'Verificar alterações ao regulamento de receptáculos postais', detalhe: 'DR 21/98 — actualização de especificações de caixas de correio', fase: 'execucao', criticidade: 'informativo' },
  ],

  'receptaculo-postal-retificacao-22e-98': [
    { id: 'rp3-01', diplomaId: 'receptaculo-postal-retificacao-22e-98', texto: 'Confirmar rectificações ao regulamento de receptáculos postais', detalhe: 'DR 22-E/98 — rectificação de especificações', fase: 'execucao', criticidade: 'informativo' },
  ],

  'rgc': [
    { id: 'rgc-01', diplomaId: 'rgc', texto: 'Aplicar normas gerais de construção nas soluções construtivas', detalhe: 'Regulamento Geral das Construções — boas práticas construtivas', fase: 'execucao', criticidade: 'informativo' },
  ],

  // ─── SEGURANÇA CONTRA INCÊNDIOS (complementos) ──────────
  'dl-224-2015': [
    { id: 'dl224-01', diplomaId: 'dl-224-2015', texto: 'Verificar alterações ao RJ-SCIE introduzidas em 2015', detalhe: 'DL 224/2015 — actualização de utilizações-tipo e categorias de risco', fase: 'estudo_previo', criticidade: 'importante' },
  ],

  'portaria-773-2009': [
    { id: 'p773-01', diplomaId: 'portaria-773-2009', texto: 'Seguir procedimentos de certificação SCIE conforme portaria', detalhe: 'Portaria 773/2009 — procedimentos administrativos de SCIE na ANEPC', fase: 'licenciamento', criticidade: 'importante' },
  ],

  'lei-123-2019': [
    { id: 'lei123-01', diplomaId: 'lei-123-2019', texto: 'Verificar alterações à legislação SCIE de 2019', detalhe: 'Lei 123/2019 — alterações ao DL 220/2008 (SCIE)', fase: 'licenciamento', criticidade: 'informativo' },
  ],

  // ─── DESEMPENHO ENERGÉTICO (complementos) ──────────────
  'dl-101-d-2020': [
    { id: 'dl101d-01', diplomaId: 'dl-101-d-2020', texto: 'Verificar alterações ao SCE introduzidas em 2020', detalhe: 'DL 101-D/2020 — actualização do sistema de certificação energética', fase: 'execucao', criticidade: 'importante' },
  ],

  'dl-101d-2020-nzeb': [
    { id: 'nzeb-01', diplomaId: 'dl-101d-2020-nzeb', texto: 'Verificar requisitos NZEB para edifícios novos', detalhe: 'Edifícios de necessidades quase nulas de energia — obrigatório desde 2021', fase: 'ante_projecto', criticidade: 'critico' },
    { id: 'nzeb-02', diplomaId: 'dl-101d-2020-nzeb', texto: 'Garantir contribuição mínima de energias renováveis', detalhe: 'Solar térmico/fotovoltaico/bomba de calor — cumprir quota renovável', fase: 'execucao', criticidade: 'critico' },
  ],

  'dl-80-2006': [
    { id: 'dl80-01', diplomaId: 'dl-80-2006', texto: 'Verificar se a referência ao RCCTE ainda se aplica (diploma revogado)', detalhe: 'DL 80/2006 (RCCTE) revogado pelo DL 118/2013 — usar REH/RECS actualizado', fase: 'execucao', criticidade: 'informativo' },
  ],

  'portaria-349a-2013': [
    { id: 'p349a-01', diplomaId: 'portaria-349a-2013', texto: 'Preencher ficha de síntese SCE para o edifício', detalhe: 'Portaria 349-A/2013 — elementos do SCE para edifícios de habitação e serviços', fase: 'execucao', criticidade: 'critico' },
    { id: 'p349a-02', diplomaId: 'portaria-349a-2013', texto: 'Validar dados climáticos e parâmetros térmicos por localização', detalhe: 'Graus-dia, temperatura exterior, radiação solar — conforme município', fase: 'execucao', criticidade: 'importante' },
  ],

  'portaria-349c-2013': [
    { id: 'p349c-01', diplomaId: 'portaria-349c-2013', texto: 'Verificar requisitos RECS para edifícios de comércio e serviços', detalhe: 'Portaria 349-C/2013 — elementos técnicos do RECS', fase: 'execucao', criticidade: 'critico' },
    { id: 'p349c-02', diplomaId: 'portaria-349c-2013', texto: 'Verificar qualidade do ar interior e ventilação em serviços', detalhe: 'Caudais mínimos de ar novo por tipo de espaço', fase: 'execucao', criticidade: 'importante' },
  ],

  'portaria-232-2008': [
    { id: 'p232-01', diplomaId: 'portaria-232-2008', texto: 'Verificar elementos instrutórios específicos de eficiência energética', detalhe: 'Portaria 232/2008 — elementos de demonstração de conformidade energética', fase: 'licenciamento', criticidade: 'importante' },
  ],

  'fnre': [
    { id: 'fnre-01', diplomaId: 'fnre', texto: 'Verificar enquadramento no Fundo Nacional de Reabilitação do Edificado', detalhe: 'FNRE — financiamento para reabilitação de imóveis públicos e privados', fase: 'estudo_previo', criticidade: 'informativo' },
  ],

  // ─── INSTALAÇÕES DE GÁS (complementos) ──────────────
  'dl-521-99': [
    { id: 'dl521-01', diplomaId: 'dl-521-99', texto: 'Elaborar projecto de rede de gás (se edifício com gás natural/GPL)', detalhe: 'DL 521/99 — projecto obrigatório para instalações de gás em edifícios', fase: 'execucao', criticidade: 'critico' },
    { id: 'dl521-02', diplomaId: 'dl-521-99', texto: 'Garantir ventilação e exaustão adequada para aparelhos a gás', detalhe: 'Aberturas de ventilação permanente e evacuação de gases de combustão', fase: 'execucao', criticidade: 'critico' },
  ],

  'portaria-424-2025': [
    { id: 'p424-01', diplomaId: 'portaria-424-2025', texto: 'Verificar novos requisitos regulamentares de gás (2025)', detalhe: 'Portaria 424/2025 — actualização de requisitos para instalações de gás', fase: 'execucao', criticidade: 'importante' },
  ],

  // ─── TELECOMUNICAÇÕES (complementos) ──────────────
  'dl-92-2017': [
    { id: 'dl92-01', diplomaId: 'dl-92-2017', texto: 'Verificar alterações ao regime ITED/ITUR (2017)', detalhe: 'DL 92/2017 — actualização de requisitos de telecomunicações em edifícios', fase: 'execucao', criticidade: 'informativo' },
  ],

  // ─── CONDICIONANTES TERRITORIAIS (complementos) ──────────
  'dominio-publico-maritimo': [
    { id: 'dpm-01', diplomaId: 'dominio-publico-maritimo', texto: 'Verificar se o terreno está em domínio público marítimo', detalhe: 'Faixa de 50m a partir da linha de máxima preia-mar — construção proibida', fase: 'estudo_previo', criticidade: 'critico' },
    { id: 'dpm-02', diplomaId: 'dominio-publico-maritimo', texto: 'Obter parecer da APA/capitania se junto à orla costeira', detalhe: 'Parecer obrigatório para obras em zona de domínio público hídrico', fase: 'licenciamento', criticidade: 'critico' },
  ],

  // ─── SEGURANÇA ESTRUTURAL (complementos) ──────────────
  'rsa': [
    { id: 'rsa-01', diplomaId: 'rsa', texto: 'Verificar acções regulamentares (RSA) ainda aplicáveis', detalhe: 'DL 235/83 — acções em edifícios e pontes; vento e sismo parcialmente substituídos pelos Eurocódigos', fase: 'execucao', criticidade: 'importante' },
  ],

  'rebap': [
    { id: 'rebap-01', diplomaId: 'rebap', texto: 'Consultar REBAP para referências em projectos existentes', detalhe: 'DL 349-C/83 — betão armado e pré-esforçado; substituído pelo EC2 em projectos novos', fase: 'execucao', criticidade: 'informativo' },
  ],

  'en-1993': [
    { id: 'ec3-01', diplomaId: 'en-1993', texto: 'Elaborar projecto de estruturas metálicas conforme Eurocódigo 3', detalhe: 'EN 1993 — dimensionamento de elementos em aço (vigas, pilares, ligações)', fase: 'execucao', criticidade: 'critico' },
  ],

  'en-1995': [
    { id: 'ec5-01', diplomaId: 'en-1995', texto: 'Elaborar projecto de estruturas de madeira conforme Eurocódigo 5', detalhe: 'EN 1995 — dimensionamento de elementos em madeira (vigas, coberturas, pavimentos)', fase: 'execucao', criticidade: 'critico' },
  ],

  'eurocod-6': [
    { id: 'ec6-01', diplomaId: 'eurocod-6', texto: 'Verificar requisitos para alvenaria estrutural conforme Eurocódigo 6', detalhe: 'EN 1996 — dimensionamento de alvenaria portante e de enchimento', fase: 'execucao', criticidade: 'importante' },
  ],

  'portaria-101-96': [
    { id: 'p101-01', diplomaId: 'portaria-101-96', texto: 'Verificar especificações de sinalização de estaleiro', detalhe: 'Portaria 101/96 — regulamento de sinalização de segurança em estaleiros', fase: 'obra', criticidade: 'importante' },
  ],

  'portaria-53-71': [
    { id: 'p53-01', diplomaId: 'portaria-53-71', texto: 'Cumprir regulamento geral de segurança e higiene no trabalho', detalhe: 'Portaria 53/71 — condições de segurança em estaleiros de construção', fase: 'obra', criticidade: 'critico' },
  ],

  // ─── PROFISSÃO (complementos) ──────────────
  'portaria-701h': [
    { id: 'p701h-01', diplomaId: 'portaria-701h', texto: 'Seguir fases de projecto conforme Portaria 701-H/2008', detalhe: 'Define as fases: programa preliminar, estudo prévio, ante-projecto, licenciamento, execução', fase: 'estudo_previo', criticidade: 'importante' },
    { id: 'p701h-02', diplomaId: 'portaria-701h', texto: 'Incluir conteúdo mínimo em cada fase conforme portaria', detalhe: 'Peças escritas e desenhadas obrigatórias por fase de projecto', fase: 'ante_projecto', criticidade: 'importante' },
  ],

  'eoa': [
    { id: 'eoa-01', diplomaId: 'eoa', texto: 'Verificar inscrição válida na Ordem dos Arquitectos', detalhe: 'Exercício profissional condicionado a inscrição activa na OA', fase: 'licenciamento', criticidade: 'critico' },
  ],

  'lei-40-2015': [
    { id: 'lei40-01', diplomaId: 'lei-40-2015', texto: 'Verificar qualificação profissional dos técnicos de especialidade', detalhe: 'Lei 40/2015 — qualificação de técnicos responsáveis por projectos de especialidade', fase: 'licenciamento', criticidade: 'importante' },
  ],

  'ccp': [
    { id: 'ccp-01', diplomaId: 'ccp', texto: 'Verificar se a obra está sujeita ao Código dos Contratos Públicos', detalhe: 'DL 18/2008 — obrigatório para obras públicas e contratação por entidades públicas', fase: 'estudo_previo', criticidade: 'importante' },
    { id: 'ccp-02', diplomaId: 'ccp', texto: 'Elaborar programa de concurso e caderno de encargos (se aplicável)', detalhe: 'Peças de procedimento para concurso público ou ajuste directo', fase: 'execucao', criticidade: 'importante' },
  ],

  // ─── HABITAÇÃO (complementos) ──────────────
  'lei-bases-habitacao': [
    { id: 'lbh-01', diplomaId: 'lei-bases-habitacao', texto: 'Enquadrar o projecto na Lei de Bases da Habitação', detalhe: 'Lei 83/2019 — princípios do direito à habitação e dever do Estado', fase: 'estudo_previo', criticidade: 'informativo' },
  ],

  'lei-6-2006': [
    { id: 'lei6-01', diplomaId: 'lei-6-2006', texto: 'Verificar regime do NRAU para arrendamento (versão base)', detalhe: 'Lei 6/2006 — regime base de arrendamento urbano', fase: 'estudo_previo', criticidade: 'informativo' },
  ],

  'lei-32-2012': [
    { id: 'lei32-01', diplomaId: 'lei-32-2012', texto: 'Verificar alterações ao RJRU introduzidas em 2012', detalhe: 'Lei 32/2012 — alteração ao regime de reabilitação urbana', fase: 'estudo_previo', criticidade: 'informativo' },
  ],

  'dl-268-94': [
    { id: 'dl268-01', diplomaId: 'dl-268-94', texto: 'Verificar regras de obras em propriedade horizontal', detalhe: 'DL 268/94 — regime de obras em fracções autónomas e partes comuns', fase: 'licenciamento', criticidade: 'importante' },
  ],

  'lei-108-2018': [
    { id: 'lei108-01', diplomaId: 'lei-108-2018', texto: 'Verificar condições especiais de propriedade horizontal (2018)', detalhe: 'Lei 108/2018 — alterações ao regime de propriedade horizontal', fase: 'ante_projecto', criticidade: 'informativo' },
  ],

  // ─── TURISMO (complementos) ──────────────
  'portaria-327-2008': [
    { id: 'p327-01', diplomaId: 'portaria-327-2008', texto: 'Verificar classificação de empreendimentos turísticos por estrelas', detalhe: 'Portaria 327/2008 — requisitos de classificação por tipologia e categoria', fase: 'ante_projecto', criticidade: 'importante' },
  ],

  // ─── ACESSIBILIDADES (complementos) ──────────────
  'dl-38-2013': [
    { id: 'dl38-01', diplomaId: 'dl-38-2013', texto: 'Verificar alterações ao regime de acessibilidades (2013)', detalhe: 'DL 38/2013 — alteração ao DL 163/2006 de acessibilidades', fase: 'ante_projecto', criticidade: 'informativo' },
  ],

  'portaria-301-2019': [
    { id: 'p301-01', diplomaId: 'portaria-301-2019', texto: 'Verificar normas de acessibilidade da Web e conteúdos digitais', detalhe: 'Portaria 301/2019 — acessibilidade digital para organismos públicos', fase: 'execucao', criticidade: 'informativo' },
  ],

  'portaria-304-2014': [
    { id: 'p304-01', diplomaId: 'portaria-304-2014', texto: 'Verificar requisitos de acessibilidade em remodelações', detalhe: 'Portaria 304/2014 — requisitos de acessibilidade em obras de remodelação', fase: 'ante_projecto', criticidade: 'importante' },
  ],

  'dr-5-2019': [
    { id: 'dr5-01', diplomaId: 'dr-5-2019', texto: 'Verificar requisitos de design universal para via pública', detalhe: 'DR 5/2019 — normas de acessibilidade em espaços públicos', fase: 'ante_projecto', criticidade: 'importante' },
  ],

  // ─── ACÚSTICA (complementos) ──────────────
  'dl-129-2002': [
    { id: 'dl129-01', diplomaId: 'dl-129-2002', texto: 'Consultar versão base do RRAE (se referência a edifícios anteriores)', detalhe: 'DL 129/2002 — versão original do RRAE antes das alterações', fase: 'execucao', criticidade: 'informativo' },
  ],

  // ─── AVALIAÇÃO IMOBILIÁRIA ──────────────
  'portaria-420-2015': [
    { id: 'p420-01', diplomaId: 'portaria-420-2015', texto: 'Consultar tabelas de avaliação do IMI para referência de valores', detalhe: 'Portaria 420/2015 — coeficientes de avaliação patrimonial tributária', fase: 'estudo_previo', criticidade: 'informativo' },
  ],
};
