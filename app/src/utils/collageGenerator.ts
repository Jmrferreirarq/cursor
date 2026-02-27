/**
 * Vertical Collage Generator — combina 2–4 imagens numa única imagem 9:16.
 * Cada imagem preenche a sua faixa (object-cover), sem cortes laterais no conjunto.
 */

const OUTPUT_WIDTH = 1080;
const OUTPUT_HEIGHT = 1920; // 9:16

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (!src.startsWith('data:')) img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Falha ao carregar imagem'));
    img.src = src;
  });
}

/**
 * Composites multiple images into a single 9:16 vertical image.
 * @param imageSrcs Array of image sources (data URLs or URLs) in display order
 * @returns Blob (PNG) ready for download
 */
export async function generateVerticalCollage(imageSrcs: string[]): Promise<Blob> {
  if (imageSrcs.length < 2 || imageSrcs.length > 4) {
    throw new Error('Seleciona entre 2 e 4 imagens');
  }

  const images = await Promise.all(imageSrcs.map(loadImage));
  const count = images.length;
  const slotHeight = Math.floor(OUTPUT_HEIGHT / count);

  const canvas = document.createElement('canvas');
  canvas.width = OUTPUT_WIDTH;
  canvas.height = OUTPUT_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas não disponível');

  for (let i = 0; i < count; i++) {
    const img = images[i];
    const y = i * slotHeight;
    const slotW = OUTPUT_WIDTH;
    const slotH = i === count - 1 ? OUTPUT_HEIGHT - y : slotHeight;

    // object-cover: scale image to cover the slot, center crop
    const imgAspect = img.width / img.height;
    const slotAspect = slotW / slotH;
    let drawW: number;
    let drawH: number;
    let drawX: number;
    let drawY: number;

    if (imgAspect > slotAspect) {
      // Image is wider — fit height, crop sides
      drawH = slotH;
      drawW = img.width * (slotH / img.height);
      drawX = (slotW - drawW) / 2;
      drawY = 0;
    } else {
      // Image is taller — fit width, crop top/bottom
      drawW = slotW;
      drawH = img.height * (slotW / img.width);
      drawX = 0;
      drawY = (slotH - drawH) / 2;
    }

    ctx.drawImage(img, drawX, y + drawY, drawW, drawH);
  }

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Falha ao gerar imagem'))),
      'image/png',
      0.95
    );
  });
}

/**
 * Smart crop: aplica região de crop (0-1) e gera imagem 9:16.
 */
export interface CropRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function applySmartCrop(imageSrc: string, region: CropRegion): Promise<Blob> {
  const img = await loadImage(imageSrc);
  const srcX = region.x * img.width;
  const srcY = region.y * img.height;
  const srcW = region.width * img.width;
  const srcH = region.height * img.height;

  const canvas = document.createElement('canvas');
  canvas.width = OUTPUT_WIDTH;
  canvas.height = OUTPUT_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas não disponível');

  ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, OUTPUT_WIDTH, OUTPUT_HEIGHT);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Falha ao gerar imagem'))),
      'image/png',
      0.95
    );
  });
}

/**
 * Triggers download of the collage blob.
 */
export function downloadCollage(blob: Blob, filename = 'vertical-collage.png'): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
