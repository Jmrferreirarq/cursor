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
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Cabeçalho — margens A4 25mm (ISO) */}
      <div style={{ background: C.accent, color: C.onAccent, padding: '10mm 25mm 8mm', boxSizing: 'border-box' }}>
        <p style={{ fontSize: fs(18), fontWeight: 700, margin: 0, letterSpacing: '0.02em' }}>{branding.appName}</p>
        {branding.appSlogan && (
          <p style={{ fontSize: fs(10), color: C.onAccentMuted, margin: '1.5mm 0 0 0' }}>{branding.appSlogan}</p>
        )}
      </div>

      <div style={{ padding: '25mm 25mm 25mm', backgroundColor: C.white, boxSizing: 'border-box', wordBreak: 'break-word', overflowWrap: 'break-word', minWidth: 0 }}>
        <div style={{ marginTop: 0, marginBottom: '6mm' }}>
          <h1 style={{ fontSize: fs(15), fontWeight: 700, margin: 0, letterSpacing: '-0.01em', color: C.accent }}>
            {t('proposal.title', lang)}
          </h1>
          <p style={{ fontSize: fs(10), color: C.cinzaMarca, margin: '2mm 0 0 0' }}>
            {t('proposal.ref', lang)} {p.ref} · {p.data}
          </p>
        </div>

        {/* Apresentação */}
        <div style={{ marginBottom: '6mm', padding: '4mm 5mm', background: C.offWhite, borderRadius: 2, borderLeft: `3px solid ${C.accent}` }}>
          <p style={{ fontSize: fs(10), fontWeight: 600, margin: '0 0 3mm 0', color: C.accent, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('proposal.presentation', lang)}</p>
          {(p.apresentacao ?? t('longText.apresentacao', lang)).split('\n\n').map((par, i) => (
            <p key={i} style={{ fontSize: fs(10), color: C.cinzaMarca, margin: '0 0 2.5mm 0', lineHeight: 1.55 }}>{par}</p>
          ))}
        </div>

        {/* Dados do projeto */}
        <div style={{ background: C.offWhite, borderRadius: 2, padding: '4mm 5mm', marginBottom: '6mm' }}>
          {p.cliente && <p style={{ margin: '0 0 1.5mm 0', fontSize: fs(12), color: C.grafite }}><span style={{ color: C.cinzaMarca, fontWeight: 500 }}>{t('proposal.client', lang)}:</span> {p.cliente}</p>}
          {p.projeto && <p style={{ margin: '0 0 1.5mm 0', fontSize: fs(12), color: C.grafite }}><span style={{ color: C.cinzaMarca, fontWeight: 500 }}>{t('proposal.project', lang)}:</span> {p.projeto}</p>}
          {p.local && <p style={{ margin: p.linkGoogleMaps ? '0 0 1.5mm 0' : 0, fontSize: fs(12), color: C.grafite }}><span style={{ color: C.cinzaMarca, fontWeight: 500 }}>{t('proposal.local', lang)}:</span> {p.local}</p>}
          {p.linkGoogleMaps && (
            <p style={{ margin: 0, fontSize: fs(12) }}>
              <a href={p.linkGoogleMaps} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: 'underline' }}>
                {t('proposal.viewOnGoogleMaps', lang)}
              </a>
            </p>
          )}
        </div>

        {/* Tabela de valores */}
        <div style={{ marginBottom: '6mm' }}>
          <p style={{ fontSize: fs(10), fontWeight: 600, color: C.cinzaMarca, margin: '0 0 2mm 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('proposal.section1', lang)}</p>
          <table className="pdf-no-break" style={{ width: '100%', borderCollapse: 'collapse', fontSize: fs(9), pageBreakInside: 'avoid', tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '55%' }} />
              <col style={{ width: '45%' }} />
            </colgroup>
            <thead>
              <tr style={{ background: C.offWhite }}>
                <th style={{ padding: '2.5mm 3mm', textAlign: 'left', fontWeight: 600, fontSize: fs(9), color: C.cinzaMarca, borderBottom: `1px solid ${C.cinzaLinha}`, wordBreak: 'break-word', overflowWrap: 'break-word' }}>{t('proposal.concept', lang)}</th>
                <th style={{ padding: '2.5mm 3mm', textAlign: 'right', fontWeight: 600, fontSize: fs(9), color: C.cinzaMarca, borderBottom: `1px solid ${C.cinzaLinha}`, wordBreak: 'break-word' }}>{t('proposal.value', lang)}</th>
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
              <tr style={{ background: C.offWhite, borderBottom: `1px solid ${C.cinzaLinha}`, fontWeight: 600 }}>
                <td style={{ padding: '3mm', color: C.accent }}>{t('proposal.archFees', lang)}</td>
                <td style={{ textAlign: 'right', padding: '3mm', fontWeight: 600 }}>{formatCurrency(p.valorArq, lang)}</td>
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
                  <td style={{ textAlign: 'right', padding: '3mm' }}>{formatCurrency(p.valorEsp, lang)}</td>
                </tr>
              )}
              {p.totalSemIVA != null && p.valorIVA != null ? (
                <>
                  <tr style={{ borderBottom: `1px solid ${C.cinzaLinha}`, fontWeight: 600, color: C.grafite }}>
                    <td style={{ padding: '3mm' }}>{t('proposal.totalExclVat', lang)}</td>
                    <td style={{ textAlign: 'right', padding: '3mm' }}>{formatCurrency(p.totalSemIVA, lang)}</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${C.cinzaLinha}`, color: C.grafite }}>
                    <td style={{ padding: '3mm' }}>{t('proposal.vat', lang)} (23%)</td>
                    <td style={{ textAlign: 'right', padding: '3mm' }}>{formatCurrency(p.valorIVA, lang)}</td>
                  </tr>
                  <tr style={{ background: C.accent, color: C.onAccent, fontWeight: 700, fontSize: fs(12) }}>
                    <td style={{ padding: '4mm 3mm' }}>{t('proposal.totalInclVat', lang)}</td>
                    <td style={{ textAlign: 'right', padding: '4mm 3mm' }}>{formatCurrency(p.total, lang)}</td>
                  </tr>
                </>
              ) : (
                <tr style={{ background: C.accent, color: C.onAccent, fontWeight: 700, fontSize: fs(12) }}>
                  <td style={{ padding: '4mm 3mm' }}>{t('proposal.total', lang)}</td>
                  <td style={{ textAlign: 'right', padding: '4mm 3mm' }}>{formatCurrency(p.total, lang)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Fases de pagamento */}
        <div style={{ marginTop: '6mm', paddingTop: '6mm' }}>
          <p style={{ fontSize: fs(10), fontWeight: 600, color: C.cinzaMarca, margin: '0 0 2mm 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('proposal.section2', lang)}</p>
          <table className="pdf-no-break" style={{ width: '100%', borderCollapse: 'collapse', fontSize: fs(10), marginBottom: '2mm', pageBreakInside: 'avoid' }}>
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

        {/* Descrição das fases — inicia em nova página; margem superior A4 via html2pdf */}
        <div style={{ marginTop: 0, paddingTop: '3mm', pageBreakBefore: 'always' }}>
          <p style={{ fontSize: fs(10), fontWeight: 600, color: C.cinzaMarca, margin: '0 0 5mm 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('proposal.section3', lang)}</p>
          {p.notaBim && (
            <div className="pdf-no-break" style={{ padding: '3mm 4mm', background: C.accentSoft2, borderRadius: 2, marginBottom: '4mm', borderLeft: `3px solid ${C.accent}`, pageBreakInside: 'avoid' }}>
              <p style={{ fontSize: fs(10), fontWeight: 600, margin: 0, color: C.accent }}>{t('proposal.bimMethodology', lang)}</p>
              <p style={{ fontSize: fs(9), color: C.cinzaMarca, margin: '1.5mm 0 0 0', lineHeight: 1.5 }}>{p.notaBim}</p>
            </div>
          )}
          {p.notaReunioes && (
            <div className="pdf-no-break" style={{ padding: '3mm 4mm', background: C.offWhite, borderRadius: 2, marginBottom: '4mm', borderLeft: `3px solid ${C.cinzaLinha}`, pageBreakInside: 'avoid' }}>
              <p style={{ fontSize: fs(10), fontWeight: 600, margin: 0, color: C.cinzaMarca }}>{t('proposal.reunioesContexto', lang)}</p>
              <p style={{ fontSize: fs(9), color: C.cinzaMarca, margin: '1.5mm 0 0 0', lineHeight: 1.5 }}>{p.notaReunioes}</p>
            </div>
          )}
          <div style={{ padding: '4mm 0', borderBottom: `1px solid ${C.cinzaLinha}` }}>
            <p style={{ fontSize: fs(10), fontWeight: 600, margin: '0 0 4mm 0', color: C.accent }}>{t('proposal.architectureProject', lang)}</p>
            {p.descricaoFases.map((f) => (
              <div key={f.nome} className="pdf-no-break" style={{ marginBottom: '5mm', wordBreak: 'break-word', overflowWrap: 'break-word', pageBreakInside: 'avoid' }}>
                <p style={{ fontSize: fs(10), fontWeight: 600, margin: '0 0 1.5mm 0', color: C.grafite }}>• {f.nome} ({f.pct}%)</p>
                {f.descricao && <p style={{ fontSize: fs(9), color: C.cinzaMarca, margin: 0, lineHeight: 1.5 }}>{f.descricao}</p>}
              </div>
            ))}
          </div>
          {p.especialidadesDescricoes.length > 0 && (
            <div style={{ padding: '5mm 0', borderBottom: `1px solid ${C.cinzaLinha}` }}>
              <p style={{ fontSize: fs(10), fontWeight: 600, margin: '0 0 4mm 0', color: C.accent }}>{t('proposal.specialtiesProject', lang)}</p>
              {p.especialidadesDescricoes.map((e) => (
                <div key={e.nome} className="pdf-no-break" style={{ marginBottom: '5mm', wordBreak: 'break-word', overflowWrap: 'break-word', pageBreakInside: 'avoid' }}>
                  <p style={{ fontSize: fs(10), fontWeight: 600, margin: '0 0 1.5mm 0', color: C.grafite }}>• {e.nome}</p>
                  {e.descricao && <p style={{ fontSize: fs(9), color: C.cinzaMarca, margin: 0, lineHeight: 1.5 }}>{e.descricao}</p>}
                </div>
              ))}
            </div>
          )}
          {(p.extrasComDescricao ?? []).length > 0 && (
            <div style={{ padding: '4mm 4mm 5mm', background: C.offWhite, borderRadius: 2, marginTop: '6mm' }}>
              <p style={{ fontSize: fs(10), fontWeight: 600, margin: '0 0 3mm 0', color: C.accent }}>{t('proposal.extrasInfo', lang)}</p>
              {(p.extrasComDescricao ?? []).map((e) => {
                const id = (e as { id?: string }).id;
                const isFormulaExtra = id === 'projeto_execucao_completo' || id === 'orcamentacao';
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
        </div>

        {/* Estimativa de execução */}
        {(p.duracaoEstimada ?? []).length > 0 && (
          <div style={{ marginTop: '6mm', paddingTop: '6mm' }}>
            <p style={{ fontSize: fs(10), fontWeight: 600, color: C.cinzaMarca, margin: '0 0 2mm 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('proposal.section4', lang)}</p>
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

        {/* Exclusões */}
        {p.exclusoes.length > 0 && (
          <div style={{ marginTop: '6mm', paddingTop: '6mm' }}>
            <p style={{ fontSize: fs(10), fontWeight: 600, color: C.cinzaMarca, margin: '0 0 2mm 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('proposal.section5', lang)}</p>
            <ul style={{ margin: 0, paddingLeft: '5mm', fontSize: fs(10), color: C.cinzaMarca, lineHeight: 1.6, listStyleType: 'disc' }}>
              {p.exclusoes.map((label) => (
                <li key={label} style={{ pageBreakInside: 'avoid' }}>{label}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Notas */}
        <div style={{ marginTop: '6mm', paddingTop: '6mm', fontSize: fs(10), color: C.cinzaMarca }}>
          <p style={{ fontSize: fs(10), fontWeight: 600, color: C.cinzaMarca, margin: '0 0 2mm 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('proposal.section6', lang)}</p>
          <ul style={{ margin: 0, paddingLeft: '5mm', lineHeight: 1.6, listStyleType: 'disc', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
            {p.notas.map((n) => (
              <li key={n} style={{ pageBreakInside: 'avoid', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{n}</li>
            ))}
          </ul>
        </div>

        {/* Assinaturas */}
        {(branding.architectName || p.cliente) && (
          <div className="pdf-no-break" style={{ marginTop: '6mm', paddingTop: '6mm', display: 'flex', justifyContent: 'space-between', gap: '12mm', fontSize: fs(10), borderTop: `1px solid ${C.cinzaLinha}`, pageBreakInside: 'avoid' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, margin: '0 0 1mm 0', color: C.accent, fontSize: fs(10) }}>{t('proposal.responsible', lang)}</p>
              {branding.architectName && (
                <p style={{ margin: 0, color: C.cinzaMarca }}>
                  {branding.architectName}{branding.architectOasrn ? ` — n.º ${branding.architectOasrn} OASRN` : ''}
                </p>
              )}
              <div style={{ marginTop: '5mm', borderBottom: `1.5px solid ${C.accent}`, width: '45mm', height: '6mm' }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, margin: '0 0 1mm 0', color: C.accent, fontSize: fs(10) }}>{t('proposal.client', lang)}</p>
              {p.cliente && <p style={{ margin: 0, color: C.cinzaMarca }}>{p.cliente}</p>}
              <div style={{ marginTop: '5mm', borderBottom: `1.5px solid ${C.accent}`, width: '45mm', height: '6mm' }} />
            </div>
          </div>
        )}

        <p style={{ fontSize: fs(9), color: C.cinzaMarca, margin: '5mm 0 0 0', fontStyle: 'italic' }}>
          {t('proposal.disclaimer', lang)}
        </p>
      </div>
    </div>
  );
}
