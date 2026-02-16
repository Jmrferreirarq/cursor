import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus, Image, ListTodo, Calendar, BarChart3, FileText, ArrowRight } from 'lucide-react';
import { useTime } from '@/context/TimeContext';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { useMedia } from '@/context/MediaContext';
import DayPanel from '@/components/dashboard/DayPanel';
import CashflowCard from '@/components/dashboard/CashflowCard';
import PipelineCard from '@/components/dashboard/PipelineCard';
import HealthIndexCard from '@/components/dashboard/HealthIndexCard';
import AlertsCard from '@/components/dashboard/AlertsCard';
import NeuralLinkCard from '@/components/dashboard/NeuralLinkCard';
import ProductionHours from '@/components/dashboard/ProductionHours';
import ActiveProjects from '@/components/dashboard/ActiveProjects';
import type { TeamMember } from '@/types';

const mockTeam: TeamMember[] = [
  { id: '1', name: 'CEO', role: 'Diretor', targetHours: 40, loggedHours: 0, email: 'ceo@fa360.pt' },
  { id: '2', name: 'JÉSSICA', role: 'Arquiteta', targetHours: 40, loggedHours: 0, email: 'jessica@fa360.pt' },
  { id: '3', name: 'SOFIA', role: 'Arquiteta', targetHours: 40, loggedHours: 0, email: 'sofia@fa360.pt' },
];

export default function DashboardPage() {
  const { greeting } = useTime();
  const navigate = useNavigate();
  const { projects, proposals } = useData();
  const { assets, posts } = useMedia();

  const contentFactoryStats = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const mediaInbox = assets.length;
    const naQueue = posts.filter((p) => ['inbox', 'generated', 'review', 'rejected', 'approved'].includes(p.status)).length;
    const agendados = posts.filter((p) => p.status === 'scheduled').length;
    const publicadosEsteMes = posts.filter((p) => {
      if (p.status !== 'published' || !p.publishedDate) return false;
      const d = new Date(p.publishedDate);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;
    return { mediaInbox, naQueue, agendados, publicadosEsteMes };
  }, [assets, posts]);

  const activeProjects = projects.filter((p) =>
    ['lead', 'negotiation', 'active'].includes(p.status)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Comando Operacional</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {greeting}, <span className="text-primary">Ferreira</span>.
          </h1>
        </div>
        <button
          onClick={() => navigate('/proposals')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Proposta</span>
        </button>
      </motion.div>

      {/* Content Factory — Resumo */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-card border border-border rounded-xl p-5"
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Content Factory — Resumo
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
          <button
            onClick={() => navigate('/media')}
            className="flex items-center justify-between gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Image className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Media Inbox</p>
                <p className="text-2xl font-bold">{contentFactoryStats.mediaInbox}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </button>
          <button
            onClick={() => navigate('/planner')}
            className="flex items-center justify-between gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <ListTodo className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Na Queue</p>
                <p className="text-2xl font-bold">{contentFactoryStats.naQueue}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </button>
          <button
            onClick={() => navigate('/planner')}
            className="flex items-center justify-between gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Agendados</p>
                <p className="text-2xl font-bold">{contentFactoryStats.agendados}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </button>
          <button
            onClick={() => navigate('/performance')}
            className="flex items-center justify-between gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Publicados este mês</p>
                <p className="text-2xl font-bold">{contentFactoryStats.publicadosEsteMes}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </button>
          {proposals.filter((p) => p.status === 'sent').length > 0 && (
            <button
              onClick={() => navigate('/proposals')}
              className="flex items-center justify-between gap-3 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Propostas Ativas</p>
                  <p className="text-2xl font-bold">{proposals.filter((p) => p.status === 'sent').length}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </button>
          )}
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
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
        <NeuralLinkCard isOnline={false} message="Conexão Sheets pendente" delay={5} />
      </div>

      {/* Production Hours & Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProductionHours team={mockTeam} delay={6} />
        <ActiveProjects
          projects={activeProjects}
          onNewProject={() => navigate('/projects')}
          delay={7}
        />
      </div>
    </div>
  );
}
