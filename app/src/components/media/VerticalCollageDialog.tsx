import { useState, useEffect } from 'react';
import { X, ImagePlus, ChevronUp, ChevronDown, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMedia } from '@/context/MediaContext';
import { generateVerticalCollage, downloadCollage } from '@/utils/collageGenerator';
import type { MediaAsset } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  currentAsset: MediaAsset;
}

function getImageSrc(asset: MediaAsset): string | null {
  if (asset.type === 'image' && (asset.src || asset.thumbnail)) return asset.src || asset.thumbnail || null;
  if (asset.type === 'video' && asset.thumbnail) return asset.thumbnail;
  return null;
}

export default function VerticalCollageDialog({ open, onClose, currentAsset }: Props) {
  const { assets } = useMedia();
  const [selected, setSelected] = useState<MediaAsset[]>([]);
  const [generating, setGenerating] = useState(false);

  const currentSrc = getImageSrc(currentAsset);
  const imageAssets = assets.filter((a) => getImageSrc(a) && a.id !== currentAsset.id);

  useEffect(() => {
    if (open && currentSrc) {
      setSelected([currentAsset]);
    }
  }, [open, currentAsset.id, currentSrc]);

  const addAsset = (asset: MediaAsset) => {
    if (selected.length >= 4) {
      toast.error('Máximo 4 imagens');
      return;
    }
    if (selected.some((s) => s.id === asset.id)) return;
    setSelected((prev) => [...prev, asset]);
  };

  const removeAsset = (id: string) => {
    setSelected((prev) => prev.filter((a) => a.id !== id));
  };

  const moveUp = (idx: number) => {
    if (idx <= 0) return;
    setSelected((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  };

  const moveDown = (idx: number) => {
    if (idx >= selected.length - 1) return;
    setSelected((prev) => {
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  };

  const handleGenerate = async () => {
    if (selected.length < 2) {
      toast.error('Seleciona pelo menos 2 imagens');
      return;
    }
    const srcs = selected.map((a) => getImageSrc(a)).filter(Boolean) as string[];
    if (srcs.length !== selected.length) {
      toast.error('Uma ou mais imagens não estão disponíveis');
      return;
    }
    setGenerating(true);
    try {
      const blob = await generateVerticalCollage(srcs);
      const name = currentAsset.projectId ? `collage-${currentAsset.name}` : 'vertical-collage';
      downloadCollage(blob, `${name}-${Date.now()}.png`);
      toast.success('Colagem descarregada');
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao gerar colagem');
    } finally {
      setGenerating(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">Criar vertical combinando</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-sm text-muted-foreground">
            Combina 2–4 imagens numa única imagem 9:16 (Stories, Reels, TikTok). A imagem atual está selecionada.
          </p>

          {/* Ordem das imagens */}
          <div>
            <label className="block text-sm font-medium mb-2">Ordem (arrasta mentalmente com ↑↓)</label>
            <div className="space-y-2">
              {selected.map((a, idx) => (
                <div
                  key={a.id}
                  className="flex items-center gap-2 p-2 rounded-xl border border-border bg-muted/30"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-muted">
                    <img
                      src={getImageSrc(a) ?? ''}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="flex-1 text-sm truncate">{a.name}</span>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="p-1.5 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(idx)}
                      disabled={idx === selected.length - 1}
                      className="p-1.5 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {selected.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAsset(a.id)}
                        className="p-1.5 rounded hover:bg-destructive/20 text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Adicionar mais */}
          {selected.length < 4 && imageAssets.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Adicionar imagens</label>
              <div className="flex flex-wrap gap-2">
                {imageAssets
                  .filter((a) => !selected.some((s) => s.id === a.id))
                  .slice(0, 8)
                  .map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => addAsset(a)}
                      className="flex items-center gap-2 p-2 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-muted">
                        <img
                          src={getImageSrc(a) ?? ''}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs truncate max-w-[100px]">{a.name}</span>
                      <ImagePlus className="w-4 h-4 text-primary shrink-0" />
                    </button>
                  ))}
              </div>
            </div>
          )}

          {imageAssets.length === 0 && selected.length === 1 && (
            <p className="text-sm text-amber-600">
              Não há outras imagens no Media Inbox. Faz upload de mais imagens do mesmo projeto para combinar.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-muted/20">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-border rounded-xl font-medium hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleGenerate}
            disabled={selected.length < 2 || generating}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {generating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> A gerar...</>
            ) : (
              <><Download className="w-4 h-4" /> Gerar e descarregar</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
