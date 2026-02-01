import { useSearchParams } from 'react-router-dom';
import { decodeProposalPayload, formatCurrency } from '../lib/proposalPayload';
import { t, type Lang } from '../locales';

export default function PropostaPublicPage() {
  const [searchParams] = useSearchParams();
  const encoded = searchParams.get('d');
  const urlLang = searchParams.get('lang') as Lang | null;
  const p = encoded ? decodeProposalPayload(encoded) : null;
  const lang: Lang = urlLang === 'en' ? 'en' : (p?.lang ?? 'pt');

  if (!p) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold text-gray-800 mb-2">{t('proposalError.notFound', lang)}</h1>
          <p className="text-gray-600 text-sm">
            {t('proposalError.linkExpired', lang)}
          </p>
        </div>
      </div>
    );
  }

  const { branding } = p;

  return (
    <div
      className="bg-white text-gray-900"
      style={{
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
        maxWidth: '210mm',
        margin: '0 auto',
        padding: 0,
        fontSize: 10,
        lineHeight: 1.45,
      }}
    >
      {/* Cabeçalho */}
      <div style={{ background: '#1e3a5f', color: '#fff', padding: '6mm 18mm 5mm' }}>
        <p style={{ fontSize: 16, fontWeight: 700, margin: 0, letterSpacing: '0.02em' }}>{branding.appName}</p>
        {branding.appSlogan && (
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.85)', margin: '1.5mm 0 0 0' }}>{branding.appSlogan}</p>
        )}
      </div>

      <div style={{ padding: '0 18mm 18mm' }}>
        <div style={{ marginTop: '5mm', marginBottom: '4mm' }}>
          <h1 style={{ fontSize: 14, fontWeight: 700, margin: 0, letterSpacing: '-0.01em', color: '#1e3a5f' }}>
            {t('proposal.title', lang)}
          </h1>
          <p style={{ fontSize: 9, color: '#666', margin: '2mm 0 0 0' }}>
            {t('proposal.ref', lang)} {p.ref} · {p.data}
          </p>
        </div>

        {/* Apresentação (sempre presente) */}
        <div style={{ marginBottom: '5mm', padding: '4mm 5mm', background: '#f8fafb', borderRadius: 2, borderLeft: '3px solid #1e3a5f' }}>
          <p style={{ fontSize: 9, fontWeight: 600, margin: '0 0 3mm 0', color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('proposal.presentation', lang)}</p>
          {(p.apresentacao ?? t('longText.apresentacao', lang)).split('\n\n').map((par, i) => (
            <p key={i} style={{ fontSize: 9, color: '#495057', margin: '0 0 2.5mm 0', lineHeight: 1.55 }}>{par}</p>
          ))}
        </div>

        {/* Dados do projeto */}
        <div style={{ background: '#f8f9fa', borderRadius: 2, padding: '4mm 5mm', marginBottom: '5mm' }}>
          {p.cliente && <p style={{ margin: '0 0 1.5mm 0', fontSize: 11 }}><span style={{ color: '#666', fontWeight: 500 }}>{t('proposal.client', lang)}:</span> {p.cliente}</p>}
          {p.projeto && <p style={{ margin: '0 0 1.5mm 0', fontSize: 11 }}><span style={{ color: '#666', fontWeight: 500 }}>{t('proposal.project', lang)}:</span> {p.projeto}</p>}
          {p.local && <p style={{ margin: p.linkGoogleMaps ? '0 0 1.5mm 0' : 0, fontSize: 11 }}><span style={{ color: '#666', fontWeight: 500 }}>{t('proposal.local', lang)}:</span> {p.local}</p>}
          {p.linkGoogleMaps && (
            <p style={{ margin: 0, fontSize: 11 }}>
              <a href={p.linkGoogleMaps} target="_blank" rel="noopener noreferrer" style={{ color: '#1e3a5f', textDecoration: 'underline' }}>
                {t('proposal.viewOnGoogleMaps', lang)}
              </a>
            </p>
          )}
        </div>

        {/* Tabela de valores */}
        <div style={{ marginBottom: '5mm' }}>
          <p style={{ fontSize: 9, fontWeight: 600, color: '#495057', margin: '0 0 2mm 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('proposal.section1', lang)}</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
            <thead>
              <tr style={{ background: '#f1f3f5' }}>
                <th style={{ padding: '2.5mm 3mm', textAlign: 'left', fontWeight: 600, fontSize: 9, color: '#495057', borderBottom: '1px solid #dee2e6' }}>{t('proposal.concept', lang)}</th>
                <th style={{ padding: '2.5mm 3mm', textAlign: 'right', fontWeight: 600, fontSize: 9, color: '#495057', borderBottom: '1px solid #dee2e6' }}>{t('proposal.value', lang)}</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '2.5mm 3mm' }}>{t('proposal.mode', lang)}</td>
                <td style={{ textAlign: 'right', padding: '2.5mm 3mm' }}>{p.modo}</td>
              </tr>
              {p.tipologia && (
                <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '2.5mm 3mm' }}>{t('proposal.typology', lang)}</td>
                  <td style={{ textAlign: 'right', padding: '2.5mm 3mm' }}>{p.tipologia}</td>
                </tr>
              )}
              {p.complexidade && (
                <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '2.5mm 3mm' }}>{t('proposal.complexity', lang)}</td>
                  <td style={{ textAlign: 'right', padding: '2.5mm 3mm' }}>{p.complexidade}</td>
                </tr>
              )}
              {p.pisos != null && p.pisos > 0 && (
                <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '2.5mm 3mm' }}>{t('proposal.pisos', lang)}</td>
                  <td style={{ textAlign: 'right', padding: '2.5mm 3mm' }}>{p.pisos}{p.pisos >= 4 ? ' (+10%)' : p.pisos === 3 ? ' (+5%)' : ''}</td>
                </tr>
              )}
              <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '2.5mm 3mm' }}>{t('proposal.phases', lang)}</td>
                <td style={{ textAlign: 'right', padding: '2.5mm 3mm' }}>{p.fasesPct}%</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '2.5mm 3mm' }}>{t('proposal.location', lang)}</td>
                <td style={{ textAlign: 'right', padding: '2.5mm 3mm' }}>{p.localizacao}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '2.5mm 3mm' }}>{t('proposal.vat', lang)}</td>
                <td style={{ textAlign: 'right', padding: '2.5mm 3mm' }}>{p.iva}</td>
              </tr>
              {p.despesasReemb != null && p.despesasReemb > 0 && (
                <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '2.5mm 3mm' }}>{t('proposal.reimbursableExpenses', lang)}</td>
                  <td style={{ textAlign: 'right', padding: '2.5mm 3mm' }}>{formatCurrency(p.despesasReemb, lang)}</td>
                </tr>
              )}
              <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #dee2e6', fontWeight: 600 }}>
                <td style={{ padding: '3mm', color: '#1e3a5f' }}>{t('proposal.archFees', lang)}</td>
                <td style={{ textAlign: 'right', padding: '3mm', fontWeight: 600 }}>{formatCurrency(p.valorArq, lang)}</td>
              </tr>
              {p.especialidades.map((e) => (
                <tr key={e.nome} style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '2.5mm 3mm' }}>{e.nome}</td>
                  <td style={{ textAlign: 'right', padding: '2.5mm 3mm' }}>{formatCurrency(e.valor, lang)}</td>
                </tr>
              ))}
              {p.valorEsp > 0 && (
                <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #dee2e6', fontWeight: 600 }}>
                  <td style={{ padding: '3mm' }}>{t('proposal.specialtiesSubtotal', lang)}</td>
                  <td style={{ textAlign: 'right', padding: '3mm' }}>{formatCurrency(p.valorEsp, lang)}</td>
                </tr>
              )}
              {p.totalSemIVA != null && p.valorIVA != null ? (
                <>
                  <tr style={{ borderBottom: '1px solid #e9ecef', fontWeight: 600 }}>
                    <td style={{ padding: '3mm' }}>{t('proposal.totalExclVat', lang)}</td>
                    <td style={{ textAlign: 'right', padding: '3mm' }}>{formatCurrency(p.totalSemIVA, lang)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '3mm' }}>{t('proposal.vat', lang)} (23%)</td>
                    <td style={{ textAlign: 'right', padding: '3mm' }}>{formatCurrency(p.valorIVA, lang)}</td>
                  </tr>
                  <tr style={{ background: '#1e3a5f', color: '#fff', fontWeight: 700, fontSize: 12 }}>
                    <td style={{ padding: '4mm 3mm' }}>{t('proposal.totalInclVat', lang)}</td>
                    <td style={{ textAlign: 'right', padding: '4mm 3mm' }}>{formatCurrency(p.total, lang)}</td>
                  </tr>
                </>
              ) : (
                <tr style={{ background: '#1e3a5f', color: '#fff', fontWeight: 700, fontSize: 12 }}>
                  <td style={{ padding: '4mm 3mm' }}>{t('proposal.total', lang)}</td>
                  <td style={{ textAlign: 'right', padding: '4mm 3mm' }}>{formatCurrency(p.total, lang)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Fases de pagamento */}
        <div style={{ marginTop: '5mm', paddingTop: '4mm' }}>
          <p style={{ fontSize: 9, fontWeight: 600, color: '#495057', margin: '0 0 2mm 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('proposal.section2', lang)}</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9, marginBottom: '2mm' }}>
            <thead>
              <tr style={{ background: '#f1f3f5' }}>
                <th style={{ padding: '2mm 3mm', textAlign: 'left', fontWeight: 600, fontSize: 8, color: '#495057', borderBottom: '1px solid #dee2e6' }}>{t('proposal.phase', lang)}</th>
                <th style={{ padding: '2mm 3mm', textAlign: 'right', fontWeight: 600, fontSize: 8, color: '#495057', borderBottom: '1px solid #dee2e6' }}>%</th>
                <th style={{ padding: '2mm 3mm', textAlign: 'right', fontWeight: 600, fontSize: 8, color: '#495057', borderBottom: '1px solid #dee2e6' }}>{t('proposal.value', lang)}</th>
              </tr>
            </thead>
            <tbody>
              {p.fasesPagamento.map((f) => {
                const destaque = f.nome.startsWith('Pormenores');
                return (
                  <tr
                    key={f.nome}
                    style={{
                      borderBottom: '1px solid #e9ecef',
                      ...(destaque ? { background: 'rgba(30, 58, 95, 0.04)' } : {}),
                    }}
                  >
                    <td style={{ padding: '2mm 3mm', fontWeight: destaque ? 600 : 400, color: destaque ? '#1e3a5f' : undefined }}>{f.nome}</td>
                    <td style={{ textAlign: 'right', padding: '2mm 3mm', fontWeight: destaque ? 600 : 400 }}>{f.pct}%</td>
                    <td style={{ textAlign: 'right', padding: '2mm 3mm', fontWeight: destaque ? 600 : 400 }}>{formatCurrency(f.valor)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p style={{ fontSize: 8, color: '#6c757d', fontStyle: 'italic', margin: 0 }}>{t('proposal.paymentPhasesNote', lang)}</p>
        </div>

        {/* Descrição das fases */}
        <div style={{ marginTop: '5mm', paddingTop: '4mm' }}>
          <p style={{ fontSize: 9, fontWeight: 600, color: '#495057', margin: '0 0 5mm 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('proposal.section3', lang)}</p>
          {p.notaBim && (
            <div style={{ padding: '3mm 4mm', background: 'rgba(30, 58, 95, 0.04)', borderRadius: 2, marginBottom: '4mm', borderLeft: '3px solid #1e3a5f' }}>
              <p style={{ fontSize: 9, fontWeight: 600, margin: 0, color: '#1e3a5f' }}>{t('proposal.bimMethodology', lang)}</p>
              <p style={{ fontSize: 8, color: '#495057', margin: '1.5mm 0 0 0', lineHeight: 1.5 }}>{p.notaBim}</p>
            </div>
          )}
          <div style={{ padding: '4mm 0', borderBottom: '1px solid #e9ecef' }}>
            <p style={{ fontSize: 9, fontWeight: 600, margin: '0 0 4mm 0', color: '#1e3a5f' }}>{t('proposal.architectureProject', lang)}</p>
            {p.descricaoFases.map((f) => (
              <div key={f.nome} style={{ marginBottom: '5mm' }}>
                <p style={{ fontSize: 9, fontWeight: 600, margin: '0 0 1.5mm 0', color: '#212529' }}>• {f.nome} ({f.pct}%)</p>
                {f.descricao && <p style={{ fontSize: 8, color: '#6c757d', margin: 0, lineHeight: 1.5 }}>{f.descricao}</p>}
              </div>
            ))}
          </div>
          {p.especialidadesDescricoes.length > 0 && (
            <div style={{ padding: '5mm 0', borderBottom: '1px solid #e9ecef' }}>
              <p style={{ fontSize: 9, fontWeight: 600, margin: '0 0 4mm 0', color: '#1e3a5f' }}>{t('proposal.specialtiesProject', lang)}</p>
              {p.especialidadesDescricoes.map((e) => (
                <div key={e.nome} style={{ marginBottom: '5mm' }}>
                  <p style={{ fontSize: 9, fontWeight: 600, margin: '0 0 1.5mm 0', color: '#212529' }}>• {e.nome}</p>
                  {e.descricao && <p style={{ fontSize: 8, color: '#6c757d', margin: 0, lineHeight: 1.5 }}>{e.descricao}</p>}
                </div>
              ))}
            </div>
          )}
          {(p.extrasComDescricao ?? []).length > 0 && (
            <div style={{ padding: '5mm 4mm', background: '#f8fafb', borderRadius: 2, marginTop: '2mm' }}>
              <p style={{ fontSize: 9, fontWeight: 600, margin: '0 0 4mm 0', color: '#1e3a5f' }}>{t('proposal.extrasInfo', lang)}</p>
              {(p.extrasComDescricao ?? []).map((e) => {
                const id = (e as { id?: string }).id;
                const isFormulaExtra = id === 'projeto_execucao_completo' || id === 'orcamentacao';
                return (
                  <div
                    key={e.nome}
                    style={{
                      marginBottom: '5mm',
                      ...(isFormulaExtra
                        ? { borderLeft: '3px solid #1e3a5f', background: 'rgba(30, 58, 95, 0.06)', padding: '3mm 4mm', borderRadius: '0 2px 2px 0' }
                        : {}),
                    }}
                  >
                    <p style={{ fontSize: 9, fontWeight: isFormulaExtra ? 700 : 600, margin: '0 0 1.5mm 0', color: isFormulaExtra ? '#1e3a5f' : '#212529' }}>
                      • {e.nome}{e.ocultarValor ? '' : (e as { sobConsultaPrevia?: boolean }).sobConsultaPrevia ? ` — ${t('proposal.sobConsultaPrevia', lang)}` : e.sobConsulta ? ` — ${t('proposal.availableOnRequest', lang)}` : ` — ${formatCurrency(e.valor, lang)}`}
                    </p>
                    {e.formula && <p style={{ fontSize: 8, color: '#495057', margin: '0 0 1.5mm 0', fontStyle: 'italic' }}>{e.formula}</p>}
                    {e.descricao && <p style={{ fontSize: 8, color: isFormulaExtra ? '#495057' : '#6c757d', margin: 0, lineHeight: 1.5 }}>{e.descricao}</p>}
                  </div>
                );
              })}
              <p style={{ fontSize: 8, color: '#6c757d', margin: 0, fontStyle: 'italic', lineHeight: 1.45 }}>{t('proposal.extrasNote', lang)}</p>
            </div>
          )}
        </div>

        {/* Estimativa de execução */}
        {(p.duracaoEstimada ?? []).length > 0 && (
          <div style={{ marginTop: '5mm', paddingTop: '4mm' }}>
            <p style={{ fontSize: 9, fontWeight: 600, color: '#495057', margin: '0 0 2mm 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('proposal.section4', lang)}</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9, marginBottom: '2mm' }}>
              <thead>
                <tr style={{ background: '#f1f3f5' }}>
                  <th style={{ padding: '2mm 3mm', textAlign: 'left', fontWeight: 600, fontSize: 8, color: '#495057', borderBottom: '1px solid #dee2e6' }}>{t('proposal.phase', lang)}</th>
                  <th style={{ padding: '2mm 3mm', textAlign: 'right', fontWeight: 600, fontSize: 8, color: '#495057', borderBottom: '1px solid #dee2e6' }}>{t('proposal.estimatedDuration', lang)}</th>
                </tr>
              </thead>
              <tbody>
                {(p.duracaoEstimada ?? []).map((d) => (
                  <tr key={d.nome} style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '2mm 3mm' }}>{d.nome}</td>
                    <td style={{ textAlign: 'right', padding: '2mm 3mm' }}>{d.duracao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: 8, color: '#6c757d', fontStyle: 'italic', margin: 0 }}>{t('proposal.durationNote', lang)}</p>
          </div>
        )}

        {/* Exclusões */}
        {p.exclusoes.length > 0 && (
          <div style={{ marginTop: '5mm', paddingTop: '4mm' }}>
            <p style={{ fontSize: 9, fontWeight: 600, color: '#495057', margin: '0 0 2mm 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('proposal.section5', lang)}</p>
            <ul style={{ margin: 0, paddingLeft: '5mm', fontSize: 9, color: '#495057', lineHeight: 1.6, listStyleType: 'disc' }}>
              {p.exclusoes.map((label) => (
                <li key={label} style={{ pageBreakInside: 'avoid' }}>{label}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Notas */}
        <div style={{ marginTop: '5mm', paddingTop: '4mm', fontSize: 9, color: '#495057' }}>
          <p style={{ fontSize: 9, fontWeight: 600, color: '#495057', margin: '0 0 2mm 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('proposal.section6', lang)}</p>
          <ul style={{ margin: 0, paddingLeft: '5mm', lineHeight: 1.6, listStyleType: 'disc' }}>
            {p.notas.map((n) => (
              <li key={n} style={{ pageBreakInside: 'avoid' }}>{n}</li>
            ))}
          </ul>
        </div>

        {/* Assinaturas */}
        {(branding.architectName || p.cliente) && (
          <div style={{ marginTop: '6mm', paddingTop: '5mm', display: 'flex', justifyContent: 'space-between', gap: '12mm', fontSize: 9, borderTop: '1px solid #dee2e6' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, margin: '0 0 1mm 0', color: '#1e3a5f', fontSize: 9 }}>{t('proposal.responsible', lang)}</p>
              {branding.architectName && (
                <p style={{ margin: 0, color: '#495057' }}>
                  {branding.architectName}{branding.architectOasrn ? ` — n.º ${branding.architectOasrn} OASRN` : ''}
                </p>
              )}
              <div style={{ marginTop: '5mm', borderBottom: '1.5px solid #1e3a5f', width: '45mm', height: '6mm' }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, margin: '0 0 1mm 0', color: '#1e3a5f', fontSize: 9 }}>{t('proposal.client', lang)}</p>
              {p.cliente && <p style={{ margin: 0, color: '#495057' }}>{p.cliente}</p>}
              <div style={{ marginTop: '5mm', borderBottom: '1.5px solid #1e3a5f', width: '45mm', height: '6mm' }} />
            </div>
          </div>
        )}

        <p style={{ fontSize: 8, color: '#6c757d', margin: '5mm 0 0 0', fontStyle: 'italic' }}>
          {t('proposal.disclaimer', lang)}
        </p>
      </div>
    </div>
  );
}
