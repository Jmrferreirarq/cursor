import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus, TrendingUp, Clock, FolderKanban } from 'lucide-react';
import { useTime } from '@/context/TimeContext';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import DayPanel from '@/components/dashboard/DayPanel';
import CashflowCard from '@/components/dashboard/CashflowCard';
import PipelineCard from '@/components/dashboard/PipelineCard';
import HealthIndexCard from '@/components/dashboard/HealthIndexCard';
import AlertsCard from '@/components/dashboard/AlertsCard';
import NeuralLinkCard from '@/components/dashboard/NeuralLinkCard';
import ProductionHours from '@/components/dashboard/ProductionHours';
import ActiveProjects from '@/components/dashboard/ActiveProjects';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import type { TeamMember } from '@/types';

const mockTeam: TeamMember[] = [
  { id: '1', name: 'CEO', role: 'Diretor', targetHours: 40, loggedHours: 0, email: 'ceo@fa360.pt' },
  { id: '2', name: 'JÉSSICA', role: 'Arquiteta', targetHours: 40, loggedHours: 0, email: 'jessica@fa360.pt' },
  { id: '3', name: 'SOFIA', role: 'Arquiteta', targetHours: 40, loggedHours: 0, email: 'sofia@fa360.pt' },
];

export default function DashboardPage() {
  const { greeting } = useTime();
  const navigate = useNavigate();
  const { projects } = useData();
  const activeProjects = projects.filter((p) =>
    ['lead', 'negotiation', 'active'].includes(p.status)
  );

  // Quick stats
  const stats = {
    activeCount: projects.filter((p) => p.status === 'active').length,
    negotiationCount: projects.filter((p) => p.status === 'negotiation').length,
    totalBudget: projects.filter((p) => p.status === 'active').reduce((sum, p) => sum + p.budget, 0),
  };

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
        transition={{ duration: 0.4 }}
        className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide uppercase">Comando Operacional</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {greeting}, <span className="text-primary">Ferreira</span>.
          </h1>
          <p className="text-muted-foreground mt-2">
            Visão geral do atelier • {new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <button
          onClick={() => navigate('/proposals')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors w-fit shadow-lg shadow-primary/25"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Proposta</span>
        </button>
      </motion.div>

      {/* Quick Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <FolderKanban className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Projetos Ativos</span>
            </div>
            <p className="text-3xl font-bold">{stats.activeCount}</p>
            <p className="text-sm text-muted-foreground mt-1">em execução</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/20 rounded-2xl p-5 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Em Negociação</span>
            </div>
            <p className="text-3xl font-bold">{stats.negotiationCount}</p>
            <p className="text-sm text-muted-foreground mt-1">propostas pendentes</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 rounded-2xl p-5 relative overflow-hidden group hover:border-primary/40 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 text-primary mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Volume Ativo</span>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(stats.totalBudget)}</p>
            <p className="text-sm text-muted-foreground mt-1">em projetos ativos</p>
          </div>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4"
      >
        <DayPanel delayed={0} sevenDays={0} rec={0} delay={0} />
        <CashflowCard netAmount={0} overdueAmount={0} next7DaysAmount={0} delay={1} />
        <PipelineCard potentialValue={0} leads={0} negotiation={0} closed={0} delay={2} />
        <HealthIndexCard
          score={100}
          deadlines={100}
          cash={100}
          production={100}
          risk={0}
          quote="A aguardar dados."
          delay={3}
        />
        <AlertsCard hasAlerts={false} delay={4} />
        <NeuralLinkCard delay={5} />
      </motion.div>

      {/* Production Hours & Active Projects */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <ProductionHours team={mockTeam} delay={6} />
        <ActiveProjects
          projects={activeProjects}
          onNewProject={() => navigate('/projects')}
          delay={7}
        />
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Análise & Performance</h2>
        </div>
        <DashboardCharts />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { label: 'Projetos', path: '/projects', icon: FolderKanban },
          { label: 'Clientes', path: '/clients', icon: () => <span className="text-lg">👥</span> },
          { label: 'Calendário', path: '/calendar', icon: () => <span className="text-lg">📅</span> },
          { label: 'Media Hub', path: '/media', icon: () => <span className="text-lg">🖼️</span> },
        ].map((action, index) => (
          <motion.button
            key={action.path}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.05 }}
            onClick={() => navigate(action.path)}
            className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:bg-muted/50 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              {typeof action.icon === 'function' ? (
                <action.icon />
              ) : (
                <action.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              )}
            </div>
            <span className="font-medium text-sm">{action.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
