/**
 * Client-side asset analysis engine.
 * Generates tags, quality score, risk detection, and story from asset metadata.
 * Sprint 2: heuristic-based. Future: plug in AI API (OpenAI, etc.).
 */

import type { MediaAsset } from '@/types';

// ── Tag Suggestion ──

const TAG_KEYWORDS: Record<string, string[]> = {
  'betão': ['betao', 'betão', 'concrete', 'beton'],
  'madeira': ['madeira', 'wood', 'timber', 'mdf', 'contraplacado'],
  'vidro': ['vidro', 'glass', 'envidraçado', 'window'],
  'aço': ['aço', 'aco', 'steel', 'metal', 'metalico'],
  'pedra': ['pedra', 'stone', 'granito', 'marmore', 'calcario'],
  'cerâmica': ['ceramica', 'cerâmica', 'azulejo', 'tile', 'porcelana'],
  'exterior': ['exterior', 'fachada', 'jardim', 'terraço', 'varanda', 'outdoor'],
  'interior': ['interior', 'sala', 'quarto', 'cozinha', 'wc', 'casa-banho'],
  'minimalista': ['minimalista', 'minimal', 'clean', 'simples'],
  'contemporâneo': ['contemporâneo', 'contemporaneo', 'modern', 'moderno'],
  'moradia': ['moradia', 'house', 'villa', 'unifamiliar', 'vivenda'],
  'apartamento': ['apartamento', 'apartment', 'flat', 'loft'],
  'comercial': ['comercial', 'loja', 'escritorio', 'office', 'shop'],
  'reabilitação': ['reabilitação', 'reabilitacao', 'renovation', 'remodelação'],
  'obra': ['obra', 'construção', 'construction', 'estaleiro'],
  'render': ['render', '3d', 'visualização', 'cgi', 'archviz'],
  'detalhe': ['detalhe', 'detail', 'pormenor', 'close-up', 'macro'],
  'paisagem': ['paisagem', 'landscape', 'vista', 'panorâmica', 'natureza'],
  'iluminação': ['iluminação', 'iluminacao', 'luz', 'light', 'candeeiro'],
  'sustentável': ['sustentável', 'sustentavel', 'eco', 'verde', 'green', 'solar'],
};

export function suggestTags(asset: MediaAsset): string[] {
  const searchText = [
    asset.name,
    asset.mediaType,
    asset.objective,
    ...asset.tags,
  ].join(' ').toLowerCase();

  const suggestions = new Set<string>(asset.tags);

  for (const [tag, keywords] of Object.entries(TAG_KEYWORDS)) {
    if (keywords.some((kw) => searchText.includes(kw))) {
      suggestions.add(tag);
    }
  }

  // Add type-based tags
  if (asset.mediaType === 'obra') suggestions.add('obra');
  if (asset.mediaType === 'render') suggestions.add('render');
  if (asset.mediaType === 'detalhe') suggestions.add('detalhe');
  if (asset.mediaType === 'before-after') { suggestions.add('antes-depois'); suggestions.add('transformação'); }
  if (asset.mediaType === 'equipa') { suggestions.add('equipa'); suggestions.add('bastidores'); }

  // Objective tags
  if (asset.objective === 'portfolio') suggestions.add('portfólio');
  if (asset.objective === 'autoridade-tecnica') suggestions.add('técnico');

  return Array.from(suggestions);
}

// ── Quality Score ──

export function estimateQualityScore(asset: MediaAsset): number {
  let score = 50; // Base

  // Has image/video
  if (asset.src) score += 10;
  if (asset.thumbnail) score += 5;

  // Has dimensions (means image loaded properly)
  if (asset.dimensions) {
    const { width, height } = asset.dimensions;
    if (width >= 1920 || height >= 1920) score += 15; // HD+
    else if (width >= 1080 || height >= 1080) score += 10; // Full HD
    else if (width >= 720 || height >= 720) score += 5;
    else score -= 10; // Low res
  }

  // Rich metadata
  if (asset.tags.length >= 3) score += 5;
  if (asset.tags.length >= 6) score += 5;
  if (asset.projectId) score += 5;

  // Restrictions reduce score slightly (more work needed)
  score -= asset.restrictions.length * 2;

  return Math.max(0, Math.min(100, score));
}

// ── Risk Detection ──

export function detectRisks(asset: MediaAsset): string[] {
  const risks: string[] = [];

  // Check restrictions
  if (asset.restrictions.includes('sem-rostos')) {
    risks.push('Contém possíveis rostos — verificar antes de publicar');
  }
  if (asset.restrictions.includes('sem-moradas')) {
    risks.push('Pode conter moradas visíveis — rever imagem');
  }
  if (asset.restrictions.includes('sem-marcas')) {
    risks.push('Pode conter logótipos de terceiros — verificar');
  }
  if (asset.restrictions.includes('sem-matriculas')) {
    risks.push('Pode conter matrículas — verificar/desfocar');
  }

  // Low quality warning
  if (asset.dimensions) {
    if (asset.dimensions.width < 720 && asset.dimensions.height < 720) {
      risks.push('Resolução baixa — não recomendado para publicação');
    }
  }

  // Missing project association
  if (!asset.projectId) {
    risks.push('Sem projeto associado — dificulta organização');
  }

  return risks;
}

// ── Story Generation ──

const STORY_TEMPLATES = {
  obra: [
    'Progresso em obra: cada fase revela a visão do projeto.',
    'A construção avança — betão, aço e a promessa de um espaço transformado.',
    'Do estaleiro ao resultado: este é o processo que nos define.',
  ],
  render: [
    'Antes de existir, já se pode sentir — a magia da visualização 3D.',
    'Uma antevisão do futuro: quando o projeto ganha vida no ecrã.',
    'O render que convenceu o cliente: quando a imagem vale mais que mil palavras.',
  ],
  detalhe: [
    'É nos detalhes que se distingue a boa arquitetura.',
    'Um pormenor que faz toda a diferença: precisão e intenção.',
    'Micro-decisões, macro-impacto: o detalhe que eleva o projeto.',
  ],
  equipa: [
    'Por detrás de cada projeto, uma equipa dedicada.',
    'Bastidores: onde nasce a criatividade e se resolve a complexidade.',
    'A equipa em ação — dedicação que se traduz em qualidade.',
  ],
  'before-after': [
    'A transformação fala por si: antes e depois que inspira.',
    'De espaço esquecido a lugar que conta histórias.',
    'O poder da arquitetura: transformar o existente em extraordinário.',
  ],
};

export function generateStory(asset: MediaAsset): string {
  const templates = STORY_TEMPLATES[asset.mediaType] || STORY_TEMPLATES.obra;
  const index = Math.abs(asset.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % templates.length;
  return templates[index];
}

// ── Full Analysis ──

export interface AnalysisResult {
  tags: string[];
  qualityScore: number;
  risks: string[];
  story: string;
}

export function analyzeAsset(asset: MediaAsset): AnalysisResult {
  return {
    tags: suggestTags(asset),
    qualityScore: estimateQualityScore(asset),
    risks: detectRisks(asset),
    story: generateStory(asset),
  };
}
