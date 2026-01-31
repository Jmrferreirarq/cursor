import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Video, Upload, Folder, Grid, List, Search, Filter } from 'lucide-react';

const mockMedia = [
  { id: '1', name: 'Casa Douro - Exterior.jpg', type: 'image', size: '2.4 MB', date: '2024-01-15', folder: 'Projetos/Casa Douro' },
  { id: '2', name: 'Casa Douro - Interior.jpg', type: 'image', size: '1.8 MB', date: '2024-01-15', folder: 'Projetos/Casa Douro' },
  { id: '3', name: 'Apresentação Cliente.mp4', type: 'video', size: '45.2 MB', date: '2024-01-12', folder: 'Projetos/Escritório' },
  { id: '4', name: 'Logo FA-360.svg', type: 'image', size: '12 KB', date: '2024-01-10', folder: 'Branding' },
  { id: '5', name: 'Site Banner.jpg', type: 'image', size: '856 KB', date: '2024-01-08', folder: 'Marketing' },
];

const folders = [
  { id: '1', name: 'Projetos', count: 24 },
  { id: '2', name: 'Branding', count: 8 },
  { id: '3', name: 'Marketing', count: 15 },
  { id: '4', name: 'Documentos', count: 32 },
];

export default function MediaHubPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMedia = mockMedia.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.folder.toLowerCase().includes(searchQuery.toLowerCase())
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
            <Image className="w-4 h-4" />
            <span className="text-sm">Gestão de Media</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Media Hub</h1>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors w-fit">
          <Upload className="w-4 h-4" />
          <span>Upload</span>
        </button>
      </motion.div>

      {/* Folders */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {folders.map((folder, index) => (
          <motion.div
            key={folder.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card border border-border rounded-xl p-4 hover:border-muted-foreground/30 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
              <Folder className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-medium">{folder.name}</h3>
            <p className="text-sm text-muted-foreground">{folder.count} ficheiros</p>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar ficheiros..."
            className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-muted border border-border rounded-lg hover:bg-muted/80 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filtrar</span>
          </button>
          <div className="flex bg-muted border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/80'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/80'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMedia.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-muted-foreground/30 transition-colors cursor-pointer group"
            >
              <div className="aspect-square bg-muted flex items-center justify-center">
                {item.type === 'image' ? (
                  <Image className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
                ) : (
                  <Video className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.size}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-6 py-3 text-sm font-semibold text-muted-foreground">Nome</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-muted-foreground">Pasta</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-muted-foreground">Data</th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-muted-foreground">Tamanho</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedia.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      {item.type === 'image' ? (
                        <Image className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Video className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="text-sm">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-muted-foreground">{item.folder}</td>
                  <td className="px-6 py-3 text-sm">{new Date(item.date).toLocaleDateString('pt-PT')}</td>
                  <td className="px-6 py-3 text-right text-sm text-muted-foreground">{item.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredMedia.length === 0 && (
        <div className="text-center py-12">
          <Image className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhum ficheiro encontrado</p>
        </div>
      )}
    </div>
  );
}
