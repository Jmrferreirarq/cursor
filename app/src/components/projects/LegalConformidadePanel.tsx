import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, AlertTriangle, ChevronDown, ChevronRight,
  ExternalLink, CheckCircle2, Circle, Sparkles, BookOpen,
  Ruler, ClipboardList, Clock, MapPin,
} from 'lucide-react';
import { TIPOLOGIAS, TIPOLOGIA_DIPLOMAS } from '@/data/tipologias';
import { legislacao } from '@/data/legislacao';
import { REQUISITOS_POR_DIPLOMA, FASES_PROJECTO } from '@/data/requisitosConformidade';
import { getExcecoesMunicipioTipologia, CATEGORIA_EXCECAO_CONFIG } from '@/data/excecoesMunicipais';
import type { FaseProjeto } from '@/data/requisitosConformidade';

// ─── Mapeamento projectType (calculadora) → tipologia id ─────────────────────
const PROJECT_TYPE_TO_TIPOLOGIA: Record<string, string> = {
  habitacao_unifamiliar: 'moradia_isolada',
  habitacao_moradia: 'moradia_isolada',
  moradia_geminada: 'moradia_geminada',
  moradia_banda: 'moradia_banda',
  habitacao_multifamiliar: 'multifamiliar',
  habitacao_coletiva: 'multifamiliar',
  habitacao_apartamento: 'multifamiliar',
  comercio_servicos: 'comercio_servicos',
  comercio: 'comercio_servicos',
  escritorio: 'comercio_servicos',
  restaurante: 'comercio_servicos',
  clinica: 'comercio_servicos',
  hotel: 'turismo',
  praia_apm: 'turismo',
  praia_aps: 'turismo',
  praia_apc: 'turismo',
  armazem_comercial: 'industrial',
  industrial: 'industrial',
  industria: 'industrial',
  logistica: 'industrial',
  laboratorio: 'industrial',
  equipamentos: 'equipamento',
  reabilitacao: 'reabilitacao',
  reabilitacao_integral: 'reabilitacao',
  restauro: 'reabilitacao',
  interiores: 'reabilitacao',
  anexo: 'reabilitacao',
  urbanismo: 'loteamento',
  loteamento_urbano: 'loteamento',
  loteamento_industrial: 'loteamento',
  destaque_parcela: 'loteamento',
  reparcelamento: 'loteamento',
  paisagismo: 'moradia_isolada',
  agricola: 'moradia_isolada',
};

// ─── Mapeamento fase do projeto (texto) → FaseProjeto id ─────────────────────
const PHASE_TO_FASE: Record<string, FaseProjeto> = {
  'Estudo Prévio': 'estudo_previo',
  'Ante-Projecto': 'ante_projecto',
  'Licenciamento': 'licenciamento',
  'Projecto de Execução': 'execucao',
  'Obra': 'obra',
  'Concluído': 'obra',
};

const RELEVANCIA_CONFIG = {
  obrigatorio: { label: 'Obrigatório', color: 'text-red-400 bg-red-500/15 border-red-500/20', dot: 'bg-red-400' },
  frequente: { label: 'Frequente', color: 'text-amber-400 bg-amber-500/15 border-amber-500/20', dot: 'bg-amber-400' },
  condicional: { label: 'Condicional', color: 'text-blue-400 bg-blue-500/15 border-blue-500/20', dot: 'bg-blue-400' },
};

const NOVIDADE_CONFIG = {
  novo_2024: { label: 'Novo 2024', color: 'bg-emerald-500/20 text-emerald-400' },
  alterado_2024: { label: 'Alterado 2024', color: 'bg-amber-500/20 text-amber-400' },
  novo_2025: { label: 'Novo 2025', color: 'bg-violet-500/20 text-violet-400' },
};

interface Props {
  projectType?: string;
  phase?: string;
  municipality?: string;
}

export default function LegalConformidadePanel({ projectType, phase, municipality }: Props) {
  const navigate = useNavigate();
  const [expandedDiploma, setExpandedDiploma] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const tipologiaId = projectType ? PROJECT_TYPE_TO_TIPOLOGIA[projectType] : null;
  const tipologia = tipologiaId ? TIPOLOGIAS.find((t) => t.id === tipologiaId) : null;
  const diplomas = tipologiaId ? (TIPOLOGIA_DIPLOMAS[tipologiaId] ?? []) : [];
  const faseId: FaseProjeto = phase ? (PHASE_TO_FASE[phase] ?? 'estudo_previo') : 'estudo_previo';
  const faseInfo = FASES_PROJECTO.find((f) => f.id === faseId);

  // Diplomas obrigatórios para esta fase (filtra os que têm requisitos na fase atual)
  const diplomasComRequisitos = useMemo(() => {
    return diplomas.map((d) => {
      const diploma = legislacao.find((l) => l.id === d.diplomaId);
      const requisitos = (REQUISITOS_POR_DIPLOMA[d.diplomaId] ?? []).filter((r) => r.fase === faseId);
      return { ...d, diploma, requisitos };
    }).filter((d) => d.diploma);
  }, [diplomas, faseId]);

  const obrigatorios = diplomasComRequisitos.filter((d) => d.relevancia === 'obrigatorio');
  const frequentes = diplomasComRequisitos.filter((d) => d.relevancia === 'frequente');
  const condicionais = diplomasComRequisitos.filter((d) => d.relevancia === 'condicional');

  const totalRequisitos = diplomasComRequisitos.reduce((s, d) => s + d.requisitos.length, 0);
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  const excecoes = useMemo(
    () => municipality && tipologiaId ? getExcecoesMunicipioTipologia(municipality, tipologiaId) : [],
    [municipality, tipologiaId],
  );
  const novidades = diplomasComRequisitos.filter((d) => d.diploma?.novidade);

  const toggleCheck = (id: string) => setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));

  if (!tipologiaId || diplomas.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 text-center">
        <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground font-medium">Tipologia não definida</p>
        <p className="text-xs text-muted-foreground mt-1">
          Associa uma tipologia a este projeto para ver a legislação aplicável.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Conformidade Legal</h3>
              <p className="text-xs text-muted-foreground">
                {tipologia?.nome} · Fase: {faseInfo?.nome || phase}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/legislacao')}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            Biblioteca completa <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-red-500/10 rounded-lg text-center">
            <p className="text-xl font-bold text-red-400">{obrigatorios.length}</p>
            <p className="text-xs text-muted-foreground">Obrigatórios</p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-lg text-center">
            <p className="text-xl font-bold text-amber-400">{frequentes.length}</p>
            <p className="text-xs text-muted-foreground">Frequentes</p>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-lg text-center">
            <p className="text-xl font-bold text-blue-400">{condicionais.length}</p>
            <p className="text-xs text-muted-foreground">Condicionais</p>
          </div>
        </div>

        {/* Novidades */}
        {novidades.length > 0 && (
          <div className="mt-4 p-3 bg-violet-500/10 border border-violet-500/20 rounded-lg flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-violet-400">Legislação recente aplicável</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {novidades.map((d) => d.diploma?.sigla).join(', ')} — verifica as alterações em vigor
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Checklist da fase atual */}
      {totalRequisitos > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-sm">Verificação — {faseInfo?.nome}</h4>
              <p className="text-xs text-muted-foreground">{checkedCount}/{totalRequisitos} requisitos verificados</p>
            </div>
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: totalRequisitos > 0 ? `${(checkedCount / totalRequisitos) * 100}%` : '0%' }}
              />
            </div>
          </div>
          <div className="divide-y divide-border">
            {diplomasComRequisitos
              .filter((d) => d.requisitos.length > 0)
              .map((d) => (
                <div key={d.diplomaId} className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${RELEVANCIA_CONFIG[d.relevancia].color}`}>
                      {d.diploma?.sigla}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">{d.diploma?.titulo}</span>
                  </div>
                  <div className="space-y-2">
                    {d.requisitos.map((req) => (
                      <button
                        key={req.id}
                        onClick={() => toggleCheck(req.id)}
                        className="w-full flex items-start gap-3 text-left group"
                      >
                        <div className={`mt-0.5 shrink-0 transition-colors ${checkedItems[req.id] ? 'text-emerald-500' : 'text-muted-foreground group-hover:text-foreground'}`}>
                          {checkedItems[req.id]
                            ? <CheckCircle2 className="w-4 h-4" />
                            : <Circle className="w-4 h-4" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-snug ${checkedItems[req.id] ? 'line-through text-muted-foreground' : ''} ${req.criticidade === 'critico' ? 'font-medium' : ''}`}>
                            {req.texto}
                          </p>
                          {req.detalhe && (
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{req.detalhe}</p>
                          )}
                        </div>
                        <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          req.criticidade === 'critico' ? 'bg-red-500/15 text-red-400' :
                          req.criticidade === 'importante' ? 'bg-amber-500/15 text-amber-400' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {req.criticidade === 'critico' ? '!' : req.criticidade === 'importante' ? 'i' : '—'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Lista de todos os diplomas */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h4 className="font-semibold text-sm">Todos os Diplomas Aplicáveis</h4>
          <p className="text-xs text-muted-foreground">{diplomas.length} diplomas para {tipologia?.nome}</p>
        </div>
        <div className="divide-y divide-border">
          {diplomasComRequisitos.map((d) => {
            const rel = RELEVANCIA_CONFIG[d.relevancia];
            const isExpanded = expandedDiploma === d.diplomaId;
            return (
              <div key={d.diplomaId}>
                <button
                  onClick={() => setExpandedDiploma(isExpanded ? null : d.diplomaId)}
                  className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${rel.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{d.diploma?.sigla}</span>
                      {d.diploma?.novidade && (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${NOVIDADE_CONFIG[d.diploma.novidade].color}`}>
                          {NOVIDADE_CONFIG[d.diploma.novidade].label}
                        </span>
                      )}
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${rel.color}`}>
                        {rel.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{d.diploma?.titulo}</p>
                  </div>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-2 bg-muted/20">
                        <p className="text-sm text-muted-foreground leading-relaxed pt-2">{d.nota}</p>
                        {d.diploma?.resumo && (
                          <p className="text-xs text-muted-foreground leading-relaxed italic">{d.diploma.resumo}</p>
                        )}
                        <div className="flex gap-2 pt-1">
                          {d.diploma?.linkDRE && (
                            <a
                              href={d.diploma.linkDRE}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs text-primary hover:bg-muted/80 transition-colors"
                            >
                              DRE <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {d.diploma?.linkPGDL && (
                            <a
                              href={d.diploma.linkPGDL}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs text-primary hover:bg-muted/80 transition-colors"
                            >
                              PGDL <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
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

      {/* Exceções municipais */}
      {municipality && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <h4 className="font-semibold text-sm">Regulamento Municipal — {municipality}</h4>
              {excecoes.length > 0 && (
                <span className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-400 font-medium">
                  {excecoes.length} nota{excecoes.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <button
              onClick={() => navigate('/municipios')}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Ver município <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          {excecoes.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              <p>Sem notas específicas registadas para <span className="font-medium">{municipality}</span>.</p>
              <p className="mt-1 text-xs">Consulta o PDM do município para verificar parâmetros específicos: cércea, afastamentos, índices de utilização e impermeabilização.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {excecoes.map((exc) => {
                const cat = CATEGORIA_EXCECAO_CONFIG[exc.categoria];
                const IconMap: Record<string, React.ElementType> = { Ruler, ClipboardList, AlertTriangle, CheckCircle2, Clock };
                const Icon = IconMap[cat.icon] ?? AlertTriangle;
                return (
                  <div key={exc.id} className="p-4 space-y-1">
                    <div className="flex items-start gap-2">
                      <Icon className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-sm font-medium">{exc.titulo}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${cat.color}`}>{cat.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{exc.descricao}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">Fonte: {exc.fonte}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
