import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, ArrowUpRight, Menu, ExternalLink } from 'lucide-react';

// Portfolio color palette (light, premium feel)
const COLORS = {
  background: '#FAFAF9',
  white: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#6B7280',
  accent: '#1F4E5F',
  accentLight: 'rgba(31, 78, 95, 0.08)',
  border: '#E5E5E5',
};

interface PortfolioProject {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  location: string;
  year: string;
  description: string;
  tags: string[];
  images: string[];
  featured?: boolean;
}

// Mock portfolio projects
const portfolioProjects: PortfolioProject[] = [
  {
    id: '1',
    title: 'Casa do Douro',
    subtitle: 'Moradia Unifamiliar',
    category: 'Residencial',
    location: 'Peso da Régua',
    year: '2024',
    description: 'Integração perfeita entre a arquitetura contemporânea e a paisagem vinhateira do Douro. O projeto privilegia as vistas panorâmicas e a relação interior-exterior.',
    tags: ['Moradia', 'Contemporâneo', 'Sustentável'],
    featured: true,
    images: [],
  },
  {
    id: '2',
    title: 'Escritório Tech Hub',
    subtitle: 'Espaço Corporativo',
    category: 'Comercial',
    location: 'Porto',
    year: '2024',
    description: 'Reabilitação de armazém industrial para sede tecnológica. Espaços flexíveis, luz natural abundante e materialidade crua.',
    tags: ['Escritório', 'Reabilitação', 'Industrial'],
    images: [],
  },
  {
    id: '3',
    title: 'Apartamento Foz',
    subtitle: 'Remodelação Interior',
    category: 'Residencial',
    location: 'Porto',
    year: '2023',
    description: 'Transformação completa de apartamento T3 com vista mar. Linhas minimalistas e paleta neutra que valoriza a luz atlântica.',
    tags: ['Apartamento', 'Interior', 'Minimalista'],
    images: [],
  },
  {
    id: '4',
    title: 'Restaurante Mar',
    subtitle: 'Design de Interiores',
    category: 'Hotelaria',
    location: 'Matosinhos',
    year: '2023',
    description: 'Conceito gastronómico que celebra o oceano. Materiais naturais, tons azuis e uma atmosfera acolhedora.',
    tags: ['Restaurante', 'Hotelaria', 'Design'],
    images: [],
  },
  {
    id: '5',
    title: 'Hotel Boutique Minho',
    subtitle: 'Turismo Rural',
    category: 'Hotelaria',
    location: 'Ponte de Lima',
    year: '2023',
    description: 'Conversão de casa senhorial em hotel de charme. Preservação patrimonial com conforto contemporâneo.',
    tags: ['Hotel', 'Reabilitação', 'Património'],
    images: [],
  },
  {
    id: '6',
    title: 'Clínica Wellness',
    subtitle: 'Equipamento de Saúde',
    category: 'Comercial',
    location: 'Braga',
    year: '2024',
    description: 'Espaço de saúde e bem-estar com ambiente zen. Materiais naturais, iluminação cuidada e percursos intuitivos.',
    tags: ['Clínica', 'Saúde', 'Wellness'],
    images: [],
  },
];

const categories = ['Todos', 'Residencial', 'Comercial', 'Hotelaria'];

export default function PortfolioPublicPage() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'Todos') return portfolioProjects;
    return portfolioProjects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const featuredProject = filteredProjects.find((p) => p.featured) || filteredProjects[0];
  const otherProjects = filteredProjects.filter((p) => p.id !== featuredProject?.id);

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.background }}>
      {/* Header */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl"
        style={{ backgroundColor: 'rgba(250, 250, 249, 0.9)', borderBottom: `1px solid ${COLORS.border}` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: COLORS.accent }}
              >
                <span className="text-sm font-bold text-white">FA</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold" style={{ color: COLORS.text }}>Ferreira Arquitectura</p>
                <p className="text-xs" style={{ color: COLORS.textMuted }}>Portfolio</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="text-sm font-medium transition-colors relative py-2"
                  style={{ color: activeCategory === cat ? COLORS.accent : COLORS.textMuted }}
                >
                  {cat}
                  {activeCategory === cat && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: COLORS.accent }}
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* Contact Button */}
            <div className="flex items-center gap-4">
              <a 
                href="mailto:contacto@fa360.pt"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                style={{ backgroundColor: COLORS.accent, color: 'white' }}
              >
                Contactar
                <ArrowUpRight className="w-4 h-4" />
              </a>
              
              {/* Mobile menu button */}
              <button 
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-5 h-5" style={{ color: COLORS.text }} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t"
              style={{ borderColor: COLORS.border, backgroundColor: COLORS.white }}
            >
              <div className="px-4 py-4 space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{ 
                      backgroundColor: activeCategory === cat ? COLORS.accentLight : 'transparent',
                      color: activeCategory === cat ? COLORS.accent : COLORS.text 
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero / Featured Project */}
      {featuredProject && (
        <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-3xl overflow-hidden cursor-pointer group"
              style={{ backgroundColor: COLORS.white }}
              onClick={() => setSelectedProject(featuredProject)}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image */}
                <div 
                  className="aspect-[4/3] lg:aspect-auto lg:h-[500px] relative"
                  style={{ backgroundColor: `${COLORS.accent}15` }}
                >
                  {/* Placeholder gradient */}
                  <div 
                    className="absolute inset-0"
                    style={{ 
                      background: `linear-gradient(135deg, ${COLORS.accent}20 0%, ${COLORS.accent}05 100%)` 
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span 
                      className="text-8xl font-light select-none"
                      style={{ color: `${COLORS.accent}20` }}
                    >
                      {featuredProject.title.charAt(0)}
                    </span>
                  </div>
                  
                  {/* Category badge */}
                  <div className="absolute top-6 left-6">
                    <span 
                      className="px-3 py-1.5 text-xs font-medium rounded-full"
                      style={{ backgroundColor: COLORS.white, color: COLORS.accent }}
                    >
                      {featuredProject.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-sm mb-4" style={{ color: COLORS.textMuted }}>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {featuredProject.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {featuredProject.year}
                    </span>
                  </div>

                  <h1 
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 group-hover:text-opacity-80 transition-colors"
                    style={{ color: COLORS.text }}
                  >
                    {featuredProject.title}
                  </h1>
                  <p className="text-lg mb-6" style={{ color: COLORS.textMuted }}>
                    {featuredProject.subtitle}
                  </p>

                  <p className="text-base leading-relaxed mb-8" style={{ color: COLORS.textMuted }}>
                    {featuredProject.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {featuredProject.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 text-xs font-medium rounded-lg"
                        style={{ backgroundColor: COLORS.accentLight, color: COLORS.accent }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button 
                    className="inline-flex items-center gap-2 text-sm font-medium transition-colors group"
                    style={{ color: COLORS.accent }}
                  >
                    Ver projeto completo
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.article>
          </div>
        </section>
      )}

      {/* Projects Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: COLORS.textMuted }}>
              Projetos
            </h2>
            <span className="text-sm" style={{ color: COLORS.textMuted }}>
              {filteredProjects.length} projetos
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group cursor-pointer rounded-2xl overflow-hidden"
                style={{ backgroundColor: COLORS.white }}
                onClick={() => setSelectedProject(project)}
              >
                {/* Image */}
                <div 
                  className="aspect-[4/3] relative"
                  style={{ backgroundColor: `${COLORS.accent}10` }}
                >
                  <div 
                    className="absolute inset-0"
                    style={{ 
                      background: `linear-gradient(135deg, ${COLORS.accent}15 0%, ${COLORS.accent}05 100%)` 
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span 
                      className="text-6xl font-light select-none group-hover:scale-110 transition-transform"
                      style={{ color: `${COLORS.accent}15` }}
                    >
                      {project.title.charAt(0)}
                    </span>
                  </div>

                  {/* Overlay on hover */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                  >
                    <span className="px-4 py-2 bg-white rounded-xl text-sm font-medium" style={{ color: COLORS.text }}>
                      Ver projeto
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs mb-2" style={{ color: COLORS.textMuted }}>
                    <span>{project.category}</span>
                    <span>·</span>
                    <span>{project.year}</span>
                  </div>
                  <h3 
                    className="text-lg font-semibold mb-1 group-hover:text-opacity-80 transition-colors"
                    style={{ color: COLORS.text }}
                  >
                    {project.title}
                  </h3>
                  <p className="text-sm" style={{ color: COLORS.textMuted }}>
                    {project.subtitle}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: COLORS.white }}>
        <div className="max-w-7xl mx-auto text-center">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: COLORS.accent }}
          >
            <span className="text-lg font-bold text-white">FA</span>
          </div>
          <h3 className="text-2xl font-bold mb-2" style={{ color: COLORS.text }}>
            Ferreira Arquitectura
          </h3>
          <p className="text-sm mb-8" style={{ color: COLORS.textMuted }}>
            Arquitetura · Design · Consultoria
          </p>
          <a 
            href="mailto:contacto@fa360.pt"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium"
            style={{ backgroundColor: COLORS.accent, color: 'white' }}
          >
            Fale connosco
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </footer>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] overflow-auto rounded-2xl"
              style={{ backgroundColor: COLORS.white }}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image */}
              <div 
                className="aspect-video relative"
                style={{ backgroundColor: `${COLORS.accent}15` }}
              >
                <div 
                  className="absolute inset-0"
                  style={{ 
                    background: `linear-gradient(135deg, ${COLORS.accent}20 0%, ${COLORS.accent}05 100%)` 
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span 
                    className="text-9xl font-light select-none"
                    style={{ color: `${COLORS.accent}15` }}
                  >
                    {selectedProject.title.charAt(0)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center gap-4 text-sm mb-4" style={{ color: COLORS.textMuted }}>
                  <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: COLORS.accentLight, color: COLORS.accent }}>
                    {selectedProject.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {selectedProject.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {selectedProject.year}
                  </span>
                </div>

                <h2 className="text-3xl font-bold mb-2" style={{ color: COLORS.text }}>
                  {selectedProject.title}
                </h2>
                <p className="text-lg mb-6" style={{ color: COLORS.textMuted }}>
                  {selectedProject.subtitle}
                </p>

                <p className="text-base leading-relaxed mb-8" style={{ color: COLORS.textMuted }}>
                  {selectedProject.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1.5 text-sm font-medium rounded-lg"
                      style={{ backgroundColor: COLORS.accentLight, color: COLORS.accent }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
