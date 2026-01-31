import React from 'react';
import { CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';
import KPICard from './KPICard';

interface DayPanelProps {
  delayed: number;
  sevenDays: number;
  rec: number;
  delay?: number;
}

export default function DayPanel({ delayed, sevenDays, rec, delay = 0 }: DayPanelProps) {
  const allGood = delayed === 0 && sevenDays === 0 && rec === 0;

  return (
    <KPICard
      title="Painel do Dia"
      icon={CheckCircle}
      action={{ label: 'Abrir Dia →', onClick: () => {} }}
      delay={delay}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              allGood ? 'bg-success/20' : 'bg-destructive/20'
            }`}
          >
            {allGood ? (
              <CheckCircle className="w-5 h-5 text-success" />
            ) : (
              <AlertCircle className="w-5 h-5 text-destructive" />
            )}
          </div>
          <div>
            <p className="text-lg font-semibold">
              {allGood ? 'Tudo em dia' : 'Atrasos pendentes'}
            </p>
            <p className="text-xs text-muted-foreground">Today Ops</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{delayed}</p>
            <p className="text-xs text-muted-foreground">Atraso</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{sevenDays}</p>
            <p className="text-xs text-muted-foreground">7 Dias</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{rec}</p>
            <p className="text-xs text-muted-foreground">Rec.</p>
          </div>
        </div>
      </div>
    </KPICard>
  );
}
