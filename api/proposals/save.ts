/**
 * API Route: POST /api/proposals/save
 * Guarda uma proposta no Redis e retorna o ID curto
 */

import { Redis } from '@upstash/redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Inicializar Redis com variáveis de ambiente do Vercel
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

/** Gera um ID curto único (6 caracteres) */
function generateShortId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { payload, reference, clientName, projectName } = req.body;

    if (!payload) {
      return res.status(400).json({ error: 'Payload is required' });
    }

    // Gerar ID curto único
    let shortId = generateShortId();
    let attempts = 0;
    
    // Verificar se já existe (improvável, mas seguro)
    while (await redis.exists(`proposal:${shortId}`) && attempts < 5) {
      shortId = generateShortId();
      attempts++;
    }

    // Guardar no Redis (expira em 1 ano)
    const data = {
      payload: JSON.stringify(payload),
      reference: reference || '',
      clientName: clientName || '',
      projectName: projectName || '',
      createdAt: new Date().toISOString(),
      views: 0,
    };

    await redis.set(`proposal:${shortId}`, JSON.stringify(data), { ex: 31536000 }); // 1 ano

    return res.status(200).json({ shortId, success: true });
  } catch (error) {
    console.error('Error saving proposal:', error);
    return res.status(500).json({ error: 'Failed to save proposal' });
  }
}
