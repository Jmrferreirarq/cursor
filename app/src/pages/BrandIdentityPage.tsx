import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Download, Copy, Check, FileText, Image as ImageIcon, Type } from 'lucide-react';

const brandColors = [
  { name: 'Primary', hex: '#5865f2', usage: 'Botões, links, destaques' },
  { name: 'Success', hex: '#3ba55c', usage: 'Confirmações, sucesso' },
  { name: 'Warning', hex: '#f59e0b', usage: 'Alertas, avisos' },
  { name: 'Destructive', hex: '#ef4444', usage: 'Erros, exclusões' },
  { name: 'Background', hex: '#0a0a0a', usage: 'Fundo principal' },
  { name: 'Card', hex: '#111111', usage: 'Cards, painéis' },
];

const brandAssets = [
  { name: 'Logo Principal', format: 'SVG', size: '12 KB', type: 'logo' },
  { name: 'Logo Branco', format: 'PNG', size: '24 KB', type: 'logo' },
  { name: 'Ícone App', format: 'SVG', size: '8 KB', type: 'icon' },
  { name: 'Favicon', format: 'ICO', size: '4 KB', type: 'icon' },
];

const typography = [
  { name: 'Inter', usage: 'Texto principal', weights: '400, 500, 600, 700' },
  { name: 'JetBrains Mono', usage: 'Código, números', weights: '400, 500' },
];

export default function BrandIdentityPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
            <Palette className="w-4 h-4" />
            <span className="text-sm">Identidade de Marca</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Brand Identity</h1>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors w-fit">
          <Download className="w-4 h-4" />
          <span>Download Kit</span>
        </button>
      </motion.div>

      {/* Brand Colors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl p-5"
      >
        <h3 className="text-lg font-semibold mb-4">Cores da Marca</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {brandColors.map((color) => (
            <div key={color.name} className="group">
              <div
                className="aspect-square rounded-xl mb-2 border border-border"
                style={{ backgroundColor: color.hex }}
              />
              <p className="font-medium text-sm">{color.name}</p>
              <button
                onClick={() => copyToClipboard(color.hex)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <span>{color.hex}</span>
                <Copy className="w-3 h-3" />
              </button>
              <p className="text-xs text-muted-foreground mt-1">{color.usage}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Typography */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl p-5"
      >
        <h3 className="text-lg font-semibold mb-4">Tipografia</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {typography.map((font) => (
            <div key={font.name} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Type className="w-5 h-5 text-muted-foreground" />
                <h4 className="font-medium">{font.name}</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{font.usage}</p>
              <p className="text-xs text-muted-foreground">Pesos: {font.weights}</p>
              <p className="text-2xl mt-3" style={{ fontFamily: font.name }}>
                Aa Bb Cc 123
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Brand Assets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-xl p-5"
      >
        <h3 className="text-lg font-semibold mb-4">Assets</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {brandAssets.map((asset) => (
            <div
              key={asset.name}
              className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer group"
            >
              <div className="aspect-square bg-card rounded-lg mb-3 flex items-center justify-center border border-border">
                {asset.type === 'logo' ? (
                  <ImageIcon className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                ) : (
                  <FileText className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </div>
              <p className="font-medium text-sm">{asset.name}</p>
              <p className="text-xs text-muted-foreground">
                {asset.format} • {asset.size}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Usage Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-xl p-5"
      >
        <h3 className="text-lg font-semibold mb-4">Diretrizes de Uso</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Uso Correto</p>
              <p className="text-sm text-muted-foreground">
                Use o logo com espaçamento adequado. Mantenha a proporção original.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Cores</p>
              <p className="text-sm text-muted-foreground">
                Use as cores oficiais da marca. Não altere os tons ou saturação.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
            <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Tipografia</p>
              <p className="text-sm text-muted-foreground">
                Use Inter para texto e JetBrains Mono para código e números.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
