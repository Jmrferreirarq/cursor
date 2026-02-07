import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, Shield, Database, BarChart3, Zap, AlertTriangle, CheckCircle2,
  Info, XCircle, Check, Sparkles, Loader2,
  Heart, FileText, ClipboardCopy, ChevronDown, ChevronUp,
  Send, MessageSquare, ArrowRight, ExternalLink, Copy,
} from 'lucide-react';
import { toast } from 'sonner';
import { useData } from '@/context/DataContext';
import { useMedia } from '@/context/MediaContext';
import { localStorageService } from '@/services/localStorage';
import { runPlatformDiagnostic } from '@/services/platformAgent';
import { hasApiKey } from '@/services/ai';
import { processMessage, createMessage, QUICK_SUGGESTIONS } from '@/services/agentChat';
import type { PlatformReport, Severity } from '@/services/platformAgent';
import type { ChatMessage, ChatAction } from '@/services/agentChat';

const SEVERITY_CONFIG: Record<Severity, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  critical: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/30' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/30' },
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  success: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/30' },
};

const CATEGORY_LABELS: Record<string, string> = {
  data: 'Dados', content: 'Conteúdo', performance: 'Performance',
  security: 'Segurança', usage: 'Utilização', storage: 'Armazenamento',
};

// ── Tab type ──
type Tab = 'chat' | 'dashboard';

export default function AgentPage() {
  const navigate = useNavigate();
  const { clients, projects, proposals } = useData();
  const { assets, posts, contentPacks, editorialDNA, slots, performanceEntries } = useMedia();

  const [tab, setTab] = useState<Tab>('chat');
  const [report, setReport] = useState<PlatformReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCursorPrompt, setShowCursorPrompt] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage('agent', 'Olá! Sou o Agente da plataforma FA-360. Posso ajudar-te com diagnósticos, sugestões, estatísticas e navegação.\n\nExperimenta perguntar algo ou usa uma das sugestões rápidas abaixo.'),
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const getAppData = useCallback(() => {
    const data = localStorageService.load();
    data.clients = clients;
    data.projects = projects;
    data.proposals = proposals;
    data.mediaAssets = assets;
    data.contentPosts = posts;
    data.contentPacks = contentPacks;
    data.editorialDNA = editorialDNA;
    data.slots = slots;
    data.performanceEntries = performanceEntries;
    return data;
  }, [clients, projects, proposals, assets, posts, contentPacks, editorialDNA, slots, performanceEntries]);

  // ── Chat ──

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg = createMessage('user', text.trim());
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setThinking(true);

    try {
      const appData = getAppData();
      const response = await processMessage(text.trim(), appData, messages);
      const agentMsg = createMessage('agent', response.content, response.actions);
      setMessages((prev) => [...prev, agentMsg]);
    } catch {
      const errorMsg = createMessage('agent', 'Desculpa, ocorreu um erro ao processar o teu pedido. Tenta novamente.');
      setMessages((prev) => [...prev, errorMsg]);
    }
    setThinking(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleAction = async (action: ChatAction) => {
    if (action.type === 'navigate') {
      navigate(action.payload);
    } else if (action.type === 'copy') {
      try {
        await navigator.clipboard.writeText(action.payload);
        toast.success('Copiado! Cola no Cursor para implementar.');
      } catch {
        toast.error('Não foi possível copiar.');
      }
    }
  };

  // ── Diagnostic ──

  const runDiagnostic = () => {
    setLoading(true);
    const data = getAppData();
    const result = runPlatformDiagnostic(data);
    setReport(result);
    setLoading(false);
    toast.success('Diagnóstico completo');
  };

  const handleCopyPrompt = async () => {
    if (!report) return;
    try {
      await navigator.clipboard.writeText(report.cursorPrompt);
      setCopied(true);
      toast.success('Relatório copiado! Cola no Cursor para implementar melhorias.');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error('Não foi possível copiar');
    }
  };

  const healthColor = (score: number) => score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-red-500';
  const healthBg = (score: number) => score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Bot className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide uppercase">Platform Agent</span>
            {hasApiKey() && <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">AI ATIVO</span>}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Agente Interno</h1>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl">
          <button onClick={() => setTab('chat')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'chat' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            <MessageSquare className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
            Chat
          </button>
          <button onClick={() => setTab('dashboard')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'dashboard' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            <Shield className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
            Dashboard
          </button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {tab === 'chat' ? (
          /* ════════ CHAT TAB ════════ */
          <motion.div key="chat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-card border border-border rounded-2xl flex flex-col" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'order-2' : ''}`}>
                    {/* Avatar + Name */}
                    <div className={`flex items-center gap-2 mb-1 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                      {msg.role === 'agent' && (
                        <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                          <Bot className="w-3 h-3 text-primary" />
                        </div>
                      )}
                      <span className="text-[10px] text-muted-foreground">
                        {msg.role === 'agent' ? 'Agente' : 'Tu'} · {new Date(msg.timestamp).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {/* Bubble */}
                    <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted/50 text-foreground rounded-bl-md'
                    }`}>
                      {msg.content.split('\n').map((line, i) => (
                        <span key={i}>
                          {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
                            part.startsWith('**') && part.endsWith('**')
                              ? <strong key={j}>{part.slice(2, -2)}</strong>
                              : part
                          )}
                          {i < msg.content.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                    {/* Actions */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {msg.actions.map((action) => (
                          <button key={action.id} onClick={() => handleAction(action)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors">
                            {action.type === 'navigate' && <ArrowRight className="w-3 h-3" />}
                            {action.type === 'copy' && <Copy className="w-3 h-3" />}
                            {action.type === 'execute' && <Zap className="w-3 h-3" />}
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Thinking indicator */}
              {thinking && (
                <div className="flex justify-start">
                  <div className="max-w-[75%]">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                        <Bot className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-[10px] text-muted-foreground">Agente · a pensar...</span>
                    </div>
                    <div className="rounded-2xl rounded-bl-md bg-muted/50 px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick suggestions (only show when few messages) */}
            {messages.length <= 2 && !thinking && (
              <div className="px-4 sm:px-6 pb-2">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-2">Sugestões rápidas</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_SUGGESTIONS.map((s) => (
                    <button key={s.label} onClick={() => sendMessage(s.message)} className="px-3 py-1.5 bg-muted/50 hover:bg-muted rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border">
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-border px-4 sm:px-6 py-3">
              <div className="flex items-center gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escreve uma mensagem ao Agente..."
                  className="flex-1 bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                  disabled={thinking}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || thinking}
                  className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                >
                  {thinking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
                {hasApiKey() ? 'AI ativo — respostas inteligentes habilitadas' : 'Respostas locais — ativa o AI Copilot para respostas mais ricas'}
              </p>
            </div>
          </motion.div>
        ) : (
          /* ════════ DASHBOARD TAB ════════ */
          <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            {/* Actions */}
            <div className="flex items-center gap-3 justify-end">
              <button onClick={runDiagnostic} disabled={loading} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {loading ? 'A diagnosticar...' : 'Executar Diagnóstico'}
              </button>
            </div>

            {!report ? (
              <div className="bg-card border border-border rounded-2xl">
                <div className="flex flex-col items-center justify-center py-20 px-6">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <Bot className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Dashboard de Saúde</h2>
                  <p className="text-muted-foreground text-center max-w-lg mb-8">
                    Executa o diagnóstico para ver o health score, problemas detectados e sugestões de melhoria.
                  </p>
                  <button onClick={runDiagnostic} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
                    <Zap className="w-5 h-5" />
                    Primeiro Diagnóstico
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Health Score */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="col-span-2 sm:col-span-3 lg:col-span-1 bg-card border border-border rounded-xl p-5 flex flex-col items-center">
                    <div className="relative w-20 h-20 mb-3">
                      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                        <path className="text-muted/30" d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                        <path className={healthBg(report.healthScore.overall).replace('bg-', 'text-')} d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${report.healthScore.overall}, 100`} />
                      </svg>
                      <span className={`absolute inset-0 flex items-center justify-center text-xl font-bold ${healthColor(report.healthScore.overall)}`}>{report.healthScore.overall}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">GLOBAL</p>
                  </div>
                  {([
                    { key: 'data', label: 'Dados', icon: Database },
                    { key: 'content', label: 'Conteúdo', icon: FileText },
                    { key: 'security', label: 'Segurança', icon: Shield },
                    { key: 'usage', label: 'Utilização', icon: BarChart3 },
                    { key: 'storage', label: 'Storage', icon: Heart },
                  ] as const).map((cat) => (
                    <div key={cat.key} className="bg-card border border-border rounded-xl p-4">
                      <cat.icon className="w-4 h-4 text-muted-foreground mb-2" />
                      <p className={`text-2xl font-bold ${healthColor(report.healthScore[cat.key])}`}>{report.healthScore[cat.key]}</p>
                      <p className="text-xs text-muted-foreground">{cat.label}</p>
                      <div className="w-full h-1.5 rounded-full bg-muted mt-2">
                        <div className={`h-full rounded-full ${healthBg(report.healthScore[cat.key])}`} style={{ width: `${report.healthScore[cat.key]}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Diagnostics */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-border">
                    <h2 className="font-semibold flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      Diagnóstico ({report.diagnostics.length})
                    </h2>
                  </div>
                  <div className="divide-y divide-border">
                    {report.diagnostics.map((d) => {
                      const conf = SEVERITY_CONFIG[d.severity];
                      const Icon = conf.icon;
                      return (
                        <div key={d.id} className="px-5 py-4 flex items-start gap-4">
                          <div className={`w-8 h-8 rounded-lg ${conf.bg} border flex items-center justify-center shrink-0 mt-0.5`}>
                            <Icon className={`w-4 h-4 ${conf.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="font-medium text-sm">{d.title}</p>
                              <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium text-muted-foreground">{CATEGORY_LABELS[d.category]}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{d.description}</p>
                            <p className="text-xs text-primary mt-1">Sugestão: {d.suggestion}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Improvements */}
                {report.improvements.length > 0 && (
                  <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-border">
                      <h2 className="font-semibold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Sugestões de Melhoria ({report.improvements.length})
                      </h2>
                    </div>
                    <div className="divide-y divide-border">
                      {report.improvements.map((s) => (
                        <div key={s.id} className="px-5 py-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                              s.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                              s.priority === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                              'bg-blue-500/10 text-blue-400'
                            }`}>{s.priority}</span>
                            <p className="font-medium text-sm">{s.title}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{s.description}</p>
                          <div className="flex gap-4 mt-2">
                            <span className="text-[10px] text-muted-foreground">Esforço: {s.effort}</span>
                            <span className="text-[10px] text-muted-foreground">Impacto: {s.impact}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cursor Communication */}
                <div className="bg-card border-2 border-primary/30 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-border bg-primary/5 flex items-center justify-between">
                    <h2 className="font-semibold flex items-center gap-2">
                      <Bot className="w-4 h-4 text-primary" />
                      Comunicação com o Cursor
                    </h2>
                    <button onClick={handleCopyPrompt} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
                      {copied ? <Check className="w-4 h-4" /> : <ClipboardCopy className="w-4 h-4" />}
                      {copied ? 'Copiado!' : 'Copiar Relatório'}
                    </button>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-muted-foreground mb-4">
                      Clica em "Copiar Relatório" e cola no chat do Cursor. O assistente vai analisar e implementar as correções/melhorias automaticamente.
                    </p>
                    <button onClick={() => setShowCursorPrompt(!showCursorPrompt)} className="flex items-center gap-2 text-sm text-primary hover:underline">
                      {showCursorPrompt ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      {showCursorPrompt ? 'Esconder preview' : 'Ver preview do relatório'}
                    </button>
                    {showCursorPrompt && (
                      <pre className="mt-4 p-4 bg-muted/30 rounded-xl text-xs text-muted-foreground whitespace-pre-wrap overflow-auto max-h-96">{report.cursorPrompt}</pre>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
