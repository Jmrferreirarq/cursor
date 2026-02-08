import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, ChevronLeft, ChevronRight, Star, AlertTriangle,
  ArrowRight, Zap, Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useMedia } from '@/context/MediaContext';
import { useData } from '@/context/DataContext';
import { validateCalendar, autoSchedule } from '@/services/contentQueue';
import type { ContentPost } from '@/types';

type ViewMode = 'week' | 'month';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const CHANNEL_SHORT: Record<string, string> = {
  'ig-feed': 'IG', 'ig-reels': 'Reels', 'ig-stories': 'Stories',
  'ig-carrossel': 'Carrossel', 'linkedin': 'LI', 'tiktok': 'TT',
  'pinterest': 'Pin', 'youtube': 'YT', 'threads': 'Thrd',
};

export default function ContentCalendarPage() {
  const navigate = useNavigate();
  const { posts, updatePost, assets, editorialDNA, slots } = useMedia();
  const { projects } = useData();

  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduling, setScheduling] = useState(false);

  // ── Date helpers ──

  const getWeekDates = (date: Date): Date[] => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1); // Monday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const getMonthDates = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startDay = first.getDay() === 0 ? 6 : first.getDay() - 1; // Monday start
    const dates: Date[] = [];
    for (let i = -startDay; i <= last.getDate() + (6 - (last.getDay() === 0 ? 6 : last.getDay() - 1)); i++) {
      const d = new Date(year, month, i + 1);
      dates.push(d);
    }
    return dates;
  };

  const navigateDate = (dir: -1 | 1) => {
    const d = new Date(currentDate);
    if (viewMode === 'week') d.setDate(d.getDate() + dir * 7);
    else d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  };

  // ── Data ──

  const scheduledPosts = useMemo(() =>
    posts.filter((p) => ['scheduled', 'published', 'measured'].includes(p.status) && p.scheduledDate),
  [posts]);

  const conflicts = useMemo(() => validateCalendar(posts, 30), [posts]);

  const getPostsForDate = (date: Date): ContentPost[] => {
    const dateStr = date.toISOString().slice(0, 10);
    return scheduledPosts.filter((p) => p.scheduledDate?.slice(0, 10) === dateStr);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toISOString().slice(0, 10) === today.toISOString().slice(0, 10);
  };

  const isCurrentMonth = (date: Date) => date.getMonth() === currentDate.getMonth();

  // ── Actions ──

  const handleAutoSchedule = () => {
    setScheduling(true);
    const approved = posts.filter((p) => p.status === 'approved');
    if (approved.length === 0) {
      toast.error('Nenhum post aprovado. Aprova posts na Queue primeiro.');
      setScheduling(false);
      return;
    }
    const existing = posts.filter((p) => p.status === 'scheduled');
    const updates = autoSchedule(approved, existing, 14, undefined, slots);
    updates.forEach((u) => updatePost(u.postId, { scheduledDate: u.scheduledDate, status: u.status }));
    toast.success(`${updates.length} posts agendados`);
    setScheduling(false);
  };

  const movePostToDate = (postId: string, newDate: string) => {
    updatePost(postId, { scheduledDate: newDate });
    toast.success('Post reagendado');
  };

  // ── Period label ──

  const periodLabel = viewMode === 'week'
    ? (() => {
        const week = getWeekDates(currentDate);
        return `${week[0].toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })} — ${week[6].toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' })}`;
      })()
    : currentDate.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });

  // ── Slot info ──

  const getSlotForDay = (dayOfWeek: number) => slots.find((s) => s.dayOfWeek === dayOfWeek);

  // ── Render: Post chip ──

  const PostChip = ({ post, compact = false }: { post: ContentPost; compact?: boolean }) => {
    const asset = assets.find((a) => a.id === post.assetId);
    const project = projects.find((p) => p.id === post.projectId);
    const weight = post.weight || 'light';
    const pillar = editorialDNA?.pillars?.find((p) => p.id === post.pillar);

    return (
      <div
        className={`group relative rounded-lg border transition-all cursor-pointer hover:shadow-md ${
          post.isCore
            ? 'bg-primary/5 border-primary/30 hover:border-primary'
            : 'bg-muted/30 border-border hover:border-muted-foreground/30'
        } ${compact ? 'px-2 py-1' : 'px-3 py-2'}`}
        onClick={() => navigate('/queue')}
      >
        <div className="flex items-center gap-1.5">
          {post.isCore && <Star className="w-3 h-3 text-amber-500 shrink-0" />}
          {asset?.thumbnail && !compact && (
            <img src={asset.thumbnail} alt="" className="w-6 h-6 rounded object-cover shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-medium truncate">{CHANNEL_SHORT[post.channel] || post.channel}</span>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${weight === 'heavy' ? 'bg-red-500' : 'bg-emerald-500'}`} />
            </div>
            {!compact && (
              <p className="text-[9px] text-muted-foreground truncate">{post.copyPt.slice(0, 50)}</p>
            )}
          </div>
          {!compact && post.score && (
            <span className={`text-[10px] font-bold shrink-0 ${
              post.score >= 70 ? 'text-emerald-500' : post.score >= 40 ? 'text-amber-500' : 'text-red-500'
            }`}>{post.score}</span>
          )}
        </div>
        {!compact && pillar && (
          <span className="text-[8px] text-muted-foreground">{pillar.name}</span>
        )}
      </div>
    );
  };

  // ── Render: Day cell ──

  const DayCell = ({ date, isWeekView }: { date: Date; isWeekView: boolean }) => {
    const dayPosts = getPostsForDate(date);
    const cores = dayPosts.filter((p) => p.isCore !== false);
    const derivs = dayPosts.filter((p) => p.isCore === false);
    const slot = getSlotForDay(date.getDay());
    const today = isToday(date);
    const inMonth = isCurrentMonth(date);
    const dateConflicts = conflicts.filter((c) => c.date === date.toISOString().slice(0, 10));

    return (
      <div className={`border border-border rounded-xl p-2 ${isWeekView ? 'min-h-[300px]' : 'min-h-[120px]'} ${
        today ? 'border-primary/50 bg-primary/5' : inMonth ? 'bg-card' : 'bg-muted/20 opacity-60'
      }`}>
        {/* Date header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-bold ${today ? 'text-primary' : ''}`}>{date.getDate()}</span>
            {isWeekView && <span className="text-[10px] text-muted-foreground">{WEEKDAYS[date.getDay() === 0 ? 6 : date.getDay() - 1]}</span>}
          </div>
          {dateConflicts.length > 0 && (
            <span title={dateConflicts.map((c) => c.message).join(', ')}><AlertTriangle className="w-3.5 h-3.5 text-amber-500" /></span>
          )}
        </div>

        {/* Slot info */}
        {slot && isWeekView && (
          <div className="text-[9px] text-muted-foreground mb-2 px-1.5 py-0.5 bg-muted/50 rounded">
            {slot.label} · {slot.channels.map((c) => CHANNEL_SHORT[c]).join(', ')}
          </div>
        )}

        {/* Cores */}
        <div className="space-y-1.5">
          {cores.map((p) => <PostChip key={p.id} post={p} compact={!isWeekView} />)}
        </div>

        {/* Derivatives (collapsed in month view) */}
        {derivs.length > 0 && (
          <div className={`mt-1.5 ${isWeekView ? 'space-y-1' : ''}`}>
            {isWeekView ? (
              derivs.map((p) => <PostChip key={p.id} post={p} compact />)
            ) : (
              <span className="text-[9px] text-muted-foreground">+{derivs.length} derivado(s)</span>
            )}
          </div>
        )}

        {/* Empty day indicator */}
        {dayPosts.length === 0 && inMonth && (
          <div className="flex items-center justify-center h-12 text-[10px] text-muted-foreground/50">
            —
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide uppercase">Content Calendar</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Calendário Editorial</h1>
          <p className="text-muted-foreground mt-1 text-sm">Valida ritmo, equilíbrio e conflitos — sincronizado com a Queue.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/queue')} className="inline-flex items-center gap-2 px-4 py-2.5 border border-border text-sm rounded-xl hover:bg-muted transition-colors">
            <ArrowRight className="w-4 h-4" /> Ver Queue
          </button>
          <button onClick={handleAutoSchedule} disabled={scheduling} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
            {scheduling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            Auto-Agendar
          </button>
        </div>
      </motion.div>

      {/* Conflicts */}
      {conflicts.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-medium mb-1">{conflicts.length} conflito(s)</p>
            {conflicts.slice(0, 3).map((c, i) => (
              <p key={i} className="text-[10px] text-muted-foreground">• {c.message}</p>
            ))}
            {conflicts.length > 3 && <p className="text-[10px] text-muted-foreground">... e mais {conflicts.length - 3}</p>}
          </div>
        </motion.div>
      )}

      {/* Navigation + View toggle */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigateDate(-1)} className="p-2 hover:bg-muted rounded-xl transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold min-w-[220px] text-center capitalize">{periodLabel}</h2>
          <button onClick={() => navigateDate(1)} className="p-2 hover:bg-muted rounded-xl transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="text-xs text-primary hover:underline">Hoje</button>
        </div>
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl">
          <button onClick={() => setViewMode('week')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${viewMode === 'week' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>
            Semana
          </button>
          <button onClick={() => setViewMode('month')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${viewMode === 'month' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>
            Mês
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500" /> Core</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Pesado</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Leve</div>
        <div className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-500" /> Conflito</div>
      </div>

      {/* Calendar Grid */}
      {viewMode === 'week' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-7 gap-2">
          {/* Day headers */}
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((d) => (
            <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
          ))}
          {getWeekDates(currentDate).map((date) => (
            <DayCell key={date.toISOString()} date={date} isWeekView />
          ))}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((d) => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {getMonthDates(currentDate).map((date) => (
              <DayCell key={date.toISOString()} date={date} isWeekView={false} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
