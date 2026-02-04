import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Image, Upload, Search, LayoutGrid, Rows3 } from 'lucide-react';
import { MediaCard, MediaCardFeatured, MediaTags, MediaLightbox, type MediaItem } from '@/components/media';

// Mock data com tags e estrutura melhorada
const mockMedia: MediaItem[] = [
  { 
    id: '1', 
    name: 'Casa Douro - Exterior Principal.jpg', 
    type: 'image', 
    tags: ['Residencial', 'Exterior', 'Fotografia'],
    project: 'Casa Douro',
    date: '2024-01-15',
    size: '2.4 MB'
  },
  { 
    id: '2', 
    name: 'Casa Douro - Sala de Estar.jpg', 
    type: 'image', 
    tags: ['Residencial', 'Interior', 'Fotografia'],
    project: 'Casa Douro',
    date: '2024-01-15',
    size: '1.8 MB'
  },
  { 
    id: '3', 
    name: 'Escritório Tech - Open Space.jpg', 
    type: 'image', 
    tags: ['Comercial', 'Interior', 'Render'],
    project: 'Escritório Tech',
    date: '2024-01-12',
    size: '3.2 MB'
  },
  { 
    id: '4', 
    name: 'Apresentação Cliente.mp4', 
    type: 'video', 
    tags: ['Comercial', 'Vídeo'],
    project: 'Escritório Tech',
    date: '2024-01-12',
    size: '45.2 MB'
  },
  { 
    id: '5', 
    name: 'Moradia Cascais - Fachada.jpg', 
    type: 'image', 
    tags: ['Residencial', 'Exterior', 'Render'],
    project: 'Moradia Cascais',
    date: '2024-01-10',
    size: '4.1 MB'
  },
  { 
    id: '6', 
    name: 'Moradia Cascais - Piscina.jpg', 
    type: 'image', 
    tags: ['Residencial', 'Exterior', 'Render'],
    project: 'Moradia Cascais',
    date: '2024-01-10',
    size: '3.8 MB'
  },
  { 
    id: '7', 
    name: 'Restaurante Mar - Interior.jpg', 
    type: 'image', 
    tags: ['Comercial', 'Interior', 'Fotografia'],
    project: 'Restaurante Mar',
    date: '2024-01-08',
    size: '2.9 MB'
  },
  { 
    id: '8', 
    name: 'Loft Lisboa - Quarto.jpg', 
    type: 'image', 
    tags: ['Residencial', 'Interior', 'Fotografia'],
    project: 'Loft Lisboa',
    date: '2024-01-05',
    size: '2.1 MB'
  },
  { 
    id: '9', 
    name: 'Hotel Algarve - Lobby.jpg', 
    type: 'image', 
    tags: ['Hotelaria', 'Interior', 'Render'],
    project: 'Hotel Algarve',
    date: '2024-01-03',
    size: '5.2 MB'
  },
  { 
    id: '10', 
    name: 'Clínica Saúde - Receção.jpg', 
    type: 'image', 
    tags: ['Comercial', 'Interior', 'Render'],
    project: 'Clínica Saúde',
    date: '2024-01-02',
    size: '2.7 MB'
  },
  { 
    id: '11', 
    name: 'Apartamento Porto - Vista Rio.jpg', 
    type: 'image', 
    tags: ['Residencial', 'Interior', 'Fotografia'],
    project: 'Apartamento Porto',
    date: '2024-01-01',
    size: '3.3 MB'
  },
  { 
    id: '12', 
    name: 'Showroom Móveis - Geral.jpg', 
    type: 'image', 
    tags: ['Comercial', 'Interior', 'Fotografia'],
    project: 'Showroom Móveis',
    date: '2023-12-28',
    size: '2.5 MB'
  },
];

// Extrair todas as tags únicas
const allTags = Array.from(new Set(mockMedia.flatMap((item) => item.tags))).sort();

export default function MediaHubPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'editorial' | 'grid'>('editorial');
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);

  // Filtrar media
  const filteredMedia = useMemo(() => {
    return mockMedia.filter((item) => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.project?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTag = !activeTag || item.tags.includes(activeTag);
      
      return matchesSearch && matchesTag;
    });
  }, [searchQuery, activeTag]);

  // Contar items por tag
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allTags.forEach((tag) => {
      counts[tag] = mockMedia.filter((item) => item.tags.includes(tag)).length;
    });
    return counts;
  }, []);

  // Separar featured (primeiro item) dos restantes no modo editorial
  const featuredItem = viewMode === 'editorial' ? filteredMedia[0] : null;
  const gridItems = viewMode === 'editorial' ? filteredMedia.slice(1) : filteredMedia;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Image className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide uppercase">Portfolio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Media Hub</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Galeria de projetos, renders e fotografias do atelier.
          </p>
        </div>
        
        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors w-fit">
          <Upload className="w-4 h-4" />
          <span>Upload</span>
        </button>
      </motion.div>

      {/* Search + View Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar por nome, projeto ou tag..."
            className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-sm"
          />
        </div>

        {/* View mode toggle */}
        <div className="flex bg-muted/50 border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => setViewMode('editorial')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              viewMode === 'editorial' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Editorial</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              viewMode === 'grid' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Rows3 className="w-4 h-4" />
            <span className="hidden sm:inline">Grelha</span>
          </button>
        </div>
      </motion.div>

      {/* Tags Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <MediaTags
          tags={allTags}
          activeTag={activeTag}
          onTagClick={setActiveTag}
          counts={tagCounts}
        />
      </motion.div>

      {/* Results count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <p className="text-sm text-muted-foreground">
          {filteredMedia.length} {filteredMedia.length === 1 ? 'resultado' : 'resultados'}
          {activeTag && <span className="ml-1">em <strong>{activeTag}</strong></span>}
        </p>
      </motion.div>

      {/* Media Grid - Editorial Layout */}
      {viewMode === 'editorial' && filteredMedia.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="space-y-6"
        >
          {/* Featured item */}
          {featuredItem && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MediaCardFeatured
                item={featuredItem}
                index={0}
                onTagClick={setActiveTag}
                onOpenLightbox={setLightboxItem}
              />
              
              {/* Two smaller items beside featured */}
              <div className="grid grid-cols-2 gap-4">
                {gridItems.slice(0, 4).map((item, index) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    index={index + 1}
                    variant="compact"
                    onTagClick={setActiveTag}
                    onOpenLightbox={setLightboxItem}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Rest of items */}
          {gridItems.length > 4 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {gridItems.slice(4).map((item, index) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  index={index + 5}
                  onTagClick={setActiveTag}
                  onOpenLightbox={setLightboxItem}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Media Grid - Standard Layout */}
      {viewMode === 'grid' && filteredMedia.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          {filteredMedia.map((item, index) => (
            <MediaCard
              key={item.id}
              item={item}
              index={index}
              onTagClick={setActiveTag}
              onOpenLightbox={setLightboxItem}
            />
          ))}
        </motion.div>
      )}

      {/* Empty state */}
      {filteredMedia.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 px-6 rounded-xl border border-dashed border-border bg-muted/10"
        >
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <Image className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium text-center">
            Nenhum ficheiro encontrado
          </p>
          <p className="text-sm text-muted-foreground/70 mt-1 text-center">
            Tenta ajustar a pesquisa ou os filtros
          </p>
          {(searchQuery || activeTag) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTag(null);
              }}
              className="mt-4 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Limpar filtros
            </button>
          )}
        </motion.div>
      )}

      {/* Lightbox */}
      <MediaLightbox
        item={lightboxItem}
        items={filteredMedia}
        onClose={() => setLightboxItem(null)}
        onNavigate={setLightboxItem}
      />
    </div>
  );
}
