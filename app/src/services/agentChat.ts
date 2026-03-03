/**
 * Agent Chat Service — Full-featured conversational agent for FA-360.
 * Understands Portuguese commands, executes platform tasks,
 * provides proactive suggestions, and integrates with OpenAI.
 */

import type { AppData } from './storage';
import { hasApiKey, getApiKey } from './ai';
import { runPlatformDiagnostic } from './platformAgent';

// ── Types ──

export interface ChatAttachment {
  type: 'pdf' | 'image';
  fileName: string;
  sizeKB: number;
  pages?: number;
  extractedText?: string;
  dataUrl?: string;
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
  type: 'navigate' | 'execute' | 'copy' | 'create_proposal';
  payload: string;
  data?: Record<string, unknown>;
}

interface CommandMatch {
  intent: string;
  confidence: number;
  params: Record<string, string>;
}

// ── Dynamic Quick Suggestions ──

export function getDynamicSuggestions(appData: AppData): { label: string; message: string }[] {
  const suggestions: { label: string; message: string }[] = [];
  const today = new Date();

  const sentProposals = appData.proposals.filter(p => p.status === 'sent');
  const overdueProposals = sentProposals.filter(p => {
    const days = Math.floor((today.getTime() - new Date(p.createdAt).getTime()) / 86400000);
    return days > 14;
  });
  if (overdueProposals.length > 0)
    suggestions.push({ label: `Follow-up (${overdueProposals.length})`, message: 'Quais as propostas que precisam de follow-up?' });

  const activeProjects = appData.projects.filter(p => p.status === 'active');
  if (activeProjects.length > 0)
    suggestions.push({ label: 'Projetos ativos', message: 'Lista os projetos ativos e o seu estado' });

  const draftProposals = appData.proposals.filter(p => p.status === 'draft');
  if (draftProposals.length > 0)
    suggestions.push({ label: `Rascunhos (${draftProposals.length})`, message: 'Que propostas tenho em rascunho?' });

  suggestions.push({ label: 'Plano do dia', message: 'O que devo fazer hoje?' });
  suggestions.push({ label: 'Diagnóstico', message: 'Executa o diagnóstico da plataforma' });

  if (appData.proposals.length > 0)
    suggestions.push({ label: 'Faturação pendente', message: 'Quais os pagamentos em falta?' });

  suggestions.push({ label: 'Estatísticas', message: 'Mostra as estatísticas completas da plataforma' });
  suggestions.push({ label: 'Sugerir melhorias', message: 'Que melhorias sugeres para a plataforma?' });
  suggestions.push({ label: 'Gerar relatório', message: 'Gera um relatório completo da plataforma' });

  return suggestions.slice(0, 9);
}

export const QUICK_SUGGESTIONS = [
  { label: 'Plano do dia', message: 'O que devo fazer hoje?' },
  { label: 'Diagnóstico', message: 'Executa o diagnóstico da plataforma' },
  { label: 'Estado da plataforma', message: 'Qual é o estado actual da plataforma?' },
  { label: 'O que posso fazer?', message: 'O que posso fazer na plataforma?' },
  { label: 'Sugerir melhorias', message: 'Que melhorias sugeres para a plataforma?' },
  { label: 'Estatísticas', message: 'Mostra as estatísticas da plataforma' },
  { label: 'Aceitar proposta', message: 'Quero aceitar uma proposta' },
  { label: 'Mudar fase', message: 'Quero mudar a fase de um projeto' },
  { label: 'Gerar relatório', message: 'Gera um relatório para o Cursor' },
];

// ── Intent Matching ──

const INTENT_PATTERNS: { intent: string; patterns: RegExp[] }[] = [
  { intent: 'diagnostic', patterns: [/diagn[oó]stic/i, /health\s*check/i, /verificar?\s*(sa[uú]de|estado)/i, /execut(a|ar)\s*diagn/i, /analisa(r)?\s*(a\s*)?plataforma/i] },
  { intent: 'status', patterns: [/estado\s*(actual|da|geral)/i, /como\s*est[aá]/i, /status/i, /qual\s*[eé]\s*o\s*estado/i, /resumo/i, /overview/i] },
  { intent: 'stats', patterns: [/estat[ií]stic/i, /n[uú]meros/i, /quantos/i, /mostra(r)?\s*(as\s*)?estat/i, /totais/i] },
  { intent: 'improvements', patterns: [/melhor(ia|ar)/i, /sugest[oõ]/i, /sugere/i, /recomenda/i, /otimiz/i] },
  { intent: 'help', patterns: [/ajuda/i, /help/i, /o\s*que\s*(posso|consigo)\s*fazer/i, /como\s*(funciona|uso)/i, /tutorial/i, /funcionalidades/i] },
  { intent: 'cursor_report', patterns: [/relat[oó]rio/i, /gera(r)?\s*relat/i, /report/i] },
  { intent: 'navigate_media', patterns: [/media\s*inbox/i, /ir\s*(para\s*)?(a\s*)?media/i, /upload/i, /carregar?\s*(imagem|foto|v[ií]deo|media)/i] },
  { intent: 'navigate_planner', patterns: [/planner/i, /calend[aá]rio\s*editorial/i, /planear/i, /agendar/i] },
  { intent: 'navigate_performance', patterns: [/performance/i, /m[eé]tricas/i, /resultados/i, /engagement/i] },
  { intent: 'navigate_calculator', patterns: [/calculadora/i, /or[cç]amento/i, /nova\s*proposta/i] },
  { intent: 'navigate_clients', patterns: [/ir\s*(para\s*)?(os\s*)?clientes/i, /ver\s*clientes/i, /lista\s*de\s*clientes/i] },
  { intent: 'navigate_projects', patterns: [/ir\s*(para\s*)?(os\s*)?projec?tos/i, /ver\s*projec?tos/i, /lista\s*de\s*projec?tos/i] },
  { intent: 'navigate_proposals', patterns: [/ir\s*(para\s*)?(as\s*)?propostas/i, /ver\s*propostas/i] },
  { intent: 'navigate_billing', patterns: [/fatura[cç]/i, /billing/i, /pagamentos/i, /ir\s*(para\s*)?(a\s*)?fatura/i] },
  { intent: 'navigate_specialists', patterns: [/especialistas?/i, /ir\s*(para\s*)?especialistas/i, /consultores?/i] },
  { intent: 'navigate_checklist', patterns: [/checklist/i, /conformidade/i, /legisla[cç]/i] },
  { intent: 'navigate_settings', patterns: [/defini[cç][oõ]/i, /settings/i, /configura[cç]/i, /backup/i] },
  { intent: 'daily_actions', patterns: [/o\s*que\s*(devo|tenho)\s*(de\s*)?fazer\s*hoje/i, /tarefas?\s*(de\s*)?hoje/i, /plano\s*(do\s*)?dia/i, /dia\s*de\s*hoje/i] },
  { intent: 'accept_proposal', patterns: [/aceit(a|ar)\s*(a\s*)?proposta/i, /aprovar?\s*(a\s*)?proposta/i] },
  { intent: 'reject_proposal', patterns: [/recusar?\s*(a\s*)?proposta/i, /rejeitar?\s*(a\s*)?proposta/i] },
  { intent: 'lose_proposal', patterns: [/perdida/i, /marcar?\s*(como\s*)?perd/i, /n[aã]o\s*adjudic/i, /projeto\s*perdido/i] },
  { intent: 'change_phase', patterns: [/mudar?\s*(a\s*)?fase/i, /avan[cç]ar?\s*(a\s*)?fase/i, /passar?\s*(para\s*)?(a\s*)?(pr[oó]xima|seguinte)\s*fase/i] },
  { intent: 'list_proposals', patterns: [/lista(r)?\s*(as\s*)?propostas/i, /propostas\s*envia/i, /propostas\s*pend/i, /quais\s*(as\s*)?propostas/i] },
  { intent: 'billing_status', patterns: [/pagamentos?\s*(em\s*)?(falta|atraso|pend)/i, /fatura[cç][aã]o\s*(pend|em\s*falta)/i, /o\s*que\s*(est[aá]\s*)?por\s*receber/i, /receber/i] },
  { intent: 'follow_up', patterns: [/follow[\s-]?up/i, /acompanhamento/i, /propostas?\s*(sem\s*resposta|a\s*aguardar)/i] },
  { intent: 'create_client', patterns: [/cria(r)?\s*(um\s*)?(novo\s*)?cliente/i, /adicionar?\s*cliente/i, /novo\s*cliente/i] },
  { intent: 'create_project', patterns: [/cria(r)?\s*(um\s*)?(novo\s*)?projec?to/i, /adicionar?\s*projec?to/i, /novo\s*projec?to/i] },
  { intent: 'greeting', patterns: [/^(ol[aá]|oi|hey|bom\s*dia|boa\s*tarde|boa\s*noite)/i, /tudo\s*bem/i] },
  { intent: 'thanks', patterns: [/obrigad/i, /thank/i, /fixe/i, /top/i, /excelente/i, /perfeito/i] },
];

function extractParam(text: string, pattern: RegExp): string | null {
  const m = text.match(pattern);
  return m?.[1]?.trim() || null;
}

function matchIntent(text: string): CommandMatch {
  for (const { intent, patterns } of INTENT_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        const params: Record<string, string> = {};
        if (intent === 'create_client') {
          const name = extractParam(text, /cliente\s+(.+?)(?:\s*$|\s*com|\s*de|\s*,)/i)
            || extractParam(text, /(?:criar?|novo|adicionar)\s+(?:um\s+)?(?:novo\s+)?cliente\s+(.+)/i);
          if (name) params.name = name;
        }
        if (intent === 'create_project') {
          const name = extractParam(text, /projec?to\s+(.+?)(?:\s*$|\s*com|\s*de|\s*para|\s*,)/i)
            || extractParam(text, /(?:criar?|novo|adicionar)\s+(?:um\s+)?(?:novo\s+)?projec?to\s+(.+)/i);
          if (name) params.name = name;
        }
        return { intent, confidence: 0.9, params };
      }
    }
  }
  return { intent: 'unknown', confidence: 0, params: {} };
}

// ── Build rich platform context ──

function buildPlatformContext(appData: AppData): string {
  const today = new Date();
  const report = runPlatformDiagnostic(appData);
  const s = report.stats;

  // Clients
  const clientList = appData.clients.slice(0, 20).map(c => `  - ${c.name}${c.email ? ` (${c.email})` : ''}`).join('\n');

  // Active projects
  const activeProjects = appData.projects.filter(p => p.status === 'active');
  const projectList = activeProjects.slice(0, 15).map(p =>
    `  - [${p.id}] ${p.name} | Cliente: ${p.client || '—'} | Fase: ${p.phase} | Estado: ${p.status}`
  ).join('\n');

  // Proposals
  const sentProps = appData.proposals.filter(p => p.status === 'sent');
  const draftProps = appData.proposals.filter(p => p.status === 'draft');
  const acceptedProps = appData.proposals.filter(p => p.status === 'accepted');
  const lostProps = appData.proposals.filter(p => p.status === 'lost');
  const proposalList = appData.proposals.slice(0, 20).map(p => {
    const days = Math.floor((today.getTime() - new Date(p.createdAt).getTime()) / 86400000);
    const val = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(p.totalWithVat);
    return `  - [${p.id}] ${p.clientName} | ${p.projectName || p.projectType} | ${val} | Estado: ${p.status} | ${days}d atrás${p.reference ? ` | Ref: ${p.reference}` : ''}`;
  }).join('\n');

  // Overdue follow-ups
  const overdueFollowUps = sentProps
    .filter(p => Math.floor((today.getTime() - new Date(p.createdAt).getTime()) / 86400000) > 14)
    .map(p => {
      const days = Math.floor((today.getTime() - new Date(p.createdAt).getTime()) / 86400000);
      return `  - ${p.clientName} (${days} dias sem resposta)`;
    }).join('\n');

  // Billing - pending tranches
  const pendingTranches: string[] = [];
  appData.proposals.filter(p => p.status === 'accepted').forEach(p => {
    (p.paymentTranches || []).forEach(t => {
      if (t.status !== 'paid') {
        pendingTranches.push(`  - ${p.clientName}: ${t.label} — ${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(t.value)}${t.invoiceDate ? ` (fatura: ${t.invoiceDate})` : ''}`);
      }
    });
  });

  // Specialists
  const specialistList = appData.specialists?.slice(0, 10).map(s =>
    `  - [${s.id}] ${s.name} | ${s.specialty}${s.phone ? ` | ${s.phone}` : ''}${s.priceUpTo300m2 ? ` | Preço: ${s.priceUpTo300m2}` : ''}`
  ).join('\n') || '  (sem especialistas registados)';

  return `
DADOS REAIS DA PLATAFORMA:
Health Score: ${report.healthScore.overall}/100 | Segurança: ${report.healthScore.security}/100 | Conteúdo: ${report.healthScore.content}/100

CLIENTES (${s.totalClients} total):
${clientList || '  (sem clientes)'}

PROJETOS ATIVOS (${activeProjects.length}/${s.totalProjects} total):
${projectList || '  (sem projetos ativos)'}

PROPOSTAS (${s.totalProposals} total | ${sentProps.length} enviadas | ${draftProps.length} rascunhos | ${acceptedProps.length} aceites | ${lostProps.length} perdidas):
${proposalList || '  (sem propostas)'}

FOLLOW-UPS NECESSÁRIOS (propostas enviadas há >14 dias):
${overdueFollowUps || '  (nenhum)'}

PAGAMENTOS EM FALTA (tranches não pagas de projetos aceites):
${pendingTranches.length > 0 ? pendingTranches.join('\n') : '  (nenhum pendente)'}

ESPECIALISTAS:
${specialistList}

PROBLEMAS DETECTADOS:
${report.diagnostics.map(d => `[${d.severity.toUpperCase()}] ${d.title}: ${d.description}`).join('\n') || '  Nenhum'}

SUGESTÕES DE MELHORIA:
${report.improvements.slice(0, 5).map(i => `[${i.priority.toUpperCase()}] ${i.title}: ${i.description}`).join('\n') || '  Nenhuma'}`;
}

// ── Response Generators ──

function generateLocalResponse(intent: string, appData: AppData, params: Record<string, string> = {}): { content: string; actions?: ChatAction[] } {
  const report = runPlatformDiagnostic(appData);
  const s = report.stats;
  const today = new Date();
  const sentProposals = appData.proposals.filter(p => p.status === 'sent');
  const activeProjects = appData.projects.filter(p => p.status === 'active');

  switch (intent) {
    case 'greeting':
      return {
        content: `Olá! Sou o Agente FA-360. Health score: **${report.healthScore.overall}/100**.\n\nTens ${sentProposals.length} proposta(s) enviada(s) e ${activeProjects.length} projeto(s) ativo(s). O que precisas?`,
      };

    case 'thanks':
      return { content: 'De nada! Estou sempre aqui. Pergunta o que precisares.' };

    case 'diagnostic': {
      const criticals = report.diagnostics.filter(d => d.severity === 'critical');
      const warnings = report.diagnostics.filter(d => d.severity === 'warning');
      let content = `**Diagnóstico — Health Score: ${report.healthScore.overall}/100**\n\n`;
      content += `📊 Dados: ${report.healthScore.data}/100 | Conteúdo: ${report.healthScore.content}/100 | Segurança: ${report.healthScore.security}/100\n`;
      content += `💾 Storage: ${s.storageUsedKB}KB / ${s.storageMaxKB}KB | AI: ${s.aiConfigured ? '✅' : '❌'}\n\n`;
      if (criticals.length) { content += `🔴 **${criticals.length} crítico(s):**\n`; criticals.forEach(d => { content += `- ${d.title}\n`; }); content += '\n'; }
      if (warnings.length) { content += `🟡 **${warnings.length} aviso(s):**\n`; warnings.forEach(d => { content += `- ${d.title}\n`; }); }
      if (!criticals.length && !warnings.length) content += '✅ Sem problemas detectados!';
      return { content, actions: [{ id: 'copy-report', label: 'Copiar relatório', type: 'copy', payload: report.cursorPrompt }] };
    }

    case 'status':
      return {
        content: `**Estado da plataforma:**\n\n🏥 Health Score: **${report.healthScore.overall}/100**\n👥 ${s.totalClients} clientes | 📁 ${s.totalProjects} projetos | 📄 ${s.totalProposals} propostas\n🖼️ ${s.totalAssets} assets | 📝 ${s.totalPosts} posts\n💾 ${s.storageUsedKB}KB / ${s.storageMaxKB}KB\n🤖 AI: ${s.aiConfigured ? '✅ Ativo' : '❌ Inativo'}\n\n${report.diagnostics.filter(d => d.severity === 'critical').length ? '⚠️ Existem problemas críticos — executa o diagnóstico.' : '✅ Sem problemas críticos.'}`,
      };

    case 'stats':
      return {
        content: `**Estatísticas:**\n\n| Métrica | Valor |\n|---------|-------|\n| Clientes | ${s.totalClients} |\n| Projetos | ${s.totalProjects} |\n| Propostas | ${s.totalProposals} |\n| Enviadas | ${sentProposals.length} |\n| Aceites | ${appData.proposals.filter(p => p.status === 'accepted').length} |\n| Perdidas | ${appData.proposals.filter(p => p.status === 'lost').length} |\n| Media Assets | ${s.totalAssets} |\n| Posts | ${s.totalPosts} |\n| Especialistas | ${appData.specialists?.length || 0} |\n| Storage | ${s.storageUsedKB}KB |`,
      };

    case 'list_proposals': {
      if (!appData.proposals.length) return { content: 'Ainda não tens propostas registadas.', actions: [{ id: 'nav', label: 'Criar Proposta', type: 'navigate', payload: '/calculator' }] };
      let content = `**Propostas (${appData.proposals.length}):**\n\n`;
      const groups: Record<string, typeof appData.proposals> = {};
      appData.proposals.forEach(p => { (groups[p.status] = groups[p.status] || []).push(p); });
      const labels: Record<string, string> = { sent: '📤 Enviadas', draft: '✏️ Rascunhos', accepted: '✅ Aceites', rejected: '❌ Recusadas', lost: '🟠 Perdidas', expired: '⏰ Expiradas' };
      for (const [status, props] of Object.entries(groups)) {
        content += `**${labels[status] || status}** (${props.length})\n`;
        props.forEach(p => {
          const val = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(p.totalWithVat);
          content += `- ${p.clientName} — ${p.projectName || p.projectType} — ${val}\n`;
        });
        content += '\n';
      }
      return { content, actions: [{ id: 'nav', label: 'Ver Propostas', type: 'navigate', payload: '/proposals' }] };
    }

    case 'billing_status': {
      const pending: string[] = [];
      let totalPending = 0;
      appData.proposals.filter(p => p.status === 'accepted').forEach(p => {
        (p.paymentTranches || []).forEach(t => {
          if (t.status !== 'paid') {
            pending.push(`- **${p.clientName}** — ${t.label}: ${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(t.value)}${t.invoiceDate ? ` (fatura: ${t.invoiceDate})` : ''}`);
            totalPending += t.value;
          }
        });
      });
      if (!pending.length) return { content: '✅ Não há pagamentos em falta.', actions: [{ id: 'nav', label: 'Ver Faturação', type: 'navigate', payload: '/billing' }] };
      return {
        content: `**Pagamentos em falta:**\n\n${pending.join('\n')}\n\n**Total em falta: ${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(totalPending)}**`,
        actions: [{ id: 'nav', label: 'Ver Faturação', type: 'navigate', payload: '/billing' }],
      };
    }

    case 'follow_up': {
      const overdue = sentProposals.filter(p => {
        const days = Math.floor((today.getTime() - new Date(p.createdAt).getTime()) / 86400000);
        return days > 14;
      });
      if (!overdue.length) return { content: '✅ Todas as propostas enviadas têm menos de 14 dias — não há follow-ups urgentes.', actions: [{ id: 'nav', label: 'Ver Propostas', type: 'navigate', payload: '/proposals' }] };
      let content = `**${overdue.length} proposta(s) a precisar de follow-up:**\n\n`;
      overdue.forEach(p => {
        const days = Math.floor((today.getTime() - new Date(p.createdAt).getTime()) / 86400000);
        const val = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(p.totalWithVat);
        content += `📌 **${p.clientName}** — ${p.projectName || p.projectType} — ${val}\n   _Enviada há ${days} dias${p.reference ? ` | Ref: ${p.reference}` : ''}_\n\n`;
      });
      const actions: ChatAction[] = [
        { id: 'nav', label: 'Ver Propostas', type: 'navigate', payload: '/proposals' },
        ...overdue.slice(0, 3).map(p => ({
          id: `lost-${p.id}`,
          label: `Marcar perdida — ${p.clientName}`,
          type: 'execute' as const,
          payload: 'lose_proposal',
          data: { proposalId: p.id, clientName: p.clientName },
        })),
      ];
      return { content, actions };
    }

    case 'lose_proposal': {
      if (!sentProposals.length) return { content: 'Não tens propostas enviadas para marcar como perdidas.' };
      let content = `**Propostas enviadas — marcar como perdida:**\n\n`;
      sentProposals.forEach((p, i) => {
        const val = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(p.totalWithVat);
        content += `${i + 1}. **${p.clientName}** — ${p.projectName || p.projectType} — ${val}\n`;
      });
      return {
        content,
        actions: sentProposals.slice(0, 5).map(p => ({
          id: `lose-${p.id}`,
          label: `Perdida — ${p.clientName}`,
          type: 'execute' as const,
          payload: 'lose_proposal',
          data: { proposalId: p.id, clientName: p.clientName },
        })),
      };
    }

    case 'accept_proposal': {
      if (!sentProposals.length) return { content: 'Não tens propostas enviadas para aceitar.', actions: [{ id: 'nav', label: 'Calculadora', type: 'navigate', payload: '/calculator' }] };
      let content = `**Propostas enviadas (${sentProposals.length}):**\n\n`;
      sentProposals.forEach((p, i) => {
        const val = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(p.totalWithVat);
        content += `${i + 1}. **${p.clientName}** — ${p.projectName || p.projectType} — ${val}\n`;
      });
      return {
        content,
        actions: sentProposals.slice(0, 5).map(p => ({
          id: `accept-${p.id}`,
          label: `Aceitar — ${p.clientName}`,
          type: 'execute' as const,
          payload: 'accept_proposal',
          data: { proposalId: p.id },
        })),
      };
    }

    case 'reject_proposal': {
      if (!sentProposals.length) return { content: 'Não tens propostas enviadas.', actions: [{ id: 'nav', label: 'Ver Propostas', type: 'navigate', payload: '/proposals' }] };
      return {
        content: `Tens **${sentProposals.length} proposta(s) enviada(s)**. Clica para recusar:`,
        actions: sentProposals.slice(0, 5).map(p => ({
          id: `reject-${p.id}`,
          label: `Recusar — ${p.clientName}`,
          type: 'execute' as const,
          payload: 'reject_proposal',
          data: { proposalId: p.id, clientName: p.clientName },
        })),
      };
    }

    case 'change_phase': {
      if (!activeProjects.length) return { content: 'Não tens projetos ativos para mudar de fase.' };
      const phases = ['Contacto Inicial', 'Estudo Prévio', 'Anteprojeto', 'Projeto de Execução', 'Aprovação', 'Concurso', 'Obra', 'Conclusão'];
      let content = `**Projetos ativos (${activeProjects.length}):**\n\n`;
      activeProjects.forEach((p, i) => { content += `${i + 1}. **${p.name}** — Fase atual: ${p.phase} — ${p.client || '—'}\n`; });
      content += `\nFases disponíveis: ${phases.join(' → ')}\n\nPara mudar, diz por exemplo: **"Muda o projeto [nome] para Projeto de Execução"**`;
      return { content, actions: [{ id: 'nav', label: 'Ver Projetos', type: 'navigate', payload: '/projects' }] };
    }

    case 'improvements': {
      if (!report.improvements.length) return { content: '✅ Sem sugestões de melhoria — a plataforma está em óptimo estado!' };
      let content = `**${report.improvements.length} sugestão(ões):**\n\n`;
      report.improvements.forEach(imp => {
        const emoji = imp.priority === 'high' ? '🔴' : imp.priority === 'medium' ? '🟡' : '🔵';
        content += `${emoji} **${imp.title}**\n${imp.description}\n_Esforço: ${imp.effort} | Impacto: ${imp.impact}_\n\n`;
      });
      return { content };
    }

    case 'cursor_report':
      return {
        content: `**Relatório gerado!** Cola no Cursor para implementar as correções automaticamente.`,
        actions: [{ id: 'copy-report', label: 'Copiar relatório para Cursor', type: 'copy', payload: report.cursorPrompt }],
      };

    case 'navigate_media': return { content: 'Vamos para a **Media Inbox**.', actions: [{ id: 'nav', label: 'Abrir Media Inbox', type: 'navigate', payload: '/media' }] };
    case 'navigate_planner': return { content: 'Vamos para o **Planner**.', actions: [{ id: 'nav', label: 'Abrir Planner', type: 'navigate', payload: '/planner' }] };
    case 'navigate_performance': return { content: 'Vamos para o **Performance Loop**.', actions: [{ id: 'nav', label: 'Abrir Performance', type: 'navigate', payload: '/performance' }] };
    case 'navigate_calculator': return { content: 'Vamos para a **Calculadora** — cria uma nova proposta.', actions: [{ id: 'nav', label: 'Abrir Calculadora', type: 'navigate', payload: '/calculator' }] };
    case 'navigate_clients': return { content: `Vamos para os **Clientes** (${s.totalClients} registados).`, actions: [{ id: 'nav', label: 'Ver Clientes', type: 'navigate', payload: '/clients' }] };
    case 'navigate_projects': return { content: `Vamos para os **Projetos** (${s.totalProjects} no total).`, actions: [{ id: 'nav', label: 'Ver Projetos', type: 'navigate', payload: '/projects' }] };
    case 'navigate_proposals': return { content: `Vamos para as **Propostas** (${s.totalProposals} no total).`, actions: [{ id: 'nav', label: 'Ver Propostas', type: 'navigate', payload: '/proposals' }] };
    case 'navigate_billing': return { content: 'Vamos para a **Faturação**.', actions: [{ id: 'nav', label: 'Ver Faturação', type: 'navigate', payload: '/billing' }] };
    case 'navigate_specialists': return { content: `Vamos para os **Especialistas** (${appData.specialists?.length || 0} registados).`, actions: [{ id: 'nav', label: 'Ver Especialistas', type: 'navigate', payload: '/specialists' }] };
    case 'navigate_checklist': return { content: 'Vamos para as **Checklists de Conformidade**.', actions: [{ id: 'nav', label: 'Ver Checklists', type: 'navigate', payload: '/checklist' }] };
    case 'navigate_settings': return { content: 'Vamos para as **Definições**.', actions: [{ id: 'nav', label: 'Abrir Definições', type: 'navigate', payload: '/settings' }] };

    case 'daily_actions': {
      const actions: ChatAction[] = [];
      let content = `**📋 Plano do dia — ${new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}**\n\n`;
      const todos: string[] = [];

      const overdue = sentProposals.filter(p => Math.floor((today.getTime() - new Date(p.createdAt).getTime()) / 86400000) > 14);
      if (overdue.length) { todos.push(`📌 **Follow-up urgente: ${overdue.length} proposta(s)** sem resposta há mais de 14 dias`); actions.push({ id: 'fu', label: 'Ver follow-ups', type: 'execute', payload: 'follow_up', data: {} }); }
      if (sentProposals.length) { todos.push(`📄 **${sentProposals.length} proposta(s) enviada(s)** a aguardar resposta`); actions.push({ id: 'nav-proposals', label: 'Ver Propostas', type: 'navigate', payload: '/proposals' }); }

      const pending2: string[] = [];
      appData.proposals.filter(p => p.status === 'accepted').forEach(p => {
        (p.paymentTranches || []).forEach(t => { if (t.status !== 'paid') pending2.push(t.label); });
      });
      if (pending2.length) { todos.push(`💶 **${pending2.length} pagamento(s) em falta** — verifica a faturação`); actions.push({ id: 'nav-billing', label: 'Ver Faturação', type: 'navigate', payload: '/billing' }); }

      if (activeProjects.length) { todos.push(`🏗️ **${activeProjects.length} projeto(s) ativo(s)** — verifica progresso`); actions.push({ id: 'nav-projects', label: 'Ver Projetos', type: 'navigate', payload: '/projects' }); }
      const draftProposals = appData.proposals.filter(p => p.status === 'draft');
      if (draftProposals.length) todos.push(`✏️ **${draftProposals.length} rascunho(s)** — finaliza e envia`);
      const postsInQueue = appData.contentPosts?.filter(p => ['inbox', 'generated', 'review', 'approved'].includes(p.status)) || [];
      if (postsInQueue.length) { todos.push(`📱 **${postsInQueue.length} post(s) na queue** — agenda ou publica`); actions.push({ id: 'nav-planner', label: 'Planner', type: 'navigate', payload: '/planner' }); }
      if (!s.aiConfigured) todos.push(`🤖 **AI Copilot inativo** — configura a API key`);

      if (!todos.length) {
        content += '✅ **Tudo em dia!** Sem tarefas pendentes.\n\nPodes criar uma nova proposta.';
        actions.push({ id: 'nav-calc', label: 'Nova Proposta', type: 'navigate', payload: '/calculator' });
      } else {
        content += todos.map((t, i) => `${i + 1}. ${t}`).join('\n\n');
        content += `\n\n---\n_${todos.length} ação/ões para hoje._`;
      }
      return { content, actions };
    }

    case 'create_client': {
      const name = params.name;
      if (!name) return { content: 'Como se chama o cliente? Ex: **"Criar cliente João Silva"**' };
      const existing = appData.clients.find(c => c.name.toLowerCase() === name.toLowerCase());
      if (existing) return { content: `O cliente **${existing.name}** já existe.`, actions: [{ id: 'nav', label: 'Ver Clientes', type: 'navigate', payload: '/clients' }] };
      return { content: `Criar o cliente **${name}**?`, actions: [{ id: 'exec-create-client', label: `Criar "${name}"`, type: 'execute', payload: 'create_client', data: { name } }] };
    }

    case 'create_project': {
      const name = params.name;
      if (!name) return { content: 'Qual o nome do projeto? Ex: **"Criar projeto Moradia Silva"**' };
      return { content: `Criar o projeto **${name}**?`, actions: [{ id: 'exec-create-project', label: `Criar "${name}"`, type: 'execute', payload: 'create_project', data: { name } }] };
    }

    case 'help':
      return {
        content: `**O que posso fazer:**\n\n` +
          `🔍 **Diagnóstico** — Analiso saúde completa da plataforma\n` +
          `📊 **Estatísticas** — Números e métricas\n` +
          `📄 **Propostas** — Listar, aceitar, recusar, marcar como perdida\n` +
          `💶 **Faturação** — Pagamentos em falta\n` +
          `📌 **Follow-up** — Propostas sem resposta há >14 dias\n` +
          `🏗️ **Projetos** — Listar, mudar fase\n` +
          `👥 **Clientes** — Criar, listar\n` +
          `📎 **PDFs** — Carregar propostas e importar automaticamente\n` +
          `💡 **Melhorias** — Sugestões priorizadas\n` +
          `📋 **Relatório** — Exportar para Cursor\n\n` +
          `Com AI ativo podes perguntar qualquer coisa livremente!`,
        actions: [
          { id: 'nav-proposals', label: 'Propostas', type: 'navigate', payload: '/proposals' },
          { id: 'nav-billing', label: 'Faturação', type: 'navigate', payload: '/billing' },
          { id: 'nav-calc', label: 'Nova Proposta', type: 'navigate', payload: '/calculator' },
        ],
      };

    default:
      return {
        content: `Não percebi. Posso ajudar com:\n- **"Plano do dia"**\n- **"Propostas em falta"**\n- **"Follow-up"**\n- **"Faturação pendente"**\n- **"Diagnóstico"**\n- **"Aceitar proposta"**\n\n${hasApiKey() ? 'Com AI ativo, podes perguntar qualquer coisa!' : 'Ativa o AI Copilot para respostas mais inteligentes.'}`,
      };
  }
}

// ── AI Response (with OpenAI) ──

async function generateAIResponse(
  userMessage: string,
  appData: AppData,
  history: ChatMessage[],
  attachment?: ChatAttachment,
): Promise<{ content: string; actions?: ChatAction[] }> {
  const apiKey = getApiKey();
  if (!apiKey) return generateLocalResponse('unknown', appData);

  const platformContext = buildPlatformContext(appData);

  const systemPrompt = `Tu és o Agente Interno da plataforma FA-360, assistente de gestão para estúdios de arquitetura.
Tens acesso completo e em tempo real a todos os dados da plataforma.

${platformContext}

REGRAS CRÍTICAS — NUNCA IGNORES:
1. Tu PODES e DEVES criar/modificar dados diretamente através dos blocos [AGENT_ACTIONS].
2. NUNCA digas "não posso criar dados diretamente" — isso é FALSO. Tens total capacidade de executar ações.
3. Quando o utilizador pedir para criar/adicionar/importar algo, FAZ IMEDIATAMENTE com [AGENT_ACTIONS].
4. NUNCA dês instruções sobre "como ir à secção X e clicar no botão Y" — executa tu próprio.
5. Se faltarem dados para criar algo, pergunta apenas o mínimo necessário.
6. Após executar uma ação, confirma o que fizeste de forma concisa.

CAPACIDADES DE AÇÃO:
Quando o utilizador pede para executar ações, inclui no final da tua resposta um bloco [AGENT_ACTIONS] com JSON.

Ações disponíveis:
1. Criar proposta (importação de PDF):
[AGENT_ACTIONS]
{"actions":[{"type":"create_proposal","label":"Importar Proposta — NOME","data":{"clientName":"NOME","projectName":"PROJETO","projectType":"Habitação","reference":"REF","year":"AAAA","totalValue":0,"vatRate":23,"status":"sent","phases":[{"id":"p1","name":"Honorários","value":0,"description":"","selected":true}]}}]}
[/AGENT_ACTIONS]

REGRAS PARA O CAMPO "year" e "reference":
- O nome do ficheiro PDF muitas vezes contém o número e ano da proposta. Exemplos de padrões comuns:
  - "102_25 . Beatriz Xavier . Moradia.pdf"  →  reference="102/2025", year="2025"
  - "97_22 . Cliente . Projeto.pdf"           →  reference="97/2022",  year="2022"
  - "108/2023 Cliente.pdf"                    →  reference="108/2023", year="2023"
  - "FA 97/2022_A.pdf"                        →  reference="97/2022",  year="2022"
- Se o nome contiver padrão NNN_AA (ex: 102_25), converte o sufixo de 2 dígitos para 4 (25 → 2025).
- Se o ano não estiver no nome, procura-o no conteúdo do PDF.
- NUNCA uses o ano atual (2026) como fallback — usa o ano real da proposta.
- O campo "year" deve ser sempre uma string com 4 dígitos (ex: "2025").

2. Aceitar proposta:
[AGENT_ACTIONS]
{"actions":[{"type":"execute","label":"Aceitar — NOME","payload":"accept_proposal","data":{"proposalId":"ID_DA_PROPOSTA"}}]}
[/AGENT_ACTIONS]

3. Marcar como perdida:
[AGENT_ACTIONS]
{"actions":[{"type":"execute","label":"Marcar perdida — NOME","payload":"lose_proposal","data":{"proposalId":"ID","clientName":"NOME"}}]}
[/AGENT_ACTIONS]

4. Marcar como recusada:
[AGENT_ACTIONS]
{"actions":[{"type":"execute","label":"Recusar — NOME","payload":"reject_proposal","data":{"proposalId":"ID","clientName":"NOME"}}]}
[/AGENT_ACTIONS]

5. Navegar para secção:
[AGENT_ACTIONS]
{"actions":[{"type":"navigate","label":"Ver Propostas","payload":"/proposals"}]}
[/AGENT_ACTIONS]

REGRAS:
- Responde SEMPRE em português (PT-PT)
- Usa os dados reais fornecidos (IDs, nomes, valores) — nunca inventes dados
- Sê direto e conciso; usa markdown
- Para PDFs de propostas, SEMPRE extrai os dados e inclui bloco create_proposal
- Proactivamente alerta para follow-ups, pagamentos em falta, projetos parados
- Podes incluir múltiplas ações no mesmo bloco
- Remove o bloco [AGENT_ACTIONS] do texto visível (é processado automaticamente)`;

  let fullUserMessage = userMessage;
  if (attachment) {
    if (attachment.type === 'pdf' && attachment.extractedText) {
      fullUserMessage = `[PDF: "${attachment.fileName}" — ${attachment.pages} págs, ${attachment.sizeKB}KB]\n\nCONTEÚDO:\n${attachment.extractedText.slice(0, 12000)}${attachment.extractedText.length > 12000 ? '\n(truncado)' : ''}\n\nPEDIDO: ${userMessage || 'Analisa e importa se for uma proposta.'}`;
    } else if (attachment.type === 'image') {
      fullUserMessage = `[Imagem: "${attachment.fileName}" — ${attachment.sizeKB}KB]\n\n${userMessage || 'Analisa esta imagem.'}`;
    }
  }

  const messages: {
    role: 'system' | 'user' | 'assistant';
    content: string | Array<{ type: string; text?: string; image_url?: { url: string; detail: string } }>;
  }[] = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-8).map(m => ({
      role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: m.content,
    })),
  ];

  if (attachment?.type === 'image' && attachment.dataUrl) {
    messages.push({ role: 'user', content: [{ type: 'text', text: fullUserMessage }, { type: 'image_url', image_url: { url: attachment.dataUrl, detail: 'high' } }] });
  } else {
    messages.push({ role: 'user', content: fullUserMessage });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ model: 'gpt-4o', messages, max_tokens: 2000, temperature: 0.7 }),
    });

    if (!response.ok) throw new Error(`API ${response.status}`);
    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;
    if (!rawContent) throw new Error('Sem resposta');

    const actionsMatch = rawContent.match(/\[AGENT_ACTIONS\]\s*([\s\S]*?)\s*\[\/AGENT_ACTIONS\]/);
    const cleanContent = rawContent.replace(/\[AGENT_ACTIONS\][\s\S]*?\[\/AGENT_ACTIONS\]/g, '').trim();

    let parsedActions: ChatAction[] | undefined;
    if (actionsMatch) {
      try {
        const parsed = JSON.parse(actionsMatch[1]);
        if (Array.isArray(parsed.actions)) {
          parsedActions = parsed.actions.map((a: Record<string, unknown>, i: number) => ({
            id: `ai-action-${i}-${Date.now()}`,
            label: String(a.label || 'Executar'),
            type: a.type as ChatAction['type'],
            payload: String(a.payload || a.type || ''),
            data: a.data as Record<string, unknown>,
          }));
        }
      } catch { /* ignore */ }
    }

    return { content: cleanContent, actions: parsedActions };
  } catch {
    return generateLocalResponse(matchIntent(userMessage).intent, appData);
  }
}

// ── Public API ──

export async function processMessage(
  userMessage: string,
  appData: AppData,
  history: ChatMessage[],
  useAI = true,
  attachment?: ChatAttachment,
): Promise<{ content: string; actions?: ChatAction[] }> {
  if (attachment) {
    if (hasApiKey()) return generateAIResponse(userMessage, appData, history, attachment);
    if (attachment.type === 'pdf') {
      const preview = attachment.extractedText?.slice(0, 500) || '';
      return { content: `**Ficheiro recebido:** ${attachment.fileName} (${attachment.pages} págs)\n\n${preview}${(attachment.extractedText?.length || 0) > 500 ? '...' : ''}\n\n_Para análise completa, ativa o AI Copilot._` };
    }
    return { content: `**Imagem recebida:** ${attachment.fileName}\n\n_Ativa o AI Copilot para análise de imagens._`, actions: [{ id: 'nav-media', label: 'Media Inbox', type: 'navigate', payload: '/media' }] };
  }

  const match = matchIntent(userMessage);
  const HIGH_PRIORITY_INTENTS = ['create_client', 'create_project', 'accept_proposal', 'reject_proposal', 'lose_proposal', 'change_phase', 'daily_actions', 'diagnostic', 'stats', 'status', 'cursor_report', 'list_proposals', 'billing_status', 'follow_up'];

  if (match.confidence >= 0.9 && HIGH_PRIORITY_INTENTS.includes(match.intent)) {
    return generateLocalResponse(match.intent, appData, match.params);
  }
  if (match.confidence >= 0.9 && match.intent !== 'unknown') {
    return generateLocalResponse(match.intent, appData, match.params);
  }
  if (useAI && hasApiKey()) return generateAIResponse(userMessage, appData, history);
  return generateLocalResponse(match.intent, appData, match.params);
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
