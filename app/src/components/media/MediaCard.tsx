import React from 'react';
import { motion } from 'framer-motion';
import { Play, Maximize2 } from 'lucide-react';

export interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video';
  src?: string; // URL da imagem/video
  thumbnail?: string;
  tags: string[];
  project?: string;
  date: string;
  size?: string;
}

interface MediaCardProps {
  item: MediaItem;
  index?: number;
  variant?: 'default' | 'featured' | 'compact';
  onTagClick?: (tag: string) => void;
  onOpenLightbox?: (item: MediaItem) => void;
}

export function MediaCard({ 
  item, 
  index = 0, 
  variant = 'default',
  onTagClick,
  onOpenLightbox 
}: MediaCardProps) {
  const aspectRatio = variant === 'featured' ? 'aspect-[4/3]' : variant === 'compact' ? 'aspect-square' : 'aspect-[3/4]';
  
  // Placeholder gradient baseado no nome do ficheiro (para demo)
  const gradientColors = [
    'from-slate-800 to-slate-900',
    'from-zinc-800 to-zinc-900',
    'from-stone-800 to-stone-900',
    'from-neutral-800 to-neutral-900',
  ];
  const gradientIndex = item.name.length % gradientColors.length;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative cursor-pointer"
      onClick={() => onOpenLightbox?.(item)}
    >
      {/* Imagem Container */}
      <div className={`relative ${aspectRatio} overflow-hidden rounded-lg bg-muted`}>
        {/* Imagem ou Placeholder */}
        {item.src || item.thumbnail ? (
          <img
            src={item.thumbnail || item.src}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientColors[gradientIndex]} flex items-center justify-center`}>
            <span className="text-4xl font-light text-white/20 select-none">
              {item.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Overlay escuro no hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Ícone de vídeo se aplicável */}
        {item.type === 'video' && (
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
        )}

        {/* Botão expandir no hover */}
        <button
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/20 hover:scale-110"
          onClick={(e) => {
            e.stopPropagation();
            onOpenLightbox?.(item);
          }}
        >
          <Maximize2 className="w-4 h-4 text-white" />
        </button>

        {/* Conteúdo no hover (bottom) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {item.tags.slice(0, 3).map((tag) => (
                <button
                  key={tag}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagClick?.(tag);
                  }}
                  className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/90 bg-white/15 backdrop-blur-sm rounded hover:bg-white/25 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info abaixo da imagem */}
      <div className="mt-3 space-y-1">
        <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {item.name.replace(/\.[^/.]+$/, '')}
        </h3>
        {item.project && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {item.project}
          </p>
        )}
      </div>
    </motion.article>
  );
}

// Variante Featured para destaque maior
export function MediaCardFeatured({ 
  item, 
  index = 0,
  onTagClick,
  onOpenLightbox 
}: MediaCardProps) {
  const gradientColors = [
    'from-slate-800 to-slate-900',
    'from-zinc-800 to-zinc-900',
  ];
  const gradientIndex = item.name.length % gradientColors.length;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative cursor-pointer col-span-2 row-span-2"
      onClick={() => onOpenLightbox?.(item)}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
        {item.src || item.thumbnail ? (
          <img
            src={item.thumbnail || item.src}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientColors[gradientIndex]} flex items-center justify-center`}>
            <span className="text-7xl font-light text-white/10 select-none">
              {item.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Vídeo badge */}
        {item.type === 'video' && (
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-5 h-5 text-white fill-white" />
          </div>
        )}

        {/* Conteúdo posicionado em baixo */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {item.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagClick?.(tag);
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-white bg-white/15 backdrop-blur-sm rounded-md hover:bg-white/25 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Título e projeto */}
          <h3 className="font-semibold text-xl text-white mb-1 group-hover:text-primary-foreground transition-colors">
            {item.name.replace(/\.[^/.]+$/, '')}
          </h3>
          {item.project && (
            <p className="text-sm text-white/70">
              {item.project}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default MediaCard;
