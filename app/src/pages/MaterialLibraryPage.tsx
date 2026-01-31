import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Library, Search, Plus, Tag, Filter, Box, Layers, Palette } from 'lucide-react';

const categories = [
  { id: 'all', name: 'Todos', icon: Layers },
  { id: 'flooring', name: 'Pavimentos', icon: Box },
  { id: 'walls', name: 'Revestimentos', icon: Layers },
  { id: 'finishes', name: 'Acabamentos', icon: Palette },
];

const mockMaterials = [
  { id: '1', name: 'Mármore Carrara', category: 'flooring', supplier: 'Stone Portugal', price: 89.90, unit: 'm²' },
  { id: '2', name: 'Carvalho Natural', category: 'flooring', supplier: 'WoodTech', price: 45.50, unit: 'm²' },
  { id: '3', name: 'Azulejo Metro', category: 'walls', supplier: 'Cerâmicas do Norte', price: 32.00, unit: 'm²' },
  { id: '4', name: 'Microcimento', category: 'finishes', supplier: 'CimentArt', price: 65.00, unit: 'm²' },
  { id: '5', name: 'Cimento Queimado', category: 'walls', supplier: 'DecoCimento', price: 28.50, unit: 'm²' },
];

export default function MaterialLibraryPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMaterials = mockMaterials.filter(
    (material) =>
      (activeCategory === 'all' || material.category === activeCategory) &&
      (material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.supplier.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Library className="w-4 h-4" />
            <span className="text-sm">Biblioteca de Materiais</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Material Library</h1>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors w-fit">
          <Plus className="w-4 h-4" />
          <span>Adicionar Material</span>
        </button>
      </motion.div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <cat.icon className="w-4 h-4" />
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Pesquisar materiais..."
          className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMaterials.map((material, index) => (
          <motion.div
            key={material.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card border border-border rounded-xl p-5 hover:border-muted-foreground/30 transition-colors cursor-pointer group"
          >
            <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
              <Box className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">{material.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">{material.supplier}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">
                {new Intl.NumberFormat('pt-PT', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(material.price)}
              </span>
              <span className="text-sm text-muted-foreground">/{material.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="text-center py-12">
          <Library className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhum material encontrado</p>
        </div>
      )}
    </div>
  );
}
