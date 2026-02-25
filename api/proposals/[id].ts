import type { VercelRequest, VercelResponse } from '@vercel/node';

// Usar Upstash Redis via variáveis de ambiente do Vercel
// NOTA: KV_URL é protocolo redis:// (não REST), por isso NÃO deve ser usado aqui
const UPSTASH_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

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

import { setCorsHeaders } from '../_cors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(req, res, 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string' || id.length > 32 || !/^[A-Za-z0-9]+$/.test(id)) {
    return res.status(400).json({ error: 'Invalid proposal ID' });
  }

  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return res.status(500).json({ error: 'Database not configured' });
  }

  try {
    const data = await redisGet(`proposal:${id}`);

    if (!data) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    let proposal: Record<string, unknown>;
    try {
      proposal = JSON.parse(data);
    } catch {
      return res.status(500).json({ error: 'Corrupted proposal data' });
    }

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
