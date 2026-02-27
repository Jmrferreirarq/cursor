import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Image, Video, Edit3, Save, Trash2, Send, RefreshCw,
  AlertTriangle, Shield, Star, Tag, Copy, Globe, Hash, Sparkles,
  Instagram, Linkedin, Youtube, MessageCircle, Eye, LayoutGrid, Crop,
} from 'lucide-react';
import { toast } from 'sonner';
import { useMedia } from '@/context/MediaContext';
import { useData } from '@/context/DataContext';
import { useVideoThumbnail } from '@/hooks/useVideoThumbnail';
import { AssetThumbnail } from '@/components/media/AssetThumbnail';
import VerticalCollageDialog from '@/components/media/VerticalCollageDialog';
import SmartCropDialog from '@/components/media/SmartCropDialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { analyzeAsset } from '@/services/analysis';
import { hasApiKey, assessImageQuality } from '@/services/ai';
import { imageUrlToPngBlob } from '@/lib/clipboardImage';
import { generateNarrative, generateRecycledContent } from '@/services/generators';
import type { MediaAsset, ContentPack, ContentCopy, ContentFormat, ContentChannel, MediaStatus } from '@/types';

const CHANNEL_CONFIG: Record<ContentChannel, { label: string; icon: typeof Instagram }> = {
  'ig-feed': { label: 'IG Feed', icon: Instagram },
  'ig-reels': { label: 'IG Reels', icon: Instagram },
  'ig-stories': { label: 'IG Stories', icon: Instagram },
  'ig-carrossel': { label: 'IG Carrossel', icon: Instagram },
  'linkedin': { label: 'LinkedIn', icon: Linkedin },
  'tiktok': { label: 'TikTok', icon: Video },
  'pinterest': { label: 'Pinterest', icon: Image },
  'youtube': { label: 'YouTube', icon: Youtube },
  'threads': { label: 'Threads', icon: MessageCircle },
};

const STATUS_LABELS: Record<MediaStatus, string> = {
  'rascunho': 'Rascunho',
  'por-classificar': 'Por Classificar',
  'analisado': 'Analisado',
  'pronto': 'Pronto',
  'publicado': 'Publicado',
};

function buildFullPost(copy: string, hashtags: string[], cta: string): string {
  const parts = [copy.trim()];
  if (hashtags.length > 0) parts.push('\n\n' + hashtags.join(' '));
  if (cta?.trim()) parts.push('\n\n' + cta.trim());
  return parts.join('');
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Copia post completo: imagem + PT + EN (sempre os três juntos) */
async function copyFullPostWithImage(
  copyPt: string,
  copyEn: string,
  hashtags: string[],
  cta: string,
  imgSrc: string | undefined,
  toastSuccess: (msg: string) => void
) {
  const fullPt = buildFullPost(copyPt, hashtags, cta);
  const fullEn = buildFullPost(copyEn, hashtags, cta);
  const fullText = `——— PT ———\n${fullPt}\n\n——— EN ———\n${fullEn}`;

  try {
    if (imgSrc) {
      const html = `<div style="font-family:sans-serif;max-width:600px">
        <img src="${imgSrc}" alt="" style="max-width:100%;height:auto;border-radius:8px;display:block;margin-bottom:16px" />
        <div style="margin-bottom:16px"><strong style="color:#666;font-size:11px">PT</strong><p style="white-space:pre-wrap;margin:4px 0 0;font-size:14px">${escapeHtml(fullPt)}</p></div>
        <div><strong style="color:#666;font-size:11px">EN</strong><p style="white-space:pre-wrap;margin:4px 0 0;font-size:14px">${escapeHtml(fullEn)}</p></div>
      </div>`;
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': new Blob([fullText], { type: 'text/plain' }),
          'text/html': new Blob([html], { type: 'text/html' }),
        }),
      ]);
      toastSuccess('Texto PT + EN copiado — cola em Word, Notion ou na legenda do WhatsApp');
    } else {
      await navigator.clipboard.writeText(fullText);
      toastSuccess('Post completo (PT + EN) copiado');
    }
  } catch {
    await navigator.clipboard.writeText(fullText);
    toastSuccess('Texto copiado (imagem não suportada neste browser)');
  }
}

function generateCopyTemplates(asset: MediaAsset, projectName: string | undefined): ContentCopy[] {
  const name = asset.name;
  const proj = projectName || 'o nosso projeto';
  const tagStr = asset.tags.slice(0, 3).join(', ');
  const hashtags = asset.tags.length ? asset.tags.map((t) => `#${t.replace(/\s/g, '')}`).join(' ') : '';

  const copies: ContentCopy[] = [
    // IG Feed (1:1, 4:5)
    { lang: 'pt', channel: 'ig-feed', text: `${name} — mais um capítulo de ${proj}. ${hashtags || `#render #arquitetura #design #portfólio`}\n\nArquitetura com propósito. Cada detalhe conta.` },
    { lang: 'en', channel: 'ig-feed', text: `${name} — another chapter of ${proj}. ${hashtags || `#render #architecture #design #portfolio`}\n\nArchitecture with purpose. Every detail matters.` },
    // LinkedIn (1:1, 16:9)
    { lang: 'pt', channel: 'linkedin', text: `${name}\n\nEm ${proj}, cada decisão de projeto reflete o nosso compromisso com a excelência técnica e o conforto do utilizador.\n\n${tagStr ? `Palavras-chave: ${tagStr}` : ''}` },
    { lang: 'en', channel: 'linkedin', text: `${name}\n\nIn ${proj}, every design decision reflects our commitment to technical excellence and user comfort.\n\n${tagStr ? `Keywords: ${tagStr}` : ''}` },
    // IG Stories (9:16)
    { lang: 'pt', channel: 'ig-stories', text: `📐 ${name}\n${proj}\n\nDesliza para saber mais →` },
    { lang: 'en', channel: 'ig-stories', text: `📐 ${name}\n${proj}\n\nSwipe to learn more →` },
    // IG Reels / TikTok (9:16)
    { lang: 'pt', channel: 'ig-reels', text: `${name} — ${proj} em destaque. ${hashtags || '#arquitetura #design'}\n\nArquitetura que inspira. ✨` },
    { lang: 'en', channel: 'ig-reels', text: `${name} — ${proj} in focus. ${hashtags || '#architecture #design'}\n\nArchitecture that inspires. ✨` },
    { lang: 'pt', channel: 'tiktok', text: `${name} 🏗️ ${proj}\n\nArquitetura com propósito. Cada detalhe conta. ${hashtags || '#arquitetura #fyp'}` },
    { lang: 'en', channel: 'tiktok', text: `${name} 🏗️ ${proj}\n\nArchitecture with purpose. Every detail matters. ${hashtags || '#architecture #fyp'}` },
    // YouTube (16:9)
    { lang: 'pt', channel: 'youtube', text: `${name} — ${proj}\n\nNeste vídeo mostramos como o design se integra no contexto. ${tagStr ? `Temas: ${tagStr}` : ''}\n\nArquitetura com propósito. Cada detalhe conta.` },
    { lang: 'en', channel: 'youtube', text: `${name} — ${proj}\n\nIn this video we show how design integrates into context. ${tagStr ? `Topics: ${tagStr}` : ''}\n\nArchitecture with purpose. Every detail matters.` },
    // Threads
    { lang: 'pt', channel: 'threads', text: `${name}.\n\nO tipo de detalhe que faz a diferença entre um projeto comum e um projeto que inspira.` },
    { lang: 'en', channel: 'threads', text: `${name}.\n\nThe kind of detail that makes the difference between an ordinary project and one that inspires.` },
  ];
  return copies;
}

export default function AssetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { assets, updateAsset, deleteAsset, contentPacks, addContentPack, updateContentPack, addPost } = useMedia();
  const { projects } = useData();

  const asset = assets.find((a) => a.id === id);
  const projectName = asset?.projectId ? projects.find((p) => p.id === asset.projectId)?.name : undefined;

  useVideoThumbnail(asset, updateAsset);
  const pack = contentPacks.find((cp) => cp.assetId === id);

  const [editingTags, setEditingTags] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'copy' | 'formats'>('info');
  const [editingFormatIdx, setEditingFormatIdx] = useState<number | null>(null);
  const [editDescPt, setEditDescPt] = useState('');
  const [editDescEn, setEditDescEn] = useState('');
  const [previewFormatIdx, setPreviewFormatIdx] = useState<number | null>(null);
  const [collageOpen, setCollageOpen] = useState(false);
  const [smartCropOpen, setSmartCropOpen] = useState(false);
  const [qualityLoading, setQualityLoading] = useState(false);

  if (!asset) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-semibold mb-2">Asset não encontrado</h2>
        <button onClick={() => navigate('/media')} className="text-primary hover:underline mt-4">Voltar ao Media Inbox</button>
      </div>
    );
  }

  const handleGenerateCopy = () => {
    const copies = generateCopyTemplates(asset, projectName);
    const newPack: ContentPack = {
      id: `pack-${Date.now()}`,
      assetId: asset.id,
      copies,
      hashtags: asset.tags.map((t) => `#${t.replace(/\s/g, '')}`),
      cta: 'Contacte-nos para saber mais',
      formats: [
        { ratio: '1:1', label: 'Quadrado', descriptionPt: 'IG Feed, LinkedIn', descriptionEn: 'IG Feed, LinkedIn', channel: 'ig-feed' },
        { ratio: '4:5', label: 'Retrato', descriptionPt: 'IG Feed', descriptionEn: 'IG Feed', channel: 'ig-feed' },
        { ratio: '9:16', label: 'Vertical', descriptionPt: 'Stories, Reels, TikTok', descriptionEn: 'Stories, Reels, TikTok', channel: 'ig-reels' },
        { ratio: '16:9', label: 'Paisagem', descriptionPt: 'YouTube, LinkedIn', descriptionEn: 'YouTube, LinkedIn', channel: 'youtube' },
      ],
      generatorUsed: 'auto-copy',
      createdAt: new Date().toISOString(),
    };
    addContentPack(newPack);
    updateAsset(asset.id, { status: 'analisado' });
    toast.success('Copy PT/EN gerada para todos os canais');
    setActiveTab('copy');
  };

  const handleSendToPlanner = () => {
    if (!pack) {
      toast.error('Gera a copy primeiro');
      return;
    }
    const ptCopy = pack.copies.find((c) => c.lang === 'pt' && c.channel === 'ig-feed');
    const enCopy = pack.copies.find((c) => c.lang === 'en' && c.channel === 'ig-feed');
    addPost({
      id: `post-${Date.now()}`,
      assetId: asset.id,
      contentPackId: pack.id,
      channel: 'ig-feed',
      format: '1:1',
      copyPt: ptCopy?.text || '',
      copyEn: enCopy?.text || '',
      hashtags: pack.hashtags,
      cta: pack.cta,
      status: 'inbox',
      createdAt: new Date().toISOString(),
    });
    updateAsset(asset.id, { status: 'pronto' });
    toast.success('Enviado para o Planner como ideia');
  };

  const handleSaveTags = () => {
    const newTags = tagInput.split(',').map((t) => t.trim()).filter(Boolean);
    updateAsset(asset.id, { tags: newTags });
    setEditingTags(false);
    toast.success('Tags atualizadas');
  };

  const handleDelete = () => {
    deleteAsset(asset.id);
    navigate('/media');
    toast.success('Asset eliminado');
  };

  const handleStatusChange = (status: MediaStatus) => {
    updateAsset(asset.id, { status });
    toast.success(`Estado alterado para ${STATUS_LABELS[status]}`);
  };

  const handleRemoveFormat = (idx: number) => {
    if (!pack) return;
    if (!window.confirm('Eliminar este formato?')) return;
    const next = pack.formats.filter((_, i) => i !== idx);
    updateContentPack(pack.id, { formats: next });
    setEditingFormatIdx(null);
    toast.success('Formato removido');
  };

  const handleStartEditFormat = (idx: number, f: ContentFormat) => {
    setEditingFormatIdx(idx);
    setEditDescPt(f.descriptionPt ?? f.description ?? '');
    setEditDescEn(f.descriptionEn ?? f.description ?? '');
  };

  const handleSaveFormatEdit = (idx: number) => {
    if (!pack) return;
    const next = pack.formats.map((f, i) => (i === idx ? { ...f, descriptionPt: editDescPt, descriptionEn: editDescEn } : f));
    updateContentPack(pack.id, { formats: next });
    setEditingFormatIdx(null);
    toast.success('Descrições atualizadas');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/media')} className="p-2 rounded-xl border border-border hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{asset.name}</h1>
            <p className="text-muted-foreground text-sm">{projectName || 'Sem projeto'} · {asset.mediaType} · {asset.fileSize || '—'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={asset.status}
            onChange={(e) => handleStatusChange(e.target.value as MediaStatus)}
            className="h-10 px-4 rounded-xl border border-border bg-muted/50 text-sm font-medium focus:border-primary focus:outline-none"
          >
            {Object.entries(STATUS_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
          <button onClick={handleGenerateCopy} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
            <Sparkles className="w-4 h-4" />
            Gerar Copy
          </button>
          <button onClick={handleSendToPlanner} className="inline-flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted transition-colors">
            <Send className="w-4 h-4" />
            Enviar para Planner
          </button>
          <button onClick={handleDelete} className="p-2.5 border border-destructive/50 text-destructive rounded-xl hover:bg-destructive/10 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="aspect-video bg-muted relative">
              {asset.type === 'video' ? (
                asset.src ? (
                  <video src={asset.src} controls className="w-full h-full object-contain bg-black" />
                ) : asset.thumbnail ? (
                  <img src={asset.thumbnail} alt={asset.name} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6 text-center">
                    <Video className="w-16 h-16 text-muted-foreground/30" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Vídeo indisponível</p>
                      <p className="text-xs text-muted-foreground/80 mt-1 max-w-xs">
                        O ficheiro foi removido do armazenamento (limite do browser). Elimina este asset e faz upload novamente.
                      </p>
                      <button
                        onClick={handleDelete}
                        className="mt-3 px-4 py-2 text-sm font-medium text-destructive border border-destructive/50 rounded-xl hover:bg-destructive/10 transition-colors"
                      >
                        Eliminar e fazer upload novo
                      </button>
                    </div>
                  </div>
                )
              ) : asset.src || asset.thumbnail ? (
                <img src={asset.thumbnail || asset.src} alt={asset.name} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image className="w-16 h-16 text-muted-foreground/30" />
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="border-t border-border">
              <div className="flex border-b border-border">
                {(['info', 'copy', 'formats'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {tab === 'info' ? 'Informação' : tab === 'copy' ? 'Copy PT/EN' : 'Formatos'}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'info' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Tipo</p><p className="font-medium">{asset.mediaType}</p></div>
                      <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Objetivo</p><p className="font-medium">{asset.objective}</p></div>
                      {asset.contentFocus && (
                        <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Foco</p><p className="font-medium">{asset.contentFocus === 'trabalho' ? 'Trabalho' : asset.contentFocus === 'vida-social' ? 'Vida Social' : 'Ambos'}</p></div>
                      )}
                      <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Upload</p><p className="font-medium">{new Date(asset.uploadedAt).toLocaleDateString('pt-PT')}</p></div>
                      <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Dimensões</p><p className="font-medium">{asset.dimensions ? `${asset.dimensions.width}×${asset.dimensions.height}` : '—'}</p></div>
                    </div>
                    {asset.restrictions.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-amber-500" />Restrições</p>
                        <div className="flex flex-wrap gap-2">{asset.restrictions.map((r) => <span key={r} className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-medium">{r}</span>)}</div>
                      </div>
                    )}
                    {asset.story && (
                      <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">História</p><p className="text-sm">{asset.story}</p></div>
                    )}
                    {asset.qualityScore != null && (
                      <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Score Qualidade</p>
                        <div className="flex items-center gap-2"><div className="flex-1 h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${asset.qualityScore}%` }} /></div><span className="text-sm font-semibold">{asset.qualityScore}</span></div>
                      </div>
                    )}
                    {asset.risks.length > 0 && (
                      <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1"><Shield className="w-3 h-3 text-red-500" />Riscos Detectados</p>
                        <div className="flex flex-wrap gap-2">{asset.risks.map((r) => <span key={r} className="px-3 py-1 rounded-lg bg-red-500/10 text-red-500 text-xs font-medium">{r}</span>)}</div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'copy' && (
                  <div className="space-y-4">
                    {pack ? (() => {
                      const byChannel = new Map<ContentChannel, { pt?: ContentCopy; en?: ContentCopy }>();
                      pack.copies.forEach((c) => {
                        const cur = byChannel.get(c.channel) ?? {};
                        if (c.lang === 'pt') cur.pt = c; else cur.en = c;
                        byChannel.set(c.channel, cur);
                      });
                      return (
                        <>
                          {Array.from(byChannel.entries()).map(([ch, { pt, en }]) => {
                            const config = CHANNEL_CONFIG[ch];
                            const Icon = config?.icon ?? Globe;
                            return (
                              <div key={ch} className="rounded-xl border border-border bg-muted/30 overflow-hidden">
                                <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b border-border">
                                  <Icon className="w-4 h-4 text-muted-foreground" />
                                  <span className="font-medium text-sm">{config?.label || ch}</span>
                                </div>
                                <div className="grid grid-cols-2 divide-x divide-border">
                                  <div className="p-4">
                                    <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
                                      <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase">PT</span>
                                      {pt && (
                                        <div className="flex gap-2">
                                          <button onClick={() => { navigator.clipboard.writeText(pt.text); toast.success('PT copiado'); }} className="flex items-center gap-1 text-xs text-primary hover:underline">
                                            <Copy className="w-3 h-3" /> Copiar
                                          </button>
                                          <button onClick={() => copyFullPostWithImage(pt.text, en?.text ?? '', pack.hashtags, pack.cta, asset.thumbnail || asset.src, (m) => toast.success(m))} className="flex items-center gap-1 text-xs text-primary hover:underline" title="Imagem + PT + EN (cola em Word, Notion, Gmail)">
                                            <Copy className="w-3 h-3" /> Post completo
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                    <p className="text-sm whitespace-pre-wrap">{pt?.text || '—'}</p>
                                  </div>
                                  <div className="p-4">
                                    <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
                                      <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase">EN</span>
                                      {en && (
                                        <div className="flex gap-2">
                                          <button onClick={() => { navigator.clipboard.writeText(en.text); toast.success('EN copied'); }} className="flex items-center gap-1 text-xs text-primary hover:underline">
                                            <Copy className="w-3 h-3" /> Copy
                                          </button>
                                          <button onClick={() => copyFullPostWithImage(pt?.text ?? '', en.text, pack.hashtags, pack.cta, asset.thumbnail || asset.src, (m) => toast.success(m))} className="flex items-center gap-1 text-xs text-primary hover:underline" title="Imagem + PT + EN (cola em Word, Notion, Gmail)">
                                            <Copy className="w-3 h-3" /> Full post
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                    <p className="text-sm whitespace-pre-wrap">{en?.text || '—'}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          <div className="pt-4 border-t border-border space-y-2">
                            <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Hashtags</p><p className="text-sm">{pack.hashtags.join(' ')}</p></div>
                            <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">CTA</p><p className="text-sm">{pack.cta}</p></div>
                          </div>
                        </>
                      );
                    })() : (
                      <div className="text-center py-8">
                        <Sparkles className="w-8 h-8 mx-auto text-muted-foreground/40 mb-3" />
                        <p className="text-sm text-muted-foreground mb-4">Ainda não foram geradas copies para este asset.</p>
                        <button onClick={handleGenerateCopy} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90">
                          <Sparkles className="w-4 h-4" /> Gerar Copy PT/EN
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'formats' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {(pack?.formats || [
                      { ratio: '1:1', label: 'Quadrado', descriptionPt: 'IG Feed, LinkedIn', descriptionEn: 'IG Feed, LinkedIn', channel: 'ig-feed' as ContentChannel },
                      { ratio: '4:5', label: 'Retrato', descriptionPt: 'IG Feed', descriptionEn: 'IG Feed', channel: 'ig-feed' as ContentChannel },
                      { ratio: '9:16', label: 'Vertical', descriptionPt: 'Stories, Reels, TikTok', descriptionEn: 'Stories, Reels, TikTok', channel: 'ig-reels' as ContentChannel },
                      { ratio: '16:9', label: 'Paisagem', descriptionPt: 'YouTube, LinkedIn', descriptionEn: 'YouTube, LinkedIn', channel: 'linkedin' as ContentChannel },
                    ]).map((f, idx) => {
                      const descPt = f.descriptionPt ?? f.description ?? '';
                      const descEn = f.descriptionEn ?? f.description ?? '';
                      const canEdit = !!pack;
                      const isEditing = editingFormatIdx === idx;
                      const ch = f.channel ?? 'ig-feed';
                      const copyPt = pack?.copies.find((c) => c.lang === 'pt' && c.channel === ch)?.text ?? pack?.copies.find((c) => c.lang === 'pt' && c.channel === 'ig-feed')?.text ?? '';
                      const copyEn = pack?.copies.find((c) => c.lang === 'en' && c.channel === ch)?.text ?? pack?.copies.find((c) => c.lang === 'en' && c.channel === 'ig-feed')?.text ?? '';
                      const openPreview = () => setPreviewFormatIdx(idx);
                      const cardChannelConfig = CHANNEL_CONFIG[ch];
                      const CardChannelIcon = cardChannelConfig?.icon ?? Globe;
                      return (
                        <div
                          key={`${f.ratio}-${f.label}-${idx}`}
                          className="group rounded-xl border border-border bg-muted/30 overflow-hidden relative hover:border-primary/50 transition-colors"
                        >
                          {/* Botão eliminar — só quando há pack */}
                          {canEdit && (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleRemoveFormat(idx); }}
                              className="absolute top-2 right-2 z-20 p-1.5 rounded-lg bg-black/50 hover:bg-destructive/80 text-white/80 hover:text-white transition-colors"
                              title="Eliminar formato"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          {/* Área clicável: thumbnail + botão Ver pré-visualização */}
                          <button
                            type="button"
                            onClick={openPreview}
                            className="w-full text-left block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-t-xl"
                          >
                            <div className="relative bg-muted overflow-hidden mx-auto max-h-[140px] w-full" style={{ aspectRatio: f.ratio.replace(':', '/') }}>
                              {asset.type === 'video' ? (
                                <AssetThumbnail asset={asset} className="w-full h-full object-cover" fallbackClassName="w-12 h-12 text-muted-foreground/40 absolute inset-0 m-auto" />
                              ) : (asset.thumbnail || asset.src) ? (
                                <img src={asset.thumbnail || asset.src} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }} />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Image className="w-12 h-12 text-muted-foreground/40" />
                                </div>
                              )}
                              <div className="absolute top-1 left-1 flex flex-col gap-0.5">
                                <span className="px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-medium flex items-center gap-0.5 w-fit">
                                  <CardChannelIcon className="w-2 h-2" />
                                  {cardChannelConfig?.label ?? ch}
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-medium w-fit">{f.ratio}</span>
                              </div>
                              <div className="absolute bottom-1 right-1 px-1.5 py-1 rounded-md bg-primary text-white flex items-center gap-1 text-[10px] font-medium hover:bg-primary/90 transition-colors">
                                <Eye className="w-3 h-3" /> Ver
                              </div>
                            </div>
                          </button>
                          {/* Textos PT + EN + Copiar + Editar */}
                          <div className="p-2 space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <p className="font-medium text-xs truncate">{f.label}</p>
                                <p className="text-[9px] text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                                  <CardChannelIcon className="w-2 h-2 shrink-0" />
                                  {cardChannelConfig?.label ?? ch}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={openPreview}
                                className="flex items-center gap-1 text-xs text-primary hover:underline font-medium shrink-0"
                              >
                                <Eye className="w-3.5 h-3.5" /> Ver
                              </button>
                            </div>
                            {isEditing && canEdit ? (
                              <div className="space-y-2">
                                <div>
                                  <label className="text-[10px] text-muted-foreground uppercase">PT</label>
                                  <input
                                    value={editDescPt}
                                    onChange={(e) => setEditDescPt(e.target.value)}
                                    className="w-full mt-0.5 px-2 py-1.5 text-xs bg-muted/50 border border-border rounded-lg focus:border-primary focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-muted-foreground uppercase">EN</label>
                                  <input
                                    value={editDescEn}
                                    onChange={(e) => setEditDescEn(e.target.value)}
                                    className="w-full mt-0.5 px-2 py-1.5 text-xs bg-muted/50 border border-border rounded-lg focus:border-primary focus:outline-none"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <button type="button" onClick={(e) => { e.stopPropagation(); setEditingFormatIdx(null); }} className="flex-1 py-1.5 text-xs font-medium rounded-lg border border-border hover:bg-muted">Cancelar</button>
                                  <button type="button" onClick={(e) => { e.stopPropagation(); handleSaveFormatEdit(idx); }} className="flex-1 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">Guardar</button>
                                </div>
                              </div>
                            ) : (descPt || descEn) ? (
                              <div className="space-y-1 text-[10px]">
                                {descPt && (
                                  <div className="flex items-start justify-between gap-1">
                                    <div className="min-w-0">
                                      <span className="text-muted-foreground font-medium">PT</span>
                                      <p className="text-foreground/90 mt-0.5 line-clamp-2">{descPt}</p>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                      <button type="button" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(descPt); toast.success('PT copiado'); }} className="p-1 rounded hover:bg-muted" title="Copiar PT"><Copy className="w-3 h-3" /></button>
                                      {canEdit && <button type="button" onClick={(e) => { e.stopPropagation(); handleStartEditFormat(idx, f); }} className="p-1 rounded hover:bg-muted" title="Editar"><Edit3 className="w-3 h-3" /></button>}
                                    </div>
                                  </div>
                                )}
                                {descEn && (
                                  <div className="flex items-start justify-between gap-1">
                                    <div className="min-w-0">
                                      <span className="text-muted-foreground font-medium">EN</span>
                                      <p className="text-foreground/90 mt-0.5 line-clamp-2">{descEn}</p>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                      <button type="button" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(descEn); toast.success('EN copied'); }} className="p-1 rounded hover:bg-muted" title="Copiar EN"><Copy className="w-3 h-3" /></button>
                                      {canEdit && !descPt && <button type="button" onClick={(e) => { e.stopPropagation(); handleStartEditFormat(idx, f); }} className="p-1 rounded hover:bg-muted" title="Editar"><Edit3 className="w-3 h-3" /></button>}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : canEdit ? (
                              <button type="button" onClick={(e) => { e.stopPropagation(); handleStartEditFormat(idx, f); }} className="flex items-center gap-1 text-xs text-primary hover:underline">
                                <Edit3 className="w-3 h-3" /> Adicionar descrições PT/EN
                              </button>
                            ) : null}
                            {/* Pré-visualização: copy PT/EN do post */}
                            {!isEditing && (copyPt || copyEn) && (
                              <div className="pt-2 border-t border-border space-y-1.5">
                                <div className="flex items-center gap-1.5">
                                  <CardChannelIcon className="w-3 h-3 text-primary" />
                                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{cardChannelConfig?.label ?? ch}</p>
                                </div>
                                <div className="space-y-1 text-[10px] max-h-20 overflow-y-auto">
                                  {copyPt && (
                                    <div className="flex gap-1.5">
                                      <span className="shrink-0 text-muted-foreground font-medium">PT</span>
                                      <p className="text-foreground/90 whitespace-pre-wrap flex-1 min-w-0 line-clamp-3">{copyPt}</p>
                                      <button type="button" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(copyPt); toast.success('PT copiado'); }} className="shrink-0 p-0.5 rounded hover:bg-muted" title="Copiar"><Copy className="w-2.5 h-2.5" /></button>
                                    </div>
                                  )}
                                  {copyEn && (
                                    <div className="flex gap-1.5">
                                      <span className="shrink-0 text-muted-foreground font-medium">EN</span>
                                      <p className="text-foreground/90 whitespace-pre-wrap flex-1 min-w-0 line-clamp-3">{copyEn}</p>
                                      <button type="button" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(copyEn); toast.success('EN copied'); }} className="shrink-0 p-0.5 rounded hover:bg-muted" title="Copiar"><Copy className="w-2.5 h-2.5" /></button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          {/* Tags */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm flex items-center gap-2"><Tag className="w-4 h-4" /> Tags</h3>
              <button onClick={() => { setEditingTags(!editingTags); setTagInput(asset.tags.join(', ')); }} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                {editingTags ? <Save className="w-4 h-4 text-primary" onClick={handleSaveTags} /> : <Edit3 className="w-4 h-4 text-muted-foreground" />}
              </button>
            </div>
            {editingTags ? (
              <div className="space-y-2">
                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="betão, minimalista, exterior..." className="w-full px-3 py-2 text-sm bg-muted/50 border border-border rounded-lg focus:border-primary focus:outline-none" />
                <button onClick={handleSaveTags} className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Guardar</button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {asset.tags.length > 0 ? asset.tags.map((t) => <span key={t} className="px-2.5 py-1 rounded-lg bg-muted text-xs font-medium">{t}</span>) : <p className="text-sm text-muted-foreground">Sem tags</p>}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-2">
            <h3 className="font-semibold text-sm mb-3">Ações Rápidas</h3>
            <button onClick={() => {
              const result = analyzeAsset(asset);
              updateAsset(asset.id, { tags: result.tags, qualityScore: result.qualityScore, risks: result.risks, story: result.story, status: 'analisado' });
              toast.success('Análise concluída');
            }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted/30 transition-colors text-left">
              <RefreshCw className="w-5 h-5 text-primary" />
              <div><p className="text-sm font-medium">Gerar Análise</p><p className="text-[10px] text-muted-foreground">Tags, score, riscos e história</p></div>
            </button>
            {(asset.src || asset.thumbnail) && (
              <button
                onClick={async () => {
                  if (!hasApiKey()) { toast.error('Configura a API key nas Definições'); return; }
                  const src = asset.type === 'image' ? (asset.src || asset.thumbnail) : asset.thumbnail;
                  if (!src) { toast.error('Imagem não disponível'); return; }
                  setQualityLoading(true);
                  try {
                    const result = await assessImageQuality(src);
                    updateAsset(asset.id, { qualityScore: result.qualityScore });
                    if (result.suggestions.length > 0) {
                      toast.success(`Qualidade: ${result.qualityScore} — ${result.suggestions[0]}`);
                    } else {
                      toast.success(`Qualidade avaliada: ${result.qualityScore}`);
                    }
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : 'Erro na avaliação');
                  } finally {
                    setQualityLoading(false);
                  }
                }}
                disabled={qualityLoading}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted/30 transition-colors text-left disabled:opacity-50"
              >
                {qualityLoading ? <RefreshCw className="w-5 h-5 text-primary animate-spin" /> : <Shield className="w-5 h-5 text-primary" />}
                <div><p className="text-sm font-medium">Avaliar qualidade</p><p className="text-[10px] text-muted-foreground">AI: composição, iluminação, nitidez</p></div>
              </button>
            )}
            <button onClick={handleGenerateCopy} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted/30 transition-colors text-left">
              <Sparkles className="w-5 h-5 text-primary" />
              <div><p className="text-sm font-medium">Gerar Copy</p><p className="text-[10px] text-muted-foreground">PT + EN para todos os canais</p></div>
            </button>
            {(asset.mediaType === 'obra' || asset.mediaType === 'before-after') && (
              <button onClick={() => {
                const result = generateNarrative({ asset, projectName });
                const newPack: ContentPack = { id: `pack-narr-${Date.now()}`, assetId: asset.id, copies: result.copies, hashtags: result.hashtags, cta: 'Contacte-nos', formats: [], generatorUsed: 'auto-narrative', createdAt: new Date().toISOString() };
                addContentPack(newPack);
                toast.success('Narrativa de obra gerada');
                setActiveTab('copy');
              }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted/30 transition-colors text-left">
                <Star className="w-5 h-5 text-amber-500" />
                <div><p className="text-sm font-medium">Narrativa de Obra</p><p className="text-[10px] text-muted-foreground">Timeline Problema→Resultado</p></div>
              </button>
            )}
            {asset.type === 'video' && (
              <button onClick={() => {
                const result = generateRecycledContent({ asset, projectName });
                const newPack: ContentPack = { id: `pack-recycle-${Date.now()}`, assetId: asset.id, copies: result.copies, hashtags: result.hashtags, cta: 'Saiba mais', formats: result.derivatives.map((d) => ({ ratio: d.ratio, label: d.format, descriptionPt: d.descriptionPt, descriptionEn: d.descriptionEn, channel: d.channel })), generatorUsed: 'auto-recycle', createdAt: new Date().toISOString() };
                addContentPack(newPack);
                toast.success(`Reciclagem: ${result.derivatives.length} formatos gerados`);
                setActiveTab('formats');
              }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted/30 transition-colors text-left">
                <RefreshCw className="w-5 h-5 text-emerald-500" />
                <div><p className="text-sm font-medium">Reciclagem Inteligente</p><p className="text-[10px] text-muted-foreground">1 vídeo → 12 derivados</p></div>
              </button>
            )}
            {(asset.type === 'image' || asset.thumbnail) && (
              <>
                <button onClick={() => setCollageOpen(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted/30 transition-colors text-left">
                  <LayoutGrid className="w-5 h-5 text-primary" />
                  <div><p className="text-sm font-medium">Criar vertical combinando</p><p className="text-[10px] text-muted-foreground">2–4 imagens em 9:16 sem cortes</p></div>
                </button>
                <button onClick={() => setSmartCropOpen(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted/30 transition-colors text-left">
                  <Crop className="w-5 h-5 text-primary" />
                  <div><p className="text-sm font-medium">Smart Crop</p><p className="text-[10px] text-muted-foreground">AI sugere a melhor região para 9:16</p></div>
                </button>
              </>
            )}
            <button onClick={handleSendToPlanner} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted/30 transition-colors text-left">
              <Send className="w-5 h-5 text-primary" />
              <div><p className="text-sm font-medium">Enviar para Planner</p><p className="text-[10px] text-muted-foreground">Criar post como ideia</p></div>
            </button>
          </div>

          {/* Metadata */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-sm mb-3">Metadados</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">ID</span><span className="font-mono text-xs">{asset.id.slice(0, 16)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tipo ficheiro</span><span>{asset.type}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tamanho</span><span>{asset.fileSize || '—'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Upload</span><span>{new Date(asset.uploadedAt).toLocaleDateString('pt-PT')}</span></div>
            </div>
          </div>
        </motion.div>
      </div>

      <VerticalCollageDialog open={collageOpen} onClose={() => setCollageOpen(false)} currentAsset={asset} />
      <SmartCropDialog open={smartCropOpen} onClose={() => setSmartCropOpen(false)} asset={asset} />

      {/* Sheet de pré-visualização completa ao clicar no card */}
      <Sheet open={previewFormatIdx != null} onOpenChange={(open) => !open && setPreviewFormatIdx(null)}>
        <SheetContent side="right" className="w-full sm:max-w-sm overflow-y-auto p-4">
          {previewFormatIdx != null && (() => {
            const formatsList = pack?.formats || [
              { ratio: '1:1', label: 'Quadrado', descriptionPt: 'IG Feed, LinkedIn', descriptionEn: 'IG Feed, LinkedIn', channel: 'ig-feed' as ContentChannel },
              { ratio: '4:5', label: 'Retrato', descriptionPt: 'IG Feed', descriptionEn: 'IG Feed', channel: 'ig-feed' as ContentChannel },
              { ratio: '9:16', label: 'Vertical', descriptionPt: 'Stories, Reels, TikTok', descriptionEn: 'Stories, Reels, TikTok', channel: 'ig-reels' as ContentChannel },
              { ratio: '16:9', label: 'Paisagem', descriptionPt: 'YouTube, LinkedIn', descriptionEn: 'YouTube, LinkedIn', channel: 'linkedin' as ContentChannel },
            ];
            const f = formatsList[previewFormatIdx];
            if (!f) return null;
            const ch = f.channel ?? 'ig-feed';
            const copyPt = pack?.copies.find((c) => c.lang === 'pt' && c.channel === ch)?.text ?? pack?.copies.find((c) => c.lang === 'pt' && c.channel === 'ig-feed')?.text ?? '';
            const copyEn = pack?.copies.find((c) => c.lang === 'en' && c.channel === ch)?.text ?? pack?.copies.find((c) => c.lang === 'en' && c.channel === 'ig-feed')?.text ?? '';
            const descPt = f.descriptionPt ?? f.description ?? '';
            const descEn = f.descriptionEn ?? f.description ?? '';
            const [rw, rh] = f.ratio.split(':').map(Number);
            const isVertical = rh > rw;
            const imgMaxHeight = isVertical ? 180 : 120;
            const imgMaxWidth = isVertical ? 110 : 200;
            const channelConfig = CHANNEL_CONFIG[ch];
            const ChannelIcon = channelConfig?.icon ?? Globe;
            return (
              <div className="space-y-3 pb-4">
                {/* Rede social em destaque */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/60 border border-border">
                  <ChannelIcon className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="text-xs font-semibold">{channelConfig?.label ?? ch}</p>
                    <p className="text-[10px] text-muted-foreground">{f.label} · {f.ratio}</p>
                  </div>
                </div>
                {/* Imagem compacta — simula post no telemóvel */}
                <div
                  className="mx-auto rounded-lg overflow-hidden bg-muted border border-border flex items-center justify-center"
                  style={{
                    aspectRatio: f.ratio.replace(':', '/'),
                    maxHeight: imgMaxHeight,
                    maxWidth: imgMaxWidth,
                    width: '100%',
                  }}
                >
                  {asset.type === 'video' ? (
                    <AssetThumbnail asset={asset} className="w-full h-full object-contain" fallbackClassName="w-12 h-12 text-muted-foreground/40" />
                  ) : (asset.thumbnail || asset.src) ? (
                    <img src={asset.thumbnail || asset.src} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full min-h-[160px] flex items-center justify-center">
                      <Image className="w-12 h-12 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                {/* Descrição (1 linha) */}
                {(descPt || descEn) && (
                  <p className="text-[10px] text-muted-foreground">{descPt || descEn}</p>
                )}
                {/* Texto do post */}
                <div className="space-y-1.5">
                  {(copyPt || copyEn) ? (
                    <div className="space-y-2">
                      {copyPt && (
                        <div className="p-2 rounded-md bg-muted/40 border border-border">
                          <div className="flex items-center justify-between mb-1 gap-2">
                            <span className="text-[10px] font-medium text-primary">PT</span>
                            <div className="flex flex-wrap gap-1.5">
                              <button type="button" onClick={() => { navigator.clipboard.writeText(copyPt); toast.success('PT copiado'); }} className="text-[10px] text-primary hover:underline">Copiar</button>
                              <button type="button" onClick={() => copyFullPostWithImage(copyPt, copyEn, pack?.hashtags ?? [], pack?.cta ?? '', asset.thumbnail || asset.src, (m) => toast.success(m))} className="text-[10px] text-primary hover:underline">Post completo</button>
                              <button type="button" onClick={async () => {
                                const imgSrc = asset.thumbnail || asset.src;
                                if (!imgSrc) { toast.error('Sem imagem'); return; }
                                try {
                                  const blob = await imageUrlToPngBlob(imgSrc);
                                  if (blob) { await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); toast.success('Imagem copiada'); }
                                  else toast.error('Não foi possível copiar');
                                } catch { toast.error('Não foi possível copiar'); }
                              }} className="text-[10px] text-primary hover:underline">Imagem</button>
                            </div>
                          </div>
                          <p className="text-[11px] whitespace-pre-wrap leading-snug line-clamp-4">{copyPt}</p>
                        </div>
                      )}
                      {copyEn && (
                        <div className="p-2 rounded-md bg-muted/40 border border-border">
                          <div className="flex items-center justify-between mb-1 gap-2">
                            <span className="text-[10px] font-medium text-primary">EN</span>
                            <div className="flex gap-1.5">
                              <button type="button" onClick={() => { navigator.clipboard.writeText(copyEn); toast.success('EN copied'); }} className="text-[10px] text-primary hover:underline">Copy</button>
                              <button type="button" onClick={() => copyFullPostWithImage(copyPt, copyEn, pack?.hashtags ?? [], pack?.cta ?? '', asset.thumbnail || asset.src, (m) => toast.success(m))} className="text-[10px] text-primary hover:underline">Full post</button>
                            </div>
                          </div>
                          <p className="text-[11px] whitespace-pre-wrap leading-snug line-clamp-4">{copyEn}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-[10px] text-muted-foreground">Gera a copy primeiro.</p>
                  )}
                </div>
              </div>
            );
          })()}
        </SheetContent>
      </Sheet>
    </div>
  );
}
