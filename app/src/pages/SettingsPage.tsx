import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Trash2, Image, Users, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useData } from '@/context/DataContext';
import { useMedia } from '@/context/MediaContext';
const STORAGE_KEY = 'fa360_data';

export default function SettingsPage() {
  const { resetAllData } = useData();
  const { resetMediaData } = useMedia();
  const [confirmReset, setConfirmReset] = useState<'data' | 'media' | 'all' | null>(null);

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
        <h1 className="text-3xl font-bold tracking-tight">Definições</h1>
        <p className="text-muted-foreground mt-1">Configurações e gestão de dados</p>
      </motion.div>

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
            Zona de Perigo
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Estas ações apagam dados permanentemente. Não é possível reverter.
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
                <p className="font-medium">Apagar Dados</p>
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
                <p className="font-medium">Apagar Content Factory</p>
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
                <p className="font-medium text-destructive">Apagar Tudo</p>
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
                {confirmReset === 'data' && 'Apagar Dados'}
                {confirmReset === 'media' && 'Apagar Content Factory'}
                {confirmReset === 'all' && 'Apagar Tudo'}
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
                Cancelar
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
                Confirmar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
