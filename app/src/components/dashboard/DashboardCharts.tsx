import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Euro, CalendarDays, Building2, Target } from 'lucide-react';

// Mock data for charts
const revenueData = [
  { month: 'Jan', receita: 18500, despesa: 12000 },
  { month: 'Fev', receita: 22000, despesa: 14000 },
  { month: 'Mar', receita: 19500, despesa: 11500 },
  { month: 'Abr', receita: 28000, despesa: 16000 },
  { month: 'Mai', receita: 32000, despesa: 18000 },
  { month: 'Jun', receita: 35000, despesa: 19000 },
];

const projectsByCategory = [
  { name: 'Residencial', value: 45, color: 'hsl(var(--chart-1))' },
  { name: 'Comercial', value: 28, color: 'hsl(var(--chart-2))' },
  { name: 'Hotelaria', value: 15, color: 'hsl(var(--chart-3))' },
  { name: 'Reabilitação', value: 12, color: 'hsl(var(--chart-4))' },
];

const hoursData = [
  { semana: 'S1', ceo: 35, jessica: 42, sofia: 38 },
  { semana: 'S2', ceo: 40, jessica: 38, sofia: 44 },
  { semana: 'S3', ceo: 32, jessica: 45, sofia: 40 },
  { semana: 'S4', ceo: 38, jessica: 40, sofia: 36 },
];

const projectProgress = [
  { name: 'Casa Douro', progresso: 85, meta: 100 },
  { name: 'Tech Hub', progresso: 60, meta: 100 },
  { name: 'Apt. Foz', progresso: 45, meta: 100 },
  { name: 'Hotel Minho', progresso: 30, meta: 100 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-xl px-4 py-3 shadow-xl">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium text-foreground">
              {typeof entry.value === 'number' && entry.name?.toLowerCase().includes('receita') || entry.name?.toLowerCase().includes('despesa')
                ? `€${entry.value.toLocaleString('pt-PT')}`
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface ChartCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
  trend?: { value: number; positive: boolean };
}

function ChartCard({ title, subtitle, icon, children, delay = 0, trend }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend.positive ? 'text-emerald-500' : 'text-red-500'}`}>
            {trend.positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{trend.positive ? '+' : ''}{trend.value}%</span>
          </div>
        )}
      </div>
      {children}
    </motion.div>
  );
}

export function RevenueChart({ delay = 0 }: { delay?: number }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), delay * 100 + 300);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <ChartCard
      title="Fluxo Financeiro"
      subtitle="Últimos 6 meses"
      icon={<Euro className="w-5 h-5" />}
      delay={delay}
      trend={{ value: 18, positive: true }}
    >
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => `€${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="receita"
              name="Receita"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorReceita)"
              isAnimationActive={animate}
              animationDuration={1500}
              animationEasing="ease-out"
            />
            <Area
              type="monotone"
              dataKey="despesa"
              name="Despesa"
              stroke="hsl(var(--chart-5))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorDespesa)"
              isAnimationActive={animate}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function ProjectCategoryChart({ delay = 0 }: { delay?: number }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), delay * 100 + 300);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <ChartCard
      title="Projetos por Categoria"
      subtitle="Distribuição atual"
      icon={<Building2 className="w-5 h-5" />}
      delay={delay}
    >
      <div className="h-[280px] flex items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={projectsByCategory}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
              isAnimationActive={animate}
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {projectsByCategory.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="w-36 space-y-2">
          {projectsByCategory.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full shrink-0" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-muted-foreground truncate">{entry.name}</span>
              <span className="text-xs font-medium ml-auto">{entry.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}

export function TeamHoursChart({ delay = 0 }: { delay?: number }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), delay * 100 + 300);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <ChartCard
      title="Horas Produtivas"
      subtitle="Por colaborador"
      icon={<CalendarDays className="w-5 h-5" />}
      delay={delay}
    >
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="semana" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => `${value}h`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: 20 }}
              iconType="circle"
              iconSize={8}
            />
            <Bar 
              dataKey="ceo" 
              name="CEO" 
              fill="hsl(var(--chart-1))" 
              radius={[4, 4, 0, 0]}
              isAnimationActive={animate}
              animationDuration={1200}
              animationEasing="ease-out"
            />
            <Bar 
              dataKey="jessica" 
              name="Jéssica" 
              fill="hsl(var(--chart-2))" 
              radius={[4, 4, 0, 0]}
              isAnimationActive={animate}
              animationDuration={1200}
              animationEasing="ease-out"
            />
            <Bar 
              dataKey="sofia" 
              name="Sofia" 
              fill="hsl(var(--chart-3))" 
              radius={[4, 4, 0, 0]}
              isAnimationActive={animate}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function ProjectProgressChart({ delay = 0 }: { delay?: number }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), delay * 100 + 300);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <ChartCard
      title="Progresso de Projetos"
      subtitle="Top 4 em andamento"
      icon={<Target className="w-5 h-5" />}
      delay={delay}
    >
      <div className="space-y-5">
        {projectProgress.map((project, index) => (
          <motion.div
            key={project.name}
            initial={{ opacity: 0, x: -20 }}
            animate={animate ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{project.name}</span>
              <span className="text-muted-foreground">{project.progresso}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={animate ? { width: `${project.progresso}%` } : {}}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, hsl(var(--chart-1)), hsl(var(--chart-2)))`,
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </ChartCard>
  );
}

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RevenueChart delay={0} />
      <ProjectCategoryChart delay={1} />
      <TeamHoursChart delay={2} />
      <ProjectProgressChart delay={3} />
    </div>
  );
}
