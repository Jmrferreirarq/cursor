import React, { useState } from 'react';
import { Image, Video } from 'lucide-react';
import type { MediaAsset } from '@/types';

/**
 * Thumbnail para asset. Vídeos: NUNCA usar src em img (data:video/* não funciona).
 * Imagens: usar thumbnail || src. onError: fallback para placeholder.
 */
export function AssetThumbnail({
  asset,
  className = 'w-full h-full object-cover',
  fallbackClassName = 'w-10 h-10 text-muted-foreground/40',
}: {
  asset: MediaAsset;
  className?: string;
  fallbackClassName?: string;
}) {
  const [imgError, setImgError] = useState(false);

  // Vídeo: só thumbnail — data:video/* NUNCA funciona em <img>
  const imgSrc =
    asset.type === 'video'
      ? asset.thumbnail
      : imgError
        ? null
        : asset.thumbnail || asset.src;

  if (!imgSrc || imgError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        {asset.type === 'video' ? (
          <Video className={fallbackClassName} />
        ) : (
          <Image className={fallbackClassName} />
        )}
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={asset.name}
      className={className}
      onError={() => setImgError(true)}
    />
  );
}
