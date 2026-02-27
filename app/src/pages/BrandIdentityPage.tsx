import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Download, Copy, Check, FileText, Image as ImageIcon, Type, Sparkles, Eye, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const brandColors = [
  { name: 'Primary', hex: '#5865f2', rgb: '88, 101, 242', usage: 'Botões principais, links, destaques', category: 'core' },
  { name: 'Success', hex: '#3ba55c', rgb: '59, 165, 92', usage: 'Confirmações, estados positivos', category: 'semantic' },
  { name: 'Warning', hex: '#f59e0b', rgb: '245, 158, 11', usage: 'Alertas, avisos importantes', category: 'semantic' },
  { name: 'Destructive', hex: '#ef4444', rgb: '239, 68, 68', usage: 'Erros, ações destrutivas', category: 'semantic' },
  { name: 'Background', hex: '#0a0a0a', rgb: '10, 10, 10', usage: 'Fundo principal da aplicação', category: 'neutral' },
  { name: 'Card', hex: '#111111', rgb: '17, 17, 17', usage: 'Cards, painéis, containers', category: 'neutral' },
  { name: 'Muted', hex: '#232323', rgb: '35, 35, 35', usage: 'Fundos secundários, inputs', category: 'neutral' },
  { name: 'Border', hex: '#2a2a2a', rgb: '42, 42, 42', usage: 'Bordas, divisores', category: 'neutral' },
];

const brandAssets = [
  { name: 'Logo Principal', format: 'SVG', size: '12 KB', type: 'logo', description: 'Versão completa com símbolo e wordmark' },
  { name: 'Logo Monocromático', format: 'SVG', size: '10 KB', type: 'logo', description: 'Versão a uma cor para fundos coloridos' },
  { name: 'Logo Branco', format: 'PNG', size: '24 KB', type: 'logo', description: 'Versão branca para fundos escuros' },
  { name: 'Símbolo', format: 'SVG', size: '6 KB', type: 'icon', description: 'Ícone standalone para favicons e apps' },
  { name: 'Favicon', format: 'ICO', size: '4 KB', type: 'icon', description: 'Ícone para browser tabs' },
  { name: 'Social Media Kit', format: 'ZIP', size: '2.4 MB', type: 'kit', description: 'Avatares e capas para redes sociais' },
];

const typography = [
  { 
    name: 'DM Sans', 
    usage: 'Texto principal, interface', 
    weights: ['400 Regular', '500 Medium', '600 Semibold', '700 Bold'],
    sample: 'Arquitetura de Excelência',
    link: 'https://fonts.google.com/specimen/DM+Sans'
  },
  { 
    name: 'JetBrains Mono', 
    usage: 'Código, valores numéricos, dados técnicos', 
    weights: ['400 Regular', '500 Medium'],
    sample: '€ 125.000,00',
    link: 'https://fonts.google.com/specimen/JetBrains+Mono'
  },
];

const colorCategories = [
  { id: 'core', name: 'Cores Principais' },
  { id: 'semantic', name: 'Cores Semânticas' },
  { id: 'neutral', name: 'Neutros' },
];

export default function BrandIdentityPage() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [activeColorCategory, setActiveColorCategory] = useState<string>('all');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(label);
    toast.success(`${label} copiado!`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const filteredColors = activeColorCategory === 'all' 
    ? brandColors 
    : brandColors.filter((c) => c.category === activeColorCategory);

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Palette className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide uppercase">Design System</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Brand Identity</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Guia completo da identidade visual FA-360. Cores, tipografia e assets para manter a consistência em todos os materiais.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors w-fit">
          <Download className="w-4 h-4" />
          <span>Download Brand Kit</span>
        </button>
      </motion.div>

      {/* Logotipo FERREIRARQUITETOS */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Logotipo</h2>
          <p className="text-sm text-muted-foreground mt-1">Wordmark principal FERREIRARQUITETOS</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-8 flex flex-col items-center justify-center">
          <div className="text-center">
            <p className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">FERREIRA</p>
            <p className="text-2xl sm:text-4xl font-light tracking-[0.3em] text-muted-foreground mt-1">ARQUITETOS</p>
          </div>
          <p className="text-xs text-muted-foreground mt-6">Versão principal · Usar em fundos claros e escuros com contraste adequado</p>
        </div>
      </motion.section>

      {/* Paleta FERREIRARQUITETOS */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Paleta FERREIRARQUITETOS</h2>
          <p className="text-sm text-muted-foreground mt-1">Cores da marca para materiais de comunicação</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Preto', hex: '#000000', usage: 'Texto principal, logo' },
            { name: 'Branco', hex: '#FFFFFF', usage: 'Fundos, logo em dark' },
            { name: 'Indigo', hex: '#4F46E5', usage: 'Destaques, CTAs' },
            { name: 'Off-white', hex: '#F5F5F0', usage: 'Fundos suaves' },
            { name: 'Taupe', hex: '#8B7355', usage: 'Acentos, materiais' },
            { name: 'Accent', hex: '#E74C3C', usage: 'Alertas, destaques' },
          ].map((c) => (
            <div
              key={c.name}
              onClick={() => copyToClipboard(c.hex, c.name)}
              className="cursor-pointer group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all"
            >
              <div className="aspect-[3/2]" style={{ backgroundColor: c.hex }} />
              <div className="p-3">
                <p className="font-medium text-sm">{c.name}</p>
                <code className="text-xs text-muted-foreground">{c.hex}</code>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Brand Colors */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold">Paleta de Cores</h2>
            <p className="text-sm text-muted-foreground mt-1">Clica numa cor para copiar o código HEX</p>
          </div>
          
          {/* Category filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveColorCategory('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeColorCategory === 'all' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              Todas
            </button>
            {colorCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveColorCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  activeColorCategory === cat.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredColors.map((color, index) => (
            <motion.div
              key={color.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => copyToClipboard(color.hex, color.name)}
              className="group cursor-pointer"
            >
              <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-200">
                {/* Color swatch */}
                <div
                  className="aspect-[3/2] relative flex items-center justify-center"
                  style={{ backgroundColor: color.hex }}
                >
                  <motion.div
                    initial={false}
                    animate={{ 
                      scale: copiedColor === color.name ? 1 : 0,
                      opacity: copiedColor === color.name ? 1 : 0
                    }}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                  >
                    <Check className="w-5 h-5 text-white" />
                  </motion.div>
                  
                  {/* Copy indicator on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {copiedColor !== color.name && (
                      <div className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                        <Copy className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm">{color.name}</p>
                    <code className="text-xs text-muted-foreground font-mono">{color.hex}</code>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{color.usage}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Typography */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Tipografia</h2>
          <p className="text-sm text-muted-foreground mt-1">Fontes oficiais e as suas aplicações</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {typography.map((font, index) => (
            <motion.div
              key={font.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-colors group"
            >
              {/* Sample */}
              <div className="p-8 bg-gradient-to-br from-muted/50 to-muted/20 border-b border-border">
                <p 
                  className="text-3xl sm:text-4xl font-medium text-center"
                  style={{ fontFamily: font.name }}
                >
                  {font.sample}
                </p>
              </div>

              {/* Details */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{font.name}</h3>
                    <p className="text-sm text-muted-foreground">{font.usage}</p>
                  </div>
                  <a
                    href={font.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Weights */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {font.weights.map((weight) => (
                    <span
                      key={weight}
                      className="px-2.5 py-1 text-xs font-medium bg-muted/50 rounded-md"
                    >
                      {weight}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Brand Assets */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Assets & Downloads</h2>
          <p className="text-sm text-muted-foreground mt-1">Logotipos, ícones e recursos visuais</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brandAssets.map((asset, index) => (
            <motion.div
              key={asset.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.03 }}
              className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              {/* Preview */}
              <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative">
                {asset.type === 'logo' && (
                  <ImageIcon className="w-12 h-12 text-muted-foreground/40 group-hover:text-primary/40 transition-colors" />
                )}
                {asset.type === 'icon' && (
                  <Sparkles className="w-10 h-10 text-muted-foreground/40 group-hover:text-primary/40 transition-colors" />
                )}
                {asset.type === 'kit' && (
                  <FileText className="w-12 h-12 text-muted-foreground/40 group-hover:text-primary/40 transition-colors" />
                )}

                {/* Download overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-black font-medium text-sm">
                    <Download className="w-4 h-4" />
                    Download
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-sm group-hover:text-primary transition-colors">{asset.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{asset.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded">
                    {asset.format}
                  </span>
                  <span className="text-xs text-muted-foreground">{asset.size}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Estilo Fotográfico & Tom */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Estilo Fotográfico & Tom</h2>
          <p className="text-sm text-muted-foreground mt-1">Diretrizes visuais e de comunicação</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <h4 className="font-medium mb-2 flex items-center gap-2"><ImageIcon className="w-4 h-4 text-primary" /> Estilo Fotográfico</h4>
            <p className="text-sm text-muted-foreground">Imagens com luz natural, ângulos limpos, materiais em evidência. Evitar filtros excessivos. Preferir fotografia de arquitetura com pessoas em escala para humanizar.</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <h4 className="font-medium mb-2 flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Tom de Comunicação</h4>
            <p className="text-sm text-muted-foreground">Profissional mas acessível. Técnico quando necessário, humano nos bastidores. Evitar jargão excessivo. Foco em clareza e confiança.</p>
          </div>
        </div>
      </motion.section>

      {/* Usage Guidelines */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Diretrizes de Uso</h2>
          <p className="text-sm text-muted-foreground mt-1">Boas práticas para manter a consistência da marca</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Espaçamento do Logo', description: 'Manter uma área de proteção mínima de 20% do tamanho do logo à sua volta.' },
            { title: 'Proporções', description: 'Nunca distorcer ou esticar o logo. Manter sempre as proporções originais.' },
            { title: 'Cores de Fundo', description: 'Usar logo branco em fundos escuros e logo colorido em fundos claros.' },
            { title: 'Tamanho Mínimo', description: 'O logo não deve ser usado com menos de 24px de altura para manter legibilidade.' },
          ].map((guideline, index) => (
            <motion.div
              key={guideline.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-medium mb-1">{guideline.title}</h4>
                <p className="text-sm text-muted-foreground">{guideline.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
