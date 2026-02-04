import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FolderKanban, Calendar, Users, Euro, MapPin, Clock, GitBranch, FileText, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProjectTimeline from '@/components/projects/ProjectTimeline';

type TabId = 'overview' | 'timeline' | 'documents' | 'notes';

export default function ProjectDetailsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Visão Geral', icon: FolderKanban },
    { id: 'timeline', label: 'Timeline', icon: GitBranch },
    { id: 'documents', label: 'Documentos', icon: FileText },
    { id: 'notes', label: 'Notas', icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center gap-4"
      >
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 px-3 py-2 -ml-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl p-6 shadow-card"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="px-2 py-1 bg-success/20 text-success rounded text-[10px] font-semibold uppercase">
              Ativo
            </span>
            <h1 className="text-2xl font-bold mt-2">Casa Douro</h1>
            <p className="text-muted-foreground">João Silva</p>
          </div>
          <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
            <FolderKanban className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Euro className="w-4 h-4" />
              <span className="text-sm">Orçamento</span>
            </div>
            <p className="text-lg font-semibold">45.000 €</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Horas</span>
            </div>
            <p className="text-lg font-semibold">120h</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Prazo</span>
            </div>
            <p className="text-lg font-semibold">30 Jun</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Local</span>
            </div>
            <p className="text-lg font-semibold">Porto</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </motion.div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-6 shadow-card"
          >
            <h3 className="text-lg font-semibold mb-4">Equipa</h3>
            <div className="space-y-3">
              {['CEO', 'JÉSSICA'].map((member) => (
                <div key={member} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">{member.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{member}</p>
                    <p className="text-sm text-muted-foreground">Arquiteto</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-6 shadow-card"
          >
            <h3 className="text-lg font-semibold mb-4">Progresso</h3>
            <div className="space-y-4">
              {['Estudo Prévio', 'Anteprojeto', 'Licenciamento', 'Projeto Execução'].map((phase, index) => (
                <div key={phase}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{phase}</span>
                    <span className="text-sm text-muted-foreground">{index < 2 ? '100%' : '0%'}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${index < 2 ? 'bg-success' : 'bg-muted-foreground/30'}`}
                      style={{ width: index < 2 ? '100%' : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ProjectTimeline />
        </motion.div>
      )}

      {activeTab === 'documents' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-8 text-center"
        >
          <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Documentos do Projeto</h3>
          <p className="text-muted-foreground text-sm">Os documentos do projeto aparecerão aqui.</p>
        </motion.div>
      )}

      {activeTab === 'notes' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-8 text-center"
        >
          <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Notas & Comentários</h3>
          <p className="text-muted-foreground text-sm">Adicione notas e comentários ao projeto.</p>
        </motion.div>
      )}
    </div>
  );
}
