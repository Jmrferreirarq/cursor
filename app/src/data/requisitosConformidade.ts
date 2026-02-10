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
};
