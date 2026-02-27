/**
 * Content generators for the Content Factory.
 * Generator A: Technical post (no image needed)
 * Generator B: Construction narrative
 * Generator C: Intelligent recycling (video → multi-format)
 */

import type { ContentCopy, ContentChannel, MediaAsset, EditorialDNA, EditorialFormat } from '@/types';

// ── Channel Templates ──

const CHANNEL_LIMITS: Record<ContentChannel, { maxChars: number; hashtagLimit: number }> = {
  'ig-feed': { maxChars: 2200, hashtagLimit: 15 },
  'ig-reels': { maxChars: 2200, hashtagLimit: 10 },
  'ig-stories': { maxChars: 200, hashtagLimit: 3 },
  'ig-carrossel': { maxChars: 2200, hashtagLimit: 15 },
  'linkedin': { maxChars: 3000, hashtagLimit: 5 },
  'tiktok': { maxChars: 300, hashtagLimit: 5 },
  'pinterest': { maxChars: 500, hashtagLimit: 10 },
  'youtube': { maxChars: 5000, hashtagLimit: 15 },
  'threads': { maxChars: 500, hashtagLimit: 5 },
};

// ── Generator A: Technical Post (no image) ──

interface TechPostInput {
  topic: string;
  pillar?: string;
  voice?: string;
  editorialDNA?: EditorialDNA | null;
}

export interface TechPostOutput {
  slides: { pt: string; en: string }[];
  copies: ContentCopy[];
  hashtags: string[];
}

const TECH_TOPICS: Record<string, { slidesPt: string[]; slidesEn: string[] }> = {
  'licenciamento': {
    slidesPt: [
      '3 erros comuns em licenciamento',
      '1. Não verificar o PDM antes de projetar → recuo ou rejeição.',
      '2. Esquecer as especialidades → atraso de semanas.',
      '3. Documentação incompleta → pedidos de esclarecimento infinitos.',
      'Solução: checklist pré-submissão com 27 pontos.',
    ],
    slidesEn: [
      '3 common licensing mistakes',
      '1. Not checking the municipal plan before designing → setback or rejection.',
      '2. Forgetting specialty projects → weeks of delay.',
      '3. Incomplete documentation → endless clarification requests.',
      'Solution: 27-point pre-submission checklist.',
    ],
  },
  'custo-m2': {
    slidesPt: [
      'Como estimar custo por m² sem cair em tretas',
      '1. Custo base ≠ custo final. Inclui sempre +15-25% para imprevistos.',
      '2. Acabamentos fazem 40% do custo total.',
      '3. Localização afeta preço: litoral vs interior = ±20%.',
      'Pede sempre 3 orçamentos. Compara escopo, não só preço.',
    ],
    slidesEn: [
      'How to estimate cost per m² without getting fooled',
      '1. Base cost ≠ final cost. Always add +15-25% for contingencies.',
      '2. Finishes account for 40% of total cost.',
      '3. Location affects price: coastal vs interior = ±20%.',
      'Always get 3 quotes. Compare scope, not just price.',
    ],
  },
  'manutencao': {
    slidesPt: [
      '5 decisões que reduzem manutenção',
      '1. Caixilharia em alumínio lacado vs madeira → -80% manutenção.',
      '2. Deck compósito vs madeira natural → sem tratamento anual.',
      '3. Telhado ventilado → menos condensação e bolor.',
      '4. Impermeabilização dupla → previne infiltrações.',
      '5. Domótica preventiva → alertas antes do problema.',
    ],
    slidesEn: [
      '5 decisions that reduce maintenance',
      '1. Lacquered aluminium frames vs wood → -80% maintenance.',
      '2. Composite deck vs natural wood → no annual treatment.',
      '3. Ventilated roof → less condensation and mould.',
      '4. Double waterproofing → prevents leaks.',
      '5. Preventive home automation → alerts before the problem.',
    ],
  },
};

export function generateTechPost(input: TechPostInput): TechPostOutput {
  const topicKey = Object.keys(TECH_TOPICS).find((k) => input.topic.toLowerCase().includes(k)) || Object.keys(TECH_TOPICS)[0];
  const topic = TECH_TOPICS[topicKey];

  const slides = topic.slidesPt.map((pt, i) => ({ pt, en: topic.slidesEn[i] || pt }));

  const fullPt = topic.slidesPt.join('\n\n');
  const fullEn = topic.slidesEn.join('\n\n');

  const copies: ContentCopy[] = [
    { lang: 'pt', channel: 'ig-carrossel', text: `${fullPt}\n\n💡 Guarda este post para consultar depois.\n\n#arquitetura #portugal #construção` },
    { lang: 'en', channel: 'ig-carrossel', text: `${fullEn}\n\n💡 Save this post for later.\n\n#architecture #portugal #construction` },
    { lang: 'pt', channel: 'linkedin', text: `${fullPt}\n\n---\nNa FERREIRARQUITETOS, transformamos complexidade técnica em decisões claras.\n\n#arquitetura #engenharia #portugal` },
    { lang: 'en', channel: 'linkedin', text: `${fullEn}\n\n---\nAt FERREIRARQUITETOS, we turn technical complexity into clear decisions.\n\n#architecture #engineering #portugal` },
    { lang: 'pt', channel: 'threads', text: topic.slidesPt.slice(0, 3).join('\n\n') },
    { lang: 'en', channel: 'threads', text: topic.slidesEn.slice(0, 3).join('\n\n') },
  ];

  return {
    slides,
    copies,
    hashtags: ['#arquitetura', '#portugal', '#construção', '#projetodearquitetura', '#dicas'],
  };
}

// ── Generator B: Construction Narrative ──

interface NarrativeInput {
  asset: MediaAsset;
  projectName?: string;
}

export interface NarrativeOutput {
  copies: ContentCopy[];
  timeline: { phase: string; descriptionPt: string; descriptionEn: string }[];
  hashtags: string[];
}

export function generateNarrative(input: NarrativeInput): NarrativeOutput {
  const { asset, projectName } = input;
  const proj = projectName || 'o projeto';

  const timeline = [
    { phase: 'Problema', descriptionPt: `O desafio em ${proj}: como transformar o espaço existente mantendo a identidade do lugar.`, descriptionEn: `The challenge in ${proj}: how to transform the existing space while keeping the identity of the place.` },
    { phase: 'Decisão', descriptionPt: `A solução surgiu da análise do terreno e das necessidades do cliente. Cada decisão reflete semanas de estudo.`, descriptionEn: `The solution came from site analysis and client needs. Each decision reflects weeks of study.` },
    { phase: 'Execução', descriptionPt: `A obra avança: betão, estrutura, e os primeiros sinais do que será o resultado final.`, descriptionEn: `Construction progresses: concrete, structure, and the first signs of the final result.` },
    { phase: 'Resultado', descriptionPt: `O espaço transformado. Cada detalhe conta a história de um processo rigoroso.`, descriptionEn: `The transformed space. Every detail tells the story of a rigorous process.` },
  ];

  const storyPt = timeline.map((t) => `${t.phase}: ${t.descriptionPt}`).join('\n\n');
  const storyEn = timeline.map((t) => `${t.phase}: ${t.descriptionEn}`).join('\n\n');

  const copies: ContentCopy[] = [
    { lang: 'pt', channel: 'ig-reels', text: `📐 ${proj}\n\n${asset.story || storyPt.slice(0, 200)}\n\nDo problema à solução — é assim que trabalhamos.\n\n#obraemarquitetura #antesedepois` },
    { lang: 'en', channel: 'ig-reels', text: `📐 ${proj}\n\n${storyEn.slice(0, 200)}\n\nFrom problem to solution — this is how we work.\n\n#constructionsite #beforeandafter` },
    { lang: 'pt', channel: 'ig-stories', text: `Diário de obra: ${proj}\nProblema → Decisão → Execução → Resultado\nDesliza ↑` },
    { lang: 'en', channel: 'ig-stories', text: `Construction diary: ${proj}\nProblem → Decision → Execution → Result\nSwipe up ↑` },
    { lang: 'pt', channel: 'linkedin', text: `Diário de obra: ${proj}\n\n${storyPt}\n\nCada projeto é uma história. Esta é uma delas.\n\n#arquitetura #obra #portugal` },
    { lang: 'en', channel: 'linkedin', text: `Construction diary: ${proj}\n\n${storyEn}\n\nEvery project is a story. This is one of them.\n\n#architecture #construction #portugal` },
    { lang: 'pt', channel: 'tiktok', text: `Do problema ao resultado em ${proj} 📐🏗️ #arquitetura #obra #antesedepois` },
    { lang: 'en', channel: 'tiktok', text: `From problem to result in ${proj} 📐🏗️ #architecture #construction #beforeandafter` },
  ];

  return {
    copies,
    timeline,
    hashtags: ['#arquitetura', '#obra', '#antesedepois', '#construção', '#portugal', '#ferreira'],
  };
}

// ── Generator C: Intelligent Recycling ──

interface RecycleInput {
  asset: MediaAsset;
  projectName?: string;
}

export interface RecycleOutput {
  derivatives: { format: string; channel: ContentChannel; descriptionPt: string; descriptionEn: string; ratio: string }[];
  copies: ContentCopy[];
  hashtags: string[];
}

export function generateRecycledContent(input: RecycleInput): RecycleOutput {
  const { asset, projectName } = input;
  const proj = projectName || asset.name;

  const derivatives = [
    { format: 'Reels (15-25s)', channel: 'ig-reels' as ContentChannel, descriptionPt: 'Corte principal com texto animado', descriptionEn: 'Main cut with animated text', ratio: '9:16' },
    { format: 'Short 1 (6-10s)', channel: 'tiktok' as ContentChannel, descriptionPt: 'Teaser rápido — melhor momento', descriptionEn: 'Quick teaser — best moment', ratio: '9:16' },
    { format: 'Short 2 (6-10s)', channel: 'tiktok' as ContentChannel, descriptionPt: 'Detalhe técnico em destaque', descriptionEn: 'Technical detail highlight', ratio: '9:16' },
    { format: 'Short 3 (6-10s)', channel: 'youtube' as ContentChannel, descriptionPt: 'Resultado final reveal', descriptionEn: 'Final result reveal', ratio: '9:16' },
    { format: 'Story 1', channel: 'ig-stories' as ContentChannel, descriptionPt: 'Introdução + pergunta', descriptionEn: 'Introduction + question', ratio: '9:16' },
    { format: 'Story 2', channel: 'ig-stories' as ContentChannel, descriptionPt: 'Progresso / processo', descriptionEn: 'Progress / process', ratio: '9:16' },
    { format: 'Story 3', channel: 'ig-stories' as ContentChannel, descriptionPt: 'Detalhe close-up', descriptionEn: 'Close-up detail', ratio: '9:16' },
    { format: 'Story 4', channel: 'ig-stories' as ContentChannel, descriptionPt: 'Resultado + CTA', descriptionEn: 'Result + CTA', ratio: '9:16' },
    { format: 'Story 5', channel: 'ig-stories' as ContentChannel, descriptionPt: 'Bastidores / equipa', descriptionEn: 'Behind the scenes / team', ratio: '9:16' },
    { format: 'Post LinkedIn', channel: 'linkedin' as ContentChannel, descriptionPt: 'Lição aprendida (texto longo)', descriptionEn: 'Lesson learned (long text)', ratio: '16:9' },
    { format: 'Pin Pinterest', channel: 'pinterest' as ContentChannel, descriptionPt: 'Imagem vertical + título', descriptionEn: 'Vertical image + title', ratio: '2:3' },
    { format: 'Threads', channel: 'threads' as ContentChannel, descriptionPt: 'Micro-narrativa (≤500 chars)', descriptionEn: 'Micro-narrative (≤500 chars)', ratio: '1:1' },
  ];

  const copies: ContentCopy[] = [
    { lang: 'pt', channel: 'ig-reels', text: `${proj} — o processo completo em 20 segundos.\n\nGuarda para inspiração 🔖\n\n#arquitetura #reels #processo` },
    { lang: 'en', channel: 'ig-reels', text: `${proj} — the full process in 20 seconds.\n\nSave for inspiration 🔖\n\n#architecture #reels #process` },
    { lang: 'pt', channel: 'tiktok', text: `${proj} — o melhor momento em 10 segundos. 🔥\n\n#arquitetura #portugal #processo` },
    { lang: 'en', channel: 'tiktok', text: `${proj} — the best moment in 10 seconds. 🔥\n\n#architecture #portugal #process` },
    { lang: 'pt', channel: 'youtube', text: `${proj} — resultado final.\n\nO projeto completo em vídeo. Subscreve para mais conteúdo de arquitetura.` },
    { lang: 'en', channel: 'youtube', text: `${proj} — final result.\n\nThe complete project on video. Subscribe for more architecture content.` },
    { lang: 'pt', channel: 'ig-stories', text: `📐 ${proj}\n\nDesliza para ver o processo completo →` },
    { lang: 'en', channel: 'ig-stories', text: `📐 ${proj}\n\nSwipe to see the full process →` },
    { lang: 'pt', channel: 'linkedin', text: `O que ${proj} me ensinou:\n\nCada projeto traz lições. Esta é uma das mais importantes: o processo importa tanto quanto o resultado.\n\nQuando investimos tempo em planear, a execução flui. Quando cortamos atalhos, pagamos depois.\n\n#arquitetura #liderança #portugal` },
    { lang: 'en', channel: 'linkedin', text: `What ${proj} taught me:\n\nEvery project brings lessons. This is one of the most important: the process matters as much as the result.\n\nWhen we invest time in planning, execution flows. When we cut corners, we pay later.\n\n#architecture #leadership #portugal` },
    { lang: 'pt', channel: 'pinterest', text: `${proj} | Arquitetura contemporânea em Portugal | FERREIRARQUITETOS` },
    { lang: 'en', channel: 'pinterest', text: `${proj} | Contemporary architecture in Portugal | FERREIRARQUITETOS` },
    { lang: 'pt', channel: 'threads', text: `${proj}.\n\nO tipo de projeto que nos lembra porquê fazemos o que fazemos. Cada decisão, cada detalhe — com propósito.` },
    { lang: 'en', channel: 'threads', text: `${proj}.\n\nThe kind of project that reminds us why we do what we do. Every decision, every detail — with purpose.` },
  ];

  return {
    derivatives,
    copies,
    hashtags: ['#arquitetura', '#portugal', '#reels', '#processo', '#ferreira', '#design'],
  };
}
