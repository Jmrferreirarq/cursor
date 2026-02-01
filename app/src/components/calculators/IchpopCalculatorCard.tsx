import { motion } from 'framer-motion';
import { Percent } from 'lucide-react';
import { ICHPOP_PHASES } from '../../data/calculatorConstants';

export function IchpopCalculatorCard() {
  return (
    <motion.div
      key="ichpop"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-card border border-border rounded-xl p-6"
    >
      <h3 className="text-lg font-semibold mb-2">Percentagens por Fase (Referência ICHPOP)</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Distribuição orientativa do total de honorários. Tabela histórica; desde 2003 não há tabela oficial obrigatória.
      </p>
      <div className="space-y-3">
        {ICHPOP_PHASES.map((phase) => (
          <div
            key={phase.id}
            className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border"
          >
            <div>
              <p className="font-medium">{phase.name}</p>
              <p className="text-xs text-muted-foreground">{phase.desc}</p>
            </div>
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-muted-foreground" />
              <span className="text-xl font-bold text-primary">{phase.pct}%</span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        Total: 100%. Ex.: Se honorários totais = 8% da obra, Estudo Prévio ≈ 0.64% da obra (8% × 8%).
      </p>
    </motion.div>
  );
}
