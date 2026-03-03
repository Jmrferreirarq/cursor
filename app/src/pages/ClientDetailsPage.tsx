import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, MapPin, FolderKanban, FileText, Euro, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '@/context/DataContext';

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  draft: { label: 'Rascunho', color: 'bg-muted text-muted-foreground' },
  sent: { label: 'Enviada', color: 'bg-blue-500/20 text-blue-400' },
  accepted: { label: 'Aceite', color: 'bg-emerald-500/20 text-emerald-400' },
  rejected: { label: 'Recusada', color: 'bg-red-500/20 text-red-400' },
  expired: { label: 'Expirada', color: 'bg-amber-500/20 text-amber-400' },
  lead: { label: 'Lead', color: 'bg-slate-500/20 text-slate-400' },
  negotiation: { label: 'Negociação', color: 'bg-amber-500/20 text-amber-400' },
  active: { label: 'Ativo', color: 'bg-emerald-500/20 text-emerald-400' },
  paused: { label: 'Pausado', color: 'bg-slate-500/20 text-slate-400' },
  completed: { label: 'Concluído', color: 'bg-blue-500/20 text-blue-400' },
  cancelled: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400' },
};

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(v);

export default function ClientDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { clients, projects, proposals } = useData();

  const client = useMemo(() => clients.find((c) => c.id === id), [clients, id]);

  const clientProjects = useMemo(() => {
    if (!client) return [];
    // Preferir ligação por clientId; fallback por nome para dados migrados
    return projects.filter((p) =>
      p.clientId ? p.clientId === client.id : p.client.toLowerCase() === client.name.toLowerCase()
    );
  }, [client, projects]);

  const clientProposals = useMemo(() => {
    if (!client) return [];
    // Preferir ligação por clientId; fallback por nome para dados migrados
    return proposals.filter((p) =>
      p.clientId ? p.clientId === client.id : p.clientName.toLowerCase() === client.name.toLowerCase()
    );
  }, [client, proposals]);

  const totalValue = useMemo(() => {
    const projValue = clientProjects.reduce((s, p) => s + p.budget, 0);
    const propValue = clientProposals.reduce((s, p) => s + p.totalValue, 0);
    return projValue || propValue;
  }, [clientProjects, clientProposals]);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Users className="w-12 h-12 text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-bold mb-2">Cliente não encontrado</h2>
        <button onClick={() => navigate('/clients')} className="text-primary hover:underline">
          Voltar aos clientes
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <button
          onClick={() => navigate('/clients')}
          className="flex items-center gap-2 px-3 py-2 -ml-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
      </motion.div>

      {/* Client Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-primary">{client.name.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{client.name}</h1>
            <p className="text-muted-foreground">Cliente desde {new Date(client.createdAt).toLocaleDateString('pt-PT')}</p>
            {client.nif && (
              <span className="inline-block mt-2 px-2 py-1 bg-muted rounded text-xs">NIF: {client.nif}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {client.email && (
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{client.email}</p>
              </div>
            </div>
          )}
          {client.phone && (
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="font-medium">{client.phone}</p>
              </div>
            </div>
          )}
          {(client.address || client.municipality) && (
            <div className="md:col-span-2 flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Localização</p>
                <p className="font-medium">{[client.address, client.municipality].filter(Boolean).join(', ')}</p>
              </div>
            </div>
          )}
        </div>

        {totalValue > 0 && (
          <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
            <Euro className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Volume total:</span>
            <span className="font-semibold text-primary">{formatCurrency(totalValue)}</span>
          </div>
        )}
      </motion.div>

      {/* Projects */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-muted-foreground" />
          Projetos ({clientProjects.length})
        </h3>
        {clientProjects.length > 0 ? (
          <div className="space-y-3">
            {clientProjects.map((proj) => {
              const s = STATUS_LABEL[proj.status] || STATUS_LABEL.active;
              return (
                <div
                  key={proj.id}
                  onClick={() => navigate(`/projects/${proj.id}`)}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/80 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FolderKanban className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{proj.name}</p>
                      <p className="text-sm text-muted-foreground">{proj.phase}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{formatCurrency(proj.budget)}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${s.color}`}>{s.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum projeto associado</p>
        )}
      </motion.div>

      {/* Proposals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-muted-foreground" />
          Propostas ({clientProposals.length})
        </h3>
        {clientProposals.length > 0 ? (
          <div className="space-y-3">
            {clientProposals.map((prop) => {
              const s = STATUS_LABEL[prop.status] || STATUS_LABEL.draft;
              return (
                <div
                  key={prop.id}
                  onClick={() => navigate('/proposals')}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/80 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{prop.projectName || prop.reference || 'Proposta'}</p>
                      <p className="text-sm text-muted-foreground">{prop.location || prop.projectType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{formatCurrency(prop.totalWithVat)}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${s.color}`}>{s.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhuma proposta associada</p>
        )}
      </motion.div>
    </div>
  );
}
