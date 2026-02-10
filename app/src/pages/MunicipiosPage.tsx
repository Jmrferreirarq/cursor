import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Search,
  ExternalLink,
  Star,
  Globe,
  FileText,
  Building2,
  Map,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Bookmark,
  BookOpen,
  StickyNote,
  X,
  Filter,
  Printer,
  Ruler,
  Car,
  TreePine,
  Accessibility,
  FileCheck,
  AlertTriangle,
  Receipt,
  Hotel,
  CheckCircle2,
  ClipboardList,
  Info,
} from 'lucide-react';
import { municipios, DISTRITOS, SNIT_URL, SNIT_VIEWER_URL, TOPICOS_GENERICOS } from '../data/municipios';
import type { Municipio, DocumentoMunicipal, TopicoRegulamentar } from '../data/municipios';

const TOPICO_ICON_MAP: Record<string, React.ElementType> = {
  Ruler, Car, TreePine, Accessibility, FileCheck, AlertTriangle, Receipt, Hotel, Map, Building2,
};

const TOPICO_COR_MAP: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  Ruler:          { bg: 'bg-blue-500/5',    border: 'border-blue-500/20',    text: 'text-blue-700 dark:text-blue-300',    icon: 'text-blue-500' },
  Car:            { bg: 'bg-violet-500/5',  border: 'border-violet-500/20',  text: 'text-violet-700 dark:text-violet-300',  icon: 'text-violet-500' },
  TreePine:       { bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-300', icon: 'text-emerald-500' },
  Accessibility:  { bg: 'bg-cyan-500/5',    border: 'border-cyan-500/20',    text: 'text-cyan-700 dark:text-cyan-300',    icon: 'text-cyan-500' },
  FileCheck:      { bg: 'bg-amber-500/5',   border: 'border-amber-500/20',   text: 'text-amber-700 dark:text-amber-300',   icon: 'text-amber-500' },
  AlertTriangle:  { bg: 'bg-red-500/5',     border: 'border-red-500/20',     text: 'text-red-700 dark:text-red-300',     icon: 'text-red-500' },
  Receipt:        { bg: 'bg-orange-500/5',  border: 'border-orange-500/20',  text: 'text-orange-700 dark:text-orange-300',  icon: 'text-orange-500' },
  Hotel:          { bg: 'bg-pink-500/5',    border: 'border-pink-500/20',    text: 'text-pink-700 dark:text-pink-300',    icon: 'text-pink-500' },
};

export default function MunicipiosPage() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [distritoFiltro, setDistritoFiltro] = useState<string>('todos');
  const [apenasFrequentes, setApenasFrequentes] = useState(false);
  const [municipioExpandido, setMunicipioExpandido] = useState<string | null>(null);
  const [notasLocais, setNotasLocais] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem('fa360_municipios_notas') || '{}');
    } catch { return {}; }
  });
  const [editandoNota, setEditandoNota] = useState<string | null>(null);
  const [textoNota, setTextoNota] = useState('');

  const municipiosFiltrados = useMemo(() => {
    let lista = [...municipios];

    if (apenasFrequentes) {
      lista = lista.filter((m: Municipio) => m.frequente);
    }

    if (distritoFiltro !== 'todos') {
      lista = lista.filter((m: Municipio) => m.distrito === distritoFiltro);
    }

    if (busca.trim()) {
      const termo = busca.toLowerCase().trim();
      lista = lista.filter((m: Municipio) =>
        m.nome.toLowerCase().includes(termo) ||
        m.distrito.toLowerCase().includes(termo) ||
        (m.notas && m.notas.toLowerCase().includes(termo))
      );
    }

    // Frequentes primeiro, depois por nome
    lista.sort((a: Municipio, b: Municipio) => {
      if (a.frequente && !b.frequente) return -1;
      if (!a.frequente && b.frequente) return 1;
      return a.nome.localeCompare(b.nome, 'pt');
    });

    return lista;
  }, [busca, distritoFiltro, apenasFrequentes]);

  const distritosComContagem = useMemo(() => {
    const contagem: Record<string, number> = {};
    municipios.forEach((m: Municipio) => {
      contagem[m.distrito] = (contagem[m.distrito] || 0) + 1;
    });
    return DISTRITOS.filter((d) => contagem[d.id]).map((d) => ({
      ...d,
      count: contagem[d.id] || 0,
    }));
  }, []);

  const guardarNota = (municipioId: string) => {
    const novas = { ...notasLocais, [municipioId]: textoNota };
    if (!textoNota.trim()) {
      delete novas[municipioId];
    }
    setNotasLocais(novas);
    localStorage.setItem('fa360_municipios_notas', JSON.stringify(novas));
    setEditandoNota(null);
  };

  const totalFrequentes = municipios.filter((m: Municipio) => m.frequente).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate('/legislacao')}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              title="Voltar à Legislação"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Directório de Municípios</h1>
              <p className="text-sm text-muted-foreground">
                PDMs, Geoportais, RMUE e regulamentos locais
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <a
            href={SNIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
          >
            <Globe className="w-4 h-4" />
            SNIT Nacional
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href={SNIT_VIEWER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors text-sm font-medium"
          >
            <Map className="w-4 h-4" />
            Visualizador SNIT
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
            title="Imprimir"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-200">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium mb-1">Nota sobre PDMs</p>
            <p className="text-amber-700 dark:text-amber-300">
              Os PDMs são documentos extensos e actualizados frequentemente. Em vez de os integrar directamente,
              este directório oferece links directos para o <strong>SNIT</strong> (Sistema Nacional de Informação Territorial),
              geoportais e sites das câmaras municipais. Consulte sempre a versão mais recente no portal oficial.
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Pesquisar município..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {busca && (
            <button
              onClick={() => setBusca('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={distritoFiltro}
            onChange={(e) => setDistritoFiltro(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="todos">Todos os distritos ({municipios.length})</option>
            {distritosComContagem.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nome} ({d.count})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setApenasFrequentes(!apenasFrequentes)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
            apenasFrequentes
              ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400'
              : 'border-border bg-card text-muted-foreground hover:bg-muted'
          }`}
        >
          <Star className={`w-4 h-4 ${apenasFrequentes ? 'fill-yellow-500' : ''}`} />
          Frequentes ({totalFrequentes})
        </button>
      </div>

      {/* Resultados */}
      <div className="text-sm text-muted-foreground">
        {municipiosFiltrados.length} município{municipiosFiltrados.length !== 1 ? 's' : ''}
        {busca && ` para "${busca}"`}
      </div>

      {/* Lista de municípios */}
      <div className="grid gap-3">
        <AnimatePresence mode="popLayout">
          {municipiosFiltrados.map((m: Municipio, idx: number) => {
            const isExpanded = municipioExpandido === m.id;
            const distritoLabel = DISTRITOS.find((d) => d.id === m.distrito)?.nome || m.distrito;
            const notaLocal = notasLocais[m.id] || '';

            return (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: idx * 0.02 }}
                className={`border rounded-xl overflow-hidden transition-all ${
                  isExpanded
                    ? 'border-primary/30 bg-card shadow-md'
                    : 'border-border bg-card hover:border-primary/20 hover:shadow-sm'
                }`}
              >
                {/* Linha principal */}
                <button
                  onClick={() => setMunicipioExpandido(isExpanded ? null : m.id)}
                  className="w-full flex items-center gap-4 p-4 text-left"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    m.frequente
                      ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {m.frequente ? (
                      <Star className="w-5 h-5 fill-current" />
                    ) : (
                      <Building2 className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-base">{m.nome}</span>
                      {m.frequente && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 font-medium uppercase tracking-wider">
                          Frequente
                        </span>
                      )}
                      {notaLocal && (
                        <StickyNote className="w-3.5 h-3.5 text-amber-500" />
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">{distritoLabel}</span>
                  </div>

                  {/* Quick links visíveis sem expandir */}
                  <div className="hidden sm:flex items-center gap-1.5">
                    {m.linkPDM && (
                      <a
                        href={m.linkPDM}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                        title="PDM no SNIT"
                      >
                        PDM
                      </a>
                    )}
                    {m.linkGeoportal && (
                      <a
                        href={m.linkGeoportal}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-colors"
                        title="Geoportal"
                      >
                        SIG
                      </a>
                    )}
                    {m.linkCamara && (
                      <a
                        href={m.linkCamara}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium hover:bg-muted/80 transition-colors"
                        title="Site da Câmara"
                      >
                        CM
                      </a>
                    )}
                  </div>

                  <ChevronRight className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${
                    isExpanded ? 'rotate-90' : ''
                  }`} />
                </button>

                {/* Detalhes expandidos */}
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
                        {/* Links */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {m.linkPDM && (
                            <a
                              href={m.linkPDM}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors text-sm"
                            >
                              <FileText className="w-4 h-4 text-primary" />
                              <div>
                                <div className="font-medium">PDM</div>
                                <div className="text-xs text-muted-foreground">SNIT</div>
                              </div>
                              <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                            </a>
                          )}
                          {m.linkGeoportal && (
                            <a
                              href={m.linkGeoportal}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/5 hover:bg-blue-500/10 transition-colors text-sm"
                            >
                              <Map className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <div>
                                <div className="font-medium">Geoportal</div>
                                <div className="text-xs text-muted-foreground">SIG Municipal</div>
                              </div>
                              <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                            </a>
                          )}
                          {m.linkCamara && (
                            <a
                              href={m.linkCamara}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm"
                            >
                              <Building2 className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <div className="font-medium">Câmara</div>
                                <div className="text-xs text-muted-foreground">Site oficial</div>
                              </div>
                              <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                            </a>
                          )}
                          {m.linkEurbanismo && (
                            <a
                              href={m.linkEurbanismo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-3 rounded-lg bg-green-500/5 hover:bg-green-500/10 transition-colors text-sm"
                            >
                              <Globe className="w-4 h-4 text-green-600 dark:text-green-400" />
                              <div>
                                <div className="font-medium">e-Urbanismo</div>
                                <div className="text-xs text-muted-foreground">Portal</div>
                              </div>
                              <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                            </a>
                          )}
                          {m.linkRMUE && (
                            <a
                              href={m.linkRMUE}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-3 rounded-lg bg-purple-500/5 hover:bg-purple-500/10 transition-colors text-sm"
                            >
                              <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              <div>
                                <div className="font-medium">RMUE</div>
                                <div className="text-xs text-muted-foreground">Regulamento</div>
                              </div>
                              <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                            </a>
                          )}
                          {m.linkAL && (
                            <a
                              href={m.linkAL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-3 rounded-lg bg-orange-500/5 hover:bg-orange-500/10 transition-colors text-sm"
                            >
                              <Bookmark className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                              <div>
                                <div className="font-medium">Alojamento Local</div>
                                <div className="text-xs text-muted-foreground">Regulamento</div>
                              </div>
                              <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
                            </a>
                          )}
                        </div>

                        {/* ═══ RESUMO REGULAMENTAR ═══ */}
                        {(() => {
                          const topicos = m.topicos && m.topicos.length > 0 ? m.topicos : TOPICOS_GENERICOS;
                          const isGeneric = !m.topicos || m.topicos.length === 0;
                          return (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="font-medium text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                  <ClipboardList className="w-3.5 h-3.5" />
                                  Resumo Regulamentar ({topicos.length} categorias)
                                </div>
                                {isGeneric && (
                                  <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium">
                                    <Info className="w-3 h-3" />
                                    Checklist genérico
                                  </span>
                                )}
                              </div>

                              <div className="grid gap-2">
                                {topicos.map((topico: TopicoRegulamentar, ti: number) => {
                                  const TIcon = TOPICO_ICON_MAP[topico.icon] || FileCheck;
                                  const cor = TOPICO_COR_MAP[topico.icon] || TOPICO_COR_MAP.Ruler;

                                  return (
                                    <div
                                      key={ti}
                                      className={`rounded-lg border ${cor.border} overflow-hidden`}
                                    >
                                      <div className={`flex items-center gap-2 px-3 py-2.5 ${cor.bg}`}>
                                        <TIcon className={`w-4 h-4 ${cor.icon} shrink-0`} />
                                        <span className={`text-xs font-semibold ${cor.text}`}>{topico.categoria}</span>
                                        <span className="text-[10px] text-muted-foreground ml-auto">{topico.itens.length} itens</span>
                                      </div>
                                      <div className="px-3 py-2 space-y-1.5">
                                        {topico.itens.map((item: string, ii: number) => (
                                          <div key={ii} className="flex items-start gap-2 text-sm">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0 mt-0.5" />
                                            <span className="text-xs leading-relaxed">{item}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Documentos municipais do atelier */}
                        {m.documentos && m.documentos.length > 0 && (
                          <div className="space-y-2">
                            <div className="font-medium text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5" />
                              Documentos do atelier ({m.documentos.length})
                            </div>
                            <div className="grid gap-1.5">
                              {m.documentos.map((doc: DocumentoMunicipal, di: number) => {
                                const tipoColors: Record<string, string> = {
                                  pdm: 'bg-primary/10 text-primary border-primary/20',
                                  regulamento: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
                                  planta: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
                                  nomenclatura: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
                                  outro: 'bg-muted text-muted-foreground border-border',
                                };
                                const corTipo = tipoColors[doc.tipo] || tipoColors.outro;

                                return (
                                  <div
                                    key={di}
                                    className={`flex items-start gap-3 p-3 rounded-lg border ${corTipo} text-sm`}
                                  >
                                    <div className="shrink-0 mt-0.5">
                                      {doc.tipo === 'planta' ? (
                                        <Map className="w-4 h-4" />
                                      ) : doc.tipo === 'nomenclatura' ? (
                                        <BookOpen className="w-4 h-4" />
                                      ) : (
                                        <FileText className="w-4 h-4" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-medium">{doc.sigla || doc.nome}</span>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full border font-medium uppercase tracking-wider">
                                          {doc.tipo}
                                        </span>
                                      </div>
                                      {doc.sigla && doc.nome !== doc.sigla && (
                                        <p className="text-xs opacity-80 mt-0.5">{doc.nome}</p>
                                      )}
                                      {doc.descricao && (
                                        <p className="text-xs opacity-70 mt-1">{doc.descricao}</p>
                                      )}
                                      {doc.ficheiro && (
                                        <p className="text-[10px] opacity-50 mt-1 font-mono truncate" title={doc.ficheiro}>
                                          {doc.ficheiro}
                                        </p>
                                      )}
                                    </div>
                                    {doc.linkOnline && (
                                      <a
                                        href={doc.linkOnline}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="shrink-0 p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                        title="Abrir online"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                      </a>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Notas do ficheiro */}
                        {m.notas && (
                          <div className="bg-muted/50 rounded-lg p-3 text-sm">
                            <div className="font-medium text-xs text-muted-foreground uppercase tracking-wider mb-1">
                              Notas de referência
                            </div>
                            <p>{m.notas}</p>
                          </div>
                        )}

                        {/* Notas do atelier (editáveis) */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                              <StickyNote className="w-3.5 h-3.5" />
                              Notas do atelier
                            </div>
                            {editandoNota !== m.id && (
                              <button
                                onClick={() => {
                                  setEditandoNota(m.id);
                                  setTextoNota(notaLocal);
                                }}
                                className="text-xs text-primary hover:underline"
                              >
                                {notaLocal ? 'Editar' : 'Adicionar nota'}
                              </button>
                            )}
                          </div>

                          {editandoNota === m.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={textoNota}
                                onChange={(e) => setTextoNota(e.target.value)}
                                placeholder="Escrever notas internas sobre este município..."
                                rows={3}
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                                autoFocus
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => guardarNota(m.id)}
                                  className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
                                >
                                  Guardar
                                </button>
                                <button
                                  onClick={() => setEditandoNota(null)}
                                  className="px-3 py-1.5 bg-muted rounded-lg text-xs font-medium hover:bg-muted/80 transition-colors"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          ) : notaLocal ? (
                            <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-3 text-sm">
                              {notaLocal}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">Sem notas do atelier.</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {municipiosFiltrados.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <MapPin className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium mb-1">Nenhum município encontrado</p>
          <p className="text-sm">Tenta ajustar os filtros ou a pesquisa.</p>
        </div>
      )}

      {/* Footer links */}
      <div className="border-t border-border pt-6 flex flex-wrap gap-3 justify-center text-sm">
        <button
          onClick={() => navigate('/legislacao')}
          className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Biblioteca de Legislação
        </button>
        <button
          onClick={() => navigate('/consulta-legislacao')}
          className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
        >
          <FileText className="w-4 h-4" />
          Consulta por Tipologia
        </button>
        <button
          onClick={() => navigate('/checklist')}
          className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
        >
          <Bookmark className="w-4 h-4" />
          Checklist de Conformidade
        </button>
      </div>
    </div>
  );
}
