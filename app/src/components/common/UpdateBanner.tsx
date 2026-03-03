/**
 * UpdateBanner — aparece automaticamente quando existe uma nova versão
 * da plataforma disponível (detetada pelo Service Worker / PWA).
 *
 * Usa o hook `useRegisterSW` do vite-plugin-pwa para controlo manual.
 */

import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X, Sparkles } from 'lucide-react';

declare const __BUILD_DATE__: string;

export function UpdateBanner() {
  const [dismissed, setDismissed] = useState(false);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (!r) return;
      setInterval(() => r.update(), 60 * 60 * 1000);
    },
    onRegisterError(error) {
      console.warn('[PWA] SW registration error', error);
    },
  });

  useEffect(() => {
    if (needRefresh) setDismissed(false);
  }, [needRefresh]);

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  const show = needRefresh && !dismissed;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="update-banner"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100vw-2rem)] max-w-md"
        >
          <div className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground rounded-xl shadow-2xl shadow-primary/30 border border-primary/20">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-foreground/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">Nova versão disponível</p>
              <p className="text-xs opacity-75 mt-0.5 leading-tight truncate">
                Atualizado em {__BUILD_DATE__}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleUpdate}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-primary-foreground text-primary rounded-lg hover:bg-primary-foreground/90 active:scale-95 transition-all"
              >
                <RefreshCw className="w-3 h-3" />
                Atualizar
              </button>
              <button
                onClick={handleDismiss}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-primary-foreground/15 active:scale-95 transition-all opacity-75 hover:opacity-100"
                aria-label="Dispensar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
