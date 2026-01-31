import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Search, Phone, MapPin, FolderKanban } from 'lucide-react';
import NewClientDialog from '@/components/clients/NewClientDialog';
import { useData } from '@/context/DataContext';

export default function ClientsPage() {
  const navigate = useNavigate();
  const { clients, addClient } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [newClientOpen, setNewClientOpen] = useState(false);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.municipality?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Users className="w-4 h-4" />
            <span className="text-sm">Gestão de Clientes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Clientes</h1>
        </div>
        <button
          onClick={() => setNewClientOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Cliente</span>
        </button>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Pesquisar clientes..."
          className="input-base"
        />
      </div>

      {/* Clients List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Cliente</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Contacto</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Localização</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Projetos</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Desde</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client, index) => (
                <motion.tr
                  key={client.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/clients/${client.id}`)}
                  className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {client.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{client.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{client.municipality}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FolderKanban className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{client.projects.length}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(client.createdAt).toLocaleDateString('pt-PT')}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredClients.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">Nenhum cliente encontrado</p>
            <p className="text-sm text-muted-foreground/80 mt-1">Tenta uma pesquisa diferente</p>
          </div>
        )}
      </div>

      <NewClientDialog
        open={newClientOpen}
        onOpenChange={setNewClientOpen}
        onSuccess={addClient}
      />
    </div>
  );
}
