import { useState } from 'react';
import { X, Sparkles, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { suggestSmartCrop } from '@/services/ai';
import { applySmartCrop, downloadCollage, type CropRegion } from '@/utils/collageGenerator';
import type { MediaAsset } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  asset: MediaAsset;
}

function getImageSrc(asset: MediaAsset): string | null {
  if (asset.type === 'image' && (asset.src || asset.thumbnail)) return asset.src || asset.thumbnail || null;
  if (asset.type === 'video' && asset.thumbnail) return asset.thumbnail;
  return null;
}

export default function SmartCropDialog({ open, onClose, asset }: Props) {
  const [region, setRegion] = useState<CropRegion | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);

  const src = getImageSrc(asset);

  const handleAnalyze = async () => {
    if (!src) {
      toast.error('Imagem não disponível');
      return;
    }
    setAnalyzing(true);
    try {
      const result = await suggestSmartCrop(src);
      setRegion(result);
      toast.success('AI sugeriu a região de crop');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro na análise');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    if (!src || !region) {
      toast.error('Analisa primeiro com a AI');
      return;
    }
    setGenerating(true);
    try {
      const blob = await applySmartCrop(src, region);
      downloadCollage(blob, `smart-crop-${asset.name}-${Date.now()}.png`);
      toast.success('Imagem descarregada');
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao gerar');
    } finally {
      setGenerating(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">Smart Crop — vertical 9:16</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-sm text-muted-foreground">
            A AI analisa a imagem e sugere a melhor região para crop em formato vertical, preservando o elemento principal.
          </p>

          {src && (
            <div className="relative rounded-xl overflow-hidden bg-muted border border-border [&>img]:block">
              <img src={src} alt="" className="w-full h-auto max-h-64 object-contain" />
              {region && (
                <div
                  className="absolute border-2 border-primary bg-primary/20 pointer-events-none"
                  style={{
                    left: `${region.x * 100}%`,
                    top: `${region.y * 100}%`,
                    width: `${region.width * 100}%`,
                    height: `${region.height * 100}%`,
                  }}
                />
              )}
            </div>
          )}

          {region && (
            <p className="text-xs text-muted-foreground">
              Região sugerida: x={region.x.toFixed(2)} y={region.y.toFixed(2)} w={region.width.toFixed(2)} h={region.height.toFixed(2)}
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
            onClick={handleAnalyze}
            disabled={!src || analyzing}
            className="px-5 py-2.5 border border-primary text-primary rounded-xl font-medium hover:bg-primary/10 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {analyzing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> A analisar...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> AI sugere crop</>
            )}
          </button>
          <button
            onClick={handleGenerate}
            disabled={!region || generating}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
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
