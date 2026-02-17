import { motion } from 'framer-motion';
import { Trash2, Image, Package, FileText, RotateCcw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useMedia } from '@/context/MediaContext';
import { useData } from '@/context/DataContext';
import { AssetThumbnail } from '@/components/media/AssetThumbnail';
import type { MediaAsset, ContentPack, ContentPost } from '@/types';

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export default function TrashPage() {
  const { trashAssets, trashPacks, trashPosts, restoreAsset, restorePack, restorePost, emptyTrash } = useMedia();
  const { projects } = useData();

  const total = trashAssets.length + trashPacks.length + trashPosts.length;

  const handleEmptyTrash = () => {
    if (!window.confirm('Eliminar permanentemente tudo o que está no lixo? Esta ação não pode ser desfeita.')) return;
    emptyTrash();
    toast.success('Lixo esvaziado');
  };

  if (total === 0) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Trash2 className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide uppercase">Content Factory</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Lixo</h1>
          <p className="text-muted-foreground mt-1">Itens apagados ficam aqui e podem ser recuperados</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card border border-border rounded-xl p-12 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Lixo vazio</h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Quando apagares assets, content packs ou posts, eles aparecem aqui. Podes restaurá-los ou eliminá-los permanentemente.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Trash2 className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide uppercase">Content Factory</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Lixo</h1>
          <p className="text-muted-foreground mt-1">{total} item(s) — restaura ou elimina permanentemente</p>
        </div>
        <button
          onClick={handleEmptyTrash}
          className="inline-flex items-center gap-2 px-4 py-2 border border-destructive/50 text-destructive rounded-xl text-sm font-medium hover:bg-destructive/10 transition-colors"
        >
          <AlertTriangle className="w-4 h-4" />
          Esvaziar lixo
        </button>
      </motion.div>

      <div className="space-y-6">
        {trashAssets.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <Image className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-semibold">Assets ({trashAssets.length})</h2>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {trashAssets.map(({ item, deletedAt }) => (
                <TrashAssetCard key={item.id} asset={item} deletedAt={deletedAt} onRestore={() => restoreAsset(item.id)} projectName={projects.find((p) => p.id === item.projectId)?.name} />
              ))}
            </div>
          </motion.section>
        )}

        {trashPacks.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <Package className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-semibold">Content Packs ({trashPacks.length})</h2>
            </div>
            <div className="p-4 space-y-2">
              {trashPacks.map(({ item, deletedAt }) => (
                <TrashPackRow key={item.id} pack={item} deletedAt={deletedAt} onRestore={() => restorePack(item.id)} />
              ))}
            </div>
          </motion.section>
        )}

        {trashPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-semibold">Posts ({trashPosts.length})</h2>
            </div>
            <div className="p-4 space-y-2">
              {trashPosts.map(({ item, deletedAt }) => (
                <TrashPostRow key={item.id} post={item} deletedAt={deletedAt} onRestore={() => restorePost(item.id)} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}

function TrashAssetCard({ asset, deletedAt, onRestore, projectName }: { asset: MediaAsset; deletedAt: string; onRestore: () => void; projectName?: string }) {
  return (
    <div className="bg-background border border-border rounded-xl overflow-hidden group">
      <div className="aspect-[4/3] relative bg-muted">
        <AssetThumbnail asset={asset} className="w-full h-full object-cover" fallbackClassName="w-10 h-10 text-muted-foreground/40" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button onClick={onRestore} className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
            <RotateCcw className="w-4 h-4" /> Restaurar
          </button>
        </div>
      </div>
      <div className="p-3">
        <p className="font-medium text-sm truncate">{asset.name}</p>
        {projectName && <p className="text-xs text-muted-foreground truncate">{projectName}</p>}
        <p className="text-[10px] text-muted-foreground mt-1">Apagado {formatDate(deletedAt)}</p>
      </div>
    </div>
  );
}

function TrashPackRow({ pack, deletedAt, onRestore }: { pack: ContentPack; deletedAt: string; onRestore: () => void }) {
  const copy = pack.copies?.[0]?.text?.slice(0, 80) || '—';
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">Pack para asset {pack.assetId}</p>
        <p className="text-xs text-muted-foreground truncate">{copy}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">Apagado {formatDate(deletedAt)}</p>
      </div>
      <button onClick={onRestore} className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20">
        <RotateCcw className="w-3.5 h-3.5" /> Restaurar
      </button>
    </div>
  );
}

function TrashPostRow({ post, deletedAt, onRestore }: { post: ContentPost; deletedAt: string; onRestore: () => void }) {
  const copy = (post.copyPt || post.copyEn || '—').slice(0, 60);
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{post.channel} · {post.format}</p>
        <p className="text-xs text-muted-foreground truncate">{copy}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">Apagado {formatDate(deletedAt)}</p>
      </div>
      <button onClick={onRestore} className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20">
        <RotateCcw className="w-3.5 h-3.5" /> Restaurar
      </button>
    </div>
  );
}
