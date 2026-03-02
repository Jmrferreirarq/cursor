import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Download, ChevronRight, AlertCircle } from 'lucide-react';

interface Fase {
  id: string;
  nome: string;
  descricao: string;
  minSemanas: number;
  maxSemanas: number;
  isExterno: boolean;
  dependeDe?: string;
  nota?: string;
}

const FASES: Fase[] = [
  {
    id: 'adjudicacao',
    nome: 'Adjudicação / Início',
    descricao: 'Assinatura de contrato e pagamento inicial',
    minSemanas: 0,
    maxSemanas: 0,
    isExterno: false,
  },
  {
    id: 'estudo',
    nome: 'Estudo Prévio / PIP',
    descricao: 'Desenvolvimento do conceito arquitetónico',
    minSemanas: 2,
    maxSemanas: 3,
    isExterno: false,
    dependeDe: 'adjudicacao',
  },
  {
    id: 'ante',
    nome: 'Ante-Projeto',
    descricao: 'Volumetria, implantação, fachadas e alçados',
    minSemanas: 3,
    maxSemanas: 4,
    isExterno: false,
    dependeDe: 'estudo',
  },
  {
    id: 'licenciamento_entrega',
    nome: 'Projeto Licenciamento — Entrega',
    descricao: 'Elaboração e entrega do processo na Câmara',
    minSemanas: 2,
    maxSemanas: 6,
    isExterno: false,
    dependeDe: 'ante',
  },
  {
    id: 'analise_camara',
    nome: 'Análise da Câmara Municipal',
    descricao: 'Período de análise técnica pelo município',
    minSemanas: 8,
    maxSemanas: 24,
    isExterno: true,
    dependeDe: 'licenciamento_entrega',
    nota: 'Prazo fora do controlo do atelier. Câmaras de grande dimensão (Lisboa, Porto) podem demorar mais.',
  },
  {
    id: 'licenciamento_notificacao',
    nome: 'Resposta a Notificações',
    descricao: 'Correções e elementos complementares solicitados',
    minSemanas: 1,
    maxSemanas: 3,
    isExterno: false,
    dependeDe: 'analise_camara',
    nota: 'Apenas se houver notificação. Pode não se aplicar.',
  },
  {
    id: 'aprovacao',
    nome: 'Aprovação Final',
    descricao: 'Emissão do alvará de obras',
    minSemanas: 2,
    maxSemanas: 6,
    isExterno: true,
    dependeDe: 'licenciamento_notificacao',
    nota: 'Prazo após deferimento tácito ou deliberação da Câmara.',
  },
];

type ComplexidadeKey = 'simples' | 'media' | 'complexa';

const COMPLEXIDADE: Record<ComplexidadeKey, { label: string; fator: number; desc: string }> = {
  simples:  { label: 'Simples',  fator: 0.85, desc: 'Moradia unifamiliar, interiores, ampliação' },
  media:    { label: 'Média',    fator: 1.0,  desc: 'Edifício plurifamiliar, reabilitação, serviços' },
  complexa: { label: 'Complexa', fator: 1.25, desc: 'Uso misto, loteamento, equipamento público' },
};

function addWeeks(date: Date, weeks: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + Math.round(weeks * 7));
  return d;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' });
}

function weeksBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (7 * 24 * 60 * 60 * 1000));
}

interface FaseCalc {
  fase: Fase;
  inicioMin: Date;
  inicioMax: Date;
  fimMin: Date;
  fimMax: Date;
  duracaoMin: number;
  duracaoMax: number;
}

export function CronogramaCalculator() {
  const [dataAdjudicacao, setDataAdjudicacao] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [complexidade, setComplexidade] = useState<ComplexidadeKey>('media');
  const [incluiExecucao, setIncluiExecucao] = useState(false);
  const [incluiResposta, setIncluiResposta] = useState(true);

  const fases = useMemo<FaseCalc[]>(() => {
    const fator = COMPLEXIDADE[complexidade].fator;
    const base = new Date(dataAdjudicacao + 'T12:00:00');
    const map: Record<string, { fimMin: Date; fimMax: Date }> = {};

    const fasesAtivas = FASES.filter((f) => {
      if (f.id === 'licenciamento_notificacao' && !incluiResposta) return false;
      return true;
    });

    const extras: Fase[] = incluiExecucao
      ? [
          {
            id: 'execucao',
            nome: 'Projeto de Execução',
            descricao: 'Pormenores construtivos, mapas de vãos, especificações',
            minSemanas: 4,
            maxSemanas: 8,
            isExterno: false,
            dependeDe: 'aprovacao',
          },
        ]
      : [];

    return [...fasesAtivas, ...extras].map((f) => {
      const dep = f.dependeDe ? map[f.dependeDe] : null;
      const inicioMin = dep ? dep.fimMin : base;
      const inicioMax = dep ? dep.fimMax : base;
      const durMin = f.id === 'adjudicacao' ? 0 : Math.round(f.minSemanas * fator * 10) / 10;
      const durMax = f.id === 'adjudicacao' ? 0 : Math.round(f.maxSemanas * fator * 10) / 10;
      const fimMin = addWeeks(inicioMin, durMin);
      const fimMax = addWeeks(inicioMax, durMax);
      map[f.id] = { fimMin, fimMax };
      return { fase: f, inicioMin, inicioMax, fimMin, fimMax, duracaoMin: durMin, duracaoMax: durMax };
    });
  }, [dataAdjudicacao, complexidade, incluiExecucao, incluiResposta]);

  const totalMin = fases.length > 1 ? weeksBetween(fases[0].fimMin, fases[fases.length - 1].fimMin) : 0;
  const totalMax = fases.length > 1 ? weeksBetween(fases[0].fimMax, fases[fases.length - 1].fimMax) : 0;

  const exportCsv = () => {
    const rows = [
      ['Fase', 'Descrição', 'Início (min)', 'Início (máx)', 'Fim (min)', 'Fim (máx)', 'Duração mín (sem)', 'Duração máx (sem)'],
      ...fases.map((f) => [
        f.fase.nome,
        f.fase.descricao,
        formatDate(f.inicioMin),
        formatDate(f.inicioMax),
        formatDate(f.fimMin),
        formatDate(f.fimMax),
        String(f.duracaoMin),
        String(f.duracaoMax),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cronograma_${dataAdjudicacao}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      key="cronograma"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-card border border-border rounded-xl p-6 space-y-6"
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-semibold">Cronograma de Projeto</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Datas estimadas por fase a partir da adjudicação</p>
        </div>
        <button
          onClick={exportCsv}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Data de adjudicação</label>
          <input
            type="date"
            value={dataAdjudicacao}
            onChange={(e) => setDataAdjudicacao(e.target.value)}
            className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Complexidade do projeto</label>
          <select
            value={complexidade}
            onChange={(e) => setComplexidade(e.target.value as ComplexidadeKey)}
            className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
          >
            {(Object.entries(COMPLEXIDADE) as [ComplexidadeKey, typeof COMPLEXIDADE[ComplexidadeKey]][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label} — {v.desc}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-3 justify-center">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={incluiResposta}
              onChange={(e) => setIncluiResposta(e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm">Incluir resposta a notificações</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={incluiExecucao}
              onChange={(e) => setIncluiExecucao(e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm">Incluir Projeto de Execução</span>
          </label>
        </div>
      </div>

      {/* Resumo total */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="col-span-1 sm:col-span-3 bg-primary/5 border border-primary/20 rounded-xl p-5 flex flex-wrap items-center gap-6">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Duração total estimada</p>
            <p className="text-3xl font-bold text-primary">
              {totalMin}–{totalMax} semanas
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              ≈ {Math.round(totalMin / 4)}–{Math.round(totalMax / 4)} meses
            </p>
          </div>
          <div className="border-l border-border pl-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Conclusão estimada</p>
            <p className="text-lg font-semibold">{formatDate(fases[fases.length - 1]?.fimMin)}</p>
            <p className="text-sm text-muted-foreground">até {formatDate(fases[fases.length - 1]?.fimMax)}</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {fases.map((fc, idx) => {
          const isExterno = fc.fase.isExterno;
          const isStart = idx === 0;
          return (
            <motion.div
              key={fc.fase.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={`relative flex gap-4 p-4 rounded-xl border ${isExterno ? 'border-amber-500/30 bg-amber-500/5' : 'border-border bg-muted/30'}`}
            >
              {/* Linha vertical */}
              {!isStart && (
                <div className="absolute -top-3 left-[27px] w-px h-3 bg-border" />
              )}

              {/* Ícone */}
              <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${isStart ? 'bg-primary text-primary-foreground' : isExterno ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-muted border border-border text-muted-foreground'}`}>
                {isStart ? '✓' : idx + 1}
              </div>

              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{fc.fase.nome}</span>
                  {isExterno && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500/15 text-amber-400 border border-amber-500/20">
                      Externo
                    </span>
                  )}
                  {fc.duracaoMin > 0 && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {fc.duracaoMin === fc.duracaoMax ? `${fc.duracaoMin} sem.` : `${fc.duracaoMin}–${fc.duracaoMax} sem.`}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{fc.fase.descricao}</p>

                {isStart ? (
                  <div className="flex items-center gap-1 text-xs font-medium text-primary">
                    <Calendar className="w-3 h-3" />
                    {formatDate(fc.fimMin)}
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>
                      <span className="text-foreground font-medium">{formatDateShort(fc.fimMin)}</span>
                      {fc.fimMin.getTime() !== fc.fimMax.getTime() && (
                        <>
                          <ChevronRight className="w-3 h-3 inline mx-0.5" />
                          <span className="text-foreground font-medium">{formatDateShort(fc.fimMax)}</span>
                        </>
                      )}
                    </span>
                  </div>
                )}

                {fc.fase.nota && (
                  <div className="flex items-start gap-1.5 mt-2 text-xs text-amber-400/80">
                    <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                    <span>{fc.fase.nota}</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground border-t border-border pt-4">
        Cronograma orientativo. Os prazos municipais e de entidades externas estão fora do controlo do atelier.
        Fases a amarelo dependem de terceiros.
      </p>
    </motion.div>
  );
}
