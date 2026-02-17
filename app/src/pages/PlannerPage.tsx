import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon, LayoutGrid, Plus, ChevronLeft, ChevronRight,
  GripVertical, Image, Video, Trash2, Edit3, Send, Eye, Sparkles, Loader2,
  Instagram, Linkedin, Youtube, MessageCircle, AlertTriangle, Copy, Layers,
} from 'lucide-react';
import { toast } from 'sonner';
import { useMedia } from '@/context/MediaContext';
import { checkSimilarity, checkChannelBalance } from '@/services/antiRepetition';
import { generateCalendarSuggestions, autoFillCalendar } from '@/services/autoSlots';
import { validateCalendar, generateQueueItems, calculateScore } from '@/services/contentQueue';
import { hasApiKey, suggestFeedMix, feedMixToPosts } from '@/services/ai';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { imageUrlToPngBlob } from '@/lib/clipboardImage';
import type { ContentPost, PostStatus, ContentChannel } from '@/types';

function buildFullPost(copy: string, hashtags: string[], cta: string): string {
  const parts = [copy.trim()];
  if (hashtags?.length) parts.push('\n\n' + hashtags.join(' '));
  if (cta?.trim()) parts.push('\n\n' + cta.trim());
  return parts.join('');
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const KANBAN_COLS: { status: PostStatus; label: string; color: string }[] = [
  { status: 'inbox', label: 'Inbox', color: 'border-zinc-500/40' },
  { status: 'generated', label: 'Gerado', color: 'border-blue-500/40' },
  { status: 'review', label: 'Em Revisão', color: 'border-amber-500/40' },
  { status: 'approved', label: 'Aprovado', color: 'border-emerald-500/40' },
  { status: 'scheduled', label: 'Agendado', color: 'border-purple-500/40' },
  { status: 'published', label: 'Publicado', color: 'border-primary/40' },
];

const CHANNEL_ICONS: Partial<Record<ContentChannel, typeof Instagram>> = {
  'ig-feed': Instagram, 'ig-reels': Instagram, 'ig-stories': Instagram, 'ig-carrossel': Instagram,
  'linkedin': Linkedin, 'youtube': Youtube, 'threads': MessageCircle,
};

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function PlannerPage() {
  const { posts, updatePost, deletePost, addPost, slots, assets, contentPacks, editorialDNA } = useMedia();
  const [view, setView] = useState<'kanban' | 'calendar'>('kanban');
  const [calMonth, setCalMonth] = useState(() => new Date());
  const [aiMixLoading, setAiMixLoading] = useState(false);
  const [generateFromAssetsLoading, setGenerateFromAssetsLoading] = useState(false);

  const conflicts = useMemo(() => validateCalendar(posts, 30), [posts]);

  const handleAutoFill = () => {
    const suggestions = generateCalendarSuggestions(slots, assets, posts, editorialDNA, 4);
    const newPosts = autoFillCalendar(suggestions);
    if (newPosts.length === 0) {
      toast('Sem assets disponíveis para preencher slots. Faz upload de mais conteúdo.');
      return;
    }
    newPosts.forEach((p) => {
      addPost({ ...p, id: `post-auto-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` });
    });
    toast.success(`${newPosts.length} posts-ideia criados automaticamente para as próximas 4 semanas`);
  };

  const handleAiMix = async () => {
    if (!hasApiKey()) {
      toast.error('Configura a API key nas Definições para usar a AI.');
      return;
    }
    setAiMixLoading(true);
    try {
      const suggestions = await suggestFeedMix(assets, slots, posts, 4);
      const newPosts = feedMixToPosts(suggestions);
      if (newPosts.length === 0) {
        toast('Sem sugestões. Faz upload de mais conteúdo ou verifica os assets disponíveis.');
        return;
      }
      newPosts.forEach((p) => {
        addPost({ ...p, id: `post-ai-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` });
      });
      toast.success(`${newPosts.length} sugestões da AI adicionadas ao Planner`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao obter sugestões da AI');
    } finally {
      setAiMixLoading(false);
    }
  };

  const handleGenerateFromAssets = () => {
    setGenerateFromAssetsLoading(true);
    const eligibleAssets = assets.filter((a) => (a.status === 'analisado' || a.status === 'pronto') && contentPacks.some((cp) => cp.assetId === a.id));
    if (eligibleAssets.length === 0) {
      toast.error('Nenhum asset com content pack. Cria packs na Media Inbox primeiro.');
      setGenerateFromAssetsLoading(false);
      return;
    }
    let generated = 0;
    eligibleAssets.forEach((asset) => {
      const pack = contentPacks.find((cp) => cp.assetId === asset.id);
      if (!pack) return;
      const result = generateQueueItems(asset, pack, asset.projectId, undefined);
      const coreId = `post-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const derivIds: string[] = [];
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
      addPost({
        ...result.post,
        id: coreId,
        derivativeIds: derivIds,
        score: calculateScore(result.post as ContentPost, asset, posts, editorialDNA),
      } as ContentPost);
      generated++;
    });
    toast.success(`${generated} asset(s) → core + derivados em Em Revisão`);
    setGenerateFromAssetsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <CalendarIcon className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide uppercase">Content Factory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Conteúdo</h1>
          <p className="text-muted-foreground mt-2">Kanban + Calendário — do inbox à publicação</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleGenerateFromAssets}
            disabled={generateFromAssetsLoading}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
          >
            {generateFromAssetsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
            Gerar a partir de Assets
          </button>
          <button onClick={handleAutoFill} className="inline-flex items-center gap-2 px-4 py-2 border border-primary/50 text-primary rounded-xl text-sm font-medium hover:bg-primary/10 transition-colors">
            <Sparkles className="w-4 h-4" />Auto-preencher
          </button>
          <button
            onClick={handleAiMix}
            disabled={aiMixLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {aiMixLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            AI sugere mix
          </button>
          <div className="flex border border-border rounded-xl overflow-hidden">
            <button onClick={() => setView('kanban')} className={`px-4 py-2 text-sm font-medium transition-colors ${view === 'kanban' ? 'bg-primary text-primary-foreground' : 'bg-muted/30 text-muted-foreground hover:bg-muted'}`}>
              <LayoutGrid className="w-4 h-4 inline mr-1.5" />Kanban
            </button>
            <button onClick={() => setView('calendar')} className={`px-4 py-2 text-sm font-medium transition-colors ${view === 'calendar' ? 'bg-primary text-primary-foreground' : 'bg-muted/30 text-muted-foreground hover:bg-muted'}`}>
              <CalendarIcon className="w-4 h-4 inline mr-1.5" />Calendário
            </button>
          </div>
        </div>
      </motion.div>

      {/* Slot Configuration Bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card border border-border rounded-xl p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Slots Semanais</p>
        <div className="flex flex-wrap gap-2">
          {slots.map((slot) => (
            <div key={slot.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
              <span className="text-xs font-semibold">{DAY_NAMES[slot.dayOfWeek]}</span>
              <span className="text-xs text-muted-foreground">{slot.label}</span>
              <div className="flex gap-0.5">
                {slot.channels.slice(0, 2).map((ch) => {
                  const Icon = CHANNEL_ICONS[ch] || Image;
                  return <Icon key={ch} className="w-3 h-3 text-muted-foreground" />;
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Conflicts alert */}
      {conflicts.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <p className="font-medium text-sm">{conflicts.length} conflito(s) no calendário</p>
          </div>
          <div className="space-y-1">
            {conflicts.slice(0, 5).map((c, i) => (
              <p key={i} className="text-xs text-muted-foreground">• {c.message}</p>
            ))}
            {conflicts.length > 5 && (
              <p className="text-xs text-muted-foreground">…e mais {conflicts.length - 5}</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Content */}
      {view === 'kanban' ? (
        <KanbanView posts={posts} assets={assets} updatePost={updatePost} deletePost={deletePost} buildFullPost={buildFullPost} />
      ) : (
        <CalendarView posts={posts} assets={assets} calMonth={calMonth} setCalMonth={setCalMonth} slots={slots} updatePost={updatePost} />
      )}
    </div>
  );
}

/* ── Kanban View ── */
function KanbanView({ posts, assets, updatePost, deletePost, buildFullPost }: {
  posts: ContentPost[]; assets: { id: string; name: string; thumbnail?: string; src?: string; type: string }[];
  updatePost: (id: string, patch: Partial<ContentPost>) => void; deletePost: (id: string) => void;
  buildFullPost: (copy: string, hashtags: string[], cta: string) => string;
}) {
  const [previewPost, setPreviewPost] = useState<ContentPost | null>(null);

  const grouped = useMemo(() => {
    const map: Record<string, ContentPost[]> = { inbox: [], generated: [], review: [], approved: [], scheduled: [], published: [] };
    posts.forEach((p) => { if (map[p.status]) map[p.status].push(p); });
    return map;
  }, [posts]);

  const movePost = (id: string, newStatus: PostStatus) => {
    const post = posts.find((p) => p.id === id);
    
    // Security rules: nothing publishes without "Approved" state
    if (newStatus === 'scheduled' || newStatus === 'published') {
      if (post && post.status !== 'approved' && post.status !== 'scheduled') {
        toast.error('Regra: só posts "Aprovados" podem ser agendados ou publicados');
        return;
      }
    }

    // Anti-repetition check before publishing
    if (newStatus === 'published' || newStatus === 'approved') {
      if (post) {
        const publishedPosts = posts.filter((p) => p.status === 'published' || p.status === 'scheduled');
        const similarity = checkSimilarity(post.copyPt || post.copyEn, publishedPosts);
        if (similarity.isTooSimilar) {
          toast.warning(similarity.suggestion || 'Conteúdo demasiado semelhante a um post existente');
        }
        const balance = checkChannelBalance(publishedPosts);
        if (!balance.balanced) {
          balance.warnings.forEach((w) => toast.warning(w));
        }
      }
    }

    if (newStatus === 'published') {
      updatePost(id, { status: newStatus, publishedDate: new Date().toISOString() });
    } else {
      updatePost(id, { status: newStatus });
    }
    toast.success(`Movido para ${KANBAN_COLS.find((c) => c.status === newStatus)?.label}`);
  };

  const previewAsset = previewPost ? assets.find((a) => a.id === previewPost.assetId) : null;

  return (
    <>
    <div className="flex gap-4 overflow-x-auto pb-4">
      {KANBAN_COLS.map((col) => (
        <div key={col.status} className={`flex-shrink-0 w-72 bg-card border-t-2 ${col.color} border border-border rounded-xl`}>
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold">{col.label}</h3>
            <span className="px-2 py-0.5 rounded-md bg-muted text-xs font-medium">{grouped[col.status].length}</span>
          </div>
          <div className="p-2 space-y-2 min-h-[200px]">
            {grouped[col.status].map((post) => {
              const asset = assets.find((a) => a.id === post.assetId);
              const ChIcon = CHANNEL_ICONS[post.channel] || Image;
              const colIdx = KANBAN_COLS.findIndex((c) => c.status === col.status);
              const nextStatus = colIdx < KANBAN_COLS.length - 1 ? KANBAN_COLS[colIdx + 1].status : null;
              return (
                <div
                  key={post.id}
                  onClick={() => setPreviewPost(post)}
                  className="bg-background border border-border rounded-xl p-3 space-y-2 group cursor-pointer hover:border-primary/30 transition-colors"
                >
                  {/* Thumbnail */}
                  {asset?.thumbnail || asset?.src ? (
                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted">
                      <img src={asset.thumbnail || asset.src} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : null}
                  {/* Channel + Format */}
                  <div className="flex items-center gap-2">
                    <ChIcon className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{post.channel}</span>
                    <span className="text-xs text-muted-foreground">· {post.format}</span>
                  </div>
                  {/* Copy preview */}
                  <p className="text-xs text-foreground line-clamp-2">{post.copyPt || post.copyEn || 'Sem copy'}</p>
                  {/* Date */}
                  {post.scheduledDate && <p className="text-[10px] text-muted-foreground">{new Date(post.scheduledDate).toLocaleDateString('pt-PT')}</p>}
                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    {nextStatus && (
                      <button onClick={() => movePost(post.id, nextStatus)} className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-medium hover:bg-primary/20">
                        <Send className="w-3 h-3" /> Avançar
                      </button>
                    )}
                    <button onClick={() => deletePost(post.id)} className="p-1 rounded-md hover:bg-destructive/10 text-destructive"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>

    <Sheet open={!!previewPost} onOpenChange={(open) => !open && setPreviewPost(null)}>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto">
        {previewPost && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Preview do post</h3>
            {previewAsset && (previewAsset.thumbnail || previewAsset.src) && (
              <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                <img src={previewAsset.thumbnail || previewAsset.src} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Copy PT</p>
              <p className="text-sm whitespace-pre-wrap">{previewPost.copyPt || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Copy EN</p>
              <p className="text-sm whitespace-pre-wrap">{previewPost.copyEn || '—'}</p>
            </div>
            {previewPost.hashtags?.length ? (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Hashtags</p>
                <p className="text-sm">{previewPost.hashtags.join(' ')}</p>
              </div>
            ) : null}
            {previewPost.cta ? (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">CTA</p>
                <p className="text-sm">{previewPost.cta}</p>
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={async () => {
                  const fullPt = buildFullPost(previewPost.copyPt || '', previewPost.hashtags || [], previewPost.cta || '');
                  const fullEn = buildFullPost(previewPost.copyEn || '', previewPost.hashtags || [], previewPost.cta || '');
                  const fullText = `——— PT ———\n${fullPt}\n\n——— EN ———\n${fullEn}`;
                  const imgSrc = previewAsset?.thumbnail || previewAsset?.src;
                  try {
                    if (imgSrc) {
                      const html = `<div style="font-family:sans-serif;max-width:600px">
                        <img src="${imgSrc}" alt="" style="max-width:100%;height:auto;border-radius:8px;display:block;margin-bottom:16px" />
                        <div style="margin-bottom:16px"><strong style="color:#666;font-size:11px">PT</strong><p style="white-space:pre-wrap;margin:4px 0 0;font-size:14px">${escapeHtml(fullPt)}</p></div>
                        <div><strong style="color:#666;font-size:11px">EN</strong><p style="white-space:pre-wrap;margin:4px 0 0;font-size:14px">${escapeHtml(fullEn)}</p></div>
                      </div>`;
                      await navigator.clipboard.write([
                        new ClipboardItem({
                          'text/plain': new Blob([fullText], { type: 'text/plain' }),
                          'text/html': new Blob([html], { type: 'text/html' }),
                        }),
                      ]);
                      toast.success('Texto PT + EN copiado — cola em Word, Notion ou na legenda do WhatsApp');
                    } else {
                      await navigator.clipboard.writeText(fullText);
                      toast.success('Post completo (PT + EN) copiado');
                    }
                  } catch {
                    await navigator.clipboard.writeText(fullText);
                    toast.success('Texto copiado');
                  }
                }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20"
              >
                <Copy className="w-4 h-4" /> Copiar post completo
              </button>
              <button
                onClick={async () => {
                  const imgSrc = previewAsset?.thumbnail || previewAsset?.src;
                  if (!imgSrc) {
                    toast.error('Sem imagem');
                    return;
                  }
                  try {
                    const imageBlob = await imageUrlToPngBlob(imgSrc);
                    if (imageBlob) {
                      await navigator.clipboard.write([new ClipboardItem({ 'image/png': imageBlob })]);
                      toast.success('Imagem copiada — cola no WhatsApp, depois cola o texto');
                    } else {
                      toast.error('Não foi possível copiar a imagem');
                    }
                  } catch {
                    toast.error('Não foi possível copiar a imagem');
                  }
                }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted"
              >
                <Image className="w-4 h-4" /> Copiar imagem
              </button>
              <button
                onClick={() => {
                  const fullPt = buildFullPost(previewPost.copyPt || '', previewPost.hashtags || [], previewPost.cta || '');
                  navigator.clipboard.writeText(fullPt);
                  toast.success('Copy PT copiado');
                }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted"
              >
                <Copy className="w-4 h-4" /> Copiar PT
              </button>
              <button
                onClick={() => {
                  const fullEn = buildFullPost(previewPost.copyEn || '', previewPost.hashtags || [], previewPost.cta || '');
                  navigator.clipboard.writeText(fullEn);
                  toast.success('Copy EN copiado');
                }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted"
              >
                <Copy className="w-4 h-4" /> Copiar EN
              </button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
    </>
  );
}

/* ── Calendar View ── */
function CalendarView({ posts, assets, calMonth, setCalMonth, slots, updatePost }: {
  posts: ContentPost[]; assets: { id: string; name: string; thumbnail?: string; src?: string }[];
  calMonth: Date; setCalMonth: (d: Date) => void;
  slots: { id: string; dayOfWeek: number; label: string; channels: ContentChannel[] }[];
  updatePost: (id: string, patch: Partial<ContentPost>) => void;
}) {
  const year = calMonth.getFullYear();
  const month = calMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const prev = () => setCalMonth(new Date(year, month - 1, 1));
  const next = () => setCalMonth(new Date(year, month + 1, 1));

  const getPostsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return posts.filter((p) => p.scheduledDate?.startsWith(dateStr) || p.publishedDate?.startsWith(dateStr));
  };

  const getSlotForDay = (day: number) => {
    const dow = new Date(year, month, day).getDay();
    return slots.find((s) => s.dayOfWeek === dow);
  };

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Month Nav */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <button onClick={prev} className="p-2 rounded-lg hover:bg-muted transition-colors"><ChevronLeft className="w-5 h-5" /></button>
        <h2 className="text-lg font-semibold">{monthNames[month]} {year}</h2>
        <button onClick={next} className="p-2 rounded-lg hover:bg-muted transition-colors"><ChevronRight className="w-5 h-5" /></button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {DAY_NAMES.map((d) => (
          <div key={d} className="px-2 py-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          if (day === null) return <div key={i} className="min-h-[100px] border-b border-r border-border bg-muted/20" />;
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const dayPosts = getPostsForDay(day);
          const slot = getSlotForDay(day);
          return (
            <div key={i} className={`min-h-[100px] border-b border-r border-border p-2 ${isToday ? 'bg-primary/5' : ''}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-medium ${isToday ? 'w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center' : 'text-muted-foreground'}`}>{day}</span>
                {slot && <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium truncate max-w-[60px]">{slot.label}</span>}
              </div>
              <div className="space-y-1">
                {dayPosts.map((p) => {
                  const ChIcon = CHANNEL_ICONS[p.channel] || Image;
                  return (
                    <div key={p.id} className="flex items-center gap-1 px-1.5 py-1 rounded-md bg-primary/10 text-[10px] font-medium text-primary truncate">
                      <ChIcon className="w-3 h-3 shrink-0" />
                      <span className="truncate">{p.copyPt?.slice(0, 20) || p.channel}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
