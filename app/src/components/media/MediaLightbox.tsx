import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from 'lucide-react';
import type { MediaItem } from './MediaCard';

interface MediaLightboxProps {
  item: MediaItem | null;
  items?: MediaItem[];
  onClose: () => void;
  onNavigate?: (item: MediaItem) => void;
}

export function MediaLightbox({ item, items = [], onClose, onNavigate }: MediaLightboxProps) {
  const currentIndex = items.findIndex((i) => i.id === item?.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  const handlePrev = useCallback(() => {
    if (hasPrev && onNavigate) {
      onNavigate(items[currentIndex - 1]);
    }
  }, [hasPrev, currentIndex, items, onNavigate]);

  const handleNext = useCallback(() => {
    if (hasNext && onNavigate) {
      onNavigate(items[currentIndex + 1]);
    }
  }, [hasNext, currentIndex, items, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!item) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'ArrowRight':
          handleNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose, handlePrev, handleNext]);

  // Prevent body scroll when open
  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [item]);

  // Placeholder gradient
  const gradientColors = ['from-slate-800 to-slate-900', 'from-zinc-800 to-zinc-900'];
  const gradientIndex = (item?.name.length || 0) % gradientColors.length;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navigation - Previous */}
          {hasPrev && onNavigate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Navigation - Next */}
          {hasNext && onNavigate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Content */}
          <motion.div
            key={item.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              {item.src || item.thumbnail ? (
                <img
                  src={item.src || item.thumbnail}
                  alt={item.name}
                  className="max-w-[90vw] max-h-[75vh] object-contain"
                />
              ) : (
                <div className={`w-[600px] h-[400px] bg-gradient-to-br ${gradientColors[gradientIndex]} flex items-center justify-center rounded-lg`}>
                  <span className="text-8xl font-light text-white/10 select-none">
                    {item.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Info bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 flex items-center justify-between w-full max-w-2xl px-2"
            >
              <div>
                <h3 className="text-white font-medium text-lg">
                  {item.name.replace(/\.[^/.]+$/, '')}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  {item.project && (
                    <span className="text-white/60 text-sm">{item.project}</span>
                  )}
                  {item.tags.length > 0 && (
                    <div className="flex gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/70 bg-white/10 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {item.src && (
                  <a
                    href={item.src}
                    download={item.name}
                    onClick={(e) => e.stopPropagation()}
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>

            {/* Counter */}
            {items.length > 1 && (
              <div className="mt-3 text-white/40 text-sm">
                {currentIndex + 1} / {items.length}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MediaLightbox;
