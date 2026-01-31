import React from 'react';
import { Heart, Clock, Wallet, Briefcase, AlertTriangle } from 'lucide-react';
import KPICard from './KPICard';

interface HealthIndexCardProps {
  score: number;
  deadlines: number;
  cash: number;
  production: number;
  risk: number;
  quote: string;
  delay?: number;
}

export default function HealthIndexCard({
  score,
  deadlines,
  cash,
  production,
  risk,
  quote,
  delay = 0,
}: HealthIndexCardProps) {
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-success';
    if (value >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreLabel = (value: number) => {
    if (value >= 80) return 'Excelente';
    if (value >= 60) return 'Bom';
    if (value >= 40) return 'Regular';
    return 'Crítico';
  };

  return (
    <KPICard title="Health Index" icon={Heart} delay={delay}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-4xl font-bold tracking-tight ${getScoreColor(score)}`}>
              {score}%
            </p>
            <p className="text-sm text-muted-foreground">{getScoreLabel(score)}</p>
          </div>
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${
              score >= 80
                ? 'border-success/30 bg-success/10'
                : score >= 60
                ? 'border-warning/30 bg-warning/10'
                : 'border-destructive/30 bg-destructive/10'
            }`}
          >
            <Heart
              className={`w-7 h-7 ${
                score >= 80 ? 'text-success' : score >= 60 ? 'text-warning' : 'text-destructive'
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div className="text-center">
            <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs font-medium">{deadlines}%</p>
            <p className="text-[10px] text-muted-foreground">Prazos</p>
          </div>
          <div className="text-center">
            <Wallet className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs font-medium">{cash}%</p>
            <p className="text-[10px] text-muted-foreground">Caixa</p>
          </div>
          <div className="text-center">
            <Briefcase className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs font-medium">{production}%</p>
            <p className="text-[10px] text-muted-foreground">Produção</p>
          </div>
          <div className="text-center">
            <AlertTriangle className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-xs font-medium">{risk}%</p>
            <p className="text-[10px] text-muted-foreground">Risco</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground italic text-center">&ldquo;{quote}&rdquo;</p>
      </div>
    </KPICard>
  );
}
