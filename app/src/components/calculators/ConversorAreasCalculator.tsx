import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Ruler } from 'lucide-react';

const AREA_TO_M2: Record<string, number> = {
  m2: 1,
  ft2: 0.092903,
  in2: 0.00064516,
  yd2: 0.836127,
  ha: 10000,
  ac: 4046.86,
  palmo2: 0.0484,
  vara2: 6.97,
};

const UNIT_LABEL: Record<string, string> = {
  m2: 'm²', ft2: 'ft²', in2: 'in²', yd2: 'yd²', ha: 'ha', ac: 'ac',
  palmo2: 'palmo²', vara2: 'vara²',
};

export function ConversorAreasCalculator() {
  const [areaValue, setAreaValue] = useState('');
  const [fromUnit, setFromUnit] = useState('m2');
  const [toUnit, setToUnit] = useState('ft2');

  const convertArea = () => {
    const value = parseFloat(areaValue) || 0;
    const m2 = value * (AREA_TO_M2[fromUnit] ?? 1);
    return m2 / (AREA_TO_M2[toUnit] ?? 1);
  };

  const allUnits = Object.keys(AREA_TO_M2);

  return (
    <motion.div
      key="areas"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-card border border-border rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold mb-4">Conversor de Áreas</h3>
      <div className="flex flex-col sm:flex-row items-end gap-4 mb-6 flex-wrap">
        <div className="flex-1 min-w-[120px]">
          <label className="block text-sm font-medium mb-2">Valor *</label>
          <input
            type="number"
            min="0"
            step="any"
            value={areaValue}
            onChange={(e) => setAreaValue(e.target.value)}
            className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
            placeholder="Ex: 100"
          />
        </div>
        <div className="w-full sm:w-28">
          <label className="block text-sm font-medium mb-2">De</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
          >
            {allUnits.map((u) => (
              <option key={u} value={u}>{UNIT_LABEL[u] ?? u}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-center pb-3">
          <ArrowRightLeft className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="w-full sm:w-28">
          <label className="block text-sm font-medium mb-2">Para</label>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
          >
            {allUnits.map((u) => (
              <option key={u} value={u}>{UNIT_LABEL[u] ?? u}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Ruler className="w-4 h-4" />
          <span className="text-sm">Resultado</span>
        </div>
        <p className="text-4xl font-bold text-primary">
          {convertArea().toLocaleString('pt-PT', { maximumFractionDigits: 4 })}{' '}
          <span className="text-2xl">{UNIT_LABEL[toUnit] ?? toUnit}</span>
        </p>
      </div>

      {/* Tabela de referência rápida */}
      <div className="mt-6">
        <p className="text-sm font-medium mb-3">Equivalências rápidas (1 m²)</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {allUnits.filter((u) => u !== 'm2').map((u) => (
            <div key={u} className="px-3 py-2 bg-muted/40 border border-border rounded-lg text-xs">
              <span className="text-muted-foreground">1 m² =</span>
              <span className="font-medium ml-1">
                {(1 / (AREA_TO_M2[u] ?? 1)).toLocaleString('pt-PT', { maximumFractionDigits: 4 })} {UNIT_LABEL[u]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
