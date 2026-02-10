import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardCheck, Search, ChevronDown, ChevronUp, ArrowLeft, Plus, Trash2,
  CheckCircle2, Circle, MinusCircle, AlertTriangle, Info, FileText, Copy,
  Printer, Download, Building2, Home, Building, Factory, Hammer, Landmark,
  Warehouse, Hotel, Map, HardHat, PenTool, FileCheck, Ruler, X, Sparkles,
  Check, Clock, ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { legislacao, CATEGORIAS, type Diploma } from '../data/legislacao';
import { TIPOLOGIAS, TIPOLOGIA_DIPLOMAS, type Tipologia } from '../data/tipologias';
import {
  REQUISITOS_POR_DIPLOMA, FASES_PROJECTO,
  type Requisito, type FaseProjeto, type EstadoRequisito, type FaseInfo,
} from '../data/requisitosConformidade';

// ─── Icon maps ──────────────────────────────────────
const TIPOLOGIA_ICON_MAP: Record<string, React.ElementType> = {
  Home, Building, Building2, Warehouse, Factory, Hammer, Landmark, Hotel, Map,
};
const FASE_ICON_MAP: Record<string, React.ElementType> = {
  Search, PenTool, FileCheck, Ruler, HardHat,
};

const FASE_COR: Record<string, { bg: string; border: string; text: string }> = {
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    text: 'text-blue-600 dark:text-blue-400' },
  violet:  { bg: 'bg-violet-500/10',  border: 'border-violet-500/30',  text: 'text-violet-600 dark:text-violet-400' },
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   text: 'text-amber-600 dark:text-amber-400' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-600 dark:text-emerald-400' },
  orange:  { bg: 'bg-orange-500/10',  border: 'border-orange-500/30',  text: 'text-orange-600 dark:text-orange-400' },
};

const ESTADO_ICON: Record<EstadoRequisito, { icon: React.ElementType; cor: string; label: string }> = {
  pendente:       { icon: Circle,       cor: 'text-muted-foreground', label: 'Pendente' },
  conforme:       { icon: CheckCircle2, cor: 'text-emerald-600 dark:text-emerald-400', label: 'Conforme' },
  nao_aplicavel:  { icon: MinusCircle,  cor: 'text-slate-400 dark:text-slate-500', label: 'N/A' },
};

// ─── Types ──────────────────────────────────────
interface SavedChecklist {
  id: string;
  nome: string;
  tipologia: string;
  criadoEm: string;
  atualizadoEm: string;
  items: Record<string, EstadoRequisito>;
  notas: Record<string, string>;
}

const STORAGE_KEY = 'fa360_checklists';

function loadChecklists(): SavedChecklist[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveChecklists(lists: SavedChecklist[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
}

const diplomaMap: Record<string, Diploma> = {};
for (const d of legislacao) diplomaMap[d.id] = d;

// ─── Component ──────────────────────────────────────
export default function ChecklistPage() {
  const navigate = useNavigate();
  const [checklists, setChecklists] = useState<SavedChecklist[]>(loadChecklists);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newNome, setNewNome] = useState('');
  const [newTipologia, setNewTipologia] = useState('');
  const [filterFase, setFilterFase] = useState<FaseProjeto | null>(null);
  const [filterEstado, setFilterEstado] = useState<EstadoRequisito | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedReq, setExpandedReq] = useState<string | null>(null);
  const [showMemoria, setShowMemoria] = useState(false);
  const [copiedMemoria, setCopiedMemoria] = useState(false);

  const activeChecklist = checklists.find(c => c.id === activeId);

  // Persist on change
  useEffect(() => { saveChecklists(checklists); }, [checklists]);

  // Get requirements for active checklist
  const requisitos = useMemo(() => {
    if (!activeChecklist) return [];
    const tipDiplomas = TIPOLOGIA_DIPLOMAS[activeChecklist.tipologia] || [];
    const reqs: Requisito[] = [];
    for (const td of tipDiplomas) {
      const dreqs = REQUISITOS_POR_DIPLOMA[td.diplomaId];
      if (dreqs) reqs.push(...dreqs);
    }
    return reqs;
  }, [activeChecklist]);

  // Filtered requirements
  const filteredReqs = useMemo(() => {
    let items = requisitos;
    if (filterFase) items = items.filter(r => r.fase === filterFase);
    if (filterEstado && activeChecklist) {
      items = items.filter(r => (activeChecklist.items[r.id] || 'pendente') === filterEstado);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(r => r.texto.toLowerCase().includes(q) || (r.detalhe || '').toLowerCase().includes(q));
    }
    return items;
  }, [requisitos, filterFase, filterEstado, searchQuery, activeChecklist]);

  // Group by phase
  const groupedByFase = useMemo(() => {
    return FASES_PROJECTO.map(fase => ({
      fase,
      reqs: filteredReqs.filter(r => r.fase === fase.id),
    })).filter(g => g.reqs.length > 0);
  }, [filteredReqs]);

  // Stats
  const stats = useMemo(() => {
    if (!activeChecklist) return { total: 0, conforme: 0, nao_aplicavel: 0, pendente: 0, critico_pendente: 0 };
    const s = { total: requisitos.length, conforme: 0, nao_aplicavel: 0, pendente: 0, critico_pendente: 0 };
    for (const r of requisitos) {
      const st = activeChecklist.items[r.id] || 'pendente';
      s[st]++;
      if (st === 'pendente' && r.criticidade === 'critico') s.critico_pendente++;
    }
    return s;
  }, [requisitos, activeChecklist]);

  const progressPercent = stats.total > 0 ? Math.round(((stats.conforme + stats.nao_aplicavel) / stats.total) * 100) : 0;

  // Phase stats
  const faseStats = useMemo(() => {
    if (!activeChecklist) return {};
    const map: Record<string, { total: number; done: number }> = {};
    for (const r of requisitos) {
      if (!map[r.fase]) map[r.fase] = { total: 0, done: 0 };
      map[r.fase].total++;
      const st = activeChecklist.items[r.id] || 'pendente';
      if (st !== 'pendente') map[r.fase].done++;
    }
    return map;
  }, [requisitos, activeChecklist]);

  // Handlers
  const createChecklist = useCallback(() => {
    if (!newNome.trim() || !newTipologia) return;
    const cl: SavedChecklist = {
      id: `cl-${Date.now()}`,
      nome: newNome.trim(),
      tipologia: newTipologia,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
      items: {},
      notas: {},
    };
    setChecklists(prev => [...prev, cl]);
    setActiveId(cl.id);
    setShowCreate(false);
    setNewNome('');
    setNewTipologia('');
  }, [newNome, newTipologia]);

  const deleteChecklist = useCallback((id: string) => {
    setChecklists(prev => prev.filter(c => c.id !== id));
    if (activeId === id) setActiveId(null);
  }, [activeId]);

  const cycleEstado = useCallback((reqId: string) => {
    setChecklists(prev => prev.map(cl => {
      if (cl.id !== activeId) return cl;
      const cur = cl.items[reqId] || 'pendente';
      const next: EstadoRequisito = cur === 'pendente' ? 'conforme' : cur === 'conforme' ? 'nao_aplicavel' : 'pendente';
      return { ...cl, items: { ...cl.items, [reqId]: next }, atualizadoEm: new Date().toISOString() };
    }));
  }, [activeId]);

  const setNota = useCallback((reqId: string, nota: string) => {
    setChecklists(prev => prev.map(cl => {
      if (cl.id !== activeId) return cl;
      return { ...cl, notas: { ...cl.notas, [reqId]: nota }, atualizadoEm: new Date().toISOString() };
    }));
  }, [activeId]);

  // ─── Memória Descritiva Generator ──────────────────────
  const memoriaDescritiva = useMemo(() => {
    if (!activeChecklist) return '';
    const tipologia = TIPOLOGIAS.find(t => t.id === activeChecklist.tipologia);
    const tipDiplomas = TIPOLOGIA_DIPLOMAS[activeChecklist.tipologia] || [];

    // Group diplomas by category
    const catGroups: Record<string, Diploma[]> = {};
    for (const td of tipDiplomas) {
      const d = diplomaMap[td.diplomaId];
      if (!d) continue;
      if (!catGroups[d.categoria]) catGroups[d.categoria] = [];
      catGroups[d.categoria].push(d);
    }

    const lines: string[] = [];
    lines.push('ENQUADRAMENTO LEGAL');
    lines.push('');
    lines.push(`O presente projecto de ${tipologia?.nome || 'arquitectura'} cumpre a legislação portuguesa em vigor aplicável, designadamente:`);
    lines.push('');

    for (const cat of CATEGORIAS) {
      const diplomas = catGroups[cat.id];
      if (!diplomas || diplomas.length === 0) continue;

      lines.push(cat.nome.toUpperCase());
      for (const d of diplomas) {
        let ref = `• ${d.diploma}`;
        if (d.sigla) ref += ` (${d.sigla})`;
        if (d.ultimaAlteracao) ref += `, com as alterações introduzidas pelo ${d.ultimaAlteracao}`;
        ref += ';';
        lines.push(ref);
      }
      lines.push('');
    }

    lines.push('O projecto foi desenvolvido em conformidade com todos os requisitos regulamentares aplicáveis,');
    lines.push('conforme verificação constante na checklist de conformidade anexa.');
    lines.push('');
    lines.push(`Data: ${new Date().toLocaleDateString('pt-PT')}`);

    return lines.join('\n');
  }, [activeChecklist]);

  const copyMemoria = useCallback(() => {
    navigator.clipboard.writeText(memoriaDescritiva);
    setCopiedMemoria(true);
    setTimeout(() => setCopiedMemoria(false), 2000);
  }, [memoriaDescritiva]);

  // ═══════════════════════════════════════════════════
  // LIST VIEW — no active checklist
  // ═══════════════════════════════════════════════════
  if (!activeId) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Checklists de Conformidade</h1>
              <p className="text-sm text-muted-foreground">Verificação regulamentar por projecto e tipologia</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Nova Checklist
          </button>
        </div>

        {/* Create Form */}
        <AnimatePresence>
          {showCreate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <h2 className="font-semibold text-lg">Criar Nova Checklist</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Nome do Projecto</label>
                    <input
                      type="text"
                      value={newNome}
                      onChange={e => setNewNome(e.target.value)}
                      placeholder="Ex: Moradia Silva — Aveiro"
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Tipologia</label>
                    <select
                      value={newTipologia}
                      onChange={e => setNewTipologia(e.target.value)}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm"
                    >
                      <option value="">Selecionar tipologia...</option>
                      {TIPOLOGIAS.map(t => (
                        <option key={t.id} value={t.id}>{t.nome}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => { setShowCreate(false); setNewNome(''); setNewTipologia(''); }} className="px-4 py-2 text-sm rounded-lg hover:bg-muted transition-colors">
                    Cancelar
                  </button>
                  <button
                    onClick={createChecklist}
                    disabled={!newNome.trim() || !newTipologia}
                    className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    Criar
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Existing Checklists */}
        {checklists.length === 0 ? (
          <div className="text-center py-16">
            <ClipboardCheck className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h2 className="text-lg font-semibold mb-2">Nenhuma checklist criada</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              Crie uma checklist de conformidade para acompanhar os requisitos regulamentares de cada projecto.
              Seleccione a tipologia e obtenha automaticamente todos os itens de verificação.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Criar Primeira Checklist
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {checklists.map(cl => {
              const tip = TIPOLOGIAS.find(t => t.id === cl.tipologia);
              const TipIcon = TIPOLOGIA_ICON_MAP[tip?.icon || 'Building2'] || Building2;
              // Quick stats
              const tipDiplomas = TIPOLOGIA_DIPLOMAS[cl.tipologia] || [];
              let total = 0; let done = 0;
              for (const td of tipDiplomas) {
                const dreqs = REQUISITOS_POR_DIPLOMA[td.diplomaId];
                if (dreqs) {
                  total += dreqs.length;
                  for (const r of dreqs) {
                    const st = cl.items[r.id] || 'pendente';
                    if (st !== 'pendente') done++;
                  }
                }
              }
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;

              return (
                <motion.div
                  key={cl.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-colors group cursor-pointer"
                  onClick={() => setActiveId(cl.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TipIcon className="w-5 h-5 text-primary" />
                      <span className="text-xs text-muted-foreground">{tip?.nome}</span>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); deleteChecklist(cl.id); }}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-base mb-2">{cl.nome}</h3>
                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>{done}/{total} verificados</span>
                      <span className="font-medium">{pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-emerald-500' : pct > 50 ? 'bg-primary' : 'bg-amber-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Criado {new Date(cl.criadoEm).toLocaleDateString('pt-PT')} • Actualizado {new Date(cl.atualizadoEm).toLocaleDateString('pt-PT')}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Info */}
        <div className="bg-muted/50 border border-border rounded-xl p-5">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Como funciona:</strong> Cada checklist é gerada automaticamente com base na tipologia. Os requisitos estão organizados por fase do projecto e associados aos diplomas legais aplicáveis.</p>
              <p>Clique em cada item para alternar entre <strong>Pendente</strong> → <strong>Conforme</strong> → <strong>N/A</strong>.</p>
              <p>No final, pode gerar a secção de <strong>Enquadramento Legal da Memória Descritiva</strong> automaticamente.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════
  // ACTIVE CHECKLIST VIEW
  // ═══════════════════════════════════════════════════
  const tip = TIPOLOGIAS.find(t => t.id === activeChecklist?.tipologia);
  const TipIcon = TIPOLOGIA_ICON_MAP[tip?.icon || 'Building2'] || Building2;

  return (
    <div className="max-w-6xl mx-auto space-y-6 print:space-y-4">
      {/* Back + Header */}
      <div className="flex items-center gap-3 print:hidden">
        <button onClick={() => { setActiveId(null); setFilterFase(null); setFilterEstado(null); setSearchQuery(''); }} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
      </div>

      {/* Project Header */}
      <div className="bg-card border border-border rounded-2xl p-6 print:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <TipIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{activeChecklist?.nome}</h1>
              <p className="text-sm text-muted-foreground">{tip?.nome}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={() => setShowMemoria(!showMemoria)}
              className="flex items-center gap-2 px-3 py-2 bg-violet-500/10 border border-violet-500/30 text-violet-600 dark:text-violet-400 rounded-lg text-sm font-medium hover:bg-violet-500/20 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Memória Descritiva
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progresso de conformidade</span>
            <span className="font-bold text-lg">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${progressPercent === 100 ? 'bg-emerald-500' : progressPercent > 50 ? 'bg-primary' : 'bg-amber-500'}`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <div className="grid grid-cols-4 gap-2 mt-3">
            <button
              onClick={() => setFilterEstado(null)}
              className={`text-center p-2 rounded-lg text-xs transition-colors ${!filterEstado ? 'bg-primary/10 ring-1 ring-primary/30' : 'hover:bg-muted'}`}
            >
              <span className="font-bold block">{stats.total}</span>
              <span className="text-muted-foreground">Total</span>
            </button>
            <button
              onClick={() => setFilterEstado(filterEstado === 'conforme' ? null : 'conforme')}
              className={`text-center p-2 rounded-lg text-xs transition-colors ${filterEstado === 'conforme' ? 'bg-emerald-500/10 ring-1 ring-emerald-500/30' : 'hover:bg-muted'}`}
            >
              <span className="font-bold block text-emerald-600 dark:text-emerald-400">{stats.conforme}</span>
              <span className="text-muted-foreground">Conforme</span>
            </button>
            <button
              onClick={() => setFilterEstado(filterEstado === 'pendente' ? null : 'pendente')}
              className={`text-center p-2 rounded-lg text-xs transition-colors ${filterEstado === 'pendente' ? 'bg-amber-500/10 ring-1 ring-amber-500/30' : 'hover:bg-muted'}`}
            >
              <span className="font-bold block text-amber-600 dark:text-amber-400">{stats.pendente}</span>
              <span className="text-muted-foreground">Pendente</span>
            </button>
            <button
              onClick={() => setFilterEstado(filterEstado === 'nao_aplicavel' ? null : 'nao_aplicavel')}
              className={`text-center p-2 rounded-lg text-xs transition-colors ${filterEstado === 'nao_aplicavel' ? 'bg-slate-500/10 ring-1 ring-slate-500/30' : 'hover:bg-muted'}`}
            >
              <span className="font-bold block text-slate-500">{stats.nao_aplicavel}</span>
              <span className="text-muted-foreground">N/A</span>
            </button>
          </div>
        </div>

        {/* Critical warning */}
        {stats.critico_pendente > 0 && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-600 dark:text-red-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span><strong>{stats.critico_pendente}</strong> requisito{stats.critico_pendente > 1 ? 's' : ''} crítico{stats.critico_pendente > 1 ? 's' : ''} pendente{stats.critico_pendente > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Memória Descritiva Modal */}
      <AnimatePresence>
        {showMemoria && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-card border-2 border-violet-500/30 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  <h2 className="font-semibold text-lg">Enquadramento Legal — Memória Descritiva</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyMemoria}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/10 rounded-lg text-sm font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-500/20 transition-colors"
                  >
                    {copiedMemoria ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedMemoria ? 'Copiado!' : 'Copiar'}
                  </button>
                  <button onClick={() => setShowMemoria(false)} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
              <pre className="whitespace-pre-wrap text-sm leading-relaxed bg-muted/50 rounded-xl p-5 font-mono text-xs max-h-[400px] overflow-y-auto border border-border">
                {memoriaDescritiva}
              </pre>
              <p className="text-xs text-muted-foreground italic">
                Texto gerado automaticamente com base na tipologia seleccionada. Revise e adapte antes de incluir na memória descritiva oficial.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase Timeline */}
      <div className="flex gap-2 overflow-x-auto pb-1 print:hidden">
        <button
          onClick={() => setFilterFase(null)}
          className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!filterFase ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
        >
          Todas as fases
        </button>
        {FASES_PROJECTO.map(fase => {
          const FaseIcon = FASE_ICON_MAP[fase.icon] || Clock;
          const cor = FASE_COR[fase.cor] || FASE_COR.blue;
          const fs = faseStats[fase.id];
          const fPct = fs ? Math.round((fs.done / fs.total) * 100) : 0;
          const isActive = filterFase === fase.id;

          return (
            <button
              key={fase.id}
              onClick={() => setFilterFase(isActive ? null : fase.id)}
              className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${isActive ? `${cor.bg} ${cor.border} ${cor.text}` : 'bg-muted border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              <FaseIcon className="w-4 h-4" />
              <span>{fase.nome}</span>
              {fs && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${fPct === 100 ? 'bg-emerald-500/20 text-emerald-600' : 'bg-muted-foreground/10'}`}>
                  {fs.done}/{fs.total}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative print:hidden">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Pesquisar requisito..."
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {/* Requirements grouped by phase */}
      <div className="space-y-6 print:space-y-4">
        {groupedByFase.map(({ fase, reqs }) => {
          const FaseIcon = FASE_ICON_MAP[fase.icon] || Clock;
          const cor = FASE_COR[fase.cor] || FASE_COR.blue;
          const fs = faseStats[fase.id];
          const fPct = fs ? Math.round((fs.done / fs.total) * 100) : 0;

          return (
            <div key={fase.id} className="space-y-2">
              {/* Phase Header */}
              <div className="flex items-center gap-3 py-2">
                <div className={`w-8 h-8 rounded-lg ${cor.bg} flex items-center justify-center`}>
                  <FaseIcon className={`w-4 h-4 ${cor.text}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold">{fase.nome}</h2>
                    <span className="text-xs text-muted-foreground">— {fase.descricao}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${fPct === 100 ? 'bg-emerald-500' : 'bg-primary'}`} style={{ width: `${fPct}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{fPct}%</span>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-1.5 ml-1">
                {reqs.map(req => {
                  const estado = activeChecklist!.items[req.id] || 'pendente';
                  const nota = activeChecklist!.notas[req.id] || '';
                  const estCfg = ESTADO_ICON[estado];
                  const EstIcon = estCfg.icon;
                  const isExpanded = expandedReq === req.id;
                  const diploma = diplomaMap[req.diplomaId];

                  return (
                    <div
                      key={req.id}
                      className={`rounded-xl border transition-all ${estado === 'conforme' ? 'bg-emerald-500/5 border-emerald-500/20' : estado === 'nao_aplicavel' ? 'bg-muted/50 border-border opacity-60' : 'bg-card border-border'} ${req.criticidade === 'critico' && estado === 'pendente' ? 'border-l-4 border-l-red-500' : ''}`}
                    >
                      <div className="flex items-start gap-3 p-3">
                        {/* Toggle button */}
                        <button
                          onClick={() => cycleEstado(req.id)}
                          className={`mt-0.5 shrink-0 transition-colors ${estCfg.cor}`}
                          title={`Estado: ${estCfg.label} — clique para alternar`}
                        >
                          <EstIcon className="w-5 h-5" />
                        </button>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm leading-snug ${estado === 'nao_aplicavel' ? 'line-through' : ''} ${estado === 'conforme' ? 'text-emerald-700 dark:text-emerald-300' : ''}`}>
                              {req.texto}
                            </p>
                            <button
                              onClick={() => setExpandedReq(isExpanded ? null : req.id)}
                              className="shrink-0 p-1 hover:bg-muted rounded-lg transition-colors print:hidden"
                            >
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
                            </button>
                          </div>

                          {/* Tags */}
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {diploma && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">{diploma.sigla}</span>
                            )}
                            {req.criticidade === 'critico' && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 font-medium">Crítico</span>
                            )}
                            {req.criticidade === 'informativo' && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium">Info</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded detail */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 pb-3 space-y-2 ml-8">
                              {req.detalhe && (
                                <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">{req.detalhe}</p>
                              )}
                              {diploma && (
                                <p className="text-xs text-muted-foreground">
                                  <strong>Diploma:</strong> {diploma.diploma}
                                </p>
                              )}
                              {/* Note field */}
                              <div>
                                <label className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Nota do projecto</label>
                                <textarea
                                  value={nota}
                                  onChange={e => setNota(req.id, e.target.value)}
                                  placeholder="Adicionar nota..."
                                  rows={2}
                                  className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-xs resize-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredReqs.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium">Nenhum requisito encontrado</p>
          <p className="text-sm text-muted-foreground mt-1">Tente alterar os filtros.</p>
        </div>
      )}

      {/* Print footer */}
      <div className="hidden print:block text-center text-xs text-muted-foreground border-t border-border pt-3">
        <p>Checklist de Conformidade — {activeChecklist?.nome} — {tip?.nome}</p>
        <p>Gerado em {new Date().toLocaleDateString('pt-PT')} pela plataforma FA-360</p>
      </div>
    </div>
  );
}
