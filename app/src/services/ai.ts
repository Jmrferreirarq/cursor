/**
 * AI Service — OpenAI GPT-4 Vision integration.
 * Analyzes uploaded images and generates social media content automatically.
 */

import type { MediaAsset, ContentCopy, ContentChannel, ContentPack } from '@/types';

// ── API Key Management ──

const API_KEY_STORAGE = 'fa360_openai_key';

export function getApiKey(): string | null {
  return localStorage.getItem(API_KEY_STORAGE);
}

export function setApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE, key.trim());
}

export function removeApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE);
}

export function hasApiKey(): boolean {
  const key = getApiKey();
  return !!key && key.startsWith('sk-');
}

// ── Types ──

export interface AIAnalysisResult {
  tags: string[];
  qualityScore: number;
  risks: string[];
  story: string;
  description: string;
  copies: ContentCopy[];
  hashtags: string[];
  cta: string;
  suggestedFormats: { ratio: string; label: string; description: string }[];
}

// ── System Prompt ──

const SYSTEM_PROMPT = `Tu és o Content Copilot da FERREIRA ARQUITETOS, um estúdio de arquitetura português.
A tua missão é analisar imagens/vídeos de projetos de arquitetura e gerar conteúdo pronto para publicação nas redes sociais.

CONTEXTO DA MARCA:
- Estúdio de arquitetura contemporânea em Portugal
- Tom profissional mas acessível
- Foco em: processo, detalhe técnico, materiais, antes/depois, obra, resultado final
- Sempre bilingue: Português (PT-PT) + Inglês

RESPONDE SEMPRE em JSON válido com esta estrutura exata:
{
  "tags": ["lista", "de", "tags", "relevantes"],
  "qualityScore": 85,
  "risks": ["lista de riscos detectados, ex: rostos visíveis, moradas, marcas"],
  "story": "Uma frase que resume a história/narrativa desta imagem",
  "description": "Descrição detalhada do que se vê na imagem (2-3 frases)",
  "copies": [
    {"lang": "pt", "channel": "ig-feed", "text": "Copy para Instagram Feed em PT..."},
    {"lang": "en", "channel": "ig-feed", "text": "Copy for Instagram Feed in EN..."},
    {"lang": "pt", "channel": "ig-reels", "text": "Copy para Reels em PT..."},
    {"lang": "en", "channel": "ig-reels", "text": "Copy for Reels in EN..."},
    {"lang": "pt", "channel": "ig-stories", "text": "Copy para Stories em PT (curto)..."},
    {"lang": "en", "channel": "ig-stories", "text": "Copy for Stories in EN (short)..."},
    {"lang": "pt", "channel": "linkedin", "text": "Copy longo e profissional para LinkedIn em PT..."},
    {"lang": "en", "channel": "linkedin", "text": "Long professional copy for LinkedIn in EN..."},
    {"lang": "pt", "channel": "threads", "text": "Copy conversacional para Threads em PT..."},
    {"lang": "en", "channel": "threads", "text": "Conversational copy for Threads in EN..."},
    {"lang": "pt", "channel": "tiktok", "text": "Copy curto para TikTok em PT..."},
    {"lang": "en", "channel": "tiktok", "text": "Short copy for TikTok in EN..."},
    {"lang": "pt", "channel": "pinterest", "text": "Copy descritivo para Pinterest em PT..."},
    {"lang": "en", "channel": "pinterest", "text": "Descriptive copy for Pinterest in EN..."}
  ],
  "hashtags": ["#arquitetura", "#architecture", "#portugal", "...mais relevantes"],
  "cta": "Call-to-action sugerido em PT",
  "suggestedFormats": [
    {"ratio": "1:1", "label": "Quadrado", "description": "Melhor para IG Feed e LinkedIn"},
    {"ratio": "4:5", "label": "Retrato", "description": "Melhor para IG Feed"},
    {"ratio": "9:16", "label": "Vertical", "description": "Melhor para Stories/Reels/TikTok"},
    {"ratio": "16:9", "label": "Paisagem", "description": "Melhor para YouTube e LinkedIn"}
  ]
}

REGRAS PARA O COPY:
- Instagram Feed: 150-300 palavras, storytelling, emojis moderados, 15-20 hashtags no final
- Instagram Reels: 50-100 palavras, gancho forte na primeira linha, CTA
- Instagram Stories: 20-40 palavras, direto, com emoji e CTA (desliza/swipe)
- LinkedIn: 200-400 palavras, tom profissional/educativo, sem emojis excessivos, 3-5 hashtags
- Threads: 50-150 palavras, conversacional, opinião/insight, sem hashtags
- TikTok: 30-80 palavras, gancho viral, trending, hashtags populares
- Pinterest: 100-200 palavras, descritivo, SEO-friendly, keywords naturais

REGRAS DE SEGURANÇA:
- Se vires rostos, indica em "risks"
- Se vires moradas/endereços visíveis, indica em "risks"
- Se vires marcas/logótipos de terceiros, indica em "risks"
- Se vires matrículas de veículos, indica em "risks"
- qualityScore: 0-100 baseado em composição, iluminação, resolução aparente, interesse visual`;

// ── API Call ──

async function callOpenAI(imageBase64: string, mediaType: string, objective: string, projectName?: string): Promise<AIAnalysisResult> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('API key não configurada. Vai a Definições para adicionar.');

  const userMessage = `Analisa esta imagem de arquitetura.
Tipo de media: ${mediaType}
Objetivo: ${objective}
${projectName ? `Projeto: ${projectName}` : ''}

Gera conteúdo completo para todas as redes sociais. Responde APENAS com JSON válido.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: userMessage },
            {
              type: 'image_url',
              image_url: {
                url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
                detail: 'high',
              },
            },
          ],
        },
      ],
      max_tokens: 4000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = (err as { error?: { message?: string } })?.error?.message || `HTTP ${response.status}`;
    throw new Error(`OpenAI API erro: ${msg}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Resposta vazia da API');

  // Parse JSON from response (handle markdown code blocks)
  let jsonStr = content.trim();
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  try {
    const result = JSON.parse(jsonStr) as AIAnalysisResult;
    return {
      tags: Array.isArray(result.tags) ? result.tags : [],
      qualityScore: typeof result.qualityScore === 'number' ? Math.min(100, Math.max(0, result.qualityScore)) : 70,
      risks: Array.isArray(result.risks) ? result.risks : [],
      story: result.story || '',
      description: result.description || '',
      copies: Array.isArray(result.copies) ? result.copies : [],
      hashtags: Array.isArray(result.hashtags) ? result.hashtags : [],
      cta: result.cta || '',
      suggestedFormats: Array.isArray(result.suggestedFormats) ? result.suggestedFormats : [],
    };
  } catch {
    throw new Error('Não foi possível interpretar a resposta da AI. Tenta novamente.');
  }
}

// ── Public API ──

/**
 * Analyze an asset with AI and return full content generation result.
 * Requires a valid OpenAI API key to be configured.
 */
export async function analyzeWithAI(
  asset: MediaAsset,
  projectName?: string
): Promise<AIAnalysisResult> {
  if (!asset.src) throw new Error('Asset sem imagem/vídeo');
  return callOpenAI(asset.src, asset.mediaType, asset.objective, projectName);
}

/**
 * Convert AI analysis result into a ContentPack ready to save.
 */
export function aiResultToContentPack(assetId: string, result: AIAnalysisResult): ContentPack {
  return {
    id: `pack-ai-${Date.now()}`,
    assetId,
    copies: result.copies,
    hashtags: result.hashtags,
    cta: result.cta,
    formats: result.suggestedFormats,
    generatorUsed: 'auto-copy',
    createdAt: new Date().toISOString(),
  };
}
