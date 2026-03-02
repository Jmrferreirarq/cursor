import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, Download, ArrowUpRight, Clock, CheckCircle2, FileText } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { useData } from '@/context/DataContext';

const MONTHS_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function getMonthsBack(n: number) {
  const result: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({ key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: MONTHS_PT[d.getMonth()] });
  }
  return result;
}

export default function FinancialPage() {
  const { proposals } = useData();
  const [period, setPeriod] = useState('6m');

  const periodMonths = period === '1m' ? 1 : period === '3m' ? 3 : period === '6m' ? 6 : 12;
  const months = useMemo(() => getMonthsBack(periodMonths), [periodMonths]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

  const allTranches = useMemo(() => {
    const result: { proposalId: string; clientName: string; label: string; value: number; status: string; date: string }[] = [];
    proposals.forEach((p) => {
      (p.paymentTranches ?? []).forEach((t) => {
        const date = t.invoiceDate || p.createdAt || '';
        result.push({ proposalId: p.id, clientName: p.clientName, label: t.label, value: t.value, status: t.status, date });
      });
    });
    return result.sort((a, b) => b.date.localeCompare(a.date));
  }, [proposals]);

  const cashflowData = useMemo(() => {
    return months.map(({ key, label }) => {
      const monthTranches = allTranches.filter((t) => t.date.startsWith(key));
      const paid = monthTranches.filter((t) => t.status === 'paid').reduce((s, t) => s + t.value, 0);
      const invoiced = monthTranches.filter((t) => t.status === 'invoiced').reduce((s, t) => s + t.value, 0);
      const pending = monthTranches.filter((t) => t.status === 'pending').reduce((s, t) => s + t.value, 0);
      return { month: label, paid, invoiced, pending, total: paid + invoiced + pending };
    });
  }, [months, allTranches]);

  const totalPaid = cashflowData.reduce((s, d) => s + d.paid, 0);
  const totalInvoiced = cashflowData.reduce((s, d) => s + d.invoiced, 0);
  const totalPending = cashflowData.reduce((s, d) => s + d.pending, 0);
  const grandTotal = totalPaid + totalInvoiced + totalPending;

  const recentTranches = allTranches.slice(0, 15);

  const handleExport = () => {
    const rows = [['Data', 'Cliente', 'Tranche', 'Valor', 'Estado']];
    allTranches.forEach((t) => {
      rows.push([
        t.date ? new Date(t.date).toLocaleDateString('pt-PT') : '',
        t.clientName,
        t.label,
        t.value.toFixed(2),
        t.status,
      ]);
    });
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financeiro_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Wallet className="w-4 h-4" />
            <span className="text-sm">Gestão Financeira</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground text-sm mt-1">Baseado nas tranches de pagamento das propostas</p>
        </div>
        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2.5 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
          >
            <option value="1m">1 Mês</option>
            <option value="3m">3 Meses</option>
            <option value="6m">6 Meses</option>
            <option value="1y">1 Ano</option>
          </select>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-muted border border-border rounded-lg hover:bg-muted/80 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Recebido', value: totalPaid, color: 'text-success', bg: 'bg-success/20', icon: CheckCircle2, sub: 'Tranches pagas' },
          { label: 'Faturado', value: totalInvoiced, color: 'text-blue-400', bg: 'bg-blue-500/20', icon: FileText, sub: 'Aguarda pagamento' },
          { label: 'Pendente', value: totalPending, color: 'text-amber-400', bg: 'bg-amber-500/20', icon: Clock, sub: 'Por faturar' },
          { label: 'Total Pipeline', value: grandTotal, color: 'text-primary', bg: 'bg-primary/20', icon: TrendingUp, sub: `${proposals.length} propostas` },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <div className={`w-8 h-8 rounded-full ${card.bg} flex items-center justify-center`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <p className={`text-xl font-bold ${card.color}`}>{formatCurrency(card.value)}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="text-lg font-semibold mb-4">Evolução Mensal</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashflowData}>
                <defs>
                  <linearGradient id="paidGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="invoicedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `€${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Area type="monotone" dataKey="paid" stroke="hsl(var(--success))" fill="url(#paidGradient)" name="Recebido" />
                <Area type="monotone" dataKey="invoiced" stroke="#60a5fa" fill="url(#invoicedGradient)" name="Faturado" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="text-lg font-semibold mb-4">Pipeline por Mês</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashflowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `€${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="paid" fill="hsl(var(--success))" name="Recebido" radius={[2, 2, 0, 0]} stackId="a" />
                <Bar dataKey="invoiced" fill="#60a5fa" name="Faturado" radius={[0, 0, 0, 0]} stackId="a" />
                <Bar dataKey="pending" fill="hsl(var(--muted-foreground))" name="Pendente" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Tranches */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <div className="p-5 border-b border-border">
          <h3 className="text-lg font-semibold">Tranches Recentes</h3>
        </div>
        {recentTranches.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            <Wallet className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Sem tranches registadas. Adiciona tranches de pagamento às propostas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-6 py-3 text-sm font-semibold text-muted-foreground">Data</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-muted-foreground">Cliente</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-muted-foreground">Tranche</th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-muted-foreground">Estado</th>
                  <th className="text-right px-6 py-3 text-sm font-semibold text-muted-foreground">Valor</th>
                </tr>
              </thead>
              <tbody>
                {recentTranches.map((t, i) => (
                  <tr key={`${t.proposalId}-${i}`} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-3 text-sm">{t.date ? new Date(t.date).toLocaleDateString('pt-PT') : '—'}</td>
                    <td className="px-6 py-3 text-sm font-medium">{t.clientName}</td>
                    <td className="px-6 py-3 text-sm text-muted-foreground">{t.label}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        t.status === 'paid' ? 'bg-success/20 text-success' :
                        t.status === 'invoiced' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {t.status === 'paid' ? 'Pago' : t.status === 'invoiced' ? 'Faturado' : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className={`flex items-center justify-end gap-1 ${t.status === 'paid' ? 'text-success' : 'text-foreground'}`}>
                        {t.status === 'paid' && <ArrowUpRight className="w-4 h-4" />}
                        <span className="font-medium">{formatCurrency(t.value)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
