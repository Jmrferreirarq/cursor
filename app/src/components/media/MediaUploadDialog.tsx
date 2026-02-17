import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image, Video, AlertTriangle, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useData } from '@/context/DataContext';
import { useMedia } from '@/context/MediaContext';
import { hasApiKey, analyzeWithAI, aiResultToContentPack, classifyMediaWithAI, assessImageQuality } from '@/services/ai';
import { generateVideoThumbnail } from '@/utils/videoThumbnail';
import type { MediaType, MediaObjective, MediaStatus, MediaRestriction, MediaAsset, ContentFocus } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
}

const MEDIA_TYPES: { value: MediaType; label: string }[] = [
  { value: 'fotografia', label: 'Fotografia' },
  { value: 'render', label: 'Render' },
  { value: 'obra', label: 'Obra' },
  { value: 'processo', label: 'Processo' },
  { value: 'detalhe', label: 'Detalhe' },
  { value: 'pessoas', label: 'Pessoas' },
  { value: 'equipa', label: 'Equipa' },
  { value: 'before-after', label: 'Antes/Depois' },
  { value: 'outros', label: 'Outros' },
];

const CONTENT_FOCUS_OPTIONS: { value: ContentFocus; label: string }[] = [
  { value: 'trabalho', label: 'Trabalho' },
  { value: 'vida-social', label: 'Vida Social' },
  { value: 'ambos', label: 'Ambos' },
];

const OBJECTIVES: { value: MediaObjective; label: string }[] = [
  { value: 'atrair-clientes', label: 'Atrair Clientes' },
  { value: 'portfolio', label: 'Portfólio' },
  { value: 'recrutamento', label: 'Recrutamento' },
  { value: 'autoridade-tecnica', label: 'Autoridade Técnica' },
];

const RESTRICTIONS: { value: MediaRestriction; label: string; icon: string }[] = [
  { value: 'sem-rostos', label: 'Sem rostos', icon: '👤' },
  { value: 'sem-moradas', label: 'Sem moradas', icon: '📍' },
  { value: 'sem-marcas', label: 'Sem marcas', icon: '®️' },
  { value: 'sem-matriculas', label: 'Sem matrículas', icon: '🚗' },
];

export default function MediaUploadDialog({ open, onClose }: Props) {
  const { projects } = useData();
  const { addAsset, updateAsset, addContentPack } = useMedia();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [projectId, setProjectId] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>('obra');
  const [objective, setObjective] = useState<MediaObjective>('portfolio');
  const [contentFocus, setContentFocus] = useState<ContentFocus>('ambos');
  const [restrictions, setRestrictions] = useState<MediaRestriction[]>([]);
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [classifying, setClassifying] = useState(false);
  const [aiClassified, setAiClassified] = useState(false);
  const [aiMode, setAiMode] = useState<'full' | 'quality'>('full'); // full = copy+tags+quality, quality = só score
  const aiEnabled = hasApiKey();

  const toggleRestriction = (r: MediaRestriction) => {
    setRestrictions((prev) => prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]);
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setAiClassified(false);
    }
  };

  // Auto-classify first file with AI when files are selected
  useEffect(() => {
    if (!aiEnabled || files.length === 0) {
      setClassifying(false);
      return;
    }
    const file = files[0];
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    if (!isImage && !isVideo) {
      setClassifying(false);
      return;
    }

    let cancelled = false;
    setClassifying(true);

    (async () => {
      try {
        let base64 = '';
        if (isImage) {
          base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        } else {
          const src = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
          base64 = await generateVideoThumbnail(src);
        }
        if (cancelled) return;
        const result = await classifyMediaWithAI(base64);
        if (cancelled) return;
        setMediaType(result.mediaType);
        setObjective(result.objective);
        setContentFocus(result.contentFocus);
        setAiClassified(true);
        toast.success(`AI classificou: ${MEDIA_TYPES.find((t) => t.value === result.mediaType)?.label ?? result.mediaType} · ${CONTENT_FOCUS_OPTIONS.find((c) => c.value === result.contentFocus)?.label ?? result.contentFocus}`);
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : 'Erro na classificação';
          toast.error(msg);
        }
      } finally {
        if (!cancelled) setClassifying(false);
      }
    })();

    return () => { cancelled = true; };
  }, [aiEnabled, files]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleSubmit = async () => {
    if (files.length === 0) return;
    setUploading(true);

    const projectName = projectId ? projects.find((p) => p.id === projectId)?.name : undefined;

    for (const file of files) {
      const isVideo = file.type.startsWith('video/');
      const src = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      let thumbnail: string | undefined = isVideo ? undefined : src;
      if (isVideo) {
        try {
          thumbnail = await generateVideoThumbnail(src);
        } catch {
          // Fallback: sem thumbnail, o card mostra o ícone de vídeo
        }
      }

      const asset: MediaAsset = {
        id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name.replace(/\.[^.]+$/, ''),
        type: isVideo ? 'video' : 'image',
        src,
        thumbnail,
        projectId: projectId || undefined,
        mediaType,
        objective,
        contentFocus,
        status: 'por-classificar',
        restrictions,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        qualityScore: undefined,
        risks: [],
        uploadedAt: new Date().toISOString(),
        fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      };
      addAsset(asset);

      // Auto AI analysis if API key is configured
      const imgSrc = asset.src || asset.thumbnail;
      if (aiEnabled && imgSrc) {
        if (imgSrc) {
          try {
            if (aiMode === 'quality') {
              toast.info(`AI a avaliar qualidade "${asset.name}"...`);
              const result = await assessImageQuality(imgSrc);
              updateAsset(asset.id, { qualityScore: result.qualityScore, status: 'analisado' });
              toast.success(`"${asset.name}" — Qualidade: ${result.qualityScore}`);
            } else if (!isVideo) {
              toast.info(`AI a analisar "${asset.name}"...`);
              const result = await analyzeWithAI(asset, projectName);
              updateAsset(asset.id, {
                tags: result.tags,
                qualityScore: result.qualityScore,
                risks: result.risks,
                story: result.story,
                status: 'analisado',
              });
              const pack = aiResultToContentPack(asset.id, result);
              addContentPack(pack);
              toast.success(`"${asset.name}" — AI gerou ${result.copies.length} copies + ${result.tags.length} tags`);
            }
            // full analysis only for images; videos skip or use quality-only
          } catch (err) {
            const msg = err instanceof Error ? err.message : 'Erro na análise AI';
            toast.error(msg);
          }
        }
      }
    }

    // Reset and close
    setUploading(false);
    setFiles([]);
    setProjectId('');
        setMediaType('obra');
        setObjective('portfolio');
        setContentFocus('ambos');
        setRestrictions([]);
    setTags('');
    setAiClassified(false);
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold">Upload de Media</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFiles}
                className="hidden"
              />
              {files.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-primary">
                    {files[0].type.startsWith('video') ? <Video className="w-8 h-8" /> : <Image className="w-8 h-8" />}
                  </div>
                  <p className="font-medium">{files.length} ficheiro{files.length > 1 ? 's' : ''} selecionado{files.length > 1 ? 's' : ''}</p>
                  <p className="text-sm text-muted-foreground">{files.map((f) => f.name).join(', ')}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                  <p className="font-medium">Arrasta ficheiros ou clica para selecionar</p>
                  <p className="text-sm text-muted-foreground">Imagens e vídeos (JPG, PNG, MP4, MOV)</p>
                </div>
              )}
            </div>

            {/* Project */}
            <div>
              <label className="block text-sm font-medium mb-2">Projeto / Obra</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-border bg-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="">— Sem projeto associado —</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Media Type */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                Tipo *
                {aiClassified && (
                  <span className="text-xs font-normal text-emerald-600 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Sugerido pela AI
                  </span>
                )}
                {classifying && (
                  <span className="text-xs font-normal text-muted-foreground flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> A classificar...
                  </span>
                )}
              </label>
              <div className="flex flex-wrap gap-2">
                {MEDIA_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setMediaType(t.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      mediaType === t.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Objective */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Objetivo *
                {aiClassified && (
                  <span className="ml-2 text-xs font-normal text-emerald-600">(sugerido pela AI)</span>
                )}
              </label>
              <div className="flex flex-wrap gap-2">
                {OBJECTIVES.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setObjective(o.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      objective === o.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Focus — trabalho vs vida social */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Foco
                {aiClassified && (
                  <span className="ml-2 text-xs font-normal text-emerald-600">(sugerido pela AI)</span>
                )}
              </label>
              <p className="text-xs text-muted-foreground mb-2">Trabalho e vida social crescem juntos</p>
              <div className="flex flex-wrap gap-2">
                {CONTENT_FOCUS_OPTIONS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setContentFocus(c.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      contentFocus === c.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/40'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Restrictions */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Restrições
              </label>
              <div className="flex flex-wrap gap-2">
                {RESTRICTIONS.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => toggleRestriction(r.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      restrictions.includes(r.value)
                        ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                        : 'border-border bg-muted/30 text-muted-foreground hover:border-amber-500/40'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags (separadas por vírgula)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="betão, minimalista, moradia, exterior..."
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* AI Status */}
          {files.length > 0 && (
            <div className={`mx-6 mb-4 p-3 rounded-xl border space-y-2 ${aiEnabled ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
              <div className="flex items-center gap-3">
                <Sparkles className={`w-4 h-4 shrink-0 ${aiEnabled ? 'text-emerald-500' : 'text-amber-500'}`} />
                <p className="text-xs">
                  {aiEnabled
                    ? 'AI Copilot ativo — após upload, a AI processa automaticamente.'
                    : 'AI Copilot inativo — configura a API key nas definições para ativar análise automática.'}
                </p>
              </div>
              {aiEnabled && (
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setAiMode('full')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${aiMode === 'full' ? 'bg-primary/20 text-primary border border-primary/40' : 'bg-muted/50 text-muted-foreground border border-transparent hover:border-border'}`}
                  >
                    Análise completa
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiMode('quality')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${aiMode === 'quality' ? 'bg-primary/20 text-primary border border-primary/40' : 'bg-muted/50 text-muted-foreground border border-transparent hover:border-border'}`}
                  >
                    Só qualidade
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-muted/20">
            <button
              onClick={onClose}
              disabled={uploading}
              className="px-5 py-2.5 border border-border rounded-xl font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={files.length === 0 || uploading}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <><Loader2 className="w-4 h-4 inline mr-2 animate-spin" />AI a processar...</>
              ) : (
                <><Upload className="w-4 h-4 inline mr-2" />Upload {files.length > 0 ? `(${files.length})` : ''}{aiEnabled ? ' + AI' : ''}</>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
