import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const envKeys = Object.keys(process.env)
    .filter(k => k.includes('KV') || k.includes('UPSTASH') || k.includes('REDIS') || k.includes('BLOB'))
    .map(k => `${k}=${k.includes('TOKEN') || k.includes('SECRET') ? '***' : (process.env[k] || '').substring(0, 40)}`);
  
  res.status(200).json({
    envKeys,
    nodeVersion: process.version,
    hasKvUrl: !!process.env.KV_REST_API_URL,
    hasKvToken: !!process.env.KV_REST_API_TOKEN,
    hasUpstashUrl: !!process.env.UPSTASH_REDIS_REST_URL,
    hasUpstashToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    kvUrlPrefix: (process.env.KV_REST_API_URL || '').substring(0, 30),
  });
}
