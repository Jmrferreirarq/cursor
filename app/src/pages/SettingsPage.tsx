import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, Trash2, Image, Users, AlertTriangle, Sparkles, Key, RotateCcw, Download, Upload, Database } from 'lucide-react';
import { toast } from 'sonner';
import { useData } from '@/context/DataContext';
import { useMedia } from '@/context/MediaContext';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/locales';
import { hasApiKey } from '@/services/ai';
import AISettingsDialog from '@/components/media/AISettingsDialog';
const STORAGE_KEY = 'fa360_data';

export default function SettingsPage() {
  const { resetAllData, exportToFile, importFromFile } = useData();
  const { resetMediaData, trashAssets, trashPacks, trashPosts } = useMedia();
  const { language } = useLanguage();
  const s = (key: string) => t(`settings.${key}`, language);
  const c = (key: string) => t(`common.${key}`, language);
  const trashCount = trashAssets.length + trashPacks.length + trashPosts.length;
  const [confirmReset, setConfirmReset] = useState<'data' | 'media' | 'all' | null>(null);
  const [showAISettings, setShowAISettings] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportToFile();
    toast.success('Backup exportado com sucesso');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const result = await importFromFile(file);
      if (result.ok) {
        toast.success('Dados importados com sucesso. A recarregar…');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(result.error || 'Erro ao importar dados');
      }
    } catch {
      toast.error('Ficheiro inválido');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleResetData = async () => {
    await resetAllData();
    toast.success('Dados apagados');
    setConfirmReset(null);
  };

  const handleResetMedia = () => {
    resetMediaData();
    toast.success('Content Factory apagada');
    setConfirmReset(null);
  };

  const handleResetAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    toast.success('Tudo apagado. A recarregar…');
    setTimeout(() => window.location.reload(), 500);
    setConfirmReset(null);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Settings className="w-4 h-4" />
          <span className="text-sm font-medium tracking-wide uppercase">Sistema</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{s('title')}</h1>
        <p className="text-muted-foreground mt-1">{s('subtitle')}</p>
      </motion.div>

      {/* AI Copilot */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {s('aiCopilot')}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {s('aiDescription')}
          </p>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-muted/30 border border-border">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${hasApiKey() ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                <Key className={`w-5 h-5 ${hasApiKey() ? 'text-emerald-500' : 'text-amber-500'}`} />
              </div>
              <div>
                <p className="font-medium">{hasApiKey() ? s('apiKeyConfigured') : s('apiKeyNotConfigured')}</p>
                <p className="text-sm text-muted-foreground">
                  {hasApiKey() ? 'O AI está ativo para análise e geração de conteúdo' : 'Configura a key para usar AI Analisar, Gerar articulação, etc.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAISettings(true)}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
            >
              {hasApiKey() ? 'Alterar' : 'Configurar'}
            </button>
          </div>
        </div>
      </motion.section>

      {/* Backup & Restore */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.07 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            {s('backup')}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {s('backupDescription')}
          </p>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-muted/30 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Download className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="font-medium">{s('exportBackup')}</p>
                <p className="text-sm text-muted-foreground">{s('exportDescription')}</p>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
            >
              {c('export')}
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-muted/30 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Upload className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium">{s('importBackup')}</p>
                <p className="text-sm text-muted-foreground">{s('importDescription')}</p>
              </div>
            </div>
            <label className={`px-4 py-2 text-sm font-medium border border-border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer ${importing ? 'opacity-50 pointer-events-none' : ''}`}>
              {importing ? c('loading') : c('import')}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </motion.section>

      {/* Lixo */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-muted-foreground" />
            {s('trash')}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {s('trashDescription')}
          </p>
        </div>
        <div className="p-5">
          <Link
            to="/trash"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-xl hover:bg-muted/50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {s('viewTrash')} {trashCount > 0 && `(${trashCount})`}
          </Link>
        </div>
      </motion.section>

      {/* Zona de Perigo */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <div className="p-5 border-b border-border bg-amber-500/5">
          <h2 className="font-semibold flex items-center gap-2 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
            {s('dangerZone')}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {s('dangerDescription')}
          </p>
        </div>
        <div className="p-5 space-y-4">
          {/* Apagar só Dados */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-muted/30 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{s('deleteData')}</p>
                <p className="text-sm text-muted-foreground">Clientes, projetos e propostas</p>
              </div>
            </div>
            <button
              onClick={() => setConfirmReset('data')}
              className="px-4 py-2 text-sm font-medium text-amber-600 border border-amber-500/50 rounded-xl hover:bg-amber-500/10 transition-colors"
            >
              Apagar
            </button>
          </div>

          {/* Apagar só Content Factory */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-muted/30 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Image className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{s('deleteMedia')}</p>
                <p className="text-sm text-muted-foreground">Media, posts, packs e métricas</p>
              </div>
            </div>
            <button
              onClick={() => setConfirmReset('media')}
              className="px-4 py-2 text-sm font-medium text-amber-600 border border-amber-500/50 rounded-xl hover:bg-amber-500/10 transition-colors"
            >
              Apagar
            </button>
          </div>

          {/* Apagar Tudo */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-destructive/5 border border-destructive/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="font-medium text-destructive">{s('deleteAll')}</p>
                <p className="text-sm text-muted-foreground">Coloca tudo a zero — dados, media e conteúdo</p>
              </div>
            </div>
            <button
              onClick={() => setConfirmReset('all')}
              className="px-4 py-2 text-sm font-medium text-white bg-destructive rounded-xl hover:bg-destructive/90 transition-colors"
            >
              Apagar Tudo
            </button>
          </div>
        </div>
      </motion.section>

      {/* Confirmation Modal */}
      {confirmReset && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
          onClick={() => setConfirmReset(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-xl shadow-xl p-6 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${confirmReset === 'all' ? 'bg-destructive/20' : 'bg-amber-500/20'}`}>
                <Trash2 className={`w-5 h-5 ${confirmReset === 'all' ? 'text-destructive' : 'text-amber-500'}`} />
              </div>
              <h3 className="text-lg font-semibold">
                {confirmReset === 'data' && s('deleteData')}
                {confirmReset === 'media' && s('deleteMedia')}
                {confirmReset === 'all' && s('deleteAll')}
              </h3>
            </div>
            <p className="text-muted-foreground mb-6">
              {confirmReset === 'data' && 'Vais apagar todos os clientes, projetos e propostas. O conteúdo da Content Factory será mantido.'}
              {confirmReset === 'media' && 'Vais apagar toda a media, posts, packs e métricas. Os clientes e projetos serão mantidos.'}
              {confirmReset === 'all' && 'Vais apagar tudo — clientes, projetos, propostas, media e conteúdo. A aplicação ficará vazia.'}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmReset(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
              >
                {c('cancel')}
              </button>
              <button
                onClick={() => {
                  if (confirmReset === 'data') handleResetData();
                  else if (confirmReset === 'media') handleResetMedia();
                  else handleResetAll();
                }}
                className={`px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors ${
                  confirmReset === 'all' ? 'bg-destructive hover:bg-destructive/90' : 'bg-amber-500 hover:bg-amber-600'
                }`}
              >
                {c('confirm')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <AISettingsDialog open={showAISettings} onClose={() => setShowAISettings(false)} />
    </div>
  );
}
