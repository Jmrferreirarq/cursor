import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Monitor, ChevronLeft, ChevronRight, Home, Sun, Moon } from 'lucide-react';
import { usePresentationMode } from '../../context/PresentationContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';

const presentationPages = [
  { path: '/', label: 'Dashboard' },
  { path: '/projects', label: 'Projetos' },
  { path: '/clients', label: 'Clientes' },
  { path: '/financial', label: 'Financeiro' },
  { path: '/media', label: 'Media Hub' },
  { path: '/brand', label: 'Marca' },
];

export function PresentationOverlay() {
  const { isPresentationMode, exitPresentationMode } = usePresentationMode();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showControls, setShowControls] = useState(true);
  const [lastMouseMove, setLastMouseMove] = useState(Date.now());

  const currentIndex = presentationPages.findIndex((p) => p.path === location.pathname);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < presentationPages.length - 1;

  // Hide controls after inactivity
  useEffect(() => {
    if (!isPresentationMode) return;

    const handleMouseMove = () => {
      setShowControls(true);
      setLastMouseMove(Date.now());
    };

    window.addEventListener('mousemove', handleMouseMove);

    const interval = setInterval(() => {
      if (Date.now() - lastMouseMove > 3000) {
        setShowControls(false);
      }
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, [isPresentationMode, lastMouseMove]);

  // Keyboard navigation
  useEffect(() => {
    if (!isPresentationMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && hasPrev) {
        navigate(presentationPages[currentIndex - 1].path);
      } else if (e.key === 'ArrowRight' && hasNext) {
        navigate(presentationPages[currentIndex + 1].path);
      } else if (e.key === 'Home') {
        navigate('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresentationMode, hasPrev, hasNext, currentIndex, navigate]);

  if (!isPresentationMode) return null;

  return (
    <>
      {/* Top bar with controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between px-6 py-4"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)' }}
          >
            {/* Left - Page indicator */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-xl">
                <Monitor className="w-4 h-4 text-white/70" />
                <span className="text-sm font-medium text-white">
                  Modo Apresentação
                </span>
              </div>
              
              {currentIndex >= 0 && (
                <span className="text-sm text-white/60">
                  {currentIndex + 1} / {presentationPages.length}
                </span>
              )}
            </div>

            {/* Center - Navigation dots */}
            <div className="flex items-center gap-2">
              {presentationPages.map((page, idx) => (
                <button
                  key={page.path}
                  onClick={() => navigate(page.path)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    location.pathname === page.path 
                      ? 'w-8 bg-white' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  title={page.label}
                />
              ))}
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Home */}
              <button
                onClick={() => navigate('/')}
                className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                title="Ir para Dashboard"
              >
                <Home className="w-5 h-5" />
              </button>

              {/* Exit */}
              <button
                onClick={exitPresentationMode}
                className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                title="Sair (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation arrows */}
      <AnimatePresence>
        {showControls && (
          <>
            {/* Previous */}
            {hasPrev && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={() => navigate(presentationPages[currentIndex - 1].path)}
                className="fixed left-4 top-1/2 -translate-y-1/2 z-[200] w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                title="Página anterior (←)"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
            )}

            {/* Next */}
            {hasNext && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={() => navigate(presentationPages[currentIndex + 1].path)}
                className="fixed right-4 top-1/2 -translate-y-1/2 z-[200] w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                title="Próxima página (→)"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            )}
          </>
        )}
      </AnimatePresence>

      {/* Bottom hint */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[200]"
          >
            <div className="flex items-center gap-4 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-xl text-white/60 text-xs">
              <span>← → navegar</span>
              <span>ESC sair</span>
              <span>F5 toggle</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Floating button to enter presentation mode (visible on main pages)
export function PresentationButton() {
  const { enterPresentationMode } = usePresentationMode();

  return (
    <button
      onClick={enterPresentationMode}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 flex items-center justify-center hover:scale-105 transition-transform"
      title="Modo Apresentação (F5)"
    >
      <Maximize2 className="w-5 h-5" />
    </button>
  );
}

export default PresentationOverlay;
