import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image, Video, AlertTriangle } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useMedia } from '@/context/MediaContext';
import type { MediaType, MediaObjective, MediaStatus, MediaRestriction, MediaAsset } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
}

const MEDIA_TYPES: { value: MediaType; label: string }[] = [
  { value: 'obra', label: 'Obra' },
  { value: 'render', label: 'Render' },
  { value: 'detalhe', label: 'Detalhe' },
  { value: 'equipa', label: 'Equipa' },
  { value: 'before-after', label: 'Antes/Depois' },
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
  const { addAsset } = useMedia();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [projectId, setProjectId] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>('obra');
  const [objective, setObjective] = useState<MediaObjective>('portfolio');
  const [restrictions, setRestrictions] = useState<MediaRestriction[]>([]);
  const [tags, setTags] = useState('');

  const toggleRestriction = (r: MediaRestriction) => {
    setRestrictions((prev) => prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]);
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleSubmit = () => {
    if (files.length === 0) return;

    files.forEach((file) => {
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();
      reader.onload = () => {
        const src = reader.result as string;
        const asset: MediaAsset = {
          id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name.replace(/\.[^.]+$/, ''),
          type: isVideo ? 'video' : 'image',
          src,
          thumbnail: isVideo ? undefined : src,
          projectId: projectId || undefined,
          mediaType,
          objective,
          status: 'por-classificar',
          restrictions,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
          qualityScore: undefined,
          risks: [],
          uploadedAt: new Date().toISOString(),
          fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        };
        addAsset(asset);
      };
      reader.readAsDataURL(file);
    });

    // Reset and close
    setFiles([]);
    setProjectId('');
    setMediaType('obra');
    setObjective('portfolio');
    setRestrictions([]);
    setTags('');
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
              <label className="block text-sm font-medium mb-2">Tipo *</label>
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
              <label className="block text-sm font-medium mb-2">Objetivo *</label>
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

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-muted/20">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-border rounded-xl font-medium hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={files.length === 0}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Upload {files.length > 0 ? `(${files.length})` : ''}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
