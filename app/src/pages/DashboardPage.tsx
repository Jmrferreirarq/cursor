import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus } from 'lucide-react';
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
