import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Plus, Search, Calendar, Users, Euro, ArrowUpRight, LayoutGrid, List } from 'lucide-react';
import type { Project } from '@/types';
import NewProjectDialog from '@/components/projects/NewProjectDialog';
import { useData } from '@/context/DataContext';

const statusConfig = {
  lead: { label: 'Lead', color: 'bg-slate-500/20 text-slate-400', dot: 'bg-slate-400' },
  negotiation: { label: 'Negociação', color: 'bg-amber-500/20 text-amber-400', dot: 'bg-amber-400' },
  active: { label: 'Ativo', color: 'bg-emerald-500/20 text-emerald-400', dot: 'bg-emerald-400' },
  paused: { label: 'Pausado', color: 'bg-slate-500/20 text-slate-400', dot: 'bg-slate-400' },
  completed: { label: 'Concluído', color: 'bg-blue-500/20 text-blue-400', dot: 'bg-blue-400' },
  cancelled: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400', dot: 'bg-red-400' },
};

const statusFilters = [
  { id: 'all', label: 'Todos' },
  { id: 'active', label: 'Ativos' },
  { id: 'negotiation', label: 'Negociação' },
  { id: 'lead', label: 'Leads' },
  { id: 'completed', label: 'Concluídos' },
  { id: 'paused', label: 'Pausados' },
];

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { projects, addProject, clients } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [newProjectOpen, setNewProjectOpen] = useState(false);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.phase?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  // Contagem por status
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: projects.length };
    projects.forEach((p) => {
      counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return counts;
  }, [projects]);

  // Separar projeto destacado
  const featuredProject = viewMode === 'cards' ? filteredProjects.find(p => p.status === 'active') || filteredProjects[0] : null;
  const otherProjects = viewMode === 'cards' && featuredProject 
    ? filteredProjects.filter(p => p.id !== featuredProject.id) 
    : filteredProjects;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <FolderKanban className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide uppercase">Gestão</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Projetos</h1>
          <p className="text-muted-foreground mt-2">
            {projects.length} projetos • {statusCounts['active'] || 0} ativos
          </p>
        </div>
        <button
          onClick={() => setNewProjectOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Projeto</span>
        </button>
      </motion.div>

      {/* Search + View Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar projetos..."
            className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-sm"
          />
        </div>

        <div className="flex bg-muted/50 border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              viewMode === 'cards' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Cards</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              viewMode === 'list' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Lista</span>
          </button>
        </div>
      </motion.div>

      {/* Status Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap gap-2"
      >
        {statusFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setStatusFilter(filter.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              statusFilter === filter.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {filter.label}
            {statusCounts[filter.id] !== undefined && (
              <span className="ml-1.5 text-xs opacity-70">
                ({statusCounts[filter.id] || 0})
              </span>
            )}
          </button>
        ))}
      </motion.div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredProjects.length} {filteredProjects.length === 1 ? 'resultado' : 'resultados'}
        </p>
      </div>

      {/* Cards View */}
      {viewMode === 'cards' && filteredProjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Featured Project + Side Grid */}
          {featuredProject && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Featured Card */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => navigate(`/projects/${featuredProject.id}`)}
                className="lg:col-span-2 group cursor-pointer"
              >
                <div className="relative h-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-border rounded-2xl p-6 hover:border-primary/40 transition-all duration-300 overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  
                  <div className="relative">
                    {/* Status */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[featuredProject.status].color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[featuredProject.status].dot}`} />
                        {statusConfig[featuredProject.status].label}
                      </span>
                      <span className="text-xs text-muted-foreground">{featuredProject.phase}</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {featuredProject.name}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-6">{featuredProject.client}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Orçamento</p>
                        <p className="text-xl font-bold">{formatCurrency(featuredProject.budget)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Prazo</p>
                        <p className="text-xl font-bold">{new Date(featuredProject.deadline).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Horas</p>
                        <p className="text-xl font-bold">{featuredProject.hoursLogged}h</p>
                      </div>
                    </div>

                    {/* Team */}
                    <div className="mt-6 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{featuredProject.team.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </motion.article>

              {/* Side smaller cards */}
              <div className="space-y-4">
                {otherProjects.slice(0, 2).map((project, index) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    index={index}
                    compact
                    onClick={() => navigate(`/projects/${project.id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Rest of projects */}
          {otherProjects.length > 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {otherProjects.slice(2).map((project, index) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  index={index + 2}
                  onClick={() => navigate(`/projects/${project.id}`)}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* List View */}
      {viewMode === 'list' && filteredProjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Projeto</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Estado</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Prazo</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Orçamento</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project, index) => (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors">{project.name}</p>
                      <p className="text-sm text-muted-foreground">{project.client}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[project.status].color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[project.status].dot}`} />
                      {statusConfig[project.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(project.deadline).toLocaleDateString('pt-PT')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-semibold">{formatCurrency(project.budget)}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 px-6 rounded-xl border border-dashed border-border bg-muted/10"
        >
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <FolderKanban className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">Nenhum projeto encontrado</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Ajusta os filtros ou cria um novo projeto</p>
          {(searchQuery || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="mt-4 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Limpar filtros
            </button>
          )}
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

// Project Card Component
function ProjectCard({ 
  project, 
  index, 
  compact = false,
  onClick 
}: { 
  project: Project; 
  index: number;
  compact?: boolean;
  onClick: () => void;
}) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={`group cursor-pointer bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-lg transition-all duration-200 ${
        compact ? 'p-4' : 'p-5'
      }`}
    >
      {/* Status */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${statusConfig[project.status].color}`}>
          <span className={`w-1 h-1 rounded-full ${statusConfig[project.status].dot}`} />
          {statusConfig[project.status].label}
        </span>
        {!compact && (
          <span className="text-xs text-muted-foreground">{project.phase}</span>
        )}
      </div>

      {/* Title */}
      <h3 className={`font-semibold group-hover:text-primary transition-colors line-clamp-1 ${compact ? 'text-base mb-1' : 'text-lg mb-1'}`}>
        {project.name}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{project.client}</p>

      {/* Info */}
      <div className={`space-y-2 ${compact ? 'text-xs' : 'text-sm'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(project.deadline).toLocaleDateString('pt-PT')}</span>
          </div>
          <span className="font-semibold">{formatCurrency(project.budget)}</span>
        </div>
      </div>

      {/* Team - only on non-compact */}
      {!compact && (
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground truncate">{project.team.join(', ')}</span>
          </div>
        </div>
      )}
    </motion.article>
  );
}
