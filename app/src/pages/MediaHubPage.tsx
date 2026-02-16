import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Upload, Search, Image, Video, Filter, LayoutGrid, LayoutList,
  Sparkles, Package, Eye, Trash2, CheckSquare, Square, Zap, Loader2, Shield, FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import { useMedia } from '@/context/MediaContext';
import { useData } from '@/context/DataContext';
import { analyzeAsset } from '@/services/analysis';
import {
  hasApiKey,
  analyzeWithAI,
  aiResultToContentPack,
  assessImageQuality,
  generateArticulation,
  suggestFeedMix,
  feedMixToPosts,
  enrichPostsWithPackCopy,
} from '@/services/ai';
import MediaUploadDialog from '@/components/media/MediaUploadDialog';
import AISettingsDialog from '@/components/media/AISettingsDialog';
import { AssetThumbnail } from '@/components/media/AssetThumbnail';
import { useVideoThumbnail } from '@/hooks/useVideoThumbnail';
import type { MediaAsset, MediaStatus } from '@/types';

const STATUS_CONFIG: Record<MediaStatus, { label: string; color: string; bg: string }> = {
  'rascunho': { label: 'Rascunho', color: 'text-zinc-400', bg: 'bg-zinc-500/15' },
  'por-classificar': { label: 'Por Classificar', color: 'text-amber-400', bg: 'bg-amber-500/15' },
  'analisado': { label: 'Analisado', color: 'text-blue-400', bg: 'bg-blue-500/15' },
  'pronto': { label: 'Pronto', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  'publicado': { label: 'Publicado', color: 'text-purple-400', bg: 'bg-purple-500/15' },
};

export default function MediaHubPage() {
  const navigate = useNavigate();
  const { assets, contentPacks, posts, slots, updateAsset, deleteAsset, addContentPack, addPost } = useMedia();
  const { projects } = useData();
  const [showUpload, setShowUpload] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<MediaStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [aiProcessing, setAiProcessing] = useState(false);
  const [qualityProcessing, setQualityProcessing] = useState(false);
  const [articulationProcessing, setArticulationProcessing] = useState(false);
  const [articulationResult, setArticulationResult] = useState<{ narrative: string; postsCreated: number } | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'quality' | 'name'>('date');
  const [qualityFilter, setQualityFilter] = useState<'all' | 'high' | 'low'>('all');

  const filtered = useMemo(() => {
    let list = assets.filter((a) => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (qualityFilter === 'high') {
        if (a.qualityScore == null || a.qualityScore < 70) return false;
      } else if (qualityFilter === 'low') {
        if (a.qualityScore != null && a.qualityScore >= 70) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const projName = projects.find((p) => p.id === a.projectId)?.name || '';
        return (
          a.name.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          projName.toLowerCase().includes(q)
        );
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sortBy === 'quality') {
        const qa = a.qualityScore ?? 0;
        const qb = b.qualityScore ?? 0;
        return qb - qa;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    });
    return list;
  }, [assets, statusFilter, searchQuery, projects, sortBy, qualityFilter]);

  const statusCounts = useMemo(() => {
    const c: Record<string, number> = { all: assets.length };
    assets.forEach((a) => { c[a.status] = (c[a.status] || 0) + 1; });
    return c;
  }, [assets]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((a) => a.id)));
  };

  const bulkDelete = () => {
    selected.forEach((id) => deleteAsset(id));
    setSelected(new Set());
  };

  const bulkAssessQuality = async () => {
    const ids = selected.size > 0 ? Array.from(selected) : filtered.map((a) => a.id);
    const toProcess = ids
      .map((id) => assets.find((a) => a.id === id))
      .filter((a): a is MediaAsset => !!a && !!(a.src || a.thumbnail));
    if (toProcess.length === 0) {
      toast.error('Nenhum asset com imagem disponível');
      return;
    }
    if (!hasApiKey()) {
      toast.error('Configura a API key nas Definições');
      return;
    }
    setQualityProcessing(true);
    let done = 0;
    let highQuality = 0;
    for (const asset of toProcess) {
      try {
        const src = asset.type === 'image' ? (asset.src || asset.thumbnail) : asset.thumbnail;
        if (!src) continue;
        toast.info(`Avaliar qualidade ${done + 1}/${toProcess.length}...`);
        const result = await assessImageQuality(src);
        updateAsset(asset.id, { qualityScore: result.qualityScore });
        done++;
        if (result.qualityScore >= 70) highQuality++;
      } catch (err) {
        toast.error(`${asset.name}: ${err instanceof Error ? err.message : 'Erro'}`);
      }
    }
    setQualityProcessing(false);
    toast.success(`Qualidade avaliada: ${done} asset(s) — ${highQuality} com score ≥ 70`);
    setSelected(new Set());
  };

  const bulkAnalyze = async () => {
    const ids = selected.size > 0 ? Array.from(selected) : filtered.filter((a) => a.status === 'por-classificar').map((a) => a.id);
    
    if (hasApiKey()) {
      // Use AI for analysis
      setAiProcessing(true);
      let done = 0;
      for (const id of ids) {
        const asset = assets.find((a) => a.id === id);
        if (asset && asset.type === 'image') {
          try {
            const projectName = asset.projectId ? projects.find((p) => p.id === asset.projectId)?.name : undefined;
            toast.info(`AI a analisar ${done + 1}/${ids.length}...`);
            const result = await analyzeWithAI(asset, projectName);
            updateAsset(id, { tags: result.tags, qualityScore: result.qualityScore, risks: result.risks, story: result.story, status: 'analisado' });
            const pack = aiResultToContentPack(id, result);
            addContentPack(pack);
            done++;
          } catch (err) {
            const msg = err instanceof Error ? err.message : 'Erro AI';
            toast.error(`${asset.name}: ${msg}`);
          }
        }
      }
      setAiProcessing(false);
      toast.success(`AI analisou ${done} asset(s) com copy gerada`);
    } else {
      // Fallback to local analysis
      ids.forEach((id) => {
        const asset = assets.find((a) => a.id === id);
        if (asset) {
          const result = analyzeAsset(asset);
          updateAsset(id, { tags: result.tags, qualityScore: result.qualityScore, risks: result.risks, story: result.story, status: 'analisado' });
        }
      });
      toast.success(`${ids.length} asset(s) analisado(s) (sem AI — configura a API key para análise completa)`);
    }
    setSelected(new Set());
  };

  const generateArticulationAndPosts = async () => {
    const ids = selected.size > 0 ? Array.from(selected) : filtered.map((a) => a.id);
    const targetAssets = ids
      .map((id) => assets.find((a) => a.id === id))
      .filter((a): a is MediaAsset => !!a);
    const withImage = targetAssets.filter((a) => (a.type === 'image' ? a.src : a.thumbnail));
    if (withImage.length === 0) {
      toast.error('Nenhum asset com imagem disponível');
      return;
    }
    if (!hasApiKey()) {
      toast.error('Configura a API key nas Definições');
      return;
    }

    setArticulationProcessing(true);
    const newPacks: { assetId: string; pack: ReturnType<typeof aiResultToContentPack> }[] = [];

    try {
      // 1. Analyze assets without content pack
      for (const asset of withImage) {
        const hasPack = contentPacks.some((p) => p.assetId === asset.id);
        if (!hasPack && asset.type === 'image') {
          const projectName = asset.projectId ? projects.find((p) => p.id === asset.projectId)?.name : undefined;
          toast.info(`AI a analisar ${asset.name}...`);
          const result = await analyzeWithAI(asset, projectName);
          updateAsset(asset.id, { tags: result.tags, qualityScore: result.qualityScore, risks: result.risks, story: result.story, status: 'analisado' });
          const pack = aiResultToContentPack(asset.id, result);
          addContentPack(pack);
          newPacks.push({ assetId: asset.id, pack });
        }
      }

      // 2. Generate articulation (narrative + order)
      const projectName = withImage[0]?.projectId ? projects.find((p) => p.id === withImage[0]!.projectId)?.name : undefined;
      const { narrative } = await generateArticulation(
        withImage.map((a) => ({ id: a.id, name: a.name, tags: a.tags, mediaType: a.mediaType, story: a.story })),
        projectName
      );

      // 3. Suggest feed mix and create posts
      const slotInputs = slots.map((s) => ({ id: s.id, label: s.label, dayOfWeek: s.dayOfWeek, channels: s.channels, pillar: s.pillar }));
      const existingPosts = posts.map((p) => ({ assetId: p.assetId, scheduledDate: p.scheduledDate, slotId: p.slotId }));
      const suggestions = await suggestFeedMix(withImage, slotInputs, existingPosts, 4);
      if (suggestions.length === 0) {
        toast.warning('Não há slots disponíveis ou todos os assets já estão agendados');
        setArticulationProcessing(false);
        setArticulationResult({ narrative, postsCreated: 0 });
        return;
      }

      const allPacks = [...contentPacks, ...newPacks.map((np) => np.pack)];
      const rawPosts = feedMixToPosts(suggestions);
      const enrichedPosts = enrichPostsWithPackCopy(rawPosts, allPacks);

      enrichedPosts.forEach((p, i) => {
        addPost({ ...p, id: `post-${Date.now()}-${i}` });
      });

      setArticulationResult({ narrative, postsCreated: enrichedPosts.length });
      toast.success(`${enrichedPosts.length} post(s) criados e enviados para o Planner`);
      setSelected(new Set());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao gerar articulação');
    } finally {
      setArticulationProcessing(false);
    }
  };

  const getProjectName = (id?: string) => {
    if (!id) return null;
    return projects.find((p) => p.id === id)?.name || null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Image className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium tracking-wide uppercase">Content Factory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Media Inbox</h1>
          <p className="text-muted-foreground mt-2">Upload, classifica e prepara conteúdo para publicação</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap shrink-0">
          <button onClick={generateArticulationAndPosts} disabled={articulationProcessing || !hasApiKey()} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50" title="Analisa, gera narrativa e cria posts no Planner">
            {articulationProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            <span className="whitespace-nowrap">{articulationProcessing ? 'A gerar...' : 'Gerar articulação e posts'}</span>
          </button>
          <button onClick={() => setShowAISettings(true)} className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors ${hasApiKey() ? 'border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10' : 'border-amber-500/50 text-amber-500 hover:bg-amber-500/10'}`}>
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">{hasApiKey() ? 'AI Ativo' : 'Configurar AI'}</span>
          </button>
          <button onClick={() => setShowUpload(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>
        </div>
      </motion.div>

      {/* Status Tabs */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex flex-wrap gap-2">
        {(['all', 'por-classificar', 'analisado', 'pronto', 'publicado', 'rascunho'] as const).map((s) => {
          const isAll = s === 'all';
          const conf = isAll ? null : STATUS_CONFIG[s];
          const count = statusCounts[s] || 0;
          const active = statusFilter === s;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                active ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/40'
              }`}
            >
              {isAll ? 'Todos' : conf!.label}
              <span className={`px-1.5 py-0.5 rounded-md text-xs ${active ? 'bg-primary/20' : 'bg-muted'}`}>{count}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Search + Actions Bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por nome, tag ou projeto..."
            className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={qualityFilter}
            onChange={(e) => setQualityFilter(e.target.value as 'all' | 'high' | 'low')}
            className="px-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">Qualidade: Todos</option>
            <option value="high">Qualidade ≥ 70</option>
            <option value="low">Sem qualidade ou &lt; 70</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'quality' | 'name')}
            className="px-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:border-primary focus:outline-none"
          >
            <option value="date">Ordenar: Mais recentes</option>
            <option value="quality">Ordenar: Melhor qualidade</option>
            <option value="name">Ordenar: Nome</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={bulkAssessQuality} disabled={qualityProcessing || !hasApiKey()} className="flex items-center gap-2 px-4 py-2.5 border border-border text-muted-foreground rounded-xl text-sm font-medium hover:bg-muted/50 transition-colors disabled:opacity-50" title="Avaliar qualidade (só score, sem copy)">
            {qualityProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            {qualityProcessing ? 'A avaliar...' : 'Avaliar qualidade'}
          </button>
          <button onClick={bulkAnalyze} disabled={aiProcessing} className="flex items-center gap-2 px-4 py-2.5 border border-primary/50 text-primary rounded-xl text-sm font-medium hover:bg-primary/10 transition-colors disabled:opacity-50">
            {aiProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : hasApiKey() ? <Sparkles className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
            {aiProcessing ? 'AI a processar...' : hasApiKey() ? `AI Analisar ${selected.size > 0 ? `(${selected.size})` : 'Todos'}` : `Analisar ${selected.size > 0 ? `(${selected.size})` : 'Todos'}`}
          </button>
          <button onClick={generateArticulationAndPosts} disabled={articulationProcessing || !hasApiKey()} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50" title="Analisa, gera narrativa e cria posts no Planner">
            {articulationProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            <span className="whitespace-nowrap">{articulationProcessing ? 'A gerar...' : 'Gerar articulação e posts'}</span>
          </button>
          {selected.size > 0 && (
            <button onClick={bulkDelete} className="flex items-center gap-2 px-4 py-2.5 border border-destructive/50 text-destructive rounded-xl text-sm font-medium hover:bg-destructive/10 transition-colors">
              <Trash2 className="w-4 h-4" />
              Eliminar ({selected.size})
            </button>
          )}
          <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="p-2.5 border border-border rounded-xl hover:bg-muted transition-colors">
            {viewMode === 'grid' ? <LayoutList className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>

      {/* Content */}
      {filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card border border-border rounded-2xl">
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Image className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{assets.length === 0 ? 'Nenhum media carregado' : 'Nenhum resultado'}</h2>
            <p className="text-muted-foreground text-center max-w-md mb-8">
              {assets.length === 0
                ? 'Faz upload de imagens e vídeos de obra, renders ou detalhes para começar a produzir conteúdo.'
                : 'Nenhum asset corresponde aos filtros selecionados.'}
            </p>
            {assets.length === 0 && (
              <button onClick={() => setShowUpload(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
                <Upload className="w-5 h-5" />
                <span>Primeiro Upload</span>
              </button>
            )}
          </div>
        </motion.div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((asset, idx) => (
            <AssetGridCard key={asset.id} asset={asset} index={idx} selected={selected.has(asset.id)} onSelect={() => toggleSelect(asset.id)} projectName={getProjectName(asset.projectId)} onClick={() => navigate(`/media/${asset.id}`)} updateAsset={updateAsset} onDelete={deleteAsset} />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-3">
            <button onClick={selectAll} className="p-1"><CheckSquare className="w-4 h-4 text-muted-foreground" /></button>
            <span className="text-sm text-muted-foreground">{filtered.length} assets</span>
          </div>
          <div className="divide-y divide-border">
            {filtered.map((asset) => (
              <AssetListRow key={asset.id} asset={asset} selected={selected.has(asset.id)} onSelect={() => toggleSelect(asset.id)} projectName={getProjectName(asset.projectId)} onClick={() => navigate(`/media/${asset.id}`)} updateAsset={updateAsset} onDelete={deleteAsset} />
            ))}
          </div>
        </div>
      )}

      {/* Dialogs */}
      <MediaUploadDialog open={showUpload} onClose={() => setShowUpload(false)} />
      <AISettingsDialog open={showAISettings} onClose={() => setShowAISettings(false)} />
      {articulationResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setArticulationResult(null)}>
          <div className="bg-card border border-border rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold">Articulação gerada</h3>
            {articulationResult.narrative && (
              <p className="text-muted-foreground text-sm leading-relaxed">{articulationResult.narrative}</p>
            )}
            <p className="text-sm">{articulationResult.postsCreated} post(s) criados e enviados para o Planner.</p>
            <div className="flex gap-2">
              <button onClick={() => { setArticulationResult(null); navigate('/planner'); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90">
                Ir para Planner
              </button>
              <button onClick={() => setArticulationResult(null)} className="px-4 py-2 border border-border rounded-xl text-sm font-medium hover:bg-muted">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Grid Card ── */
function AssetGridCard({ asset, index, selected, onSelect, projectName, onClick, updateAsset, onDelete }: {
  asset: MediaAsset; index: number; selected: boolean; onSelect: () => void; projectName: string | null; onClick: () => void; updateAsset: (id: string, patch: Partial<MediaAsset>) => void; onDelete: (id: string) => void;
}) {
  useVideoThumbnail(asset, updateAsset);
  const conf = STATUS_CONFIG[asset.status];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`group relative bg-card border rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-lg ${selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}
    >
      {/* Select checkbox */}
      <button onClick={(e) => { e.stopPropagation(); onSelect(); }} className="absolute top-3 left-3 z-10 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all bg-black/30 backdrop-blur-sm border-white/40 hover:border-primary">
        {selected && <div className="w-3 h-3 rounded-sm bg-primary" />}
      </button>
      {/* Eliminar — sempre visível */}
      <button
        onClick={(e) => { e.stopPropagation(); if (window.confirm('Eliminar este asset?')) onDelete(asset.id); }}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-black/50 hover:bg-destructive/80 text-white/80 hover:text-white transition-colors"
        title="Eliminar"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Image — vídeo: só thumbnail (src data:video/* não funciona em img) */}
      <div onClick={onClick} className="aspect-[4/3] relative overflow-hidden bg-muted">
        <AssetThumbnail
          asset={asset}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          fallbackClassName="w-10 h-10 text-muted-foreground/40"
        />
        {asset.type === 'video' && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/60 text-white text-xs font-medium flex items-center gap-1">
            <Video className="w-3 h-3" /> Vídeo
          </div>
        )}
        {/* Status badge */}
        <div className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-xs font-medium ${conf.bg} ${conf.color}`}>
          {conf.label}
        </div>
        {asset.qualityScore != null && (
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/60 text-white text-xs font-semibold">
            {asset.qualityScore}
          </div>
        )}
      </div>

      {/* Info */}
      <div onClick={onClick} className="p-3">
        <p className="font-medium text-sm truncate">{asset.name}</p>
        {projectName && <p className="text-xs text-muted-foreground truncate mt-0.5">{projectName}</p>}
        {asset.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {asset.tags.slice(0, 3).map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium text-muted-foreground">{t}</span>
            ))}
            {asset.tags.length > 3 && <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium text-muted-foreground">+{asset.tags.length - 3}</span>}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ── List Row ── */
function AssetListRow({ asset, selected, onSelect, projectName, onClick, updateAsset, onDelete }: {
  asset: MediaAsset; selected: boolean; onSelect: () => void; projectName: string | null; onClick: () => void; updateAsset: (id: string, patch: Partial<MediaAsset>) => void; onDelete: (id: string) => void;
}) {
  useVideoThumbnail(asset, updateAsset);
  const conf = STATUS_CONFIG[asset.status];
  return (
    <div className={`flex items-center gap-4 px-4 py-3 hover:bg-muted/30 transition-colors ${selected ? 'bg-primary/5' : ''}`}>
      <button onClick={onSelect} className="shrink-0">
        {selected ? <CheckSquare className="w-5 h-5 text-primary" /> : <Square className="w-5 h-5 text-muted-foreground" />}
      </button>
      <div onClick={onClick} className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0 cursor-pointer">
        <AssetThumbnail asset={asset} className="w-full h-full object-cover" fallbackClassName="w-5 h-5 text-muted-foreground/40" />
      </div>
      <div onClick={onClick} className="flex-1 min-w-0 cursor-pointer">
        <p className="font-medium text-sm truncate">{asset.name}</p>
        <p className="text-xs text-muted-foreground truncate">{projectName || asset.mediaType} · {asset.fileSize || '—'}</p>
      </div>
      {asset.qualityScore != null && (
        <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-semibold shrink-0">{asset.qualityScore}</span>
      )}
      <div className="flex items-center gap-2 shrink-0">
        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${conf.bg} ${conf.color}`}>{conf.label}</span>
        <button onClick={onClick} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Ver detalhe">
          <Eye className="w-4 h-4 text-muted-foreground" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); if (window.confirm('Eliminar este asset?')) onDelete(asset.id); }} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive" title="Eliminar">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
