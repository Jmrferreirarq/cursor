import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus, Image, ListTodo, Calendar, BarChart3, FileText, ArrowRight, Euro, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { useTime } from '@/context/TimeContext';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { useMedia } from '@/context/MediaContext';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/locales';
import { DashboardSkeleton } from '@/components/common/Skeleton';
import { getLegislationAlerts } from '@/lib/legislationAlerts';
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
  { id: '1', name: 'JOSÉ FERREIRA', role: 'Arquiteto / Diretor', targetHours: 40, loggedHours: 0, email: 'jmrferreirarq@gmail.com' },
];

export default function DashboardPage() {
  const { greeting } = useTime();
  const navigate = useNavigate();
  const { isReady, projects, proposals } = useData();
  const { assets, posts } = useMedia();
  const { language } = useLanguage();
  const d = (key: string) => t(`dashboard.${key}`, language);

  if (!isReady) return <DashboardSkeleton />;

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

  const pipelineStats = useMemo(() => {
    const leads = projects.filter((p) => p.status === 'lead').length;
    const negotiation = projects.filter((p) => p.status === 'negotiation').length;
    const closed = projects.filter((p) => p.status === 'active' || p.status === 'completed').length;
    const potentialValue = projects
      .filter((p) => ['lead', 'negotiation', 'active'].includes(p.status))
      .reduce((sum, p) => sum + p.budget, 0);
    return { leads, negotiation, closed, potentialValue };
  }, [projects]);

  // KPIs de faturação reais baseados nas tranches das propostas
  const billingKPIs = useMemo(() => {
    let totalReceived = 0;
    let totalInvoiced = 0;
    let totalPending = 0;
    let totalContracts = 0;

    proposals.forEach((p) => {
      const tranches = p.paymentTranches || [];
      if (tranches.length === 0) return;
      totalContracts++;
      tranches.forEach((t) => {
        if (t.status === 'paid') totalReceived += t.value;
        else if (t.status === 'invoiced') totalInvoiced += t.value;
        else totalPending += t.value;
      });
    });

    const totalProposals = proposals.length;
    const won = proposals.filter((p) => p.status === 'accepted').length;
    const lost = proposals.filter((p) => p.status === 'lost' || p.status === 'rejected').length;
    const pending = proposals.filter((p) => p.status === 'sent' || p.status === 'draft').length;
    const conversionRate = totalProposals > 0 ? Math.round((won / totalProposals) * 100) : 0;

    return {
      totalReceived,
      totalInvoiced,
      totalPending,
      totalContracts,
      totalProposals,
      won,
      lost,
      pending,
      conversionRate,
    };
  }, [proposals]);

  const cashflowStats = useMemo(() => ({
    netAmount: billingKPIs.totalReceived,
    overdueAmount: billingKPIs.totalPending,
    next7DaysAmount: billingKPIs.totalInvoiced,
  }), [billingKPIs]);

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
            <span className="text-sm">{t('pages.dashboard', language)}</span>
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
          <span>{d('newProposal')}</span>
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
          {d('contentFactory')}
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
                <p className="font-medium text-sm">{d('mediaInbox')}</p>
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
                <p className="font-medium text-sm">{d('inQueue')}</p>
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
                <p className="font-medium text-sm">{d('scheduled')}</p>
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
                <p className="font-medium text-sm">{d('publishedThisMonth')}</p>
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
                  <p className="font-medium text-sm">{d('activeProposals')}</p>
                  <p className="text-2xl font-bold">{proposals.filter((p) => p.status === 'sent').length}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Billing KPI Strip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
      >
        {[
          {
            label: 'Recebido',
            value: billingKPIs.totalReceived > 0
              ? billingKPIs.totalReceived.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
              : '—',
            icon: CheckCircle,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            onClick: () => navigate('/billing'),
          },
          {
            label: 'Faturado',
            value: billingKPIs.totalInvoiced > 0
              ? billingKPIs.totalInvoiced.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
              : '—',
            icon: FileText,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            onClick: () => navigate('/billing'),
          },
          {
            label: 'Pendente',
            value: billingKPIs.totalPending > 0
              ? billingKPIs.totalPending.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
              : '—',
            icon: Clock,
            color: 'text-slate-400',
            bg: 'bg-slate-500/10',
            onClick: () => navigate('/billing'),
          },
          {
            label: 'Propostas',
            value: String(billingKPIs.totalProposals),
            icon: FileText,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            onClick: () => navigate('/proposals'),
          },
          {
            label: 'Ganhas',
            value: String(billingKPIs.won),
            icon: CheckCircle,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            onClick: () => navigate('/proposals'),
          },
          {
            label: 'Taxa de sucesso',
            value: `${billingKPIs.conversionRate}%`,
            icon: TrendingUp,
            color: billingKPIs.conversionRate >= 50 ? 'text-emerald-400' : billingKPIs.conversionRate >= 25 ? 'text-amber-400' : 'text-slate-400',
            bg: 'bg-primary/10',
            onClick: () => navigate('/proposals'),
          },
        ].map(({ label, value, icon: Icon, color, bg, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border hover:border-primary/40 transition-all text-left group"
          >
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground truncate">{label}</p>
              <p className={`text-base font-bold ${color}`}>{value}</p>
            </div>
          </button>
        ))}
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
        <DayPanel delayed={0} sevenDays={0} rec={0} delay={0} />
        <CashflowCard netAmount={cashflowStats.netAmount} overdueAmount={cashflowStats.overdueAmount} next7DaysAmount={cashflowStats.next7DaysAmount} delay={1} />
        <PipelineCard potentialValue={pipelineStats.potentialValue} leads={pipelineStats.leads} negotiation={pipelineStats.negotiation} closed={pipelineStats.closed} delay={2} />
        <HealthIndexCard
          score={100}
          deadlines={100}
          cash={100}
          production={100}
          risk={0}
          quote="A aguardar dados."
          delay={3}
        />
        <AlertsCard
          hasAlerts={getLegislationAlerts(projects).length > 0}
          alerts={getLegislationAlerts(projects).slice(0, 3).map(a =>
            `${a.diplomaSigla} (${a.tipo === 'alterado_2024' ? 'alterado' : 'novo'}) afeta ${a.projectName}`
          )}
          delay={4}
        />
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
