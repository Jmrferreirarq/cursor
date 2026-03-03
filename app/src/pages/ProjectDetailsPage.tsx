import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, FolderKanban, Calendar, Euro, MapPin, Clock,
  FileText, ClipboardCheck, Edit3, Check, X, User, ShieldCheck,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '@/context/DataContext';
import { getChecklistForProject } from '@/lib/checklistAutoCreate';
import LegalConformidadePanel from '@/components/projects/LegalConformidadePanel';
import type { Project } from '@/types';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  lead: { label: 'Lead', color: 'bg-slate-500/20 text-slate-400' },
  negotiation: { label: 'Negociação', color: 'bg-amber-500/20 text-amber-400' },
  active: { label: 'Ativo', color: 'bg-emerald-500/20 text-emerald-400' },
  paused: { label: 'Pausado', color: 'bg-slate-500/20 text-slate-400' },
  completed: { label: 'Concluído', color: 'bg-blue-500/20 text-blue-400' },
  cancelled: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400' },
};

const PHASES = ['Estudo Prévio', 'Ante-Projecto', 'Licenciamento', 'Projecto de Execução', 'Obra', 'Concluído'];

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(v);

const formatDate = (d: string) =>
  d ? new Date(d).toLocaleDateString('pt-PT') : '—';

export default function ProjectDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { projects, proposals, updateProject } = useData();

  const project = useMemo(() => projects.find((p) => p.id === id), [projects, id]);
  const linkedProposals = useMemo(() => {
    if (!project) return [];
    // Preferir proposalIds armazenados; fallback por clientId ou nome
    if (project.proposalIds?.length) {
      return proposals.filter((p) => project.proposalIds!.includes(p.id));
    }
    if (project.clientId) {
      return proposals.filter((p) => p.clientId === project.clientId);
    }
    return proposals.filter((p) => p.clientName === project.client);
  }, [proposals, project]);
  const checklist = useMemo(() => id ? getChecklistForProject(id) : null, [id]);

  const [editingPhase, setEditingPhase] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'legal'>('overview');

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <FolderKanban className="w-12 h-12 text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-bold mb-2">Projeto não encontrado</h2>
        <button onClick={() => navigate('/projects')} className="text-primary hover:underline">
          Voltar aos projetos
        </button>
      </div>
    );
  }

  const status = STATUS_CONFIG[project.status] || STATUS_CONFIG.active;
  const currentPhaseIdx = PHASES.indexOf(project.phase);

  const handleStatusChange = (newStatus: Project['status']) => {
    updateProject(project.id, { status: newStatus });
    setEditingStatus(false);
  };

  const handlePhaseChange = (newPhase: string) => {
    updateProject(project.id, { phase: newPhase });
    setEditingPhase(false);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 px-3 py-2 -ml-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
      </motion.div>

      {/* Project Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {!editingStatus ? (
                <button
                  onClick={() => setEditingStatus(true)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${status.color} hover:opacity-80 transition-opacity`}
                >
                  {status.label}
                </button>
              ) : (
                <div className="flex gap-1 flex-wrap">
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => handleStatusChange(key as Project['status'])}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${cfg.color} hover:opacity-80 transition-opacity ${project.status === key ? 'ring-2 ring-primary' : ''}`}
                    >
                      {cfg.label}
                    </button>
                  ))}
                  <button onClick={() => setEditingStatus(false)} className="p-1 text-muted-foreground hover:text-foreground">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {!editingPhase ? (
                <button
                  onClick={() => setEditingPhase(true)}
                  className="px-2 py-0.5 text-xs text-muted-foreground bg-muted rounded hover:bg-muted/80 flex items-center gap-1"
                >
                  {project.phase || 'Sem fase'}
                  <Edit3 className="w-3 h-3" />
                </button>
              ) : (
                <div className="flex gap-1 flex-wrap">
                  {PHASES.map((ph) => (
                    <button
                      key={ph}
                      onClick={() => handlePhaseChange(ph)}
                      className={`px-2 py-0.5 text-xs rounded ${project.phase === ph ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                    >
                      {ph}
                    </button>
                  ))}
                  <button onClick={() => setEditingPhase(false)} className="p-1 text-muted-foreground hover:text-foreground">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground flex items-center gap-1">
              <User className="w-4 h-4" />
              {project.client}
            </p>
          </div>
          <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
            <FolderKanban className="w-7 h-7 text-primary" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Euro className="w-4 h-4" />
              <span className="text-sm">Orçamento</span>
            </div>
            <p className="text-lg font-semibold">{formatCurrency(project.budget)}</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Horas</span>
            </div>
            <p className="text-lg font-semibold">{project.hoursLogged}h</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Prazo</span>
            </div>
            <p className="text-lg font-semibold">{formatDate(project.deadline)}</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Local</span>
            </div>
            <p className="text-lg font-semibold">{project.municipality || project.address || '—'}</p>
          </div>
        </div>
      </motion.div>

      {/* Phase Progress */}
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
        className="flex gap-1 p-1 bg-muted rounded-xl w-fit"
      >
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <FolderKanban className="w-4 h-4" />
          Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('legal')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'legal' ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <ShieldCheck className="w-4 h-4" />
          Conformidade Legal
          {project.projectType && (
            <span className="w-2 h-2 rounded-full bg-primary" />
          )}
        </button>
      </motion.div>

      {/* Tab: Legal */}
      {activeTab === 'legal' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <LegalConformidadePanel
            projectType={project.projectType}
            phase={project.phase}
            municipality={project.municipality}
          />
        </motion.div>
      )}

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <>

      {/* Phase Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Progresso por fase</h3>
        <div className="space-y-3">
          {PHASES.map((phase, idx) => {
            const isCurrent = project.phase === phase;
            const isDone = idx < currentPhaseIdx;
            return (
              <div key={phase} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isDone ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm ${isCurrent ? 'font-semibold' : isDone ? 'text-muted-foreground line-through' : 'text-muted-foreground'}`}>{phase}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isDone ? 'bg-emerald-500' : isCurrent ? 'bg-primary' : 'bg-transparent'}`}
                      style={{ width: isDone ? '100%' : isCurrent ? '50%' : '0%' }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {/* Checklist */}
        <button
          onClick={() => navigate('/checklist')}
          className="flex items-start gap-4 p-5 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors text-left"
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${checklist ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
            <ClipboardCheck className={`w-6 h-6 ${checklist ? 'text-emerald-500' : 'text-amber-500'}`} />
          </div>
          {checklist ? (() => {
            const total = Object.keys(checklist.items).length;
            const conforme = Object.values(checklist.items).filter((s) => s === 'conforme').length;
            const na = Object.values(checklist.items).filter((s) => s === 'nao_aplicavel').length;
            const pendente = total - conforme - na;
            const pct = total > 0 ? Math.round((conforme / (total - na || 1)) * 100) : 0;
            return (
              <div className="flex-1 min-w-0">
                <p className="font-semibold">Checklist de Conformidade</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="text-emerald-500 font-medium">{conforme} conforme</span>
                  <span>{pendente} pendente</span>
                  {na > 0 && <span>{na} N/A</span>}
                </div>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{pct}% concluído</p>
              </div>
            );
          })() : (
            <div>
              <p className="font-semibold">Checklist de Conformidade</p>
              <p className="text-sm text-muted-foreground">Nenhuma checklist — criar manualmente</p>
            </div>
          )}
        </button>

        {/* Proposals */}
        <button
          onClick={() => navigate('/proposals')}
          className="flex items-center gap-4 p-5 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="font-semibold">Propostas</p>
            <p className="text-sm text-muted-foreground">
              {linkedProposals.length > 0
                ? `${linkedProposals.length} proposta(s) associada(s)`
                : 'Nenhuma proposta associada'}
            </p>
          </div>
        </button>
      </motion.div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Datas</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Início</span>
              <span className="font-medium">{formatDate(project.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Prazo</span>
              <span className="font-medium">{formatDate(project.deadline)}</span>
            </div>
          </div>
        </div>

        {project.description && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Descrição</h3>
            <p className="text-sm text-muted-foreground">{project.description}</p>
          </div>
        )}
      </motion.div>
        </>
      )}
    </div>
  );
}
