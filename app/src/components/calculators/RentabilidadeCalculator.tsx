import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Euro, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatCurrency as formatCurrencyLocale } from '../../locales';
import { useLanguage } from '../../context/LanguageContext';

interface Fase {
  id: string;
  nome: string;
  horas: string;
}

const FASES_DEFAULT: Fase[] = [
  { id: 'estudo', nome: 'Estudo Prévio', horas: '20' },
  { id: 'ante', nome: 'Ante-Projeto', horas: '30' },
  { id: 'licenciamento', nome: 'Projeto Licenciamento', horas: '40' },
  { id: 'execucao', nome: 'Projeto Execução', horas: '60' },
  { id: 'assistencia', nome: 'Assistência Técnica', horas: '20' },
];

const CUSTOS_OVERHEAD = 0.30; // 30% custos indiretos sobre valor hora

function getRentabilidadeColor(pct: number) {
  if (pct >= 30) return 'text-emerald-400';
  if (pct >= 15) return 'text-amber-400';
  return 'text-red-400';
}

function getRentabilidadeIcon(pct: number) {
  if (pct >= 15) return CheckCircle;
  return AlertTriangle;
}

export function RentabilidadeCalculator() {
  const { language } = useLanguage();
  const fmt = (v: number) => formatCurrencyLocale(v, language);

  const [honorariosTotal, setHonorariosTotal] = useState('');
  const [valorHora, setValorHora] = useState('35');
  const [fases, setFases] = useState<Fase[]>(FASES_DEFAULT);
  const [custosAdicionais, setCustosAdicionais] = useState('');
  const [deslocacoes, setDeslocacoes] = useState('');

  const updateFaseHoras = (id: string, horas: string) => {
    setFases((prev) => prev.map((f) => (f.id === id ? { ...f, horas } : f)));
  };

  const calc = useMemo(() => {
    const honorarios = parseFloat(honorariosTotal) || 0;
    const vhora = parseFloat(valorHora) || 35;
    const totalHoras = fases.reduce((s, f) => s + (parseFloat(f.horas) || 0), 0);
    const custoMaoObra = totalHoras * vhora;
    const overhead = custoMaoObra * CUSTOS_OVERHEAD;
    const custosExtra = parseFloat(custosAdicionais) || 0;
    const custosDesl = parseFloat(deslocacoes) || 0;
    const custoTotal = custoMaoObra + overhead + custosExtra + custosDesl;
    const margem = honorarios - custoTotal;
    const margemPct = honorarios > 0 ? (margem / honorarios) * 100 : 0;
    const valorHoraEfetivo = totalHoras > 0 ? honorarios / totalHoras : 0;
    const horasMaximas = vhora > 0 ? honorarios / (vhora * (1 + CUSTOS_OVERHEAD)) : 0;

    return {
      honorarios,
      vhora,
      totalHoras,
      custoMaoObra,
      overhead,
      custosExtra,
      custosDesl,
      custoTotal,
      margem,
      margemPct,
      valorHoraEfetivo,
      horasMaximas,
    };
  }, [honorariosTotal, valorHora, fases, custosAdicionais, deslocacoes]);

  const RentIcon = getRentabilidadeIcon(calc.margemPct);

  return (
    <motion.div
      key="rentabilidade"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-card border border-border rounded-xl p-6 space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold">Rentabilidade do Projeto</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Calcula a margem real estimada — honorários vs. custo interno
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna esquerda: inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Honorários totais c/ IVA (€)</label>
              <input
                type="number"
                min="0"
                value={honorariosTotal}
                onChange={(e) => setHonorariosTotal(e.target.value)}
                className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                placeholder="Ex: 12000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Custo hora técnico (€/h)</label>
              <input
                type="number"
                min="0"
                value={valorHora}
                onChange={(e) => setValorHora(e.target.value)}
                className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                placeholder="Ex: 35"
              />
            </div>
          </div>

          {/* Horas por fase */}
          <div>
            <p className="text-sm font-medium mb-3">Horas estimadas por fase</p>
            <div className="space-y-2">
              {fases.map((f) => (
                <div key={f.id} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground flex-1">{f.nome}</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      value={f.horas}
                      onChange={(e) => updateFaseHoras(f.id, e.target.value)}
                      className="w-20 px-3 py-1.5 bg-muted border border-border rounded-lg text-sm text-right focus:border-primary focus:outline-none"
                    />
                    <span className="text-xs text-muted-foreground w-4">h</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-3 pt-1 border-t border-border">
                <span className="text-sm font-medium flex-1">Total</span>
                <span className="text-sm font-bold w-20 text-right pr-1">
                  {calc.totalHoras}h
                </span>
                <span className="w-4" />
              </div>
            </div>
          </div>

          {/* Custos adicionais */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Custos ext. / subcontratação (€)</label>
              <input
                type="number"
                min="0"
                value={custosAdicionais}
                onChange={(e) => setCustosAdicionais(e.target.value)}
                className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                placeholder="Ex: 800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Deslocações / despesas (€)</label>
              <input
                type="number"
                min="0"
                value={deslocacoes}
                onChange={(e) => setDeslocacoes(e.target.value)}
                className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                placeholder="Ex: 150"
              />
            </div>
          </div>
        </div>

        {/* Coluna direita: resultados */}
        {calc.honorarios > 0 ? (
          <div className="space-y-3">
            {/* Margem principal */}
            <div className={`p-5 rounded-xl border ${calc.margemPct >= 15 ? 'bg-emerald-500/5 border-emerald-500/20' : calc.margemPct >= 0 ? 'bg-amber-500/5 border-amber-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
              <div className="flex items-center gap-2 mb-2">
                <RentIcon className={`w-5 h-5 ${getRentabilidadeColor(calc.margemPct)}`} />
                <span className="text-sm font-medium">Margem do Projeto</span>
              </div>
              <p className={`text-4xl font-bold ${getRentabilidadeColor(calc.margemPct)}`}>
                {calc.margemPct.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {fmt(calc.margem)} de margem líquida estimada
              </p>
            </div>

            {/* Breakdown de custos */}
            <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-2 text-sm">
              <p className="font-medium mb-3">Breakdown de custos</p>
              {[
                { label: `Mão de obra (${calc.totalHoras}h × ${fmt(calc.vhora)}/h)`, value: calc.custoMaoObra },
                { label: `Overhead / indiretos (${(CUSTOS_OVERHEAD * 100).toFixed(0)}%)`, value: calc.overhead },
                ...(calc.custosExtra > 0 ? [{ label: 'Subcontratação / externos', value: calc.custosExtra }] : []),
                ...(calc.custosDesl > 0 ? [{ label: 'Deslocações / despesas', value: calc.custosDesl }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-muted-foreground">
                  <span>{label}</span>
                  <span className="font-medium text-foreground">{fmt(value)}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold pt-2 border-t border-border">
                <span>Custo total estimado</span>
                <span>{fmt(calc.custoTotal)}</span>
              </div>
              <div className="flex justify-between font-semibold text-primary">
                <span>Honorários</span>
                <span>{fmt(calc.honorarios)}</span>
              </div>
            </div>

            {/* KPIs secundários */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/40 border border-border rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs uppercase tracking-wide">Valor/hora efetivo</span>
                </div>
                <p className="text-xl font-bold">{fmt(calc.valorHoraEfetivo)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">receita por hora de trabalho</p>
              </div>
              <div className="bg-muted/40 border border-border rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <Euro className="w-3.5 h-3.5" />
                  <span className="text-xs uppercase tracking-wide">Horas break-even</span>
                </div>
                <p className="text-xl font-bold">{Math.round(calc.horasMaximas)}h</p>
                <p className="text-xs text-muted-foreground mt-0.5">máximo sem prejuízo</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground pt-1">
              Overhead inclui amortizações, software, seguros e custos administrativos estimados a {(CUSTOS_OVERHEAD * 100).toFixed(0)}% da mão de obra direta.
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8 bg-muted/20 border border-border rounded-xl">
            <div className="text-center">
              <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm text-muted-foreground">Introduz os honorários para calcular a rentabilidade</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
