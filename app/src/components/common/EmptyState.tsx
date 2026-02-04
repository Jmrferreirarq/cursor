import React from 'react';
import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  Search, 
  Users, 
  FileText, 
  Calendar, 
  Inbox, 
  Image, 
  Building2,
  Plus,
  ArrowRight,
  Sparkles
} from 'lucide-react';

// Animated illustration components
function ProjectsIllustration() {
  return (
    <div className="relative w-48 h-48 mx-auto mb-6">
      {/* Background circles */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="absolute inset-6 bg-gradient-to-br from-primary/10 to-primary/15 rounded-full"
      />
      
      {/* Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center rotate-6 shadow-lg">
          <FolderOpen className="w-10 h-10 text-primary" />
        </div>
      </motion.div>
      
      {/* Floating elements */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute -top-2 right-8 w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center"
      >
        <Plus className="w-4 h-4 text-emerald-500" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="absolute bottom-4 left-4 w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center"
      >
        <Sparkles className="w-3 h-3 text-amber-500" />
      </motion.div>
    </div>
  );
}

function SearchIllustration() {
  return (
    <div className="relative w-48 h-48 mx-auto mb-6">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/30 rounded-full"
      />
      
      {/* Search icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="w-24 h-24 bg-muted rounded-2xl flex items-center justify-center shadow-inner">
          <Search className="w-12 h-12 text-muted-foreground/50" />
        </div>
      </motion.div>
      
      {/* Animated search line */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 60, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="absolute bottom-16 right-8 h-1 bg-primary/30 rounded-full"
      />
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 40, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute bottom-10 right-12 h-1 bg-primary/20 rounded-full"
      />
    </div>
  );
}

function UsersIllustration() {
  return (
    <div className="relative w-48 h-48 mx-auto mb-6">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-cyan-500/10 rounded-full"
      />
      
      {/* User icons */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-cyan-500/20 rounded-full flex items-center justify-center"
      >
        <Users className="w-7 h-7 text-cyan-500" />
      </motion.div>
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center"
      >
        <Users className="w-8 h-8 text-primary" />
      </motion.div>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="absolute left-1/2 -translate-x-1/2 top-8 w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center"
      >
        <Users className="w-6 h-6 text-emerald-500" />
      </motion.div>
      
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 192 192">
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          d="M 70 96 Q 96 60 122 96"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-primary"
          strokeDasharray="4 4"
        />
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          d="M 70 96 Q 60 120 96 140"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-cyan-500"
          strokeDasharray="4 4"
        />
      </svg>
    </div>
  );
}

function DocumentsIllustration() {
  return (
    <div className="relative w-48 h-48 mx-auto mb-6">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-amber-500/10 rounded-full"
      />
      
      {/* Stacked documents */}
      <motion.div
        initial={{ x: 10, y: 10, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-24 bg-muted/50 rounded-lg border border-border -rotate-6"
      />
      <motion.div
        initial={{ x: -10, y: -10, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-24 bg-card rounded-lg border border-border rotate-3 shadow-lg flex flex-col p-3"
      >
        <div className="w-full h-2 bg-muted rounded-full mb-2" />
        <div className="w-3/4 h-2 bg-muted rounded-full mb-2" />
        <div className="w-1/2 h-2 bg-muted rounded-full" />
        <FileText className="w-8 h-8 text-amber-500/50 mx-auto mt-auto" />
      </motion.div>
    </div>
  );
}

function MediaIllustration() {
  return (
    <div className="relative w-48 h-48 mx-auto mb-6">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-violet-500/10 rounded-full"
      />
      
      {/* Image frames */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: -6 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="absolute left-1/2 top-1/2 -translate-x-[60%] -translate-y-[60%] w-16 h-16 bg-violet-500/20 rounded-xl border-2 border-dashed border-violet-500/30"
      />
      <motion.div
        initial={{ scale: 0, rotate: 10 }}
        animate={{ scale: 1, rotate: 6 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        className="absolute left-1/2 top-1/2 -translate-x-[40%] -translate-y-[40%] w-20 h-20 bg-primary/20 rounded-xl flex items-center justify-center shadow-lg"
      >
        <Image className="w-10 h-10 text-primary/50" />
      </motion.div>
    </div>
  );
}

function InboxIllustration() {
  return (
    <div className="relative w-48 h-48 mx-auto mb-6">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-sky-500/10 rounded-full"
      />
      
      {/* Inbox box */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="w-24 h-20 bg-sky-500/20 rounded-xl flex items-end justify-center pb-3">
          <Inbox className="w-12 h-12 text-sky-500/50" />
        </div>
      </motion.div>
      
      {/* Floating check */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        className="absolute right-12 top-12 w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center"
      >
        <span className="text-emerald-500">✓</span>
      </motion.div>
    </div>
  );
}

function CalendarIllustration() {
  return (
    <div className="relative w-48 h-48 mx-auto mb-6">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-rose-500/10 rounded-full"
      />
      
      {/* Calendar */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-28 bg-card rounded-xl border border-border shadow-lg overflow-hidden"
      >
        <div className="h-6 bg-rose-500/20 flex items-center justify-center">
          <Calendar className="w-4 h-4 text-rose-500" />
        </div>
        <div className="p-2 grid grid-cols-4 gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.02 }}
              className="w-3 h-3 bg-muted/50 rounded-sm"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

interface EmptyStateProps {
  type?: 'projects' | 'search' | 'users' | 'documents' | 'media' | 'inbox' | 'calendar' | 'generic';
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

const illustrations: Record<string, React.FC> = {
  projects: ProjectsIllustration,
  search: SearchIllustration,
  users: UsersIllustration,
  documents: DocumentsIllustration,
  media: MediaIllustration,
  inbox: InboxIllustration,
  calendar: CalendarIllustration,
  generic: ProjectsIllustration,
};

export default function EmptyState({
  type = 'generic',
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  const Illustration = illustrations[type] || illustrations.generic;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-8 text-center max-w-md mx-auto"
    >
      <Illustration />
      
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl font-semibold text-foreground mb-2"
      >
        {title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-muted-foreground text-sm mb-6"
      >
        {description}
      </motion.p>
      
      {(action || secondaryAction) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          {action && (
            <button
              onClick={action.onClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              {action.icon || <Plus className="w-4 h-4" />}
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              {secondaryAction.label}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// Pre-built empty states
export function NoProjectsEmptyState({ onCreateProject }: { onCreateProject: () => void }) {
  return (
    <EmptyState
      type="projects"
      title="Nenhum projeto encontrado"
      description="Crie o seu primeiro projeto para começar a organizar o trabalho do atelier."
      action={{
        label: 'Criar Projeto',
        onClick: onCreateProject,
      }}
    />
  );
}

export function NoSearchResultsEmptyState({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <EmptyState
      type="search"
      title="Sem resultados"
      description={`Não encontrámos resultados para "${query}". Tente ajustar os termos de pesquisa.`}
      action={{
        label: 'Limpar pesquisa',
        onClick: onClear,
        icon: <Search className="w-4 h-4" />,
      }}
    />
  );
}

export function NoClientsEmptyState({ onCreateClient }: { onCreateClient: () => void }) {
  return (
    <EmptyState
      type="users"
      title="Nenhum cliente registado"
      description="Adicione clientes para gerir contactos e projetos de forma organizada."
      action={{
        label: 'Adicionar Cliente',
        onClick: onCreateClient,
      }}
    />
  );
}

export function NoMediaEmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <EmptyState
      type="media"
      title="Galeria vazia"
      description="Carregue imagens e documentos para criar a biblioteca visual do atelier."
      action={{
        label: 'Carregar Media',
        onClick: onUpload,
      }}
    />
  );
}

export function EmptyInboxState() {
  return (
    <EmptyState
      type="inbox"
      title="Inbox a zero!"
      description="Parabéns! Não tem mensagens pendentes por tratar."
    />
  );
}

export function NoEventsEmptyState({ onCreateEvent }: { onCreateEvent: () => void }) {
  return (
    <EmptyState
      type="calendar"
      title="Sem eventos agendados"
      description="O calendário está livre. Adicione reuniões, prazos e eventos importantes."
      action={{
        label: 'Agendar Evento',
        onClick: onCreateEvent,
      }}
    />
  );
}
