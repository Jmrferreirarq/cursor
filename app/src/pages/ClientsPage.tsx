import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Search, Phone, Mail, MapPin, FolderKanban } from 'lucide-react';
import type { Client } from '@/types';

const mockClients: Client[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.pt',
    phone: '+351 912 345 678',
    address: 'Rua do Douro, 123',
    municipality: 'Porto',
    nif: '123456789',
    projects: ['1'],
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'TechCorp Lda',
    email: 'geral@techcorp.pt',
    phone: '+351 223 456 789',
    address: 'Avenida da Liberdade, 500',
    municipality: 'Lisboa',
    nif: '987654321',
    projects: ['2'],
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    name: 'Maria Santos',
    email: 'maria.santos@email.pt',
    phone: '+351 934 567 890',
    address: 'Rua da Alegria, 45',
    municipality: 'Braga',
    nif: '456789123',
    projects: [],
    createdAt: '2024-02-01',
  },
];

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = mockClients.filter(
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
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors w-fit">
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
          className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      {/* Clients List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
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
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
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
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum cliente encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
