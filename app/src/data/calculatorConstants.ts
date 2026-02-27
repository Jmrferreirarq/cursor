/**
 * Constantes partilhadas pelas calculadoras.
 */

export interface IchpopPhase {
  id: string;
  name: string;
  pct: number;
  desc: string;
  descricao: string;
}

export const ICHPOP_PHASES: IchpopPhase[] = [
  {
    id: 'estudo',
    name: 'Estudo prévio | PIP / Adjudicação',
    pct: 25,
    desc: 'Análise e conceito',
    descricao:
      'Fase inicial de exploração de soluções arquitetónicas e conceitos. O arquiteto desenvolve diferentes alternativas para o layout funcional, circulação, distribuição de espaços, relação com o meio envolvente, estética e aspetos conceptuais, podendo incluir esboços, maquetes, imagens 3D ou outros meios de representação. Entrega ao cliente para decisão e adjudicação.',
  },
  {
    id: 'ante',
    name: 'Ante-Projeto | Início Arquitetura',
    pct: 20,
    desc: 'Esquema e volumetria',
    descricao:
      'Desenvolvimento do esquema aprovado em estudo prévio, definindo volumetria, implantação, fachadas e elementos de composição. Inclui plantas, cortes e alçados preliminares para validação com o cliente e entidades. Marca o início formal do projeto de arquitetura.',
  },
  {
    id: 'licenciamento_entrega',
    name: 'Projeto Licenciamento | Entrega',
    pct: 25,
    desc: 'Entrega na Câmara',
    descricao:
      'Elaboração completa do projeto para submissão à Câmara Municipal. Inclui elementos gráficos e documentais exigidos pela lei e regulamentos, assim como desenhos de pormenor genéricos (3 a 6) desenvolvidos com o licenciamento. Entrega do processo na Câmara.',
  },
  {
    id: 'licenciamento_notificacao',
    name: 'Projeto Licenciamento | Notificação',
    pct: 20,
    desc: 'Em análise na Câmara',
    descricao:
      'Período de análise do projeto pela Câmara Municipal. O arquiteto acompanha o processo, responde a diligências e assegura o cumprimento dos requisitos até à decisão da entidade licenciadora.',
  },
  {
    id: 'aprovacao_final',
    name: 'Aprovação Final',
    pct: 10,
    desc: 'Entrega final',
    descricao: 'Entrega da documentação final ao cliente.',
  },
];
