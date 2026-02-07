import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, TrendingDown, Eye, Heart, MessageCircle,
  Share2, Bookmark, MousePointer, Users, Award, Lightbulb,
  Plus, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { useMedia } from '@/context/MediaContext';
import type { ContentPost, PostMetrics, PerformanceEntry } from '@/types';

export default function PerformancePage() {
  const { posts, performanceEntries, addPerformanceEntry, updatePost, assets } = useMedia();
  const publishedPosts = useMemo(() => posts.filter((p) => p.status === 'published'), [posts]);

  const [selectedPostId, setSelectedPostId] = useState('');
  const [metricsForm, setMetricsForm] = useState<PostMetrics>({ views: 0, likes: 0, comments: 0, shares: 0, saves: 0, clicks: 0, reach: 0 });

  const handleRecordMetrics = () => {
    if (!selectedPostId) { toast.error('Seleciona um post'); return; }
    const entry: PerformanceEntry = {
      id: `perf-${Date.now()}`,
      postId: selectedPostId,
      recordedAt: new Date().toISOString(),
      metrics: { ...metricsForm },
    };
    addPerformanceEntry(entry);
    updatePost(selectedPostId, { metrics: { ...metricsForm } });
    toast.success('Métricas registadas');
    setSelectedPostId('');
    setMetricsForm({ views: 0, likes: 0, comments: 0, shares: 0, saves: 0, clicks: 0, reach: 0 });
  };

  // Aggregate metrics
  const totals = useMemo(() => {
    const t = { views: 0, likes: 0, comments: 0, shares: 0, saves: 0, clicks: 0, reach: 0, posts: 0 };
    publishedPosts.forEach((p) => {
      if (p.metrics) {
        t.views += p.metrics.views || 0;
        t.likes += p.metrics.likes || 0;
        t.comments += p.metrics.comments || 0;
        t.shares += p.metrics.shares || 0;
        t.saves += p.metrics.saves || 0;
        t.clicks += p.metrics.clicks || 0;
        t.reach += p.metrics.reach || 0;
        t.posts++;
      }
    });
    return t;
  }, [publishedPosts]);

  const engagementRate = totals.reach > 0 ? (((totals.likes + totals.comments + totals.shares + totals.saves) / totals.reach) * 100).toFixed(1) : '0';

  // Top performers
  const topPosts = useMemo(() => {
    return [...publishedPosts]
      .filter((p) => p.metrics)
      .sort((a, b) => {
        const scoreA = (a.metrics?.likes || 0) + (a.metrics?.comments || 0) * 3 + (a.metrics?.shares || 0) * 5 + (a.metrics?.saves || 0) * 4;
        const scoreB = (b.metrics?.likes || 0) + (b.metrics?.comments || 0) * 3 + (b.metrics?.shares || 0) * 5 + (b.metrics?.saves || 0) * 4;
        return scoreB - scoreA;
      })
      .slice(0, 5);
  }, [publishedPosts]);

  // Recommendations
  const recommendations = useMemo(() => {
    const recs: string[] = [];
    if (totals.posts === 0) {
      recs.push('Publica o teu primeiro post e regista métricas para começar a receber recomendações.');
      return recs;
    }
    if (totals.saves > totals.shares) recs.push('Os teus conteúdos são mais guardados do que partilhados — foca em formatos "educativos" que as pessoas queiram rever.');
    if (totals.comments < totals.likes * 0.02) recs.push('Rácio comentários/likes baixo — experimenta perguntas no CTA ou formatos de "opinião".');
    if (totals.clicks > 0 && totals.clicks > totals.likes * 0.1) recs.push('Boa taxa de cliques! O teu CTA está a funcionar — mantém esta abordagem.');
    const channelCounts: Record<string, number> = {};
    publishedPosts.forEach((p) => { channelCounts[p.channel] = (channelCounts[p.channel] || 0) + 1; });
    const topChannel = Object.entries(channelCounts).sort((a, b) => b[1] - a[1])[0];
    if (topChannel) recs.push(`O canal com mais posts é ${topChannel[0]} (${topChannel[1]} posts). Diversifica para não saturar.`);
    if (recs.length === 0) recs.push('Continua a publicar e registar métricas para receber insights mais detalhados.');
    return recs;
  }, [totals, publishedPosts]);

  const KPICard = ({ label, value, icon: Icon, trend }: { label: string; value: string | number; icon: typeof Eye; trend?: 'up' | 'down' | null }) => (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-5 h-5 text-muted-foreground" />
        {trend === 'up' && <ArrowUpRight className="w-4 h-4 text-emerald-500" />}
        {trend === 'down' && <ArrowDownRight className="w-4 h-4 text-red-500" />}
      </div>
      <p className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString('pt-PT') : value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <BarChart3 className="w-4 h-4" />
          <span className="text-sm font-medium tracking-wide uppercase">Content Factory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Performance</h1>
        <p className="text-muted-foreground mt-2">Métricas, insights e recomendações</p>
      </motion.div>

      {/* KPI Grid */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KPICard label="Alcance Total" value={totals.reach} icon={Users} />
        <KPICard label="Impressões" value={totals.views} icon={Eye} />
        <KPICard label="Engagement Rate" value={`${engagementRate}%`} icon={TrendingUp} />
        <KPICard label="Posts Publicados" value={totals.posts} icon={BarChart3} />
      </motion.div>

      {/* Detail KPIs */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <KPICard label="Likes" value={totals.likes} icon={Heart} />
        <KPICard label="Comentários" value={totals.comments} icon={MessageCircle} />
        <KPICard label="Partilhas" value={totals.shares} icon={Share2} />
        <KPICard label="Guardados" value={totals.saves} icon={Bookmark} />
        <KPICard label="Cliques" value={totals.clicks} icon={MousePointer} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Record Metrics */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-primary" /> Registar Métricas</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Post Publicado</label>
              <select value={selectedPostId} onChange={(e) => setSelectedPostId(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-border bg-muted/50 text-sm focus:border-primary focus:outline-none">
                <option value="">— Seleciona um post —</option>
                {publishedPosts.map((p) => (
                  <option key={p.id} value={p.id}>{p.channel} — {(p.copyPt || p.copyEn || '').slice(0, 40)}...</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {([
                { key: 'views', label: 'Impressões' },
                { key: 'reach', label: 'Alcance' },
                { key: 'likes', label: 'Likes' },
                { key: 'comments', label: 'Comentários' },
                { key: 'shares', label: 'Partilhas' },
                { key: 'saves', label: 'Guardados' },
                { key: 'clicks', label: 'Cliques' },
              ] as { key: keyof PostMetrics; label: string }[]).map((f) => (
                <div key={f.key}>
                  <label className="block text-xs text-muted-foreground mb-1">{f.label}</label>
                  <input type="number" min={0} value={metricsForm[f.key] || 0} onChange={(e) => setMetricsForm({ ...metricsForm, [f.key]: Number(e.target.value) })} className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-lg focus:border-primary focus:outline-none" />
                </div>
              ))}
            </div>
            <button onClick={handleRecordMetrics} disabled={!selectedPostId} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
              Registar
            </button>
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-500" /> Recomendações</h2>
            <div className="space-y-3">
              {recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">{i + 1}</span>
                  </div>
                  <p className="text-sm">{r}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          {topPosts.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2"><Award className="w-4 h-4 text-primary" /> Top Performers</h2>
              <div className="space-y-2">
                {topPosts.map((p, i) => {
                  const asset = assets.find((a) => a.id === p.assetId);
                  return (
                    <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                      <span className="text-sm font-bold text-primary w-5">{i + 1}</span>
                      {asset?.thumbnail && <img src={asset.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{(p.copyPt || p.copyEn || '').slice(0, 40)}</p>
                        <p className="text-xs text-muted-foreground">{p.channel} · {p.metrics?.likes || 0} likes · {p.metrics?.comments || 0} coment.</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
