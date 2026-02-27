import { useEffect, useRef } from 'react';
import { generateVideoThumbnail } from '@/utils/videoThumbnail';
import type { MediaAsset } from '@/types';

/** Gera thumbnail para vídeos existentes que não têm thumbnail */
export function useVideoThumbnail(
  asset: MediaAsset | undefined,
  updateAsset: (id: string, patch: Partial<MediaAsset>) => void
) {
  const generating = useRef(false);

  useEffect(() => {
    if (
      !asset ||
      asset.type !== 'video' ||
      !asset.src ||
      asset.thumbnail ||
      generating.current
    ) {
      return;
    }

    generating.current = true;
    generateVideoThumbnail(asset.src)
      .then((thumb) => {
        updateAsset(asset.id, { thumbnail: thumb });
      })
      .catch(() => {
        // Silently fail — card continua com placeholder
      })
      .finally(() => {
        generating.current = false;
      });
  }, [asset?.id, asset?.src, asset?.thumbnail, asset?.type, updateAsset]);
}
