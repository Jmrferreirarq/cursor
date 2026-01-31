import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Inbox, Mail, Star, Trash2, Archive, Search, Filter, Send, Plus } from 'lucide-react';

const mockEmails = [
  {
    id: '1',
    from: 'joao.silva@email.pt',
    to: 'geral@fa360.pt',
    subject: 'Reunião Casa Douro - Confirmação',
    preview: 'Olá, confirmo a reunião para o próximo dia 15 às 10h...',
    date: '2024-01-14',
    read: false,
    starred: true,
    folder: 'inbox',
  },
  {
    id: '2',
    from: 'fornecedor@stone.pt',
    to: 'geral@fa360.pt',
    subject: 'Orçamento Mármore Carrara',
    preview: 'Segue em anexo o orçamento solicitado para o projeto...',
    date: '2024-01-13',
    read: true,
    starred: false,
    folder: 'inbox',
  },
  {
    id: '3',
    from: 'geral@techcorp.pt',
    to: 'geral@fa360.pt',
    subject: 'Projeto Escritório - Documentação',
    preview: 'Enviamos a documentação solicitada para o licenciamento...',
    date: '2024-01-12',
    read: true,
    starred: false,
    folder: 'inbox',
  },
];

const folders = [
  { id: 'inbox', name: 'Caixa de Entrada', icon: Inbox, count: 1 },
  { id: 'starred', name: 'Com Estrela', icon: Star, count: 1 },
  { id: 'sent', name: 'Enviados', icon: Send, count: 0 },
  { id: 'archive', name: 'Arquivados', icon: Archive, count: 0 },
  { id: 'trash', name: 'Lixo', icon: Trash2, count: 0 },
];

export default function StudioInboxPage() {
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmails = mockEmails.filter(
    (email) =>
      (activeFolder === 'inbox' || (activeFolder === 'starred' && email.starred)) &&
      (email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.from.toLowerCase().includes(searchQuery.toLowerCase()))
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
            <Inbox className="w-4 h-4" />
            <span className="text-sm">Comunicações</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Studio Inbox</h1>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors w-fit">
          <Plus className="w-4 h-4" />
          <span>Nova Mensagem</span>
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-2"
        >
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => setActiveFolder(folder.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                activeFolder === folder.id
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                <folder.icon className="w-5 h-5" />
                <span className="font-medium">{folder.name}</span>
              </div>
              {folder.count > 0 && (
                <span className="px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">
                  {folder.count}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Email List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 bg-card border border-border rounded-xl overflow-hidden"
        >
          {/* Toolbar */}
          <div className="p-4 border-b border-border flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar emails..."
                className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-muted border border-border rounded-lg hover:bg-muted/80 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filtrar</span>
            </button>
          </div>

          {/* Emails */}
          <div className="divide-y divide-border">
            {filteredEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => setSelectedEmail(email.id)}
                className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                  !email.read ? 'bg-primary/5' : ''
                } ${selectedEmail === email.id ? 'ring-2 ring-primary ring-inset' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Toggle star
                    }}
                    className={`mt-1 ${email.starred ? 'text-warning' : 'text-muted-foreground'}`}
                  >
                    <Star className={`w-4 h-4 ${email.starred ? 'fill-current' : ''}`} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`font-medium truncate ${!email.read ? 'text-foreground' : ''}`}>
                        {email.from}
                      </p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(email.date).toLocaleDateString('pt-PT')}
                      </span>
                    </div>
                    <p className={`text-sm truncate mb-1 ${!email.read ? 'font-medium' : ''}`}>
                      {email.subject}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">{email.preview}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredEmails.length === 0 && (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma mensagem</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
