import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
  Scale,
  MapPin,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  Trash2,
  Bot,
  ClipboardList,
  BookOpen,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
}

interface NavGroup {
  label: string;
  icon: React.ElementType;
  children: NavItem[];
}

type NavEntry = NavItem | NavGroup;

function isGroup(entry: NavEntry): entry is NavGroup {
  return 'children' in entry;
}

const navEntries: NavEntry[] = [
  { path: '/', label: 'Início', icon: LayoutDashboard, exact: true },
  { path: '/proposals', label: 'Propostas', icon: FileText },
  { path: '/projects', label: 'Projectos', icon: FolderKanban },
  { path: '/clients', label: 'Clientes', icon: Users },
  { path: '/tasks', label: 'Tarefas', icon: CheckSquare },
  { path: '/financial', label: 'Finanças', icon: Wallet },
  { path: '/calendar', label: 'Agenda', icon: Calendar },
  { path: '/marketing', label: 'Marketing', icon: Megaphone },
  { path: '/technical', label: 'Técnico', icon: Wrench },
  // ─── Legislação dropdown ───
  {
    label: 'Legal',
    icon: Scale,
    children: [
      { path: '/legislacao', label: 'Biblioteca', icon: BookOpen },
      { path: '/consulta-legislacao', label: 'Tipologia', icon: ClipboardList },
      { path: '/checklist', label: 'Checklist', icon: CheckSquare },
      { path: '/municipios', label: 'Municípios', icon: MapPin },
    ],
  },
  { path: '/media', label: 'Media', icon: Image },
  { path: '/planner', label: 'Conteúdo', icon: Calendar },
  { path: '/library', label: 'Arquivo', icon: Library },
  { path: '/inbox', label: 'Inbox', icon: Inbox },
  { path: '/brand', label: 'Marca', icon: Palette },
  { path: '/calculator', label: 'Calc.', icon: Calculator },
  { path: '/agent', label: 'AI', icon: Bot },
];

// Flat list for mobile menu
const allNavItems: NavItem[] = navEntries.flatMap(entry =>
  isGroup(entry) ? entry.children : [entry]
);

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { resetAllData } = useData();

  const handleResetData = async () => {
    await resetAllData();
    localStorage.removeItem('fa360_data');
    setShowResetConfirm(false);
    setUserMenuOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    if (userMenuOpen || openDropdown) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [userMenuOpen, openDropdown]);

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

          {/* Desktop Navigation — icon-only with tooltips */}
          <div className="hidden xl:flex items-center gap-0.5">
            {navEntries.map((entry) => {
              if (isGroup(entry)) {
                const isOpen = openDropdown === entry.label;
                const currentPath = window.location.pathname;
                const isChildActive = entry.children.some(c => currentPath === c.path);

                return (
                  <div key={entry.label} className="relative group" ref={isOpen ? dropdownRef : undefined}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(isOpen ? null : entry.label);
                      }}
                      className={`relative flex items-center p-2.5 rounded-lg transition-all duration-200 ${
                        isChildActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <entry.icon className="w-[18px] h-[18px]" />
                      {/* Tooltip */}
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[11px] font-medium bg-foreground text-background rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                        {entry.label}
                      </span>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-48 bg-popover border border-border rounded-xl shadow-lg py-1.5 z-50"
                        >
                          {entry.children.map((child) => (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              end={child.exact}
                              onClick={() => setOpenDropdown(null)}
                              className={({ isActive }) =>
                                `flex items-center gap-2.5 px-3.5 py-2 text-sm font-medium transition-colors ${
                                  isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`
                              }
                            >
                              <child.icon className="w-4 h-4 shrink-0" />
                              <span>{child.label}</span>
                            </NavLink>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              // Regular nav item — icon only with tooltip
              const item = entry;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `relative group p-2.5 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`
                  }
                >
                  <item.icon className="w-[18px] h-[18px]" />
                  {/* Tooltip */}
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[11px] font-medium bg-foreground text-background rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
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
                    <button onClick={() => { navigate('/settings'); setUserMenuOpen(false); }} className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors">
                      Configurações
                    </button>
                    <div className="border-t border-border my-1" />
                    <button 
                      onClick={() => setShowResetConfirm(true)}
                      className="w-full px-4 py-2 text-left text-sm text-amber-600 hover:bg-amber-500/10 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Limpar Dados
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
              {allNavItems.map((item, index) => (
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
                    <span>{item.label}</span>
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Dialog */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-popover border border-border rounded-xl shadow-xl p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold">Limpar Todos os Dados</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Esta ação irá apagar permanentemente todos os clientes, projetos e propostas guardados. 
                Esta ação não pode ser revertida.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleResetData}
                  className="px-4 py-2 text-sm font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Confirmar Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
