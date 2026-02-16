/**
 * AI Service — OpenAI GPT-4 Vision integration.
 * Analyzes uploaded images and generates social media content automatically.
 */

import type { MediaAsset, ContentCopy, ContentChannel, ContentPack, ContentPost, MediaType, MediaObjective, ContentFocus } from '@/types';

export interface PublicationSlotInput {
  id: string;
  label: string;
  dayOfWeek: number;
  channels: ContentChannel[];
  pillar?: string;
}

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

// ── Classification (lightweight) ──

const CLASSIFY_PROMPT = `Analisa esta imagem ou frame de vídeo de arquitetura.

Classifica em EXATAMENTE uma destas categorias (mediaType):
- fotografia: fotografia real de obra concluída, espaços construídos, exteriores/interiores
- render: imagem 3D, visualização, CGI, archviz
- obra: estaleiro, construção em curso, betão, andaimes, equipamentos
- processo: sequência de trabalho, bastidores, etapas de construção
- detalhe: pormenor técnico, close-up de material, encaixe, solução construtiva
- pessoas: equipa, pessoas em obra, retrato, contexto humano
- equipa: equipa de trabalho, reunião, escritório
- before-after: transformação, antes e depois, comparação
- outros: não se enquadra nas anteriores

Objetivo mais provável (objective):
- portfolio, atrair-clientes, autoridade-tecnica, recrutamento

Foco do conteúdo (contentFocus) — trabalho e vida social crescem juntos:
- trabalho: obra, render, detalhe técnico, projeto concluído, licenciamento, resultado
- vida-social: equipa, eventos, cultura de escritório, bastidores informais, café, reuniões
- ambos: equipa em obra, reunião de projeto, bastidores com contexto técnico

Responde APENAS com JSON válido: {"mediaType":"...","objective":"...","contentFocus":"trabalho|vida-social|ambos"}`;

export interface ClassifyResult {
  mediaType: MediaType;
  objective: MediaObjective;
  contentFocus: ContentFocus;
}

const VALID_MEDIA_TYPES: MediaType[] = ['obra', 'render', 'detalhe', 'equipa', 'before-after', 'fotografia', 'processo', 'pessoas', 'outros'];
const VALID_OBJECTIVES: MediaObjective[] = ['atrair-clientes', 'portfolio', 'recrutamento', 'autoridade-tecnica'];
const VALID_CONTENT_FOCUS: ContentFocus[] = ['trabalho', 'vida-social', 'ambos'];

export async function classifyMediaWithAI(imageBase64: string): Promise<ClassifyResult> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('API key não configurada. Vai a Definições para adicionar.');

  const url = imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: CLASSIFY_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Classifica esta imagem.' },
            { type: 'image_url', image_url: { url: url, detail: 'low' } },
          ],
        },
      ],
      max_tokens: 100,
      temperature: 0.2,
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

  let jsonStr = content.trim();
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  try {
    const parsed = JSON.parse(jsonStr) as { mediaType?: string; objective?: string; contentFocus?: string };
    const mediaType = VALID_MEDIA_TYPES.includes(parsed.mediaType as MediaType) ? parsed.mediaType as MediaType : 'outros';
    const objective = VALID_OBJECTIVES.includes(parsed.objective as MediaObjective) ? parsed.objective as MediaObjective : 'portfolio';
    const contentFocus = VALID_CONTENT_FOCUS.includes(parsed.contentFocus as ContentFocus) ? parsed.contentFocus as ContentFocus : 'ambos';
    return { mediaType, objective, contentFocus };
  } catch {
    return { mediaType: 'outros', objective: 'portfolio', contentFocus: 'ambos' as ContentFocus };
  }
}

// ── Image Quality Assessment (dedicated, lightweight) ──

const QUALITY_PROMPT = `Analisa esta imagem de arquitetura APENAS para avaliar qualidade visual.

Avalia em 0-100 (qualityScore) com base em:
- composição: enquadramento, regra dos terços, equilíbrio visual
- iluminação: exposição, contraste, sombras
- nitidez: foco, resolução aparente, blur
- adequação: formato para redes sociais, interesse visual

Responde APENAS com JSON válido:
{
  "qualityScore": 0-100,
  "breakdown": {
    "composition": 0-100,
    "lighting": 0-100,
    "sharpness": 0-100,
    "suitability": 0-100
  },
  "suggestions": ["sugestão 1 em PT", "sugestão 2 em PT"]
}

suggestions: lista curta (0-3 itens) de melhorias concretas, ou [] se a imagem estiver ótima. Ex: "Exposição baixa — considerar correção", "Composição desequilibrada — crop sugerido".`;

export interface QualityAssessmentResult {
  qualityScore: number;
  breakdown: {
    composition: number;
    lighting: number;
    sharpness: number;
    suitability: number;
  };
  suggestions: string[];
}

export async function assessImageQuality(imageBase64: string): Promise<QualityAssessmentResult> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('API key não configurada. Vai a Definições para adicionar.');

  const url = imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: QUALITY_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Avalia a qualidade desta imagem.' },
            { type: 'image_url', image_url: { url: url, detail: 'low' } },
          ],
        },
      ],
      max_tokens: 300,
      temperature: 0.2,
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

  let jsonStr = content.trim();
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  try {
    const parsed = JSON.parse(jsonStr) as {
      qualityScore?: number;
      breakdown?: { composition?: number; lighting?: number; sharpness?: number; suitability?: number };
      suggestions?: string[];
    };
    const score = Math.max(0, Math.min(100, typeof parsed.qualityScore === 'number' ? parsed.qualityScore : 70));
    const b = parsed.breakdown ?? {};
    return {
      qualityScore: score,
      breakdown: {
        composition: Math.max(0, Math.min(100, b.composition ?? score)),
        lighting: Math.max(0, Math.min(100, b.lighting ?? score)),
        sharpness: Math.max(0, Math.min(100, b.sharpness ?? score)),
        suitability: Math.max(0, Math.min(100, b.suitability ?? score)),
      },
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 3) : [],
    };
  } catch {
    return {
      qualityScore: 70,
      breakdown: { composition: 70, lighting: 70, sharpness: 70, suitability: 70 },
      suggestions: [],
    };
  }
}

// ── Smart Crop (region of interest for 9:16) ──

const SMART_CROP_PROMPT = `Analisa esta imagem de arquitetura (fotografia ou render).

O utilizador quer converter para formato vertical 9:16 (Stories, Reels, TikTok) sem cortar o elemento principal.

Indica a MELHOR região para crop. A região deve:
- Ter proporção exata 9:16 (width/height = 9/16)
- Centrar no elemento principal (edifício, fachada, detalhe, composição)
- Evitar cortar partes importantes (ex.: topo do edifício, base, contexto essencial)
- Para imagens paisagem: escolhe a faixa horizontal que melhor representa a cena

Responde APENAS com JSON válido: {"x":0.0-1.0,"y":0.0-1.0,"width":0.0-1.0,"height":0.0-1.0}
- x, y = canto superior esquerdo da região (0=esquerda/topo, 1=direita/baixo)
- width, height = dimensões da região
- OBRIGATÓRIO: width/height = 9/16 (ex.: width=0.5625, height=1.0)`;

export interface SmartCropResult {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function suggestSmartCrop(imageBase64: string): Promise<SmartCropResult> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('API key não configurada. Vai a Definições para adicionar.');

  const url = imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SMART_CROP_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Indica a região de crop para formato vertical 9:16.' },
            { type: 'image_url', image_url: { url: url, detail: 'high' } },
          ],
        },
      ],
      max_tokens: 100,
      temperature: 0.2,
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

  let jsonStr = content.trim();
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  try {
    const parsed = JSON.parse(jsonStr) as { x?: number; y?: number; width?: number; height?: number };
    const x = Math.max(0, Math.min(1, typeof parsed.x === 'number' ? parsed.x : 0));
    const y = Math.max(0, Math.min(1, typeof parsed.y === 'number' ? parsed.y : 0));
    let width = typeof parsed.width === 'number' ? Math.max(0.01, Math.min(1, parsed.width)) : 0.5625;
    let height = typeof parsed.height === 'number' ? Math.max(0.01, Math.min(1, parsed.height)) : 1;

    // enforce 9:16 aspect
    const targetAspect = 9 / 16;
    if (Math.abs(width / height - targetAspect) > 0.05) {
      height = 1;
      width = targetAspect;
      if (width > 1) {
        width = 1;
        height = 1 / targetAspect;
      }
    }

    return { x, y, width, height };
  } catch {
    return { x: 0.2, y: 0, width: 9 / 16, height: 1 };
  }
}

// ── Feed Mix (AI scheduling) ──

export interface FeedMixSuggestion {
  slotId: string;
  assetId: string;
  channel: ContentChannel;
  date: string;
  reason: string;
}

function getNextSlotDate(from: Date, dayOfWeek: number, weekOffset: number): Date {
  const d = new Date(from);
  d.setDate(d.getDate() + ((dayOfWeek - d.getDay() + 7) % 7) + weekOffset * 7);
  if (weekOffset === 0 && d < from) d.setDate(d.getDate() + 7);
  return d;
}

export async function suggestFeedMix(
  assets: MediaAsset[],
  slots: PublicationSlotInput[],
  existingPosts: { assetId?: string; scheduledDate?: string; slotId?: string }[],
  weeksAhead = 4
): Promise<FeedMixSuggestion[]> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('API key não configurada. Vai a Definições para adicionar.');

  const usedAssetIds = new Set(existingPosts.filter((p) => p.assetId).map((p) => p.assetId!));
  const filledDates = new Set(existingPosts.filter((p) => p.scheduledDate).map((p) => p.scheduledDate!.slice(0, 10)));
  const today = new Date();

  const available = assets.filter(
    (a) => (a.status === 'pronto' || a.status === 'analisado') && !usedAssetIds.has(a.id)
  );

  if (available.length === 0) return [];

  const openSlots: { slotId: string; date: string; label: string; channels: ContentChannel[] }[] = [];
  for (let week = 0; week < weeksAhead; week++) {
    for (const slot of slots) {
      const date = getNextSlotDate(today, slot.dayOfWeek, week);
      const dateStr = date.toISOString().slice(0, 10);
      if (filledDates.has(dateStr)) continue;
      openSlots.push({
        slotId: slot.id,
        date: dateStr,
        label: slot.label,
        channels: slot.channels,
      });
    }
  }

  if (openSlots.length === 0) return [];

  const assetList = available.map((a) => ({
    id: a.id,
    name: a.name,
    type: a.type,
    mediaType: a.mediaType,
    contentFocus: a.contentFocus ?? 'ambos',
    tags: a.tags.slice(0, 5),
    quality: a.qualityScore,
  }));

  const prompt = `Sugere a melhor combinação de publicações.

ASSETS DISPONÍVEIS (cada um só pode ser usado uma vez):
${JSON.stringify(assetList, null, 2)}

SLOTS A PREENCHER (com data):
${JSON.stringify(openSlots, null, 2)}

REGRAS:
- Equilibra imagens e vídeos (máx 3 vídeos por semana)
- Equilibra trabalho e vida social: contentFocus "trabalho" vs "vida-social" vs "ambos" — ambos crescem juntos, evita semanas só com conteúdo de trabalho
- Vídeos: melhores para ig-reels, tiktok, ig-stories, youtube
- Imagens: melhores para ig-feed, linkedin, pinterest, ig-carrossel
- Escolhe o canal mais adequado de slot.channels para cada asset
- Evita repetir o mesmo projeto em dias consecutivos
- Distribui os melhores assets (quality alto) pelos slots mais relevantes

Responde APENAS com JSON: {"suggestions":[{"slotId":"...","assetId":"...","channel":"ig-feed","date":"YYYY-MM-DD","reason":"..."}]}
Uma sugestão por slot. Usa cada asset no máximo uma vez.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.5,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = (err as { error?: { message?: string } })?.error?.message || `HTTP ${response.status}`;
    throw new Error(`OpenAI API erro: ${msg}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) return [];

  let jsonStr = content.trim();
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  try {
    const parsed = JSON.parse(jsonStr) as { suggestions?: FeedMixSuggestion[] };
    const list = Array.isArray(parsed.suggestions) ? parsed.suggestions : [];
    const validAssetIds = new Set(available.map((a) => a.id));
    const validSlotIds = new Set(slots.map((s) => s.id));
    const validChannels: ContentChannel[] = ['ig-feed', 'ig-reels', 'ig-stories', 'ig-carrossel', 'linkedin', 'tiktok', 'pinterest', 'youtube', 'threads'];

    const seen = new Set<string>();
    return list.filter((s) => {
      if (!validSlotIds.has(s.slotId) || !validAssetIds.has(s.assetId) || !validChannels.includes(s.channel) || !s.date) return false;
      if (seen.has(s.assetId)) return false;
      seen.add(s.assetId);
      return true;
    });
  } catch {
    return [];
  }
}

/**
 * Converts AI feed mix suggestions to ContentPost format for the Planner.
 */
export function feedMixToPosts(suggestions: FeedMixSuggestion[]): Omit<ContentPost, 'id'>[] {
  return suggestions.map((s) => ({
    assetId: s.assetId,
    slotId: s.slotId,
    channel: s.channel,
    format: '1:1',
    copyPt: '',
    copyEn: '',
    hashtags: [],
    cta: '',
    status: 'inbox' as const,
    scheduledDate: s.date,
    createdAt: new Date().toISOString(),
  }));
}

/**
 * Enriches posts with copy, hashtags and CTA from content packs.
 */
export function enrichPostsWithPackCopy(
  posts: Omit<ContentPost, 'id'>[],
  packs: ContentPack[]
): Omit<ContentPost, 'id'>[] {
  const packByAsset = new Map(packs.map((p) => [p.assetId, p]));
  return posts.map((post) => {
    const pack = post.assetId ? packByAsset.get(post.assetId) : null;
    const copyPt = pack?.copies.find((c) => c.lang === 'pt' && c.channel === post.channel)?.text ?? '';
    const copyEn = pack?.copies.find((c) => c.lang === 'en' && c.channel === post.channel)?.text ?? '';
    return {
      ...post,
      contentPackId: pack?.id,
      copyPt,
      copyEn,
      hashtags: pack?.hashtags ?? post.hashtags,
      cta: pack?.cta ?? post.cta,
    };
  });
}

// ── Articulation (narrative + order) ──

export interface ArticulationResult {
  narrative: string;
  suggestedOrder: string[];
}

/**
 * Generates a coherent narrative and suggested publishing order for a set of assets.
 */
export async function generateArticulation(
  assets: { id: string; name: string; tags: string[]; mediaType?: string; story?: string }[],
  projectName?: string
): Promise<ArticulationResult> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('API key não configurada. Vai a Definições para adicionar.');

  const assetList = assets.map((a) => ({
    id: a.id,
    name: a.name,
    tags: a.tags.slice(0, 8),
    mediaType: a.mediaType,
    story: a.story,
  }));

  const prompt = `Tens um conjunto de imagens/vídeos de arquitetura para publicar nas redes sociais.
${projectName ? `Projeto: ${projectName}\n` : ''}

ASSETS:
${JSON.stringify(assetList, null, 2)}

Gera:
1. narrative: Uma narrativa curta (2-4 frases) que articula estes conteúdos como uma série coesa. Liga trabalho e vida social — ambos crescem juntos. Tom da FERREIRA ARQUITETOS: profissional, acessível, foco em processo e resultado.
2. suggestedOrder: Array de IDs dos assets na ordem ideal de publicação (do primeiro ao último).

Responde APENAS com JSON válido:
{"narrative":"...","suggestedOrder":["id1","id2",...]}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
      temperature: 0.6,
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

  let jsonStr = content.trim();
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  try {
    const parsed = JSON.parse(jsonStr) as { narrative?: string; suggestedOrder?: string[] };
    const narrative = typeof parsed.narrative === 'string' ? parsed.narrative : '';
    const suggestedOrder = Array.isArray(parsed.suggestedOrder) ? parsed.suggestedOrder : assets.map((a) => a.id);
    const validIds = new Set(assets.map((a) => a.id));
    const filteredOrder = suggestedOrder.filter((id) => validIds.has(id));
    const missing = assets.filter((a) => !filteredOrder.includes(a.id)).map((a) => a.id);
    return { narrative, suggestedOrder: [...filteredOrder, ...missing] };
  } catch {
    return { narrative: '', suggestedOrder: assets.map((a) => a.id) };
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
