import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale, Search, ChevronDown, ChevronRight, ExternalLink, BookOpen, Filter,
  Building2, Warehouse, Accessibility, Zap, Flame, Volume2, PlugZap, Wind, Wifi,
  Map, Home, GraduationCap, Shield, HardHat, ArrowLeft, Download, Printer,
  CheckCircle2, AlertCircle, Info, X, FileText, Link2, Tag, Building, Factory,
  Hammer, Landmark, Hotel, TreePine, Sparkles, ClipboardList, ChevronUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { legislacao, CATEGORIAS, type Diploma, type CategoriaLegislacao } from '../data/legislacao';
import { TIPOLOGIAS, TIPOLOGIA_DIPLOMAS, type Tipologia, type TipologiaDiploma } from '../data/tipologias';

// Icon maps
const TIPOLOGIA_ICON_MAP: Record<string, React.ElementType> = {
  Home, Building, Building2, Warehouse, Factory, Hammer, Landmark, Hotel, Map, TreePine,
};

const CATEGORIA_ICON_MAP: Record<string, React.ElementType> = {
  Building2, Warehouse, Accessibility, Zap, Flame, Volume2, PlugZap, Wind, Wifi, Map, Home, GraduationCap, Shield, HardHat,
};

const COR_MAP: Record<string, { bg: string; border: string; text: string; badge: string; light: string }> = {
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    text: 'text-blue-600 dark:text-blue-400',    badge: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',    light: 'bg-blue-50 dark:bg-blue-950/30' },
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   text: 'text-amber-600 dark:text-amber-400',   badge: 'bg-amber-500/20 text-amber-700 dark:text-amber-300',   light: 'bg-amber-50 dark:bg-amber-950/30' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300', light: 'bg-emerald-50 dark:bg-emerald-950/30' },
  violet:  { bg: 'bg-violet-500/10',  border: 'border-violet-500/30',  text: 'text-violet-600 dark:text-violet-400',  badge: 'bg-violet-500/20 text-violet-700 dark:text-violet-300',  light: 'bg-violet-50 dark:bg-violet-950/30' },
  rose:    { bg: 'bg-rose-500/10',    border: 'border-rose-500/30',    text: 'text-rose-600 dark:text-rose-400',    badge: 'bg-rose-500/20 text-rose-700 dark:text-rose-300',    light: 'bg-rose-50 dark:bg-rose-950/30' },
  cyan:    { bg: 'bg-cyan-500/10',    border: 'border-cyan-500/30',    text: 'text-cyan-600 dark:text-cyan-400',    badge: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300',    light: 'bg-cyan-50 dark:bg-cyan-950/30' },
  orange:  { bg: 'bg-orange-500/10',  border: 'border-orange-500/30',  text: 'text-orange-600 dark:text-orange-400',  badge: 'bg-orange-500/20 text-orange-700 dark:text-orange-300',  light: 'bg-orange-50 dark:bg-orange-950/30' },
  slate:   { bg: 'bg-slate-500/10',   border: 'border-slate-500/30',   text: 'text-slate-600 dark:text-slate-400',   badge: 'bg-slate-500/20 text-slate-700 dark:text-slate-300',   light: 'bg-slate-50 dark:bg-slate-950/30' },
  lime:    { bg: 'bg-lime-500/10',    border: 'border-lime-500/30',    text: 'text-lime-600 dark:text-lime-400',    badge: 'bg-lime-500/20 text-lime-700 dark:text-lime-300',    light: 'bg-lime-50 dark:bg-lime-950/30' },
  pink:    { bg: 'bg-pink-500/10',    border: 'border-pink-500/30',    text: 'text-pink-600 dark:text-pink-400',    badge: 'bg-pink-500/20 text-pink-700 dark:text-pink-300',    light: 'bg-pink-50 dark:bg-pink-950/30' },
};

const RELEVANCIA_CONFIG: Record<string, { label: string; icon: React.ElementType; cor: string; bg: string }> = {
  obrigatorio: { label: 'Obrigatório', icon: CheckCircle2, cor: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10 border-red-500/30' },
  frequente:   { label: 'Frequente',   icon: AlertCircle,  cor: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  condicional: { label: 'Condicional', icon: Info,          cor: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
};

const diplomaMap = useMemoLookup();

function useMemoLookup(): Record<string, Diploma> {
  const map: Record<string, Diploma> = {};
  for (const d of legislacao) map[d.id] = d;
  return map;
}

export default function ConsultaLegislacaoPage() {
  const navigate = useNavigate();
  const [selectedTipologia, setSelectedTipologia] = useState<string | null>(null);
  const [expandedDiploma, setExpandedDiploma] = useState<string | null>(null);
  const [filterRelevancia, setFilterRelevancia] = useState<string | null>(null);
  const [filterCategoria, setFilterCategoria] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const printRef = useRef<HTMLDivElement>(null);

  const tipologia = TIPOLOGIAS.find(t => t.id === selectedTipologia);
  const corConfig = tipologia ? COR_MAP[tipologia.cor] || COR_MAP.blue : COR_MAP.blue;

  // Get diplomas for selected typology
  const tipologiaDiplomas = useMemo(() => {
    if (!selectedTipologia || !TIPOLOGIA_DIPLOMAS[selectedTipologia]) return [];
    return TIPOLOGIA_DIPLOMAS[selectedTipologia]
      .map(td => ({
        ...td,
        diploma: diplomaMap[td.diplomaId],
      }))
      .filter(td => td.diploma);
  }, [selectedTipologia]);

  // Filter diplomas
  const filteredDiplomas = useMemo(() => {
    let items = tipologiaDiplomas;
    if (filterRelevancia) {
      items = items.filter(d => d.relevancia === filterRelevancia);
    }
    if (filterCategoria) {
      items = items.filter(d => d.diploma.categoria === filterCategoria);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(d =>
        d.diploma.sigla.toLowerCase().includes(q) ||
        d.diploma.titulo.toLowerCase().includes(q) ||
        d.diploma.resumo.toLowerCase().includes(q) ||
        d.nota.toLowerCase().includes(q)
      );
    }
    return items;
  }, [tipologiaDiplomas, filterRelevancia, filterCategoria, searchQuery]);

  // Group by category
  const grouped = useMemo(() => {
    const map: Record<string, typeof filteredDiplomas> = {};
    for (const d of filteredDiplomas) {
      const cat = d.diploma.categoria;
      if (!map[cat]) map[cat] = [];
      map[cat].push(d);
    }
    return CATEGORIAS.filter(c => map[c.id]).map(c => ({ categoria: c, diplomas: map[c.id] }));
  }, [filteredDiplomas]);

  // Relevance stats
  const stats = useMemo(() => {
    const s = { obrigatorio: 0, frequente: 0, condicional: 0, total: 0 };
    for (const d of tipologiaDiplomas) {
      s[d.relevancia]++;
      s.total++;
    }
    return s;
  }, [tipologiaDiplomas]);

  // Categories present
  const availableCategories = useMemo(() => {
    const catIds = new Set(tipologiaDiplomas.map(d => d.diploma.categoria));
    return CATEGORIAS.filter(c => catIds.has(c.id));
  }, [tipologiaDiplomas]);

  const handlePrint = () => {
    window.print();
  };

  // ─── Typology Selection View ───────────────────────────
  if (!selectedTipologia) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Consulta de Legislação por Tipologia</h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Selecione a tipologia do seu projecto para ver toda a legislação aplicável
              </p>
            </div>
          </div>

          {/* Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-primary">{legislacao.length}</p>
              <p className="text-xs text-muted-foreground">Diplomas</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-primary">{CATEGORIAS.length}</p>
              <p className="text-xs text-muted-foreground">Categorias</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-primary">{TIPOLOGIAS.length}</p>
              <p className="text-xs text-muted-foreground">Tipologias</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-primary">100%</p>
              <p className="text-xs text-muted-foreground">Cobertura</p>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => navigate('/legislacao')}
              className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium transition-colors"
            >
              <Scale className="w-4 h-4" />
              Biblioteca Completa
            </button>
            <button
              onClick={() => navigate('/checklist')}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <ClipboardList className="w-4 h-4" />
              Checklists de Conformidade
            </button>
          </div>
        </div>

        {/* Typology Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {TIPOLOGIAS.map((tip, idx) => {
            const Icon = TIPOLOGIA_ICON_MAP[tip.icon] || Building2;
            const cor = COR_MAP[tip.cor] || COR_MAP.blue;
            const diplomaCount = TIPOLOGIA_DIPLOMAS[tip.id]?.length || 0;
            const obrigatorioCount = TIPOLOGIA_DIPLOMAS[tip.id]?.filter(d => d.relevancia === 'obrigatorio').length || 0;

            return (
              <motion.button
                key={tip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedTipologia(tip.id)}
                className={`text-left p-5 rounded-2xl border-2 ${cor.border} ${cor.light} hover:scale-[1.02] hover:shadow-lg transition-all duration-200 group`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${cor.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${cor.text}`} />
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-semibold text-base mb-1">{tip.nome}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{tip.descricao}</p>
                <div className="flex items-center gap-3 text-xs">
                  <span className={`px-2 py-0.5 rounded-full ${cor.badge} font-medium`}>
                    {diplomaCount} diplomas
                  </span>
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    {obrigatorioCount} obrigatórios
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="bg-muted/50 border border-border rounded-xl p-5">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Como funciona:</strong> Selecione a tipologia do projecto para obter uma lista completa e organizada de toda a legislação aplicável.</p>
              <p>Cada diploma é classificado como <span className="text-red-600 dark:text-red-400 font-medium">Obrigatório</span>, <span className="text-amber-600 dark:text-amber-400 font-medium">Frequente</span> ou <span className="text-blue-600 dark:text-blue-400 font-medium">Condicional</span>, com notas explicativas sobre a sua aplicação.</p>
              <p>Pode imprimir ou exportar o relatório para utilização em reuniões, memórias descritivas e processos de licenciamento.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Typology Detail View ───────────────────────────
  const TipIcon = TIPOLOGIA_ICON_MAP[tipologia?.icon || 'Building2'] || Building2;

  return (
    <div className="max-w-7xl mx-auto space-y-6 print:space-y-4">
      {/* Back + Header */}
      <div className="flex flex-col gap-4 print:gap-2">
        <button
          onClick={() => { setSelectedTipologia(null); setExpandedDiploma(null); setFilterRelevancia(null); setFilterCategoria(null); setSearchQuery(''); }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit print:hidden"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar às tipologias
        </button>

        <div className={`rounded-2xl border-2 ${corConfig.border} ${corConfig.light} p-6 print:p-4`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl ${corConfig.bg} flex items-center justify-center print:w-10 print:h-10`}>
                <TipIcon className={`w-7 h-7 ${corConfig.text} print:w-5 print:h-5`} />
              </div>
              <div>
                <h1 className="text-2xl font-bold print:text-xl">{tipologia?.nome}</h1>
                <p className="text-sm text-muted-foreground">{tipologia?.descricao}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={() => navigate('/legislacao')}
                className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm font-medium transition-colors"
              >
                <Scale className="w-4 h-4" />
                Biblioteca
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Printer className="w-4 h-4" />
                Imprimir
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            <div className="text-center p-3 bg-background/60 rounded-xl">
              <p className="text-xl font-bold">{stats.total}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</p>
            </div>
            <button
              onClick={() => setFilterRelevancia(filterRelevancia === 'obrigatorio' ? null : 'obrigatorio')}
              className={`text-center p-3 rounded-xl transition-colors ${filterRelevancia === 'obrigatorio' ? 'bg-red-500/20 ring-2 ring-red-500/50' : 'bg-background/60 hover:bg-red-500/10'}`}
            >
              <p className="text-xl font-bold text-red-600 dark:text-red-400">{stats.obrigatorio}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Obrigatórios</p>
            </button>
            <button
              onClick={() => setFilterRelevancia(filterRelevancia === 'frequente' ? null : 'frequente')}
              className={`text-center p-3 rounded-xl transition-colors ${filterRelevancia === 'frequente' ? 'bg-amber-500/20 ring-2 ring-amber-500/50' : 'bg-background/60 hover:bg-amber-500/10'}`}
            >
              <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{stats.frequente}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Frequentes</p>
            </button>
            <button
              onClick={() => setFilterRelevancia(filterRelevancia === 'condicional' ? null : 'condicional')}
              className={`text-center p-3 rounded-xl transition-colors ${filterRelevancia === 'condicional' ? 'bg-blue-500/20 ring-2 ring-blue-500/50' : 'bg-background/60 hover:bg-blue-500/10'}`}
            >
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{stats.condicional}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Condicionais</p>
            </button>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 print:hidden">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Pesquisar diploma, sigla ou resumo..."
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {/* Category filter */}
        <select
          value={filterCategoria || ''}
          onChange={e => setFilterCategoria(e.target.value || null)}
          className="px-3 py-2.5 bg-card border border-border rounded-xl text-sm min-w-[200px]"
        >
          <option value="">Todas as categorias</option>
          {availableCategories.map(c => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>

        {/* Clear filters */}
        {(filterRelevancia || filterCategoria || searchQuery) && (
          <button
            onClick={() => { setFilterRelevancia(null); setFilterCategoria(null); setSearchQuery(''); }}
            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
            Limpar
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground print:hidden">
        A mostrar <strong>{filteredDiplomas.length}</strong> de {tipologiaDiplomas.length} diplomas
        {filterRelevancia && <span> — filtro: <strong>{RELEVANCIA_CONFIG[filterRelevancia]?.label}</strong></span>}
        {filterCategoria && <span> — categoria: <strong>{availableCategories.find(c => c.id === filterCategoria)?.nome}</strong></span>}
      </p>

      {/* Print header */}
      <div className="hidden print:block text-center mb-4">
        <h2 className="text-xl font-bold">Legislação Aplicável — {tipologia?.nome}</h2>
        <p className="text-sm text-muted-foreground">Gerado pela plataforma FA-360 • {new Date().toLocaleDateString('pt-PT')}</p>
      </div>

      {/* Grouped Legislation */}
      <div ref={printRef} className="space-y-6 print:space-y-4">
        {grouped.map(({ categoria, diplomas }) => {
          const CatIcon = CATEGORIA_ICON_MAP[categoria.icon] || Scale;

          return (
            <div key={categoria.id} className="space-y-3 print:break-inside-avoid">
              {/* Category Header */}
              <div className="flex items-center gap-3 py-2 border-b border-border">
                <CatIcon className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">{categoria.nome}</h2>
                <span className="ml-auto text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                  {diplomas.length}
                </span>
              </div>

              {/* Diploma Cards */}
              <div className="space-y-2">
                {diplomas.map((item) => {
                  const d = item.diploma;
                  const isExpanded = expandedDiploma === d.id;
                  const relCfg = RELEVANCIA_CONFIG[item.relevancia];
                  const RelIcon = relCfg.icon;

                  return (
                    <div
                      key={d.id}
                      className={`bg-card border rounded-xl overflow-hidden transition-all ${isExpanded ? 'border-primary/30 shadow-md' : 'border-border hover:border-muted-foreground/20'} print:break-inside-avoid`}
                    >
                      {/* Card Header */}
                      <button
                        onClick={() => setExpandedDiploma(isExpanded ? null : d.id)}
                        className="w-full flex items-start gap-3 p-4 text-left print:p-3"
                      >
                        <div className={`w-8 h-8 rounded-lg border ${relCfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                          <RelIcon className={`w-4 h-4 ${relCfg.cor}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-primary">{d.sigla}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${relCfg.bg} border ${relCfg.cor}`}>
                              {relCfg.label}
                            </span>
                            {d.simplex && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                                <Sparkles className="w-2.5 h-2.5" />
                                Simplex
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-medium mt-1 leading-snug">{d.titulo}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1 italic">{item.nota}</p>
                        </div>

                        <div className="print:hidden">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </button>

                      {/* Expanded Detail */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
                              {/* Diploma info */}
                              <div className="text-xs text-muted-foreground space-y-1">
                                <p><strong>Diploma:</strong> {d.diploma}</p>
                                {d.ultimaAlteracao && <p><strong>Última alteração:</strong> {d.ultimaAlteracao}</p>}
                              </div>

                              {/* Nota de aplicação */}
                              <div className={`p-3 rounded-lg ${relCfg.bg} border ${relCfg.cor.replace('text-', 'border-').split(' ')[0]}/20`}>
                                <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-muted-foreground">Porquê este diploma?</p>
                                <p className="text-sm">{item.nota}</p>
                              </div>

                              {/* Resumo */}
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Resumo</p>
                                <p className="text-sm leading-relaxed">{d.resumo}</p>
                              </div>

                              {/* Quando se aplica */}
                              {d.aplicacao.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Quando se aplica</p>
                                  <ul className="space-y-1">
                                    {d.aplicacao.map((a: string, i: number) => (
                                      <li key={i} className="flex items-start gap-2 text-sm">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                        {a}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Artigos-chave */}
                              {d.artigosChave.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Artigos-chave</p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                                    {d.artigosChave.map((ac: { artigo: string; descricao: string }, i: number) => (
                                      <div key={i} className="flex items-start gap-2 px-2.5 py-1.5 bg-muted/50 rounded-lg">
                                        <span className="text-[10px] font-bold text-primary whitespace-nowrap mt-0.5">{ac.artigo}</span>
                                        <span className="text-xs text-muted-foreground">{ac.descricao}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Links */}
                              <div className="flex flex-wrap gap-2 pt-1">
                                {d.linkDRE && (
                                  <a
                                    href={d.linkDRE}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/60 hover:bg-muted rounded-lg text-xs font-medium transition-colors"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    DRE
                                  </a>
                                )}
                                {d.linkPGDL && (
                                  <a
                                    href={d.linkPGDL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/60 hover:bg-muted rounded-lg text-xs font-medium transition-colors"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    PGDL
                                  </a>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Print: always show key info */}
                      <div className="hidden print:block px-4 pb-3 text-xs space-y-1">
                        <p><strong>Diploma:</strong> {d.diploma}</p>
                        <p className="italic">{item.nota}</p>
                        <p className="text-[10px] text-muted-foreground">{d.resumo.slice(0, 200)}...</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredDiplomas.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium">Nenhum diploma encontrado</p>
          <p className="text-sm text-muted-foreground mt-1">Tente alterar os filtros ou a pesquisa.</p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground py-4 border-t border-border print:mt-4">
        <p>FA-360 Platform — Biblioteca de Legislação Portuguesa</p>
        <p className="mt-1">Nota: Esta ferramenta é de apoio técnico. Consulte sempre o diploma oficial no DRE para efeitos legais.</p>
      </div>
    </div>
  );
}
