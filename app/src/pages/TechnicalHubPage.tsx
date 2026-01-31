import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, BookOpen, FileText, Calculator, Ruler, Building2, ExternalLink } from 'lucide-react';

const tools = [
  {
    id: 'regulations',
    title: 'Regulamentos',
    description: 'Acesso a regulamentos de construção e normas técnicas',
    icon: BookOpen,
    items: ['REH', 'RSIEI', 'RSECE', 'RCCTE', 'RGEU'],
  },
  {
    id: 'calculators',
    title: 'Calculadoras',
    description: 'Ferramentas de cálculo para projeto',
    icon: Calculator,
    items: ['Áreas e Volumes', 'Estruturas', 'Instalações'],
  },
  {
    id: 'templates',
    title: 'Templates',
    description: 'Modelos de documentos técnicos',
    icon: FileText,
    items: ['Memórias Descritivas', 'Especificações', 'Relatórios'],
  },
  {
    id: 'dimensions',
    title: 'Tabelas de Dimensões',
    description: 'Referências dimensionais para projeto',
    icon: Ruler,
    items: ['Antropometria', 'Mobiliário', 'Espaços'],
  },
];

const externalLinks = [
  { name: 'eBau', url: 'https://ebau.municipia.pt', description: 'Portal de licenciamento' },
  { name: 'CENSE', url: 'https://cense.pt', description: 'Certificação energética' },
  { name: 'IMI', url: 'https://imi.pt', description: 'Informação imobiliária' },
  { name: 'OA', url: 'https://oa.pt', description: 'Ordem dos Arquitetos' },
];

export default function TechnicalHubPage() {
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
            <Wrench className="w-4 h-4" />
            <span className="text-sm">Recursos Técnicos</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Hub Técnico</h1>
        </div>
      </motion.div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-xl p-5 hover:border-muted-foreground/30 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <tool.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{tool.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>
                <div className="flex flex-wrap gap-2">
                  {tool.items.map((item) => (
                    <button
                      key={item}
                      className="px-3 py-1.5 bg-muted rounded-lg text-sm hover:bg-muted/80 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* External Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-xl p-5"
      >
        <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {externalLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors group"
            >
              <div>
                <p className="font-medium group-hover:text-primary transition-colors">{link.name}</p>
                <p className="text-xs text-muted-foreground">{link.description}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          ))}
        </div>
      </motion.div>

      {/* Quick Reference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card border border-border rounded-xl p-5"
      >
        <h3 className="text-lg font-semibold mb-4">Referência Rápida</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Altura mínima pé-direito</p>
            <p className="text-lg font-semibold">2.50m</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Largura mínima corredor</p>
            <p className="text-lg font-semibold">1.00m</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Escada - altura degrau</p>
            <p className="text-lg font-semibold">17-18cm</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Escada - largura mínima</p>
            <p className="text-lg font-semibold">0.90m</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
