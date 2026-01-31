import React from 'react';
import { Wallet, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import KPICard from './KPICard';

interface CashflowCardProps {
  netAmount: number;
  overdueAmount: number;
  next7DaysAmount: number;
  delay?: number;
}

export default function CashflowCard({
  netAmount,
  overdueAmount,
  next7DaysAmount,
  delay = 0,
}: CashflowCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  return (
    <KPICard
      title="Cashflow"
      icon={Wallet}
      action={{ label: 'Ver Todos →', onClick: () => {} }}
      delay={delay}
    >
      <div className="space-y-4">
        <div>
          <p className="text-3xl font-bold tracking-tight">{formatCurrency(netAmount)}</p>
          <p className="text-xs text-muted-foreground">NET • + IVA À taxa legal</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span className="text-sm">Vencido</span>
            </div>
            <span className="text-sm font-semibold text-destructive">
              {formatCurrency(overdueAmount)}
            </span>
          </div>

          <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-sm">Próx. 7 Dias</span>
            </div>
            <span className="text-sm font-semibold">{formatCurrency(next7DaysAmount)}</span>
          </div>
        </div>
      </div>
    </KPICard>
  );
}
