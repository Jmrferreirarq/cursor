import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, ExternalLink, Trash2, Clock, AlertCircle, Check, Download, BarChart2 } from 'lucide-react';
import { 
  loadProposalHistory, 
  removeFromProposalHistory, 
  getBestLink, 
  isLinkValid,
  type ProposalHistoryItem 
} from '../../lib/proposalHistory';
import { toast } from 'sonner';

interface ProposalHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProposalHistoryModal({ isOpen, onClose }: ProposalHistoryModalProps) {
  const [history, setHistory] = useState<ProposalHistoryItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);

  const stats = useMemo(() => {
    if (history.length === 0) return null;
    const total = history.reduce((s, h) => s + h.totalWithVat, 0);
    const avg = total / history.length;
    const max = Math.max(...history.map((h) => h.totalWithVat));
    const min = Math.min(...history.map((h) => h.totalWithVat));
    const byType: Record<string, { count: number; total: number }> = {};
    history.forEach((h) => {
      const k = h.projectType || 'Outro';
      if (!byType[k]) byType[k] = { count: 0, total: 0 };
      byType[k].count++;
      byType[k].total += h.totalWithVat;
    });
    return { total, avg, max, min, byType };
  }, [history]);

  const exportCsv = () => {
    const rows = [
      ['Referência', 'Cliente', 'Projeto', 'Tipologia', 'Localização', 'Total s/IVA (€)', 'Total c/IVA (€)', 'Data', 'Link'],
      ...history.map((h) => [
        h.reference,
        h.clientName,
        h.projectName,
        h.projectType || '',
        h.location || '',
        h.totalValue.toFixed(2).replace('.', ','),
        h.totalWithVat.toFixed(2).replace('.', ','),
        new Date(h.createdAt).toLocaleDateString('pt-PT'),
        getBestLink(h) || '',
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
  // Carregar histórico quando abre
  useEffect(() => {
    if (isOpen) {
      setHistory(loadProposalHistory());
    }
  }, [isOpen]);

  const handleCopyLink = async (item: ProposalHistoryItem) => {
    const link = getBestLink(item);
    if (!link) {
      toast.error('Link não disponível');
      return;
    }

    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(item.id);
      toast.success('Link copiado!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Não foi possível copiar');
    }
  };

  const handleOpenLink = (item: ProposalHistoryItem) => {
    const link = getBestLink(item);
    if (link) {
      window.open(link, '_blank');
    }
  };

  const handleDelete = (id: string) => {
    if (removeFromProposalHistory(id)) {
      setHistory(loadProposalHistory());
      toast.success('Proposta removida do histórico');
    }
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const getDaysRemaining = (expiresAt?: string) => {
    if (!expiresAt) return null;
    const diff = new Date(expiresAt).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-800">
            <div>
              <h2 className="text-xl font-bold text-white">Histórico de Propostas</h2>
              <p className="text-sm text-zinc-400 mt-1">
                {history.length} proposta{history.length !== 1 ? 's' : ''} guardada{history.length !== 1 ? 's' : ''}
                {stats && (
                  <span className="ml-2 text-emerald-400">
                    · Total: {formatCurrency(stats.total)}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <>
                  <button
                    onClick={() => setShowStats((v) => !v)}
                    className={`p-2 rounded-lg transition-colors ${showStats ? 'bg-primary/20 text-primary' : 'hover:bg-zinc-800 text-zinc-400'}`}
                    title="Estatísticas"
                  >
                    <BarChart2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={exportCsv}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm transition-colors"
                    title="Exportar CSV"
                  >
                    <Download className="w-4 h-4" />
                    CSV
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
          </div>

          {/* Stats panel */}
          <AnimatePresence>
            {showStats && stats && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-b border-zinc-800"
              >
                <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-800/30">
                  <div className="bg-zinc-800/60 rounded-xl p-3">
                    <p className="text-xs text-zinc-500 mb-1">Total faturado</p>
                    <p className="text-lg font-bold text-emerald-400">{formatCurrency(stats.total)}</p>
                  </div>
                  <div className="bg-zinc-800/60 rounded-xl p-3">
                    <p className="text-xs text-zinc-500 mb-1">Proposta média</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(stats.avg)}</p>
                  </div>
                  <div className="bg-zinc-800/60 rounded-xl p-3">
                    <p className="text-xs text-zinc-500 mb-1">Maior proposta</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(stats.max)}</p>
                  </div>
                  <div className="bg-zinc-800/60 rounded-xl p-3">
                    <p className="text-xs text-zinc-500 mb-1">Menor proposta</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(stats.min)}</p>
                  </div>
                  {Object.keys(stats.byType).length > 1 && (
                    <div className="col-span-2 sm:col-span-4 bg-zinc-800/60 rounded-xl p-3">
                      <p className="text-xs text-zinc-500 mb-2">Por tipologia</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(stats.byType).map(([type, data]) => (
                          <span key={type} className="px-2 py-1 bg-zinc-700 rounded-lg text-xs">
                            <span className="text-zinc-300">{type}</span>
                            <span className="text-zinc-500 mx-1">·</span>
                            <span className="text-emerald-400">{data.count}×</span>
                            <span className="text-zinc-500 mx-1">·</span>
                            <span className="text-white">{formatCurrency(data.total)}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {history.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-400">Nenhuma proposta guardada</p>
                <p className="text-zinc-500 text-sm mt-1">
                  As propostas aparecem aqui quando gera um link
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item) => {
                  const daysRemaining = getDaysRemaining(item.expiresAt);
                  const expired = item.shortLink && !isLinkValid(item);
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-zinc-800/50 rounded-xl p-4 border transition-colors ${
                        expired 
                          ? 'border-red-500/30 opacity-60' 
                          : 'border-zinc-700/50 hover:border-zinc-600'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-emerald-400 text-sm font-medium">
                              {item.reference}
                            </span>
                            {expired && (
                              <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                                <AlertCircle className="w-3 h-3" />
                                Expirado
                              </span>
                            )}
                            {!expired && item.shortLink && daysRemaining !== null && daysRemaining <= 14 && (
                              <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                                <Clock className="w-3 h-3" />
                                {daysRemaining} dias
                              </span>
                            )}
                          </div>
                          
                          <h3 className="font-medium text-white truncate">
                            {item.clientName}
                          </h3>
                          <p className="text-sm text-zinc-400 truncate">
                            {item.projectName}
                            {item.location && ` · ${item.location}`}
                          </p>
                          
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="text-emerald-400 font-medium">
                              {formatCurrency(item.totalWithVat)}
                            </span>
                            <span className="text-zinc-500">
                              {formatDate(item.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopyLink(item)}
                            disabled={!!(expired && !item.longLink)}
                            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Copiar link"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-zinc-400" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => handleOpenLink(item)}
                            disabled={!!(expired && !item.longLink)}
                            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Abrir proposta"
                          >
                            <ExternalLink className="w-4 h-4 text-zinc-400" />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                            title="Remover do histórico"
                          >
                            <Trash2 className="w-4 h-4 text-zinc-400 group-hover:text-red-400" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {history.length > 0 && (
            <div className="p-4 border-t border-zinc-800 bg-zinc-800/30">
              <p className="text-xs text-zinc-500 text-center">
                Links curtos expiram após 90 dias · Links longos não expiram
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
