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
import { municipios, EQUIPAMENTOS_DEFAULTS } from '../../data/municipios';
import type { ParametrosUrbanisticos } from '../../data/municipios';

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
      data-pdf-ref={p.ref || ''}
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
        <div className="pdf-no-break" style={{ marginTop: 0, marginBottom: '4mm', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
          <h1 style={{ fontSize: fs(14), fontWeight: 700, margin: 0, letterSpacing: '-0.01em', color: C.accent }}>
            {t('proposal.title', lang)}
          </h1>
          <p style={{ fontSize: fs(9), color: C.cinzaMarca, margin: '1.5mm 0 0 0' }}>
            {t('proposal.ref', lang)} {p.ref} · {p.data}
          </p>
        </div>

        {/* Apresentação */}
        <div className="pdf-no-break" style={{ marginBottom: '4mm', padding: '3mm 4mm', background: C.offWhite, borderRadius: 2, borderLeft: `3px solid ${C.accent}`, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
          <p style={{ fontSize: fs(9), fontWeight: 600, margin: '0 0 2mm 0', color: C.accent, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('proposal.presentation', lang)}</p>
          {(p.apresentacao ?? t('longText.apresentacao', lang)).split('\n\n').map((par, i) => (
            <p key={i} style={{ fontSize: fs(8), color: C.cinzaMarca, margin: '0 0 2mm 0', lineHeight: 1.5 }}>{par}</p>
          ))}
        </div>

        {/* Dados do projeto */}
        <div className="pdf-no-break" style={{ background: C.offWhite, borderRadius: 2, padding: '3mm 4mm', marginBottom: '4mm', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
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

        {/* SECCAO LOTEAMENTO - Terreno + Contexto + Cenarios + Condicionantes + Entregaveis + Assuncoes + Dependencias */}
        {p.isLoteamento && (
          <>
            {/* Dados do terreno + frente */}
            {(p.lotIdentificacao || p.lotAreaTerreno || p.lotAreaEstudo) && (
              <div className="pdf-no-break" style={{ background: '#fffbeb', borderRadius: 2, padding: '3mm 4mm', marginBottom: '4mm', border: '1px solid #fbbf24', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <p style={{ fontSize: fs(9), fontWeight: 700, margin: '0 0 2mm 0', color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Dados do Terreno</p>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: fs(9) }}>
                  <tbody>
                    {p.lotIdentificacao && <tr><td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500, width: '40%' }}>Identificacao predial</td><td style={{ padding: '1mm 2mm', color: C.grafite }}>{p.lotIdentificacao}</td></tr>}
                    {p.lotAreaTerreno && <tr><td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500 }}>Area total do predio</td><td style={{ padding: '1mm 2mm', color: C.grafite }}>{parseFloat(p.lotAreaTerreno).toLocaleString('pt-PT')} m2 {p.lotFonteArea ? `(${p.lotFonteArea})` : ''}</td></tr>}
                    {p.lotAreaEstudo && <tr><td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500 }}>Area em estudo</td><td style={{ padding: '1mm 2mm', color: C.grafite }}>{parseFloat(p.lotAreaEstudo).toLocaleString('pt-PT')} m2</td></tr>}
                    {p.lotFrenteTerreno && <tr><td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 600 }}>Frente do terreno</td><td style={{ padding: '1mm 2mm', color: '#92400e', fontWeight: 700 }}>{p.lotFrenteTerreno} m (driver principal)</td></tr>}
                    {p.lotNumLotes && <tr style={{ background: '#eff6ff' }}><td style={{ padding: '1.5mm 2mm', color: '#1e40af', fontWeight: 600 }}>N. lotes pretendidos</td><td style={{ padding: '1.5mm 2mm', color: '#1e40af', fontWeight: 700 }}>{p.lotNumLotes} lotes <span style={{ fontSize: fs(7), fontWeight: 500, color: '#1e40af', marginLeft: '2mm', padding: '0.3mm 1.5mm', background: '#dbeafe', borderRadius: 2 }}>solucao recomendada</span></td></tr>}
                    {/* Metricas calculadas para o N. lotes pretendidos */}
                    {p.lotNumLotes && p.lotFrenteTerreno && p.lotAreaEstudo && (() => {
                      const nLotes = parseInt(p.lotNumLotes, 10);
                      const frente = parseFloat(p.lotFrenteTerreno);
                      const areaEstudo = parseFloat(p.lotAreaEstudo);
                      const pctCed = parseFloat(p.lotParametros?.percentagemCedencias || '15');
                      const io = parseFloat(p.lotParametros?.indiceImplantacao || '0');
                      const iu = parseFloat(p.lotParametros?.indiceConstrucao || '0');
                      if (nLotes <= 0 || frente <= 0 || areaEstudo <= 0) return null;
                      const largura = Math.round((frente / nLotes) * 10) / 10;
                      const cedencias = Math.round(areaEstudo * pctCed / 100);
                      const areaMedia = Math.round((areaEstudo - cedencias) / nLotes);
                      const implantacao = io > 0 ? Math.round(areaMedia * io) : null;
                      const abc = iu > 0 ? Math.round(areaMedia * iu) : null;
                      const tdL = { padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500 } as const;
                      const tdV = { padding: '1mm 2mm', color: C.grafite } as const;
                      return (
                        <>
                          <tr><td style={tdL}>Largura estimada/lote</td><td style={{ ...tdV, fontWeight: 600 }}>{largura} m</td></tr>
                          <tr><td style={tdL}>Area media/lote</td><td style={{ ...tdV, fontWeight: 600 }}>{areaMedia.toLocaleString('pt-PT')} m2</td></tr>
                          {implantacao !== null && <tr><td style={tdL}>Implantacao</td><td style={{ ...tdV, fontWeight: 600 }}>{implantacao.toLocaleString('pt-PT')} m2 <span style={{ fontSize: fs(7), fontWeight: 400, color: C.cinzaMarca }}>(IO {Math.round(io * 100)}%)</span></td></tr>}
                          {abc !== null && <tr><td style={tdL}>ABC estimada</td><td style={{ ...tdV, fontWeight: 700, color: '#059669' }}>{abc.toLocaleString('pt-PT')} m2 <span style={{ fontSize: fs(7), fontWeight: 400, color: C.cinzaMarca }}>(IU {iu})</span></td></tr>}
                        </>
                      );
                    })()}
                    {p.lotTipoHabitacao && (() => {
                      // Verificar se a preferência é viável em algum cenário
                      const tiposReais = (p.lotCenarios || []).map((c: any) => c.tipoHabitacaoLabel).filter(Boolean);
                      const prefLabel = p.lotTipoHabitacao;
                      const prefViavel = tiposReais.length === 0 || tiposReais.some((t: string) => t === prefLabel);
                      const todosIguais = tiposReais.length > 0 && tiposReais.every((t: string) => t === tiposReais[0]);
                      return (
                        <tr><td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500 }}>Tipo de habitacao</td><td style={{ padding: '1mm 2mm', color: C.grafite }}>
                          {prefLabel} <span style={{ fontSize: fs(7), color: C.cinzaMarca, fontWeight: 400 }}>(preferencia)</span>
                          {!prefViavel && tiposReais.length > 0 && (
                            <span style={{ display: 'block', fontSize: fs(6.5), color: '#dc2626', fontWeight: 500, marginTop: '0.5mm' }}>
                              Nota: a largura de lote disponivel nao permite {prefLabel.toLowerCase()} nos cenarios apresentados.
                              {todosIguais ? ` Tipologia real: ${tiposReais[0]}.` : ` Tipologia varia por cenario.`}
                            </span>
                          )}
                          {prefViavel && !todosIguais && tiposReais.length > 1 && (
                            <span style={{ display: 'block', fontSize: fs(6.5), color: '#92400e', fontWeight: 400, marginTop: '0.5mm' }}>
                              Tipologia final determinada por cenario, conforme largura de lote disponivel.
                            </span>
                          )}
                        </td></tr>
                      );
                    })()}
                    {p.lotObjetivo && <tr><td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500 }}>Objetivo principal</td><td style={{ padding: '1mm 2mm', color: C.grafite }}>{p.lotObjetivo}</td></tr>}
                  </tbody>
                </table>
              </div>
            )}

            {/* Contexto urbanistico */}
            {(p.lotInstrumento || p.lotClassificacaoSolo || p.lotParametros) && (
              <div className="pdf-no-break" style={{ background: '#eff6ff', borderRadius: 2, padding: '3mm 4mm', marginBottom: '4mm', border: '1px solid #bfdbfe', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <p style={{ fontSize: fs(9), fontWeight: 700, margin: '0 0 2mm 0', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Contexto Urbanistico</p>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: fs(8) }}>
                  <tbody>
                    {p.lotInstrumento && <tr><td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500, width: '40%' }}>Instrumento</td><td style={{ padding: '1mm 2mm', color: C.grafite }}>{p.lotInstrumento}</td></tr>}
                    {p.lotClassificacaoSolo && <tr><td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500 }}>Classificacao do solo</td><td style={{ padding: '1mm 2mm', color: C.grafite }}>{p.lotClassificacaoSolo}</td></tr>}
                    {p.lotMunicipio && <tr><td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500 }}>Municipio</td><td style={{ padding: '1mm 2mm', color: C.grafite }}>{p.lotMunicipio}</td></tr>}
                    {p.lotUsoParametros && <tr><td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500 }}>Uso (parametros)</td><td style={{ padding: '1mm 2mm', color: p.lotUsoParametros === 'equipamentos' ? '#92400e' : C.grafite, fontWeight: p.lotUsoParametros === 'equipamentos' ? 600 : 400 }}>{p.lotUsoParametros === 'equipamentos' ? 'Equipamentos' : 'Habitacao'}</td></tr>}
                    {p.lotProfundidade && <tr><td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500 }}>Profundidade estimada</td><td style={{ padding: '1mm 2mm', color: C.grafite }}>{p.lotProfundidade} m</td></tr>}
                    {p.lotParametros?.alturaMaxima && <tr><td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500 }}>Altura maxima</td><td style={{ padding: '1mm 2mm', color: C.grafite }}>{p.lotParametros.alturaMaxima}</td></tr>}
                    {(p.lotParametros?.afastamentoFrontal || p.lotParametros?.afastamentoLateral || p.lotParametros?.afastamentoPosterior) && (
                      <tr><td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500 }}>Afastamentos</td><td style={{ padding: '1mm 2mm', color: C.grafite }}>
                        {[p.lotParametros?.afastamentoFrontal && `Frontal: ${p.lotParametros.afastamentoFrontal}`, p.lotParametros?.afastamentoLateral && `Lat.: ${p.lotParametros.afastamentoLateral}m`, p.lotParametros?.afastamentoPosterior && `Post.: ${p.lotParametros.afastamentoPosterior}m`].filter(Boolean).join(' | ')}
                      </td></tr>
                    )}
                    {p.lotParametros?.areaMinimaLote && <tr><td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500 }}>Area minima de lote</td><td style={{ padding: '1mm 2mm', color: C.grafite }}>{p.lotParametros.areaMinimaLote} m2</td></tr>}
                    {p.lotParametros?.indiceConstrucao && <tr><td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500 }}>Indice de utilizacao (IU)</td><td style={{ padding: '1mm 2mm', color: C.grafite }}>{p.lotParametros.indiceConstrucao}</td></tr>}
                    {p.lotParametros?.indiceImplantacao && <tr><td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500 }}>Indice de ocupacao do solo (IO)</td><td style={{ padding: '1mm 2mm', color: C.grafite }}>{p.lotParametros.indiceImplantacao}</td></tr>}
                    {p.lotParametros?.profundidadeMaxConstrucao && <tr><td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500 }}>Prof. max. construcao <span style={{ fontSize: fs(6), fontWeight: 400, color: C.cinzaMarca }}>(estimado)</span></td><td style={{ padding: '1mm 2mm', color: C.grafite }}>{p.lotParametros.profundidadeMaxConstrucao} m</td></tr>}
                    {p.lotParametros?.percentagemCedencias && <tr><td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500 }}>Cedencias (%)</td><td style={{ padding: '1mm 2mm', color: C.grafite }}>{p.lotParametros.percentagemCedencias}%</td></tr>}
                  </tbody>
                </table>
              </div>
            )}

            {/* Equipamentos (cave, piscina, exteriores) */}
            {(p.lotBasement || p.lotPool || p.lotExternalWorks) && (
              <div className="pdf-no-break" style={{ background: '#f5f3ff', borderRadius: 2, padding: '3mm 4mm', marginBottom: '4mm', border: '1px solid #c4b5fd', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <p style={{ fontSize: fs(9), fontWeight: 700, margin: '0 0 2mm 0', color: '#5b21b6', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Equipamentos e Caves</p>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: fs(8) }}>
                  <tbody>
                    {p.lotBasement && (
                      <tr><td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500, width: '40%' }}>Cave</td><td style={{ padding: '1mm 2mm', color: C.grafite }}>{p.lotBasement}{p.lotBasementArea ? ` (${p.lotBasementArea} m2)` : ''}</td></tr>
                    )}
                    {p.lotPool && (
                      <>
                        <tr><td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500 }}>Piscina</td><td style={{ padding: '1mm 2mm', color: C.grafite }}>{p.lotPool}{p.lotPoolSize ? ` — ${p.lotPoolSize}` : ''}</td></tr>
                        <tr><td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500 }}>Moradias c/ piscina</td><td style={{ padding: '1mm 2mm', color: C.grafite }}>{p.lotPoolPerUnit ? `${p.lotPoolUnits ?? '—'} unidade(s)` : 'Piscina comum (1 un.)'}</td></tr>
                      </>
                    )}
                    {p.lotExternalWorks && (
                      <tr><td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500 }}>Arranjos exteriores</td><td style={{ padding: '1mm 2mm', color: C.grafite }}>{p.lotExternalWorks}</td></tr>
                    )}
                    {p.lotWaterproofing && (
                      <tr><td style={{ padding: '1mm 2mm', color: C.cinzaMarca, fontWeight: 500 }}>Impermeabilizacao</td><td style={{ padding: '1mm 2mm', color: C.grafite }}>{p.lotWaterproofing}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Cenarios A/B/C com access_model */}
            {p.lotCenarios && p.lotCenarios.length > 0 && (
              <div className="pdf-no-break" style={{ marginBottom: '4mm', padding: '3mm 4mm', background: C.offWhite, borderRadius: 2, borderLeft: '3px solid #f59e0b', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <p style={{ fontSize: fs(9), fontWeight: 700, margin: '0 0 2mm 0', color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Cenarios de Loteamento</p>
                <p style={{ fontSize: fs(8), color: C.cinzaMarca, margin: '0 0 2mm 0' }}>
                  Inclui {p.lotCenarios.length} opcoes de implantacao. Driver critico: acesso direto vs via interna.
                </p>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: fs(7.5) }}>
                  <thead>
                    <tr style={{ background: '#fef3c7' }}>
                      <th style={{ padding: '1.5mm 2mm', textAlign: 'left', color: '#92400e', fontWeight: 700 }}>Cenario</th>
                      <th style={{ padding: '1.5mm 2mm', textAlign: 'center', color: '#92400e', fontWeight: 700 }}>Lotes</th>
                      <th style={{ padding: '1.5mm 2mm', textAlign: 'center', color: '#92400e', fontWeight: 700 }}>Frente</th>
                      <th style={{ padding: '1.5mm 2mm', textAlign: 'left', color: '#92400e', fontWeight: 700 }}>Tipologia</th>
                      <th style={{ padding: '1.5mm 2mm', textAlign: 'center', color: '#92400e', fontWeight: 700 }}>Area lote</th>
                      <th style={{ padding: '1.5mm 2mm', textAlign: 'center', color: '#92400e', fontWeight: 700 }}>Implantacao</th>
                      <th style={{ padding: '1.5mm 2mm', textAlign: 'center', color: '#92400e', fontWeight: 700 }}>ABC est.</th>
                      <th style={{ padding: '1.5mm 2mm', textAlign: 'center', color: '#92400e', fontWeight: 700 }}>Cedencias</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.lotCenarios.map((c: any, i: number) => {
                      const isRecommended = p.lotCenarioRecomendado && c.label === p.lotCenarioRecomendado;
                      return (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.cinzaLinha}`, background: isRecommended ? '#eff6ff' : undefined }}>
                        <td style={{ padding: '1.5mm 2mm', fontWeight: 600 }}>
                          {c.label}{isRecommended ? <span style={{ fontSize: fs(6), color: '#1e40af', fontWeight: 700, marginLeft: '1mm' }}>REC.</span> : ''}
                        </td>
                        <td style={{ padding: '1.5mm 2mm', textAlign: 'center', fontWeight: 600 }}>{c.lotes}</td>
                        <td style={{ padding: '1.5mm 2mm', textAlign: 'center', fontSize: fs(7) }}>
                          {c.larguraEstimada || '—'}
                          {c.larguraUtil != null && <span style={{ display: 'block', fontSize: fs(5.5), color: '#6b7280', fontStyle: 'italic' }}>impl: {c.larguraUtil}m</span>}
                        </td>
                        <td style={{ padding: '1.5mm 2mm', fontSize: fs(7), fontWeight: 500 }}>
                          <span style={{ color: (c.tipoHabitacaoLabel && p.lotTipoHabitacao && c.tipoHabitacaoLabel !== p.lotTipoHabitacao) ? '#dc2626' : undefined }}>
                            {c.tipoHabitacaoLabel || '—'}
                          </span>
                          {c.tipoHabitacaoLabel && p.lotTipoHabitacao && c.tipoHabitacaoLabel !== p.lotTipoHabitacao && (
                            <span style={{ fontSize: fs(5.5), color: '#dc2626', fontWeight: 400 }}> ≠ pref.</span>
                          )}
                          <span style={{ display: 'block', fontSize: fs(6), color: C.cinzaMarca, fontWeight: 400 }}>{c.accessModelLabel || ''}{c.viaInternaComprimento ? ` (${c.viaInternaComprimento}m)` : ''}</span>
                        </td>
                        <td style={{ padding: '1.5mm 2mm', textAlign: 'center' }}>{c.areaMedia ? `${c.areaMedia} m2` : '—'}</td>
                        <td style={{ padding: '1.5mm 2mm', textAlign: 'center' }}>
                          {c.areaImplantacao ? (
                            <>
                              {c.areaImplantacao} m2
                              <span style={{ display: 'block', fontSize: fs(6), color: C.cinzaMarca }}>(IO {c.indiceImplantacao}%)</span>
                              {c.envelopeMax && <span style={{ display: 'block', fontSize: fs(5.5), color: '#6b7280', fontStyle: 'italic' }}>Env: {c.envelopeMax} m2</span>}
                            </>
                          ) : '—'}
                        </td>
                        <td style={{ padding: '1.5mm 2mm', textAlign: 'center', fontWeight: 600, color: '#059669' }}>
                          {c.abcEstimada ? (
                            <>
                              {c.abcEstimada} m2
                              <span style={{ display: 'block', fontSize: fs(6), color: C.cinzaMarca, fontWeight: 400 }}>({c.numPisos}p)</span>
                              {c.envelopeMax && <span style={{ display: 'block', fontSize: fs(5.5), color: '#6b7280', fontWeight: 400, fontStyle: 'italic' }}>Max: {c.envelopeMax * (c.numPisos || 2)} m2</span>}
                            </>
                          ) : '—'}
                        </td>
                        <td style={{ padding: '1.5mm 2mm', textAlign: 'center' }}>{c.cedencias ? `${c.cedencias} m2` : '—'}</td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
                {p.lotCenarios.some(c => c.nota) && (
                  <div style={{ marginTop: '2mm', fontSize: fs(7), color: C.cinzaMarca }}>
                    {p.lotCenarios.filter(c => c.nota).map((c, i) => (
                      <p key={i} style={{ margin: '0 0 0.5mm 0' }}><strong>Cenario {c.label}:</strong> {c.nota}</p>
                    ))}
                  </div>
                )}
                {/* Nota sobre envelope, implantação e ABC */}
                {p.lotCenarios.some((c: any) => c.envelopeMax) && (
                  <p style={{ marginTop: '2mm', fontSize: fs(6.5), color: '#6b7280', fontStyle: 'italic', margin: '2mm 0 0 0', lineHeight: 1.4 }}>
                    impl = largura util para implantacao (largura lote − afastamentos laterais). Env = envelope maximo construtivo (area util apos afastamentos regulamentares). Implantacao = min(IO × area lote, envelope). ABC = min(IU × area lote, envelope × pisos). Max = envelope × pisos (limite fisico absoluto).
                  </p>
                )}
                {/* P2: Nota sobre decisão de cenário */}
                {p.lotCenarioRecomendado && (
                  <p style={{ marginTop: '2mm', fontSize: fs(7), color: '#1e40af', fontStyle: 'italic', margin: '2mm 0 0 0' }}>
                    Cenario {p.lotCenarioRecomendado} recomendado para licenciamento. A decisao final e tomada apos o estudo de viabilidade, com validacao do cliente antes da submissao.
                  </p>
                )}
              </div>
            )}

            {/* Condicionantes identificadas */}
            {p.lotCondicionantes && p.lotCondicionantes.length > 0 && (
              <div className="pdf-no-break" style={{ marginBottom: '4mm', padding: '3mm 4mm', background: '#fff1f2', borderRadius: 2, border: '1px solid #fecdd3', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <p style={{ fontSize: fs(9), fontWeight: 700, margin: '0 0 2mm 0', color: '#9f1239', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Condicionantes Identificadas</p>
                <p style={{ fontSize: fs(8), color: C.cinzaMarca, margin: '0 0 1mm 0' }}>
                  Complexidade urbanistica: <strong style={{ textTransform: 'uppercase' }}>{p.lotComplexidadeSugerida ?? 'media'}</strong>
                </p>
                <ul style={{ margin: 0, padding: 0, fontSize: fs(8), listStyleType: 'none' }}>
                  {p.lotCondicionantes.map((c, i) => (
                    <li key={i} style={{ margin: '0 0 1mm 0', display: 'flex', alignItems: 'flex-start', gap: '1.5mm' }}>
                      <span style={{ color: '#dc2626', fontWeight: 700, fontSize: fs(8) }}>!</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Enquadramento Legal */}
            {p.lotLegislacao && p.lotLegislacao.length > 0 && (
              <div className="pdf-no-break" style={{ marginBottom: '4mm', padding: '3mm 4mm', background: '#eff6ff', borderRadius: 2, border: '1px solid #bfdbfe', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <p style={{ fontSize: fs(9), fontWeight: 700, margin: '0 0 2mm 0', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Enquadramento Legal e Regulamentar</p>
                <p style={{ fontSize: fs(7.5), color: C.cinzaMarca, margin: '0 0 2mm 0' }}>
                  Legislacao principal aplicavel ao licenciamento desta operacao de loteamento.
                </p>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: fs(7.5) }}>
                  <thead>
                    <tr style={{ background: '#dbeafe' }}>
                      <th style={{ padding: '1.5mm 2mm', textAlign: 'left', color: '#1e40af', fontWeight: 700 }}>Diploma</th>
                      <th style={{ padding: '1.5mm 2mm', textAlign: 'left', color: '#1e40af', fontWeight: 700 }}>Descricao</th>
                      <th style={{ padding: '1.5mm 2mm', textAlign: 'center', color: '#1e40af', fontWeight: 700, whiteSpace: 'nowrap' }}>Relevancia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.lotLegislacao.map((d: any, i: number) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.cinzaLinha}` }}>
                        <td style={{ padding: '1.5mm 2mm', fontWeight: 600, whiteSpace: 'nowrap', color: '#1e40af' }}>{d.sigla}</td>
                        <td style={{ padding: '1.5mm 2mm', color: C.grafite }}>
                          {d.titulo}
                          {d.nota && <span style={{ display: 'block', fontSize: fs(6.5), color: C.cinzaMarca, fontStyle: 'italic' }}>{d.nota}</span>}
                        </td>
                        <td style={{ padding: '1.5mm 2mm', textAlign: 'center' }}>
                          <span style={{
                            fontSize: fs(7.5),
                            fontWeight: 600,
                            padding: '1mm 2.5mm',
                            borderRadius: 2,
                            lineHeight: 1.2,
                            display: 'inline-block',
                            background: d.relevancia === 'obrigatorio' ? '#dc2626' : d.relevancia === 'frequente' ? '#f59e0b' : '#94a3b8',
                            color: '#fff',
                          }}>
                            {d.relevancia === 'obrigatorio' ? 'Obrigatório' : d.relevancia === 'frequente' ? 'Frequente' : 'Condicional'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Parâmetros mínimos do PDM */}
                {p.lotParametros && (
                  <div style={{ marginTop: '3mm', padding: '2mm 3mm', background: '#f0f9ff', borderRadius: 2, border: '1px solid #bae6fd' }}>
                    <p style={{ fontSize: fs(8), fontWeight: 700, margin: '0 0 1.5mm 0', color: '#0369a1' }}>
                      Parametros Urbanisticos (PDM)
                      {p.lotUsoParametros && (
                        <span style={{ fontSize: fs(7), fontWeight: 500, color: p.lotUsoParametros === 'equipamentos' ? '#92400e' : '#1e40af', marginLeft: '2mm' }}>
                          — {p.lotUsoParametros === 'equipamentos' ? 'Equipamentos' : 'Habitacao'}
                        </span>
                      )}
                    </p>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: fs(7.5) }}>
                      <tbody>
                        {[
                          p.lotParametros.alturaMaxima && ['Altura maxima', p.lotParametros.alturaMaxima],
                          p.lotParametros.areaMinimaLote && ['Area minima de lote', `${p.lotParametros.areaMinimaLote} m2`],
                          p.lotParametros.indiceConstrucao && ['Indice de utilizacao (IU)', p.lotParametros.indiceConstrucao],
                          p.lotParametros.indiceImplantacao && ['Indice de ocupacao do solo (IO)', p.lotParametros.indiceImplantacao],
                          p.lotParametros.profundidadeMaxConstrucao && ['Profundidade max. construcao (estimado)', `${p.lotParametros.profundidadeMaxConstrucao} m`],
                          (p.lotParametros.afastamentoFrontal || p.lotParametros.afastamentoLateral || p.lotParametros.afastamentoPosterior) && [
                            'Afastamentos',
                            [p.lotParametros.afastamentoFrontal && `Frontal: ${p.lotParametros.afastamentoFrontal}m`, p.lotParametros.afastamentoLateral && `Lateral: ${p.lotParametros.afastamentoLateral}m`, p.lotParametros.afastamentoPosterior && `Posterior: ${p.lotParametros.afastamentoPosterior}m`].filter(Boolean).join(' | '),
                          ],
                          p.lotParametros.percentagemCedencias && ['Cedencias', `${p.lotParametros.percentagemCedencias}%`],
                        ].filter(Boolean).map((row: any, i) => (
                          <tr key={i} style={{ borderBottom: `1px solid #e0f2fe` }}>
                            <td style={{ padding: '1mm 2mm', color: '#0369a1', fontWeight: 500, width: '40%' }}>{row[0]}</td>
                            <td style={{ padding: '1mm 2mm', color: C.grafite }}>{row[1]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <p style={{ fontSize: fs(6.5), color: C.cinzaMarca, margin: '2mm 0 0 0', fontStyle: 'italic' }}>
                  Nota: lista nao exaustiva. Aplicabilidade final sujeita a analise do PDM/PP em vigor e parecer das entidades competentes.
                </p>
              </div>
            )}

            {/* Entregaveis */}
            {p.lotEntregaveis && p.lotEntregaveis.length > 0 && (
              <div className="pdf-no-break" style={{ marginBottom: '4mm', padding: '3mm 4mm', background: '#f5f3ff', borderRadius: 2, border: '1px solid #ddd6fe', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <p style={{ fontSize: fs(9), fontWeight: 700, margin: '0 0 2mm 0', color: '#5b21b6', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Entregaveis Incluidos</p>
                <ul style={{ margin: 0, padding: 0, fontSize: fs(8), listStyleType: 'none', color: C.grafite, columns: 2 }}>
                  {p.lotEntregaveis.map((e, i) => (
                    <li key={i} style={{ margin: '0 0 1mm 0', display: 'flex', alignItems: 'flex-start', gap: '1.5mm', breakInside: 'avoid' }}>
                      <span style={{ color: '#7c3aed', fontWeight: 700, fontSize: fs(8) }}>V</span>
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Estimativa de Investimento em Infraestruturas (Fase 2) — P1: colunas A/B/C por cenário */}
            {p.lotCustosInfra && p.lotCustosInfra.length > 0 && (
              <div className="pdf-no-break" style={{ marginBottom: '4mm', padding: '3mm 4mm', background: '#f8fafc', borderRadius: 2, border: `1px solid ${C.cinzaLinha}`, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <p style={{ fontSize: fs(9), fontWeight: 700, margin: '0 0 2mm 0', color: C.grafite, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Estimativa de Investimento em Infraestruturas
                </p>
                <p style={{ fontSize: fs(7), color: C.cinzaMarca, margin: '0 0 2mm 0' }}>
                  Estimativa parametrica para efeitos de planeamento do investimento. Valores sujeitos a confirmacao apos levantamento topografico e projetos de especialidades.
                </p>
                {p.lotCustosInfraPorCenario && p.lotCustosInfraPorCenario.length > 1 && p.lotCustosInfraPorCenario.every(c => c.items && c.items.length > 0) ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: fs(8), marginBottom: '2mm' }}>
                    <thead>
                      <tr style={{ background: C.accent, color: '#fff' }}>
                        <th style={{ padding: '1.5mm 2mm', textAlign: 'left', fontWeight: 700 }}>Infraestrutura</th>
                        {p.lotCustosInfraPorCenario.map(c => (
                          <th key={c.label} style={{ padding: '1.5mm 2mm', textAlign: 'right', fontWeight: 700, width: '18mm' }}>
                            Cen. {c.label}{c.label === p.lotCenarioRecomendado ? ' *' : ''}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {p.lotCustosInfra.map((item, i) => {
                        const infraId = (item as { infraId?: string }).infraId;
                        const subtotalsByCenario = p.lotCustosInfraPorCenario!.map(c => {
                          const match = c.items?.find(it => it.infraId === infraId || it.nome === item.nome);
                          return match?.subtotal ?? 0;
                        });
                        return (
                          <tr key={i} style={{ borderBottom: `1px solid ${C.cinzaLinha}` }}>
                            <td style={{ padding: '1.5mm 2mm' }}>
                              {item.nome}
                              {item.custoRamal ? <span style={{ fontSize: fs(6), color: C.cinzaMarca }}> (+ramal)</span> : null}
                            </td>
                            {subtotalsByCenario.map((st, j) => (
                              <td key={j} style={{ padding: '1.5mm 2mm', textAlign: 'right', fontWeight: p.lotCustosInfraPorCenario![j].label === p.lotCenarioRecomendado ? 600 : 400 }}>
                                {st.toLocaleString('pt-PT')} &euro;
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ borderTop: `1px solid ${C.cinzaLinha}` }}>
                        <td style={{ padding: '1.5mm 2mm', textAlign: 'right', fontWeight: 600 }}>Subtotal</td>
                        {p.lotCustosInfraPorCenario.map(c => (
                          <td key={c.label} style={{ padding: '1.5mm 2mm', textAlign: 'right', fontWeight: 600 }}>{c.subtotal.toLocaleString('pt-PT')} &euro;</td>
                        ))}
                      </tr>
                      {p.lotCustosInfraPorCenario.some(c => c.contingenciaPct > 0) && (
                        <tr style={{ borderTop: `1px solid ${C.cinzaLinha}`, color: C.cinzaMarca }}>
                          <td style={{ padding: '1.5mm 2mm', textAlign: 'right' }}>Contingencia</td>
                          {p.lotCustosInfraPorCenario.map(c => (
                            <td key={c.label} style={{ padding: '1.5mm 2mm', textAlign: 'right' }}>{c.contingenciaPct}%</td>
                          ))}
                        </tr>
                      )}
                      <tr style={{ background: C.accent, color: '#fff' }}>
                        <td style={{ padding: '2mm', textAlign: 'right', fontWeight: 700 }}>Total Estimado</td>
                        {p.lotCustosInfraPorCenario.map(c => (
                          <td key={c.label} style={{ padding: '2mm', textAlign: 'right', fontWeight: 700 }}>{c.total.toLocaleString('pt-PT')} &euro;</td>
                        ))}
                      </tr>
                    </tfoot>
                  </table>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: fs(8), marginBottom: '2mm' }}>
                    <thead>
                      <tr style={{ background: C.accent, color: '#fff' }}>
                        <th style={{ padding: '1.5mm 2mm', textAlign: 'left', fontWeight: 700 }}>Infraestrutura</th>
                        <th style={{ padding: '1.5mm 2mm', textAlign: 'center', fontWeight: 700, width: '12mm' }}>Unid.</th>
                        <th style={{ padding: '1.5mm 2mm', textAlign: 'right', fontWeight: 700, width: '14mm' }}>Qtd.</th>
                        <th style={{ padding: '1.5mm 2mm', textAlign: 'right', fontWeight: 700, width: '20mm' }}>P. Unit.</th>
                        <th style={{ padding: '1.5mm 2mm', textAlign: 'right', fontWeight: 700, width: '22mm' }}>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.lotCustosInfra.map((item, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${C.cinzaLinha}` }}>
                          <td style={{ padding: '1.5mm 2mm' }}>
                            {item.nome}
                            {item.custoRamal ? <span style={{ fontSize: fs(6), color: C.cinzaMarca }}> (+ramal)</span> : null}
                          </td>
                          <td style={{ padding: '1.5mm 2mm', textAlign: 'center', color: C.cinzaMarca }}>{item.unidade}</td>
                          <td style={{ padding: '1.5mm 2mm', textAlign: 'right' }}>{item.quantidade}</td>
                          <td style={{ padding: '1.5mm 2mm', textAlign: 'right' }}>{item.custoUnitario.toLocaleString('pt-PT')} &euro;</td>
                          <td style={{ padding: '1.5mm 2mm', textAlign: 'right', fontWeight: 600 }}>{item.subtotal.toLocaleString('pt-PT')} &euro;</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ borderTop: `1px solid ${C.cinzaLinha}` }}>
                        <td colSpan={4} style={{ padding: '1.5mm 2mm', textAlign: 'right', fontWeight: 600 }}>Subtotal</td>
                        <td style={{ padding: '1.5mm 2mm', textAlign: 'right', fontWeight: 600 }}>{(p.lotCustoObraSubtotal ?? 0).toLocaleString('pt-PT')} &euro;</td>
                      </tr>
                      {p.lotContingenciaPct != null && p.lotContingenciaPct > 0 && (
                        <tr style={{ borderTop: `1px solid ${C.cinzaLinha}`, color: C.cinzaMarca }}>
                          <td colSpan={4} style={{ padding: '1.5mm 2mm', textAlign: 'right' }}>Contingencia ({p.lotContingenciaPct}%)</td>
                          <td style={{ padding: '1.5mm 2mm', textAlign: 'right' }}>{((p.lotCustoObraTotal ?? 0) - (p.lotCustoObraSubtotal ?? 0)).toLocaleString('pt-PT')} &euro;</td>
                        </tr>
                      )}
                      <tr style={{ background: C.accent, color: '#fff' }}>
                        <td colSpan={4} style={{ padding: '2mm', textAlign: 'right', fontWeight: 700 }}>Total Estimado</td>
                        <td style={{ padding: '2mm', textAlign: 'right', fontWeight: 700 }}>{(p.lotCustoObraTotal ?? 0).toLocaleString('pt-PT')} &euro;</td>
                      </tr>
                    </tfoot>
                  </table>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3mm', alignItems: 'center', fontSize: fs(7) }}>
                  <span style={{ padding: '1mm 2mm', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 2, fontWeight: 600, color: '#92400e' }}>
                    {p.lotBandaPrecisao} &mdash; {p.lotBandaDescricao}
                  </span>
                  <span style={{ color: C.cinzaMarca }}>
                    Intervalo estimado: {(p.lotCustoObraMin ?? 0).toLocaleString('pt-PT')} &euro; &ndash; {(p.lotCustoObraMax ?? 0).toLocaleString('pt-PT')} &euro;
                  </span>
                  {p.lotCenarioRecomendado && (
                    <span style={{ color: C.cinzaMarca, fontStyle: 'italic' }}>* Cenario {p.lotCenarioRecomendado} recomendado para licenciamento</span>
                  )}
                </div>
              </div>
            )}

            {/* Add-ons de piscina */}
            {p.lotAddonsPool && p.lotAddonsPool.length > 0 && (
              <div className="pdf-no-break" style={{ marginBottom: '4mm', padding: '3mm 4mm', background: '#faf5ff', borderRadius: 2, border: '1px solid #e9d5ff', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <p style={{ fontSize: fs(9), fontWeight: 700, margin: '0 0 2mm 0', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Add-ons Piscina (por unidade)</p>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: fs(8) }}>
                  <thead>
                    <tr style={{ background: '#ede9fe' }}>
                      <th style={{ padding: '1.5mm 2mm', textAlign: 'left', fontWeight: 700, color: '#5b21b6' }}>Descricao</th>
                      <th style={{ padding: '1.5mm 2mm', textAlign: 'center', fontWeight: 700, color: '#5b21b6' }}>Un.</th>
                      <th style={{ padding: '1.5mm 2mm', textAlign: 'right', fontWeight: 700, color: '#5b21b6' }}>Valor/un.</th>
                      <th style={{ padding: '1.5mm 2mm', textAlign: 'right', fontWeight: 700, color: '#5b21b6' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.lotAddonsPool.map((item, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.cinzaLinha}` }}>
                        <td style={{ padding: '1.5mm 2mm' }}>{item.nome}</td>
                        <td style={{ padding: '1.5mm 2mm', textAlign: 'center' }}>{item.unidades}</td>
                        <td style={{ padding: '1.5mm 2mm', textAlign: 'right' }}>{item.valorUnit.toLocaleString('pt-PT')} &euro;</td>
                        <td style={{ padding: '1.5mm 2mm', textAlign: 'right', fontWeight: 600 }}>{item.subtotal.toLocaleString('pt-PT')} &euro;</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: '#7c3aed', color: '#fff' }}>
                      <td colSpan={3} style={{ padding: '2mm', textAlign: 'right', fontWeight: 700 }}>Total Add-ons Piscina</td>
                      <td style={{ padding: '2mm', textAlign: 'right', fontWeight: 700 }}>{(p.lotAddonsPoolTotal ?? 0).toLocaleString('pt-PT')} &euro;</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {/* Assuncoes + Dependencias lado a lado */}
            <div className="pdf-no-break" style={{ display: 'flex', gap: '3mm', marginBottom: '4mm', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              {p.lotAssuncoes && p.lotAssuncoes.length > 0 && (
                <div style={{ flex: 1, padding: '3mm 4mm', background: '#f0fdf4', borderRadius: 2, border: '1px solid #bbf7d0' }}>
                  <p style={{ fontSize: fs(9), fontWeight: 700, margin: '0 0 2mm 0', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Assuncoes de Base</p>
                  <ul style={{ margin: 0, padding: 0, fontSize: fs(8), listStyleType: 'none', color: C.grafite }}>
                    {p.lotAssuncoes.map((a, i) => (
                      <li key={i} style={{ margin: '0 0 1mm 0', display: 'flex', alignItems: 'flex-start', gap: '1.5mm' }}>
                        <span style={{ color: '#16a34a', fontWeight: 700 }}>-</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {p.lotDependencias && p.lotDependencias.length > 0 && (
                <div style={{ flex: 1, padding: '3mm 4mm', background: '#fefce8', borderRadius: 2, border: '1px solid #fde68a' }}>
                  <p style={{ fontSize: fs(9), fontWeight: 700, margin: '0 0 2mm 0', color: '#854d0e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Dependencias</p>
                  <ul style={{ margin: 0, padding: 0, fontSize: fs(8), listStyleType: 'none', color: C.grafite }}>
                    {p.lotDependencias.map((d, i) => (
                      <li key={i} style={{ margin: '0 0 1mm 0', display: 'flex', alignItems: 'flex-start', gap: '1.5mm' }}>
                        <span style={{ color: '#d97706', fontWeight: 700 }}>!</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}

        {/* RESUMO EXECUTIVO — Decisão em 60 segundos */}
        {p.mostrarResumo && p.resumoExecutivo && (
          <div className="pdf-no-break" style={{ marginBottom: '5mm', padding: '4mm 5mm', background: C.accentSoft, borderRadius: 3, border: `2px solid ${C.accent}`, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
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

        {/* Opcoes de cotacao (cave/piscina/ambos) */}
        {p.lotOpcoesCotacao && p.lotOpcoesCotacao.length > 0 && (
          <div className="pdf-no-break" style={{ marginBottom: '5mm', padding: '4mm 5mm', background: '#fffbeb', borderRadius: 3, border: '2px solid #fbbf24', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            <p style={{ fontSize: fs(10), fontWeight: 700, margin: '0 0 2mm 0', color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Opcoes de Cotacao</p>
            <p style={{ fontSize: fs(8), color: C.cinzaMarca, margin: '0 0 3mm 0' }}>
              Comparativo de valor conforme equipamentos selecionados. A opcao configurada esta destacada.
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: fs(8) }}>
              <thead>
                <tr style={{ background: '#fef3c7' }}>
                  <th style={{ padding: '2mm', textAlign: 'left', fontWeight: 700, color: '#92400e' }}>Opcao</th>
                  <th style={{ padding: '2mm', textAlign: 'right', fontWeight: 700, color: '#92400e' }}>Total s/ IVA</th>
                  <th style={{ padding: '2mm', textAlign: 'right', fontWeight: 700, color: '#92400e' }}>Total c/ IVA</th>
                  <th style={{ padding: '2mm', textAlign: 'right', fontWeight: 700, color: '#92400e' }}>Delta</th>
                </tr>
              </thead>
              <tbody>
                {p.lotOpcoesCotacao.map((opt, i) => {
                  const isLast = i === (p.lotOpcoesCotacao?.length ?? 0) - 1;
                  const isBase = i === 0;
                  return (
                    <tr key={i} style={{
                      borderBottom: `1px solid ${C.cinzaLinha}`,
                      background: isLast && !isBase ? '#fef9c3' : 'transparent',
                      fontWeight: isLast && !isBase ? 600 : 400,
                    }}>
                      <td style={{ padding: '2mm' }}>{opt.label}</td>
                      <td style={{ padding: '2mm', textAlign: 'right' }}>{opt.totalSemIVA.toLocaleString('pt-PT')} &euro;</td>
                      <td style={{ padding: '2mm', textAlign: 'right' }}>{opt.totalComIVA.toLocaleString('pt-PT')} &euro;</td>
                      <td style={{ padding: '2mm', textAlign: 'right', color: opt.deltaBase ? '#b45309' : C.cinzaMarca }}>{opt.deltaBase ? `+${opt.deltaBase.toLocaleString('pt-PT')} €` : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p style={{ fontSize: fs(7), color: C.cinzaMarca, margin: '2mm 0 0 0' }}>
              Nota: A opcao combinada inclui desconto de 3% sobre os add-ons individuais.
            </p>
          </div>
        )}

        {/* Add-on Moradia Tipo */}
        {p.moradiaAddon && (() => {
          const ma = p.moradiaAddon;
          const totalLotes = ma.numTipos + ma.repeticoesIguais + ma.repeticoesAdaptadas;
          const custoPorLote = totalLotes > 0 ? Math.round(ma.totalAddon / totalLotes) : 0;
          const feeEfetivo = ma.modo === 'previo' ? (ma.feePrevio ?? 0) : ma.feeOriginal;
          return (
          <div className="pdf-no-break" style={{ marginBottom: '5mm', padding: '4mm 5mm', background: '#fef3c7', borderRadius: 3, border: '2px solid #f59e0b', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            <p style={{ fontSize: fs(10), fontWeight: 700, margin: '0 0 2mm 0', color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Add-on: Moradia Tipo {ma.modo === 'previo' ? '(Estudo Prévio)' : '(Licenciamento)'}
            </p>
            <p style={{ fontSize: fs(8), color: C.cinzaMarca, margin: '0 0 2mm 0' }}>
              {ma.modo === 'previo'
                ? 'Estudo prévio da moradia-tipo para validação da solução urbanística: volumetria, implantação base e imagens 3D.'
                : 'Projeto de licenciamento da moradia-tipo original + pacote de repetições por lote.'}
            </p>

            {/* ABC Breakdown */}
            <div style={{ background: '#fde68a', borderRadius: 2, padding: '2mm 3mm', marginBottom: '3mm', fontSize: fs(7.5) }}>
              <p style={{ margin: '0 0 1mm 0', fontWeight: 700, color: '#92400e' }}>Base de calculo — Area Bruta de Construcao (ABC)</p>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {ma.abcBase != null && (
                    <tr>
                      <td style={{ padding: '0.5mm 0', color: C.grafite }}>ABC moradia (area principal)</td>
                      <td style={{ padding: '0.5mm 0', textAlign: 'right', fontWeight: 600, color: C.grafite }}>{ma.abcBase} m²</td>
                    </tr>
                  )}
                  {(ma.areaCave ?? 0) > 0 && (
                    <tr>
                      <td style={{ padding: '0.5mm 0', color: C.cinzaMarca }}>Cave/garagem ({ma.areaCave} m² × 70%)</td>
                      <td style={{ padding: '0.5mm 0', textAlign: 'right', color: C.cinzaMarca }}>+ {ma.abcCavePond} m²</td>
                    </tr>
                  )}
                  {(ma.areaVaranda ?? 0) > 0 && (
                    <tr>
                      <td style={{ padding: '0.5mm 0', color: C.cinzaMarca }}>Varandas/terracos ({ma.areaVaranda} m² × 30%)</td>
                      <td style={{ padding: '0.5mm 0', textAlign: 'right', color: C.cinzaMarca }}>+ {ma.abcVarandaPond} m²</td>
                    </tr>
                  )}
                  <tr style={{ borderTop: '1px solid #d97706' }}>
                    <td style={{ padding: '1mm 0 0.5mm 0', fontWeight: 700, color: '#92400e' }}>ABC total ponderada</td>
                    <td style={{ padding: '1mm 0 0.5mm 0', textAlign: 'right', fontWeight: 700, color: '#92400e' }}>{ma.areaMoradia} m²</td>
                  </tr>
                </tbody>
              </table>
              <p style={{ margin: '1mm 0 0 0', fontSize: fs(6.5), color: '#92400e', fontStyle: 'italic' }}>
                Exclui anexos, piscinas e arranjos exteriores privados (orcamentados separadamente).
                {ma.euroPorM2 != null && <> Fee base: {ma.euroPorM2.toFixed(2)} €/m²{p.complexidade && p.complexidade !== 'media' ? ` (complexidade ${p.complexidade})` : ''}.</>}
              </p>
            </div>

            {/* Tabela de componentes */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: fs(8) }}>
              <thead>
                <tr style={{ background: '#fde68a' }}>
                  <th style={{ padding: '2mm', textAlign: 'left', fontWeight: 700, color: '#92400e' }}>Componente</th>
                  <th style={{ padding: '2mm', textAlign: 'center', fontWeight: 700, color: '#92400e' }}>Qtd.</th>
                  <th style={{ padding: '2mm', textAlign: 'right', fontWeight: 700, color: '#92400e' }}>Unit.</th>
                  <th style={{ padding: '2mm', textAlign: 'right', fontWeight: 700, color: '#92400e' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {/* Moradia original */}
                <tr style={{ borderBottom: `1px solid ${C.cinzaLinha}` }}>
                  <td style={{ padding: '2mm' }}>
                    <span style={{ fontWeight: 600 }}>{ma.modo === 'previo' ? 'Estudo prévio moradia-tipo' : 'Moradia original'}</span>
                    <span style={{ fontSize: fs(7), color: C.cinzaMarca, marginLeft: '2mm' }}>(ABC {ma.areaMoradia} m²)</span>
                    <span style={{ display: 'block', fontSize: fs(6.5), color: C.cinzaMarca, marginTop: '0.5mm' }}>
                      Projeto completo: plantas, cortes, alcados, 3D, memorias descritivas e pecas escritas.
                    </span>
                  </td>
                  <td style={{ padding: '2mm', textAlign: 'center' }}>{ma.numTipos}</td>
                  <td style={{ padding: '2mm', textAlign: 'right' }}>{formatCurrency(feeEfetivo, lang)}</td>
                  <td style={{ padding: '2mm', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(ma.totalOriginal, lang)}</td>
                </tr>

                {/* Repetição idêntica */}
                {ma.repeticoesIguais > 0 && (
                  <tr style={{ borderBottom: `1px solid ${C.cinzaLinha}` }}>
                    <td style={{ padding: '2mm' }}>
                      <span style={{ fontWeight: 600 }}>Repetição idêntica</span>
                      <span style={{ fontSize: fs(7), color: '#16a34a', marginLeft: '2mm', fontWeight: 600 }}>−{ma.descontoIgual}%</span>
                      <span style={{ display: 'block', fontSize: fs(6.5), color: C.cinzaMarca, marginTop: '0.5mm' }}>
                        Desenho base com desconto por repeticao. Aplica-se a {ma.repeticoesIguais} lote{ma.repeticoesIguais > 1 ? 's' : ''}.
                        <br />Inclui: adaptacao de pecas desenhadas, compatibilizacao com lote, revisao de memorias.
                      </span>
                    </td>
                    <td style={{ padding: '2mm', textAlign: 'center' }}>{ma.repeticoesIguais}</td>
                    <td style={{ padding: '2mm', textAlign: 'right' }}>{formatCurrency(Math.round(ma.feeOriginal * (1 - ma.descontoIgual / 100)), lang)}</td>
                    <td style={{ padding: '2mm', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(ma.totalRepeticoesIguais, lang)}</td>
                  </tr>
                )}

                {/* Repetição com adaptação */}
                {ma.repeticoesAdaptadas > 0 && (
                  <tr style={{ borderBottom: `1px solid ${C.cinzaLinha}` }}>
                    <td style={{ padding: '2mm' }}>
                      <span style={{ fontWeight: 600 }}>Repetição com adaptação</span>
                      <span style={{ fontSize: fs(7), color: '#ea580c', marginLeft: '2mm', fontWeight: 600 }}>−{ma.descontoAdaptada}%</span>
                      <span style={{ display: 'block', fontSize: fs(6.5), color: C.cinzaMarca, marginTop: '0.5mm' }}>
                        Variante com alteracoes programaticas ou formais. Aplica-se a {ma.repeticoesAdaptadas} lote{ma.repeticoesAdaptadas > 1 ? 's' : ''}.
                        <br />Inclui: redesenho parcial, novas pecas desenhadas, compatibilizacao e memorias actualizadas.
                      </span>
                    </td>
                    <td style={{ padding: '2mm', textAlign: 'center' }}>{ma.repeticoesAdaptadas}</td>
                    <td style={{ padding: '2mm', textAlign: 'right' }}>{formatCurrency(Math.round(ma.feeOriginal * (1 - ma.descontoAdaptada / 100)), lang)}</td>
                    <td style={{ padding: '2mm', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(ma.totalRepeticoesAdaptadas, lang)}</td>
                  </tr>
                )}

                {/* Parcela fixa por lote */}
                {(ma.fixoLoteQty ?? (ma.repeticoesIguais + ma.repeticoesAdaptadas)) > 0 && (
                  <tr style={{ borderBottom: `1px solid ${C.cinzaLinha}` }}>
                    <td style={{ padding: '2mm' }}>
                      <span style={{ fontWeight: 600 }}>Parcela fixa por lote</span>
                      <span style={{ display: 'block', fontSize: fs(6.5), color: C.cinzaMarca, marginTop: '0.5mm' }}>
                        Trabalho individual por lote: implantacao no terreno, adaptacao de cotas e acessos, pecas do lote,
                        <br />submissao na camara, resposta a notificacoes e acompanhamento até deferimento.
                      </span>
                    </td>
                    <td style={{ padding: '2mm', textAlign: 'center' }}>{ma.fixoLoteQty ?? (ma.repeticoesIguais + ma.repeticoesAdaptadas)}</td>
                    <td style={{ padding: '2mm', textAlign: 'right' }}>{formatCurrency(ma.fixoLote, lang)}</td>
                    <td style={{ padding: '2mm', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(ma.totalFixoLotes, lang)}</td>
                  </tr>
                )}

                {/* Total */}
                <tr style={{ background: '#f59e0b', fontWeight: 700 }}>
                  <td colSpan={3} style={{ padding: '2.5mm', color: '#fff' }}>Total Add-on Moradia Tipo</td>
                  <td style={{ padding: '2.5mm', textAlign: 'right', color: '#fff', fontSize: fs(10) }}>{formatCurrency(ma.totalAddon, lang)}</td>
                </tr>
              </tbody>
            </table>

            {/* Resumo por lote */}
            <div style={{ marginTop: '2mm', padding: '2mm 3mm', background: '#fff7ed', borderRadius: 2, fontSize: fs(7), display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2mm' }}>
              <span style={{ color: C.cinzaMarca }}>Total de lotes abrangidos: <strong style={{ color: C.grafite }}>{totalLotes}</strong></span>
              <span style={{ color: C.cinzaMarca }}>Custo medio por lote: <strong style={{ color: C.grafite }}>{formatCurrency(custoPorLote, lang)}</strong></span>
              {ma.euroPorM2 != null && <span style={{ color: C.cinzaMarca }}>Fee base: <strong style={{ color: C.grafite }}>{ma.euroPorM2.toFixed(2)} €/m²</strong></span>}
            </div>

            {/* Cláusulas */}
            {ma.clausulas.length > 0 && (
              <div style={{ marginTop: '2mm', fontSize: fs(7), color: C.cinzaMarca, fontStyle: 'italic' }}>
                {ma.clausulas.map((c, i) => (
                  <p key={i} style={{ margin: '0.5mm 0' }}>{c}</p>
                ))}
              </div>
            )}
          </div>
          );
        })()}

        {/* Tabela de valores - começa em página nova */}
        <div className="page-break-before" style={{ marginBottom: '5mm', paddingTop: '3mm', breakBefore: 'page', pageBreakBefore: 'always', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
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
                <td style={{ padding: '3mm', color: C.grafite }}>
                  {p.isLoteamento ? 'Honorários Urbanismo' : t('proposal.archFees', lang)}
                  {p.isLoteamento && p.valorObra && (
                    <span style={{ display: 'block', fontSize: fs(6.5), fontWeight: 400, color: C.cinzaMarca, fontStyle: 'italic' }}>
                      {p.honorPct ? `${p.honorPct}%` : '8%'} sobre o valor estimado de obra ({formatCurrency(parseFloat(p.valorObra), lang)})
                      {p.honorCap ? ` · Teto: ${formatCurrency(parseFloat(p.honorCap), lang)}` : ''}
                    </span>
                  )}
                  {p.isLoteamento && (
                    <span style={{ display: 'block', fontSize: fs(6), fontWeight: 400, color: C.cinzaMarca, marginTop: '0.5mm' }}>
                      Base: obras de urbanizacao (arruamentos, pavimentacoes, drenagens, redes de agua, saneamento, eletricidade, ITED, gas, IP, arranjos exteriores). Exclui edificacao, moradias, muros/arranjos dentro dos lotes, piscinas e anexos privados.
                    </span>
                  )}
                </td>
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
                  {/* Se há desconto, mostrar subtotal original + linha de desconto */}
                  {p.descontoValor != null && p.descontoValor > 0 && p.totalSemDescontoSemIVA != null && (
                    <>
                      <tr style={{ borderBottom: `1px solid ${C.cinzaLinha}`, color: C.grafite, background: C.offWhite }}>
                        <td style={{ padding: '3mm', fontWeight: 600 }}>
                          {lang === 'en' ? 'Services subtotal' : 'Subtotal serviços'}
                        </td>
                        <td style={{ textAlign: 'right', padding: '3mm', fontWeight: 600, fontSize: fs(10) }}>
                          {formatCurrency(p.totalSemDescontoSemIVA, lang)}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: `1px solid ${C.cinzaLinha}`, background: '#fef2f2' }}>
                        <td style={{ padding: '3mm', color: '#dc2626', fontWeight: 600 }}>
                          {(() => {
                            const labels: Record<string, string> = {
                              recorrencia: lang === 'en' ? 'Recurring client discount' : 'Desconto cliente recorrente',
                              pagamento_antecipado: lang === 'en' ? 'Early payment discount' : 'Desconto pagamento antecipado',
                              pipeline: lang === 'en' ? 'Volume / pipeline discount' : 'Desconto pipeline / volume',
                              personalizado: lang === 'en' ? 'Commercial discount' : 'Desconto comercial',
                            };
                            const tipoLabel = labels[p.descontoTipo || ''] || (lang === 'en' ? 'Discount' : 'Desconto');
                            return `${tipoLabel} (${p.descontoPct ?? 0}%)`;
                          })()}
                        </td>
                        <td style={{ textAlign: 'right', padding: '3mm', color: '#dc2626', fontWeight: 700, fontSize: fs(10) }}>
                          &minus; {formatCurrency(p.descontoValor, lang)}
                        </td>
                      </tr>
                      {p.descontoJustificacao && (
                        <tr>
                          <td colSpan={2} style={{ padding: '1.5mm 3mm', fontSize: fs(7), fontStyle: 'italic', color: C.cinzaMarca }}>
                            {p.descontoJustificacao}
                          </td>
                        </tr>
                      )}
                    </>
                  )}
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
          {/* B1: PIP opcional — nota com/sem PIP */}
          {p.isLoteamento && p.lotPipNotaOpcional && (
            <div className="pdf-no-break" style={{ marginTop: '3mm', padding: '2.5mm 3mm', background: '#fef3c7', borderRadius: 2, borderLeft: '3px solid #f59e0b', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <p style={{ fontSize: fs(8), color: '#92400e', margin: 0, lineHeight: 1.4 }}>
                <strong>Fase PIP incluida.</strong> Sem PIP, o investimento em honorarios reduz-se em {p.lotPipNotaOpcional.valorPIP.toLocaleString('pt-PT')} &euro; (total {p.lotPipNotaOpcional.valorSemPIP.toLocaleString('pt-PT')} &euro;) e o prazo encurta 2&ndash;4 meses.
              </p>
            </div>
          )}
        </div>

        {/* Descrição das fases - começa em página nova (página 4) */}
        <div className="page-break-before" style={{ paddingTop: '3mm', breakBefore: 'page', pageBreakBefore: 'always' }}>
          <p className="section-title" style={{ fontSize: fs(10), fontWeight: 600, color: C.cinzaMarca, margin: '0 0 5mm 0', textTransform: 'uppercase', letterSpacing: '0.05em', breakAfter: 'avoid', pageBreakAfter: 'avoid' }}>{t('proposal.section3', lang)}</p>
          {p.notaBim && (
            <div className="pdf-no-break" style={{ padding: '2.5mm 3mm', background: C.accentSoft2, borderRadius: 2, marginBottom: '3mm', borderLeft: `3px solid ${C.accent}`, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <p style={{ fontSize: fs(9), fontWeight: 600, margin: 0, color: C.accent }}>{p.isLoteamento ? 'Metodologia de trabalho' : t('proposal.bimMethodology', lang)}</p>
              <p style={{ fontSize: fs(8), color: C.cinzaMarca, margin: '1mm 0 0 0', lineHeight: 1.45 }}>{p.notaBim}</p>
            </div>
          )}
          {p.notaReunioes && (
            <div className="pdf-no-break" style={{ padding: '2.5mm 3mm', background: C.offWhite, borderRadius: 2, marginBottom: '3mm', borderLeft: `3px solid ${C.cinzaLinha}`, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
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
                          breakInside: 'avoid',
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
                        breakInside: 'avoid',
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
            {/* Restantes linhas — cada row protegida contra corte */}
            {(p.duracaoEstimada ?? []).length > 2 && (
              <table className="pdf-no-break" style={{ width: '100%', borderCollapse: 'collapse', fontSize: fs(10), marginBottom: '2mm' }}>
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
            
            {/* P3/B1: Nota sobre PIP opcional — com valor em € quando disponível */}
            {p.isLoteamento && (p.duracaoEstimada ?? []).some(d => d.nome.includes('PIP')) && (
              <p className="pdf-no-break" style={{ fontSize: fs(7.5), color: '#1e40af', margin: '2mm 0 0 0', padding: '1.5mm 3mm', background: '#eff6ff', borderRadius: 2, borderLeft: '2px solid #3b82f6', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <strong>Nota PIP:</strong> O Pedido de Informacao Previa e uma fase opcional.
                {p.lotPipNotaOpcional
                  ? ` Sem PIP, o investimento em honorarios reduz-se em ${p.lotPipNotaOpcional.valorPIP.toLocaleString('pt-PT')} &euro; (total ${p.lotPipNotaOpcional.valorSemPIP.toLocaleString('pt-PT')} &euro;) e o prazo encurta 2-4 meses.`
                  : ' Sem PIP, o prazo global reduz-se em 2-4 meses e a percentagem de honorarios e redistribuida pelas restantes fases, sem alteracao do valor total.'}
              </p>
            )}
            
            {/* Cenários de Prazo - logo após a tabela de duração */}
            {p.mostrarCenarios && p.cenariosPrazo && (
              <div className="pdf-no-break" style={{ marginTop: '4mm', padding: '3mm 4mm', background: C.offWhite, borderRadius: 2, borderLeft: `3px solid ${C.accent}`, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
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
          
          {/* Notas de proteção de âmbito (últimas notas) - destacadas — começar em página nova para título + conteúdo juntos */}
          {p.notas.length > 6 && (
            <div className="pdf-no-break page-break-before" style={{ padding: '3mm 4mm', background: C.offWhite, borderRadius: 2, borderLeft: `3px solid ${C.accent}`, breakBefore: 'page', pageBreakBefore: 'always', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <p style={{ fontSize: fs(9), fontWeight: 600, color: C.accent, margin: '0 0 2mm 0', textTransform: 'uppercase', letterSpacing: '0.03em', breakAfter: 'avoid', pageBreakAfter: 'avoid' }}>
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

        {/* ESTIMATIVA DE INVESTIMENTO — Versao Loteamento (Promotor) vs Edificacao */}
        {p.isLoteamento && p.lotCustoObraTotal && p.lotCenarios && p.lotCenarios.length > 0 && (() => {
          // Calcular investimento do promotor — usar N. lotes pretendidos (alvo) como referência
          const nLotes = parseInt(p.lotNumLotes || '0', 10) || 0;
          const frente = parseFloat(p.lotFrenteTerreno || '0');
          const areaEstudo = parseFloat(p.lotAreaEstudo || '0');
          if (nLotes <= 0 || frente <= 0 || areaEstudo <= 0) return null;
          // Replicar cálculo dos "Dados do Terreno" — mesma lógica com fallback ao município
          const munMatchInv = p.lotMunicipio ? municipios.find(m => m.nome === p.lotMunicipio) : null;
          let munPInv: ParametrosUrbanisticos | undefined;
          if (munMatchInv?.parametros) {
            const pp = munMatchInv.parametros;
            const uso = (p.lotUsoParametros || 'habitacao') as 'habitacao' | 'equipamentos';
            munPInv = ('habitacao' in pp)
              ? (uso === 'equipamentos' ? (pp.equipamentos ?? EQUIPAMENTOS_DEFAULTS) : pp.habitacao)
              : pp as unknown as ParametrosUrbanisticos;
          }
          const paramInv = (key: keyof ParametrosUrbanisticos): string =>
            (p.lotParametros as any)?.[key] || munPInv?.[key] || '';

          const pctCed = parseFloat(paramInv('percentagemCedencias') || '15');
          const largura = frente / nLotes;
          const cedencias = Math.round(areaEstudo * pctCed / 100);
          const areaMediaLote = Math.round((areaEstudo - cedencias) / nLotes);
          if (areaMediaLote <= 0) return null;
          const profundidade = areaMediaLote / largura;
          const tipo = (p.lotTipoHabitacao || '').toLowerCase();
          const alturaMax = parseFloat(paramInv('alturaMaxima') || '0');
          const afFrontal = parseFloat(paramInv('afastamentoFrontal')) || 5;
          const afLat = parseFloat(paramInv('afastamentoLateral')) || (alturaMax > 0 ? Math.max(3, alturaMax / 2) : 3);
          const afPosterior = parseFloat(paramInv('afastamentoPosterior')) || 6;
          const afLateralTotal = tipo.includes('isolada') ? afLat * 2 : tipo.includes('geminada') ? afLat : 0;
          const larguraUtil = Math.max(0, largura - afLateralTotal);
          const profMaxConst = parseFloat(paramInv('profundidadeMaxConstrucao')) || 0;
          const profUtilAf = Math.max(0, profundidade - afFrontal - afPosterior);
          const profUtil = profMaxConst > 0 ? Math.min(profUtilAf, profMaxConst) : profUtilAf;
          const envelopeMax = Math.round(larguraUtil * profUtil);
          const io = parseFloat(paramInv('indiceImplantacao') || '0');
          const iu = parseFloat(paramInv('indiceConstrucao') || '0');
          const numPisos = Math.max(1, parseInt(p.lotParametros?.numPisos || '2', 10));
          const DEFAULTS_IO: Record<string, number> = { isolada: 0.35, geminada: 0.40, banda: 0.50 };
          const ioEfetivo = io > 0 ? io : (Object.entries(DEFAULTS_IO).find(([k]) => tipo.includes(k))?.[1] ?? 0.35);
          const implantacaoByIO = Math.round(areaMediaLote * ioEfetivo);
          const implantacao = Math.min(implantacaoByIO, envelopeMax > 0 ? envelopeMax : implantacaoByIO);
          const abcByPisos = implantacao * numPisos;
          const abcByIU = iu > 0 ? Math.round(areaMediaLote * iu) : 0;
          const abc = abcByIU > 0 ? Math.min(abcByPisos, abcByIU) : abcByPisos;
          const abcMax = envelopeMax > 0 ? envelopeMax * numPisos : abcByPisos;
          const abcEstimada = Math.min(abc, abcMax);
          const custosMoradia = { min: 1000, med: 1400, max: 2000 };
          // Moradia addon pós-desconto: o desconto comercial aplica-se proporcionalmente a todos os serviços
          const moradiaAddonRaw = p.moradiaAddon?.totalAddon ?? 0;
          const moradiaAddonPostDiscount = p.descontoPct && p.descontoPct > 0
            ? Math.round(moradiaAddonRaw * (1 - p.descontoPct / 100))
            : moradiaAddonRaw;
          const porCenario = p.lotCustosInfraPorCenario && p.lotCustosInfraPorCenario.length > 1 ? p.lotCustosInfraPorCenario : null;
          const honorariosTotal = (p.totalSemIVA ?? 0) - moradiaAddonPostDiscount;
          const construcaoTotalMin = abcEstimada * custosMoradia.min * nLotes;
          const construcaoTotalMed = abcEstimada * custosMoradia.med * nLotes;
          const construcaoTotalMax = abcEstimada * custosMoradia.max * nLotes;
          const inv = {
            infraTotal: p.lotCustoObraTotal ?? 0,
            honorariosTotal,
            construcaoAreaMediaLote: abcEstimada,
            construcaoNLotes: nLotes,
            construcaoMin: abcEstimada * custosMoradia.min,
            construcaoMed: abcEstimada * custosMoradia.med,
            construcaoMax: abcEstimada * custosMoradia.max,
            construcaoTotalMin,
            construcaoTotalMed,
            construcaoTotalMax,
            investimentoTotalMin: (porCenario ? Math.min(...porCenario.map(c => c.total)) : (p.lotCustoObraTotal ?? 0)) + honorariosTotal + construcaoTotalMin,
            investimentoTotalMed: (p.lotCustoObraTotal ?? 0) + honorariosTotal + construcaoTotalMed,
            investimentoTotalMax: (porCenario ? Math.max(...porCenario.map(c => c.total)) : (p.lotCustoObraTotal ?? 0)) + honorariosTotal + construcaoTotalMax,
            investimentoPorCenario: porCenario ? porCenario.map((c, i) => {
              const constTotal = porCenario.length >= 3
                ? (i === 0 ? construcaoTotalMin : i === 1 ? construcaoTotalMed : construcaoTotalMax)
                : (i === 0 ? construcaoTotalMin : construcaoTotalMax);
              return c.total + honorariosTotal + constTotal;
            }) : null,
            porCenario,
          };
          const fmtN = (n: number) => n.toLocaleString('pt-PT');
          return (
          <div className="pdf-no-break" style={{ marginTop: '6mm', marginBottom: '6mm', padding: '4mm 5mm', background: C.offWhite, borderRadius: 3, border: `2px solid ${C.accent}`, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            <p style={{ fontSize: fs(10), fontWeight: 700, margin: '0 0 1mm 0', color: C.accent, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Investimento Global do Promotor
            </p>
            <p style={{ fontSize: fs(7.5), color: C.cinzaMarca, margin: '0 0 4mm 0' }}>
              Visao consolidada para planeamento financeiro &mdash; {inv.construcaoNLotes} lotes, ABC estimada {fmtN(inv.construcaoAreaMediaLote)} m2/moradia
            </p>

            {/* Tabela principal — P1: colunas A/B/C por cenário quando aplicável */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: fs(8), marginBottom: '3mm' }}>
              <thead>
                <tr style={{ background: C.accent }}>
                  <th style={{ padding: '2mm 3mm', textAlign: 'left', color: C.onAccent, fontWeight: 700 }}>Componente</th>
                  {inv.porCenario ? (
                    inv.porCenario.map(c => (
                      <th key={c.label} style={{ padding: '2mm 3mm', textAlign: 'right', color: C.onAccent, fontWeight: 700 }}>
                        Cen. {c.label}{c.label === p.lotCenarioRecomendado ? ' *' : ''}
                      </th>
                    ))
                  ) : (
                    <>
                      <th style={{ padding: '2mm 3mm', textAlign: 'right', color: C.onAccent, fontWeight: 700 }}>Economico</th>
                      <th style={{ padding: '2mm 3mm', textAlign: 'right', color: C.onAccent, fontWeight: 700 }}>Medio</th>
                      <th style={{ padding: '2mm 3mm', textAlign: 'right', color: C.onAccent, fontWeight: 700 }}>Premium</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: `1px solid ${C.cinzaLinha}` }}>
                  <td style={{ padding: '2mm 3mm', fontWeight: 500 }}>Infraestruturas de urbanizacao</td>
                  {inv.porCenario ? (
                    inv.porCenario.map(c => (
                      <td key={c.label} style={{ padding: '2mm 3mm', textAlign: 'right', fontWeight: c.label === p.lotCenarioRecomendado ? 600 : 400 }}>
                        {fmtN(c.total)} &euro;
                      </td>
                    ))
                  ) : (
                    <td style={{ padding: '2mm 3mm', textAlign: 'right' }} colSpan={3}>
                      <strong>{fmtN(inv.infraTotal)} &euro;</strong>
                    </td>
                  )}
                </tr>
                <tr style={{ borderBottom: `1px solid ${C.cinzaLinha}` }}>
                  <td style={{ padding: '2mm 3mm', fontWeight: 500 }}>Honorarios (loteamento)</td>
                  <td style={{ padding: '2mm 3mm', textAlign: 'right' }} colSpan={inv.porCenario ? inv.porCenario.length : 3}>
                    <strong>{fmtN(inv.honorariosTotal)} &euro;</strong>
                    <span style={{ fontSize: fs(7), color: C.cinzaMarca, marginLeft: '2mm' }}>(conforme proposta)</span>
                  </td>
                </tr>
                {p.moradiaAddon && (
                  <tr style={{ borderBottom: `1px solid ${C.cinzaLinha}`, background: '#fef9c3' }}>
                    <td style={{ padding: '2mm 3mm', fontWeight: 500 }}>
                      Honorarios moradias
                      <span style={{ display: 'block', fontSize: fs(6.5), color: C.cinzaMarca, fontWeight: 400 }}>
                        {p.moradiaAddon.modo === 'previo' ? 'Estudo previo' : 'Licenciamento'} + {p.moradiaAddon.repeticoesIguais + p.moradiaAddon.repeticoesAdaptadas} repeticoes
                      </span>
                    </td>
                    <td style={{ padding: '2mm 3mm', textAlign: 'right' }} colSpan={inv.porCenario ? inv.porCenario.length : 3}>
                      <strong>{fmtN(moradiaAddonPostDiscount)} &euro;</strong>
                      <span style={{ fontSize: fs(7), color: C.cinzaMarca, marginLeft: '2mm' }}>(add-on moradia tipo{p.descontoPct && p.descontoPct > 0 ? `, −${p.descontoPct}%` : ''})</span>
                    </td>
                  </tr>
                )}
                <tr style={{ borderBottom: `1px solid ${C.cinzaLinha}`, background: '#f8fafc' }}>
                  <td style={{ padding: '2mm 3mm', fontWeight: 500 }}>
                    Construcao moradias
                    <span style={{ display: 'block', fontSize: fs(6.5), color: C.cinzaMarca, fontWeight: 400 }}>
                      {inv.construcaoNLotes} un. &times; {fmtN(inv.construcaoAreaMediaLote)} m2 (chave na mao)
                    </span>
                  </td>
                  {inv.porCenario ? (
                    inv.porCenario.length >= 3 ? (
                      <>
                        <td style={{ padding: '2mm 3mm', textAlign: 'right' }}>
                          <span style={{ fontSize: fs(7), color: C.cinzaMarca }}>{fmtN(inv.construcaoMin)}&euro;/un.</span><br />
                          <strong>{fmtN(inv.construcaoTotalMin)} &euro;</strong>
                        </td>
                        <td style={{ padding: '2mm 3mm', textAlign: 'right' }}>
                          <span style={{ fontSize: fs(7), color: C.cinzaMarca }}>{fmtN(inv.construcaoMed)}&euro;/un.</span><br />
                          <strong>{fmtN(inv.construcaoTotalMed)} &euro;</strong>
                        </td>
                        <td style={{ padding: '2mm 3mm', textAlign: 'right' }}>
                          <span style={{ fontSize: fs(7), color: C.cinzaMarca }}>{fmtN(inv.construcaoMax)}&euro;/un.</span><br />
                          <strong>{fmtN(inv.construcaoTotalMax)} &euro;</strong>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: '2mm 3mm', textAlign: 'right' }}>
                          <span style={{ fontSize: fs(7), color: C.cinzaMarca }}>{fmtN(inv.construcaoMin)}&euro;/un.</span><br />
                          <strong>{fmtN(inv.construcaoTotalMin)} &euro;</strong>
                        </td>
                        <td style={{ padding: '2mm 3mm', textAlign: 'right' }}>
                          <span style={{ fontSize: fs(7), color: C.cinzaMarca }}>{fmtN(inv.construcaoMax)}&euro;/un.</span><br />
                          <strong>{fmtN(inv.construcaoTotalMax)} &euro;</strong>
                        </td>
                      </>
                    )
                  ) : (
                    <>
                      <td style={{ padding: '2mm 3mm', textAlign: 'right' }}>
                        <span style={{ fontSize: fs(7), color: C.cinzaMarca }}>{fmtN(inv.construcaoMin)}&euro;/un.</span><br />
                        <strong>{fmtN(inv.construcaoTotalMin)} &euro;</strong>
                      </td>
                      <td style={{ padding: '2mm 3mm', textAlign: 'right' }}>
                        <span style={{ fontSize: fs(7), color: C.cinzaMarca }}>{fmtN(inv.construcaoMed)}&euro;/un.</span><br />
                        <strong>{fmtN(inv.construcaoTotalMed)} &euro;</strong>
                      </td>
                      <td style={{ padding: '2mm 3mm', textAlign: 'right' }}>
                        <span style={{ fontSize: fs(7), color: C.cinzaMarca }}>{fmtN(inv.construcaoMax)}&euro;/un.</span><br />
                        <strong>{fmtN(inv.construcaoTotalMax)} &euro;</strong>
                      </td>
                    </>
                  )}
                </tr>
              </tbody>
              <tfoot>
                <tr style={{ background: C.accentSoft, borderTop: `2px solid ${C.accent}` }}>
                  <td style={{ padding: '2.5mm 3mm', fontWeight: 700, color: C.accent }}>Investimento Total</td>
                  {inv.investimentoPorCenario ? (
                    inv.investimentoPorCenario.map((tot, i) => (
                      <td key={i} style={{ padding: '2.5mm 3mm', textAlign: 'right', fontWeight: 700, color: C.accent }}>{fmtN(tot)} &euro;</td>
                    ))
                  ) : (
                    <>
                      <td style={{ padding: '2.5mm 3mm', textAlign: 'right', fontWeight: 700, color: C.accent }}>{fmtN(inv.investimentoTotalMin)} &euro;</td>
                      <td style={{ padding: '2.5mm 3mm', textAlign: 'right', fontWeight: 700, fontSize: fs(9), color: C.accent }}>{fmtN(inv.investimentoTotalMed)} &euro;</td>
                      <td style={{ padding: '2.5mm 3mm', textAlign: 'right', fontWeight: 700, color: C.accent }}>{fmtN(inv.investimentoTotalMax)} &euro;</td>
                    </>
                  )}
                </tr>
              </tfoot>
            </table>

            {/* Barra visual */}
            <div style={{ marginBottom: '3mm' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2mm', fontSize: fs(6.5), color: C.cinzaMarca }}>
                <span>{fmtN(inv.investimentoTotalMin)}&euro;</span>
                <div style={{ flex: 1, height: '4mm', background: `linear-gradient(to right, #e8f5e9 0%, ${C.accentSoft} 40%, #fff3e0 100%)`, borderRadius: 2, position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '40%', top: '-1mm', bottom: '-1mm', width: '2px', background: C.accent }} />
                </div>
                <span>{fmtN(inv.investimentoTotalMax)}&euro;</span>
              </div>
              <p style={{ fontSize: fs(6), color: C.cinzaMarca, margin: '1mm 0 0 0', textAlign: 'center' }}>
                Intervalo de investimento total estimado (infraestruturas + honorarios{p.moradiaAddon ? ' + moradias' : ''} + construcao)
              </p>
            </div>

            {/* Duracao */}
            <p style={{ fontSize: fs(7.5), color: C.cinzaMarca, margin: '0 0 2mm 0' }}>
              Duracao estimada do empreendimento: <strong style={{ color: C.grafite }}>18-36 meses</strong> (licenciamento + construcao)
              {p.lotCenarioRecomendado && inv.porCenario && (
                <span style={{ marginLeft: '2mm' }}>* Cenario {p.lotCenarioRecomendado} recomendado para licenciamento.</span>
              )}
            </p>

            {/* Disclaimer */}
            <p style={{ fontSize: fs(6.5), color: C.cinzaMarca, margin: 0, fontStyle: 'italic', lineHeight: 1.4 }}>
              * Valores indicativos para planeamento financeiro do promotor. Custos de construcao baseados em valores de referencia chave na mao (habitacao unifamiliar). Nao inclui terreno, licencas camararias ou financiamento.
            </p>
          </div>
          );
        })()}

        {/* ESTIMATIVA DE INVESTIMENTO EM OBRA — Edificacao (nao-loteamento) */}
        {!p.isLoteamento && p.custosConstrucao && p.areaNum && p.areaNum > 0 && (() => {
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
          <div className="pdf-no-break" style={{ marginTop: '6mm', marginBottom: '6mm', padding: '4mm 5mm', background: C.offWhite, borderRadius: 3, border: `1px solid ${C.cinzaLinha}`, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
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
        {p.mostrarGuiaObra && !p.isLoteamento && p.tipologiaCategoria && (() => {
          const phases = getPhasesByCategory(p.tipologiaCategoria);
          const costs = p.tipologiaId ? getCostsByTypology(p.tipologiaId) : undefined;
          const estimates = p.tipologiaId && p.areaNum ? calculateConstructionEstimate(p.tipologiaId, p.areaNum) : null;
          
          if (!phases && !costs) return null;
          
          return (
            <div className="page-break-before" style={{ breakBefore: 'page', pageBreakBefore: 'always' }}>
              {/* Cabeçalho do Guia */}
              <div className="pdf-no-break" style={{ marginBottom: '5mm', padding: '3mm 4mm', background: C.accent, borderRadius: 3, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <p style={{ fontSize: fs(12), fontWeight: 700, color: C.onAccent, margin: 0, letterSpacing: '0.02em' }}>
                  {lang === 'en' ? 'CONSTRUCTION GUIDE' : 'GUIA DE CONSTRUÇÃO'}
                </p>
                <p style={{ fontSize: fs(9), color: C.onAccentMuted, margin: '1mm 0 0 0' }}>
                  {lang === 'en' ? 'Typical phases and estimated costs for' : 'Faseamento típico e custos estimados para'} {p.tipologia}
                </p>
              </div>

              {/* Estimativa de Custos de Construção */}
              {costs && (
                <div className="pdf-no-break" style={{ marginBottom: '5mm', padding: '4mm', background: C.accentSoft, borderRadius: 3, border: `2px solid ${C.accent}`, breakInside: 'avoid', pageBreakInside: 'avoid' }}>
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
                <div className="pdf-no-break" style={{ marginBottom: '5mm', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
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
          <div className="pdf-no-break" style={{ marginBottom: '6mm', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
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
              <div className="pdf-no-break" style={{ marginBottom: '4mm', padding: '2mm 3mm', background: C.offWhite, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: fs(8), breakInside: 'avoid', pageBreakInside: 'avoid' }}>
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
              <td style={{ textAlign: 'left', padding: 0, color: '#6b7280', fontSize: fs(8) }}>{p.ref} <span style={{ color: '#9ca3af' }}>•</span> {p.cliente}</td>
              <td style={{ textAlign: 'right', padding: 0, fontSize: fs(8) }}>
                <span style={{ fontWeight: 600, color: C.accent }}>{branding.appName.toUpperCase()}</span>
                <span style={{ color: '#9ca3af' }}> • </span>
                <span style={{ color: '#6b7280' }}>{branding.website || 'www.ferreira-arquitetos.pt'}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
