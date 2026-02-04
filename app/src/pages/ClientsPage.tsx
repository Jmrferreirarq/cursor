import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Search, Phone, MapPin, FolderKanban, Mail, Calendar, LayoutGrid, List, ArrowUpRight } from 'lucide-react';
import NewClientDialog from '@/components/clients/NewClientDialog';
import { useData } from '@/context/DataContext';

export default function ClientsPage() {
  const navigate = useNavigate();
  const { clients, addClient, projects } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [newClientOpen, setNewClientOpen] = useState(false);

  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.municipality?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [clients, searchQuery]);

  // Enriquecer clientes com contagem de projetos ativos
  const enrichedClients = useMemo(() => {
    return filteredClients.map((client) => {
      const clientProjects = projects.filter((p) => 
        p.client.toLowerCase() === client.name.toLowerCase()
      );
      const activeProjects = clientProjects.filter((p) => 
        ['active', 'negotiation'].includes(p.status)
      );
      const totalValue = clientProjects.reduce((sum, p) => sum + p.budget, 0);
      
      return {
        ...client,
        projectCount: clientProjects.length,
        activeProjectCount: activeProjects.length,
        totalValue,
      };
    });
  }, [filteredClients, projects]);

  // Cliente em destaque (com mais projetos ativos)
  const featuredClient = viewMode === 'cards' 
    ? enrichedClients.reduce((prev, current) => 
        (current.activeProjectCount > (prev?.activeProjectCount || 0)) ? current : prev
      , enrichedClients[0])
    : null;

  const otherClients = viewMode === 'cards' && featuredClient
    ? enrichedClients.filter((c) => c.id !== featuredClient.id)
    : enrichedClients;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
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
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide uppercase">Relações</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground mt-2">
            {clients.length} clientes registados
          </p>
        </div>
        <button
          onClick={() => setNewClientOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Cliente</span>
        </button>
      </motion.div>

      {/* Search + View Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por nome, email ou localização..."
            className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-sm"
          />
        </div>

        <div className="flex bg-muted/50 border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              viewMode === 'cards' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Cards</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              viewMode === 'list' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Lista</span>
          </button>
        </div>
      </motion.div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredClients.length} {filteredClients.length === 1 ? 'resultado' : 'resultados'}
        </p>
      </div>

      {/* Cards View */}
      {viewMode === 'cards' && enrichedClients.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Featured Client + Side Grid */}
          {featuredClient && featuredClient.activeProjectCount > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Featured Card */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => navigate(`/clients/${featuredClient.id}`)}
                className="lg:col-span-2 group cursor-pointer"
              >
                <div className="relative h-full bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent border border-border rounded-2xl p-6 hover:border-emerald-500/40 transition-all duration-300 overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  
                  <div className="relative">
                    {/* Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {featuredClient.activeProjectCount} projetos ativos
                      </span>
                    </div>

                    {/* Avatar + Name */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">
                          {featuredClient.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold group-hover:text-primary transition-colors">
                          {featuredClient.name}
                        </h2>
                        <p className="text-muted-foreground">{featuredClient.email}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Projetos</p>
                        <p className="text-xl font-bold">{featuredClient.projectCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Volume Total</p>
                        <p className="text-xl font-bold">{formatCurrency(featuredClient.totalValue)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Cliente desde</p>
                        <p className="text-xl font-bold">{new Date(featuredClient.createdAt).toLocaleDateString('pt-PT', { month: 'short', year: '2-digit' })}</p>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="mt-6 pt-4 border-t border-border/50 flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{featuredClient.phone}</span>
                      </div>
                      {featuredClient.municipality && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{featuredClient.municipality}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
              </motion.article>

              {/* Side smaller cards */}
              <div className="space-y-4">
                {otherClients.slice(0, 2).map((client, index) => (
                  <ClientCard 
                    key={client.id} 
                    client={client} 
                    index={index}
                    compact
                    onClick={() => navigate(`/clients/${client.id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Rest of clients */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {(featuredClient && featuredClient.activeProjectCount > 0 ? otherClients.slice(2) : enrichedClients).map((client, index) => (
              <ClientCard 
                key={client.id} 
                client={client} 
                index={index}
                onClick={() => navigate(`/clients/${client.id}`)}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* List View */}
      {viewMode === 'list' && enrichedClients.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cliente</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Contacto</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Localização</th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Projetos</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Desde</th>
              </tr>
            </thead>
            <tbody>
              {enrichedClients.map((client, index) => (
                <motion.tr
                  key={client.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => navigate(`/clients/${client.id}`)}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="text-sm font-semibold text-primary">
                          {client.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">{client.name}</p>
                        <p className="text-sm text-muted-foreground md:hidden">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{client.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{client.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    {client.municipality && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{client.municipality}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <FolderKanban className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{client.projectCount}</span>
                      {client.activeProjectCount > 0 && (
                        <span className="text-xs text-emerald-400">({client.activeProjectCount} ativos)</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-muted-foreground hidden sm:table-cell">
                    {new Date(client.createdAt).toLocaleDateString('pt-PT')}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 px-6 rounded-xl border border-dashed border-border bg-muted/10"
        >
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">Nenhum cliente encontrado</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Tenta uma pesquisa diferente</p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Limpar pesquisa
            </button>
          )}
        </motion.div>
      )}

      <NewClientDialog
        open={newClientOpen}
        onOpenChange={setNewClientOpen}
        onSuccess={addClient}
      />
    </div>
  );
}

// Client Card Component
interface EnrichedClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  municipality?: string;
  createdAt: string;
  projectCount: number;
  activeProjectCount: number;
  totalValue: number;
}

function ClientCard({ 
  client, 
  index, 
  compact = false,
  onClick 
}: { 
  client: EnrichedClient; 
  index: number;
  compact?: boolean;
  onClick: () => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={`group cursor-pointer bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-lg transition-all duration-200 ${
        compact ? 'p-4' : 'p-5'
      }`}
    >
      {/* Avatar + Name */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`rounded-xl bg-primary/20 flex items-center justify-center shrink-0 ${compact ? 'w-10 h-10' : 'w-12 h-12'}`}>
          <span className={`font-semibold text-primary ${compact ? 'text-sm' : 'text-base'}`}>
            {client.name.charAt(0)}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className={`font-semibold group-hover:text-primary transition-colors truncate ${compact ? 'text-base' : 'text-lg'}`}>
            {client.name}
          </h3>
          <p className="text-sm text-muted-foreground truncate">{client.email}</p>
        </div>
      </div>

      {/* Stats */}
      {!compact && (
        <div className="flex items-center gap-4 mb-3 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>{client.projectCount} projetos</span>
          </div>
          {client.activeProjectCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
              {client.activeProjectCount} ativos
            </span>
          )}
        </div>
      )}

      {/* Contact */}
      <div className={`space-y-1.5 ${compact ? 'text-xs' : 'text-sm'}`}>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="w-3.5 h-3.5" />
          <span>{client.phone}</span>
        </div>
        {client.municipality && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span>{client.municipality}</span>
          </div>
        )}
      </div>

      {/* Date */}
      {!compact && (
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>Cliente desde {new Date(client.createdAt).toLocaleDateString('pt-PT')}</span>
          </div>
        </div>
      )}
    </motion.article>
  );
}
