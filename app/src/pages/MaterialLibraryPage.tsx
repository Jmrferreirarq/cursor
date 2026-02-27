import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Library, Search, Plus, Box, Layers, Palette, ExternalLink, X, Euro, Building2, Sparkles } from 'lucide-react';

interface Material {
  id: string;
  name: string;
  category: string;
  supplier: string;
  price: number;
  unit: string;
  description?: string;
  tags: string[];
  image?: string;
}

const categories = [
  { id: 'all', name: 'Todos', icon: Layers, color: 'from-slate-500/20 to-slate-500/5' },
  { id: 'flooring', name: 'Pavimentos', icon: Box, color: 'from-amber-500/20 to-amber-500/5' },
  { id: 'walls', name: 'Revestimentos', icon: Layers, color: 'from-blue-500/20 to-blue-500/5' },
  { id: 'finishes', name: 'Acabamentos', icon: Palette, color: 'from-purple-500/20 to-purple-500/5' },
  { id: 'fixtures', name: 'Louças', icon: Sparkles, color: 'from-emerald-500/20 to-emerald-500/5' },
];

const mockMaterials: Material[] = [
  { id: '1', name: 'Mármore Carrara', category: 'flooring', supplier: 'Stone Portugal', price: 89.90, unit: 'm²', description: 'Mármore italiano de primeira qualidade, ideal para pavimentos interiores de luxo.', tags: ['Natural', 'Luxo', 'Interior'] },
  { id: '2', name: 'Carvalho Natural', category: 'flooring', supplier: 'WoodTech', price: 45.50, unit: 'm²', description: 'Madeira maciça de carvalho europeu, acabamento mate.', tags: ['Madeira', 'Sustentável', 'Natural'] },
  { id: '3', name: 'Azulejo Metro', category: 'walls', supplier: 'Cerâmicas do Norte', price: 32.00, unit: 'm²', description: 'Azulejo cerâmico biselado, estilo vintage metropolitano.', tags: ['Cerâmico', 'Vintage', 'Cozinha'] },
  { id: '4', name: 'Microcimento Cinza', category: 'finishes', supplier: 'CimentArt', price: 65.00, unit: 'm²', description: 'Revestimento contínuo de alta resistência, sem juntas.', tags: ['Moderno', 'Minimalista', 'Resistente'] },
  { id: '5', name: 'Cimento Queimado', category: 'walls', supplier: 'DecoCimento', price: 28.50, unit: 'm²', description: 'Acabamento industrial autêntico para paredes e pisos.', tags: ['Industrial', 'Loft', 'Tendência'] },
  { id: '6', name: 'Granito Negro Zimbabwe', category: 'flooring', supplier: 'Stone Portugal', price: 120.00, unit: 'm²', description: 'Granito africano de tom negro profundo, alta durabilidade.', tags: ['Natural', 'Premium', 'Exterior'] },
  { id: '7', name: 'Porcelanato Calacatta', category: 'flooring', supplier: 'Porcelanosa', price: 75.00, unit: 'm²', description: 'Porcelânico que replica mármore Calacatta, grande formato.', tags: ['Cerâmico', 'Luxo', 'Fácil Manutenção'] },
  { id: '8', name: 'Tinta Mineral Kreidezeit', category: 'finishes', supplier: 'EcoBuild', price: 42.00, unit: 'L', description: 'Tinta natural à base de cal, respirável e ecológica.', tags: ['Ecológico', 'Natural', 'Saudável'] },
  { id: '9', name: 'Lavatório Duravit Vero', category: 'fixtures', supplier: 'Duravit', price: 450.00, unit: 'un', description: 'Design retangular minimalista, cerâmica de alta qualidade.', tags: ['Design', 'Premium', 'Alemão'] },
  { id: '10', name: 'Torneira Grohe Essence', category: 'fixtures', supplier: 'Grohe', price: 320.00, unit: 'un', description: 'Misturadora monocomando, acabamento cromado.', tags: ['Design', 'Qualidade', 'Alemão'] },
];

// Extrair todas as tags únicas
const allTags = Array.from(new Set(mockMaterials.flatMap((m) => m.tags))).sort();

export default function MaterialLibraryPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  const filteredMaterials = useMemo(() => {
    return mockMaterials.filter((material) => {
      const matchesCategory = activeCategory === 'all' || material.category === activeCategory;
      const matchesTag = !activeTag || material.tags.includes(activeTag);
      const matchesSearch = 
        material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesTag && matchesSearch;
    });
  }, [activeCategory, activeTag, searchQuery]);

  // Contagem por categoria
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: mockMaterials.length };
    mockMaterials.forEach((m) => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Tag counts
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const materialsInCategory = activeCategory === 'all' 
      ? mockMaterials 
      : mockMaterials.filter((m) => m.category === activeCategory);
    
    materialsInCategory.forEach((m) => {
      m.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return counts;
  }, [activeCategory]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

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
            <Library className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide uppercase">Especificações</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Biblioteca de Materiais</h1>
          <p className="text-muted-foreground mt-2">
            {mockMaterials.length} materiais catalogados
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors w-fit">
          <Plus className="w-4 h-4" />
          <span>Adicionar Material</span>
        </button>
      </motion.div>

      {/* Category Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
      >
        {categories.map((cat, index) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => {
              setActiveCategory(cat.id);
              setActiveTag(null);
            }}
            className={`relative p-4 rounded-xl border transition-all duration-200 text-left overflow-hidden group ${
              activeCategory === cat.id
                ? 'border-primary bg-primary/10'
                : 'border-border bg-card hover:border-primary/40'
            }`}
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
            
            <div className="relative">
              <cat.icon className={`w-5 h-5 mb-2 ${activeCategory === cat.id ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'} transition-colors`} />
              <p className={`font-medium text-sm ${activeCategory === cat.id ? 'text-primary' : ''}`}>{cat.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{categoryCounts[cat.id] || 0} itens</p>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="relative max-w-md"
      >
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Pesquisar materiais, fornecedores..."
          className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-sm"
        />
      </motion.div>

      {/* Tags */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        {Object.keys(tagCounts).sort().map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
              activeTag === tag
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {tag}
            <span className="ml-1 opacity-60">({tagCounts[tag]})</span>
          </button>
        ))}
      </motion.div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredMaterials.length} {filteredMaterials.length === 1 ? 'material' : 'materiais'}
          {activeTag && <span className="ml-1">com tag <strong>{activeTag}</strong></span>}
        </p>
        {(activeTag || searchQuery) && (
          <button
            onClick={() => {
              setActiveTag(null);
              setSearchQuery('');
            }}
            className="text-sm text-primary hover:text-primary/80"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Materials Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {filteredMaterials.map((material, index) => (
          <motion.article
            key={material.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => setSelectedMaterial(material)}
            className="group cursor-pointer bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-200"
          >
            {/* Image/Placeholder */}
            <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative overflow-hidden">
              {material.image ? (
                <img src={material.image} alt={material.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <Box className="w-12 h-12 text-muted-foreground/40 mx-auto mb-2 group-hover:text-primary/40 transition-colors" />
                  <span className="text-xs text-muted-foreground/60">{material.supplier}</span>
                </div>
              )}
              
              {/* Tags overlay */}
              <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
                {material.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[10px] font-medium bg-black/60 text-white/90 rounded backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1">
                    {material.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{material.supplier}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <span className="text-lg font-bold">{formatCurrency(material.price)}</span>
                <span className="text-xs text-muted-foreground">/{material.unit}</span>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredMaterials.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 px-6 rounded-xl border border-dashed border-border bg-muted/10"
        >
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <Library className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">Nenhum material encontrado</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Ajusta os filtros ou a pesquisa</p>
        </motion.div>
      )}

      {/* Material Detail Modal */}
      <AnimatePresence>
        {selectedMaterial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMaterial(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-card border border-border rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedMaterial(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Image */}
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                {selectedMaterial.image ? (
                  <img src={selectedMaterial.image} alt={selectedMaterial.name} className="w-full h-full object-cover" />
                ) : (
                  <Box className="w-16 h-16 text-muted-foreground/30" />
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {selectedMaterial.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-2xl font-bold mb-1">{selectedMaterial.name}</h2>
                
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Building2 className="w-4 h-4" />
                  <span>{selectedMaterial.supplier}</span>
                </div>

                {selectedMaterial.description && (
                  <p className="text-muted-foreground text-sm mb-6">
                    {selectedMaterial.description}
                  </p>
                )}

                {/* Price */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Euro className="w-5 h-5 text-muted-foreground" />
                    <span className="text-muted-foreground">Preço</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">{formatCurrency(selectedMaterial.price)}</span>
                    <span className="text-muted-foreground ml-1">/{selectedMaterial.unit}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
                    Adicionar ao Projeto
                  </button>
                  <button className="px-4 py-2.5 border border-border rounded-xl font-medium hover:bg-muted transition-colors flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Fornecedor
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
