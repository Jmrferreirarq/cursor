/**
 * Compara o valor real de cada proposta com o valor "tabela" (ICHPOP/FA-360).
 * Fórmula: valorTabela = minValor + (area × rate × multiplicadorComplexidade)
 */

import type { Proposal } from '@/types';

interface TipologiaRate {
  id: string;
  name: string;
  minValor: number;
  rate: number;
}

const TIPOLOGIAS: TipologiaRate[] = [
  { id: 'habitacao_unifamiliar', name: 'Habitação unifamiliar', minValor: 2000, rate: 28 },
  { id: 'habitacao_coletiva', name: 'Habitação coletiva', minValor: 1800, rate: 25 },
  { id: 'habitacao_apartamento', name: 'Apartamento', minValor: 1500, rate: 25 },
  { id: 'habitacao_moradia', name: 'Moradia', minValor: 2000, rate: 28 },
  { id: 'reabilitacao', name: 'Reabilitação', minValor: 2500, rate: 32 },
  { id: 'reabilitacao_integral', name: 'Reabilitação integral', minValor: 3000, rate: 35 },
  { id: 'restauro', name: 'Restauro', minValor: 3500, rate: 45 },
  { id: 'comercio', name: 'Comércio / loja', minValor: 2000, rate: 35 },
  { id: 'escritorio', name: 'Escritório', minValor: 2000, rate: 30 },
  { id: 'restaurante', name: 'Restaurante', minValor: 2500, rate: 38 },
  { id: 'hotel', name: 'Hotel', minValor: 4000, rate: 40 },
  { id: 'clinica', name: 'Clínica', minValor: 2500, rate: 35 },
  { id: 'armazem_comercial', name: 'Armazém comercial', minValor: 1800, rate: 22 },
  { id: 'industria', name: 'Indústria', minValor: 2500, rate: 28 },
  { id: 'logistica', name: 'Logística', minValor: 1800, rate: 22 },
  { id: 'urbanismo', name: 'Urbanismo', minValor: 2500, rate: 15 },
  { id: 'interiores', name: 'Interiores', minValor: 2500, rate: 45 },
  { id: 'anexo', name: 'Anexo / ampliação', minValor: 1200, rate: 30 },
  { id: 'loteamento_urbano', name: 'Loteamento urbano', minValor: 4000, rate: 10 },
  { id: 'praia_apm', name: 'Apoio Praia Mínimo', minValor: 1200, rate: 55 },
  { id: 'praia_aps', name: 'Apoio Praia Simples', minValor: 2000, rate: 45 },
  { id: 'praia_apc', name: 'Apoio Praia Completo', minValor: 3500, rate: 40 },
];

export interface ProposalComparison {
  id: string;
  clientName: string;
  projectName: string;
  projectType: string;
  tipologiaName: string;
  area: number;
  valorReal: number;
  valorTabela: number;
  diferenca: number;
  diferencaPct: number;
  status: 'abaixo' | 'acima' | 'dentro';
}

export interface ComparisonSummary {
  totalPropostas: number;
  analisadas: number;
  semDados: number;
  abaixoTabela: number;
  acimaTabela: number;
  dentroTabela: number;
  totalReal: number;
  totalTabela: number;
  diferencaTotal: number;
  items: ProposalComparison[];
}

function calcularValorTabela(area: number, projectType: string): { valor: number; tipologia: TipologiaRate } | null {
  const tip = TIPOLOGIAS.find(t => t.id === projectType);
  if (!tip) return null;
  const valor = tip.minValor + (area * tip.rate);
  return { valor, tipologia: tip };
}

export function compareProposals(proposals: Proposal[]): ComparisonSummary {
  const items: ProposalComparison[] = [];
  let semDados = 0;

  for (const p of proposals) {
    const area = p.area || 0;
    const valorReal = p.totalValue || p.architectureValue || 0;

    if (!area || !p.projectType || !valorReal) {
      semDados++;
      continue;
    }

    const calc = calcularValorTabela(area, p.projectType);
    if (!calc) {
      semDados++;
      continue;
    }

    const diferenca = valorReal - calc.valor;
    const diferencaPct = calc.valor > 0 ? Math.round((diferenca / calc.valor) * 100) : 0;
    const MARGEM = 10;

    items.push({
      id: p.id,
      clientName: p.clientName,
      projectName: p.projectName || p.projectType,
      projectType: p.projectType,
      tipologiaName: calc.tipologia.name,
      area,
      valorReal,
      valorTabela: calc.valor,
      diferenca,
      diferencaPct,
      status: diferencaPct < -MARGEM ? 'abaixo' : diferencaPct > MARGEM ? 'acima' : 'dentro',
    });
  }

  items.sort((a, b) => a.diferencaPct - b.diferencaPct);

  const abaixo = items.filter(i => i.status === 'abaixo').length;
  const acima = items.filter(i => i.status === 'acima').length;
  const dentro = items.filter(i => i.status === 'dentro').length;
  const totalReal = items.reduce((s, i) => s + i.valorReal, 0);
  const totalTabela = items.reduce((s, i) => s + i.valorTabela, 0);

  return {
    totalPropostas: proposals.length,
    analisadas: items.length,
    semDados,
    abaixoTabela: abaixo,
    acimaTabela: acima,
    dentroTabela: dentro,
    totalReal,
    totalTabela,
    diferencaTotal: totalReal - totalTabela,
    items,
  };
}
