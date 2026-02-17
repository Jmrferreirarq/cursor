/**
 * Converte uma URL de imagem (data: ou http) em Blob PNG para o clipboard.
 * Necessário para WhatsApp, Telegram, etc. — que não suportam HTML com imagens.
 */
export async function imageUrlToPngBlob(src: string): Promise<Blob | null> {
  return new Promise((resolve) => {
    const img = new Image();
    if (src.startsWith('http')) img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => resolve(blob), 'image/png');
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}
