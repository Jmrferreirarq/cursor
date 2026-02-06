/**
 * API Route: GET /api/proposals/[id]
 * Obtém uma proposta pelo ID curto
 */

import { Redis } from '@upstash/redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Inicializar Redis com variáveis de ambiente do Vercel
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Apenas GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID is required' });
    }

    // Buscar no Redis
    const data = await redis.get(`proposal:${id}`);

    if (!data) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    // Parse dos dados
    const proposal = typeof data === 'string' ? JSON.parse(data) : data;

    // Incrementar views (fire and forget)
    redis.set(`proposal:${id}`, JSON.stringify({
      ...proposal,
      views: (proposal.views || 0) + 1,
    }), { ex: 31536000 }).catch(() => {});

    return res.status(200).json({
      payload: JSON.parse(proposal.payload),
      reference: proposal.reference,
      clientName: proposal.clientName,
      projectName: proposal.projectName,
      createdAt: proposal.createdAt,
      views: proposal.views,
    });
  } catch (error) {
    console.error('Error fetching proposal:', error);
    return res.status(500).json({ error: 'Failed to fetch proposal' });
  }
}
