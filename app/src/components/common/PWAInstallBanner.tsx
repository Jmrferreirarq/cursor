import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Wifi, WifiOff, RefreshCw, Sparkles } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export function PWAInstallBanner() {
  const { isInstallable, isInstalled, promptInstall } = usePWA();
  const [dismissed, setDismissed] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Show banner after delay if installable
  useEffect(() => {
    if (isInstallable && !isInstalled && !dismissed) {
      const timer = setTimeout(() => setShowBanner(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, dismissed]);

  const handleInstall = async () => {
    const success = await promptInstall();
    if (success) {
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowBanner(false);
    // Remember dismissal for this session
    sessionStorage.setItem('pwa-banner-dismissed', 'true');
  };

  // Check if already dismissed this session
  useEffect(() => {
    if (sessionStorage.getItem('pwa-banner-dismissed')) {
      setDismissed(true);
    }
  }, []);

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:w-96 z-50"
      >
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Gradient accent */}
          <div className="h-1 bg-gradient-to-r from-primary via-cyan-500 to-emerald-500" />
          
          <div className="p-4">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-1">
                  Instalar FA360
                </h3>
                <p className="text-sm text-muted-foreground">
                  Adicione à área de trabalho para acesso rápido e offline.
                </p>
              </div>
              
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleInstall}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                Instalar
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2.5 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-colors"
              >
                Agora não
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function OfflineIndicator() {
  const { isOnline } = usePWA();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShow(true);
    } else {
      // Delay hiding to show "back online" message briefly
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        >
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg ${
            isOnline 
              ? 'bg-emerald-500 text-white' 
              : 'bg-amber-500 text-white'
          }`}>
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4" />
                <span className="text-sm font-medium">De volta online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                <span className="text-sm font-medium">Sem ligação à internet</span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function UpdateAvailableBanner() {
  const { isUpdateAvailable, updateApp } = usePWA();
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    if (isUpdateAvailable) setDismissed(false);
  }, [isUpdateAvailable]);

  if (!isUpdateAvailable || dismissed) return null;

  return (
    <motion.div
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
          <p className="text-xs opacity-75 mt-0.5 leading-tight">Atualizado em {__BUILD_DATE__}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={updateApp}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-primary-foreground text-primary rounded-lg hover:bg-primary-foreground/90 active:scale-95 transition-all"
          >
            <RefreshCw className="w-3 h-3" />
            Atualizar
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-primary-foreground/15 opacity-75 hover:opacity-100 transition-all"
            aria-label="Dispensar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default PWAInstallBanner;
