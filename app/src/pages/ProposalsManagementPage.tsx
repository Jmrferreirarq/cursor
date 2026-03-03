import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Calculator, Sparkles, Trash2, ExternalLink, Copy, Check, PenLine, Send, Clock, CheckCircle2, XCircle, AlertTriangle, BarChart3, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, Search, Filter, Download, X } from 'lucide-react';
import { compareProposals, type ProposalComparison } from '@/lib/proposalComparison';
import { toast } from 'sonner';

/** Status efetivo — propostas antigas podem não ter status */
const getStatus = (p: { status?: string }) => (p.status || 'draft') as 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'lost';
import { useData } from '@/context/DataContext';
import { useState, useMemo } from 'react';
import type { Proposal } from '@/types';

function daysSince(dateStr?: string): number | null {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

const projectTypes: Record<string, string> = {
  'habitacao_unifamiliar': 'Habitação Unifamiliar',
  'habitacao_multifamiliar': 'Habitação Multifamiliar',
  'habitacao_coletiva': 'Habitação Coletiva',
  'habitacao_apartamento': 'Apartamento',
  'habitacao_moradia': 'Moradia',
  'comercio_servicos': 'Comércio e Serviços',
  'comercio': 'Comércio / Loja',
  'escritorio': 'Escritório',
  'restaurante': 'Restaurante / Bar',
  'hotel': 'Hotel / Hotelaria',
  'clinica': 'Clínica / Consultório',
  'armazem_comercial': 'Armazém Comercial',
  'industrial': 'Industrial',
  'industria': 'Indústria',
  'logistica': 'Logística / Armazém',
  'laboratorio': 'Laboratório',
  'equipamentos': 'Equipamentos',
  'reabilitacao': 'Reabilitação',
  'reabilitacao_integral': 'Reabilitação Integral',
  'restauro': 'Restauro / Conservação',
  'interiores': 'Interiores',
  'paisagismo': 'Arranjos Exteriores',
  'anexo': 'Anexo / Ampliação',
  'agricola': 'Agrícola / Rural',
  'urbanismo': 'Urbanismo',
  // Loteamento
  'loteamento_urbano': 'Loteamento Urbano',
  'loteamento_industrial': 'Loteamento Industrial / Logístico',
  'destaque_parcela': 'Destaque de Parcela',
  'reparcelamento': 'Reparcelamento',
  // Apoios de Praia (POC)
  'praia_apm': 'Apoio de Praia Mínimo (APM)',
  'praia_aps': 'Apoio de Praia Simples (APS)',
  'praia_apc': 'Apoio de Praia Completo (APC)',
  'praia_eap': 'Equipamento c/ funções Apoio Praia (EAP)',
  'praia_appd': 'Apoio Praia Prática Desportiva (APPD)',
  'praia_ab': 'Apoio Balnear (AB)',
  'praia_ar': 'Apoio Recreativo (AR)',
  'praia_ec': 'Equipamento Complementar (Ec)',
};

export default function ProposalsManagementPage() {
  const navigate = useNavigate();
  const { proposals, deleteProposal, updateProposalStatus, acceptProposal } = useData();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [collapsedYears, setCollapsedYears] = useState<Set<string>>(new Set(['2022', '2023', '2024', '2025', '2026']));
  const comparison = showComparison ? compareProposals(proposals) : null;

  // Filtros avançados
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [filterMinValue, setFilterMinValue] = useState('');
  const [filterMaxValue, setFilterMaxValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Extrai o ano de uma proposta — tenta referência, depois projectName, depois createdAt
  const getProposalYear = (p: typeof proposals[0]): string => {
    const yearRegex = /(20\d{2})/;
    return (
      yearRegex.exec(p.reference ?? '')?.[1] ||
      yearRegex.exec(p.projectName ?? '')?.[1] ||
      p.createdAt?.slice(0, 4) ||
      'Sem data'
    );
  };

  // Anos disponíveis — sempre inclui 2022-2026, mais quaisquer outros anos presentes
  const availableYears = useMemo(() => {
    const fromData = new Set(proposals.map((p) => getProposalYear(p)).filter((y) => y !== 'Sem data'));
    const defaultRange = ['2022', '2023', '2024', '2025', '2026'];
    const allYears = [...new Set([...defaultRange, ...fromData])];
    return allYears.sort((a, b) => b.localeCompare(a));
  }, [proposals]);

  // Exportar CSV
  const exportCsv = () => {
    const rows = [
      ['Referência', 'Cliente', 'Projeto', 'Tipologia', 'Estado', 'Total c/IVA (€)', 'Data', 'Localização'],
      ...filteredProposals.map((p) => [
        p.reference || '',
        p.clientName,
        p.projectName || '',
        projectTypes[p.projectType || ''] || p.projectType || '',
        getStatus(p),
        (p.totalValue || 0).toFixed(2).replace('.', ','),
        p.createdAt ? new Date(p.createdAt).toLocaleDateString('pt-PT') : '',
        p.location || '',
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\r\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `propostas_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exportado');
  };

  const toggleYear = (year: string) => {
    setCollapsedYears(prev => {
      const next = new Set(prev);
      next.has(year) ? next.delete(year) : next.add(year);
      return next;
    });
  };

  // Propostas filtradas
  const filteredProposals = useMemo(() => {
    const minVal = parseFloat(filterMinValue) || 0;
    const maxVal = parseFloat(filterMaxValue) || Infinity;
    return proposals.filter((p) => {
      if (filterStatus !== 'all' && getStatus(p) !== filterStatus) return false;
      if (filterYear !== 'all') {
        if (getProposalYear(p) !== filterYear) return false;
      }
      const val = p.totalValue || 0;
      if (val < minVal || val > maxVal) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !p.clientName.toLowerCase().includes(q) &&
          !(p.projectName || '').toLowerCase().includes(q) &&
          !(p.reference || '').toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [proposals, filterStatus, filterYear, filterMinValue, filterMaxValue, search]);

  const proposalsByYear = useMemo(() => {
    // Inicializa sempre com 2022–2026 (mesmo que vazios)
    const DEFAULT_YEARS = ['2022', '2023', '2024', '2025', '2026'];
    const groups: Record<string, typeof proposals> = {};
    DEFAULT_YEARS.forEach(y => { groups[y] = []; });

    filteredProposals.forEach(p => {
      const year = getProposalYear(p);
      (groups[year] = groups[year] || []).push(p);
    });

    // Ordenar por ano decrescente — todos os grupos aparecem (incluindo vazios do range padrão)
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [filteredProposals]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleCopyLink = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast.success('Link copiado!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Não foi possível copiar');
    }
  };

  const handleOpenLink = (url: string) => {
    window.open(url, '_blank');
  };

  const handleDelete = (id: string, clientName: string) => {
    if (confirm(`Tens a certeza que queres eliminar a proposta de ${clientName}?`)) {
      deleteProposal(id);
      toast.success('Proposta eliminada');
    }
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
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide uppercase">Comercial</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Propostas</h1>
          <p className="text-muted-foreground mt-2">
            Gestão de propostas de honorários
          </p>
        </div>
        <button
          onClick={() => navigate('/calculator')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Proposta</span>
        </button>
      </motion.div>

      {/* Proposals List */}
      {proposals.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-border bg-muted/30 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Propostas Guardadas
                <span className="ml-2 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                  {filteredProposals.length}{filteredProposals.length !== proposals.length && `/${proposals.length}`}
                </span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters((v) => !v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors ${showFilters ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  Filtros
                </button>
                <button
                  onClick={exportCsv}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-border text-muted-foreground hover:border-primary/40 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  CSV
                </button>
              </div>
            </div>

            {/* Search + filters */}
            <div className="flex gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pesquisar cliente, projeto, referência..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {showFilters && (
              <div className="flex gap-2 flex-wrap pt-1 border-t border-border">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                >
                  <option value="all">Estado: Todos</option>
                  <option value="draft">Rascunho</option>
                  <option value="sent">Enviada</option>
                  <option value="accepted">Adjudicada</option>
                  <option value="rejected">Recusada</option>
                  <option value="lost">Perdida</option>
                </select>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                >
                  <option value="all">Ano: Todos</option>
                  {availableYears.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={filterMinValue}
                  onChange={(e) => setFilterMinValue(e.target.value)}
                  placeholder="Valor mín. (€)"
                  className="w-28 px-3 py-1.5 text-xs bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                />
                <input
                  type="number"
                  value={filterMaxValue}
                  onChange={(e) => setFilterMaxValue(e.target.value)}
                  placeholder="Valor máx. (€)"
                  className="w-28 px-3 py-1.5 text-xs bg-muted border border-border rounded-lg focus:border-primary focus:outline-none"
                />
                {(filterStatus !== 'all' || filterYear !== 'all' || filterMinValue || filterMaxValue) && (
                  <button
                    onClick={() => { setFilterStatus('all'); setFilterYear('all'); setFilterMinValue(''); setFilterMaxValue(''); }}
                    className="px-3 py-1.5 text-xs text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/10 transition-colors"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="divide-y divide-border">
            {proposalsByYear.map(([year, yearProposals]) => {
              const isCollapsed = collapsedYears.has(year);
              const yearTotal = yearProposals.reduce((s, p) => s + p.totalWithVat, 0);
              return (
                <div key={year}>
                  {/* Year header */}
                  <button
                    onClick={() => toggleYear(year)}
                    className="w-full flex items-center justify-between px-5 py-2.5 bg-muted/40 hover:bg-muted/60 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      {isCollapsed ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronUp className="w-4 h-4 text-muted-foreground" />}
                      <span className="font-semibold text-sm">{year}</span>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{yearProposals.length} proposta{yearProposals.length !== 1 ? 's' : ''}</span>
                    </div>
                    <span className="text-sm font-medium text-primary">{formatCurrency(yearTotal)}</span>
                  </button>
                  {/* Proposals for this year */}
                  {!isCollapsed && yearProposals.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {p.clientName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{p.clientName}</p>
                      {p.reference && (
                        <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {p.reference}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {p.projectName || projectTypes[p.projectType] || p.projectType}
                      {p.location && ` · ${p.location}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Criada em {formatDate(p.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Value */}
                  <div className="text-right">
                    <p className="font-bold text-lg text-primary">
                      {formatCurrency(p.totalWithVat)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(p.totalValue)} + IVA
                    </p>
                  </div>

                  {/* Status + ações */}
                  {(() => {
                    const status = getStatus(p);
                    const days = daysSince(p.sentAt || p.createdAt);
                    const statusStyles: Record<string, string> = {
                      draft: 'bg-muted text-muted-foreground',
                      sent: 'bg-blue-500/20 text-blue-400',
                      accepted: 'bg-emerald-500/20 text-emerald-400',
                      rejected: 'bg-red-500/20 text-red-400',
                      expired: 'bg-amber-500/20 text-amber-400',
                      lost: 'bg-orange-500/20 text-orange-400',
                    };
                    const statusLabels: Record<string, string> = {
                      draft: 'Rascunho',
                      sent: 'Enviada',
                      accepted: 'Aceite',
                      rejected: 'Recusada',
                      expired: 'Expirada',
                      lost: 'Perdida',
                    };
                    return (
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2.5 py-1 rounded-full ${statusStyles[status] || statusStyles.draft}`}>
                            {statusLabels[status] || status}
                          </span>
                          {status === 'sent' && days !== null && (
                            <span className={`text-xs flex items-center gap-1 ${days > 14 ? 'text-amber-400' : 'text-muted-foreground'}`}>
                              <Clock className="w-3 h-3" />
                              {days}d
                            </span>
                          )}
                        </div>
                        {status === 'draft' && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); updateProposalStatus(p.id, 'sent'); toast.success('Marcada como enviada'); }}
                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                          >
                            <Send className="w-3 h-3" />
                            Enviada
                          </button>
                        )}
                        {status === 'sent' && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); acceptProposal(p.id); toast.success('Proposta aceite! Projeto criado.'); }}
                              className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-colors"
                              title="Aceitar proposta e criar projeto"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              Aceite
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); updateProposalStatus(p.id, 'rejected'); toast('Proposta marcada como recusada'); }}
                              className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                              title="Marcar como recusada"
                            >
                              <XCircle className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); updateProposalStatus(p.id, 'lost'); toast('Proposta marcada como perdida'); }}
                              className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg transition-colors"
                              title="Marcar como perdida (não adjudicada)"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            {days !== null && days > 30 && (
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); updateProposalStatus(p.id, 'expired'); toast('Proposta expirada'); }}
                                className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg transition-colors"
                                title="Marcar como expirada"
                              >
                                <AlertTriangle className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {p.calculatorState ? (
                      <button
                        onClick={() => navigate('/calculator', { state: { loadProposalId: p.id } })}
                        className="px-3 py-1.5 text-xs font-medium bg-muted hover:bg-primary/10 rounded-lg transition-colors text-muted-foreground hover:text-primary"
                        title="Abrir na calculadora para editar e gerar link"
                      >
                        Resumo
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate('/calculator', { state: { prefillProposalId: p.id } })}
                        className="px-3 py-1.5 text-xs font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg transition-colors"
                        title="Recriar proposta na calculadora (dados básicos preenchidos)"
                      >
                        Recriar
                      </button>
                    )}
                    {p.proposalUrl && (
                      <>
                        <button
                          onClick={() => handleCopyLink(p.proposalUrl!, p.id)}
                          className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                          title="Copiar link"
                        >
                          {copiedId === p.id ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                        <button
                          onClick={() => handleOpenLink(p.proposalUrl!)}
                          className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                          title="Abrir proposta HTML"
                        >
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </>
                    )}
                    {!p.proposalUrl && p.calculatorState && (
                      <button
                        onClick={() => navigate('/calculator', { state: { loadProposalId: p.id } })}
                        className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                        title="Gerar link na calculadora"
                      >
                        <PenLine className="w-4 h-4 text-muted-foreground" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(p.id, p.clientName)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Eliminar proposta"
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
                </div>
              );
            })}
          </div>
        </motion.div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-12 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Calculator className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Nenhuma proposta guardada</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            As propostas criadas na Calculadora aparecem aqui automaticamente quando geras um link.
          </p>
          <button
            onClick={() => navigate('/calculator')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            <Calculator className="w-5 h-5" />
            <span>Ir para a Calculadora</span>
          </button>
        </motion.div>
      )}

      {/* Comparison Toggle */}
      {proposals.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border transition-colors ${showComparison ? 'bg-primary/5 border-primary/30' : 'bg-muted/30 border-border hover:border-primary/20'}`}
          >
            <div className="flex items-center gap-3">
              <BarChart3 className={`w-5 h-5 ${showComparison ? 'text-primary' : 'text-muted-foreground'}`} />
              <div className="text-left">
                <p className="font-medium">Comparativo: Valor Real vs Tabela</p>
                <p className="text-sm text-muted-foreground">Compara os teus valores com a tabela ICHPOP/FA-360</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{showComparison ? 'Fechar' : 'Abrir'}</span>
          </button>
        </motion.div>
      )}

      {/* Comparison Report */}
      {comparison && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          {/* Summary */}
          <div className="px-5 py-4 border-b border-border bg-muted/30">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{comparison.analisadas}</p>
                <p className="text-xs text-muted-foreground">Analisadas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-400">{comparison.abaixoTabela}</p>
                <p className="text-xs text-muted-foreground">Abaixo tabela</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">{comparison.acimaTabela}</p>
                <p className="text-xs text-muted-foreground">Acima tabela</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${comparison.diferencaTotal >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {comparison.diferencaTotal >= 0 ? '+' : ''}{formatCurrency(comparison.diferencaTotal)}
                </p>
                <p className="text-xs text-muted-foreground">Diferença total</p>
              </div>
            </div>
          </div>
          {/* Items */}
          <div className="divide-y divide-border">
            {comparison.items.map((item) => (
              <div key={item.id} className="px-5 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{item.clientName}</p>
                  <p className="text-xs text-muted-foreground">{item.tipologiaName} · {item.area} m²</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Real:</span>{' '}
                    <span className="font-medium">{formatCurrency(item.valorReal)}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Tabela:</span>{' '}
                    <span className="font-medium">{formatCurrency(item.valorTabela)}</span>
                  </p>
                </div>
                <div className={`flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${
                  item.status === 'abaixo' ? 'bg-red-500/10 text-red-400' :
                  item.status === 'acima' ? 'bg-emerald-500/10 text-emerald-400' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {item.status === 'abaixo' ? <TrendingDown className="w-3 h-3" /> :
                   item.status === 'acima' ? <TrendingUp className="w-3 h-3" /> :
                   <Minus className="w-3 h-3" />}
                  {item.diferencaPct > 0 ? '+' : ''}{item.diferencaPct}%
                </div>
              </div>
            ))}
          </div>
          {comparison.semDados > 0 && (
            <div className="px-5 py-3 bg-muted/30 text-xs text-muted-foreground">
              {comparison.semDados} proposta(s) sem dados suficientes para comparar (falta área ou tipologia)
            </div>
          )}
        </motion.div>
      )}

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-muted/30 border border-border rounded-xl p-5"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium mb-1">Como criar propostas?</h4>
            <p className="text-sm text-muted-foreground">
              Usa a <button onClick={() => navigate('/calculator')} className="text-primary hover:underline font-medium">Calculadora de Honorários</button> para 
              criar propostas detalhadas com cálculo automático de honorários ICHPOP, especialidades, extras e mais. 
              Quando gerares o link da proposta, ela aparece automaticamente nesta lista.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
