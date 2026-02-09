import React from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowRight } from 'lucide-react';
import KPICard from './KPICard';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  loggedHours: number;
  targetHours: number;
}

interface ProductionHoursProps {
  team: TeamMember[];
  delay?: number;
}

export default function ProductionHours({ team, delay = 0 }: ProductionHoursProps) {
  return (
    <KPICard
      title="PRODUÇÃO • HORAS (SEMANA)"
      icon={Users}
      action={{ label: 'Detalhe →', onClick: () => {} }}
      delay={delay}
      className="col-span-full lg:col-span-2"
    >
      <div className="space-y-4">
        <div className="grid gap-4">
          {team.map((member, index) => {
            const percentage = Math.min((member.loggedHours / member.targetHours) * 100, 100);
            const isBelowTarget = percentage < 80;

            return (
              <div key={member.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${isBelowTarget ? 'text-warning' : 'text-success'}`}>
                      {percentage.toFixed(0)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member.loggedHours}h / {member.targetHours}h
                    </p>
                  </div>
                </div>

                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
                    className={`h-full rounded-full ${
                      isBelowTarget ? 'bg-warning' : 'bg-success'
                    }`}
                  />
                </div>

                {isBelowTarget && (
                  <p className="text-xs text-warning">
                    Abaixo do alvo — pode haver capacidade livre.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground">
          Baseado em registos de horas (NET operacional). Ajusta o alvo por pessoa se necessário.
        </p>
      </div>
    </KPICard>
  );
}
