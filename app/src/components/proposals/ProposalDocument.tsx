/**
 * Componente partilhado para renderizar o documento da proposta.
 * Usado na previsão (CalculatorPage) e na página pública (PropostaPublicPage).
 */
import { formatCurrency } from '../../lib/proposalPayload';
import { PROPOSAL_PALETTE } from '../../lib/proposalPalette';
import { t, type Lang } from '../../locales';
import type { ProposalPayload } from '../../lib/proposalPayload';

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
        <div className="pdf-no-break" style={{ background: C.offWhite, borderRadius: 2, padding: '3mm 4mm', marginBottom: '4mm', pageBreakInside: 'avoid' }}>
          {p.cliente && <p style={{ margin: '0 0 1mm 0', fontSize: fs(10), color: C.grafite }}><span style={{ color: C.cinzaMarca, fontWeight: 500 }}>{t('proposal.client', lang)}:</span> {p.cliente}</p>}
          {p.projeto && <p style={{ margin: '0 0 1mm 0', fontSize: fs(10), color: C.grafite }}><span style={{ color: C.cinzaMarca, fontWeight: 500 }}>{t('proposal.project', lang)}:</span> {p.projeto}</p>}
          {p.local && <p style={{ margin: p.linkGoogleMaps ? '0 0 1mm 0' : 0, fontSize: fs(10), color: C.grafite }}><span style={{ color: C.cinzaMarca, fontWeight: 500 }}>{t('proposal.local', lang)}:</span> {p.local}</p>}
          {p.linkGoogleMaps && (
            <p style={{ margin: 0, fontSize: fs(9) }}>
              <a href={p.linkGoogleMaps} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: 'underline' }}>
                {t('proposal.viewOnGoogleMaps', lang)}
              </a>
            </p>
          )}
        </div>

        {/* RESUMO EXECUTIVO — Decisão em 60 segundos */}
        {p.mostrarResumo && p.resumoExecutivo && (
          <div className="pdf-no-break" style={{ marginBottom: '5mm', padding: '4mm 5mm', background: C.accentSoft, borderRadius: 3, border: `2px solid ${C.accent}`, pageBreakInside: 'avoid' }}>
            <p style={{ fontSize: fs(10), fontWeight: 700, margin: '0 0 3mm 0', color: C.accent, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {t('proposal.executiveSummary', lang)}
            </p>
            
            {/* Grid de 2 colunas para incluído/não incluído */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '3mm' }}>
              <tbody>
                <tr>
                  <td style={{ width: '50%', verticalAlign: 'top', paddingRight: '3mm' }}>
                    <p style={{ fontSize: fs(8), fontWeight: 700, color: '#16a34a', margin: '0 0 1.5mm 0', display: 'flex', alignItems: 'center', gap: '1mm' }}>
                      <span style={{ width: '1.5mm', height: '1.5mm', background: '#16a34a', borderRadius: '50%', display: 'inline-block' }} />
                      {t('proposal.included', lang)}
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '3mm', fontSize: fs(8), color: C.grafite, lineHeight: 1.5, listStyleType: 'none' }}>
                      {(p.resumoExecutivo.incluido ?? []).map((item, i) => (
                        <li key={i} style={{ marginBottom: '0.5mm', paddingLeft: '1.5mm', borderLeft: `1px solid #16a34a` }}>{item}</li>
                      ))}
                    </ul>
                  </td>
                  <td style={{ width: '50%', verticalAlign: 'top', paddingLeft: '3mm', borderLeft: `1px solid ${C.accent}` }}>
                    <p style={{ fontSize: fs(8), fontWeight: 700, color: C.cinzaMarca, margin: '0 0 1.5mm 0', display: 'flex', alignItems: 'center', gap: '1mm' }}>
                      <span style={{ width: '1.5mm', height: '1.5mm', background: C.cinzaMarca, borderRadius: '50%', display: 'inline-block' }} />
                      {t('proposal.notIncluded', lang)}
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '3mm', fontSize: fs(8), color: C.cinzaMarca, lineHeight: 1.5, listStyleType: 'none' }}>
                      {(p.resumoExecutivo.naoIncluido ?? []).map((item, i) => (
                        <li key={i} style={{ marginBottom: '0.5mm', paddingLeft: '1.5mm', borderLeft: `1px solid ${C.cinzaLinha}` }}>{item}</li>
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

        {/* Tabela de valores */}
        <div style={{ marginBottom: '5mm' }}>
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
              
              {/* ═══ SECÇÃO: ARQUITETURA ═══ */}
              <tr style={{ background: C.accent, color: C.onAccent }}>
                <td colSpan={2} style={{ padding: '2.5mm 3mm', fontWeight: 600, fontSize: fs(9), textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {lang === 'en' ? 'Architecture' : 'Arquitetura'}
                </td>
              </tr>
              <tr style={{ background: C.offWhite, borderBottom: `1px solid ${C.cinzaLinha}`, fontWeight: 600 }}>
                <td style={{ padding: '3mm', color: C.grafite }}>{t('proposal.archFees', lang)}</td>
                <td style={{ textAlign: 'right', padding: '3mm' }}>
                  <span style={{ fontWeight: 600 }}>{formatCurrency(p.valorArq, lang)}</span>
                  <span style={{ fontSize: fs(8), color: C.cinzaMarca, fontWeight: 400, marginLeft: '2mm' }}>
                    ({formatCurrency(p.valorArq * 1.23, lang)} c/IVA)
                  </span>
                </td>
              </tr>
              
              {/* ═══ SECÇÃO: ESPECIALIDADES (só se existirem) ═══ */}
              {p.especialidades.length > 0 && (
                <>
                  <tr style={{ background: C.accent, color: C.onAccent }}>
                    <td colSpan={2} style={{ padding: '2.5mm 3mm', fontWeight: 600, fontSize: fs(9), textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {lang === 'en' ? 'Specialties' : 'Especialidades'}
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
                        ? '* Specialty values are estimates subject to adjustment after detailed survey by the respective designers.'
                        : '* Os valores das especialidades são estimativas sujeitas a retificação após levantamento detalhado pelos respetivos projetistas.'}
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
        <div style={{ marginTop: '4mm', paddingTop: '3mm' }}>
          <p style={{ fontSize: fs(9), fontWeight: 600, color: C.cinzaMarca, margin: '0 0 2mm 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('proposal.section2', lang)}</p>
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

        {/* Descrição das fases */}
        <div style={{ marginTop: '5mm', paddingTop: '3mm' }}>
          <p style={{ fontSize: fs(10), fontWeight: 600, color: C.cinzaMarca, margin: '0 0 5mm 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('proposal.section3', lang)}</p>
          {p.notaBim && (
            <div style={{ padding: '2.5mm 3mm', background: C.accentSoft2, borderRadius: 2, marginBottom: '3mm', borderLeft: `3px solid ${C.accent}` }}>
              <p style={{ fontSize: fs(9), fontWeight: 600, margin: 0, color: C.accent }}>{t('proposal.bimMethodology', lang)}</p>
              <p style={{ fontSize: fs(8), color: C.cinzaMarca, margin: '1mm 0 0 0', lineHeight: 1.45 }}>{p.notaBim}</p>
            </div>
          )}
          {p.notaReunioes && (
            <div style={{ padding: '2.5mm 3mm', background: C.offWhite, borderRadius: 2, marginBottom: '3mm', borderLeft: `3px solid ${C.cinzaLinha}` }}>
              <p style={{ fontSize: fs(9), fontWeight: 600, margin: 0, color: C.cinzaMarca }}>{t('proposal.reunioesContexto', lang)}</p>
              <p style={{ fontSize: fs(8), color: C.cinzaMarca, margin: '1mm 0 0 0', lineHeight: 1.45 }}>{p.notaReunioes}</p>
            </div>
          )}
          <div style={{ padding: '3mm 0', borderBottom: `1px solid ${C.cinzaLinha}` }}>
            <p style={{ fontSize: fs(9), fontWeight: 600, margin: '0 0 3mm 0', color: C.accent }}>{t('proposal.architectureProject', lang)}</p>
            {p.descricaoFases.map((f) => (
              <div key={f.nome} style={{ marginBottom: '3mm', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                <p style={{ fontSize: fs(9), fontWeight: 600, margin: '0 0 1mm 0', color: C.grafite }}>• {f.nome} ({f.pct}%)</p>
                {f.descricao && <p style={{ fontSize: fs(8), color: C.cinzaMarca, margin: 0, lineHeight: 1.4 }}>{f.descricao}</p>}
              </div>
            ))}
          </div>
          {p.especialidadesDescricoes.length > 0 && (
            <div style={{ padding: '3mm 0', borderBottom: `1px solid ${C.cinzaLinha}` }}>
              <p style={{ fontSize: fs(9), fontWeight: 600, margin: '0 0 3mm 0', color: C.accent }}>{t('proposal.specialtiesProject', lang)}</p>
              {p.especialidadesDescricoes.map((e) => (
                <div key={e.nome} style={{ marginBottom: '3mm', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  <p style={{ fontSize: fs(9), fontWeight: 600, margin: '0 0 1mm 0', color: C.grafite }}>• {e.nome}</p>
                  {e.descricao && <p style={{ fontSize: fs(8), color: C.cinzaMarca, margin: 0, lineHeight: 1.4 }}>{e.descricao}</p>}
                </div>
              ))}
            </div>
          )}
          {(p.extrasComDescricao ?? []).length > 0 && !p.mostrarPacotes && (
            <div style={{ padding: '3mm 4mm', background: C.offWhite, borderRadius: 2, marginTop: '4mm' }}>
              <p style={{ fontSize: fs(10), fontWeight: 600, margin: '0 0 3mm 0', color: C.accent }}>{t('proposal.extrasInfo', lang)}</p>
              {(p.extrasComDescricao ?? []).map((e) => {
                const id = (e as { id?: string }).id;
                const isFormulaExtra = id === 'projeto_execucao_base' || id === 'projeto_execucao_completa' || id === 'orcamentacao';
                return (
                  <div
                    key={e.nome}
                    className="pdf-no-break"
                    style={{
                      marginBottom: '5mm',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      pageBreakInside: 'avoid',
                      ...(isFormulaExtra
                        ? { borderLeft: `3px solid ${C.accent}`, background: C.accentSoft, padding: '3mm 4mm', borderRadius: '0 2px 2px 0' }
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
              <p style={{ fontSize: fs(9), color: C.cinzaMarca, margin: 0, fontStyle: 'italic', lineHeight: 1.45 }}>{t('proposal.extrasNote', lang)}</p>
            </div>
          )}

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

        {/* Estimativa de execução */}
        {(p.duracaoEstimada ?? []).length > 0 && (
          <div style={{ marginTop: '4mm', paddingTop: '3mm' }}>
            <p style={{ fontSize: fs(9), fontWeight: 600, color: C.cinzaMarca, margin: '0 0 2mm 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('proposal.section4', lang)}</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: fs(10), marginBottom: '2mm' }}>
              <thead>
                <tr style={{ background: C.offWhite }}>
                  <th style={{ padding: '2mm 3mm', textAlign: 'left', fontWeight: 600, fontSize: fs(9), color: C.cinzaMarca, borderBottom: `1px solid ${C.cinzaLinha}` }}>{t('proposal.phase', lang)}</th>
                  <th style={{ padding: '2mm 3mm', textAlign: 'right', fontWeight: 600, fontSize: fs(9), color: C.cinzaMarca, borderBottom: `1px solid ${C.cinzaLinha}` }}>{t('proposal.estimatedDuration', lang)}</th>
                </tr>
              </thead>
              <tbody>
                {(p.duracaoEstimada ?? []).map((d) => (
                  <tr key={d.nome} style={{ borderBottom: `1px solid ${C.cinzaLinha}`, color: C.grafite }}>
                    <td style={{ padding: '2mm 3mm', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{d.nome}</td>
                    <td style={{ textAlign: 'right', padding: '2mm 3mm' }}>{d.duracao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: fs(9), color: C.cinzaMarca, fontStyle: 'italic', margin: 0 }}>{t('proposal.durationNote', lang)}</p>
          </div>
        )}

        {/* CENÁRIOS DE PRAZO — Expectativa realista */}
        {p.mostrarCenarios && p.cenariosPrazo && (
          <div className="pdf-no-break" style={{ marginTop: '4mm', padding: '3mm 4mm', background: C.offWhite, borderRadius: 2, borderLeft: `3px solid ${C.accent}`, pageBreakInside: 'avoid' }}>
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

        {/* Exclusões - agrupadas por categoria */}
        {p.exclusoes.length > 0 && (() => {
          // Identificar exclusões de especialidades (começam com padrões específicos)
          const espPatterns = ['Ensaios', 'Equipamentos', 'Central', 'Certificação', 'Cablagem', 'Etiquetagem', 'Projeto de manutenção', 'Reforços', 'Demolições', 'Monitorização', 'ETAR', 'Bombas', 'rega', 'Quadros', 'Grupos', 'Instalação fotovoltaica', 'antena'];
          const isEspExclusao = (label: string) => espPatterns.some(p => label.includes(p));
          
          const arqExclusoes = p.exclusoes.filter(e => !isEspExclusao(e));
          const espExclusoes = p.exclusoes.filter(e => isEspExclusao(e));
          
          return (
            <div style={{ marginTop: '4mm', paddingTop: '3mm' }}>
              <p style={{ fontSize: fs(9), fontWeight: 600, color: C.cinzaMarca, margin: '0 0 2mm 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('proposal.section5', lang)}</p>
              
              <div style={{ display: 'flex', gap: '3mm' }}>
                {/* Coluna Arquitetura */}
                <div style={{ flex: 1, padding: '2mm', background: C.offWhite, borderRadius: 2 }}>
                  <p style={{ fontSize: fs(8), fontWeight: 600, color: C.accent, margin: '0 0 1.5mm 0' }}>
                    {lang === 'en' ? 'Architecture' : 'Arquitetura'}
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

        {/* Notas */}
        <div style={{ marginTop: '4mm', paddingTop: '3mm', fontSize: fs(8), color: C.cinzaMarca }}>
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

        {/* Assinaturas */}
        {(branding.architectName || p.cliente) && (
          <div className="pdf-no-break" style={{ marginTop: '5mm', paddingTop: '4mm', borderTop: `1px solid ${C.cinzaLinha}`, pageBreakInside: 'avoid' }}>
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
        
        {/* Espaço para rodapé do PDF */}
        <div style={{ height: '8mm' }} />
      </div>

    </div>
  );
}
