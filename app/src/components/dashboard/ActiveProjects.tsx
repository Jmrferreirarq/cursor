import React from 'react';
import { FolderKanban, Plus, ArrowRight } from 'lucide-react';
import type { Project } from '@/types';
import KPICard from './KPICard';

interface ActiveProjectsProps {
  projects: Project[];
  onNewProject: () => void;
  delay?: number;
}

export default function ActiveProjects({ projects, onNewProject, delay = 0 }: ActiveProjectsProps) {
  const getStatusColor = (status: Project['status']) => {
    const colors = {
      lead: 'bg-muted-foreground',
      negotiation: 'bg-warning',
      active: 'bg-success',
      paused: 'bg-muted',
      completed: 'bg-info',
      cancelled: 'bg-destructive',
    };
    return colors[status];
  };

  const getStatusLabel = (status: Project['status']) => {
    const labels = {
      lead: 'Lead',
      negotiation: 'Negociação',
      active: 'Ativo',
      paused: 'Pausado',
      completed: 'Concluído',
      cancelled: 'Cancelado',
    };
    return labels[status];
  };

  return (
    <KPICard
      title="PROJETOS ATIVOS"
      icon={FolderKanban}
      action={{ label: 'Ver Todos →', onClick: () => {} }}
      delay={delay}
      className="col-span-full lg:col-span-2"
    >
      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <FolderKanban className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">
              Sem projetos ativos. Cria uma proposta para iniciar pipeline.
            </p>
            <button
              onClick={onNewProject}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Proposta</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
                  <div>
                    <p className="font-medium group-hover:text-primary transition-colors">
                      {project.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{project.client}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs px-2 py-1 bg-muted rounded-full">
                    {getStatusLabel(project.status)}
                  </span>
                  <span className="text-sm font-medium">
                    {new Intl.NumberFormat('pt-PT', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(project.budget)}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </KPICard>
  );
}
