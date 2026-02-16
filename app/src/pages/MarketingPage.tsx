import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, TrendingUp, Users, Eye, Share2, Plus, Instagram, Linkedin, ExternalLink, Image, ListTodo, Calendar, BarChart3, Copy, Check, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const websiteData = [
  { month: 'Jan', visits: 1200, leads: 45 },
  { month: 'Fev', visits: 1500, leads: 62 },
  { month: 'Mar', visits: 1800, leads: 78 },
  { month: 'Abr', visits: 1650, leads: 71 },
  { month: 'Mai', visits: 2100, leads: 95 },
  { month: 'Jun', visits: 2400, leads: 112 },
];

const PRESENCA_DIGITAL = [
  { id: 'ig', name: 'Instagram', url: 'https://instagram.com/ferreirarquitetos', icon: Instagram, color: 'bg-pink-500/20 text-pink-400' },
  { id: 'pin', name: 'Pinterest', url: 'https://pinterest.com/ferreirarquitetos', icon: Share2, color: 'bg-red-500/20 text-red-400' },
  { id: 'li', name: 'LinkedIn', url: 'https://linkedin.com/company/ferreirarquitetos', icon: Linkedin, color: 'bg-blue-500/20 text-blue-400' },
  { id: 'be', name: 'Behance', url: 'https://behance.net/ferreirarquitetos', icon: Image, color: 'bg-cyan-500/20 text-cyan-400' },
];

const CONTENT_FACTORY_LINKS = [
  { path: '/media', label: 'Media Inbox', icon: Image },
  { path: '/planner', label: 'Conteúdo', icon: Calendar },
  { path: '/performance', label: 'Performance', icon: BarChart3 },
];

const MOCK_METAS = [
  { id: '1', label: 'Publicar 4 posts no Instagram', done: false },
  { id: '2', label: '1 carrossel educativo no LinkedIn', done: false },
  { id: '3', label: 'Atualizar Pinterest com 3 projetos', done: false },
  { id: '4', label: 'Responder a todos os comentários', done: false },
];

const LINKS_PUBLICOS = [
  { label: 'Portfólio Público', url: 'https://cursor-blond-two.vercel.app/portfolio' },
  { label: 'Formulário de Cotação', url: 'https://cursor-blond-two.vercel.app/cotacao' },
];

const socialPosts = [
  { id: '1', platform: 'Instagram', type: 'Projeto', engagement: 245, date: '2024-01-10' },
  { id: '2', platform: 'LinkedIn', type: 'Artigo', engagement: 189, date: '2024-01-08' },
  { id: '3', platform: 'Facebook', type: 'Atualização', engagement: 98, date: '2024-01-05' },
];

export default function MarketingPage() {
  const navigate = useNavigate();
  const [metas, setMetas] = useState(MOCK_METAS);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const toggleMeta = (id: string) => {
    setMetas((prev) => prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m)));
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    toast.success('Link copiado!');
    setTimeout(() => setCopiedUrl(null), 2000);
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
            <Megaphone className="w-4 h-4" />
            <span className="text-sm">Marketing & Presença Digital</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Marketing</h1>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors w-fit">
          <Plus className="w-4 h-4" />
          <span>Nova Campanha</span>
        </button>
      </motion.div>

      {/* Presença Digital */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <h3 className="text-lg font-semibold mb-4">Presença Digital</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PRESENCA_DIGITAL.map((p) => (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/40 transition-colors group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${p.color}`}>
                <p.icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground truncate">Ver perfil</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0" />
            </a>
          ))}
        </div>
      </motion.div>

      {/* Content Factory — Links rápidos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg font-semibold mb-4">Content Factory</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CONTENT_FACTORY_LINKS.map((l) => (
            <button
              key={l.path}
              onClick={() => navigate(l.path)}
              className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/40 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <l.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium text-sm">{l.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Metas do Mês & Links Públicos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Metas do Mês
          </h3>
          <div className="space-y-2">
            {metas.map((m) => (
              <button
                key={m.id}
                onClick={() => toggleMeta(m.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                  m.done ? 'bg-success/10 line-through text-muted-foreground' : 'bg-muted/50 hover:bg-muted'
                }`}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${m.done ? 'bg-success border-success' : 'border-muted-foreground'}`}>
                  {m.done && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm">{m.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="text-lg font-semibold mb-4">Links Públicos</h3>
          <p className="text-sm text-muted-foreground mb-4">Clica para copiar o link</p>
          <div className="space-y-2">
            {LINKS_PUBLICOS.map((l) => (
              <button
                key={l.url}
                onClick={() => copyLink(l.url)}
                className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left group"
              >
                <span className="text-sm font-medium">{l.label}</span>
                {copiedUrl === l.url ? (
                  <Check className="w-4 h-4 text-success shrink-0" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Visitas</span>
          </div>
          <p className="text-2xl font-bold">2.4k</p>
          <p className="text-xs text-success flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            +14% este mês
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-success" />
            </div>
            <span className="text-sm text-muted-foreground">Leads</span>
          </div>
          <p className="text-2xl font-bold">112</p>
          <p className="text-xs text-success flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            +18% este mês
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-warning" />
            </div>
            <span className="text-sm text-muted-foreground">Social</span>
          </div>
          <p className="text-2xl font-bold">532</p>
          <p className="text-xs text-muted-foreground mt-1">Engajamentos</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-info/20 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-info" />
            </div>
            <span className="text-sm text-muted-foreground">Campanhas</span>
          </div>
          <p className="text-2xl font-bold">3</p>
          <p className="text-xs text-muted-foreground mt-1">Ativas</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="text-lg font-semibold mb-4">Visitas ao Website</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={websiteData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line type="monotone" dataKey="visits" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="text-lg font-semibold mb-4">Leads Gerados</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={websiteData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="leads" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <div className="p-5 border-b border-border">
          <h3 className="text-lg font-semibold">Publicações Recentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-6 py-3 text-sm font-semibold text-muted-foreground">Plataforma</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-muted-foreground">Tipo</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-muted-foreground">Data</th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-muted-foreground">Engajamento</th>
              </tr>
            </thead>
            <tbody>
              {socialPosts.map((post) => (
                <tr key={post.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-3 text-sm font-medium">{post.platform}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-1 bg-muted rounded text-xs">{post.type}</span>
                  </td>
                  <td className="px-6 py-3 text-sm">{new Date(post.date).toLocaleDateString('pt-PT')}</td>
                  <td className="px-6 py-3 text-right font-medium">{post.engagement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
