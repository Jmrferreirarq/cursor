import type { VercelRequest, VercelResponse } from '@vercel/node';

// Usar Upstash Redis via variáveis de ambiente do Vercel
// O Upstash pode usar diferentes nomes de variáveis
const UPSTASH_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.KV_URL;
const UPSTASH_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_READ_ONLY_TOKEN;

function generateShortId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function redisSet(key: string, value: string, exSeconds: number): Promise<boolean> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return false;
  try {
    const response = await fetch(`${UPSTASH_URL}/set/${key}?EX=${exSeconds}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(value),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function redisGet(key: string): Promise<string | null> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  try {
    const response = await fetch(`${UPSTASH_URL}/get/${key}`, {
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
      },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.result || null;
  } catch {
    return null;
  }
}

async function redisExists(key: string): Promise<boolean> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return false;
  try {
    const response = await fetch(`${UPSTASH_URL}/exists/${key}`, {
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
      },
    });
    if (!response.ok) return false;
    const data = await response.json();
    return data.result === 1;
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verificar se Redis está configurado
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    console.error('Upstash Redis not configured. URL:', !!UPSTASH_URL, 'TOKEN:', !!UPSTASH_TOKEN);
    console.error('Available env vars with KV/UPSTASH:', Object.keys(process.env).filter(k => k.includes('KV') || k.includes('UPSTASH')));
    return res.status(500).json({ error: 'Database not configured', debug: { hasUrl: !!UPSTASH_URL, hasToken: !!UPSTASH_TOKEN } });
  }

  try {
    const { payload, reference, clientName, projectName } = req.body;

    if (!payload) {
      return res.status(400).json({ error: 'Payload is required' });
    }

    // Gerar ID único
    let shortId = generateShortId();
    let attempts = 0;
    while (await redisExists(`proposal:${shortId}`) && attempts < 10) {
      shortId = generateShortId();
      attempts++;
    }

    // Dados a guardar
    const data = {
      payload,
      reference: reference || '',
      clientName: clientName || '',
      projectName: projectName || '',
      createdAt: new Date().toISOString(),
      views: 0,
    };

    // Guardar no Redis (expira em 1 ano)
    const saved = await redisSet(`proposal:${shortId}`, JSON.stringify(data), 31536000);

    if (!saved) {
      return res.status(500).json({ error: 'Failed to save proposal' });
    }

    return res.status(200).json({ shortId, success: true });
  } catch (error) {
    console.error('Error saving proposal:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
