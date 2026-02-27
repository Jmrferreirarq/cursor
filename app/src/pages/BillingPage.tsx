import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Euro, Search, CheckCircle2, Clock, AlertCircle, TrendingUp, FileText, Plus } from 'lucide-react';
import { useData } from '@/context/DataContext';
import type { Proposal, PaymentTranche } from '@/types';

type Tab = 'active' | 'done' | 'esp';

const TAB_LABELS: Record<Tab, string> = {
  active: 'Em curso (FA)',
  done:   'Concluído (FA_Done)',
  esp:    'Especialidades (FA ESP)',
};

const STATUS_COLOR: Record<string, string> = {
  paid:     'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  invoiced: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
  pending:  'bg-slate-700/40 text-slate-400 border border-slate-600/30',
};

const STATUS_LABEL: Record<string, string> = {
  paid:     '+',
  invoiced: '~',
  pending:  '—',
};

const STATUS_ROW: Record<string, string> = {
  paid:     'bg-emerald-500/5',
  invoiced: 'bg-amber-500/5',
  pending:  '',
};

function fmt(val: number) {
  if (!val) return '—';
  return val.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function TrancheCell({ t, onEdit }: { t: PaymentTranche | undefined; onEdit?: () => void }) {
  if (!t) return <td className="px-2 py-2 text-center text-slate-600 text-xs" colSpan={4}>—</td>;
  return (
    <>
      <td className="px-2 py-2 text-right text-sm font-mono whitespace-nowrap">
        {t.value ? t.value.toLocaleString('pt-PT', { minimumFractionDigits: 2 }) : '—'}
      </td>
      <td className="px-2 py-2 text-center">
        <span className={`inline-block w-5 h-5 rounded text-xs font-bold flex items-center justify-center ${t.hasVat ? 'text-emerald-400' : 'text-slate-500'}`}>
          {t.hasVat ? '+' : '—'}
        </span>
      </td>
      <td className="px-2 py-2 text-center">
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold cursor-pointer select-none transition-colors ${STATUS_COLOR[t.status]}`}
          onClick={onEdit} title={t.status === 'paid' ? 'Pago' : t.status === 'invoiced' ? 'Faturado' : 'Pendente'}>
          {STATUS_LABEL[t.status]}
        </span>
      </td>
      <td className="px-2 py-2 text-center text-xs text-slate-400 whitespace-nowrap">
        {t.invoiceDate ? t.invoiceDate.slice(0, 10) : '—'}
      </td>
    </>
  );
}

interface EditState {
  proposalId: string;
  trancheIndex: number;
}

function EditModal({ proposal, trancheIndex, onClose, onSave }: {
  proposal: Proposal;
  trancheIndex: number;
  onClose: () => void;
  onSave: (patch: Partial<PaymentTranche>) => void;
}) {
  const t = proposal.paymentTranches?.[trancheIndex];
  const [status, setStatus] = useState<PaymentTranche['status']>(t?.status || 'pending');
  const [invoiceDate, setInvoiceDate] = useState(t?.invoiceDate || '');
  const [notes, setNotes] = useState(t?.notes || '');
  const [hasVat, setHasVat] = useState(t?.hasVat ?? true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1a1f2e] border border-white/10 rounded-xl p-6 w-full max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-white font-semibold mb-1">{proposal.clientName}</h3>
        <p className="text-slate-400 text-sm mb-4">{t?.label} — {t?.percentage}</p>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Estado</label>
            <div className="flex gap-2">
              {(['pending', 'invoiced', 'paid'] as const).map((s) => (
                <button key={s}
                  className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${status === s ? STATUS_COLOR[s] : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                  onClick={() => setStatus(s)}>
                  {s === 'paid' ? 'Pago' : s === 'invoiced' ? 'Faturado' : 'Pendente'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Data Fatura</label>
            <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary" />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="vat" checked={hasVat} onChange={(e) => setHasVat(e.target.checked)}
              className="rounded" />
            <label htmlFor="vat" className="text-sm text-slate-300">Com IVA</label>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Notas</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: 1250,00+IVA"
              className="w-full bg-slate-800 border border-white/10 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary" />
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={onClose}
            className="flex-1 py-2 rounded bg-slate-700 text-slate-300 text-sm hover:bg-slate-600 transition-colors">
            Cancelar
          </button>
          <button onClick={() => { onSave({ status, invoiceDate: invoiceDate || undefined, notes: notes || undefined, hasVat }); onClose(); }}
            className="flex-1 py-2 rounded bg-primary text-white text-sm hover:bg-primary/80 transition-colors font-medium">
            Guardar
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function BillingPage() {
  const { proposals, updateProposal, isReady } = useData();
  const [tab, setTab] = useState<Tab>('active');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<EditState | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('all');

  const availableYears = useMemo(() => {
    const years = new Set<string>();
    proposals.forEach((p) => {
      const year = p.createdAt?.slice(0, 4);
      if (year) years.add(year);
      (p.paymentTranches || []).forEach((t) => {
        const ty = t.invoiceDate?.slice(0, 4);
        if (ty) years.add(ty);
      });
    });
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [proposals]);

  const filtered = useMemo(() => {
    const base = proposals.filter((p) => {
      if (tab === 'active') return !p.isBillingDone;
      if (tab === 'done') return p.isBillingDone;
      return false;
    });
    const byYear = selectedYear === 'all' ? base : base.filter((p) => {
      const propYear = p.createdAt?.slice(0, 4) === selectedYear;
      const trancheYear = (p.paymentTranches || []).some((t) => t.invoiceDate?.slice(0, 4) === selectedYear);
      return propYear || trancheYear;
    });
    if (!search) return byYear;
    const q = search.toLowerCase();
    return byYear.filter((p) => p.clientName.toLowerCase().includes(q) || p.projectName?.toLowerCase().includes(q));
  }, [proposals, tab, search, selectedYear]);

  const totals = useMemo(() => {
    const total = filtered.reduce((s, p) => s + (p.totalValue || 0), 0);
    const received = filtered.reduce((s, p) => {
      const paid = (p.paymentTranches || []).filter((t) => t.status === 'paid').reduce((a, t) => a + t.value, 0);
      return s + paid;
    }, 0);
    const invoiced = filtered.reduce((s, p) => {
      const inv = (p.paymentTranches || []).filter((t) => t.status === 'invoiced').reduce((a, t) => a + t.value, 0);
      return s + inv;
    }, 0);
    const pending = total - received - invoiced;
    return { total, received, invoiced, pending };
  }, [filtered]);

  function handleEdit(proposalId: string, trancheIndex: number) {
    setEditing({ proposalId, trancheIndex });
  }

  function handleSave(patch: Partial<PaymentTranche>) {
    if (!editing) return;
    const proposal = proposals.find((p) => p.id === editing.proposalId);
    if (!proposal) return;
    const tranches = [...(proposal.paymentTranches || [])];
    tranches[editing.trancheIndex] = { ...tranches[editing.trancheIndex], ...patch };
    const allPaid = tranches.every((t) => t.status === 'paid');
    updateProposal(editing.proposalId, {
      paymentTranches: tranches,
      isBillingDone: allPaid,
    });
  }

  const editingProposal = editing ? proposals.find((p) => p.id === editing.proposalId) : null;

  if (!isReady) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Euro className="w-6 h-6 text-primary" />
            Controlo de Faturação
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Gestão de pagamentos e tranches por cliente</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Cotado', value: totals.total, icon: FileText, color: 'text-blue-400' },
          { label: 'Recebido', value: totals.received, icon: CheckCircle2, color: 'text-emerald-400' },
          { label: 'Faturado', value: totals.invoiced, icon: Clock, color: 'text-amber-400' },
          { label: 'Pendente', value: totals.pending, icon: AlertCircle, color: 'text-slate-400' },
        ].map((card) => (
          <div key={card.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <card.icon className={`w-4 h-4 ${card.color}`} />
              <span className="text-xs text-slate-400">{card.label}</span>
            </div>
            <p className={`text-lg font-bold ${card.color}`}>
              {card.value.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} €
            </p>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {(Object.keys(TAB_LABELS) as Tab[]).filter(t => t !== 'esp').map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${tab === t ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}>
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar cliente..."
            className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary w-56" />
        </div>
      </div>

      {/* Year Filter */}
      {availableYears.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500">Ano:</span>
          <button
            onClick={() => setSelectedYear('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedYear === 'all' ? 'bg-primary text-white' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}>
            Todos
          </button>
          {availableYears.map((year) => (
            <button key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedYear === year ? 'bg-primary text-white' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}>
              {year}
            </button>
          ))}
        </div>
      )}

      {/* Legenda */}
      <div className="flex gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold">+</span> Pago
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold">~</span> Faturado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-slate-700/40 border border-slate-600/30 flex items-center justify-center text-slate-400 font-bold">—</span> Pendente
        </span>
        <span className="text-slate-500 ml-2">Clica no estado para editar</span>
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-3 py-3 text-left text-xs text-slate-400 font-medium sticky left-0 bg-[#111827] min-w-[160px]">Cliente</th>
                <th className="px-2 py-3 text-right text-xs text-slate-400 font-medium whitespace-nowrap">Cotação</th>
                <th className="px-2 py-3 text-center text-xs text-slate-400 font-medium">Proporção</th>
                {/* Adjudicação */}
                <th className="px-2 py-3 text-right text-xs text-emerald-500/70 font-medium border-l border-white/5" colSpan={4}>Adjudicação</th>
                {/* Intermédia */}
                <th className="px-2 py-3 text-right text-xs text-amber-500/70 font-medium border-l border-white/5" colSpan={4}>Intermédia</th>
                {/* Final */}
                <th className="px-2 py-3 text-right text-xs text-blue-500/70 font-medium border-l border-white/5" colSpan={4}>Final</th>
                <th className="px-2 py-3 text-right text-xs text-slate-400 font-medium border-l border-white/5">Recebido</th>
              </tr>
              <tr className="border-b border-white/5 text-[10px] text-slate-500">
                <th></th><th></th><th></th>
                {['Adj', 'IVA', 'Est', 'Fatura',
                  'Int', 'IVA', 'Est', 'Fatura',
                  'Final', 'IVA', 'Est', 'Fatura'].map((h, i) => (
                  <th key={i} className={`px-2 py-1 text-center ${[0,4,8].includes(i) ? 'text-right border-l border-white/5' : ''}`}>{h}</th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={16} className="px-4 py-12 text-center text-slate-500">
                    Nenhum registo encontrado
                  </td>
                </tr>
              )}
              {filtered.map((proposal, idx) => {
                const tranches = proposal.paymentTranches || [];
                const adj = tranches[0];
                const int = tranches[1];
                const fin = tranches[2];
                const received = tranches.filter((t) => t.status === 'paid').reduce((s, t) => s + t.value, 0);
                const rowBg = adj?.status === 'paid' && int?.status === 'paid' && fin?.status === 'paid'
                  ? 'bg-emerald-500/5'
                  : idx % 2 === 0 ? '' : 'bg-white/[0.02]';

                return (
                  <motion.tr key={proposal.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${rowBg}`}>
                    <td className="px-3 py-2 sticky left-0 bg-inherit font-medium text-white whitespace-nowrap">
                      {proposal.clientName}
                    </td>
                    <td className="px-2 py-2 text-right font-mono text-slate-300 whitespace-nowrap">
                      {proposal.totalValue ? proposal.totalValue.toLocaleString('pt-PT', { minimumFractionDigits: 2 }) : '—'}
                    </td>
                    <td className="px-2 py-2 text-center text-xs text-slate-400">
                      {tranches.map((t) => t.percentage).filter(Boolean).join('+') || '—'}
                    </td>

                    {/* Adjudicação */}
                    <td className="border-l border-white/5 px-2 py-2 text-right text-sm font-mono whitespace-nowrap">
                      {adj?.value ? adj.value.toLocaleString('pt-PT', { minimumFractionDigits: 2 }) : '—'}
                    </td>
                    <td className="px-2 py-2 text-center text-xs">
                      <span className={adj?.hasVat ? 'text-emerald-400' : 'text-slate-500'}>{adj?.hasVat ? '+' : '—'}</span>
                    </td>
                    <td className="px-2 py-2 text-center">
                      {adj ? (
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold cursor-pointer transition-colors ${STATUS_COLOR[adj.status]}`}
                          onClick={() => handleEdit(proposal.id, 0)}>
                          {STATUS_LABEL[adj.status]}
                        </span>
                      ) : <span className="text-slate-600">—</span>}
                    </td>
                    <td className="px-2 py-2 text-center text-xs text-slate-400 whitespace-nowrap">
                      {adj?.invoiceDate ? adj.invoiceDate.slice(0,10) : '—'}
                    </td>

                    {/* Intermédia */}
                    <td className="border-l border-white/5 px-2 py-2 text-right text-sm font-mono whitespace-nowrap">
                      {int?.value ? int.value.toLocaleString('pt-PT', { minimumFractionDigits: 2 }) : '—'}
                    </td>
                    <td className="px-2 py-2 text-center text-xs">
                      <span className={int?.hasVat ? 'text-emerald-400' : 'text-slate-500'}>{int?.hasVat ? '+' : '—'}</span>
                    </td>
                    <td className="px-2 py-2 text-center">
                      {int ? (
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold cursor-pointer transition-colors ${STATUS_COLOR[int.status]}`}
                          onClick={() => handleEdit(proposal.id, 1)}>
                          {STATUS_LABEL[int.status]}
                        </span>
                      ) : <span className="text-slate-600">—</span>}
                    </td>
                    <td className="px-2 py-2 text-center text-xs text-slate-400 whitespace-nowrap">
                      {int?.invoiceDate ? int.invoiceDate.slice(0,10) : '—'}
                    </td>

                    {/* Final */}
                    <td className="border-l border-white/5 px-2 py-2 text-right text-sm font-mono whitespace-nowrap">
                      {fin?.value ? fin.value.toLocaleString('pt-PT', { minimumFractionDigits: 2 }) : '—'}
                    </td>
                    <td className="px-2 py-2 text-center text-xs">
                      <span className={fin?.hasVat ? 'text-emerald-400' : 'text-slate-500'}>{fin?.hasVat ? '+' : '—'}</span>
                    </td>
                    <td className="px-2 py-2 text-center">
                      {fin ? (
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold cursor-pointer transition-colors ${STATUS_COLOR[fin.status]}`}
                          onClick={() => handleEdit(proposal.id, 2)}>
                          {STATUS_LABEL[fin.status]}
                        </span>
                      ) : <span className="text-slate-600">—</span>}
                    </td>
                    <td className="px-2 py-2 text-center text-xs text-slate-400 whitespace-nowrap">
                      {fin?.invoiceDate ? fin.invoiceDate.slice(0,10) : '—'}
                    </td>

                    {/* Recebido */}
                    <td className="border-l border-white/5 px-2 py-2 text-right font-mono font-semibold text-emerald-400 whitespace-nowrap">
                      {received > 0 ? received.toLocaleString('pt-PT', { minimumFractionDigits: 2 }) : '—'}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr className="border-t border-white/10 bg-white/5 font-semibold text-sm">
                  <td className="px-3 py-3 text-white sticky left-0 bg-[#1a1f2e]">TOTAL ({filtered.length})</td>
                  <td className="px-2 py-3 text-right font-mono text-white">
                    {totals.total.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                  </td>
                  <td colSpan={13}></td>
                  <td className="px-2 py-3 text-right font-mono text-emerald-400">
                    {totals.received.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && editingProposal && (
        <EditModal
          proposal={editingProposal}
          trancheIndex={editing.trancheIndex}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
