import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Download, FileText, Euro, TrendingUp, Users, FolderKanban, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';

function fmt(v: number) {
  return v.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
}

function getMonthLabel(year: number, month: number) {
  return new Date(year, month - 1, 1).toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });
}

export default function ReportsPage() {
  const { proposals, projects, clients } = useData();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    years.add(currentYear);
    proposals.forEach((p) => {
      const y = p.createdAt ? new Date(p.createdAt).getFullYear() : null;
      if (y) years.add(y);
    });
    return [...years].sort((a, b) => b - a);
  }, [proposals, currentYear]);

  const report = useMemo(() => {
    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59);

    const inPeriod = (dateStr?: string) => {
      if (!dateStr) return false;
      const d = new Date(dateStr);
      return d >= startDate && d <= endDate;
    };

    // Propostas do mês
    const monthProposals = proposals.filter((p) => inPeriod(p.createdAt));
    const totalProposalValue = monthProposals.reduce((s, p) => s + (p.totalValue || 0), 0);
    const wonProposals = monthProposals.filter((p) => p.status === 'accepted');
    const wonValue = wonProposals.reduce((s, p) => s + (p.totalValue || 0), 0);
    const lostProposals = monthProposals.filter((p) => p.status === 'lost' || p.status === 'rejected');
    const pendingProposals = monthProposals.filter((p) => ['draft', 'sent'].includes(p.status || ''));
    const conversionRate = monthProposals.length > 0
      ? Math.round((wonProposals.length / monthProposals.length) * 100) : 0;

    // Faturação do mês (tranches pagas/faturadas no período — aproximação por data de proposta)
    let billingReceived = 0;
    let billingInvoiced = 0;
    let billingPending = 0;
    proposals.forEach((p) => {
      (p.paymentTranches || []).forEach((t) => {
        if (t.status === 'paid') billingReceived += t.value;
        else if (t.status === 'invoiced') billingInvoiced += t.value;
        else billingPending += t.value;
      });
    });

    // Projetos ativos no mês
    const activeProjects = projects.filter((p) => p.status === 'active');
    const newProjects = projects.filter((p) => inPeriod((p as unknown as { createdAt?: string }).createdAt));

    // Clientes
    const totalClients = clients.length;

    // Top clientes por valor adjudicado (global)
    const clientStats: Record<string, { won: number; total: number; proposals: number }> = {};
    proposals.forEach((p) => {
      const k = p.clientName;
      if (!clientStats[k]) clientStats[k] = { won: 0, total: 0, proposals: 0 };
      clientStats[k].proposals++;
      clientStats[k].total += p.totalValue || 0;
      if (p.status === 'accepted') clientStats[k].won += p.totalValue || 0;
    });
    const topClients = Object.entries(clientStats)
      .sort(([, a], [, b]) => b.won - a.won)
      .slice(0, 5);

    return {
      monthProposals,
      totalProposalValue,
      wonProposals,
      wonValue,
      lostProposals,
      pendingProposals,
      conversionRate,
      billingReceived,
      billingInvoiced,
      billingPending,
      activeProjects,
      newProjects,
      totalClients,
      topClients,
    };
  }, [proposals, projects, clients, selectedYear, selectedMonth]);

  const exportCsv = () => {
    const label = getMonthLabel(selectedYear, selectedMonth);
    const sections: string[][] = [];

    sections.push([`Relatório Mensal — ${label}`]);
    sections.push([]);
    sections.push(['== FATURAÇÃO GLOBAL ==']);
    sections.push(['Recebido (€)', 'Faturado (€)', 'Pendente (€)']);
    sections.push([
      report.billingReceived.toFixed(2).replace('.', ','),
      report.billingInvoiced.toFixed(2).replace('.', ','),
      report.billingPending.toFixed(2).replace('.', ','),
    ]);
    sections.push([]);
    sections.push([`== PROPOSTAS DE ${label.toUpperCase()} ==`]);
    sections.push(['Referência', 'Cliente', 'Projeto', 'Valor c/IVA (€)', 'Estado', 'Data']);
    report.monthProposals.forEach((p) => {
      sections.push([
        p.reference || '',
        p.clientName,
        p.projectName || '',
        (p.totalValue || 0).toFixed(2).replace('.', ','),
        p.status || '',
        p.createdAt ? new Date(p.createdAt).toLocaleDateString('pt-PT') : '',
      ]);
    });
    sections.push([]);
    sections.push(['== TOP CLIENTES (global) ==']);
    sections.push(['Cliente', 'Propostas', 'Valor Total (€)', 'Adjudicado (€)']);
    report.topClients.forEach(([name, data]) => {
      sections.push([
        name,
        String(data.proposals),
        data.total.toFixed(2).replace('.', ','),
        data.won.toFixed(2).replace('.', ','),
      ]);
    });

    const csv = sections.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\r\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_${selectedYear}_${String(selectedMonth).padStart(2, '0')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Relatório exportado');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <BarChart3 className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium tracking-wide uppercase">Relatórios</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Relatório Mensal</h1>
          <p className="text-muted-foreground mt-2">Resumo executivo de faturação, propostas e projetos</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-2 bg-muted border border-border rounded-xl text-sm focus:border-primary focus:outline-none"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(2000, m - 1, 1).toLocaleDateString('pt-PT', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 bg-muted border border-border rounded-xl text-sm focus:border-primary focus:outline-none"
          >
            {availableYears.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            onClick={exportCsv}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </motion.div>

      {/* Faturação global */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Faturação Global (acumulado)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Recebido', value: report.billingReceived, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
            { label: 'Faturado / em curso', value: report.billingInvoiced, icon: FileText, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
            { label: 'Pendente', value: report.billingPending, icon: Clock, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
          ].map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} className={`p-5 rounded-xl border ${border} ${bg}`}>
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-xs uppercase tracking-wide">{label}</span>
              </div>
              <p className={`text-3xl font-bold ${color}`}>{fmt(value)}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Propostas do mês */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Propostas de {getMonthLabel(selectedYear, selectedMonth)}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          {[
            { label: 'Total enviadas', value: String(report.monthProposals.length), sub: fmt(report.totalProposalValue), icon: FileText, color: 'text-blue-400' },
            { label: 'Adjudicadas', value: String(report.wonProposals.length), sub: fmt(report.wonValue), icon: CheckCircle, color: 'text-emerald-400' },
            { label: 'Perdidas', value: String(report.lostProposals.length), sub: '', icon: AlertCircle, color: 'text-red-400' },
            { label: 'Taxa de sucesso', value: `${report.conversionRate}%`, sub: '', icon: TrendingUp, color: report.conversionRate >= 50 ? 'text-emerald-400' : report.conversionRate >= 25 ? 'text-amber-400' : 'text-red-400' },
          ].map(({ label, value, sub, icon: Icon, color }) => (
            <div key={label} className="p-4 bg-card border border-border rounded-xl">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                <span className="text-xs">{label}</span>
              </div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
            </div>
          ))}
        </div>

        {report.monthProposals.length > 0 ? (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Cliente</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Projeto</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Valor</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {report.monthProposals.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{p.clientName}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{p.projectName || p.reference || '—'}</td>
                    <td className="px-4 py-3 text-right font-medium">{fmt(p.totalValue || 0)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.status === 'accepted' ? 'bg-emerald-500/15 text-emerald-400' :
                        p.status === 'sent' ? 'bg-blue-500/15 text-blue-400' :
                        p.status === 'lost' || p.status === 'rejected' ? 'bg-red-500/15 text-red-400' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {p.status === 'accepted' ? 'Adjudicada' : p.status === 'sent' ? 'Enviada' : p.status === 'lost' ? 'Perdida' : p.status === 'rejected' ? 'Recusada' : 'Rascunho'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center bg-card border border-border rounded-xl text-muted-foreground">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhuma proposta registada em {getMonthLabel(selectedYear, selectedMonth)}</p>
          </div>
        )}
      </motion.div>

      {/* Top clientes */}
      {report.topClients.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Top Clientes (valor adjudicado)</h2>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">#</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Cliente</th>
                  <th className="text-center px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Propostas</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Total enviado</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Adjudicado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {report.topClients.map(([name, data], i) => (
                  <tr key={name} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground font-medium">{i + 1}</td>
                    <td className="px-4 py-3 font-medium">{name}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground hidden sm:table-cell">{data.proposals}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground hidden sm:table-cell">{fmt(data.total)}</td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-400">{fmt(data.won)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Projetos */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Visão Geral de Projetos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Projetos ativos', value: String(report.activeProjects.length), icon: FolderKanban, color: 'text-primary' },
            { label: 'Total clientes', value: String(report.totalClients), icon: Users, color: 'text-blue-400' },
            { label: 'Total propostas', value: String(proposals.length), icon: FileText, color: 'text-purple-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="p-4 bg-card border border-border rounded-xl flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
