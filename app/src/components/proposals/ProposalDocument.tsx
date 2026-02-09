/**
 * Componente partilhado para renderizar o documento da proposta.
 * Usado na previsão (CalculatorPage) e na página pública (PropostaPublicPage).
 */
import { formatCurrency } from '../../lib/proposalPayload';
import { PROPOSAL_PALETTE } from '../../lib/proposalPalette';
import { t, type Lang } from '../../locales';
import type { ProposalPayload } from '../../lib/proposalPayload';
import { getPhasesByCategory, getCostsByTypology, calculateConstructionEstimate } from '../../data/constructionGuide';
import { CompanySnapshot } from '../branding/CompanySnapshot';

const C = PROPOSAL_PALETTE;

/** Fator de escala para aumentar proporcionalmente todo o lettering */
const FONT_SCALE = 1.2;
const fs = (n: number) => Math.round(n * FONT_SCALE);


export interface ProposalDocumentProps {
  payload: ProposalPayload;
  lang: Lang;
  /** Classes adicionais para o contentor (ex: para PDF) */
  className?: string;
  /** Estilos inline adicionais */
  style?: React.CSSProperties;
  /** Offset para preview paginado (px) - desloca o conteúdo para mostrar página N */
  clipOffset?: number;
}

export function ProposalDocument({ payload: p, lang, className = '', style, clipOffset = 0 }: ProposalDocumentProps) {
  const { branding } = p;

  return (
    <div
      className={`${className}`}
      style={{
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
        width: '210mm',
        maxWidth: '210mm',
        minHeight: '297mm',
        margin: 0,
        padding: 0,
        ...(clipOffset ? { marginTop: -clipOffset } : {}),
        fontSize: fs(12),
        lineHeight: 1.45,
        backgroundColor: C.white,
        color: C.grafite,
        boxSizing: 'border-box',
        overflow: 'visible',
        ...style,
      }}
    >

      {/* ═══════════════════════════════════════════════════════════════════
          CONTEÚDO — Páginas seguintes
          ═══════════════════════════════════════════════════════════════════ */}
      
      {/* Cabeçalho — margens compactas para melhor uso do espaço */}
      <div style={{ background: C.accent, color: C.onAccent, padding: '8mm 18mm 6mm', boxSizing: 'border-box' }}>
        <p style={{ fontSize: fs(18), fontWeight: 700, margin: 0, letterSpacing: '0.02em' }}>{branding.appName}</p>
        {branding.appSlogan && (
          <p style={{ fontSize: fs(10), color: C.onAccentMuted, margin: '1mm 0 0 0' }}>{branding.appSlogan}</p>
        )}
      </div>

      <div style={{ padding: '12mm 18mm 18mm', backgroundColor: C.white, boxSizing: 'border-box', wordBreak: 'break-word', overflowWrap: 'break-word', minWidth: 0 }}>
        <div style={{ marginTop: 0, marginBottom: '4mm' }}>
          <h1 style={{ fontSize: fs(14), fontWeight: 700, margin: 0, letterSpacing: '-0.01em', color: C.accent }}>
            {t('proposal.title', lang)}
          </h1>
          <p style={{ fontSize: fs(9), color: C.cinzaMarca, margin: '1.5mm 0 0 0' }}>
            {t('proposal.ref', lang)} {p.ref} · {p.data}
          </p>
        </div>

        {/* Apresentação */}
        <div style={{ marginBottom: '4mm', padding: '3mm 4mm', background: C.offWhite, borderRadius: 2, borderLeft: `3px solid ${C.accent}` }}>
          <p style={{ fontSize: fs(9), fontWeight: 600, margin: '0 0 2mm 0', color: C.accent, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('proposal.presentation', lang)}</p>
          {(p.apresentacao ?? t('longText.apresentacao', lang)).split('\n\n').map((par, i) => (
            <p key={i} style={{ fontSize: fs(8), color: C.cinzaMarca, margin: '0 0 2mm 0', lineHeight: 1.5 }}>{par}</p>
          ))}
        </div>

        {/* Dados do projeto */}
        <div style={{ background: C.offWhite, borderRadius: 2, padding: '3mm 4mm', marginBottom: '4mm' }}>
          {p.cliente && <p style={{ margin: '0 0 1mm 0', fontSize: fs(10), color: C.grafite }}><span style={{ color: C.cinzaMarca, fontWeight: 500 }}>{t('proposal.client', lang)}:</span> {p.cliente}</p>}
          {p.projeto && <p style={{ margin: '0 0 1mm 0', fontSize: fs(10), color: C.grafite }}><span style={{ color: C.cinzaMarca, fontWeight: 500 }}>{t('proposal.project', lang)}:</span> {p.projeto}</p>}
          {p.local && <p style={{ margin: p.linkGoogleMaps ? '0 0 1mm 0' : 0, fontSize: fs(10), color: C.grafite }}><span style={{ color: C.cinzaMarca, fontWeight: 500 }}>{t('proposal.local', lang)}:</span> {p.local}</p>}
          {p.linkGoogleMaps && (
            <p style={{ margin: 0, fontSize: fs(9) }}>
              <a 
                href={p.linkGoogleMaps.startsWith('http') ? p.linkGoogleMaps : `https://${p.linkGoogleMaps}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ color: C.accent, textDecoration: 'underline' }}
              >
                {t('proposal.viewOnGoogleMaps', lang)}
              </a>
            </p>
          )}
        </div>

        {/* ── SECÇÃO LOTEAMENTO — Dados do terreno + Cenários + Condicionantes ── */}
        {p.isLoteamento && (
          <>
            {/* Dados do terreno */}
            {(p.lotIdentificacao || p.lotAreaTerreno || p.lotAreaEstudo) && (
              <div style={{ background: '#fffbeb', borderRadius: 2, padding: '3mm 4mm', marginBottom: '4mm', border: '1px solid #fbbf24' }}>
                <p style={{ fontSize: fs(9), fontWeight: 700, margin: '0 0 2mm 0', color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Dados do Terreno
                </p>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: fs(9) }}>
                  <tbody>
                    {p.lotIdentificacao && (
                      <tr>
                        <td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500, width: '40%' }}>Identificação predial</td>
                        <td style={{ padding: '1mm 2mm', color: C.grafite }}>{p.lotIdentificacao}</td>
                      </tr>
                    )}
                    {p.lotAreaTerreno && (
                      <tr>
                        <td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500 }}>Área total do prédio</td>
                        <td style={{ padding: '1mm 2mm', color: C.grafite }}>{parseFloat(p.lotAreaTerreno).toLocaleString('pt-PT')} m² {p.lotFonteArea ? `(${p.lotFonteArea})` : ''}</td>
                      </tr>
                    )}
                    {p.lotAreaEstudo && (
                      <tr>
                        <td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500 }}>Área em estudo</td>
                        <td style={{ padding: '1mm 2mm', color: C.grafite }}>{parseFloat(p.lotAreaEstudo).toLocaleString('pt-PT')} m²</td>
                      </tr>
                    )}
                    {p.lotNumLotes && (
                      <tr>
                        <td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500 }}>Nº lotes pretendidos</td>
                        <td style={{ padding: '1mm 2mm', color: C.grafite, fontWeight: 600 }}>{p.lotNumLotes}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Cenários de loteamento (A/B/C) */}
            {p.lotCenarios && p.lotCenarios.length > 0 && (
              <div style={{ marginBottom: '4mm', padding: '3mm 4mm', background: C.offWhite, borderRadius: 2, borderLeft: `3px solid #f59e0b` }}>
                <p style={{ fontSize: fs(9), fontWeight: 700, margin: '0 0 2mm 0', color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Cenários de Loteamento
                </p>
                <p style={{ fontSize: fs(8), color: C.cinzaMarca, margin: '0 0 2mm 0' }}>
                  Inclui {p.lotCenarios.length} opções de implantação com quadro de áreas e recomendação.
                </p>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: fs(8) }}>
                  <thead>
                    <tr style={{ background: '#fef3c7' }}>
                      <th style={{ padding: '1.5mm 2mm', textAlign: 'left', color: '#92400e', fontWeight: 700 }}>Cenário</th>
                      <th style={{ padding: '1.5mm 2mm', textAlign: 'center', color: '#92400e', fontWeight: 700 }}>Lotes</th>
                      <th style={{ padding: '1.5mm 2mm', textAlign: 'center', color: '#92400e', fontWeight: 700 }}>Área média</th>
                      <th style={{ padding: '1.5mm 2mm', textAlign: 'center', color: '#92400e', fontWeight: 700 }}>Cedências</th>
                      <th style={{ padding: '1.5mm 2mm', textAlign: 'left', color: '#92400e', fontWeight: 700 }}>Nota</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.lotCenarios.map((c, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.cinzaLinha}` }}>
                        <td style={{ padding: '1.5mm 2mm', fontWeight: 600 }}>Cenário {c.label}</td>
                        <td style={{ padding: '1.5mm 2mm', textAlign: 'center', fontWeight: 600 }}>{c.lotes}</td>
                        <td style={{ padding: '1.5mm 2mm', textAlign: 'center' }}>{c.areaMedia ? `${c.areaMedia} m²` : '—'}</td>
                        <td style={{ padding: '1.5mm 2mm', textAlign: 'center' }}>{c.cedencias || '—'}</td>
                        <td style={{ padding: '1.5mm 2mm', color: C.cinzaMarca, fontSize: fs(7) }}>{c.nota || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Condicionantes identificadas */}
            {p.lotCondicionantes && p.lotCondicionantes.length > 0 && (
              <div style={{ marginBottom: '4mm', padding: '3mm 4mm', background: '#fff1f2', borderRadius: 2, border: '1px solid #fecdd3' }}>
                <p style={{ fontSize: fs(9), fontWeight: 700, margin: '0 0 2mm 0', color: '#9f1239', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Condicionantes Identificadas
                </p>
                <p style={{ fontSize: fs(8), color: C.cinzaMarca, margin: '0 0 1mm 0' }}>
                  Complexidade urbanística: <strong style={{ textTransform: 'uppercase' }}>{p.lotComplexidadeSugerida ?? 'média'}</strong>
                </p>
                <ul style={{ margin: 0, padding: 0, fontSize: fs(8), listStyleType: 'none' }}>
                  {p.lotCondicionantes.map((c, i) => (
                    <li key={i} style={{ margin: '0 0 1mm 0', display: 'flex', alignItems: 'flex-start', gap: '1.5mm' }}>
                      <span style={{ color: '#dc2626', fontWeight: 700, fontSize: fs(8) }}>⚠</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Assunções de base */}
            {p.lotAssuncoes && p.lotAssuncoes.length > 0 && (
              <div style={{ marginBottom: '4mm', padding: '3mm 4mm', background: '#f0fdf4', borderRadius: 2, border: '1px solid #bbf7d0' }}>
                <p style={{ fontSize: fs(9), fontWeight: 700, margin: '0 0 2mm 0', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Assunções de Base
                </p>
                <ul style={{ margin: 0, padding: 0, fontSize: fs(8), listStyleType: 'none', color: C.grafite }}>
                  {p.lotAssuncoes.map((a, i) => (
                    <li key={i} style={{ margin: '0 0 1mm 0', display: 'flex', alignItems: 'flex-start', gap: '1.5mm' }}>
                      <span style={{ color: '#16a34a', fontWeight: 700, fontSize: fs(8) }}>•</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* RESUMO EXECUTIVO — Decisão em 60 segundos */}
        {p.mostrarResumo && p.resumoExecutivo && (
          <div style={{ marginBottom: '5mm', padding: '4mm 5mm', background: C.accentSoft, borderRadius: 3, border: `2px solid ${C.accent}` }}>
            <p style={{ fontSize: fs(10), fontWeight: 700, margin: '0 0 2mm 0', color: C.accent, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {t('proposal.executiveSummary', lang)}
            </p>
            
            {/* Bloco CEO-ready - visão rápida */}
            <div style={{ marginBottom: '3mm', padding: '2.5mm 3mm', background: C.accent, borderRadius: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4mm', flexWrap: 'wrap' }}>
              <span style={{ fontSize: fs(11), fontWeight: 700, color: C.onAccent }}>
                {formatCurrency(p.totalSemIVA ?? p.total, lang)} {p.totalSemIVA ? '+IVA' : ''}
              </span>
              <span style={{ color: C.onAccentMuted }}>|</span>
              <span style={{ fontSize: fs(9), color: C.onAccent }}>
                Prazo típico: <strong>{p.resumoExecutivo.prazoEstimado ?? '10-14 meses'}</strong>
              </span>
              <span style={{ color: C.onAccentMuted }}>|</span>
              <span style={{ fontSize: fs(9), color: C.onAccent }}>
                {p.isLoteamento
                  ? `Urbanismo + ${p.lotNumAlternativas ?? 2} cenários${p.especialidades && p.especialidades.length > 0 ? ' + Especialidades' : ''}`
                  : `Arquitetura ${p.especialidades && p.especialidades.length > 0 ? '+ Especialidades ' : ''}+ 8 visitas`
                }
              </span>
            </div>
            
            {/* Grid de 2 colunas para incluído/não incluído */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '3mm' }}>
              <tbody>
                <tr>
                  <td style={{ width: '50%', verticalAlign: 'top', paddingRight: '3mm' }}>
                    <p style={{ fontSize: fs(8), fontWeight: 700, color: '#16a34a', margin: '0 0 2mm 0', display: 'flex', alignItems: 'center', gap: '1.5mm' }}>
                      <span style={{ 
                        width: '4mm', 
                        height: '4mm', 
                        background: '#dcfce7', 
                        borderRadius: '50%', 
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: fs(7),
                        fontWeight: 700,
                        color: '#16a34a',
                      }}>✓</span>
                      {t('proposal.included', lang)}
                    </p>
                    <ul style={{ margin: 0, padding: 0, fontSize: fs(8), color: C.grafite, lineHeight: 1.6, listStyleType: 'none' }}>
                      {(p.resumoExecutivo.incluido ?? []).map((item, i) => (
                        <li key={i} style={{ marginBottom: '1mm', display: 'flex', alignItems: 'flex-start', gap: '1.5mm' }}>
                          <span style={{ color: '#16a34a', fontWeight: 700, fontSize: fs(9), lineHeight: 1.4 }}>✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td style={{ width: '50%', verticalAlign: 'top', paddingLeft: '3mm', borderLeft: `1px solid ${C.cinzaLinha}` }}>
                    <p style={{ fontSize: fs(8), fontWeight: 700, color: '#dc2626', margin: '0 0 2mm 0', display: 'flex', alignItems: 'center', gap: '1.5mm' }}>
                      <span style={{ 
                        width: '4mm', 
                        height: '4mm', 
                        background: '#fef2f2', 
                        borderRadius: '50%', 
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: fs(7),
                        fontWeight: 700,
                        color: '#dc2626',
                      }}>✗</span>
                      {t('proposal.notIncluded', lang)}
                    </p>
                    <ul style={{ margin: 0, padding: 0, fontSize: fs(8), color: C.cinzaMarca, lineHeight: 1.6, listStyleType: 'none' }}>
                      {(p.resumoExecutivo.naoIncluido ?? []).map((item, i) => (
                        <li key={i} style={{ marginBottom: '1mm', display: 'flex', alignItems: 'flex-start', gap: '1.5mm' }}>
                          <span style={{ color: '#dc2626', fontWeight: 700, fontSize: fs(9), lineHeight: 1.4 }}>✗</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
            
            {/* Linha de totais com destaque */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.white, borderRadius: 2, padding: '2.5mm 3mm', border: `1px solid ${C.accent}` }}>
              <div>
                <span style={{ fontSize: fs(7), color: C.cinzaMarca, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{t('proposal.estimatedTimeline', lang)}</span>
                <p style={{ fontSize: fs(10), fontWeight: 700, color: C.grafite, margin: '0.5mm 0 0 0' }}>{p.resumoExecutivo.prazoEstimado ?? '10-14 meses'}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: fs(7), color: C.cinzaMarca, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{t('proposal.totalInvestment', lang)}</span>
                {p.totalSemIVA != null ? (
                  <>
                    <p style={{ fontSize: fs(9), color: C.grafite, margin: '0.5mm 0 0 0' }}>
                      {formatCurrency(p.totalSemIVA, lang)} <span style={{ fontSize: fs(7), color: C.cinzaMarca }}>(s/IVA)</span>
                    </p>
                    <p style={{ fontSize: fs(12), fontWeight: 700, color: C.accent, margin: '0' }}>
                      {formatCurrency(p.total, lang)} <span style={{ fontSize: fs(8), fontWeight: 600 }}>(c/IVA)</span>
                    </p>
                  </>
                ) : (
                  <p style={{ fontSize: fs(12), fontWeight: 700, color: C.accent, margin: '0.5mm 0 0 0' }}>{formatCurrency(p.total, lang)}</p>
                )}
              </div>
            </div>
            
            {/* Próximo passo */}
            <div style={{ marginTop: '2.5mm', padding: '2mm 3mm', background: C.accent, borderRadius: 2 }}>
              <span style={{ fontSize: fs(8), color: C.onAccent, fontWeight: 600 }}>
                → {t('proposal.nextStep', lang)}: {p.resumoExecutivo.proximoPasso ?? t('proposal.nextStepText', lang)}
              </span>
            </div>
          </div>
        )}

        {/* Tabela de valores - começa em página nova */}
        <div className="page-break-before" style={{ marginBottom: '5mm', paddingTop: '3mm', breakBefore: 'page', pageBreakBefore: 'always' }}>
          <p style={{ fontSize: fs(9), fontWeight: 600, color: C.cinzaMarca, margin: '0 0 2mm 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('proposal.section1', lang)}</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: fs(8), tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '55%' }} />
              <col style={{ width: '45%' }} />
            </colgroup>
            <thead>
              <tr style={{ background: C.offWhite }}>
                <th style={{ padding: '2mm', textAlign: 'left', fontWeight: 600, fontSize: fs(8), color: C.cinzaMarca, borderBottom: `1px solid ${C.cinzaLinha}`, wordBreak: 'break-word', overflowWrap: 'break-word' }}>{t('proposal.concept', lang)}</th>
                <th style={{ padding: '2mm', textAlign: 'right', fontWeight: 600, fontSize: fs(8), color: C.cinzaMarca, borderBottom: `1px solid ${C.cinzaLinha}`, wordBreak: 'break-word' }}>{t('proposal.value', lang)}</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: `1px solid ${C.cinzaLinha}`, color: C.grafite }}>
                <td style={{ padding: '2.5mm 3mm', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{t('proposal.mode', lang)}</td>
                <td style={{ textAlign: 'right', padding: '2.5mm 3mm', wordBreak: 'break-word' }}>{p.modo}</td>
              </tr>
              {p.tipologia && (
                <tr style={{ borderBottom: `1px solid ${C.cinzaLinha}`, color: C.grafite }}>
                  <td style={{ padding: '2.5mm 3mm' }}>{t('proposal.typology', lang)}</td>
                  <td style={{ textAlign: 'right', padding: '2.5mm 3mm' }}>{p.tipologia}</td>
                </tr>
              )}
              {p.complexidade && (
                <tr style={{ borderBottom: `1px solid ${C.cinzaLinha}`, color: C.grafite }}>
                  <td style={{ padding: '2.5mm 3mm' }}>{t('proposal.complexity', lang)}</td>
                  <td style={{ textAlign: 'right', padding: '2.5mm 3mm' }}>{p.complexidade}</td>
                </tr>
              )}
              {p.pisos != null && p.pisos > 0 && (
                <tr style={{ borderBottom: `1px solid ${C.cinzaLinha}`, color: C.grafite }}>
                  <td style={{ padding: '2.5mm 3mm' }}>{t('proposal.pisos', lang)}</td>
                  <td style={{ textAlign: 'right', padding: '2.5mm 3mm' }}>{p.pisos}{p.pisos >= 4 ? ' (+10%)' : p.pisos === 3 ? ' (+5%)' : ''}</td>
                </tr>
              )}
              <tr style={{ borderBottom: `1px solid ${C.cinzaLinha}`, color: C.grafite }}>
                <td style={{ padding: '2.5mm 3mm' }}>{t('proposal.phases', lang)}</td>
                <td style={{ textAlign: 'right', padding: '2.5mm 3mm' }}>{p.fasesPct}%</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${C.cinzaLinha}`, color: C.grafite }}>
                <td style={{ padding: '2.5mm 3mm' }}>{t('proposal.location', lang)}</td>
                <td style={{ textAlign: 'right', padding: '2.5mm 3mm' }}>{p.localizacao}</td>
              </tr>
              <tr style={{ borderBottom: `1px solid ${C.cinzaLinha}`, color: C.grafite }}>
                <td style={{ padding: '2.5mm 3mm' }}>{t('proposal.vat', lang)}</td>
                <td style={{ textAlign: 'right', padding: '2.5mm 3mm' }}>{p.iva}</td>
              </tr>
              {p.despesasReemb != null && p.despesasReemb > 0 && (
                <tr style={{ borderBottom: `1px solid ${C.cinzaLinha}`, color: C.grafite }}>
                  <td style={{ padding: '2.5mm 3mm' }}>{t('proposal.reimbursableExpenses', lang)}</td>
                  <td style={{ textAlign: 'right', padding: '2.5mm 3mm' }}>{formatCurrency(p.despesasReemb, lang)}</td>
                </tr>
              )}
              
              {/* ═══ SECÇÃO: ARQUITETURA / URBANISMO ═══ */}
              <tr style={{ background: C.accent, color: C.onAccent }}>
                <td colSpan={2} style={{ padding: '2.5mm 3mm', fontWeight: 600, fontSize: fs(9), textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {p.isLoteamento ? 'Urbanismo' : (lang === 'en' ? 'Architecture' : 'Arquitetura')}
                </td>
              </tr>
              <tr style={{ background: C.offWhite, borderBottom: `1px solid ${C.cinzaLinha}`, fontWeight: 600 }}>
                <td style={{ padding: '3mm', color: C.grafite }}>{p.isLoteamento ? 'Honorários Urbanismo' : t('proposal.archFees', lang)}</td>
                <td style={{ textAlign: 'right', padding: '3mm' }}>
                  <span style={{ fontWeight: 600 }}>{formatCurrency(p.valorArq, lang)}</span>
                  <span style={{ fontSize: fs(8), color: C.cinzaMarca, fontWeight: 400, marginLeft: '2mm' }}>
                    ({formatCurrency(p.valorArq * 1.23, lang)} c/IVA)
                  </span>
                </td>
              </tr>
              
              {/* ═══ SECÇÃO: ESPECIALIDADES / INFRAESTRUTURAS ═══ */}
              {p.especialidades.length > 0 && (
                <>
                  <tr style={{ background: C.accent, color: C.onAccent }}>
                    <td colSpan={2} style={{ padding: '2.5mm 3mm', fontWeight: 600, fontSize: fs(9), textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {p.isLoteamento ? 'Especialidades de Infraestruturas' : (lang === 'en' ? 'Specialties' : 'Especialidades')}
                    </td>
                  </tr>
                  {p.especialidades.map((e) => (
                    <tr key={e.nome} style={{ borderBottom: `1px solid ${C.cinzaLinha}`, color: C.grafite }}>
                      <td style={{ padding: '2.5mm 3mm' }}>{e.nome}</td>
                      <td style={{ textAlign: 'right', padding: '2.5mm 3mm' }}>{formatCurrency(e.valor, lang)}</td>
                    </tr>
                  ))}
                  {p.valorEsp > 0 && (
                    <tr style={{ background: C.offWhite, borderBottom: `1px solid ${C.cinzaLinha}`, fontWeight: 600, color: C.grafite }}>
                      <td style={{ padding: '3mm' }}>{t('proposal.specialtiesSubtotal', lang)}</td>
                      <td style={{ textAlign: 'right', padding: '3mm' }}>
                        <span style={{ fontWeight: 600 }}>{formatCurrency(p.valorEsp, lang)}</span>
                        <span style={{ fontSize: fs(8), color: C.cinzaMarca, fontWeight: 400, marginLeft: '2mm' }}>
                          ({formatCurrency(p.valorEsp * 1.23, lang)} c/IVA)
                        </span>
                      </td>
                    </tr>
                  )}
                  {/* Nota: valores estimativos */}
                  <tr>
                    <td colSpan={2} style={{ padding: '2mm 3mm', fontSize: fs(8), fontStyle: 'italic', color: C.cinzaMarca }}>
                      {lang === 'en' 
                        ? '* Specialty values are estimates subject to adjustment after topographic survey, geotechnical report, definition of retaining structures, programme changes, or specific requirements from authorities (CM, ANEPC, SMAS).'
                        : '* Os valores das especialidades são estimativas sujeitas a retificação após levantamento topográfico, relatório geotécnico, definição de contenções, alterações de programa, ou exigências específicas de entidades (CM, ANEPC, SMAS).'}
                    </td>
                  </tr>
                </>
              )}
              
              {/* ═══ SECÇÃO: TOTAIS ═══ */}
              <tr style={{ background: C.accent, color: C.onAccent }}>
                <td colSpan={2} style={{ padding: '2.5mm 3mm', fontWeight: 600, fontSize: fs(9), textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {lang === 'en' ? 'Totals' : 'Totais'}
                </td>
              </tr>
              {p.totalSemIVA != null && p.valorIVA != null ? (
                <>
                  <tr style={{ borderBottom: `1px solid ${C.cinzaLinha}`, color: C.grafite, background: C.offWhite }}>
                    <td style={{ padding: '3mm', fontWeight: 600 }}>{t('proposal.totalExclVat', lang)}</td>
                    <td style={{ textAlign: 'right', padding: '3mm', fontWeight: 700, fontSize: fs(11) }}>{formatCurrency(p.totalSemIVA, lang)}</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${C.cinzaLinha}`, color: C.cinzaMarca }}>
                    <td style={{ padding: '3mm' }}>{t('proposal.vat', lang)} (23%)</td>
                    <td style={{ textAlign: 'right', padding: '3mm', fontStyle: 'italic' }}>+ {formatCurrency(p.valorIVA, lang)}</td>
                  </tr>
                  <tr style={{ background: C.accent, fontWeight: 700, fontSize: fs(13) }}>
                    <td style={{ padding: '4mm 3mm', color: C.onAccent }}>{t('proposal.totalInclVat', lang)}</td>
                    <td style={{ textAlign: 'right', padding: '4mm 3mm', color: C.onAccent }}>{formatCurrency(p.total, lang)}</td>
                  </tr>
                </>
              ) : (
                <tr style={{ background: C.accent, fontWeight: 700, fontSize: fs(13) }}>
                  <td style={{ padding: '4mm 3mm', color: C.onAccent }}>{t('proposal.total', lang)}</td>
                  <td style={{ textAlign: 'right', padding: '4mm 3mm', color: C.onAccent }}>{formatCurrency(p.total, lang)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Fases de pagamento */}
        <div className="pdf-no-break" style={{ marginTop: '4mm', paddingTop: '3mm', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
          <p className="section-title" style={{ fontSize: fs(9), fontWeight: 600, color: C.cinzaMarca, margin: '0 0 2mm 0', textTransform: 'uppercase', letterSpacing: '0.05em', breakAfter: 'avoid', pageBreakAfter: 'avoid' }}>{t('proposal.section2', lang)}</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: fs(8), marginBottom: '2mm' }}>
            <thead>
              <tr style={{ background: C.offWhite }}>
                <th style={{ padding: '2mm 3mm', textAlign: 'left', fontWeight: 600, fontSize: fs(9), color: C.cinzaMarca, borderBottom: `1px solid ${C.cinzaLinha}` }}>{t('proposal.phase', lang)}</th>
                <th style={{ padding: '2mm 3mm', textAlign: 'right', fontWeight: 600, fontSize: fs(9), color: C.cinzaMarca, borderBottom: `1px solid ${C.cinzaLinha}` }}>%</th>
                <th style={{ padding: '2mm 3mm', textAlign: 'right', fontWeight: 600, fontSize: fs(9), color: C.cinzaMarca, borderBottom: `1px solid ${C.cinzaLinha}` }}>{t('proposal.value', lang)}</th>
              </tr>
            </thead>
            <tbody>
              {p.fasesPagamento.map((f, idx) => {
                const isHeader = (f as { isHeader?: boolean }).isHeader;
                const destaque = !isHeader && f.nome.startsWith('Pormenores');
                if (isHeader) {
                  return (
                    <tr key={`${f.nome}-${idx}`} style={{ background: C.accentSoft }}>
                      <td colSpan={3} style={{ padding: '2.5mm 3mm', fontWeight: 600, fontSize: fs(9), color: C.accent }}>{f.nome}</td>
                    </tr>
                  );
                }
                return (
                  <tr
                    key={`${f.nome}-${idx}`}
                    style={{
                      borderBottom: `1px solid ${C.cinzaLinha}`,
                      ...(destaque ? { background: C.accentSoft2 } : {}),
                      color: C.grafite,
                    }}
                  >
                    <td style={{ padding: '2mm 3mm', fontWeight: destaque ? 600 : 400, color: destaque ? C.accent : undefined, wordBreak: 'break-word', overflowWrap: 'break-word' }}>{f.nome}</td>
                    <td style={{ textAlign: 'right', padding: '2mm 3mm', fontWeight: destaque ? 600 : 400 }}>{f.pct}%</td>
                    <td style={{ textAlign: 'right', padding: '2mm 3mm', fontWeight: destaque ? 600 : 400 }}>{f.valor != null ? formatCurrency(f.valor, lang) : ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p style={{ fontSize: fs(9), color: C.cinzaMarca, fontStyle: 'italic', margin: 0 }}>{t('proposal.paymentPhasesNote', lang)}</p>
        </div>

        {/* Descrição das fases - começa em página nova (página 4) */}
        <div className="page-break-before" style={{ paddingTop: '3mm', breakBefore: 'page', pageBreakBefore: 'always' }}>
          <p className="section-title" style={{ fontSize: fs(10), fontWeight: 600, color: C.cinzaMarca, margin: '0 0 5mm 0', textTransform: 'uppercase', letterSpacing: '0.05em', breakAfter: 'avoid', pageBreakAfter: 'avoid' }}>{t('proposal.section3', lang)}</p>
          {p.notaBim && (
            <div className="pdf-no-break" style={{ padding: '2.5mm 3mm', background: C.accentSoft2, borderRadius: 2, marginBottom: '3mm', borderLeft: `3px solid ${C.accent}`, pageBreakInside: 'avoid' }}>
              <p style={{ fontSize: fs(9), fontWeight: 600, margin: 0, color: C.accent }}>{p.isLoteamento ? 'Metodologia de trabalho' : t('proposal.bimMethodology', lang)}</p>
              <p style={{ fontSize: fs(8), color: C.cinzaMarca, margin: '1mm 0 0 0', lineHeight: 1.45 }}>{p.notaBim}</p>
            </div>
          )}
          {p.notaReunioes && (
            <div className="pdf-no-break" style={{ padding: '2.5mm 3mm', background: C.offWhite, borderRadius: 2, marginBottom: '3mm', borderLeft: `3px solid ${C.cinzaLinha}`, pageBreakInside: 'avoid' }}>
              <p style={{ fontSize: fs(9), fontWeight: 600, margin: 0, color: C.cinzaMarca }}>{t('proposal.reunioesContexto', lang)}</p>
              <p style={{ fontSize: fs(8), color: C.cinzaMarca, margin: '1mm 0 0 0', lineHeight: 1.45 }}>{p.notaReunioes}</p>
            </div>
          )}
          <div style={{ padding: '3mm 0', borderBottom: `1px solid ${C.cinzaLinha}` }}>
            <p style={{ fontSize: fs(9), fontWeight: 600, margin: '0 0 3mm 0', color: C.accent }}>{p.isLoteamento ? 'Projeto de Urbanismo / Loteamento' : t('proposal.architectureProject', lang)}</p>
            {p.descricaoFases.map((f) => (
              <div key={f.nome} className="pdf-no-break" style={{ marginBottom: '4mm', wordBreak: 'break-word', overflowWrap: 'break-word', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <p className="pdf-no-break" style={{ fontSize: fs(9), fontWeight: 600, margin: '0 0 1mm 0', color: C.grafite, pageBreakInside: 'avoid' }}>• {f.nome} ({f.pct}%)</p>
                {f.descricao && <p className="pdf-no-break" style={{ fontSize: fs(8), color: C.cinzaMarca, margin: 0, lineHeight: 1.4, pageBreakInside: 'avoid' }}>{f.descricao}</p>}
              </div>
            ))}
          </div>
          {p.especialidadesDescricoes.length > 0 && (
            <div style={{ padding: '3mm 0', borderBottom: `1px solid ${C.cinzaLinha}` }}>
              <p style={{ fontSize: fs(9), fontWeight: 600, margin: '0 0 3mm 0', color: C.accent }}>{p.isLoteamento ? 'Especialidades de Infraestruturas' : t('proposal.specialtiesProject', lang)}</p>
              {p.especialidadesDescricoes.map((e) => (
                <div key={e.nome} className="pdf-no-break" style={{ marginBottom: '4mm', wordBreak: 'break-word', overflowWrap: 'break-word', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                  <p className="pdf-no-break" style={{ fontSize: fs(9), fontWeight: 600, margin: '0 0 1mm 0', color: C.grafite, pageBreakInside: 'avoid' }}>• {e.nome}</p>
                  {e.descricao && <p className="pdf-no-break" style={{ fontSize: fs(8), color: C.cinzaMarca, margin: 0, lineHeight: 1.4, pageBreakInside: 'avoid' }}>{e.descricao}</p>}
                </div>
              ))}
            </div>
          )}
          {/* Extras - começa em página nova (página 5) */}
          {(p.extrasComDescricao ?? []).length > 0 && !p.mostrarPacotes && (() => {
            // Categorias de extras
            const CATEGORIAS_EXTRAS: { id: string; icon: string; nome: { pt: string; en: string }; ids: string[] }[] = [
              { id: 'projeto', icon: '📐', nome: { pt: 'Projeto & Execução', en: 'Project & Execution' }, ids: ['projeto_execucao_base', 'projeto_execucao_completa', 'orcamentacao'] },
              { id: 'visualizacao', icon: '🎨', nome: { pt: 'Visualização', en: 'Visualization' }, ids: ['renderizacoes', 'fotografia_obra', 'maquete'] },
              { id: 'estudos', icon: '📋', nome: { pt: 'Estudos & Certificações', en: 'Studies & Certifications' }, ids: ['estudo_viabilidade', 'relatorio_tecnico', 'certificacao_energetica', 'plantas_asbuilt', 'fotogrametria', 'ensaios_in_situ', 'simulacao_energetica'] },
              { id: 'obra', icon: '🔧', nome: { pt: 'Apoio à Obra', en: 'Construction Support' }, ids: ['fiscalizacao_visita', 'fiscalizacao_avenca', 'alteracao_projeto_obra', 'consulta_processo_camarario', 'reunioes_adicionais', 'deslocacoes'] },
            ];
            
            // Agrupar extras por categoria
            const extras = p.extrasComDescricao ?? [];
            const categoriasComExtras = CATEGORIAS_EXTRAS.map((cat) => ({
              ...cat,
              extras: extras.filter((e) => cat.ids.includes((e as { id?: string }).id ?? '')),
            })).filter((cat) => cat.extras.length > 0);
            
            // Extras não categorizados (fallback)
            const idsCategorizados = CATEGORIAS_EXTRAS.flatMap((c) => c.ids);
            const extrasOutros = extras.filter((e) => !idsCategorizados.includes((e as { id?: string }).id ?? ''));
            
            return (
            <div className="page-break-before" style={{ padding: '3mm 4mm', paddingTop: '3mm', background: C.offWhite, borderRadius: 2, breakBefore: 'page', pageBreakBefore: 'always' }}>
              <p style={{ fontSize: fs(10), fontWeight: 600, margin: '0 0 4mm 0', color: C.accent }}>{t('proposal.extrasInfo', lang)}</p>
              
              {categoriasComExtras.map((cat, catIndex) => (
                <div key={cat.id} style={{ marginBottom: catIndex < categoriasComExtras.length - 1 ? '5mm' : '3mm' }}>
                  {/* Header da categoria */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '2mm', 
                    marginBottom: '3mm',
                    paddingBottom: '1.5mm',
                    borderBottom: `1px solid ${C.cinzaLinha}`,
                  }}>
                    <span style={{ fontSize: fs(10) }}>{cat.icon}</span>
                    <span style={{ 
                      fontSize: fs(8), 
                      fontWeight: 700, 
                      color: C.grafite, 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.04em' 
                    }}>
                      {cat.nome[lang]}
                    </span>
                  </div>
                  
                  {/* Extras da categoria */}
                  {cat.extras.map((e) => {
                    const id = (e as { id?: string }).id;
                    const isFormulaExtra = id === 'projeto_execucao_base' || id === 'projeto_execucao_completa' || id === 'orcamentacao';
                    return (
                      <div
                        key={e.nome}
                        className="pdf-no-break"
                        style={{
                          marginBottom: '4mm',
                          marginLeft: '3mm',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          pageBreakInside: 'avoid',
                          ...(isFormulaExtra
                            ? { borderLeft: `3px solid ${C.accent}`, background: C.accentSoft, padding: '3mm 4mm', borderRadius: '0 2px 2px 0', marginLeft: 0 }
                            : {}),
                        }}
                      >
                        <p style={{ fontSize: fs(10), fontWeight: isFormulaExtra ? 700 : 600, margin: '0 0 1.5mm 0', color: isFormulaExtra ? C.accent : C.grafite }}>
                          • {e.nome}{e.ocultarValor ? '' : (e as { sobConsultaPrevia?: boolean }).sobConsultaPrevia ? ` — ${t('proposal.sobConsultaPrevia', lang)}` : e.sobConsulta ? ` — ${t('proposal.availableOnRequest', lang)}` : ` — ${formatCurrency(e.valor, lang)}`}
                        </p>
                        {e.formula && <p style={{ fontSize: fs(9), color: C.cinzaMarca, margin: '0 0 1.5mm 0', fontStyle: 'italic' }}>{e.formula}</p>}
                        {e.descricao && <p style={{ fontSize: fs(9), color: C.cinzaMarca, margin: 0, lineHeight: 1.5 }}>{e.descricao}</p>}
                      </div>
                    );
                  })}
                </div>
              ))}
              
              {/* Extras não categorizados */}
              {extrasOutros.length > 0 && (
                <div style={{ marginBottom: '3mm' }}>
                  {extrasOutros.map((e) => (
                    <div
                      key={e.nome}
                      className="pdf-no-break"
                      style={{
                        marginBottom: '4mm',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        pageBreakInside: 'avoid',
                      }}
                    >
                      <p style={{ fontSize: fs(10), fontWeight: 600, margin: '0 0 1.5mm 0', color: C.grafite }}>
                        • {e.nome}{e.ocultarValor ? '' : (e as { sobConsultaPrevia?: boolean }).sobConsultaPrevia ? ` — ${t('proposal.sobConsultaPrevia', lang)}` : e.sobConsulta ? ` — ${t('proposal.availableOnRequest', lang)}` : ` — ${formatCurrency(e.valor, lang)}`}
                      </p>
                      {e.descricao && <p style={{ fontSize: fs(9), color: C.cinzaMarca, margin: 0, lineHeight: 1.5 }}>{e.descricao}</p>}
                    </div>
                  ))}
                </div>
              )}
              
              <p style={{ fontSize: fs(9), color: C.cinzaMarca, margin: 0, fontStyle: 'italic', lineHeight: 1.45 }}>{t('proposal.extrasNote', lang)}</p>
            </div>
            );
          })()}

          {/* PACOTES DE SERVIÇO — Escolha por nível de segurança */}
          {p.mostrarPacotes && (p.pacotes ?? []).length > 0 && (
            <div style={{ marginTop: '4mm' }}>
              <p style={{ fontSize: fs(10), fontWeight: 600, margin: '0 0 4mm 0', color: C.accent, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('proposal.packages', lang)}</p>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '3mm 0' }}>
                <tbody>
                  <tr>
                    {(p.pacotes ?? []).map((pkg) => {
                      const isRecommended = pkg.recomendado;
                      return (
                        <td
                          key={pkg.id}
                          className="pdf-no-break"
                          style={{
                            width: '33.33%',
                            verticalAlign: 'top',
                            padding: '4mm',
                            background: isRecommended ? C.accentSoft : C.offWhite,
                            borderRadius: 3,
                            border: isRecommended ? `2px solid ${C.accent}` : `1px solid ${C.cinzaLinha}`,
                            pageBreakInside: 'avoid',
                          }}
                        >
                          {isRecommended && (
                            <div style={{
                              background: C.accent,
                              color: C.onAccent,
                              fontSize: fs(7),
                              fontWeight: 700,
                              padding: '1mm 2.5mm',
                              borderRadius: 2,
                              textTransform: 'uppercase',
                              display: 'inline-block',
                              marginBottom: '2mm',
                            }}>
                              ★ {t('proposal.recommended', lang)}
                            </div>
                          )}
                          <p style={{ fontSize: fs(11), fontWeight: 700, margin: isRecommended ? '0 0 1mm 0' : '0 0 1mm 0', color: isRecommended ? C.accent : C.grafite }}>
                            {pkg.nome}
                          </p>
                          <p style={{ fontSize: fs(8), color: C.cinzaMarca, margin: '0 0 3mm 0', minHeight: '8mm' }}>
                            {pkg.descricao}
                          </p>
                          {(pkg.itens ?? []).length > 0 && (
                            <ul style={{ margin: '0 0 3mm 0', padding: 0, fontSize: fs(8), color: C.grafite, lineHeight: 1.5, listStyleType: 'none' }}>
                              {(pkg.itens ?? []).map((item, i) => (
                                <li key={i} style={{ marginBottom: '1mm', paddingLeft: '3mm', position: 'relative' }}>
                                  <span style={{ position: 'absolute', left: 0, color: '#16a34a', fontWeight: 700 }}>✓</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          )}
                          <div style={{
                            borderTop: `1px solid ${isRecommended ? C.accent : C.cinzaLinha}`,
                            paddingTop: '3mm',
                            marginTop: '2mm',
                            textAlign: 'center',
                          }}>
                            <p style={{ fontSize: fs(8), color: C.cinzaMarca, margin: '0 0 1mm 0', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                              {lang === 'en' ? 'Total' : 'Total c/ IVA'}
                            </p>
                            <p style={{
                              fontSize: fs(14),
                              fontWeight: 700,
                              margin: 0,
                              color: isRecommended ? C.accent : C.grafite,
                            }}>
                              {formatCurrency(pkg.valor, lang)}
                            </p>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
              <p style={{ fontSize: fs(8), color: C.cinzaMarca, fontStyle: 'italic', margin: '3mm 0 0 0' }}>
                {t('proposal.extrasNote', lang)}
              </p>
            </div>
          )}
        </div>

        {/* Estimativa de execução - começa em página nova */}
        {(p.duracaoEstimada ?? []).length > 0 && (
          <div className="page-break-before" style={{ paddingTop: '3mm', breakBefore: 'page', pageBreakBefore: 'always' }}>
            {/* Título + cabeçalho da tabela ficam sempre juntos */}
            <div className="pdf-no-break" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <p className="section-title" style={{ fontSize: fs(9), fontWeight: 600, color: C.cinzaMarca, margin: '0 0 2mm 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('proposal.section4', lang)}</p>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: fs(10), marginBottom: '2mm' }}>
                <thead>
                  <tr style={{ background: C.offWhite }}>
                    <th style={{ padding: '2mm 3mm', textAlign: 'left', fontWeight: 600, fontSize: fs(9), color: C.cinzaMarca, borderBottom: `1px solid ${C.cinzaLinha}` }}>{t('proposal.phase', lang)}</th>
                    <th style={{ padding: '2mm 3mm', textAlign: 'right', fontWeight: 600, fontSize: fs(9), color: C.cinzaMarca, borderBottom: `1px solid ${C.cinzaLinha}` }}>{t('proposal.estimatedDuration', lang)}</th>
                  </tr>
                </thead>
                <tbody>
                  {(p.duracaoEstimada ?? []).slice(0, 2).map((d) => (
                    <tr key={d.nome} style={{ borderBottom: `1px solid ${C.cinzaLinha}`, color: C.grafite }}>
                      <td style={{ padding: '2mm 3mm', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{d.nome}</td>
                      <td style={{ textAlign: 'right', padding: '2mm 3mm' }}>{d.duracao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Restantes linhas podem quebrar */}
            {(p.duracaoEstimada ?? []).length > 2 && (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: fs(10), marginBottom: '2mm' }}>
                <tbody>
                  {(p.duracaoEstimada ?? []).slice(2).map((d) => (
                    <tr key={d.nome} style={{ borderBottom: `1px solid ${C.cinzaLinha}`, color: C.grafite }}>
                      <td style={{ padding: '2mm 3mm', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{d.nome}</td>
                      <td style={{ textAlign: 'right', padding: '2mm 3mm' }}>{d.duracao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <p style={{ fontSize: fs(9), color: C.cinzaMarca, fontStyle: 'italic', margin: 0 }}>{t('proposal.durationNote', lang)}</p>
            
            {/* Cenários de Prazo - logo após a tabela de duração */}
            {p.mostrarCenarios && p.cenariosPrazo && (
              <div style={{ marginTop: '4mm', padding: '3mm 4mm', background: C.offWhite, borderRadius: 2, borderLeft: `3px solid ${C.accent}` }}>
                <p style={{ fontSize: fs(10), fontWeight: 600, color: C.accent, margin: '0 0 3mm 0' }}>{t('proposal.timelineScenarios', lang)}</p>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: fs(9) }}>
                  <tbody>
                    <tr style={{ borderBottom: `1px solid ${C.cinzaLinha}` }}>
                      <td style={{ padding: '2.5mm 3mm', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2mm' }}>
                        <span style={{ width: '2.5mm', height: '2.5mm', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
                        <span style={{ color: '#16a34a' }}>{t('proposal.bestCase', lang)}</span>
                      </td>
                      <td style={{ padding: '2.5mm 3mm', textAlign: 'right', color: C.grafite }}>{p.cenariosPrazo.melhorCaso}</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${C.cinzaLinha}`, background: C.accentSoft2 }}>
                      <td style={{ padding: '2.5mm 3mm', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2mm' }}>
                        <span style={{ width: '2.5mm', height: '2.5mm', borderRadius: '50%', background: C.accent, display: 'inline-block' }} />
                        <span style={{ color: C.accent }}>{t('proposal.typicalCase', lang)}</span>
                      </td>
                      <td style={{ padding: '2.5mm 3mm', textAlign: 'right', color: C.grafite, fontWeight: 600 }}>{p.cenariosPrazo.casoTipico}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '2.5mm 3mm', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2mm' }}>
                        <span style={{ width: '2.5mm', height: '2.5mm', borderRadius: '50%', background: '#dc2626', display: 'inline-block' }} />
                        <span style={{ color: '#dc2626' }}>{t('proposal.worstCase', lang)}</span>
                      </td>
                      <td style={{ padding: '2.5mm 3mm', textAlign: 'right', color: C.grafite }}>{p.cenariosPrazo.piorCaso}</td>
                    </tr>
                  </tbody>
                </table>
                <p style={{ fontSize: fs(8), color: C.cinzaMarca, fontStyle: 'italic', margin: '2mm 0 0 0' }}>{t('proposal.timelineNote', lang)}</p>
              </div>
            )}
          </div>
        )}

        {/* Exclusões - agrupadas por categoria */}
        {p.exclusoes.length > 0 && (() => {
          // Identificar exclusões de especialidades (começam com padrões específicos)
          const espPatterns = ['Ensaios', 'Equipamentos', 'Central', 'Certificação', 'Cablagem', 'Etiquetagem', 'Projeto de manutenção', 'Reforços', 'Demolições', 'Monitorização', 'ETAR', 'Bombas', 'rega', 'Quadros', 'Grupos', 'Instalação fotovoltaica', 'antena'];
          const isEspExclusao = (label: string) => espPatterns.some(p => label.includes(p));
          
          const arqExclusoes = p.exclusoes.filter(e => !isEspExclusao(e));
          const espExclusoes = p.exclusoes.filter(e => isEspExclusao(e));
          
          return (
            <div className="pdf-no-break" style={{ marginTop: '6mm', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <p className="section-title" style={{ fontSize: fs(9), fontWeight: 600, color: C.cinzaMarca, margin: '0 0 2mm 0', textTransform: 'uppercase', letterSpacing: '0.05em', breakAfter: 'avoid', pageBreakAfter: 'avoid' }}>{t('proposal.section5', lang)}</p>
              
              <div style={{ display: 'flex', gap: '3mm' }}>
                {/* Coluna Arquitetura / Urbanismo */}
                <div style={{ flex: 1, padding: '2mm', background: C.offWhite, borderRadius: 2 }}>
                  <p style={{ fontSize: fs(8), fontWeight: 600, color: C.accent, margin: '0 0 1.5mm 0' }}>
                    {p.isLoteamento ? 'Urbanismo' : (lang === 'en' ? 'Architecture' : 'Arquitetura')}
                  </p>
                  <ul style={{ margin: 0, paddingLeft: '3mm', fontSize: fs(7), color: C.cinzaMarca, lineHeight: 1.4, listStyleType: 'none' }}>
                    {arqExclusoes.map((label) => (
                      <li key={label} style={{ marginBottom: '0.5mm', paddingLeft: '1.5mm', borderLeft: `1px solid ${C.cinzaLinha}` }}>{label}</li>
                    ))}
                  </ul>
                </div>
                
                {/* Coluna Especialidades (se houver) */}
                {espExclusoes.length > 0 && (
                  <div style={{ flex: 1, padding: '2mm', background: C.offWhite, borderRadius: 2 }}>
                    <p style={{ fontSize: fs(8), fontWeight: 600, color: C.accent, margin: '0 0 1.5mm 0' }}>
                      {lang === 'en' ? 'Specialties' : 'Especialidades'}
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '3mm', fontSize: fs(7), color: C.cinzaMarca, lineHeight: 1.4, listStyleType: 'none' }}>
                      {espExclusoes.map((label) => (
                        <li key={label} style={{ marginBottom: '0.5mm', paddingLeft: '1.5mm', borderLeft: `1px solid ${C.cinzaLinha}` }}>{label}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Notas - começa em página nova */}
        <div className="page-break-before" style={{ paddingTop: '3mm', fontSize: fs(8), color: C.cinzaMarca, breakBefore: 'page', pageBreakBefore: 'always' }}>
          <p style={{ fontSize: fs(9), fontWeight: 600, color: C.cinzaMarca, margin: '0 0 2mm 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('proposal.section6', lang)}</p>
          
          {/* Notas gerais (primeiras 6) */}
          <ul style={{ margin: '0 0 3mm 0', paddingLeft: '4mm', lineHeight: 1.4, listStyleType: 'disc', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
            {p.notas.slice(0, 6).map((n) => (
              <li key={n} style={{ pageBreakInside: 'avoid', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{n}</li>
            ))}
          </ul>
          
          {/* Notas de proteção de âmbito (últimas notas) - destacadas */}
          {p.notas.length > 6 && (
            <div style={{ padding: '3mm 4mm', background: C.offWhite, borderRadius: 2, borderLeft: `3px solid ${C.accent}` }}>
              <p style={{ fontSize: fs(9), fontWeight: 600, color: C.accent, margin: '0 0 2mm 0', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                {lang === 'en' ? 'Scope Conditions' : 'Condições de Âmbito'}
              </p>
              <ul style={{ margin: 0, paddingLeft: '4mm', lineHeight: 1.5, listStyleType: 'none', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                {p.notas.slice(6).map((n, i) => (
                  <li key={n} style={{ pageBreakInside: 'avoid', wordBreak: 'break-word', overflowWrap: 'break-word', marginBottom: i < p.notas.length - 7 ? '1.5mm' : 0, paddingLeft: '2mm', borderLeft: `1.5px solid ${C.accent}` }}>{n}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ESTIMATIVA DE INVESTIMENTO EM OBRA - segue após notas */}
        {p.custosConstrucao && p.areaNum && p.areaNum > 0 && (() => {
          // Valores fixos por m² (chave na mão)
          const custoMin = 1200;
          const custoMed = 1500;
          const custoMax = 2000;
          const area = p.areaNum;
          
          // Totais sem IVA
          const totalMinSemIVA = area * custoMin;
          const totalMedSemIVA = area * custoMed;
          const totalMaxSemIVA = area * custoMax;
          
          // Totais com IVA (6% para construção nova habitação)
          const ivaRate = 0.06;
          const totalMinComIVA = Math.round(totalMinSemIVA * (1 + ivaRate));
          const totalMedComIVA = Math.round(totalMedSemIVA * (1 + ivaRate));
          const totalMaxComIVA = Math.round(totalMaxSemIVA * (1 + ivaRate));
          
          return (
          <div style={{ marginTop: '6mm', marginBottom: '6mm', padding: '4mm 5mm', background: C.offWhite, borderRadius: 3, border: `1px solid ${C.cinzaLinha}` }}>
            <p style={{ fontSize: fs(10), fontWeight: 700, margin: '0 0 2mm 0', color: C.accent, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {lang === 'en' ? 'Construction Investment Estimate' : 'Estimativa de Investimento em Obra'}
            </p>
            
            <p style={{ fontSize: fs(8), color: C.cinzaMarca, margin: '0 0 3mm 0' }}>
              {lang === 'en' 
                ? `Area: ${area} m² · Typology: ${p.tipologia} · Turnkey values (estimated)`
                : `Área: ${area} m² · Tipologia: ${p.tipologia} · Valores chave na mão (estimados)`}
            </p>
            
            {/* Grid de 3 cenários */}
            <div style={{ display: 'flex', gap: '3mm', marginBottom: '3mm' }}>
              {/* Económico */}
              <div style={{ flex: 1, padding: '3mm', background: C.white, borderRadius: 2, border: `1px solid ${C.cinzaLinha}`, textAlign: 'center', position: 'relative' }}>
                <p style={{ fontSize: fs(7), color: C.cinzaMarca, margin: '0 0 1.5mm 0', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  {lang === 'en' ? 'Economic' : 'Económico'}
                </p>
                <p style={{ fontSize: fs(6.5), color: C.cinzaMarca, margin: '0 0 0.5mm 0' }}>
                  s/ IVA: <strong style={{ color: C.grafite }}>{formatCurrency(totalMinSemIVA, lang)}</strong>
                </p>
                <p style={{ fontSize: fs(10), fontWeight: 700, color: C.grafite, margin: '0 0 1.5mm 0' }}>
                  c/ IVA: {formatCurrency(totalMinComIVA, lang)}
                </p>
                <p style={{ fontSize: fs(7), color: C.cinzaMarca, margin: 0, fontWeight: 500 }}>
                  {custoMin}€/m²
                </p>
              </div>
              
              {/* Médio - com badge "Mais comum" */}
              <div style={{ flex: 1, padding: '3mm', background: C.accentSoft, borderRadius: 2, border: `2px solid ${C.accent}`, textAlign: 'center', position: 'relative' }}>
                {/* Badge */}
                <span style={{ 
                  position: 'absolute', 
                  top: '-2.5mm', 
                  left: '50%', 
                  transform: 'translateX(-50%)',
                  background: C.accent, 
                  color: C.onAccent, 
                  fontSize: fs(6), 
                  fontWeight: 700, 
                  padding: '0.8mm 2.5mm', 
                  borderRadius: 2,
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  whiteSpace: 'nowrap',
                }}>
                  {lang === 'en' ? '★ Most common' : '★ Mais comum'}
                </span>
                <p style={{ fontSize: fs(7), color: C.accent, margin: '1mm 0 1.5mm 0', textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: 600 }}>
                  {lang === 'en' ? 'Medium' : 'Médio'}
                </p>
                <p style={{ fontSize: fs(6.5), color: C.accent, margin: '0 0 0.5mm 0', opacity: 0.85 }}>
                  s/ IVA: <strong>{formatCurrency(totalMedSemIVA, lang)}</strong>
                </p>
                <p style={{ fontSize: fs(12), fontWeight: 700, color: C.accent, margin: '0 0 1.5mm 0' }}>
                  c/ IVA: {formatCurrency(totalMedComIVA, lang)}
                </p>
                <p style={{ fontSize: fs(7), color: C.accent, margin: 0, fontWeight: 600 }}>
                  {custoMed}€/m²
                </p>
              </div>
              
              {/* Premium */}
              <div style={{ flex: 1, padding: '3mm', background: C.white, borderRadius: 2, border: `1px solid ${C.cinzaLinha}`, textAlign: 'center', position: 'relative' }}>
                <p style={{ fontSize: fs(7), color: C.cinzaMarca, margin: '0 0 1.5mm 0', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  Premium
                </p>
                <p style={{ fontSize: fs(6.5), color: C.cinzaMarca, margin: '0 0 0.5mm 0' }}>
                  s/ IVA: <strong style={{ color: C.grafite }}>{formatCurrency(totalMaxSemIVA, lang)}</strong>
                </p>
                <p style={{ fontSize: fs(10), fontWeight: 700, color: C.grafite, margin: '0 0 1.5mm 0' }}>
                  c/ IVA: {formatCurrency(totalMaxComIVA, lang)}
                </p>
                <p style={{ fontSize: fs(7), color: C.cinzaMarca, margin: 0, fontWeight: 500 }}>
                  {custoMax}€/m²
                </p>
              </div>
            </div>
            
            {/* Barra visual comparativa */}
            <div style={{ marginBottom: '3mm' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2mm', fontSize: fs(6.5), color: C.cinzaMarca }}>
                <span>{custoMin}€</span>
                <div style={{ flex: 1, height: '4mm', background: `linear-gradient(to right, #e8f5e9 0%, ${C.accentSoft} 37.5%, #fff3e0 100%)`, borderRadius: 2, position: 'relative' }}>
                  {/* Marcador do valor médio */}
                  <div style={{ 
                    position: 'absolute', 
                    left: '37.5%', 
                    top: '-1mm', 
                    bottom: '-1mm',
                    width: '2px',
                    background: C.accent,
                  }} />
                </div>
                <span>{custoMax}€</span>
              </div>
              <p style={{ fontSize: fs(6), color: C.cinzaMarca, margin: '1mm 0 0 0', textAlign: 'center' }}>
                {lang === 'en' ? 'Cost scale per m² (turnkey)' : 'Escala de custo por m² (chave na mão)'}
              </p>
            </div>
            
            {/* Disclaimer */}
            <p style={{ fontSize: fs(7), color: C.cinzaMarca, margin: 0, fontStyle: 'italic', lineHeight: 1.4 }}>
              {lang === 'en' 
                ? '* Estimated turnkey values (construction + finishes). VAT at 6% (new construction). Does not include land, fees, licences, or architecture projects. Subject to detailed specification.'
                : '* Valores estimados chave na mão (construção + acabamentos). IVA a 6% (construção nova). Não inclui terreno, taxas, licenças ou projetos de arquitetura. Sujeito a especificação detalhada.'}
            </p>
            
            {/* Custos Adicionais a Considerar */}
            <div style={{ marginTop: '5mm', padding: '3mm 4mm', background: C.white, borderRadius: 2, border: `1px dashed ${C.cinzaLinha}` }}>
              <p style={{ fontSize: fs(9), fontWeight: 700, margin: '0 0 2mm 0', color: C.grafite }}>
                {lang === 'en' ? '💡 Additional Costs to Consider' : '💡 Custos Adicionais a Considerar'}
              </p>
              <p style={{ fontSize: fs(7), color: C.cinzaMarca, margin: '0 0 2mm 0', lineHeight: 1.4 }}>
                {lang === 'en' 
                  ? 'For complete budget planning, remember to include:'
                  : 'Para um planeamento completo do orçamento, não esquecer de incluir:'}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2mm' }}>
                {[
                  { icon: '🏛️', pt: 'Taxas e licenças camarárias', en: 'Municipal fees and licences' },
                  { icon: '🔌', pt: 'Ligações (água, luz, gás, esgotos)', en: 'Utility connections (water, electricity, gas, sewage)' },
                  { icon: '🌳', pt: 'Arranjos exteriores / paisagismo', en: 'Landscaping / exterior works' },
                  { icon: '🍳', pt: 'Cozinha e eletrodomésticos', en: 'Kitchen and appliances' },
                  { icon: '📦', pt: 'Mobiliário e decoração', en: 'Furniture and decoration' },
                  { icon: '⚠️', pt: 'Margem para imprevistos (10-15%)', en: 'Contingency margin (10-15%)' },
                ].map((item, i) => (
                  <span key={i} style={{ 
                    fontSize: fs(7), 
                    color: C.cinzaMarca, 
                    background: C.offWhite, 
                    padding: '1mm 2mm', 
                    borderRadius: 2,
                    whiteSpace: 'nowrap',
                  }}>
                    {item.icon} {lang === 'en' ? item.en : item.pt}
                  </span>
                ))}
              </div>
            </div>
          </div>
          );
        })()}

        {/* GUIA DE OBRA — Faseamento e Custos de Construção */}
        {p.mostrarGuiaObra && p.tipologiaCategoria && (() => {
          const phases = getPhasesByCategory(p.tipologiaCategoria);
          const costs = p.tipologiaId ? getCostsByTypology(p.tipologiaId) : undefined;
          const estimates = p.tipologiaId && p.areaNum ? calculateConstructionEstimate(p.tipologiaId, p.areaNum) : null;
          
          if (!phases && !costs) return null;
          
          return (
            <div className="page-break-before" style={{ breakBefore: 'page', pageBreakBefore: 'always' }}>
              {/* Cabeçalho do Guia */}
              <div style={{ marginBottom: '5mm', padding: '3mm 4mm', background: C.accent, borderRadius: 3 }}>
                <p style={{ fontSize: fs(12), fontWeight: 700, color: C.onAccent, margin: 0, letterSpacing: '0.02em' }}>
                  {lang === 'en' ? 'CONSTRUCTION GUIDE' : 'GUIA DE CONSTRUÇÃO'}
                </p>
                <p style={{ fontSize: fs(9), color: C.onAccentMuted, margin: '1mm 0 0 0' }}>
                  {lang === 'en' ? 'Typical phases and estimated costs for' : 'Faseamento típico e custos estimados para'} {p.tipologia}
                </p>
              </div>

              {/* Estimativa de Custos de Construção */}
              {costs && (
                <div className="pdf-no-break" style={{ marginBottom: '5mm', padding: '4mm', background: C.accentSoft, borderRadius: 3, border: `2px solid ${C.accent}`, pageBreakInside: 'avoid' }}>
                  <p style={{ fontSize: fs(10), fontWeight: 700, color: C.accent, margin: '0 0 3mm 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {lang === 'en' ? 'Estimated Construction Cost' : 'Estimativa de Custo de Construção'}
                  </p>
                  
                  {/* Tabela de custos por m² */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '3mm' }}>
                    <thead>
                      <tr style={{ background: C.offWhite }}>
                        <th style={{ padding: '2mm 3mm', textAlign: 'left', fontSize: fs(8), color: C.cinzaMarca, fontWeight: 600, borderBottom: `1px solid ${C.cinzaLinha}` }}>
                          {lang === 'en' ? 'Finish Level' : 'Nível de Acabamento'}
                        </th>
                        <th style={{ padding: '2mm 3mm', textAlign: 'center', fontSize: fs(8), color: C.cinzaMarca, fontWeight: 600, borderBottom: `1px solid ${C.cinzaLinha}` }}>€/m²</th>
                        {estimates && (
                          <th style={{ padding: '2mm 3mm', textAlign: 'right', fontSize: fs(8), color: C.cinzaMarca, fontWeight: 600, borderBottom: `1px solid ${C.cinzaLinha}` }}>
                            {lang === 'en' ? `Total (${p.areaNum} m²)` : `Total (${p.areaNum} m²)`}
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: `1px solid ${C.cinzaLinha}` }}>
                        <td style={{ padding: '2mm 3mm', fontSize: fs(9), color: C.grafite }}>
                          {lang === 'en' ? 'Basic (standard finishes)' : 'Básico (acabamentos standard)'}
                        </td>
                        <td style={{ padding: '2mm 3mm', textAlign: 'center', fontSize: fs(9), color: C.grafite }}>{costs.minCost.toLocaleString('pt-PT')} €</td>
                        {estimates && (
                          <td style={{ padding: '2mm 3mm', textAlign: 'right', fontSize: fs(9), color: C.grafite }}>{estimates.min.toLocaleString('pt-PT')} €</td>
                        )}
                      </tr>
                      <tr style={{ borderBottom: `1px solid ${C.cinzaLinha}`, background: C.accentSoft }}>
                        <td style={{ padding: '2mm 3mm', fontSize: fs(9), fontWeight: 600, color: C.accent }}>
                          {lang === 'en' ? 'Medium (quality finishes)' : 'Médio (acabamentos de qualidade)'}
                        </td>
                        <td style={{ padding: '2mm 3mm', textAlign: 'center', fontSize: fs(10), fontWeight: 700, color: C.accent }}>{costs.medCost.toLocaleString('pt-PT')} €</td>
                        {estimates && (
                          <td style={{ padding: '2mm 3mm', textAlign: 'right', fontSize: fs(10), fontWeight: 700, color: C.accent }}>{estimates.med.toLocaleString('pt-PT')} €</td>
                        )}
                      </tr>
                      <tr>
                        <td style={{ padding: '2mm 3mm', fontSize: fs(9), color: C.grafite }}>
                          {lang === 'en' ? 'Premium (high-end finishes)' : 'Premium (acabamentos de luxo)'}
                        </td>
                        <td style={{ padding: '2mm 3mm', textAlign: 'center', fontSize: fs(9), color: C.grafite }}>{costs.maxCost.toLocaleString('pt-PT')} €</td>
                        {estimates && (
                          <td style={{ padding: '2mm 3mm', textAlign: 'right', fontSize: fs(9), color: C.grafite }}>{estimates.max.toLocaleString('pt-PT')} €</td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                  
                  {costs.notes && (
                    <p style={{ fontSize: fs(8), color: C.cinzaMarca, fontStyle: 'italic', margin: 0 }}>* {costs.notes}</p>
                  )}
                  <p style={{ fontSize: fs(7), color: C.cinzaMarca, margin: '2mm 0 0 0' }}>
                    {lang === 'en' 
                      ? '* Values are indicative estimates (2024) and may vary according to market conditions, location and specific requirements.'
                      : '* Valores são estimativas indicativas (2024) e podem variar conforme condições de mercado, localização e requisitos específicos.'}
                  </p>
                </div>
              )}

              {/* Faseamento de Obra */}
              {phases && (
                <div style={{ marginBottom: '5mm' }}>
                  <div className="pdf-no-break" style={{ marginBottom: '3mm', pageBreakInside: 'avoid' }}>
                    <p style={{ fontSize: fs(10), fontWeight: 700, color: C.accent, margin: '0 0 2mm 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {lang === 'en' ? 'Construction Phases' : 'Faseamento de Obra'} — {phases.category}
                    </p>
                    <p style={{ fontSize: fs(9), color: C.cinzaMarca, margin: 0 }}>
                      {lang === 'en' ? 'Typical total duration:' : 'Duração total típica:'} <strong>{phases.totalDuration}</strong>
                    </p>
                  </div>
                  
                  {phases.phases.map((phase, index) => (
                    <div 
                      key={phase.id} 
                      className="pdf-no-break"
                      style={{ 
                        marginBottom: '3mm', 
                        padding: '3mm', 
                        background: index % 2 === 0 ? C.offWhite : C.white, 
                        borderRadius: 2,
                        borderLeft: `3px solid ${C.accent}`,
                        pageBreakInside: 'avoid',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1mm' }}>
                        <p style={{ fontSize: fs(9), fontWeight: 600, color: C.grafite, margin: 0 }}>{phase.name}</p>
                        <span style={{ fontSize: fs(8), color: C.accent, fontWeight: 600, whiteSpace: 'nowrap', marginLeft: '3mm' }}>{phase.duration}</span>
                      </div>
                      <p style={{ fontSize: fs(8), color: C.cinzaMarca, margin: 0, lineHeight: 1.4 }}>{phase.description}</p>
                      {phase.tips && (
                        <p style={{ fontSize: fs(7), color: C.accent, margin: '1mm 0 0 0', fontStyle: 'italic' }}>💡 {phase.tips}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Nota final */}
              <div style={{ padding: '3mm', background: C.offWhite, borderRadius: 2, borderLeft: `3px solid ${C.cinzaMarca}` }}>
                <p style={{ fontSize: fs(8), color: C.cinzaMarca, margin: 0, lineHeight: 1.5 }}>
                  {lang === 'en'
                    ? 'This guide is for planning purposes only. Actual timelines and costs depend on project complexity, contractor availability, and market conditions. We recommend obtaining detailed quotes from qualified contractors.'
                    : 'Este guia é apenas para fins de planeamento. Prazos e custos reais dependem da complexidade do projeto, disponibilidade de empreiteiros e condições de mercado. Recomendamos a obtenção de orçamentos detalhados junto de empreiteiros qualificados.'}
                </p>
              </div>
            </div>
          );
        })()}

        {/* Última página: Company Snapshot + Assinaturas no fundo */}
        <div className="page-break-before last-page-container" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '230mm',
          paddingTop: '3mm',
          breakBefore: 'page', 
          pageBreakBefore: 'always' 
        }}>
          {/* Company Snapshot - Sobre a empresa */}
          <div style={{ marginBottom: '6mm' }}>
            <p style={{ fontSize: fs(9), fontWeight: 600, color: C.cinzaMarca, margin: '0 0 3mm 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {lang === 'en' ? 'About Us' : 'Sobre Nós'}
            </p>
            <CompanySnapshot variant="full" lang={lang} forPrint={true} />
          </div>

          {/* Espaçador flexível para empurrar assinaturas para baixo */}
          <div style={{ flex: 1 }} />

          {/* Assinaturas - sempre no fundo da página */}
          {(branding.architectName || p.cliente) && (
            <div className="pdf-no-break" style={{ paddingTop: '4mm', borderTop: `1px solid ${C.cinzaLinha}`, pageBreakInside: 'avoid' }}>
              {/* Mini-resumo de confirmação */}
              <div style={{ marginBottom: '4mm', padding: '2mm 3mm', background: C.offWhite, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: fs(8) }}>
                <span style={{ color: C.cinzaMarca }}>
                  {lang === 'en' ? 'Acceptance implies agreement with all terms described.' : 'A aceitação implica concordância com todas as condições.'}
                </span>
                <span style={{ textAlign: 'right' }}>
                  {p.totalSemIVA != null && (
                    <span style={{ color: C.cinzaMarca, marginRight: '2mm' }}>{formatCurrency(p.totalSemIVA, lang)} s/IVA</span>
                  )}
                  <span style={{ fontWeight: 600, color: C.accent }}>{formatCurrency(p.total, lang)} c/IVA</span>
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10mm', fontSize: fs(9) }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, margin: '0 0 1mm 0', color: C.accent, fontSize: fs(9) }}>{t('proposal.responsible', lang)}</p>
                  {branding.architectName && (
                    <p style={{ margin: 0, color: C.cinzaMarca, fontSize: fs(8) }}>
                      {branding.architectName}{branding.architectOasrn ? ` — n.º ${branding.architectOasrn} OASRN` : ''}
                    </p>
                  )}
                  <div style={{ marginTop: '4mm', borderBottom: `1px solid ${C.accent}`, width: '45mm', height: '6mm' }} />
                  <p style={{ fontSize: fs(7), color: C.cinzaMarca, margin: '1mm 0 0 0' }}>{lang === 'en' ? 'Date' : 'Data'}: ___/___/______</p>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, margin: '0 0 1mm 0', color: C.accent, fontSize: fs(9) }}>{t('proposal.client', lang)}</p>
                  {p.cliente && <p style={{ margin: 0, color: C.cinzaMarca, fontSize: fs(8) }}>{p.cliente}</p>}
                  <div style={{ marginTop: '4mm', borderBottom: `1px solid ${C.accent}`, width: '45mm', height: '6mm' }} />
                  <p style={{ fontSize: fs(7), color: C.cinzaMarca, margin: '1mm 0 0 0' }}>{lang === 'en' ? 'Date' : 'Data'}: ___/___/______</p>
                </div>
              </div>
            </div>
          )}

          <p style={{ fontSize: fs(8), color: C.cinzaMarca, margin: '3mm 0 0 0', fontStyle: 'italic' }}>
            {t('proposal.disclaimer', lang)}
          </p>
        </div>
      </div>

      {/* Rodapé fixo para impressão - aparece em todas as páginas */}
      <div className="print-footer">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ textAlign: 'left', padding: 0, color: '#9ca3af' }}>{p.ref} <span style={{ color: '#d1d5db' }}>•</span> {p.cliente}</td>
              <td style={{ textAlign: 'right', padding: 0 }}>
                <span style={{ fontWeight: 600, color: C.accent }}>{branding.appName.toUpperCase()}</span>
                <span style={{ color: '#d1d5db' }}> • </span>
                <span style={{ color: '#9ca3af' }}>{branding.website || 'ferreirarquitetos.pt'}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
