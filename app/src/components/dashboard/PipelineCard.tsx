import { TrendingUp, Users, MessageSquare, CheckCircle, BarChart3 } from 'lucide-react';
import KPICard from './KPICard';

interface PipelineCardProps {
  potentialValue: number;
  leads: number;
  negotiation: number;
  closed: number;
  delay?: number;
}

export default function PipelineCard({
  potentialValue,
  leads,
  negotiation,
  closed,
  delay = 0,
}: PipelineCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      notation: 'compact',
    }).format(value);
  };

  const conversion = leads > 0 ? ((closed / leads) * 100).toFixed(1) : '---';

  return (
    <KPICard title="Pipeline Global" icon={BarChart3} delay={delay}>
      <div className="space-y-4">
        <div>
          <p className="text-3xl font-bold tracking-tight">{formatCurrency(potentialValue)}</p>
          <p className="text-xs text-muted-foreground">potencial</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <Users className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-bold">{leads}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Leads</p>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <MessageSquare className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-bold">{negotiation}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Negociação</p>
          </div>
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <CheckCircle className="w-4 h-4 mx-auto mb-1 text-success" />
            <p className="text-lg font-bold">{closed}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Fechado</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">Conversão</span>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-sm font-semibold">{conversion}%</span>
          </div>
        </div>
      </div>
    </KPICard>
  );
}
