import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { formatCurrency as formatCurrencyLocale } from '../../locales';
import { useLanguage } from '../../context/LanguageContext';

const CONSTRUCTION_RATES: Record<string, number> = {
  economica: 700,
  media: 1000,
  alta: 1500,
  luxo: 2200,
};

const REGION_MULTIPLIERS: Record<string, number> = {
  lisboa: 1.15,
  litoral: 1.05,
  interior: 0.88,
};

const TIPO_LABELS: Record<string, string> = {
  economica: 'Económica',
  media: 'Média',
  alta: 'Alta Qualidade',
  luxo: 'Luxo',
};

const REGIAO_LABELS: Record<string, string> = {
  lisboa: 'Lisboa (+15%)',
  litoral: 'Litoral (+5%)',
  interior: 'Interior (−12%)',
};

export function CustoConstrucaoCalculator() {
  const { language } = useLanguage();
  const [custoArea, setCustoArea] = useState('');
  const [custoTipo, setCustoTipo] = useState('media');
  const [custoRegiao, setCustoRegiao] = useState('litoral');

  const fmt = (v: number) => formatCurrencyLocale(v, language);

  const calculateCusto = () => {
    const areaNum = parseFloat(custoArea) || 0;
    const rate = CONSTRUCTION_RATES[custoTipo] || 1000;
    const region = REGION_MULTIPLIERS[custoRegiao] || 1;
    return areaNum * rate * region;
  };

  const areaNum = parseFloat(custoArea) || 0;
  const rate = CONSTRUCTION_RATES[custoTipo] || 1000;
  const regionMult = REGION_MULTIPLIERS[custoRegiao] || 1;
  const total = calculateCusto();
  const pricePerM2 = Math.round(rate * regionMult);

  return (
    <motion.div
      key="custo"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-card border border-border rounded-xl p-6 space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold">Custo de Construção</h3>
        <p className="text-sm text-muted-foreground mt-0.5">Estimativa com ajuste regional</p>
      </div>

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
          <label className="block text-sm font-medium mb-2">Qualidade de construção</label>
          <select
            value={custoTipo}
            onChange={(e) => setCustoTipo(e.target.value)}
            className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
          >
            <option value="economica">Económica (700 €/m²)</option>
            <option value="media">Média (1.000 €/m²)</option>
            <option value="alta">Alta Qualidade (1.500 €/m²)</option>
            <option value="luxo">Luxo (2.200 €/m²)</option>
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

      {custoArea ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 p-5 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Building2 className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">Custo Total Estimado</span>
              </div>
              <p className="text-4xl font-bold text-primary">{fmt(total)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {areaNum} m² × {pricePerM2.toLocaleString('pt-PT')} €/m² ({TIPO_LABELS[custoTipo]} · {REGIAO_LABELS[custoRegiao]})
              </p>
            </div>
            <div className="p-5 bg-muted/40 border border-border rounded-xl">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Custo por m²</p>
              <p className="text-2xl font-bold">{pricePerM2.toLocaleString('pt-PT')} €</p>
              <p className="text-xs text-muted-foreground mt-1">ajustado para a região</p>
            </div>
          </div>

          {/* Tabela comparativa por qualidade */}
          <div>
            <p className="text-sm font-medium mb-3">Comparativo por qualidade (mesma área e região)</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(CONSTRUCTION_RATES).map(([k, r]) => {
                const val = areaNum * r * regionMult;
                const isActive = k === custoTipo;
                return (
                  <button
                    key={k}
                    onClick={() => setCustoTipo(k)}
                    className={`p-3 rounded-xl border text-left transition-all ${isActive ? 'border-primary bg-primary/10' : 'border-border bg-muted/30 hover:border-primary/40'}`}
                  >
                    <p className={`text-xs font-medium mb-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>{TIPO_LABELS[k]}</p>
                    <p className="text-sm font-bold">{fmt(val)}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-muted-foreground border-t border-border pt-3">
            Valores de referência 2024. Excluem terreno, honorários de projeto, licenças e taxas.
            O custo real varia com o caderno de encargos, empreiteiro e mercado.
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
