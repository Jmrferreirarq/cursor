import React from 'react';
import { AlertTriangle, Settings, ArrowRight } from 'lucide-react';
import KPICard from './KPICard';

interface AlertsCardProps {
  hasAlerts: boolean;
  alerts?: string[];
  delay?: number;
}

export default function AlertsCard({ hasAlerts, alerts = [], delay = 0 }: AlertsCardProps) {
  return (
    <KPICard title="Critical Alerts" icon={AlertTriangle} delay={delay}>
      <div className="space-y-4">
        {!hasAlerts ? (
          <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-medium">Sem bloqueios críticos.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-destructive/10 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                <p className="text-sm">{alert}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <span>Resolver</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="p-2 border border-border rounded-lg hover:bg-muted transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </KPICard>
  );
}
