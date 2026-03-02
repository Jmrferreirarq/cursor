import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, TrendingUp } from 'lucide-react';
import { formatCurrency as formatCurrencyLocale } from '../../locales';
import { useLanguage } from '../../context/LanguageContext';

const LOCATION_RATES: Record<string, number> = {
  lisboa: 4500,
  porto: 3800,
  algarve: 4200,
  coimbra: 2800,
  braga: 2600,
  aveiro: 3200,
  leiria: 2500,
  interior: 1800,
};

const TYPE_MULTIPLIERS: Record<string, number> = {
  apartamento: 1,
  moradia: 1.15,
  loja: 1.3,
  escritorio: 1.25,
};

const CONDITION_MULTIPLIERS: Record<string, number> = {
  novo: 1,
  bom: 0.95,
  medio: 0.85,
  recuperar: 0.7,
};

// Coeficientes VPT (CIMI art. 38, Portaria 2023)
const Vc = 615;
const Ca: Record<string, number> = { apartamento: 1.1, moradia: 1.0, loja: 1.2, escritorio: 1.1 };
const Cl: Record<string, number> = { lisboa: 3.5, porto: 2.8, algarve: 2.6, aveiro: 1.8, coimbra: 1.6, leiria: 1.5, braga: 1.7, interior: 1.2 };
const Cq: Record<string, number> = { novo: 1.5, bom: 1.2, medio: 1.0, recuperar: 0.7 };

export function AvaliacaoImobiliariaCalculator() {
  const { language } = useLanguage();
  const fmt = (v: number) => formatCurrencyLocale(v, language);

  const [imovelArea, setImovelArea] = useState('');
  const [imovelLocal, setImovelLocal] = useState('porto');
  const [imovelTipo, setImovelTipo] = useState('apartamento');
  const [imovelEstado, setImovelEstado] = useState('bom');

  const areaNum = parseFloat(imovelArea) || 0;
  const locRate = LOCATION_RATES[imovelLocal] || 3000;
  const typeMult = TYPE_MULTIPLIERS[imovelTipo] || 1;
  const condMult = CONDITION_MULTIPLIERS[imovelEstado] || 1;
  const vmercado = areaNum * locRate * typeMult * condMult;

  const vpt = areaNum > 0
    ? Math.round(Vc * areaNum * (Ca[imovelTipo] ?? 1.0) * (Cl[imovelLocal] ?? 1.5) * (Cq[imovelEstado] ?? 1.0))
    : 0;
  const imiMin = Math.round(vpt * 0.003);
  const imiMax = Math.round(vpt * 0.0045);
  const ratioVptMercado = vmercado > 0 ? Math.round((vpt / vmercado) * 100) : 0;

  return (
    <motion.div
      key="imovel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-card border border-border rounded-xl p-6 space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold">Avaliação Imobiliária</h3>
        <p className="text-sm text-muted-foreground mt-0.5">Valor de mercado, VPT e referências IMI</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Área Bruta (m²) *</label>
          <input
            type="number"
            min="0"
            value={imovelArea}
            onChange={(e) => setImovelArea(e.target.value)}
            className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
            placeholder="Ex: 120"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Localização</label>
          <select
            value={imovelLocal}
            onChange={(e) => setImovelLocal(e.target.value)}
            className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
          >
            <option value="lisboa">Lisboa (≈4.500 €/m²)</option>
            <option value="porto">Porto (≈3.800 €/m²)</option>
            <option value="algarve">Algarve (≈4.200 €/m²)</option>
            <option value="aveiro">Aveiro (≈3.200 €/m²)</option>
            <option value="coimbra">Coimbra (≈2.800 €/m²)</option>
            <option value="leiria">Leiria (≈2.500 €/m²)</option>
            <option value="braga">Braga (≈2.600 €/m²)</option>
            <option value="interior">Interior (≈1.800 €/m²)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Tipo</label>
          <select
            value={imovelTipo}
            onChange={(e) => setImovelTipo(e.target.value)}
            className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
          >
            <option value="apartamento">Apartamento (×1,00)</option>
            <option value="moradia">Moradia (×1,15)</option>
            <option value="loja">Loja (×1,30)</option>
            <option value="escritorio">Escritório (×1,25)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Estado de Conservação</label>
          <select
            value={imovelEstado}
            onChange={(e) => setImovelEstado(e.target.value)}
            className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
          >
            <option value="novo">Novo / Reabilitado (×1,00)</option>
            <option value="bom">Bom estado (×0,95)</option>
            <option value="medio">Estado médio (×0,85)</option>
            <option value="recuperar">A recuperar (×0,70)</option>
          </select>
        </div>
      </div>

      {areaNum > 0 ? (
        <div className="space-y-4">
          {/* Valor de mercado */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 p-5 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">Valor de Mercado Estimado</span>
              </div>
              <p className="text-4xl font-bold text-primary">{fmt(vmercado)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {locRate.toLocaleString('pt-PT')} €/m² × {typeMult} (tipo) × {condMult} (estado) × {areaNum} m²
              </p>
            </div>
            <div className="p-5 bg-muted/40 border border-border rounded-xl">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Preço por m²</p>
              <p className="text-2xl font-bold">{fmt(Math.round(vmercado / areaNum))}</p>
              <p className="text-xs text-muted-foreground mt-1">valor médio estimado</p>
            </div>
          </div>

          {/* VPT e IMI */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-muted/40 border border-border rounded-xl">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">VPT Estimado (CIMI)</p>
              <p className="text-2xl font-bold">{fmt(vpt)}</p>
              <p className="text-xs text-muted-foreground mt-1">{ratioVptMercado}% do valor de mercado</p>
            </div>
            <div className="p-5 bg-muted/40 border border-border rounded-xl">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">IMI Anual Estimado</p>
              <p className="text-2xl font-bold">{fmt(imiMin)} – {fmt(imiMax)}</p>
              <p className="text-xs text-muted-foreground mt-1">0,30% – 0,45% sobre VPT</p>
            </div>
            <div className="p-5 bg-muted/40 border border-border rounded-xl">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">IMI Mensal (ref.)</p>
              <p className="text-2xl font-bold">{fmt(Math.round(imiMin / 12))} – {fmt(Math.round(imiMax / 12))}</p>
              <p className="text-xs text-muted-foreground mt-1">custo mensal de posse</p>
            </div>
          </div>

          {/* Notas metodológicas */}
          <div className="text-xs text-muted-foreground bg-muted/20 border border-border rounded-lg p-4 space-y-1">
            <p><strong>Valor de mercado:</strong> Baseado em médias INE/Idealista por localização, tipo e estado. Orientativo.</p>
            <p><strong>VPT (Valor Patrimonial Tributário):</strong> Fórmula simplificada CIMI art. 38 — Vc × A × Ca × Cl × Cq. Vc = 615€ (Portaria 2023). Valor real pode divergir da avaliação AT.</p>
            <p><strong>IMI:</strong> Calculado sobre o VPT à taxa de 0,30%–0,45% (imóveis urbanos). A taxa exata depende do município.</p>
            <p>Para avaliação bancária ou fiscal, consulte avaliador credenciado (CMVM/AT).</p>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-muted/30 border border-border rounded-xl text-center text-muted-foreground">
          <Home className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Introduz a área para ver a estimativa</p>
        </div>
      )}
    </motion.div>
  );
}
