import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Info } from 'lucide-react';
import { formatCurrency as formatCurrencyLocale } from '../../locales';
import { useLanguage } from '../../context/LanguageContext';

interface Tipologia {
  id: string;
  nome: string;
  descricao: string;
  rates: { economica: number; media: number; alta: number; luxo: number };
  vantagens: string[];
  desvantagens: string[];
  prazoObra: string;
}

const TIPOLOGIAS: Tipologia[] = [
  {
    id: 'tradicional',
    nome: 'Construção Tradicional',
    descricao: 'Alvenaria / betão armado — o método mais comum em Portugal',
    rates: { economica: 700, media: 1000, alta: 1500, luxo: 2200 },
    vantagens: ['Técnicos disponíveis', 'Materiais locais', 'Durabilidade comprovada'],
    desvantagens: ['Prazo mais longo', 'Mais resíduos de obra', 'Custo variável com mão de obra'],
    prazoObra: '10–18 meses (200 m²)',
  },
  {
    id: 'steel',
    nome: 'Steel Frame',
    descricao: 'Estrutura metálica leve — crescente em moradias e ampliações',
    rates: { economica: 750, media: 1050, alta: 1600, luxo: 2350 },
    vantagens: ['Obra mais rápida (−30%)', 'Leveza estrutural', 'Bom desempenho sísmico'],
    desvantagens: ['Menos técnicos especializados', 'Custo de isolamento adicional', 'Manutenção anti-corrosão'],
    prazoObra: '6–12 meses (200 m²)',
  },
  {
    id: 'prefabricado',
    nome: 'Pré-Fabricado / Modular',
    descricao: 'Módulos produzidos em fábrica e montados em obra',
    rates: { economica: 800, media: 1100, alta: 1700, luxo: 2500 },
    vantagens: ['Prazo muito reduzido', 'Qualidade controlada', 'Menos desperdício'],
    desvantagens: ['Menos flexibilidade arquitetónica', 'Transporte pode limitar módulos', 'Mercado PT ainda reduzido'],
    prazoObra: '3–8 meses (200 m²)',
  },
  {
    id: 'reabilitacao',
    nome: 'Reabilitação / Renovação',
    descricao: 'Reabilitação de edifício existente — imprevistos frequentes',
    rates: { economica: 500, media: 900, alta: 1400, luxo: 2000 },
    vantagens: ['Preserva estrutura existente', 'Menores encargos de licenciamento', 'Valor patrimonial'],
    desvantagens: ['Alta imprevisibilidade (+20%–40%)', 'Pode exigir reforço estrutural', 'Prazo variável'],
    prazoObra: '6–14 meses (200 m²) + incerteza',
  },
];

const REGION_MULTIPLIERS: Record<string, number> = {
  lisboa: 1.15,
  litoral: 1.05,
  interior: 0.88,
};

const QUALIDADE_LABELS: Record<string, string> = {
  economica: 'Económica',
  media: 'Média',
  alta: 'Alta Qualidade',
  luxo: 'Luxo',
};

export function CustoConstrucaoCalculator() {
  const { language } = useLanguage();
  const fmt = (v: number) => formatCurrencyLocale(v, language);

  const [custoArea, setCustoArea] = useState('');
  const [custoQualidade, setCustoQualidade] = useState<'economica' | 'media' | 'alta' | 'luxo'>('media');
  const [custoRegiao, setCustoRegiao] = useState('litoral');
  const [tipologiaId, setTipologiaId] = useState('tradicional');
  const [showInfo, setShowInfo] = useState(false);

  const areaNum = parseFloat(custoArea) || 0;
  const regionMult = REGION_MULTIPLIERS[custoRegiao] || 1;
  const tipologia = TIPOLOGIAS.find((t) => t.id === tipologiaId) ?? TIPOLOGIAS[0];
  const rate = tipologia.rates[custoQualidade];
  const pricePerM2 = Math.round(rate * regionMult);
  const total = areaNum * pricePerM2;
  const imprevistos = tipologiaId === 'reabilitacao' ? total * 0.25 : total * 0.05;

  return (
    <motion.div
      key="custo"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-card border border-border rounded-xl p-6 space-y-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">Custo de Construção</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Estimativa por tipologia construtiva e região</p>
        </div>
      </div>

      {/* Seletor de tipologia */}
      <div>
        <p className="text-sm font-medium mb-3">Sistema construtivo</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TIPOLOGIAS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTipologiaId(t.id)}
              className={`p-3 rounded-xl border text-left transition-all ${tipologiaId === t.id ? 'border-primary bg-primary/10' : 'border-border bg-muted/30 hover:border-primary/40'}`}
            >
              <p className={`text-xs font-semibold mb-1 ${tipologiaId === t.id ? 'text-primary' : 'text-foreground'}`}>{t.nome}</p>
              <p className="text-xs text-muted-foreground leading-tight">{t.descricao}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Info sobre tipologia selecionada */}
      <div className="bg-muted/20 border border-border rounded-xl p-4 text-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium">{tipologia.nome}</span>
          <button onClick={() => setShowInfo((v) => !v)} className="text-muted-foreground hover:text-foreground">
            <Info className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2 text-xs text-muted-foreground">
          <span>Prazo estimado:</span>
          <span className="text-foreground font-medium">{tipologia.prazoObra}</span>
        </div>
        {showInfo && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
            <div>
              <p className="text-xs text-emerald-400 font-medium mb-1">Vantagens</p>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                {tipologia.vantagens.map((v) => <li key={v}>+ {v}</li>)}
              </ul>
            </div>
            <div>
              <p className="text-xs text-amber-400 font-medium mb-1">Considerações</p>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                {tipologia.desvantagens.map((d) => <li key={d}>− {d}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Área de construção (m²) *</label>
          <input
            type="number"
            min="0"
            value={custoArea}
            onChange={(e) => setCustoArea(e.target.value)}
            className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
            placeholder="Ex: 200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Nível de qualidade</label>
          <select
            value={custoQualidade}
            onChange={(e) => setCustoQualidade(e.target.value as typeof custoQualidade)}
            className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
          >
            <option value="economica">Económica ({tipologia.rates.economica} €/m²)</option>
            <option value="media">Média ({tipologia.rates.media} €/m²)</option>
            <option value="alta">Alta Qualidade ({tipologia.rates.alta} €/m²)</option>
            <option value="luxo">Luxo ({tipologia.rates.luxo} €/m²)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Região</label>
          <select
            value={custoRegiao}
            onChange={(e) => setCustoRegiao(e.target.value)}
            className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
          >
            <option value="lisboa">Lisboa (+15%)</option>
            <option value="litoral">Litoral (+5%)</option>
            <option value="interior">Interior (−12%)</option>
          </select>
        </div>
      </div>

      {areaNum > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 p-5 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Building2 className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">Custo Base Estimado</span>
              </div>
              <p className="text-4xl font-bold text-primary">{fmt(total)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {areaNum} m² × {pricePerM2.toLocaleString('pt-PT')} €/m² · {QUALIDADE_LABELS[custoQualidade]} · {tipologia.nome}
              </p>
            </div>
            <div className="p-5 bg-muted/40 border border-border rounded-xl">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Com imprevistos</p>
              <p className="text-2xl font-bold">{fmt(total + imprevistos)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {tipologiaId === 'reabilitacao' ? '+25% (reab.)' : '+5% (reserva)'}
              </p>
            </div>
          </div>

          {/* Comparativo por sistema construtivo */}
          <div>
            <p className="text-sm font-medium mb-3">Comparativo por sistema construtivo (mesma área, qualidade e região)</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TIPOLOGIAS.map((t) => {
                const r = t.rates[custoQualidade];
                const val = areaNum * Math.round(r * regionMult);
                const isActive = t.id === tipologiaId;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTipologiaId(t.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${isActive ? 'border-primary bg-primary/10' : 'border-border bg-muted/30 hover:border-primary/40'}`}
                  >
                    <p className={`text-xs font-medium mb-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>{t.nome}</p>
                    <p className="text-sm font-bold">{fmt(val)}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-muted-foreground border-t border-border pt-3">
            Valores de referência 2024. Excluem terreno, honorários de projeto, licenças, taxas e IVA.
            Reabilitação pode ter desvios de +20% a +40% por imprevistos estruturais.
          </p>
        </div>
      ) : (
        <div className="p-6 bg-muted/30 border border-border rounded-xl text-center text-muted-foreground">
          <Building2 className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Introduz a área para ver a estimativa</p>
        </div>
      )}
    </motion.div>
  );
}
