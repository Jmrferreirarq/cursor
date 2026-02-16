/** Gera thumbnail a partir de um frame do vídeo (data URL) */
export function generateVideoThumbnail(videoSrc: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';
    video.onerror = () => reject(new Error('Erro ao carregar vídeo'));
    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas não suportado'));
          return;
        }
        ctx.drawImage(video, 0, 0);
        const thumb = canvas.toDataURL('image/jpeg', 0.7);
        video.src = '';
        video.load();
        resolve(thumb);
      } catch (e) {
        reject(e);
      }
    };
    video.onloadeddata = () => {
      video.currentTime = Math.min(0.5, video.duration * 0.1);
    };
    video.src = videoSrc;
    video.load();
  });
}
