/**
 * Platform Agent — Internal AI agent for FA-360.
 * Monitors health, detects issues, suggests improvements,
 * and generates reports for Cursor communication.
 */

import type { AppData } from './storage';
import { hasApiKey, getApiKey } from './ai';

// ── Types ──

export type Severity = 'critical' | 'warning' | 'info' | 'success';

export interface DiagnosticItem {
  id: string;
  category: 'data' | 'content' | 'performance' | 'security' | 'usage' | 'storage';
  severity: Severity;
  title: string;
  description: string;
  suggestion: string;
  autoFixable: boolean;
}

export interface HealthScore {
  overall: number; // 0-100
  data: number;
  content: number;
  security: number;
  usage: number;
  storage: number;
}

export interface PlatformReport {
  generatedAt: string;
  healthScore: HealthScore;
  diagnostics: DiagnosticItem[];
  stats: PlatformStats;
  improvements: ImprovementSuggestion[];
  cursorPrompt: string; // Ready-to-paste prompt for Cursor
}

export interface PlatformStats {
  totalClients: number;
  totalProjects: number;
  totalProposals: number;
  totalAssets: number;
  totalPosts: number;
  totalContentPacks: number;
  assetsWithoutTags: number;
  assetsUnclassified: number;
  postsInPipeline: number;
  postsPublished: number;
  storageUsedKB: number;
  storageMaxKB: number;
  aiConfigured: boolean;
}

export interface ImprovementSuggestion {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  effort: string;
  impact: string;
}

// ── Diagnostics Engine ──

function runDiagnostics(data: AppData): DiagnosticItem[] {
  const items: DiagnosticItem[] = [];
  let idx = 0;
  const add = (item: Omit<DiagnosticItem, 'id'>) => {
    items.push({ ...item, id: `diag-${++idx}` });
  };

  // ── Data Integrity ──

  // Orphan projects (client doesn't exist)
  data.projects.forEach((p) => {
    if (p.client && !data.clients.find((c) => c.name === p.client)) {
      add({
        category: 'data', severity: 'warning',
        title: `Projeto "${p.name}" com cliente inexistente`,
        description: `O projeto referencia o cliente "${p.client}" que não existe na base de dados.`,
        suggestion: 'Criar o cliente ou corrigir a referência no projeto.',
        autoFixable: false,
      });
    }
  });

  // Proposals without valid client
  data.proposals.forEach((p) => {
    if (p.clientId && !data.clients.find((c) => c.id === p.clientId)) {
      add({
        category: 'data', severity: 'warning',
        title: `Proposta de "${p.clientName}" com clientId inválido`,
        description: `A proposta ${p.id} referencia clientId "${p.clientId}" que não existe.`,
        suggestion: 'Verificar e corrigir a ligação cliente-proposta.',
        autoFixable: false,
      });
    }
  });

  // Empty clients (no projects)
  const emptyClients = data.clients.filter((c) => !c.projects || c.projects.length === 0);
  if (emptyClients.length > 0) {
    add({
      category: 'data', severity: 'info',
      title: `${emptyClients.length} cliente(s) sem projetos associados`,
      description: `Clientes sem nenhum projeto: ${emptyClients.map((c) => c.name).join(', ')}.`,
      suggestion: 'Associar projetos a estes clientes ou remover se forem irrelevantes.',
      autoFixable: false,
    });
  }

  // Duplicate client names
  const nameCount: Record<string, number> = {};
  data.clients.forEach((c) => { nameCount[c.name.toLowerCase()] = (nameCount[c.name.toLowerCase()] || 0) + 1; });
  const dupes = Object.entries(nameCount).filter(([, v]) => v > 1);
  if (dupes.length > 0) {
    add({
      category: 'data', severity: 'warning',
      title: `${dupes.length} nome(s) de cliente duplicado(s)`,
      description: `Nomes repetidos: ${dupes.map(([k]) => k).join(', ')}.`,
      suggestion: 'Unificar registos duplicados para evitar confusão.',
      autoFixable: false,
    });
  }

  // ── Content Health ──

  const unclassified = data.mediaAssets.filter((a) => a.status === 'por-classificar');
  if (unclassified.length > 0) {
    add({
      category: 'content', severity: unclassified.length > 10 ? 'warning' : 'info',
      title: `${unclassified.length} asset(s) por classificar`,
      description: 'Media carregada mas ainda sem análise ou classificação.',
      suggestion: 'Usa o botão "AI Analisar Todos" na Media Inbox para processar automaticamente.',
      autoFixable: true,
    });
  }

  const noTags = data.mediaAssets.filter((a) => !a.tags || a.tags.length === 0);
  if (noTags.length > 0) {
    add({
      category: 'content', severity: 'info',
      title: `${noTags.length} asset(s) sem tags`,
      description: 'Assets sem tags dificultam pesquisa e sugestão automática.',
      suggestion: 'Executar análise AI ou adicionar tags manualmente.',
      autoFixable: true,
    });
  }

  const noCopy = data.mediaAssets.filter((a) =>
    a.status !== 'rascunho' && !data.contentPacks.find((cp) => cp.assetId === a.id)
  );
  if (noCopy.length > 0) {
    add({
      category: 'content', severity: 'info',
      title: `${noCopy.length} asset(s) sem copy gerada`,
      description: 'Assets analisados mas sem conteúdo gerado para publicação.',
      suggestion: 'Abre cada asset e clica "Gerar Copy" ou usa o AI Copilot.',
      autoFixable: true,
    });
  }

  // Posts stuck in pipeline
  const stuck = data.contentPosts.filter((p) =>
    ['inbox', 'generated'].includes(p.status) &&
    new Date(p.createdAt).getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000
  );
  if (stuck.length > 0) {
    add({
      category: 'content', severity: 'warning',
      title: `${stuck.length} post(s) parado(s) há mais de 7 dias`,
      description: 'Posts no Kanban sem progresso — podem estar esquecidos.',
      suggestion: 'Revê o Planner e avança ou elimina posts estagnados.',
      autoFixable: false,
    });
  }

  // ── Security ──

  const riskyAssets = data.mediaAssets.filter((a) => a.risks && a.risks.length > 0 && a.status !== 'rascunho');
  if (riskyAssets.length > 0) {
    add({
      category: 'security', severity: 'warning',
      title: `${riskyAssets.length} asset(s) com riscos detectados`,
      description: `Assets com alertas de segurança (rostos, moradas, marcas, etc.).`,
      suggestion: 'Revê e resolve os riscos antes de publicar.',
      autoFixable: false,
    });
  }

  if (!hasApiKey()) {
    add({
      category: 'security', severity: 'info',
      title: 'AI Copilot não configurado',
      description: 'Sem API key da OpenAI — a análise automática está desativada.',
      suggestion: 'Configura a API key nas definições da Media Inbox.',
      autoFixable: false,
    });
  }

  // ── Storage ──

  let storageUsed = 0;
  try {
    const rawStorage = localStorage.getItem('fa360_data');
    storageUsed = rawStorage ? new Blob([rawStorage]).size : 0;
  } catch { /* */ }
  const storageKB = Math.round(storageUsed / 1024);
  const maxKB = 5120; // ~5MB typical localStorage limit

  if (storageKB > maxKB * 0.8) {
    add({
      category: 'storage', severity: 'critical',
      title: `Armazenamento a ${Math.round((storageKB / maxKB) * 100)}% da capacidade`,
      description: `Estás a usar ${storageKB}KB de ~${maxKB}KB disponíveis.`,
      suggestion: 'Exporta um backup e limpa assets antigos, ou migra para um backend.',
      autoFixable: false,
    });
  } else if (storageKB > maxKB * 0.5) {
    add({
      category: 'storage', severity: 'warning',
      title: `Armazenamento a ${Math.round((storageKB / maxKB) * 100)}%`,
      description: `${storageKB}KB utilizados. Considera reduzir imagens Base64 grandes.`,
      suggestion: 'Remove assets antigos ou usa thumbnails mais pequenos.',
      autoFixable: false,
    });
  }

  // ── Usage ──

  if (data.mediaAssets.length === 0) {
    add({
      category: 'usage', severity: 'info',
      title: 'Nenhum media carregado',
      description: 'A Content Factory está vazia — começa com o primeiro upload.',
      suggestion: 'Vai à Media Inbox e faz upload de imagens de obra, renders ou detalhes.',
      autoFixable: false,
    });
  }

  if (data.contentPosts.length === 0 && data.mediaAssets.length > 0) {
    add({
      category: 'usage', severity: 'info',
      title: 'Nenhum post no Planner',
      description: 'Tens assets mas nenhum post criado para publicação.',
      suggestion: 'Abre um asset, gera copy e envia para o Planner.',
      autoFixable: false,
    });
  }

  const published = data.contentPosts.filter((p) => p.status === 'published');
  const withMetrics = published.filter((p) => p.metrics);
  if (published.length > 0 && withMetrics.length < published.length * 0.5) {
    add({
      category: 'usage', severity: 'info',
      title: `${published.length - withMetrics.length} post(s) publicado(s) sem métricas`,
      description: 'Posts publicados sem registo de performance — perdes insights.',
      suggestion: 'Vai ao Performance Loop e regista métricas para cada post publicado.',
      autoFixable: false,
    });
  }

  // No diagnostics = healthy
  if (items.length === 0) {
    add({
      category: 'data', severity: 'success',
      title: 'Plataforma saudável',
      description: 'Nenhum problema detectado. Tudo a funcionar correctamente.',
      suggestion: 'Continua o bom trabalho!',
      autoFixable: false,
    });
  }

  return items;
}

// ── Health Score ──

function calculateHealth(diagnostics: DiagnosticItem[]): HealthScore {
  const byCategory: Record<string, DiagnosticItem[]> = { data: [], content: [], security: [], usage: [], storage: [] };
  diagnostics.forEach((d) => {
    if (byCategory[d.category]) byCategory[d.category].push(d);
  });

  const categoryScore = (items: DiagnosticItem[]): number => {
    if (items.length === 0) return 100;
    let score = 100;
    items.forEach((i) => {
      if (i.severity === 'critical') score -= 30;
      else if (i.severity === 'warning') score -= 15;
      else if (i.severity === 'info') score -= 5;
    });
    return Math.max(0, score);
  };

  const scores = {
    data: categoryScore(byCategory.data),
    content: categoryScore(byCategory.content),
    security: categoryScore(byCategory.security),
    usage: categoryScore(byCategory.usage),
    storage: categoryScore(byCategory.storage),
  };

  return {
    ...scores,
    overall: Math.round((scores.data + scores.content + scores.security + scores.usage + scores.storage) / 5),
  };
}

// ── Stats ──

function collectStats(data: AppData): PlatformStats {
  let storageUsed = 0;
  try {
    const raw = localStorage.getItem('fa360_data');
    storageUsed = raw ? new Blob([raw]).size : 0;
  } catch { /* */ }

  return {
    totalClients: data.clients.length,
    totalProjects: data.projects.length,
    totalProposals: data.proposals.length,
    totalAssets: data.mediaAssets.length,
    totalPosts: data.contentPosts.length,
    totalContentPacks: data.contentPacks.length,
    assetsWithoutTags: data.mediaAssets.filter((a) => !a.tags || a.tags.length === 0).length,
    assetsUnclassified: data.mediaAssets.filter((a) => a.status === 'por-classificar').length,
    postsInPipeline: data.contentPosts.filter((p) => !['published', 'scheduled'].includes(p.status)).length,
    postsPublished: data.contentPosts.filter((p) => p.status === 'published').length,
    storageUsedKB: Math.round(storageUsed / 1024),
    storageMaxKB: 5120,
    aiConfigured: hasApiKey(),
  };
}

// ── Improvement Suggestions ──

function generateImprovements(data: AppData, stats: PlatformStats): ImprovementSuggestion[] {
  const suggestions: ImprovementSuggestion[] = [];
  let idx = 0;

  if (!stats.aiConfigured) {
    suggestions.push({ id: `imp-${++idx}`, priority: 'high', title: 'Ativar AI Copilot', description: 'Configura a API key da OpenAI para análise automática de imagens e geração de conteúdo.', effort: '2 minutos', impact: 'Automatiza 80% do trabalho de classificação e copy.' });
  }

  if (stats.totalAssets > 0 && stats.assetsUnclassified > stats.totalAssets * 0.3) {
    suggestions.push({ id: `imp-${++idx}`, priority: 'high', title: 'Classificar assets pendentes', description: `${stats.assetsUnclassified} de ${stats.totalAssets} assets estão por classificar.`, effort: '5-10 minutos', impact: 'Desbloqueia o pipeline de conteúdo.' });
  }

  if (stats.totalAssets > 5 && stats.totalPosts === 0) {
    suggestions.push({ id: `imp-${++idx}`, priority: 'high', title: 'Criar primeiro plano editorial', description: 'Tens assets suficientes para começar a planear publicações.', effort: '15 minutos', impact: 'Começa a gerar valor nas redes sociais.' });
  }

  if (stats.postsPublished > 3 && stats.postsPublished > data.contentPosts.filter((p) => p.metrics).length * 2) {
    suggestions.push({ id: `imp-${++idx}`, priority: 'medium', title: 'Registar métricas de posts', description: 'Tens posts publicados sem métricas registadas — estás a perder insights.', effort: '5 minutos/post', impact: 'Permite recomendações baseadas em dados reais.' });
  }

  if (stats.storageUsedKB > stats.storageMaxKB * 0.5) {
    suggestions.push({ id: `imp-${++idx}`, priority: 'medium', title: 'Otimizar armazenamento', description: 'O localStorage está acima de 50%. Considera comprimir imagens ou migrar para backend.', effort: '30 minutos', impact: 'Evita perda de dados e erros de quota.' });
  }

  if (stats.totalClients > 0 && stats.totalProposals === 0) {
    suggestions.push({ id: `imp-${++idx}`, priority: 'low', title: 'Criar primeira proposta', description: 'Tens clientes mas nenhuma proposta — usa a Calculadora.', effort: '10 minutos', impact: 'Profissionaliza a comunicação com clientes.' });
  }

  if (data.slots.length === 0) {
    suggestions.push({ id: `imp-${++idx}`, priority: 'medium', title: 'Configurar slots semanais', description: 'Define os dias e canais de publicação para automatizar o calendário.', effort: '5 minutos', impact: 'Organiza o ritmo editorial da marca.' });
  }

  return suggestions;
}

// ── Cursor Report Generator ──

function generateCursorPrompt(report: Omit<PlatformReport, 'cursorPrompt'>): string {
  const { healthScore, diagnostics, stats, improvements } = report;

  const criticals = diagnostics.filter((d) => d.severity === 'critical');
  const warnings = diagnostics.filter((d) => d.severity === 'warning');

  let prompt = `# Relatório do Platform Agent — FA-360\n`;
  prompt += `Data: ${report.generatedAt}\n\n`;

  prompt += `## Health Score: ${healthScore.overall}/100\n`;
  prompt += `- Dados: ${healthScore.data}/100\n`;
  prompt += `- Conteúdo: ${healthScore.content}/100\n`;
  prompt += `- Segurança: ${healthScore.security}/100\n`;
  prompt += `- Utilização: ${healthScore.usage}/100\n`;
  prompt += `- Armazenamento: ${healthScore.storage}/100\n\n`;

  prompt += `## Estatísticas\n`;
  prompt += `- ${stats.totalClients} clientes, ${stats.totalProjects} projetos, ${stats.totalProposals} propostas\n`;
  prompt += `- ${stats.totalAssets} assets (${stats.assetsUnclassified} por classificar, ${stats.assetsWithoutTags} sem tags)\n`;
  prompt += `- ${stats.totalPosts} posts (${stats.postsInPipeline} em pipeline, ${stats.postsPublished} publicados)\n`;
  prompt += `- Storage: ${stats.storageUsedKB}KB / ${stats.storageMaxKB}KB\n`;
  prompt += `- AI Copilot: ${stats.aiConfigured ? 'Ativo' : 'Inativo'}\n\n`;

  if (criticals.length > 0) {
    prompt += `## Problemas Críticos (${criticals.length})\n`;
    criticals.forEach((d) => { prompt += `- **${d.title}**: ${d.description}\n  Sugestão: ${d.suggestion}\n`; });
    prompt += '\n';
  }

  if (warnings.length > 0) {
    prompt += `## Avisos (${warnings.length})\n`;
    warnings.forEach((d) => { prompt += `- **${d.title}**: ${d.description}\n  Sugestão: ${d.suggestion}\n`; });
    prompt += '\n';
  }

  if (improvements.length > 0) {
    prompt += `## Sugestões de Melhoria\n`;
    improvements.forEach((s) => { prompt += `- [${s.priority.toUpperCase()}] **${s.title}**: ${s.description} (Esforço: ${s.effort}, Impacto: ${s.impact})\n`; });
    prompt += '\n';
  }

  prompt += `## Pedido ao Cursor\n`;
  prompt += `Analisa este relatório e implementa as correções/melhorias necessárias na plataforma FA-360. `;
  prompt += `Prioriza os problemas críticos primeiro, depois os avisos, e finalmente as sugestões de melhoria. `;
  prompt += `Faz as alterações directamente nos ficheiros do projeto em C:\\Users\\José\\cursor\\app\\src\\.\n`;

  return prompt;
}

// ── Public API ──

/**
 * Run full platform diagnostic and generate report.
 */
export function runPlatformDiagnostic(data: AppData): PlatformReport {
  const diagnostics = runDiagnostics(data);
  const healthScore = calculateHealth(diagnostics);
  const stats = collectStats(data);
  const improvements = generateImprovements(data, stats);

  const partial = {
    generatedAt: new Date().toISOString(),
    healthScore,
    diagnostics,
    stats,
    improvements,
  };

  return {
    ...partial,
    cursorPrompt: generateCursorPrompt(partial),
  };
}

// ── AI-Powered Analysis (optional, uses OpenAI) ──

export async function runAIPlatformAnalysis(data: AppData): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('API key não configurada');

  const stats = collectStats(data);
  const diagnostics = runDiagnostics(data);

  const prompt = `Analisa o estado desta plataforma de gestão de arquitetura (FA-360) e dá recomendações concretas de melhoria.

ESTADO ACTUAL:
- ${stats.totalClients} clientes, ${stats.totalProjects} projetos, ${stats.totalProposals} propostas
- ${stats.totalAssets} media assets (${stats.assetsUnclassified} por classificar)
- ${stats.totalPosts} posts de conteúdo (${stats.postsPublished} publicados)
- Storage: ${stats.storageUsedKB}KB usado
- AI Copilot: ${stats.aiConfigured ? 'Ativo' : 'Inativo'}

PROBLEMAS DETECTADOS:
${diagnostics.map((d) => `[${d.severity}] ${d.title}: ${d.description}`).join('\n')}

Responde em português com:
1. Resumo executivo (2-3 frases)
2. Top 3 ações prioritárias com passos concretos
3. Sugestão de funcionalidade nova que beneficiaria este estúdio
4. Score de maturidade digital (0-10) com justificação`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'És um consultor de transformação digital especializado em estúdios de arquitetura. Dás conselhos práticos e concretos.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) throw new Error(`API erro: ${response.status}`);
  const result = await response.json();
  return result.choices?.[0]?.message?.content || 'Sem resposta da AI.';
}
