import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Bot, Shield, Database, BarChart3, Zap, AlertTriangle, CheckCircle2,
  Info, XCircle, Copy, Check, RefreshCw, Sparkles, Loader2,
  Heart, FileText, ClipboardCopy, ChevronDown, ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { useData } from '@/context/DataContext';
import { useMedia } from '@/context/MediaContext';
import { localStorageService } from '@/services/localStorage';
import { runPlatformDiagnostic, runAIPlatformAnalysis } from '@/services/platformAgent';
import { hasApiKey } from '@/services/ai';
import type { DiagnosticItem, PlatformReport, Severity } from '@/services/platformAgent';

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

export default function AgentPage() {
  const { clients, projects, proposals } = useData();
  const { assets, posts, contentPacks, editorialDNA, slots, performanceEntries } = useMedia();

  const [report, setReport] = useState<PlatformReport | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCursorPrompt, setShowCursorPrompt] = useState(false);

  const runDiagnostic = () => {
    setLoading(true);
    const data = localStorageService.load();
    // Ensure current state is used
    data.clients = clients;
    data.projects = projects;
    data.proposals = proposals;
    data.mediaAssets = assets;
    data.contentPosts = posts;
    data.contentPacks = contentPacks;
    data.editorialDNA = editorialDNA;
    data.slots = slots;
    data.performanceEntries = performanceEntries;

    const result = runPlatformDiagnostic(data);
    setReport(result);
    setLoading(false);
    toast.success('Diagnóstico completo');
  };

  const runAIAnalysis = async () => {
    if (!hasApiKey()) {
      toast.error('Configura a API key da OpenAI primeiro (Media Inbox → Configurar AI)');
      return;
    }
    setAiLoading(true);
    try {
      const data = localStorageService.load();
      data.clients = clients;
      data.projects = projects;
      data.proposals = proposals;
      data.mediaAssets = assets;
      data.contentPosts = posts;
      data.contentPacks = contentPacks;
      const result = await runAIPlatformAnalysis(data);
      setAiAnalysis(result);
      toast.success('Análise AI concluída');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro na análise AI');
    }
    setAiLoading(false);
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

  const healthColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const healthBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Bot className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide uppercase">Platform Agent</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Agente Interno</h1>
          <p className="text-muted-foreground mt-2">Monitorização, diagnóstico e comunicação com o Cursor</p>
        </div>
        <div className="flex items-center gap-3">
          {hasApiKey() && (
            <button onClick={runAIAnalysis} disabled={aiLoading} className="inline-flex items-center gap-2 px-4 py-2.5 border border-primary/50 text-primary rounded-xl text-sm font-medium hover:bg-primary/10 transition-colors disabled:opacity-50">
              {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {aiLoading ? 'AI a analisar...' : 'Análise AI'}
            </button>
          )}
          <button onClick={runDiagnostic} disabled={loading} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {loading ? 'A diagnosticar...' : 'Executar Diagnóstico'}
          </button>
        </div>
      </motion.div>

      {!report ? (
        /* Initial State */
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl">
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Bot className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Platform Agent</h2>
            <p className="text-muted-foreground text-center max-w-lg mb-8">
              O agente analisa a saúde da plataforma, detecta problemas, sugere melhorias e gera um relatório que podes partilhar directamente com o Cursor para implementação automática.
            </p>
            <button onClick={runDiagnostic} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
              <Zap className="w-5 h-5" />
              Primeiro Diagnóstico
            </button>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Health Score */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Overall */}
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
          </motion.div>

          {/* Diagnostics */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
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
          </motion.div>

          {/* Improvements */}
          {report.improvements.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card border border-border rounded-xl overflow-hidden">
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
            </motion.div>
          )}

          {/* AI Analysis */}
          {aiAnalysis && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-primary/30 rounded-xl p-6">
              <h2 className="font-semibold flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                Análise AI
              </h2>
              <div className="prose prose-sm prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-foreground bg-muted/30 rounded-xl p-4 overflow-auto">{aiAnalysis}</pre>
              </div>
            </motion.div>
          )}

          {/* Cursor Communication */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border-2 border-primary/30 rounded-xl overflow-hidden">
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
          </motion.div>
        </>
      )}
    </div>
  );
}
