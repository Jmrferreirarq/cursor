import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Filter, Search, Clock, User, FileText, AlertCircle, CheckCircle2, Circle, Play } from 'lucide-react';
import { rjueTasks, phases } from '@/data/rjueTasks';
import type { Task } from '@/types';

const priorityColors = {
  low: 'bg-success/20 text-success',
  medium: 'bg-warning/20 text-warning',
  high: 'bg-destructive/20 text-destructive',
  critical: 'bg-destructive/30 text-destructive border border-destructive',
};

const priorityLabels = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  critical: 'Crítica',
};

export default function TasksPage() {
  const [activePhase, setActivePhase] = useState(phases[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filteredTasks = rjueTasks.filter(
    (task) =>
      task.phase === activePhase &&
      (task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const completedTasks = filteredTasks.filter((t) => t.status === 'completed').length;
  const activeTasks = filteredTasks.filter((t) => t.status === 'in_progress').length;
  const efficiency = filteredTasks.length > 0 ? (completedTasks / filteredTasks.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <CheckSquare className="w-4 h-4" />
            <span className="text-sm">Inteligência Operacional & RJUE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Gestão de Tarefas</h1>
        </div>
      </motion.div>

      {/* Phase Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {phases.map((phase) => (
          <button
            key={phase}
            onClick={() => setActivePhase(phase)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activePhase === phase
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {phase}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar tarefas..."
              className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          {/* Status Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-success">{completedTasks}</p>
              <p className="text-xs text-muted-foreground uppercase">Concluídas</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-primary">{activeTasks}</p>
              <p className="text-xs text-muted-foreground uppercase">Ativas</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold">{efficiency.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground uppercase">Eficiência</p>
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-2">
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedTask(task)}
                className={`p-4 bg-card border rounded-lg cursor-pointer transition-all hover:border-muted-foreground/30 ${
                  selectedTask?.id === task.id ? 'border-primary' : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-muted-foreground">{task.code}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          priorityColors[task.priority]
                        }`}
                      >
                        {priorityLabels[task.priority]}
                      </span>
                    </div>
                    <h3 className="font-medium mb-1">{task.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : task.status === 'in_progress' ? (
                      <Play className="w-5 h-5 text-primary" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <CheckSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhuma tarefa encontrada</p>
              </div>
            )}
          </div>
        </div>

        {/* Task Details */}
        <div className="lg:col-span-1">
          {selectedTask ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card border border-border rounded-xl p-6 sticky top-20"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-mono text-muted-foreground">{selectedTask.code}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    priorityColors[selectedTask.priority]
                  }`}
                >
                  {priorityLabels[selectedTask.priority]}
                </span>
              </div>

              <h2 className="text-xl font-semibold mb-4">{selectedTask.title}</h2>
              <p className="text-muted-foreground mb-6">{selectedTask.description}</p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duração Estimada</p>
                    <p className="font-medium">{selectedTask.estimatedHours}h</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Responsável</p>
                    <p className="font-medium capitalize">{selectedTask.responsible}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Entregáveis</p>
                  <div className="space-y-1">
                    {selectedTask.deliverables.map((deliverable, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <FileText className="w-3 h-3 text-muted-foreground" />
                        <span>{deliverable}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6 pt-6 border-t border-border">
                {selectedTask.status === 'pending' && (
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    <Play className="w-4 h-4" />
                    <span>Iniciar</span>
                  </button>
                )}
                {selectedTask.status === 'in_progress' && (
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-success text-success-foreground rounded-lg font-medium hover:bg-success/90 transition-colors">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Concluir</span>
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-6 text-center sticky top-20">
              <CheckSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Selecione uma tarefa para ver detalhes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
