import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * API endpoint para encurtar URLs de propostas.
 * Estratégia:
 *   1) Tentar Upstash Redis (se configurado) → /p/:shortId
 *   2) Fallback: usar cleanuri.com ou is.gd para encurtar o hash URL completo
 *   3) Se tudo falhar: devolver erro (cliente usa hash URL diretamente)
 */

const UPSTASH_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

function generateShortId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 8; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

async function trySaveToRedis(payload: unknown, meta: { reference: string; clientName: string; projectName: string }): Promise<string | null> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  try {
    const shortId = generateShortId();
    const data = JSON.stringify({
      payload,
      reference: meta.reference || '',
      clientName: meta.clientName || '',
      projectName: meta.projectName || '',
      createdAt: new Date().toISOString(),
      views: 0,
    });
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    const response = await fetch(`${UPSTASH_URL}/set/proposal:${shortId}?EX=31536000`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'text/plain' },
      body: data,
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!response.ok) return null;
    return shortId;
  } catch {
    return null;
  }
}

async function tryShorten(longUrl: string): Promise<string | null> {
  // Tentar is.gd (gratuito, sem API key, suporta até ~5000 chars)
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    const apiUrl = `https://is.gd/create.php?format=json&url=${encodeURIComponent(longUrl)}`;
    const response = await fetch(apiUrl, { signal: ctrl.signal });
    clearTimeout(timer);
    if (response.ok) {
      const data = await response.json();
      if (data.shorturl) return data.shorturl;
    }
  } catch { /* ignore */ }

  // Fallback: tinyurl.com
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    const apiUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`;
    const response = await fetch(apiUrl, { signal: ctrl.signal });
    clearTimeout(timer);
    if (response.ok) {
      const text = await response.text();
      if (text.startsWith('http')) return text.trim();
    }
  } catch { /* ignore */ }

  return null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Parsear body — o Vercel pode lançar "Invalid JSON" ao aceder req.body
    let body: Record<string, unknown> = {};
    try {
      const rawBody = req.body;
      if (typeof rawBody === 'string') {
        body = JSON.parse(rawBody);
      } else if (rawBody && typeof rawBody === 'object') {
        body = rawBody as Record<string, unknown>;
      }
    } catch (parseErr) {
      // Se o body vier como stream/buffer, ler manualmente
      try {
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
      } catch {
        return res.status(400).json({ error: 'Could not parse request body', detail: String(parseErr) });
      }
    }
    const payload = body.payload as Record<string, unknown> | undefined;
    const reference = String(body.reference || '');
    const clientName = String(body.clientName || '');
    const projectName = String(body.projectName || '');
    const hashUrl = body.hashUrl as string | undefined;
    const origin = String(body.origin || '');

    if (!hashUrl && !payload) {
      return res.status(400).json({ error: 'hashUrl or payload required' });
    }

    // Estratégia 1: Redis → link curto interno (/p/:shortId)
    if (payload) {
      try {
        const shortId = await trySaveToRedis(payload, { reference, clientName, projectName });
        if (shortId) {
          const base = origin.replace(/\/$/, '');
          return res.status(200).json({ shortUrl: `${base}/p/${shortId}`, method: 'redis' });
        }
      } catch (e) {
        console.warn('[shorten] Redis failed:', e);
      }
    }

    // Estratégia 2: URL shortener externo para o hash URL
    if (hashUrl) {
      try {
        const shortUrl = await tryShorten(hashUrl);
        if (shortUrl) {
          return res.status(200).json({ shortUrl, method: 'external' });
        }
      } catch (e) {
        console.warn('[shorten] External shortener failed:', e);
      }
    }

    return res.status(422).json({ error: 'Todos os métodos de encurtamento falharam', hasRedis: !!(UPSTASH_URL && UPSTASH_TOKEN) });
  } catch (error) {
    console.error('[shorten] Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error', message: String(error) });
  }
}
