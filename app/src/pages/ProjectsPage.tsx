import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Plus, Search, MoreVertical, Calendar, Users, Euro } from 'lucide-react';
import type { Project } from '@/types';
import NewProjectDialog from '@/components/projects/NewProjectDialog';
import { useData } from '@/context/DataContext';

const statusColors = {
  lead: 'bg-muted-foreground/20 text-muted-foreground',
  negotiation: 'bg-warning/20 text-warning',
  active: 'bg-success/20 text-success',
  paused: 'bg-muted/20 text-muted-foreground',
  completed: 'bg-info/20 text-info',
  cancelled: 'bg-destructive/20 text-destructive',
};

const statusLabels = {
  lead: 'Lead',
  negotiation: 'Negociação',
  active: 'Ativo',
  paused: 'Pausado',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { projects, addProject, clients } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newProjectOpen, setNewProjectOpen] = useState(false);

  const filteredProjects = projects.filter(
    (project) =>
      (project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.client.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === 'all' || project.status === statusFilter)
  );

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
            <FolderKanban className="w-4 h-4" />
            <span className="text-sm">Gestão de Projetos</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Projetos</h1>
        </div>
        <button
          onClick={() => setNewProjectOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Projeto</span>
        </button>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar projetos..."
            className="input-base"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
        >
          <option value="all">Todos os estados</option>
          <option value="lead">Lead</option>
          <option value="negotiation">Negociação</option>
          <option value="active">Ativo</option>
          <option value="paused">Pausado</option>
          <option value="completed">Concluído</option>
        </select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate(`/projects/${project.id}`)}
            className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-card-hover transition-all duration-200 group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className={`px-2 py-1 rounded text-[10px] font-semibold uppercase ${statusColors[project.status]}`}>
                  {statusLabels[project.status]}
                </span>
              </div>
              <button className="p-1 rounded hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{project.client}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{new Date(project.deadline).toLocaleDateString('pt-PT')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Euro className="w-4 h-4 text-muted-foreground" />
                <span>
                  {new Intl.NumberFormat('pt-PT', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(project.budget)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>{project.team.join(', ')}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{project.phase}</span>
                <span className="text-xs text-muted-foreground">{project.hoursLogged}h</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 px-6 rounded-xl border border-dashed border-border bg-muted/20"
        >
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <FolderKanban className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">Nenhum projeto encontrado</p>
          <p className="text-sm text-muted-foreground/80 mt-1">Tenta ajustar os filtros ou cria um novo projeto</p>
        </motion.div>
      )}

      <NewProjectDialog
        open={newProjectOpen}
        onOpenChange={setNewProjectOpen}
        onSuccess={addProject}
        clients={clients}
      />
    </div>
  );
}
