import React from 'react';
import { motion } from 'framer-motion';

interface MediaTagsProps {
  tags: string[];
  activeTag?: string | null;
  onTagClick: (tag: string | null) => void;
  counts?: Record<string, number>;
}

export function MediaTags({ tags, activeTag, onTagClick, counts }: MediaTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Botão "Todos" */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onTagClick(null)}
        className={`
          px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
          ${!activeTag 
            ? 'bg-primary text-primary-foreground shadow-sm' 
            : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
          }
        `}
      >
        Todos
        {counts && (
          <span className="ml-1.5 text-xs opacity-70">
            ({Object.values(counts).reduce((a, b) => a + b, 0)})
          </span>
        )}
      </motion.button>

      {/* Tags individuais */}
      {tags.map((tag, index) => (
        <motion.button
          key={tag}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.03 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onTagClick(tag)}
          className={`
            px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
            ${activeTag === tag 
              ? 'bg-primary text-primary-foreground shadow-sm' 
              : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }
          `}
        >
          {tag}
          {counts?.[tag] !== undefined && (
            <span className="ml-1.5 text-xs opacity-70">
              ({counts[tag]})
            </span>
          )}
        </motion.button>
      ))}
    </div>
  );
}

// Variante mais compacta para filtros inline
export function MediaTagsCompact({ tags, activeTag, onTagClick }: Omit<MediaTagsProps, 'counts'>) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        onClick={() => onTagClick(null)}
        className={`
          px-3 py-1.5 text-xs font-medium uppercase tracking-wide rounded-md transition-all duration-200
          ${!activeTag 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          }
        `}
      >
        Todos
      </button>

      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagClick(tag)}
          className={`
            px-3 py-1.5 text-xs font-medium uppercase tracking-wide rounded-md transition-all duration-200
            ${activeTag === tag 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            }
          `}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

export default MediaTags;
