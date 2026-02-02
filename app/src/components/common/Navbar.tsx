import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  CheckSquare,
  Wallet,
  Calendar,
  Megaphone,
  Wrench,
  FileText,
  Image,
  Library,
  Inbox,
  Palette,
  Calculator,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  ChevronDown,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

const navItems = [
  { path: '/', labelKey: 'nav.dashboard', icon: LayoutDashboard, exact: true },
  { path: '/proposals', labelKey: 'nav.proposals', icon: FileText },
  { path: '/projects', labelKey: 'nav.projects', icon: FolderKanban },
  { path: '/clients', labelKey: 'nav.clients', icon: Users },
  { path: '/tasks', labelKey: 'nav.tasks', icon: CheckSquare },
  { path: '/financial', labelKey: 'nav.financial', icon: Wallet },
  { path: '/calendar', labelKey: 'nav.calendar', icon: Calendar },
  { path: '/marketing', labelKey: 'nav.marketing', icon: Megaphone },
  { path: '/technical', labelKey: 'nav.technical', icon: Wrench },
  { path: '/media', labelKey: 'nav.media', icon: Image },
  { path: '/library', labelKey: 'nav.library', icon: Library },
  { path: '/inbox', labelKey: 'nav.inbox', icon: Inbox },
  { path: '/brand', labelKey: 'nav.brand', icon: Palette },
  { path: '/calculator', labelKey: 'nav.calculator', icon: Calculator },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const getLabel = (key: string) => {
    const result = t(key);
    return typeof result === 'string' ? result : key;
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [userMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-background z-50" style={{ border: 0, boxShadow: 'none' }}>
        <div className="h-full px-4 lg:px-6 flex items-center justify-between max-w-[2400px] mx-auto">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 shrink-0">
            <div className="flex flex-col leading-none">
              <span className="text-xs tracking-[0.2em] text-muted-foreground font-medium">
                ARQUITETOS
              </span>
              <span className="text-lg font-bold tracking-tight">
                FERREIRA
                <span className="text-primary text-xs align-super ml-0.5">®</span>
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{getLabel(item.labelKey)}</span>
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-medium text-sm"
              aria-label="Toggle language"
            >
              {language.toUpperCase()}
            </button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">F</span>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-popover border border-border rounded-xl shadow-card-hover py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-border">
                      <p className="font-medium">Ferreira</p>
                      <p className="text-sm text-muted-foreground">ceo@fa360.pt</p>
                    </div>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors">
                      Perfil
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors">
                      Configurações
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors">
                      Sair
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 top-16 bg-background z-40 xl:hidden"
          >
            <div className="p-4 space-y-1 overflow-y-auto h-full pb-24">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NavLink
                    to={item.path}
                    end={item.exact}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span>{getLabel(item.labelKey)}</span>
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
