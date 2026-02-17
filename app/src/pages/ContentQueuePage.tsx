import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  LayoutGrid, Table2, List, Zap, Sparkles, AlertTriangle,
  Star, Calendar, Loader2, Plus, GripVertical, Pencil, Copy, Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useMedia } from '@/context/MediaContext';
import { useData } from '@/context/DataContext';
import {
  QUEUE_COLUMNS, classifyWeight, calculateScore, autoSchedule,
  getQueueStats, getValidTransitions, validateCalendar,
  generateQueueItems,
} from '@/services/contentQueue';
import type { ContentPost, PostStatus, PostWeight, ContentChannel } from '@/types';

type ViewMode = 'kanban' | 'table' | 'list';
type StatusFilter = 'all' | 'rascunho' | 'agendado' | 'publicado' | 'arquivado';

const STATUS_FILTER_MAP: Record<StatusFilter, PostStatus[]> = {
  all: [],
  rascunho: ['inbox', 'generated', 'review', 'rejected'],
  agendado: ['scheduled'],
  publicado: ['published'],
  arquivado: ['measured'],
};

const WEIGHT_BADGE: Record<PostWeight, { label: string; class: string }> = {
  heavy: { label: 'Pesado', class: 'bg-red-500/10 text-red-500' },
  light: { label: 'Leve', class: 'bg-emerald-500/10 text-emerald-500' },
};

const CHANNEL_LABELS: Record<string, string> = {
  'ig-feed': 'IG Feed', 'ig-reels': 'IG Reels', 'ig-stories': 'IG Stories',
  'ig-carrossel': 'IG Carrossel', 'linkedin': 'LinkedIn', 'tiktok': 'TikTok',
  'pinterest': 'Pinterest', 'youtube': 'YouTube', 'threads': 'Threads',
};

export default function ContentQueuePage() {
  const navigate = useNavigate();
  const { posts, updatePost, deletePost, addPost, reorderPosts, assets, contentPacks, editorialDNA, slots } = useMedia();
  const { projects } = useData();

  const [view, setView] = useState<ViewMode>('kanban');
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');
  const [filterPillar, setFilterPillar] = useState<string>('all');
  const [filterWeight, setFilterWeight] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'date' | 'status'>('score');
  const [scheduling, setScheduling] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);

  // ── Computed ──

  const stats = useMemo(() => getQueueStats(posts), [posts]);
  const conflicts = useMemo(() => validateCalendar(posts), [posts]);

  const filteredPosts = useMemo(() => {
    let result = [...posts];
    if (filterStatus !== 'all') {
      const allowed = STATUS_FILTER_MAP[filterStatus];
      result = result.filter((p) => allowed.includes(p.status));
    }
    if (filterPillar !== 'all') result = result.filter((p) => p.pillar === filterPillar);
    if (filterWeight !== 'all') result = result.filter((p) => (p.weight || 'light') === filterWeight);
    if (sortBy === 'score') result.sort((a, b) => (b.score || 0) - (a.score || 0));
    else if (sortBy === 'date') result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  }, [posts, filterStatus, filterPillar, filterWeight, sortBy]);

  const postsByStatus = useMemo(() => {
    const map: Record<PostStatus, ContentPost[]> = {
      inbox: [], generated: [], review: [], approved: [],
      scheduled: [], published: [], measured: [], rejected: [],
    };
    filteredPosts.forEach((p) => { map[p.status]?.push(p); });
    return map;
  }, [filteredPosts]);

  // ── Actions ──

  const movePost = useCallback((postId: string, newStatus: PostStatus) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const valid = getValidTransitions(post.status);
    if (!valid.includes(newStatus)) {
      toast.error(`Não é possível mover de "${post.status}" para "${newStatus}"`);
      return;
    }

    updatePost(postId, { status: newStatus });

    // Cascade rejection to derivatives
    if (newStatus === 'rejected' && post.isCore && post.derivativeIds) {
      post.derivativeIds.forEach((did) => {
        const d = posts.find((p) => p.id === did);
        if (d && !['published', 'measured'].includes(d.status)) {
          updatePost(did, { status: 'rejected', rejectionReason: 'Core rejeitado' });
        }
      });
    }

    toast.success(`Post movido para "${QUEUE_COLUMNS.find((c) => c.id === newStatus)?.label}"`);
  }, [posts, updatePost]);

  const handleAutoSchedule = useCallback(() => {
    setScheduling(true);
    const approved = posts.filter((p) => p.status === 'approved');
    if (approved.length === 0) {
      toast.error('Nenhum post aprovado para agendar');
      setScheduling(false);
      return;
    }

    const existing = posts.filter((p) => p.status === 'scheduled');
    const updates = autoSchedule(approved, existing, 14, undefined, slots);

    updates.forEach((u) => {
      updatePost(u.postId, { scheduledDate: u.scheduledDate, status: u.status });
    });

    toast.success(`${updates.length} posts agendados para os próximos 14 dias`);
    setScheduling(false);
  }, [posts, slots, updatePost]);

  const handleBatchGenerate = useCallback(() => {
    setGenerating(true);
    const inboxAssets = assets.filter((a) => a.status === 'analisado' || a.status === 'pronto');
    if (inboxAssets.length === 0) {
      toast.error('Nenhum asset analisado para gerar conteúdo. Analisa primeiro na Media Inbox.');
      setGenerating(false);
      return;
    }

    let generated = 0;
    inboxAssets.forEach((asset) => {
      const pack = contentPacks.find((cp) => cp.assetId === asset.id);
      if (!pack) return;

      const project = projects.find((p) => p.id === asset.projectId);
      const result = generateQueueItems(asset, pack, asset.projectId, undefined);

      // Create core post
      const coreId = `post-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const derivIds: string[] = [];

      // Create derivative posts first
      result.derivativePosts.forEach((dp) => {
        const did = `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        derivIds.push(did);
        addPost({
          ...dp,
          id: did,
          parentPostId: coreId,
          score: calculateScore(dp as ContentPost, asset, posts, editorialDNA),
        } as ContentPost);
      });

      // Create core post with derivative IDs
      addPost({
        ...result.post,
        id: coreId,
        derivativeIds: derivIds,
        score: calculateScore(result.post as ContentPost, asset, posts, editorialDNA),
      } as ContentPost);

      generated++;
    });

    toast.success(`${generated} asset(s) processados → core + derivados na Queue`);
    setGenerating(false);
  }, [assets, contentPacks, projects, posts, editorialDNA, addPost]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = filteredPosts.findIndex((p) => p.id === active.id);
    const newIndex = filteredPosts.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(filteredPosts, oldIndex, newIndex);
    reorderPosts(reordered.map((p) => p.id));
    toast.success('Ordem atualizada');
  }, [filteredPosts, reorderPosts]);

  const handleDuplicate = useCallback((post: ContentPost) => {
    const newId = `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    addPost({ ...post, id: newId, status: 'generated' as PostStatus, createdAt: new Date().toISOString() });
    toast.success('Post duplicado');
  }, [addPost]);

  const handleMoveToPublished = useCallback((postId: string) => {
    updatePost(postId, { status: 'published', publishedDate: new Date().toISOString().slice(0, 10) });
    toast.success('Movido para Publicado');
  }, [updatePost]);

  // ── Render helpers ──

  const PostCard = ({ post }: { post: ContentPost }) => {
    const asset = assets.find((a) => a.id === post.assetId);
    const project = projects.find((p) => p.id === post.projectId);
    const weight = post.weight || classifyWeight(post, asset);
    const wb = WEIGHT_BADGE[weight];
    const validNext = getValidTransitions(post.status);

    const handleDelete = () => {
      if (window.confirm('Eliminar este conteúdo?')) deletePost(post.id);
    };

    return (
      <div className="bg-card border border-border rounded-xl p-3 hover:border-primary/30 transition-colors group relative">
        {/* Eliminar — sempre visível à direita */}
        <button
          onClick={handleDelete}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
          title="Eliminar"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <div className="flex items-start gap-2 mb-2 pr-8">
          {/* Thumbnail */}
          {asset?.thumbnail ? (
            <img src={asset.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              {post.isCore && <Star className="w-3 h-3 text-amber-500 shrink-0" />}
              <span className="text-xs font-medium truncate">{CHANNEL_LABELS[post.channel] || post.channel}</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${wb.class}`}>{wb.label}</span>
            </div>
            <p className="text-[10px] text-muted-foreground truncate">{post.format}</p>
          </div>
          {/* Score */}
          <div className={`text-xs font-bold shrink-0 ${
            (post.score || 0) >= 70 ? 'text-emerald-500' : (post.score || 0) >= 40 ? 'text-amber-500' : 'text-red-500'
          }`}>
            {post.score || '—'}
          </div>
        </div>

        {/* Copy preview */}
        <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2">{post.copyPt.slice(0, 100)}{post.copyPt.length > 100 ? '...' : ''}</p>

        {/* Meta row */}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-2">
          {project && <span className="truncate max-w-[80px]">{project.name}</span>}
          {post.pillar && <span className="px-1.5 py-0.5 bg-muted rounded">{editorialDNA?.pillars?.find((p) => p.id === post.pillar)?.name || post.pillar}</span>}
          {post.scheduledDate && <span>{new Date(post.scheduledDate).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' })}</span>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {validNext.map((ns) => {
            const col = QUEUE_COLUMNS.find((c) => c.id === ns);
            return (
              <button key={ns} onClick={() => movePost(post.id, ns)} className="px-2 py-1 bg-muted hover:bg-muted/80 rounded text-[10px] font-medium transition-colors" title={`Mover para ${col?.label}`}>
                → {col?.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <LayoutGrid className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide uppercase">Content Queue</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Fila de Conteúdo</h1>
          <p className="text-muted-foreground mt-1 text-sm">Queue-driven — do inbox à medição, tudo passa aqui.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setShowNewModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 border border-primary/50 text-primary rounded-xl text-sm font-medium hover:bg-primary/10 transition-colors">
            <Plus className="w-4 h-4" />
            Novo Conteúdo
          </button>
          <button onClick={handleBatchGenerate} disabled={generating} className="inline-flex items-center gap-2 px-4 py-2.5 border border-primary/50 text-primary rounded-xl text-sm font-medium hover:bg-primary/10 transition-colors disabled:opacity-50">
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Gerar a partir de Assets
          </button>
          <button onClick={handleAutoSchedule} disabled={scheduling} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
            {scheduling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            Auto-Agendar 14 dias
          </button>
        </div>
      </motion.div>

      {/* Stats bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {QUEUE_COLUMNS.map((col) => (
          <div key={col.id} className="bg-card border border-border rounded-xl px-3 py-2 text-center">
            <p className="text-lg font-bold">{stats.byStatus[col.id]}</p>
            <p className="text-[10px] text-muted-foreground truncate">{col.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Conflicts alert */}
      {conflicts.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <p className="font-medium text-sm">{conflicts.length} conflito(s) no calendário</p>
          </div>
          <div className="space-y-1">
            {conflicts.slice(0, 5).map((c, i) => (
              <p key={i} className="text-xs text-muted-foreground">• {c.message}</p>
            ))}
          </div>
        </motion.div>
      )}

      {/* View toggle + Filters */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="flex gap-2 mb-2">
            {(['all', 'rascunho', 'agendado', 'publicado', 'arquivado'] as StatusFilter[]).map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterStatus === s ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-muted/50 text-muted-foreground border border-transparent'}`}>
                {s === 'all' ? 'Todos' : s === 'rascunho' ? 'Rascunho' : s === 'agendado' ? 'Agendado' : s === 'publicado' ? 'Publicado' : 'Arquivado'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl">
            <button onClick={() => setView('kanban')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${view === 'kanban' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>
              <LayoutGrid className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" /> Kanban
            </button>
            <button onClick={() => setView('table')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${view === 'table' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>
              <Table2 className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" /> Tabela
            </button>
            <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${view === 'list' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>
              <List className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" /> Lista
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <select value={filterWeight} onChange={(e) => setFilterWeight(e.target.value)} className="bg-muted/50 border border-border rounded-lg px-2 py-1.5 text-xs">
            <option value="all">Peso: Todos</option>
            <option value="heavy">Pesado</option>
            <option value="light">Leve</option>
          </select>
          <select value={filterPillar} onChange={(e) => setFilterPillar(e.target.value)} className="bg-muted/50 border border-border rounded-lg px-2 py-1.5 text-xs">
            <option value="all">Pilar: Todos</option>
            {editorialDNA?.pillars?.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="bg-muted/50 border border-border rounded-lg px-2 py-1.5 text-xs">
            <option value="score">Ordenar: Score</option>
            <option value="date">Ordenar: Data</option>
          </select>
        </div>
      </div>

      {/* View content */}
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={filteredPosts.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {filteredPosts.map((post) => (
                    <SortableQueueItem
                      key={post.id}
                      post={post}
                      assets={assets}
                      projects={projects}
                      editorialDNA={editorialDNA}
                      CHANNEL_LABELS={CHANNEL_LABELS}
                      WEIGHT_BADGE={WEIGHT_BADGE}
                      onDuplicate={handleDuplicate}
                      onDelete={deletePost}
                      onMoveToPublished={handleMoveToPublished}
                      getValidTransitions={getValidTransitions}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            {filteredPosts.length === 0 && (
              <div className="py-16 text-center text-muted-foreground text-sm">
                Queue vazia. Carrega assets na Media Inbox e gera conteúdo.
              </div>
            )}
          </motion.div>
        ) : view === 'kanban' ? (
          <motion.div key="kanban" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-x-auto pb-4">
            <div className="flex gap-3" style={{ minWidth: `${QUEUE_COLUMNS.length * 220}px` }}>
              {QUEUE_COLUMNS.map((col) => (
                <div key={col.id} className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                    <span className="text-xs font-semibold">{col.label}</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">{postsByStatus[col.id].length}</span>
                  </div>
                  <div className="space-y-2 min-h-[200px] bg-muted/20 rounded-xl p-2">
                    {postsByStatus[col.id].map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                    {postsByStatus[col.id].length === 0 && (
                      <p className="text-[10px] text-muted-foreground text-center py-8">Vazio</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Core</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Canal</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Formato</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Pilar</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Peso</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Score</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Data</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredPosts.map((post) => {
                      const weight = post.weight || 'light';
                      const wb = WEIGHT_BADGE[weight];
                      const colInfo = QUEUE_COLUMNS.find((c) => c.id === post.status);
                      const pillar = editorialDNA?.pillars?.find((p) => p.id === post.pillar);
                      const validNext = getValidTransitions(post.status);

                      return (
                        <tr key={post.id} className="hover:bg-muted/20">
                          <td className="px-4 py-3">{post.isCore ? <Star className="w-3.5 h-3.5 text-amber-500" /> : <span className="text-[10px] text-muted-foreground">Deriv.</span>}</td>
                          <td className="px-4 py-3 text-xs">{CHANNEL_LABELS[post.channel]}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{post.format}</td>
                          <td className="px-4 py-3"><span className="px-1.5 py-0.5 bg-muted rounded text-[10px]">{pillar?.name || '—'}</span></td>
                          <td className="px-4 py-3"><span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${wb.class}`}>{wb.label}</span></td>
                          <td className="px-4 py-3 font-bold text-xs">{post.score || '—'}</td>
                          <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium text-white ${colInfo?.color}`}>{colInfo?.label}</span></td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{post.scheduledDate ? new Date(post.scheduledDate).toLocaleDateString('pt-PT') : '—'}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              {validNext.slice(0, 2).map((ns) => (
                                <button key={ns} onClick={() => movePost(post.id, ns)} className="px-2 py-1 bg-muted hover:bg-muted/80 rounded text-[9px] font-medium transition-colors">
                                  → {QUEUE_COLUMNS.find((c) => c.id === ns)?.label}
                                </button>
                              ))}
                              <button
                                onClick={() => { if (window.confirm('Eliminar?')) deletePost(post.id); }}
                                className="p-1.5 rounded hover:bg-destructive/10 text-destructive"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filteredPosts.length === 0 && (
                <div className="py-16 text-center text-muted-foreground text-sm">
                  Queue vazia. Carrega assets na Media Inbox e gera conteúdo.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Content Modal */}
      <AnimatePresence>
        {showNewModal && (
          <NewContentModal
            onClose={() => setShowNewModal(false)}
            onSave={(data) => {
              const newPost: ContentPost = {
                id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                channel: data.channel,
                format: data.format,
                copyPt: data.caption,
                copyEn: data.caption,
                hashtags: data.hashtags.split(',').map((h) => h.trim()).filter(Boolean),
                cta: '',
                status: 'generated',
                createdAt: new Date().toISOString(),
                pillar: data.pillar,
              };
              addPost(newPost);
              setShowNewModal(false);
              toast.success('Conteúdo criado');
            }}
            pillars={editorialDNA?.pillars ?? []}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SortableQueueItem({
  post,
  assets,
  projects,
  editorialDNA,
  CHANNEL_LABELS,
  WEIGHT_BADGE,
  onDuplicate,
  onDelete,
  onMoveToPublished,
  getValidTransitions,
}: {
  post: ContentPost;
  assets: { id: string; thumbnail?: string }[];
  projects: { id: string; name: string }[];
  editorialDNA: { pillars?: { id: string; name: string }[] } | null;
  CHANNEL_LABELS: Record<string, string>;
  WEIGHT_BADGE: Record<PostWeight, { label: string; class: string }>;
  onDuplicate: (post: ContentPost) => void;
  onDelete: (id: string) => void;
  onMoveToPublished: (id: string) => void;
  getValidTransitions: (status: PostStatus) => PostStatus[];
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: post.id });
  const asset = assets.find((a) => a.id === post.assetId);
  const project = projects.find((p) => p.id === post.projectId);
  const weight = post.weight || 'light';
  const wb = WEIGHT_BADGE[weight];
  const colInfo = QUEUE_COLUMNS.find((c) => c.id === post.status);
  const pillar = editorialDNA?.pillars?.find((p) => p.id === post.pillar);
  const validNext = getValidTransitions(post.status);

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 bg-card border border-border rounded-xl ${isDragging ? 'opacity-50 shadow-lg' : ''}`}
    >
      <button {...attributes} {...listeners} className="p-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
        <GripVertical className="w-4 h-4" />
      </button>
      {asset?.thumbnail ? (
        <img src={asset.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <Calendar className="w-5 h-5 text-muted-foreground" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{post.copyPt.slice(0, 60)}{post.copyPt.length > 60 ? '...' : ''}</p>
        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
          <span>{CHANNEL_LABELS[post.channel] || post.channel}</span>
          <span>·</span>
          <span>{post.format}</span>
          {project && <span>· {project.name}</span>}
        </div>
      </div>
      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${colInfo?.color || 'bg-muted'} text-white`}>
        {colInfo?.label || post.status}
      </span>
      {post.scheduledDate && (
        <span className="text-xs text-muted-foreground">{new Date(post.scheduledDate).toLocaleDateString('pt-PT')}</span>
      )}
      {pillar && <span className="px-2 py-0.5 bg-muted rounded text-[10px]">{pillar.name}</span>}
      <div className="flex items-center gap-1">
        {validNext.includes('published') && (
          <button onClick={() => onMoveToPublished(post.id)} className="p-2 rounded-lg hover:bg-muted" title="Mover para Publicado">
            <Star className="w-4 h-4" />
          </button>
        )}
        <button onClick={() => onDuplicate(post)} className="p-2 rounded-lg hover:bg-muted" title="Duplicar">
          <Copy className="w-4 h-4" />
        </button>
        <button onClick={() => { if (window.confirm('Eliminar?')) onDelete(post.id); }} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive" title="Eliminar">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function NewContentModal({
  onClose,
  onSave,
  pillars,
}: {
  onClose: () => void;
  onSave: (data: { channel: ContentChannel; format: string; caption: string; hashtags: string; pillar: string }) => void;
  pillars: { id: string; name: string }[];
}) {
  const [channel, setChannel] = useState<ContentChannel>('ig-feed');
  const [format, setFormat] = useState('Post');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [pillar, setPillar] = useState(pillars[0]?.id ?? '');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-lg font-semibold mb-4">Novo Conteúdo</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Plataforma</label>
            <select value={channel} onChange={(e) => setChannel(e.target.value as ContentChannel)} className="w-full px-4 py-2 rounded-xl border border-border bg-background">
              <option value="ig-feed">Instagram Feed</option>
              <option value="ig-reels">Instagram Reels</option>
              <option value="ig-stories">Instagram Stories</option>
              <option value="ig-carrossel">Instagram Carrossel</option>
              <option value="linkedin">LinkedIn</option>
              <option value="tiktok">TikTok</option>
              <option value="pinterest">Pinterest</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tipo</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-border bg-background">
              <option value="Post">Post</option>
              <option value="Reel">Reel</option>
              <option value="Carrossel">Carrossel</option>
              <option value="Story">Story</option>
              <option value="Pin">Pin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Caption / Texto</label>
            <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={4} placeholder="Texto do post..." className="w-full px-4 py-2 rounded-xl border border-border bg-background resize-none" />
            <p className="text-xs text-muted-foreground mt-1">{caption.length} caracteres</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Hashtags (separadas por vírgula)</label>
            <input type="text" value={hashtags} onChange={(e) => setHashtags(e.target.value)} placeholder="#arquitetura #aveiro" className="w-full px-4 py-2 rounded-xl border border-border bg-background" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Pilar editorial</label>
            <select value={pillar} onChange={(e) => setPillar(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-border bg-background">
              {pillars.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 border border-border rounded-xl font-medium hover:bg-muted">
            Cancelar
          </button>
          <button onClick={() => onSave({ channel, format, caption, hashtags, pillar })} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90">
            Criar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
