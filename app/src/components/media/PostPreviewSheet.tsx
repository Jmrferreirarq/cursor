import { useState } from 'react';
import { Copy, Send, Image, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import type { ContentPost, ContentChannel } from '@/types';

// ── Network config ──────────────────────────────────────────────────
const NETWORKS: {
  channel: ContentChannel;
  label: string;
  shortLabel: string;
  gradient: string;
  icon: string;
  charLimit: number;
  hashtagLimit?: number;
  profileName: string;
  handle: string;
  url: string;
}[] = [
  { channel: 'ig-feed',      label: 'Instagram Feed',     shortLabel: 'IG Feed',   gradient: 'from-purple-500 via-pink-500 to-orange-400', icon: '📸', charLimit: 2200, hashtagLimit: 30, profileName: 'Ferreira Arquitetos', handle: '@ferreirarquitetos', url: 'https://www.instagram.com/ferreirarquitetos/' },
  { channel: 'ig-reels',     label: 'Instagram Reels',    shortLabel: 'Reels',     gradient: 'from-purple-600 to-orange-400',              icon: '🎬', charLimit: 2200, hashtagLimit: 30, profileName: 'Ferreira Arquitetos', handle: '@ferreirarquitetos', url: 'https://www.instagram.com/ferreirarquitetos/' },
  { channel: 'ig-carrossel', label: 'Instagram Carrossel',shortLabel: 'Carrossel', gradient: 'from-pink-500 to-purple-600',                icon: '🖼️', charLimit: 2200, hashtagLimit: 30, profileName: 'Ferreira Arquitetos', handle: '@ferreirarquitetos', url: 'https://www.instagram.com/ferreirarquitetos/' },
  { channel: 'ig-stories',   label: 'Instagram Stories',  shortLabel: 'Stories',   gradient: 'from-yellow-400 to-pink-600',                icon: '⭕', charLimit: 200,  profileName: 'Ferreira Arquitetos', handle: '@ferreirarquitetos', url: 'https://www.instagram.com/ferreirarquitetos/' },
  { channel: 'linkedin',     label: 'LinkedIn',           shortLabel: 'LinkedIn',  gradient: 'from-blue-700 to-blue-500',                  icon: '💼', charLimit: 3000, profileName: 'José Ferreira Rebelo', handle: 'Arquiteto · Ferreira Arquitetos', url: 'https://www.linkedin.com/feed/' },
  { channel: 'threads',      label: 'Threads',            shortLabel: 'Threads',   gradient: 'from-zinc-800 to-zinc-600',                  icon: '🧵', charLimit: 500,  profileName: 'Ferreira Arquitetos', handle: '@ferreirarquitetos', url: 'https://www.threads.net/' },
  { channel: 'tiktok',       label: 'TikTok',             shortLabel: 'TikTok',    gradient: 'from-zinc-900 to-pink-600',                  icon: '🎵', charLimit: 2200, hashtagLimit: 10, profileName: 'ferreirarquitetos', handle: '@ferreirarquitetos', url: 'https://www.tiktok.com/upload' },
  { channel: 'pinterest',    label: 'Pinterest',          shortLabel: 'Pinterest', gradient: 'from-red-600 to-red-400',                    icon: '📌', charLimit: 500,  profileName: 'Ferreira Arquitetos', handle: 'jmferreirarq', url: 'https://pt.pinterest.com/jmferreirarq/' },
  { channel: 'youtube',      label: 'YouTube',            shortLabel: 'YouTube',   gradient: 'from-red-600 to-red-400',                    icon: '▶️', charLimit: 5000, profileName: 'Ferreira Arquitetos', handle: '@ferreirarquitetos', url: 'https://studio.youtube.com/' },
];

// ── Caption builder per network ─────────────────────────────────────
function buildCaption(post: ContentPost, channel: ContentChannel): string {
  const base = (post.networkCaptions?.[channel]) || post.copyPt || '';
  const hashtags = (post.hashtags ?? []).map((h) => (h.startsWith('#') ? h : `#${h}`));
  const cta = post.cta?.trim() ?? '';

  if (channel === 'linkedin') {
    const linTags = hashtags.slice(0, 5).join(' ');
    return [base, cta, linTags].filter(Boolean).join('\n\n');
  }
  if (channel === 'ig-stories' || channel === 'threads') {
    return base.slice(0, 150);
  }
  if (channel === 'youtube') {
    return [base, cta, '', hashtags.join(' ')].filter(Boolean).join('\n\n');
  }
  return [base, cta, '', hashtags.join(' ')].filter(Boolean).join('\n\n');
}

// ── Instagram mockup ────────────────────────────────────────────────
function InstagramMockup({ post, net, imgSrc }: { post: ContentPost; net: typeof NETWORKS[0]; imgSrc?: string }) {
  const [expanded, setExpanded] = useState(false);
  const caption = buildCaption(post, net.channel);
  const preview = expanded ? caption : caption.slice(0, 125) + (caption.length > 125 ? '…' : '');
  const isStories = net.channel === 'ig-stories';

  return (
    <div className={`rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-white dark:bg-zinc-900 ${isStories ? 'max-w-[220px] mx-auto' : 'w-full'}`}>
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${net.gradient} flex items-center justify-center text-white text-xs font-bold shrink-0`}>FA</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">{net.profileName}</p>
          <p className="text-[10px] text-zinc-500">{net.handle}</p>
        </div>
        <span className="text-xs text-blue-500 font-medium shrink-0">Seguir</span>
      </div>

      {/* Media */}
      {imgSrc ? (
        <div className={isStories ? 'aspect-[9/16]' : 'aspect-square'}>
          <img src={imgSrc} alt="" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className={`${isStories ? 'aspect-[9/16]' : 'aspect-square'} bg-gradient-to-br ${net.gradient} flex items-center justify-center`}>
          <span className="text-4xl opacity-60">{net.icon}</span>
        </div>
      )}

      {!isStories && (
        <>
          {/* Action icons */}
          <div className="flex items-center gap-3 px-3 pt-2.5 pb-1">
            <span className="text-base cursor-pointer">🤍</span>
            <span className="text-base cursor-pointer">💬</span>
            <span className="text-base cursor-pointer">✈️</span>
            <span className="ml-auto text-base cursor-pointer">🔖</span>
          </div>
          {/* Likes */}
          <p className="text-xs font-semibold text-zinc-900 dark:text-white px-3 pb-1">1.247 gostos</p>
          {/* Caption */}
          <div className="px-3 pb-3">
            <p className="text-xs text-zinc-900 dark:text-white leading-relaxed whitespace-pre-wrap">
              <span className="font-semibold mr-1">{net.profileName}</span>
              {preview}
            </p>
            {caption.length > 125 && (
              <button onClick={() => setExpanded(!expanded)} className="text-[10px] text-zinc-500 mt-0.5 flex items-center gap-0.5">
                {expanded ? <><ChevronUp className="w-3 h-3" /> ver menos</> : <><ChevronDown className="w-3 h-3" /> mais</>}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── LinkedIn mockup ─────────────────────────────────────────────────
function LinkedInMockup({ post, net, imgSrc }: { post: ContentPost; net: typeof NETWORKS[0]; imgSrc?: string }) {
  const [expanded, setExpanded] = useState(false);
  const caption = buildCaption(post, net.channel);
  const preview = expanded ? caption : caption.slice(0, 200) + (caption.length > 200 ? '…' : '');

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden shadow-md w-full">
      {/* Header */}
      <div className="flex items-start gap-3 px-4 pt-4 pb-3">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${net.gradient} flex items-center justify-center text-white text-sm font-bold shrink-0`}>FA</div>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">{net.profileName}</p>
          <p className="text-xs text-zinc-500">{net.handle}</p>
          <p className="text-[10px] text-zinc-400">Agora · 🌐</p>
        </div>
      </div>
      {/* Caption */}
      <div className="px-4 pb-3">
        <p className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed">{preview}</p>
        {caption.length > 200 && (
          <button onClick={() => setExpanded(!expanded)} className="text-xs text-blue-600 font-medium mt-1">
            {expanded ? 'ver menos' : '…ver mais'}
          </button>
        )}
      </div>
      {/* Image */}
      {imgSrc ? (
        <img src={imgSrc} alt="" className="w-full aspect-video object-cover" />
      ) : (
        <div className="w-full aspect-video bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center">
          <span className="text-4xl opacity-50">💼</span>
        </div>
      )}
      {/* Reactions */}
      <div className="px-4 py-3 flex items-center gap-1 text-xs text-zinc-500 border-t border-zinc-100 dark:border-zinc-700">
        <span>👍❤️💡</span><span className="ml-1">248 reações</span>
        <span className="ml-auto">34 comentários · 12 partilhas</span>
      </div>
    </div>
  );
}

// ── Threads mockup ──────────────────────────────────────────────────
function ThreadsMockup({ post, net, imgSrc }: { post: ContentPost; net: typeof NETWORKS[0]; imgSrc?: string }) {
  const caption = buildCaption(post, net.channel);
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden shadow-md w-full p-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-zinc-900 dark:bg-zinc-700 flex items-center justify-center text-white text-xs font-bold shrink-0">FA</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">{net.handle}</p>
            <span className="text-xs text-zinc-400">agora</span>
          </div>
          <p className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed">{caption}</p>
          {imgSrc && <img src={imgSrc} alt="" className="mt-3 rounded-xl w-full object-cover max-h-48" />}
          <div className="flex items-center gap-4 mt-3 text-zinc-400">
            <span className="text-sm cursor-pointer hover:text-zinc-600">🤍</span>
            <span className="text-sm cursor-pointer hover:text-zinc-600">💬</span>
            <span className="text-sm cursor-pointer hover:text-zinc-600">🔁</span>
            <span className="text-sm cursor-pointer hover:text-zinc-600">✈️</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Generic mockup (Pinterest, TikTok, YouTube) ──────────────────────
function GenericMockup({ post, net, imgSrc }: { post: ContentPost; net: typeof NETWORKS[0]; imgSrc?: string }) {
  const caption = buildCaption(post, net.channel);
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden shadow-md w-full">
      {imgSrc ? (
        <img src={imgSrc} alt="" className="w-full aspect-video object-cover" />
      ) : (
        <div className={`w-full aspect-video bg-gradient-to-br ${net.gradient} flex items-center justify-center`}>
          <span className="text-5xl opacity-50">{net.icon}</span>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${net.gradient} flex items-center justify-center text-white text-[10px] font-bold`}>FA</div>
          <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{net.profileName}</p>
        </div>
        <p className="text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed line-clamp-6">{caption}</p>
      </div>
    </div>
  );
}

// ── Main PostPreviewSheet ────────────────────────────────────────────
interface PostPreviewSheetProps {
  post: ContentPost;
  asset: { id: string; name: string; thumbnail?: string; src?: string; type: string } | null;
  onPublish: () => void;
  onCopyFull: () => void;
  onCopyImage: () => void;
}

export function PostPreviewSheet({ post, asset, onPublish, onCopyFull, onCopyImage }: PostPreviewSheetProps) {
  const [activeNet, setActiveNet] = useState<ContentChannel>('ig-feed');
  const [copied, setCopied] = useState(false);

  const imgSrc = asset?.thumbnail || asset?.src;
  const net = NETWORKS.find((n) => n.channel === activeNet) ?? NETWORKS[0];
  const caption = buildCaption(post, activeNet);
  const publishedNetworks = post.publishedNetworks ?? [];

  async function copyCaption() {
    await navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(`Legenda copiada — pronta a colar no ${net.label}`);
  }

  function renderMockup() {
    if (['ig-feed', 'ig-reels', 'ig-carrossel', 'ig-stories'].includes(activeNet)) {
      return <InstagramMockup post={post} net={net} imgSrc={imgSrc} />;
    }
    if (activeNet === 'linkedin') return <LinkedInMockup post={post} net={net} imgSrc={imgSrc} />;
    if (activeNet === 'threads') return <ThreadsMockup post={post} net={net} imgSrc={imgSrc} />;
    return <GenericMockup post={post} net={net} imgSrc={imgSrc} />;
  }

  const charPct = caption.length / net.charLimit;
  const charColor = charPct > 0.9 ? 'text-red-500' : charPct > 0.7 ? 'text-amber-500' : 'text-emerald-500';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-border shrink-0">
        <h3 className="text-base font-semibold mb-1">Pré-visualização do Post</h3>
        <p className="text-xs text-muted-foreground">{post.channel} · {post.format || 'Post'}</p>
      </div>

      {/* Network tabs — scrollable */}
      <div className="overflow-x-auto shrink-0 border-b border-border">
        <div className="flex gap-1 px-3 py-2 min-w-max">
          {NETWORKS.map((n) => {
            const isPublished = publishedNetworks.includes(n.channel);
            return (
              <button
                key={n.channel}
                onClick={() => setActiveNet(n.channel)}
                className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeNet === n.channel
                    ? 'bg-foreground text-background shadow-sm'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                <span>{n.icon}</span>
                {n.shortLabel}
                {isPublished && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mockup area */}
      <div className="flex-1 overflow-y-auto px-4 py-5 bg-zinc-50 dark:bg-zinc-950/50">
        {renderMockup()}
      </div>

      {/* Caption + actions */}
      <div className="shrink-0 border-t border-border bg-card px-4 py-4 space-y-3">
        {/* Char counter */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{net.label}</span>
          <span className={`text-xs font-medium tabular-nums ${charColor}`}>
            {caption.length}/{net.charLimit} chars
            {net.hashtagLimit && <span className="ml-2 text-muted-foreground">· max {net.hashtagLimit} #</span>}
          </span>
        </div>

        {/* Caption preview */}
        <div className="bg-muted/50 rounded-xl px-3 py-2.5 text-xs text-foreground/80 line-clamp-3 whitespace-pre-wrap leading-relaxed">
          {caption}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={copyCaption}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium flex-1 justify-center transition-all ${
              copied ? 'bg-emerald-500/15 text-emerald-600' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copiado!' : `Copiar legenda`}
          </button>
          <button
            onClick={onCopyImage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 text-xs font-medium transition-colors"
          >
            <Image className="w-3.5 h-3.5" /> Copiar foto
          </button>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={onCopyFull}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors flex-1 justify-center"
          >
            <Copy className="w-3.5 h-3.5" /> Post completo PT+EN
          </button>
          <button
            onClick={onPublish}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            <Send className="w-3.5 h-3.5" /> Publicar
          </button>
        </div>
      </div>
    </div>
  );
}
