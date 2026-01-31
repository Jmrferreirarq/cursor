import React from 'react';
import { motion } from 'framer-motion';
import { Megaphone, TrendingUp, Users, Eye, Share2, Plus } from 'lucide-react';
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

const socialPosts = [
  { id: '1', platform: 'Instagram', type: 'Projeto', engagement: 245, date: '2024-01-10' },
  { id: '2', platform: 'LinkedIn', type: 'Artigo', engagement: 189, date: '2024-01-08' },
  { id: '3', platform: 'Facebook', type: 'Atualização', engagement: 98, date: '2024-01-05' },
];

export default function MarketingPage() {
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
