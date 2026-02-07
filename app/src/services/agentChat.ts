/**
 * Agent Chat Service — Real-time conversational agent for FA-360.
 * Understands Portuguese commands, executes platform tasks,
 * provides suggestions, and integrates with OpenAI for intelligent responses.
 */

import type { AppData } from './storage';
import { hasApiKey, getApiKey } from './ai';
import { runPlatformDiagnostic } from './platformAgent';

// ── Types ──

export interface ChatAttachment {
  type: 'pdf' | 'image';
  fileName: string;
  sizeKB: number;
  pages?: number;         // PDF only
  extractedText?: string; // PDF only
  dataUrl?: string;       // Image only
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
  actions?: ChatAction[];
  attachment?: ChatAttachment;
  data?: Record<string, unknown>;
}

export interface ChatAction {
  id: string;
  label: string;
  type: 'navigate' | 'execute' | 'copy';
  payload: string;
}

interface CommandMatch {
  intent: string;
  confidence: number;
  params: Record<string, string>;
}

// ── Quick Suggestions ──

export const QUICK_SUGGESTIONS = [
  { label: 'Executar diagnóstico', message: 'Executa o diagnóstico da plataforma' },
  { label: 'Estado da plataforma', message: 'Qual é o estado actual da plataforma?' },
  { label: 'O que posso fazer?', message: 'O que posso fazer na plataforma?' },
  { label: 'Sugerir melhorias', message: 'Que melhorias sugeres para a plataforma?' },
  { label: 'Estatísticas', message: 'Mostra as estatísticas da plataforma' },
  { label: 'Como funciona a AI?', message: 'Como funciona o AI Copilot?' },
  { label: 'Gerar relatório', message: 'Gera um relatório para o Cursor' },
  { label: 'Ajuda', message: 'Ajuda-me a usar a plataforma' },
];

// ── Intent Matching ──

const INTENT_PATTERNS: { intent: string; patterns: RegExp[]; }[] = [
  {
    intent: 'diagnostic',
    patterns: [
      /diagn[oó]stic/i, /health\s*check/i, /verificar?\s*(sa[uú]de|estado)/i,
      /execut(a|ar)\s*diagn/i, /correr?\s*diagn/i, /analisa(r)?\s*(a\s*)?plataforma/i,
    ],
  },
  {
    intent: 'status',
    patterns: [
      /estado\s*(actual|da|geral)/i, /como\s*est[aá]/i, /status/i,
      /qual\s*[eé]\s*o\s*estado/i, /sa[uú]de\s*da/i, /resumo/i, /overview/i,
    ],
  },
  {
    intent: 'stats',
    patterns: [
      /estat[ií]stic/i, /n[uú]meros/i, /quantos/i, /dados/i,
      /mostra(r)?\s*(as\s*)?estat/i, /contagem/i, /totais/i,
    ],
  },
  {
    intent: 'improvements',
    patterns: [
      /melhor(ia|ar)/i, /sugest[oõ]/i, /sugere/i, /o\s*que\s*(devo|posso)\s*melhorar/i,
      /recomenda/i, /otimiz/i, /optimiz/i,
    ],
  },
  {
    intent: 'help',
    patterns: [
      /ajuda/i, /help/i, /o\s*que\s*(posso|consigo)\s*fazer/i,
      /como\s*(funciona|uso|utilizo)/i, /tutorial/i, /guia/i, /funcionalidades/i,
    ],
  },
  {
    intent: 'ai_info',
    patterns: [
      /ai\s*copilot/i, /intelig[eê]ncia\s*artificial/i, /openai/i, /gpt/i,
      /como\s*funciona\s*(a|o)\s*ai/i, /configur(ar|a)\s*ai/i, /api\s*key/i,
    ],
  },
  {
    intent: 'cursor_report',
    patterns: [
      /relat[oó]rio\s*(para\s*)?(o\s*)?cursor/i, /gera(r)?\s*relat[oó]rio/i,
      /comunicar?\s*(com\s*)?(o\s*)?cursor/i, /enviar?\s*(para\s*)?(o\s*)?cursor/i,
      /report/i,
    ],
  },
  {
    intent: 'navigate_media',
    patterns: [
      /media\s*inbox/i, /ir\s*(para\s*)?(a\s*)?media/i, /abrir?\s*media/i,
      /upload/i, /carregar?\s*(imagem|foto|v[ií]deo|media)/i,
    ],
  },
  {
    intent: 'navigate_planner',
    patterns: [
      /planner/i, /ir\s*(para\s*)?(o\s*)?planner/i, /calend[aá]rio\s*editorial/i,
      /planear/i, /agendar/i, /publicar/i,
    ],
  },
  {
    intent: 'navigate_performance',
    patterns: [
      /performance/i, /m[eé]tricas/i, /ir\s*(para\s*)?(o\s*)?performance/i,
      /resultados/i, /engagement/i, /alcance/i,
    ],
  },
  {
    intent: 'navigate_calculator',
    patterns: [
      /calculadora/i, /proposta/i, /or[cç]amento/i,
      /criar?\s*proposta/i, /nova\s*proposta/i,
    ],
  },
  {
    intent: 'navigate_clients',
    patterns: [
      /clientes?/i, /ir\s*(para\s*)?(os\s*)?clientes/i,
      /ver\s*clientes/i, /lista\s*de\s*clientes/i,
    ],
  },
  {
    intent: 'greeting',
    patterns: [
      /^(ol[aá]|oi|hey|bom\s*dia|boa\s*tarde|boa\s*noite)/i,
      /^(hi|hello)/i, /tudo\s*bem/i,
    ],
  },
  {
    intent: 'thanks',
    patterns: [
      /obrigad/i, /thank/i, /agrade[cç]/i, /fixe/i, /top/i, /excelente/i,
    ],
  },
];

function matchIntent(text: string): CommandMatch {
  for (const { intent, patterns } of INTENT_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        return { intent, confidence: 0.9, params: {} };
      }
    }
  }
  return { intent: 'unknown', confidence: 0, params: {} };
}

// ── Response Generators ──

function generateLocalResponse(intent: string, appData: AppData): { content: string; actions?: ChatAction[] } {
  const report = runPlatformDiagnostic(appData);
  const s = report.stats;

  switch (intent) {
    case 'greeting':
      return {
        content: `Olá! Sou o Agente da plataforma FA-360. Estou aqui para te ajudar a gerir a plataforma, detectar problemas e sugerir melhorias.\n\nA plataforma está com um health score de **${report.healthScore.overall}/100**. O que precisas?`,
      };

    case 'thanks':
      return {
        content: 'De nada! Estou sempre aqui. Se precisares de alguma coisa, é só perguntar.',
      };

    case 'diagnostic': {
      const criticals = report.diagnostics.filter((d) => d.severity === 'critical');
      const warnings = report.diagnostics.filter((d) => d.severity === 'warning');
      const infos = report.diagnostics.filter((d) => d.severity === 'info');

      let content = `**Diagnóstico concluído** — Health Score: **${report.healthScore.overall}/100**\n\n`;
      content += `📊 Dados: ${report.healthScore.data}/100 | Conteúdo: ${report.healthScore.content}/100 | Segurança: ${report.healthScore.security}/100\n`;
      content += `💾 Storage: ${s.storageUsedKB}KB / ${s.storageMaxKB}KB | AI: ${s.aiConfigured ? 'Ativo' : 'Inativo'}\n\n`;

      if (criticals.length > 0) {
        content += `🔴 **${criticals.length} problema(s) crítico(s):**\n`;
        criticals.forEach((d) => { content += `- ${d.title}\n`; });
        content += '\n';
      }
      if (warnings.length > 0) {
        content += `🟡 **${warnings.length} aviso(s):**\n`;
        warnings.forEach((d) => { content += `- ${d.title}\n`; });
        content += '\n';
      }
      if (infos.length > 0) {
        content += `🔵 **${infos.length} informação(ões):**\n`;
        infos.forEach((d) => { content += `- ${d.title}\n`; });
      }
      if (criticals.length === 0 && warnings.length === 0 && infos.length === 0) {
        content += '✅ Nenhum problema detectado!';
      }

      return {
        content,
        actions: [
          { id: 'copy-report', label: 'Copiar relatório para Cursor', type: 'copy', payload: report.cursorPrompt },
        ],
      };
    }

    case 'status':
      return {
        content: `**Estado actual da plataforma:**\n\n` +
          `🏥 Health Score: **${report.healthScore.overall}/100**\n` +
          `👥 ${s.totalClients} clientes | 📁 ${s.totalProjects} projetos | 📄 ${s.totalProposals} propostas\n` +
          `🖼️ ${s.totalAssets} assets | 📝 ${s.totalPosts} posts | 📦 ${s.totalContentPacks} packs\n` +
          `💾 Storage: ${s.storageUsedKB}KB / ${s.storageMaxKB}KB (${Math.round((s.storageUsedKB / s.storageMaxKB) * 100)}%)\n` +
          `🤖 AI Copilot: ${s.aiConfigured ? '✅ Ativo' : '❌ Inativo'}\n\n` +
          `${report.diagnostics.filter((d) => d.severity === 'critical').length > 0 ? '⚠️ Existem problemas críticos — executa o diagnóstico completo.' : '✅ Sem problemas críticos.'}`,
      };

    case 'stats':
      return {
        content: `**Estatísticas da plataforma:**\n\n` +
          `| Métrica | Valor |\n|---------|-------|\n` +
          `| Clientes | ${s.totalClients} |\n` +
          `| Projetos | ${s.totalProjects} |\n` +
          `| Propostas | ${s.totalProposals} |\n` +
          `| Media Assets | ${s.totalAssets} |\n` +
          `| Assets por classificar | ${s.assetsUnclassified} |\n` +
          `| Assets sem tags | ${s.assetsWithoutTags} |\n` +
          `| Posts totais | ${s.totalPosts} |\n` +
          `| Posts publicados | ${s.postsPublished} |\n` +
          `| Posts em pipeline | ${s.postsInPipeline} |\n` +
          `| Content Packs | ${s.totalContentPacks} |\n` +
          `| Storage usado | ${s.storageUsedKB}KB |\n` +
          `| AI Copilot | ${s.aiConfigured ? 'Ativo' : 'Inativo'} |`,
      };

    case 'improvements': {
      if (report.improvements.length === 0) {
        return { content: '✅ Sem sugestões de melhoria neste momento — a plataforma está em óptimo estado!' };
      }
      let content = `**${report.improvements.length} sugestão(ões) de melhoria:**\n\n`;
      report.improvements.forEach((imp) => {
        const emoji = imp.priority === 'high' ? '🔴' : imp.priority === 'medium' ? '🟡' : '🔵';
        content += `${emoji} **${imp.title}**\n${imp.description}\n_Esforço: ${imp.effort} | Impacto: ${imp.impact}_\n\n`;
      });
      return { content };
    }

    case 'help':
      return {
        content: `**O que posso fazer por ti:**\n\n` +
          `🔍 **Diagnóstico** — Analiso a saúde completa da plataforma\n` +
          `📊 **Estatísticas** — Mostro números e métricas actuais\n` +
          `💡 **Sugestões** — Recomendo melhorias priorizadas\n` +
          `🧭 **Navegação** — Levo-te a qualquer secção (Media, Planner, etc.)\n` +
          `🤖 **AI Info** — Explico como funciona o AI Copilot\n` +
          `📋 **Relatório** — Gero um relatório para partilhares com o Cursor\n` +
          `💬 **Conversa livre** — Com AI ativo, posso responder a qualquer pergunta\n\n` +
          `Experimenta perguntar algo como "Qual é o estado da plataforma?" ou "Que melhorias sugeres?"`,
        actions: [
          { id: 'nav-media', label: 'Ir para Media', type: 'navigate', payload: '/media' },
          { id: 'nav-planner', label: 'Ir para Planner', type: 'navigate', payload: '/planner' },
          { id: 'nav-calc', label: 'Ir para Calculadora', type: 'navigate', payload: '/calculator' },
        ],
      };

    case 'ai_info':
      return {
        content: `**AI Copilot — Como funciona:**\n\n` +
          `O AI Copilot usa o GPT-4 Vision da OpenAI para:\n\n` +
          `🖼️ **Analisar imagens** — Detecta o que está na foto (materiais, espaços, detalhes)\n` +
          `✍️ **Gerar copy** — Cria textos para 7 redes sociais, em PT e EN\n` +
          `🏷️ **Classificar** — Sugere tags, quality score e detecta riscos\n` +
          `📐 **Formatos** — Sugere os melhores crops para cada plataforma\n\n` +
          `**Estado actual:** ${s.aiConfigured ? '✅ Ativo e pronto a usar' : '❌ Inativo — precisas de configurar a API key da OpenAI'}\n\n` +
          `${s.aiConfigured ? 'Faz upload de uma imagem na Media Inbox e a análise é automática.' : 'Para ativar: vai à Media Inbox → botão "Configurar AI" → introduz a tua API key.'}`,
        actions: s.aiConfigured ? [] : [
          { id: 'nav-media', label: 'Ir para Media Inbox', type: 'navigate', payload: '/media' },
        ],
      };

    case 'cursor_report':
      return {
        content: `**Relatório gerado!**\n\nClica no botão abaixo para copiar o relatório completo. Depois cola-o no chat do Cursor e o assistente vai implementar as correções automaticamente.`,
        actions: [
          { id: 'copy-report', label: 'Copiar relatório para Cursor', type: 'copy', payload: report.cursorPrompt },
        ],
      };

    case 'navigate_media':
      return {
        content: `Vamos para a **Media Inbox** — é aqui que carregas imagens e vídeos dos teus projetos.${s.aiConfigured ? ' A análise AI está ativa, por isso qualquer upload será analisado automaticamente.' : ''}`,
        actions: [{ id: 'nav', label: 'Abrir Media Inbox', type: 'navigate', payload: '/media' }],
      };

    case 'navigate_planner':
      return {
        content: `Vamos para o **Planner** — aqui geres o calendário editorial com Kanban e vista mensal.`,
        actions: [{ id: 'nav', label: 'Abrir Planner', type: 'navigate', payload: '/planner' }],
      };

    case 'navigate_performance':
      return {
        content: `Vamos para o **Performance Loop** — aqui acompanhas métricas de posts publicados e vês recomendações.`,
        actions: [{ id: 'nav', label: 'Abrir Performance', type: 'navigate', payload: '/performance' }],
      };

    case 'navigate_calculator':
      return {
        content: `Vamos para a **Calculadora** — cria propostas profissionais para os teus clientes.`,
        actions: [{ id: 'nav', label: 'Abrir Calculadora', type: 'navigate', payload: '/calculator' }],
      };

    case 'navigate_clients':
      return {
        content: `Vamos para a lista de **Clientes** — gere contactos e projetos associados.`,
        actions: [{ id: 'nav', label: 'Ver Clientes', type: 'navigate', payload: '/clients' }],
      };

    default:
      return {
        content: `Não percebi bem o que pretendes. Posso ajudar-te com:\n\n` +
          `- **"Executa diagnóstico"** — Analisa a saúde da plataforma\n` +
          `- **"Estado da plataforma"** — Resumo rápido\n` +
          `- **"Que melhorias sugeres?"** — Sugestões priorizadas\n` +
          `- **"Vai para Media/Planner/Calculadora"** — Navegação\n` +
          `- **"Gera relatório para Cursor"** — Para comunicar comigo\n\n` +
          `${hasApiKey() ? 'Com a AI activa, podes perguntar qualquer coisa livremente!' : 'Activa o AI Copilot para respostas mais inteligentes.'}`,
      };
  }
}

// ── AI Response (with OpenAI) ──

async function generateAIResponse(userMessage: string, appData: AppData, history: ChatMessage[], attachment?: ChatAttachment): Promise<{ content: string; actions?: ChatAction[] }> {
  const apiKey = getApiKey();
  if (!apiKey) return generateLocalResponse('unknown', appData);

  const report = runPlatformDiagnostic(appData);
  const s = report.stats;

  const systemPrompt = `Tu és o Agente Interno da plataforma FA-360, uma plataforma de gestão para estúdios de arquitetura.

CONTEXTO DA PLATAFORMA:
- ${s.totalClients} clientes, ${s.totalProjects} projetos, ${s.totalProposals} propostas
- ${s.totalAssets} media assets (${s.assetsUnclassified} por classificar)
- ${s.totalPosts} posts (${s.postsPublished} publicados, ${s.postsInPipeline} em pipeline)
- Storage: ${s.storageUsedKB}KB / ${s.storageMaxKB}KB
- AI Copilot: ${s.aiConfigured ? 'Ativo' : 'Inativo'}
- Health Score: ${report.healthScore.overall}/100

PROBLEMAS DETECTADOS:
${report.diagnostics.map((d) => `[${d.severity}] ${d.title}: ${d.description}`).join('\n') || 'Nenhum'}

FUNCIONALIDADES DISPONÍVEIS:
- Media Inbox: upload e análise de imagens/vídeos (/media)
- Planner: calendário editorial com Kanban (/planner)
- Performance Loop: métricas e recomendações (/performance)
- Calculadora: criação de propostas (/calculator)
- Clientes, Projetos, Tarefas, Financeiro, Marketing, Técnico

REGRAS:
- Responde SEMPRE em português (PT-PT)
- Sê conciso mas útil
- Quando fizer sentido, sugere acções concretas
- Podes usar emojis moderadamente
- Se te pedirem para fazer algo na plataforma, explica os passos
- Se detectares problemas, alerta proactivamente
- Formatação: usa markdown para negrito, listas, etc.
- Se o utilizador enviar um ficheiro (PDF ou imagem), analisa o conteúdo e responde com base nele
- Para PDFs, o texto extraído vem incluído na mensagem
- Para imagens, descreve o que vês e sugere usos na plataforma`;

  // Build user message with attachment context
  let fullUserMessage = userMessage;
  if (attachment) {
    if (attachment.type === 'pdf' && attachment.extractedText) {
      fullUserMessage = `[O utilizador enviou o ficheiro PDF "${attachment.fileName}" (${attachment.pages} páginas, ${attachment.sizeKB}KB)]\n\nCONTEÚDO DO PDF:\n${attachment.extractedText.slice(0, 12000)}\n\n${attachment.extractedText.length > 12000 ? '(Texto truncado — demasiado longo)\n\n' : ''}PERGUNTA/PEDIDO DO UTILIZADOR: ${userMessage || 'Analisa este documento.'}`;
    } else if (attachment.type === 'image') {
      fullUserMessage = `[O utilizador enviou uma imagem "${attachment.fileName}" (${attachment.sizeKB}KB)]\n\n${userMessage || 'Analisa esta imagem.'}`;
    }
  }

  const messages: { role: 'system' | 'user' | 'assistant'; content: string | Array<{ type: string; text?: string; image_url?: { url: string; detail: string } }> }[] = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-10).map((m) => ({
      role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: m.content,
    })),
  ];

  // For images with AI, send as vision message
  if (attachment?.type === 'image' && attachment.dataUrl) {
    messages.push({
      role: 'user',
      content: [
        { type: 'text', text: fullUserMessage },
        { type: 'image_url', image_url: { url: attachment.dataUrl, detail: 'high' } },
      ],
    });
  } else {
    messages.push({ role: 'user', content: fullUserMessage });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) throw new Error(`API ${response.status}`);
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('Sem resposta');

    return { content };
  } catch {
    // Fallback to local response
    return generateLocalResponse(matchIntent(userMessage).intent, appData);
  }
}

// ── Public API ──

export async function processMessage(
  userMessage: string,
  appData: AppData,
  history: ChatMessage[],
  useAI: boolean = true,
  attachment?: ChatAttachment,
): Promise<{ content: string; actions?: ChatAction[] }> {
  // If there's an attachment, always use AI (if available) for best results
  if (attachment) {
    if (hasApiKey()) {
      return generateAIResponse(userMessage, appData, history, attachment);
    }

    // Local fallback for files
    if (attachment.type === 'pdf') {
      const preview = attachment.extractedText?.slice(0, 500) || '';
      return {
        content: `**Ficheiro recebido:** ${attachment.fileName} (${attachment.pages} páginas, ${attachment.sizeKB}KB)\n\n**Pré-visualização do texto:**\n${preview}${(attachment.extractedText?.length || 0) > 500 ? '...' : ''}\n\n_Para uma análise completa do PDF, ativa o AI Copilot (API key da OpenAI)._`,
      };
    }
    if (attachment.type === 'image') {
      return {
        content: `**Imagem recebida:** ${attachment.fileName} (${attachment.sizeKB}KB)\n\n_Para análise de imagens, ativa o AI Copilot. Ou vai à Media Inbox para fazer upload e análise automática._`,
        actions: [{ id: 'nav-media', label: 'Ir para Media Inbox', type: 'navigate', payload: '/media' }],
      };
    }
  }

  const match = matchIntent(userMessage);

  // If we have a confident local match, use it (faster + free)
  if (match.confidence >= 0.9 && match.intent !== 'unknown') {
    return generateLocalResponse(match.intent, appData);
  }

  // Otherwise, try AI if available
  if (useAI && hasApiKey()) {
    return generateAIResponse(userMessage, appData, history);
  }

  // Fallback to local
  return generateLocalResponse(match.intent, appData);
}

export function createMessage(role: 'user' | 'agent', content: string, actions?: ChatAction[], attachment?: ChatAttachment): ChatMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    role,
    content,
    timestamp: new Date().toISOString(),
    actions,
    attachment,
  };
}
