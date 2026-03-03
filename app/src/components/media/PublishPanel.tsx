import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, ExternalLink, Send } from 'lucide-react';
import { toast } from 'sonner';
import type { ContentPost, ContentChannel } from '@/types';

const NETWORK_CONFIG: {
  channel: ContentChannel;
  label: string;
  color: string;
  icon: string;
  url: string;
  hashtagLimit?: number;
  charLimit?: number;
}[] = [
  { channel: 'ig-feed', label: 'Instagram Feed', color: 'bg-gradient-to-br from-purple-500 to-pink-500', icon: '📸', url: 'https://www.instagram.com/', charLimit: 2200, hashtagLimit: 30 },
  { channel: 'ig-reels', label: 'Instagram Reels', color: 'bg-gradient-to-br from-purple-600 to-orange-400', icon: '🎬', url: 'https://www.instagram.com/reels/', charLimit: 2200, hashtagLimit: 30 },
  { channel: 'ig-carrossel', label: 'Instagram Carrossel', color: 'bg-gradient-to-br from-pink-500 to-purple-500', icon: '🖼️', url: 'https://www.instagram.com/', charLimit: 2200, hashtagLimit: 30 },
  { channel: 'ig-stories', label: 'Instagram Stories', color: 'bg-gradient-to-br from-yellow-400 to-pink-500', icon: '⭕', url: 'https://www.instagram.com/', charLimit: 200 },
  { channel: 'linkedin', label: 'LinkedIn', color: 'bg-blue-700', icon: '💼', url: 'https://www.linkedin.com/feed/', charLimit: 3000 },
  { channel: 'threads', label: 'Threads', color: 'bg-zinc-900', icon: '🧵', url: 'https://www.threads.net/', charLimit: 500 },
  { channel: 'tiktok', label: 'TikTok', color: 'bg-zinc-900', icon: '🎵', url: 'https://www.tiktok.com/upload', charLimit: 2200, hashtagLimit: 10 },
  { channel: 'pinterest', label: 'Pinterest', color: 'bg-red-600', icon: '📌', url: 'https://www.pinterest.pt/', charLimit: 500 },
  { channel: 'youtube', label: 'YouTube', color: 'bg-red-500', icon: '▶️', url: 'https://studio.youtube.com/', charLimit: 5000 },
];

interface PublishPanelProps {
  post: ContentPost;
  onClose: () => void;
  onUpdate: (patch: Partial<ContentPost>) => void;
}

export function PublishPanel({ post, onClose, onUpdate }: PublishPanelProps) {
  const [copiedChannel, setCopiedChannel] = useState<ContentChannel | null>(null);
  const [editingChannel, setEditingChannel] = useState<ContentChannel | null>(null);
  const [draftText, setDraftText] = useState('');

  const publishedNetworks = post.publishedNetworks ?? [];
  const networkCaptions = post.networkCaptions ?? {};

  function getCaptionForChannel(ch: ContentChannel): string {
    if (networkCaptions[ch]) return networkCaptions[ch]!;
    return buildDefaultCaption(post, ch);
  }

  function buildDefaultCaption(p: ContentPost, ch: ContentChannel): string {
    const base = p.copyPt || '';
    const hashtags = p.hashtags?.length ? '\n\n' + p.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ') : '';
    const cta = p.cta ? `\n\n${p.cta}` : '';

    if (ch === 'linkedin') {
      return `${base}${cta}\n\n#arquitetura #design #interiores #portugal`.replace(/\n{3,}/g, '\n\n');
    }
    if (ch === 'ig-stories' || ch === 'threads') {
      return base.slice(0, 150);
    }
    return `${base}${cta}${hashtags}`;
  }

  async function copyToClipboard(ch: ContentChannel) {
    const text = getCaptionForChannel(ch);
    await navigator.clipboard.writeText(text);
    setCopiedChannel(ch);
    setTimeout(() => setCopiedChannel(null), 2000);
    toast.success(`Copiado para ${NETWORK_CONFIG.find((n) => n.channel === ch)?.label}`);
  }

  function openNetwork(ch: ContentChannel) {
    const cfg = NETWORK_CONFIG.find((n) => n.channel === ch);
    if (cfg) window.open(cfg.url, '_blank');
  }

  function markPublished(ch: ContentChannel) {
    const updated = publishedNetworks.includes(ch)
      ? publishedNetworks.filter((n) => n !== ch)
      : [...publishedNetworks, ch];
    onUpdate({ publishedNetworks: updated });
    if (!publishedNetworks.includes(ch)) toast.success(`Marcado como publicado em ${NETWORK_CONFIG.find((n) => n.channel === ch)?.label}`);
  }

  function startEdit(ch: ContentChannel) {
    setDraftText(getCaptionForChannel(ch));
    setEditingChannel(ch);
  }

  function saveEdit(ch: ContentChannel) {
    const updated = { ...networkCaptions, [ch]: draftText };
    onUpdate({ networkCaptions: updated });
    setEditingChannel(null);
    toast.success('Legenda guardada');
  }

  const allPublished = NETWORK_CONFIG.every((n) => publishedNetworks.includes(n.channel));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[92vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-base font-semibold">Publicar nas Redes</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {publishedNetworks.length}/{NETWORK_CONFIG.length} publicados
            </p>
          </div>
          <div className="flex items-center gap-2">
            {allPublished && (
              <span className="px-2 py-1 bg-emerald-500/15 text-emerald-600 rounded-lg text-xs font-medium">Tudo publicado</span>
            )}
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preview caption */}
        <div className="px-5 py-3 bg-muted/30 border-b border-border text-sm text-muted-foreground line-clamp-2 shrink-0">
          {post.copyPt?.slice(0, 120)}{(post.copyPt?.length ?? 0) > 120 ? '…' : ''}
        </div>

        {/* Network list */}
        <div className="overflow-y-auto flex-1 divide-y divide-border">
          {NETWORK_CONFIG.map((cfg) => {
            const caption = getCaptionForChannel(cfg.channel);
            const isPublished = publishedNetworks.includes(cfg.channel);
            const isCopied = copiedChannel === cfg.channel;
            const isEditing = editingChannel === cfg.channel;

            return (
              <div key={cfg.channel} className={`px-5 py-4 transition-colors ${isPublished ? 'bg-emerald-500/5' : ''}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-xl ${cfg.color} flex items-center justify-center text-base shrink-0`}>
                    {cfg.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{cfg.label}</p>
                    {cfg.charLimit && (
                      <p className={`text-[10px] ${caption.length > cfg.charLimit ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {caption.length}/{cfg.charLimit} chars
                      </p>
                    )}
                  </div>
                  {isPublished && (
                    <span className="text-[10px] font-medium text-emerald-600 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                      Publicado
                    </span>
                  )}
                </div>

                {/* Caption preview / edit */}
                {isEditing ? (
                  <div className="mb-2">
                    <textarea
                      value={draftText}
                      onChange={(e) => setDraftText(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => saveEdit(cfg.channel)}
                        className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingChannel(null)}
                        className="px-3 py-1.5 border border-border rounded-lg text-xs hover:bg-muted"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <p
                    className="text-xs text-muted-foreground bg-muted/40 rounded-xl px-3 py-2 line-clamp-2 cursor-pointer hover:bg-muted/60 transition-colors mb-2"
                    onClick={() => startEdit(cfg.channel)}
                    title="Clica para editar"
                  >
                    {caption}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(cfg.channel)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isCopied
                        ? 'bg-emerald-500/15 text-emerald-600'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {isCopied ? 'Copiado!' : 'Copiar'}
                  </button>
                  <button
                    onClick={() => openNetwork(cfg.channel)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-xs font-medium transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Abrir
                  </button>
                  <button
                    onClick={() => markPublished(cfg.channel)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ml-auto ${
                      isPublished
                        ? 'bg-emerald-500/15 text-emerald-600 hover:bg-red-500/10 hover:text-red-500'
                        : 'border border-border hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/30'
                    }`}
                    title={isPublished ? 'Clica para desmarcar' : 'Marcar como publicado'}
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isPublished ? 'Publicado' : 'Marcar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
