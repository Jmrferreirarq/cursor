import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, Download, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const cashflowData = [
  { month: 'Jan', income: 15000, expense: 12000, balance: 3000 },
  { month: 'Fev', income: 18000, expense: 14000, balance: 4000 },
  { month: 'Mar', income: 22000, expense: 16000, balance: 6000 },
  { month: 'Abr', income: 20000, expense: 15000, balance: 5000 },
  { month: 'Mai', income: 25000, expense: 18000, balance: 7000 },
  { month: 'Jun', income: 28000, expense: 20000, balance: 8000 },
];

const recentTransactions = [
  { id: '1', type: 'income', description: 'Pagamento Projeto Casa Douro', amount: 15000, date: '2024-01-15', category: 'Honorários' },
  { id: '2', type: 'expense', description: 'Software AutoCAD', amount: 1200, date: '2024-01-14', category: 'Software' },
  { id: '3', type: 'expense', description: 'Escritório - Janeiro', amount: 2500, date: '2024-01-10', category: 'Renda' },
  { id: '4', type: 'income', description: 'Pagamento Projeto Escritório', amount: 8000, date: '2024-01-08', category: 'Honorários' },
  { id: '5', type: 'expense', description: 'Material de Escritório', amount: 350, date: '2024-01-05', category: 'Material' },
];

export default function FinancialPage() {
  const [period, setPeriod] = useState('6m');

  const totalIncome = cashflowData.reduce((sum, d) => sum + d.income, 0);
  const totalExpense = cashflowData.reduce((sum, d) => sum + d.expense, 0);
  const netBalance = totalIncome - totalExpense;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
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
            <Wallet className="w-4 h-4" />
            <span className="text-sm">Gestão Financeira</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Financeiro</h1>
        </div>
        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2.5 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
          >
            <option value="1m">1 Mês</option>
            <option value="3m">3 Meses</option>
            <option value="6m">6 Meses</option>
            <option value="1y">1 Ano</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-muted border border-border rounded-lg hover:bg-muted/80 transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Receitas</span>
            <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
          </div>
          <p className="text-2xl font-bold text-success">{formatCurrency(totalIncome)}</p>
          <p className="text-xs text-muted-foreground mt-1">+12% vs período anterior</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Despesas</span>
            <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-destructive" />
            </div>
          </div>
          <p className="text-2xl font-bold text-destructive">{formatCurrency(totalExpense)}</p>
          <p className="text-xs text-muted-foreground mt-1">+5% vs período anterior</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Saldo Líquido</span>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
          </div>
          <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-success' : 'text-destructive'}`}>
            {formatCurrency(netBalance)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Margem: {((netBalance / totalIncome) * 100).toFixed(1)}%</p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="text-lg font-semibold mb-4">Cashflow</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashflowData}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `€${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Area type="monotone" dataKey="income" stroke="hsl(var(--success))" fill="url(#incomeGradient)" name="Receitas" />
                <Area type="monotone" dataKey="expense" stroke="hsl(var(--destructive))" fill="url(#expenseGradient)" name="Despesas" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-xl p-5"
        >
          <h3 className="text-lg font-semibold mb-4">Balanço Mensal</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashflowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `€${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="balance" fill="hsl(var(--primary))" name="Balanço" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <div className="p-5 border-b border-border">
          <h3 className="text-lg font-semibold">Transações Recentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-6 py-3 text-sm font-semibold text-muted-foreground">Data</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-muted-foreground">Descrição</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-muted-foreground">Categoria</th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-muted-foreground">Valor</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-3 text-sm">{new Date(transaction.date).toLocaleDateString('pt-PT')}</td>
                  <td className="px-6 py-3 text-sm">{transaction.description}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-1 bg-muted rounded text-xs">{transaction.category}</span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className={`flex items-center justify-end gap-1 ${transaction.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      <span className="font-medium">{formatCurrency(transaction.amount)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
