import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Calculator, Sparkles, Trash2, ExternalLink, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useData } from '@/context/DataContext';
import { useState } from 'react';

const projectTypes: Record<string, string> = {
  'habitacao_unifamiliar': 'Habitação Unifamiliar',
  'habitacao_multifamiliar': 'Habitação Multifamiliar',
  'comercio_servicos': 'Comércio e Serviços',
  'industrial': 'Industrial',
  'equipamentos': 'Equipamentos',
  'reabilitacao': 'Reabilitação',
  'interiores': 'Interiores',
  'obra-nova': 'Obra Nova',
  'remodelacao': 'Remodelação',
  'ampliacao': 'Ampliação',
  'interior': 'Design Interior',
  'consultoria': 'Consultoria',
};

export default function ProposalsManagementPage() {
  const navigate = useNavigate();
  const { proposals, deleteProposal } = useData();
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
          onClick={() => navigate('/calculadora')}
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
          <div className="px-5 py-4 border-b border-border bg-muted/30">
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Propostas Guardadas
              <span className="ml-2 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                {proposals.length}
              </span>
            </h3>
          </div>
          <div className="divide-y divide-border">
            {proposals.map((p) => (
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

                  {/* Status */}
                  <span className={`text-xs px-2.5 py-1 rounded-full ${
                    p.status === 'draft' 
                      ? 'bg-muted text-muted-foreground' 
                      : p.status === 'sent'
                      ? 'bg-blue-500/20 text-blue-400'
                      : p.status === 'accepted'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {p.status === 'draft' ? 'Rascunho' : 
                     p.status === 'sent' ? 'Enviada' :
                     p.status === 'accepted' ? 'Aceite' : 
                     p.status === 'rejected' ? 'Rejeitada' : p.status}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
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
                          title="Abrir proposta"
                        >
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </>
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
            onClick={() => navigate('/calculadora')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            <Calculator className="w-5 h-5" />
            <span>Ir para a Calculadora</span>
          </button>
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
              Usa a <button onClick={() => navigate('/calculadora')} className="text-primary hover:underline font-medium">Calculadora de Honorários</button> para 
              criar propostas detalhadas com cálculo automático de honorários ICHPOP, especialidades, extras e mais. 
              Quando gerares o link da proposta, ela aparece automaticamente nesta lista.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
