import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Upload, Search, Image, Video, Filter, LayoutGrid, LayoutList,
  Sparkles, Package, Eye, Trash2, CheckSquare, Square, Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { useMedia } from '@/context/MediaContext';
import { useData } from '@/context/DataContext';
import { analyzeAsset } from '@/services/analysis';
import MediaUploadDialog from '@/components/media/MediaUploadDialog';
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
  const { assets, updateAsset, deleteAsset } = useMedia();
  const { projects } = useData();
  const [showUpload, setShowUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<MediaStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
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
  }, [assets, statusFilter, searchQuery, projects]);

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

  const bulkAnalyze = () => {
    const ids = selected.size > 0 ? Array.from(selected) : filtered.filter((a) => a.status === 'por-classificar').map((a) => a.id);
    ids.forEach((id) => {
      const asset = assets.find((a) => a.id === id);
      if (asset) {
        const result = analyzeAsset(asset);
        updateAsset(id, { tags: result.tags, qualityScore: result.qualityScore, risks: result.risks, story: result.story, status: 'analisado' });
      }
    });
    toast.success(`${ids.length} asset(s) analisado(s)`);
    setSelected(new Set());
  };

  const getProjectName = (id?: string) => {
    if (!id) return null;
    return projects.find((p) => p.id === id)?.name || null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Image className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide uppercase">Content Factory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Media Inbox</h1>
          <p className="text-muted-foreground mt-2">Upload, classifica e prepara conteúdo para publicação</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors w-fit">
          <Upload className="w-4 h-4" />
          <span>Upload</span>
        </button>
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
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-3">
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
          <button onClick={bulkAnalyze} className="flex items-center gap-2 px-4 py-2.5 border border-primary/50 text-primary rounded-xl text-sm font-medium hover:bg-primary/10 transition-colors">
            <Zap className="w-4 h-4" />
            Analisar {selected.size > 0 ? `(${selected.size})` : 'Todos'}
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
            <AssetGridCard key={asset.id} asset={asset} index={idx} selected={selected.has(asset.id)} onSelect={() => toggleSelect(asset.id)} projectName={getProjectName(asset.projectId)} onClick={() => navigate(`/media/${asset.id}`)} />
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
              <AssetListRow key={asset.id} asset={asset} selected={selected.has(asset.id)} onSelect={() => toggleSelect(asset.id)} projectName={getProjectName(asset.projectId)} onClick={() => navigate(`/media/${asset.id}`)} />
            ))}
          </div>
        </div>
      )}

      {/* Upload Dialog */}
      <MediaUploadDialog open={showUpload} onClose={() => setShowUpload(false)} />
    </div>
  );
}

/* ── Grid Card ── */
function AssetGridCard({ asset, index, selected, onSelect, projectName, onClick }: {
  asset: MediaAsset; index: number; selected: boolean; onSelect: () => void; projectName: string | null; onClick: () => void;
}) {
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

      {/* Image */}
      <div onClick={onClick} className="aspect-[4/3] relative overflow-hidden bg-muted">
        {asset.thumbnail || asset.src ? (
          <img src={asset.thumbnail || asset.src} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {asset.type === 'video' ? <Video className="w-10 h-10 text-muted-foreground/40" /> : <Image className="w-10 h-10 text-muted-foreground/40" />}
          </div>
        )}
        {asset.type === 'video' && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/60 text-white text-xs font-medium flex items-center gap-1">
            <Video className="w-3 h-3" /> Vídeo
          </div>
        )}
        {/* Status badge */}
        <div className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-xs font-medium ${conf.bg} ${conf.color}`}>
          {conf.label}
        </div>
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
function AssetListRow({ asset, selected, onSelect, projectName, onClick }: {
  asset: MediaAsset; selected: boolean; onSelect: () => void; projectName: string | null; onClick: () => void;
}) {
  const conf = STATUS_CONFIG[asset.status];
  return (
    <div className={`flex items-center gap-4 px-4 py-3 hover:bg-muted/30 transition-colors ${selected ? 'bg-primary/5' : ''}`}>
      <button onClick={onSelect} className="shrink-0">
        {selected ? <CheckSquare className="w-5 h-5 text-primary" /> : <Square className="w-5 h-5 text-muted-foreground" />}
      </button>
      <div onClick={onClick} className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0 cursor-pointer">
        {asset.thumbnail || asset.src ? (
          <img src={asset.thumbnail || asset.src} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {asset.type === 'video' ? <Video className="w-5 h-5 text-muted-foreground/40" /> : <Image className="w-5 h-5 text-muted-foreground/40" />}
          </div>
        )}
      </div>
      <div onClick={onClick} className="flex-1 min-w-0 cursor-pointer">
        <p className="font-medium text-sm truncate">{asset.name}</p>
        <p className="text-xs text-muted-foreground truncate">{projectName || asset.mediaType} · {asset.fileSize || '—'}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${conf.bg} ${conf.color}`}>{conf.label}</span>
        <button onClick={onClick} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <Eye className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
