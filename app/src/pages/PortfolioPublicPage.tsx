import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, ArrowUpRight, Instagram, Linkedin, ChevronDown,
  FileText, Home, Building2, Palette, Camera, Share2, MessageCircle,
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useMedia } from '@/context/MediaContext';
import type { Project } from '@/types';

const CATEGORIES = ['Todos', 'Habitação', 'Restauração', 'Comércio', 'Escritórios', 'Reabilitação'];

// Fallback projects when DataContext is empty (imagens Unsplash)
const FALLBACK_PROJECTS: Array<{ id: string; name: string; category: string; location: string; images: string[] }> = [
  { id: 'fb1', name: 'Casa do Douro', category: 'Habitação', location: 'Peso da Régua', images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'] },
  { id: 'fb2', name: 'Escritório Tech Hub', category: 'Escritórios', location: 'Aveiro', images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'] },
  { id: 'fb3', name: 'Apartamento Foz', category: 'Habitação', location: 'Porto', images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'] },
  { id: 'fb4', name: 'Restaurante Mar', category: 'Restauração', location: 'Costa Nova', images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'] },
  { id: 'fb5', name: 'Hotel Ria', category: 'Comércio', location: 'Aveiro', images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'] },
  { id: 'fb6', name: 'Clínica Luz', category: 'Reabilitação', location: 'Aveiro', images: ['https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80'] },
];

function mapProjectToPortfolio(p: Project, assetsByProject: Map<string, { src?: string; thumbnail?: string }[]>): { id: string; name: string; category: string; location: string; images: string[] } {
  const categoryMap: Record<string, string> = {
    lead: 'Habitação', negotiation: 'Habitação', active: 'Em curso',
    paused: 'Em pausa', completed: 'Concluído', cancelled: 'Cancelado',
  };
  const phaseToCategory: Record<string, string> = {
    'Arquitetura': 'Habitação', 'Interiores': 'Habitação', 'Reabilitação': 'Reabilitação',
    'Comercial': 'Comércio', 'Restauração': 'Restauração', 'Escritório': 'Escritórios',
  };
  const category = phaseToCategory[p.phase] || categoryMap[p.status] || 'Habitação';
  const imgs = assetsByProject.get(p.id) || [];
  const images = imgs.map((a) => a.thumbnail || a.src).filter(Boolean) as string[];
  return {
    id: p.id,
    name: p.name,
    category,
    location: p.address || p.municipality || '—',
    images,
  };
}

const SERVICES = [
  { icon: FileText, title: 'Aconselhamento Técnico', desc: 'Análise de viabilidade, pareceres técnicos e acompanhamento de licenciamento.' },
  { icon: Home, title: 'Projetos de Arquitetura', desc: 'Projetos de arquitetura para habitação, comércio e equipamentos.' },
  { icon: Building2, title: 'Projetos de Reabilitação', desc: 'Reabilitação de edifícios existentes com foco em eficiência e património.' },
  { icon: Palette, title: 'Design de Interiores', desc: 'Conceção e coordenação de espaços interiores residenciais e comerciais.' },
  { icon: Camera, title: 'Visualização 3D', desc: 'Renders fotorrealistas e visualizações para apresentação de projetos.' },
];

export default function PortfolioPublicPage() {
  const navigate = useNavigate();
  const { projects } = useData();
  const { assets } = useMedia();
  const projectsRef = useRef<HTMLDivElement>(null);

  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [selectedProject, setSelectedProject] = useState<{ id: string; name: string; category: string; location: string; images: string[] } | null>(null);

  const assetsByProject = useMemo(() => {
    const map = new Map<string, { src?: string; thumbnail?: string }[]>();
    assets.forEach((a) => {
      if (a.projectId) {
        const list = map.get(a.projectId) || [];
        list.push({ src: a.src, thumbnail: a.thumbnail || a.src });
        map.set(a.projectId, list);
      }
    });
    return map;
  }, [assets]);

  const portfolioItems = useMemo(() => {
    if (projects.length > 0) {
      return projects.map((p) => mapProjectToPortfolio(p, assetsByProject));
    }
    return FALLBACK_PROJECTS;
  }, [projects, assetsByProject]);

  const filteredProjects = useMemo(() => {
    if (categoryFilter === 'Todos') return portfolioItems;
    return portfolioItems.filter((p) => p.category === categoryFilter);
  }, [portfolioItems, categoryFilter]);

  const scrollToProjects = () => projectsRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 1. HERO SECTION */}
      <section className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-[1]" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920)',
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white drop-shadow-lg">
            FERREIRARQUITETOS
          </h1>
          <p className="text-xl sm:text-2xl text-white/95 mt-4 font-medium tracking-wide">
            Abrimos Portas, Fechamos Projetos
          </p>
          <p className="text-base sm:text-lg text-white/80 mt-6 max-w-2xl mx-auto">
            Atelier de Arquitetura em Aveiro — Projetos de Arquitetura, Reabilitação, Design de Interiores e Visualização 3D
          </p>
          <div className="mt-6">
            <span className="inline-block px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium backdrop-blur-sm">
              Prémios Lusófonos de Arquitetura 2021
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <button
              onClick={() => navigate('/cotacao')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-white/95 transition-colors"
            >
              Pedir Cotação
              <ArrowUpRight className="w-5 h-5" />
            </button>
            <button
              onClick={scrollToProjects}
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              Ver Projetos
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
          <div className="flex justify-center gap-6 mt-12">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors" aria-label="Pinterest">
              <Share2 className="w-6 h-6" />
            </a>
            <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors" aria-label="Behance">
              <Palette className="w-6 h-6" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* 2. PROJETOS GRID */}
      <section ref={projectsRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold mb-2"
          >
            Projetos
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-muted-foreground mb-8"
          >
            Conheça alguns dos nossos trabalhos
          </motion.p>

          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  categoryFilter === cat
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card hover:border-primary/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj, idx) => (
              <motion.article
                key={proj.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedProject(proj)}
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                  {proj.images[0] ? (
                    <img
                      src={proj.images[0]}
                      alt={proj.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl font-light text-muted-foreground/30 select-none">
                        {proj.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg bg-black/50 text-white text-xs font-medium">
                      {proj.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold truncate">{proj.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {proj.location}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SERVIÇOS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold mb-2"
          >
            Serviços
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-muted-foreground mb-12"
          >
            O que fazemos
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {SERVICES.map((s, idx) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="p-6 rounded-xl border border-border bg-card hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SOBRE / JOSÉ FERREIRA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted"
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600)' }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">José Ferreira</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Arquitecto fundador do atelier FERREIRARQUITETOS. Com formação em Arquitetura e experiência em projetos
                residenciais, comerciais e de reabilitação, a filosofia do atelier assenta na relação entre lugar, luz e
                materialidade — criando espaços que respondem às necessidades dos clientes e ao contexto.
              </p>
              <div className="flex gap-8">
                <div>
                  <p className="text-3xl font-bold text-primary">50+</p>
                  <p className="text-sm text-muted-foreground">Projetos realizados</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">15+</p>
                  <p className="text-sm text-muted-foreground">Anos de experiência</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. CTA FINAL */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-foreground text-background">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold mb-6"
          >
            Tem um novo projeto que quer desenvolver?
          </motion.h2>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={() => navigate('/cotacao')}
            className="inline-flex items-center gap-2 px-10 py-4 bg-background text-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Fale Connosco
            <ArrowUpRight className="w-5 h-5" />
          </motion.button>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 text-background/80 text-sm"
          >
            Avenida Europa 914, 3810-138 Aveiro · +351 910 662 814
          </motion.p>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex gap-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="Behance">
              <Palette className="w-5 h-5" />
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="Pinterest">
              <Share2 className="w-5 h-5" />
            </a>
            <a href="https://wa.me/351910662814" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="WhatsApp">
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 FERREIRARQUITETOS. Todos os direitos reservados.
          </p>
          <a href="/politica-privacidade" className="text-sm text-muted-foreground hover:underline">
            Política de Privacidade
          </a>
        </div>
      </footer>

      {/* Modal Lightbox */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] overflow-auto rounded-2xl bg-card border border-border"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="aspect-video bg-muted">
                {selectedProject.images[0] ? (
                  <img
                    src={selectedProject.images[0]}
                    alt={selectedProject.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-9xl font-light text-muted-foreground/30">
                      {selectedProject.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-8">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {selectedProject.category}
                </span>
                <h2 className="text-2xl font-bold mt-4">{selectedProject.name}</h2>
                <p className="text-muted-foreground flex items-center gap-2 mt-2">
                  <MapPin className="w-4 h-4" />
                  {selectedProject.location}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
