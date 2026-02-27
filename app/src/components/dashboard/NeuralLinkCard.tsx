import React from 'react';
import { Cpu, Wifi, WifiOff, Clock } from 'lucide-react';
import KPICard from './KPICard';

interface NeuralLinkCardProps {
  isOnline: boolean;
  lastSync?: string;
  message: string;
  delay?: number;
}

export default function NeuralLinkCard({
  isOnline,
  lastSync,
  message,
  delay = 0,
}: NeuralLinkCardProps) {
  return (
    <KPICard title="Neural Link" icon={Cpu} delay={delay}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isOnline ? 'bg-success/20' : 'bg-muted'
              }`}
            >
              {isOnline ? (
                <Wifi className="w-5 h-5 text-success" />
              ) : (
                <WifiOff className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <p
                className={`text-lg font-semibold ${
                  isOnline ? 'text-success' : 'text-muted-foreground'
                }`}
              >
                {isOnline ? 'ONLINE' : 'OFFLINE'}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Última Sync {lastSync || '--:--'}</span>
              </div>
            </div>
          </div>
          <div
            className={`w-3 h-3 rounded-full ${
              isOnline ? 'bg-success animate-pulse' : 'bg-muted-foreground'
            }`}
          />
        </div>

        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>

        {!isOnline && (
          <button className="w-full px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Conectar
          </button>
        )}
      </div>
    </KPICard>
  );
}
