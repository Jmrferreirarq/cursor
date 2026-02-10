import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale, Search, ChevronDown, ChevronRight, ExternalLink, BookOpen, Filter,
  Building2, Warehouse, Accessibility, Zap, Flame, Volume2, PlugZap, Wind, Wifi,
  Map, Home, GraduationCap, Sparkles, X, FileText, Link2, Tag, AlertTriangle,
  Shield, HardHat,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { legislacao, CATEGORIAS, type Diploma, type CategoriaLegislacao } from '../data/legislacao';

// Map icon string to component
const ICON_MAP: Record<string, React.ElementType> = {
  Building2, Warehouse, Accessibility, Zap, Flame, Volume2, PlugZap, Wind, Wifi, Map, Home, GraduationCap, Shield, HardHat,
};

const ESTADO_CONFIG: Record<string, { label: string; cor: string; bg: string }> = {
  vigente: { label: 'Vigente', cor: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  parcialmente_revogado: { label: 'Parcialmente revogado', cor: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  revogado: { label: 'Revogado', cor: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
};

export default function LegislacaoPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoria, setActiveCategoria] = useState<string | null>(null);
  const [activeEstado, setActiveEstado] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  // Filtragem
  const filteredDiplomas = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return legislacao.filter(d => {
      if (activeCategoria && d.categoria !== activeCategoria) return false;
      if (activeEstado && d.estado !== activeEstado) return false;
      if (!q) return true;
      return (
        d.sigla.toLowerCase().includes(q) ||
        d.titulo.toLowerCase().includes(q) ||
        d.diploma.toLowerCase().includes(q) ||
        d.resumo.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q)) ||
        d.subcategoria.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, activeCategoria, activeEstado]);

  // Contagens por categoria
  const contagemCategoria = useMemo(() => {
    const map: Record<string, number> = {};
    const q = searchQuery.toLowerCase().trim();
    for (const d of legislacao) {
      if (activeEstado && d.estado !== activeEstado) continue;
      if (q && !(
        d.sigla.toLowerCase().includes(q) ||
        d.titulo.toLowerCase().includes(q) ||
        d.diploma.toLowerCase().includes(q) ||
        d.resumo.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q))
      )) continue;
      map[d.categoria] = (map[d.categoria] || 0) + 1;
    }
    return map;
  }, [searchQuery, activeEstado]);

  const totalFiltrado = filteredDiplomas.length;
  const totalDiplomas = legislacao.length;

  // Agrupados por categoria para exibição
  const grouped = useMemo(() => {
    const map: Record<string, Diploma[]> = {};
    for (const d of filteredDiplomas) {
      if (!map[d.categoria]) map[d.categoria] = [];
      map[d.categoria].push(d);
    }
    return CATEGORIAS.filter(c => map[c.id]).map(c => ({ categoria: c, diplomas: map[c.id] }));
  }, [filteredDiplomas]);

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategoria(null);
    setActiveEstado(null);
  };

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
            <Scale className="w-4 h-4" />
            <span className="text-sm">Biblioteca Legal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Legislacao Portuguesa</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {totalDiplomas} diplomas de arquitetura, urbanismo e construcao
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/consulta-legislacao')}
            className="px-3 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2 font-medium"
          >
            <BookOpen className="w-4 h-4" />
            Consulta por Tipologia
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 text-sm rounded-lg border transition-colors flex items-center gap-2 ${showFilters ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-muted border-border'}`}
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
          {(activeCategoria || activeEstado || searchQuery) && (
            <button onClick={clearFilters} className="px-3 py-2 text-sm rounded-lg bg-muted border border-border hover:border-primary/30 transition-colors flex items-center gap-1.5">
              <X className="w-3.5 h-3.5" />
              Limpar
            </button>
          )}
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Pesquisar por sigla, titulo, artigo, palavra-chave..."
          className="w-full pl-12 pr-4 py-3.5 bg-card border border-border rounded-xl text-sm focus:border-primary focus:outline-none transition-colors"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>

      <div className={`flex flex-col ${showFilters ? 'lg:flex-row' : ''} gap-6`}>
        {/* Sidebar Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.aside
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="lg:w-72 shrink-0 space-y-4"
            >
              {/* Categorias */}
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  Categorias
                </p>
                <div className="space-y-1">
                  {CATEGORIAS.map(cat => {
                    const count = contagemCategoria[cat.id] || 0;
                    const Icon = ICON_MAP[cat.icon] || BookOpen;
                    const isActive = activeCategoria === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategoria(isActive ? null : cat.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors text-left ${
                          isActive
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'hover:bg-muted border border-transparent'
                        } ${count === 0 ? 'opacity-40' : ''}`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="flex-1 truncate">{cat.nome}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-primary/20' : 'bg-muted'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Estado */}
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Estado
                </p>
                <div className="space-y-1">
                  {Object.entries(ESTADO_CONFIG).map(([key, cfg]) => {
                    const isActive = activeEstado === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveEstado(isActive ? null : key)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors text-left ${
                          isActive ? `${cfg.bg} border` : 'hover:bg-muted border border-transparent'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${cfg.cor.replace('text-', 'bg-')}`} />
                        <span className="flex-1">{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stats */}
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-primary">{totalFiltrado}</p>
                <p className="text-xs text-muted-foreground">
                  {totalFiltrado === totalDiplomas ? 'diplomas na biblioteca' : `de ${totalDiplomas} diplomas`}
                </p>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-6">
          {grouped.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Scale className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Nenhum diploma encontrado.</p>
              <button onClick={clearFilters} className="mt-3 text-sm text-primary hover:underline">
                Limpar filtros
              </button>
            </motion.div>
          ) : (
            grouped.map(({ categoria, diplomas }, gi) => (
              <motion.div
                key={categoria.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.05 }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-3">
                  {(() => {
                    const Icon = ICON_MAP[categoria.icon] || BookOpen;
                    return <Icon className="w-5 h-5 text-primary" />;
                  })()}
                  <div>
                    <h2 className="text-lg font-semibold">{categoria.nome}</h2>
                    <p className="text-xs text-muted-foreground">{categoria.descricao}</p>
                  </div>
                  <span className="ml-auto text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    {diplomas.length}
                  </span>
                </div>

                {/* Diploma Cards */}
                <div className="space-y-2">
                  {diplomas.map((d: Diploma) => {
                    const isExpanded = expandedId === d.id;
                    const estadoCfg = ESTADO_CONFIG[d.estado];
                    return (
                      <motion.div
                        key={d.id}
                        layout
                        className="bg-card border border-border rounded-xl overflow-hidden hover:border-muted-foreground/20 transition-colors"
                      >
                        {/* Card Header */}
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : d.id)}
                          className="w-full flex items-start gap-3 p-4 text-left"
                        >
                          <div className="mt-0.5">
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-primary" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-sm font-bold text-primary">{d.sigla}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${estadoCfg.bg} ${estadoCfg.cor}`}>
                                {estadoCfg.label}
                              </span>
                              {d.simplex && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  Simplex
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-medium">{d.titulo}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{d.diploma}</p>
                            {d.ultimaAlteracao && (
                              <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                                Ult. alteracao: {d.ultimaAlteracao}
                              </p>
                            )}
                          </div>
                        </button>

                        {/* Expanded Content */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 pt-0 border-t border-border space-y-4">
                                {/* Resumo */}
                                <div className="pt-3">
                                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Resumo</p>
                                  <p className="text-sm leading-relaxed">{d.resumo}</p>
                                </div>

                                {/* Aplicação prática */}
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

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1.5">
                                  <Tag className="w-3 h-3 text-muted-foreground mt-0.5" />
                                  {d.tags.map((tag: string) => (
                                    <button
                                      key={tag}
                                      onClick={() => setSearchQuery(tag)}
                                      className="text-[10px] px-2 py-0.5 rounded-full bg-muted border border-border hover:border-primary/30 transition-colors cursor-pointer"
                                    >
                                      {tag}
                                    </button>
                                  ))}
                                </div>

                                {/* Links */}
                                <div className="flex flex-wrap gap-2 pt-1">
                                  {d.linkDRE && (
                                    <a
                                      href={d.linkDRE}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      Diario da Republica
                                    </a>
                                  )}
                                  {d.linkPGDL && (
                                    <a
                                      href={d.linkPGDL}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-muted text-muted-foreground border border-border hover:border-primary/30 transition-colors"
                                    >
                                      <Link2 className="w-3 h-3" />
                                      PGDL (consolidado)
                                    </a>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
