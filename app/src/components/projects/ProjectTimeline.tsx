import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Users,
  Palette,
  Hammer,
  Building2,
  Flag
} from 'lucide-react';

interface TimelinePhase {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'completed' | 'in_progress' | 'upcoming' | 'delayed';
  progress: number;
  icon: React.ElementType;
  milestones: {
    id: string;
    title: string;
    date: string;
    completed: boolean;
  }[];
}

const mockPhases: TimelinePhase[] = [
  {
    id: '1',
    name: 'Programa Base',
    description: 'Definição do programa, levantamento e análise do local',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    status: 'completed',
    progress: 100,
    icon: FileText,
    milestones: [
      { id: 'm1', title: 'Briefing completo', date: '2024-01-20', completed: true },
      { id: 'm2', title: 'Levantamento topográfico', date: '2024-02-01', completed: true },
      { id: 'm3', title: 'Aprovação do programa', date: '2024-02-15', completed: true },
    ],
  },
  {
    id: '2',
    name: 'Estudo Prévio',
    description: 'Desenvolvimento do conceito e estudo volumétrico',
    startDate: '2024-02-16',
    endDate: '2024-03-30',
    status: 'completed',
    progress: 100,
    icon: Palette,
    milestones: [
      { id: 'm4', title: 'Apresentação de conceito', date: '2024-03-01', completed: true },
      { id: 'm5', title: 'Revisão com cliente', date: '2024-03-15', completed: true },
      { id: 'm6', title: 'Aprovação final EP', date: '2024-03-30', completed: true },
    ],
  },
  {
    id: '3',
    name: 'Anteprojeto',
    description: 'Desenvolvimento detalhado das soluções arquitetónicas',
    startDate: '2024-04-01',
    endDate: '2024-05-31',
    status: 'in_progress',
    progress: 65,
    icon: Building2,
    milestones: [
      { id: 'm7', title: 'Plantas e cortes', date: '2024-04-20', completed: true },
      { id: 'm8', title: 'Alçados definitivos', date: '2024-05-10', completed: true },
      { id: 'm9', title: 'Reunião de validação', date: '2024-05-25', completed: false },
    ],
  },
  {
    id: '4',
    name: 'Projeto de Execução',
    description: 'Documentação técnica para construção',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    status: 'upcoming',
    progress: 0,
    icon: Hammer,
    milestones: [
      { id: 'm10', title: 'Projeto de estruturas', date: '2024-06-30', completed: false },
      { id: 'm11', title: 'Projeto de instalações', date: '2024-07-31', completed: false },
      { id: 'm12', title: 'Mapa de acabamentos', date: '2024-08-31', completed: false },
    ],
  },
  {
    id: '5',
    name: 'Acompanhamento de Obra',
    description: 'Assistência técnica durante a construção',
    startDate: '2024-09-01',
    endDate: '2025-03-31',
    status: 'upcoming',
    progress: 0,
    icon: Users,
    milestones: [
      { id: 'm13', title: 'Início de obra', date: '2024-09-15', completed: false },
      { id: 'm14', title: 'Estrutura concluída', date: '2024-12-15', completed: false },
      { id: 'm15', title: 'Receção provisória', date: '2025-03-31', completed: false },
    ],
  },
];

const statusConfig = {
  completed: {
    color: 'emerald',
    bgColor: 'bg-emerald-500',
    textColor: 'text-emerald-500',
    bgLight: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    label: 'Concluído',
    icon: CheckCircle2,
  },
  in_progress: {
    color: 'primary',
    bgColor: 'bg-primary',
    textColor: 'text-primary',
    bgLight: 'bg-primary/10',
    borderColor: 'border-primary/30',
    label: 'Em Curso',
    icon: Clock,
  },
  upcoming: {
    color: 'muted',
    bgColor: 'bg-muted-foreground/30',
    textColor: 'text-muted-foreground',
    bgLight: 'bg-muted',
    borderColor: 'border-border',
    label: 'Agendado',
    icon: Circle,
  },
  delayed: {
    color: 'amber',
    bgColor: 'bg-amber-500',
    textColor: 'text-amber-500',
    bgLight: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    label: 'Atrasado',
    icon: AlertCircle,
  },
};

interface PhaseCardProps {
  phase: TimelinePhase;
  isFirst: boolean;
  isLast: boolean;
  delay: number;
}

function PhaseCard({ phase, isFirst, isLast, delay }: PhaseCardProps) {
  const [expanded, setExpanded] = useState(phase.status === 'in_progress');
  const config = statusConfig[phase.status];
  const StatusIcon = config.icon;
  const PhaseIcon = phase.icon;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      className="relative flex gap-4"
    >
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div className={`w-12 h-12 rounded-xl ${config.bgLight} flex items-center justify-center shrink-0 z-10 border ${config.borderColor}`}>
          <PhaseIcon className={`w-5 h-5 ${config.textColor}`} />
        </div>
        {!isLast && (
          <div className={`w-0.5 flex-1 mt-3 ${phase.status === 'completed' ? 'bg-emerald-500/50' : 'bg-border'}`} />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-8 ${isLast ? 'pb-0' : ''}`}>
        <div 
          className={`bg-card border rounded-2xl overflow-hidden transition-all hover:border-primary/30 ${config.borderColor}`}
        >
          {/* Header */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full p-5 text-left flex items-start justify-between gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgLight} ${config.textColor}`}>
                  <StatusIcon className="w-3 h-3" />
                  {config.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">{phase.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{phase.description}</p>
            </div>
            <div className="flex items-center gap-3">
              {phase.status !== 'upcoming' && (
                <div className="text-right">
                  <span className="text-2xl font-bold text-foreground">{phase.progress}%</span>
                </div>
              )}
              {expanded ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </button>

          {/* Progress bar */}
          {phase.status !== 'upcoming' && (
            <div className="px-5 pb-4">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${phase.progress}%` }}
                  transition={{ delay: delay * 0.1 + 0.3, duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${config.bgColor}`}
                />
              </div>
            </div>
          )}

          {/* Milestones */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-border"
              >
                <div className="p-5 space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    Marcos
                  </h4>
                  {phase.milestones.map((milestone, idx) => (
                    <motion.div
                      key={milestone.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        milestone.completed ? 'bg-emerald-500/5' : 'bg-muted/50'
                      }`}
                    >
                      {milestone.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                      )}
                      <div className="flex-1">
                        <span className={`text-sm font-medium ${milestone.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {milestone.title}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(milestone.date)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

interface ProjectTimelineProps {
  projectId?: string;
  phases?: TimelinePhase[];
}

export default function ProjectTimeline({ projectId, phases = mockPhases }: ProjectTimelineProps) {
  const totalProgress = Math.round(
    phases.reduce((sum, p) => sum + p.progress, 0) / phases.length
  );

  const completedPhases = phases.filter(p => p.status === 'completed').length;
  const currentPhase = phases.find(p => p.status === 'in_progress');

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Progresso Total</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-foreground">{totalProgress}%</span>
            <span className="text-sm text-muted-foreground mb-1">concluído</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden mt-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${totalProgress}%` }}
              transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500"
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Fases Concluídas</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-foreground">{completedPhases}</span>
            <span className="text-sm text-muted-foreground mb-1">de {phases.length}</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Fase Atual</span>
          </div>
          <div className="text-lg font-semibold text-primary">
            {currentPhase?.name || 'Nenhuma em curso'}
          </div>
          {currentPhase && (
            <span className="text-sm text-muted-foreground">{currentPhase.progress}% concluído</span>
          )}
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {phases.map((phase, index) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            isFirst={index === 0}
            isLast={index === phases.length - 1}
            delay={index}
          />
        ))}
      </div>
    </div>
  );
}
