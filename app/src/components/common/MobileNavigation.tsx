import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  FolderKanban, 
  Users, 
  Calendar, 
  Menu,
  X,
  Image,
  FileText,
  Calculator,
  Palette,
  Euro,
  Settings,
  ChevronRight,
  Inbox
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

const mainNavItems: NavItem[] = [
  { path: '/', label: 'Início', icon: Home },
  { path: '/projects', label: 'Projetos', icon: FolderKanban },
  { path: '/clients', label: 'Clientes', icon: Users },
  { path: '/calendar', label: 'Agenda', icon: Calendar },
];

const moreNavItems: NavItem[] = [
  { path: '/media', label: 'Media', icon: Image },
  { path: '/planner', label: 'Planner', icon: Calendar },
  { path: '/proposals', label: 'Propostas', icon: FileText },
  { path: '/calculator', label: 'Calculadora', icon: Calculator },
  { path: '/brand', label: 'Marca', icon: Palette },
  { path: '/financial', label: 'Financeiro', icon: Euro },
  { path: '/inbox', label: 'Inbox', icon: Inbox },
];

export default function MobileNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close menu when route changes
  useEffect(() => {
    setMoreMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isMoreActive = moreNavItems.some((item) => isActive(item.path));

  return (
    <>
      {/* Bottom Navigation Bar */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: isVisible ? 0 : 100 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      >
        {/* Backdrop blur effect */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-border" />
        
        {/* Safe area padding for iOS */}
        <div className="relative flex items-center justify-around px-2 pb-safe pt-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-xl transition-all ${
                  active 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                }`}
              >
                <div className={`relative p-1 ${active ? 'bg-primary/10 rounded-xl' : ''}`}>
                  <Icon className="w-5 h-5" />
                  {active && (
                    <motion.div
                      layoutId="mobileNavIndicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    />
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
          
          {/* More button */}
          <button
            onClick={() => setMoreMenuOpen(true)}
            className={`flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-xl transition-all ${
              isMoreActive || moreMenuOpen
                ? 'text-primary' 
                : 'text-muted-foreground'
            }`}
          >
            <div className={`relative p-1 ${isMoreActive ? 'bg-primary/10 rounded-xl' : ''}`}>
              <Menu className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium">Mais</span>
          </button>
        </div>
      </motion.nav>

      {/* More Menu Drawer */}
      <AnimatePresence>
        {moreMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[70] lg:hidden"
            >
              <div className="bg-card rounded-t-3xl border-t border-border shadow-2xl max-h-[70vh] overflow-hidden">
                {/* Handle bar */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-border">
                  <h3 className="text-lg font-semibold">Menu</h3>
                  <button
                    onClick={() => setMoreMenuOpen(false)}
                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Menu items */}
                <div className="p-4 space-y-1 overflow-y-auto">
                  {moreNavItems.map((item, index) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    
                    return (
                      <motion.button
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          navigate(item.path);
                          setMoreMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                          active 
                            ? 'bg-primary/10 text-primary' 
                            : 'hover:bg-muted text-foreground'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          active ? 'bg-primary/20' : 'bg-muted'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium flex-1 text-left">{item.label}</span>
                        <ChevronRight className={`w-4 h-4 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                      </motion.button>
                    );
                  })}
                </div>

                {/* Footer with settings */}
                <div className="p-4 border-t border-border">
                  <button
                    onClick={() => {
                      // Could navigate to settings page
                      setMoreMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
                  >
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                      <Settings className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Definições</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
