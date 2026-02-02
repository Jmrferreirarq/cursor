import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, X, Sparkles, FileText, FolderKanban, Users, CheckSquare, Calendar, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CommandItem {
  id: string;
  label: string;
  shortcut?: string;
  icon: React.ElementType;
  action: () => void;
  category: string;
}

export default function CommandBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const commands: CommandItem[] = [
    {
      id: 'new-proposal',
      label: 'Nova Proposta',
      shortcut: 'NP',
      icon: FileText,
      action: () => {
        navigate('/proposals');
        setIsOpen(false);
      },
      category: 'Criar',
    },
    {
      id: 'new-project',
      label: 'Novo Projeto',
      shortcut: 'NJ',
      icon: FolderKanban,
      action: () => {
        navigate('/projects');
        setIsOpen(false);
      },
      category: 'Criar',
    },
    {
      id: 'new-client',
      label: 'Novo Cliente',
      shortcut: 'NC',
      icon: Users,
      action: () => {
        navigate('/clients');
        setIsOpen(false);
      },
      category: 'Criar',
    },
    {
      id: 'new-task',
      label: 'Nova Tarefa',
      shortcut: 'NT',
      icon: CheckSquare,
      action: () => {
        navigate('/tasks');
        setIsOpen(false);
      },
      category: 'Criar',
    },
    {
      id: 'goto-dashboard',
      label: 'Ir para Painel',
      icon: Sparkles,
      action: () => {
        navigate('/');
        setIsOpen(false);
      },
      category: 'Navegar',
    },
    {
      id: 'goto-financial',
      label: 'Ir para Financeiro',
      icon: Wallet,
      action: () => {
        navigate('/financial');
        setIsOpen(false);
      },
      category: 'Navegar',
    },
    {
      id: 'goto-calendar',
      label: 'Ir para Calendário',
      icon: Calendar,
      action: () => {
        navigate('/calendar');
        setIsOpen(false);
      },
      category: 'Navegar',
    },
  ];

  const filteredCommands = searchQuery
    ? commands.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cmd.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : commands;

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <>
      {/* Command Bar Trigger */}
      <div className="fixed bottom-0 left-0 right-0 h-14 bg-card z-40" style={{ border: 'none', boxShadow: 'none' }}>
        <div className="h-full max-w-[2400px] mx-auto px-4 flex items-center justify-center">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-muted/40 hover:bg-muted/70 border border-border/50 hover:border-border transition-all w-full max-w-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <Search className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground flex-1 text-left">
              Comando Operacional — Pressione ⌘K para pesquisar...
            </span>
            <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-muted text-xs text-muted-foreground">
              <Command className="w-3 h-3" />
              <span>K</span>
            </kbd>
          </button>
        </div>
      </div>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="w-full max-w-xl bg-popover border border-border rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Digite um comando ou pesquise..."
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 rounded hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-muted text-xs text-muted-foreground">
                  ESC
                </kbd>
              </div>

              {/* Commands List */}
              <div className="max-h-[50vh] overflow-y-auto p-2">
                {Object.entries(groupedCommands).map(([category, items]) => (
                  <div key={category} className="mb-4">
                    <h3 className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {category}
                    </h3>
                    <div className="space-y-1">
                      {items.map((cmd) => (
                        <button
                          key={cmd.id}
                          onClick={cmd.action}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors group"
                        >
                          <cmd.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                          <span className="flex-1 text-left text-sm">{cmd.label}</span>
                          {cmd.shortcut && (
                            <kbd className="px-2 py-0.5 rounded bg-muted text-xs text-muted-foreground">
                              {cmd.shortcut}
                            </kbd>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {filteredCommands.length === 0 && (
                  <div className="py-8 text-center text-muted-foreground">
                    <p>Nenhum comando encontrado</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-border bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-muted">↑↓</kbd>
                    <span>Navegar</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-muted">↵</kbd>
                    <span>Selecionar</span>
                  </span>
                </div>
                <span>FA-360 Command Palette</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
