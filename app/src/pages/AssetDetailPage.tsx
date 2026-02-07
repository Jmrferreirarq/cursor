import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Image, Video, Edit3, Save, Trash2, Send, RefreshCw,
  AlertTriangle, Shield, Star, Tag, Copy, Globe, Hash, Sparkles,
  Instagram, Linkedin, Youtube, MessageCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useMedia } from '@/context/MediaContext';
import { useData } from '@/context/DataContext';
import { analyzeAsset } from '@/services/analysis';
import { generateNarrative, generateRecycledContent } from '@/services/generators';
import type { MediaAsset, ContentPack, ContentCopy, ContentChannel, MediaStatus } from '@/types';

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

function generateCopyTemplates(asset: MediaAsset, projectName: string | undefined): ContentCopy[] {
  const name = asset.name;
  const proj = projectName || 'o nosso projeto';
  const tagStr = asset.tags.slice(0, 3).join(', ');

  const copies: ContentCopy[] = [
    { lang: 'pt', channel: 'ig-feed', text: `${name} — mais um capítulo de ${proj}. ${tagStr ? `#${asset.tags.join(' #')}` : ''}\n\nArquitetura com propósito. Cada detalhe conta.` },
    { lang: 'en', channel: 'ig-feed', text: `${name} — another chapter of ${proj}. ${tagStr ? `#${asset.tags.join(' #')}` : ''}\n\nArchitecture with purpose. Every detail matters.` },
    { lang: 'pt', channel: 'linkedin', text: `${name}\n\nEm ${proj}, cada decisão de projeto reflete o nosso compromisso com a excelência técnica e o conforto do utilizador.\n\n${tagStr ? `Palavras-chave: ${tagStr}` : ''}` },
    { lang: 'en', channel: 'linkedin', text: `${name}\n\nIn ${proj}, every design decision reflects our commitment to technical excellence and user comfort.\n\n${tagStr ? `Keywords: ${tagStr}` : ''}` },
    { lang: 'pt', channel: 'ig-stories', text: `📐 ${name}\n${proj}\n\nDesliza para saber mais →` },
    { lang: 'en', channel: 'ig-stories', text: `📐 ${name}\n${proj}\n\nSwipe to learn more →` },
    { lang: 'pt', channel: 'threads', text: `${name}.\n\nO tipo de detalhe que faz a diferença entre um projeto comum e um projeto que inspira.` },
    { lang: 'en', channel: 'threads', text: `${name}.\n\nThe kind of detail that makes the difference between an ordinary project and one that inspires.` },
  ];
  return copies;
}

export default function AssetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { assets, updateAsset, deleteAsset, contentPacks, addContentPack, addPost } = useMedia();
  const { projects } = useData();

  const asset = assets.find((a) => a.id === id);
  const projectName = asset?.projectId ? projects.find((p) => p.id === asset.projectId)?.name : undefined;
  const pack = contentPacks.find((cp) => cp.assetId === id);

  const [editingTags, setEditingTags] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'copy' | 'formats'>('info');

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
        { ratio: '1:1', label: 'Quadrado', description: 'IG Feed, LinkedIn' },
        { ratio: '4:5', label: 'Retrato', description: 'IG Feed' },
        { ratio: '9:16', label: 'Vertical', description: 'Stories, Reels, TikTok' },
        { ratio: '16:9', label: 'Paisagem', description: 'YouTube, LinkedIn' },
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
      status: 'idea',
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
              {asset.src ? (
                asset.type === 'video' ? (
                  <video src={asset.src} controls className="w-full h-full object-contain bg-black" />
                ) : (
                  <img src={asset.src} alt={asset.name} className="w-full h-full object-contain" />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {asset.type === 'video' ? <Video className="w-16 h-16 text-muted-foreground/30" /> : <Image className="w-16 h-16 text-muted-foreground/30" />}
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
                    {pack ? pack.copies.map((c, i) => {
                      const ch = CHANNEL_CONFIG[c.channel];
                      return (
                        <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase">{c.lang}</span>
                            <span className="text-xs text-muted-foreground">{ch?.label || c.channel}</span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{c.text}</p>
                          <button onClick={() => { navigator.clipboard.writeText(c.text); toast.success('Copiado'); }} className="mt-2 flex items-center gap-1 text-xs text-primary hover:underline">
                            <Copy className="w-3 h-3" /> Copiar
                          </button>
                        </div>
                      );
                    }) : (
                      <div className="text-center py-8">
                        <Sparkles className="w-8 h-8 mx-auto text-muted-foreground/40 mb-3" />
                        <p className="text-sm text-muted-foreground mb-4">Ainda não foram geradas copies para este asset.</p>
                        <button onClick={handleGenerateCopy} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90">
                          <Sparkles className="w-4 h-4" /> Gerar Copy PT/EN
                        </button>
                      </div>
                    )}
                    {pack && (
                      <div className="pt-4 border-t border-border space-y-2">
                        <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Hashtags</p><p className="text-sm">{pack.hashtags.join(' ')}</p></div>
                        <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">CTA</p><p className="text-sm">{pack.cta}</p></div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'formats' && (
                  <div className="grid grid-cols-2 gap-4">
                    {(pack?.formats || [
                      { ratio: '1:1', label: 'Quadrado', description: 'IG Feed, LinkedIn' },
                      { ratio: '4:5', label: 'Retrato', description: 'IG Feed' },
                      { ratio: '9:16', label: 'Vertical', description: 'Stories, Reels, TikTok' },
                      { ratio: '16:9', label: 'Paisagem', description: 'YouTube, LinkedIn' },
                    ]).map((f) => {
                      const [w, h] = f.ratio.split(':').map(Number);
                      const aspectH = Math.round((h / w) * 120);
                      return (
                        <div key={f.ratio} className="p-4 rounded-xl border border-border bg-muted/30 text-center">
                          <div className="mx-auto mb-3 rounded-lg bg-muted overflow-hidden" style={{ width: 120, height: Math.min(aspectH, 180) }}>
                            {asset.src && <img src={asset.src} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <p className="font-medium text-sm">{f.label}</p>
                          <p className="text-xs text-muted-foreground">{f.ratio}</p>
                          {f.description && <p className="text-[10px] text-muted-foreground mt-1">{f.description}</p>}
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
                const newPack: ContentPack = { id: `pack-recycle-${Date.now()}`, assetId: asset.id, copies: result.copies, hashtags: result.hashtags, cta: 'Saiba mais', formats: result.derivatives.map((d) => ({ ratio: d.ratio, label: d.format, description: d.descriptionPt })), generatorUsed: 'auto-recycle', createdAt: new Date().toISOString() };
                addContentPack(newPack);
                toast.success(`Reciclagem: ${result.derivatives.length} formatos gerados`);
                setActiveTab('formats');
              }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted/30 transition-colors text-left">
                <RefreshCw className="w-5 h-5 text-emerald-500" />
                <div><p className="text-sm font-medium">Reciclagem Inteligente</p><p className="text-[10px] text-muted-foreground">1 vídeo → 12 derivados</p></div>
              </button>
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
    </div>
  );
}
