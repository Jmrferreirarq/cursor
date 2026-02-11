import type { VercelRequest, VercelResponse } from '@vercel/node';

// Usar Upstash Redis via variáveis de ambiente do Vercel
const UPSTASH_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.KV_URL;
const UPSTASH_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_READ_ONLY_TOKEN;

async function redisGet(key: string): Promise<string | null> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    const response = await fetch(`${UPSTASH_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!response.ok) return null;
    const data = await response.json();
    return data.result || null;
  } catch {
    return null;
  }
}

async function redisIncr(key: string, field: string): Promise<void> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return;
  try {
    // Fire and forget - increment views
    fetch(`${UPSTASH_URL}/hincrby/${key}/${field}/1`, {
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
      },
    }).catch(() => {});
  } catch {
    // Ignore
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid proposal ID' });
  }

  // Verificar se Redis está configurado
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    console.error('Upstash Redis not configured');
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const data = await redisGet(`proposal:${id}`);
    console.log('[API] Raw data from Redis:', data ? data.substring(0, 200) : 'null');

    if (!data) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    const proposal = JSON.parse(data);
    console.log('[API] Parsed proposal keys:', Object.keys(proposal));
    console.log('[API] Payload type:', typeof proposal.payload);
    console.log('[API] Payload exists:', !!proposal.payload);

    // Incrementar visualizações (fire and forget)
    redisIncr(`proposal:${id}`, 'views');

    return res.status(200).json({
      payload: proposal.payload,
      reference: proposal.reference,
      clientName: proposal.clientName,
      projectName: proposal.projectName,
      createdAt: proposal.createdAt,
      views: proposal.views || 0,
    });
  } catch (error) {
    console.error('Error fetching proposal:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
