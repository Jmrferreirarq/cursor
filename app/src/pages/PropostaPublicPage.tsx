import { useSearchParams } from 'react-router-dom';
import { decodeProposalPayload, formatCurrency } from '../lib/proposalPayload';

export default function PropostaPublicPage() {
  const [searchParams] = useSearchParams();
  const encoded = searchParams.get('d');
  const p = encoded ? decodeProposalPayload(encoded) : null;

  if (!p) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold text-gray-800 mb-2">Proposta não encontrada</h1>
          <p className="text-gray-600 text-sm">
            O link pode estar incompleto ou expirado. Solicite um novo envio ao seu arquiteto.
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
            Orçamento de Honorários
          </h1>
          <p style={{ fontSize: 9, color: '#666', margin: '2mm 0 0 0' }}>
            Ref. {p.ref} · {p.data}
          </p>
        </div>

        {/* Dados do projeto */}
        <div style={{ background: '#f8f9fa', borderRadius: 2, padding: '4mm 5mm', marginBottom: '5mm' }}>
          {p.cliente && <p style={{ margin: '0 0 1.5mm 0', fontSize: 11 }}><span style={{ color: '#666', fontWeight: 500 }}>Cliente:</span> {p.cliente}</p>}
          {p.projeto && <p style={{ margin: '0 0 1.5mm 0', fontSize: 11 }}><span style={{ color: '#666', fontWeight: 500 }}>Projeto:</span> {p.projeto}</p>}
          {p.local && <p style={{ margin: p.linkGoogleMaps ? '0 0 1.5mm 0' : 0, fontSize: 11 }}><span style={{ color: '#666', fontWeight: 500 }}>Local:</span> {p.local}</p>}
          {p.linkGoogleMaps && (
            <p style={{ margin: 0, fontSize: 11 }}>
              <a href={p.linkGoogleMaps} target="_blank" rel="noopener noreferrer" style={{ color: '#1e3a5f', textDecoration: 'underline' }}>
                Ver localização no Google Maps
              </a>
            </p>
          )}
        </div>

        {/* Tabela de valores */}
        <div style={{ marginBottom: '5mm' }}>
          <p style={{ fontSize: 9, fontWeight: 600, color: '#495057', margin: '0 0 2mm 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>1. Parâmetros e valores</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
            <thead>
              <tr style={{ background: '#f1f3f5' }}>
                <th style={{ padding: '2.5mm 3mm', textAlign: 'left', fontWeight: 600, fontSize: 9, color: '#495057', borderBottom: '1px solid #dee2e6' }}>Conceito</th>
                <th style={{ padding: '2.5mm 3mm', textAlign: 'right', fontWeight: 600, fontSize: 9, color: '#495057', borderBottom: '1px solid #dee2e6' }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '2.5mm 3mm' }}>Modo</td>
                <td style={{ textAlign: 'right', padding: '2.5mm 3mm' }}>{p.modo}</td>
              </tr>
              {p.tipologia && (
                <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '2.5mm 3mm' }}>Tipologia</td>
                  <td style={{ textAlign: 'right', padding: '2.5mm 3mm' }}>{p.tipologia}</td>
                </tr>
              )}
              {p.complexidade && (
                <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '2.5mm 3mm' }}>Complexidade</td>
                  <td style={{ textAlign: 'right', padding: '2.5mm 3mm' }}>{p.complexidade}</td>
                </tr>
              )}
              <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '2.5mm 3mm' }}>Fases</td>
                <td style={{ textAlign: 'right', padding: '2.5mm 3mm' }}>{p.fasesPct}%</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '2.5mm 3mm' }}>Localização</td>
                <td style={{ textAlign: 'right', padding: '2.5mm 3mm' }}>{p.localizacao}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '2.5mm 3mm' }}>IVA</td>
                <td style={{ textAlign: 'right', padding: '2.5mm 3mm' }}>{p.iva}</td>
              </tr>
              {p.despesasReemb != null && p.despesasReemb > 0 && (
                <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '2.5mm 3mm' }}>Despesas reembolsáveis</td>
                  <td style={{ textAlign: 'right', padding: '2.5mm 3mm' }}>{formatCurrency(p.despesasReemb)}</td>
                </tr>
              )}
              <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #dee2e6', fontWeight: 600 }}>
                <td style={{ padding: '3mm', color: '#1e3a5f' }}>Honorários de arquitetura</td>
                <td style={{ textAlign: 'right', padding: '3mm', fontWeight: 600 }}>{formatCurrency(p.valorArq)}</td>
              </tr>
              {p.especialidades.map((e) => (
                <tr key={e.nome} style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '2.5mm 3mm' }}>{e.nome}</td>
                  <td style={{ textAlign: 'right', padding: '2.5mm 3mm' }}>{formatCurrency(e.valor)}</td>
                </tr>
              ))}
              {p.valorEsp > 0 && (
                <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #dee2e6', fontWeight: 600 }}>
                  <td style={{ padding: '3mm' }}>Especialidades (subtotal)</td>
                  <td style={{ textAlign: 'right', padding: '3mm' }}>{formatCurrency(p.valorEsp)}</td>
                </tr>
              )}
              {p.incluirOrcamentacao && p.orcamentacao != null && p.orcamentacao > 0 && (
                <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #dee2e6', fontWeight: 600 }}>
                  <td style={{ padding: '3mm' }}>Orçamentação e medição</td>
                  <td style={{ textAlign: 'right', padding: '3mm' }}>{formatCurrency(p.orcamentacao)}</td>
                </tr>
              )}
              {p.totalSemIVA != null && p.valorIVA != null ? (
                <>
                  <tr style={{ borderBottom: '1px solid #e9ecef', fontWeight: 600 }}>
                    <td style={{ padding: '3mm' }}>Total (sem IVA)</td>
                    <td style={{ textAlign: 'right', padding: '3mm' }}>{formatCurrency(p.totalSemIVA)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '3mm' }}>IVA (23%)</td>
                    <td style={{ textAlign: 'right', padding: '3mm' }}>{formatCurrency(p.valorIVA)}</td>
                  </tr>
                  <tr style={{ background: '#1e3a5f', color: '#fff', fontWeight: 700, fontSize: 12 }}>
                    <td style={{ padding: '4mm 3mm' }}>Total (com IVA)</td>
                    <td style={{ textAlign: 'right', padding: '4mm 3mm' }}>{formatCurrency(p.total)}</td>
                  </tr>
                </>
              ) : (
                <tr style={{ background: '#1e3a5f', color: '#fff', fontWeight: 700, fontSize: 12 }}>
                  <td style={{ padding: '4mm 3mm' }}>Total</td>
                  <td style={{ textAlign: 'right', padding: '4mm 3mm' }}>{formatCurrency(p.total)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Fases de pagamento */}
        <div style={{ marginTop: '5mm', paddingTop: '4mm' }}>
          <p style={{ fontSize: 9, fontWeight: 600, color: '#495057', margin: '0 0 2mm 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>2. Fases de pagamento</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 9, marginBottom: '2mm' }}>
            <thead>
              <tr style={{ background: '#f1f3f5' }}>
                <th style={{ padding: '2mm 3mm', textAlign: 'left', fontWeight: 600, fontSize: 8, color: '#495057', borderBottom: '1px solid #dee2e6' }}>Fase</th>
                <th style={{ padding: '2mm 3mm', textAlign: 'right', fontWeight: 600, fontSize: 8, color: '#495057', borderBottom: '1px solid #dee2e6' }}>%</th>
                <th style={{ padding: '2mm 3mm', textAlign: 'right', fontWeight: 600, fontSize: 8, color: '#495057', borderBottom: '1px solid #dee2e6' }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {p.fasesPagamento.map((f) => (
                <tr key={f.nome} style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '2mm 3mm' }}>{f.nome}</td>
                  <td style={{ textAlign: 'right', padding: '2mm 3mm' }}>{f.pct}%</td>
                  <td style={{ textAlign: 'right', padding: '2mm 3mm' }}>{formatCurrency(f.valor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: 8, color: '#6c757d', fontStyle: 'italic', margin: 0 }}>As fases de pagamento estão associadas a entregas concretas de projeto.</p>
        </div>

        {/* Descrição das fases */}
        <div style={{ marginTop: '5mm', paddingTop: '4mm' }}>
          <p style={{ fontSize: 9, fontWeight: 600, color: '#495057', margin: '0 0 3mm 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>3. Descrição das fases</p>
          <p style={{ fontSize: 9, fontWeight: 600, margin: '0 0 2mm 0', color: '#1e3a5f' }}>Projeto de Arquitetura</p>
          {p.descricaoFases.map((f) => (
            <div key={f.nome} style={{ marginBottom: '3mm' }}>
              <p style={{ fontSize: 9, fontWeight: 600, margin: '0 0 1mm 0', color: '#212529' }}>• {f.nome} ({f.pct}%)</p>
              {f.descricao && <p style={{ fontSize: 8, color: '#6c757d', margin: 0, lineHeight: 1.45 }}>{f.descricao}</p>}
            </div>
          ))}
          {p.especialidadesDescricoes.length > 0 && (
            <>
              <p style={{ fontSize: 9, fontWeight: 600, margin: '4mm 0 2mm 0', color: '#1e3a5f' }}>Projeto de Especialidades</p>
              {p.especialidadesDescricoes.map((e) => (
                <div key={e.nome} style={{ marginBottom: '3mm' }}>
                  <p style={{ fontSize: 9, fontWeight: 600, margin: '0 0 1mm 0', color: '#212529' }}>• {e.nome}</p>
                  {e.descricao && <p style={{ fontSize: 8, color: '#6c757d', margin: 0, lineHeight: 1.45 }}>{e.descricao}</p>}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Exclusões */}
        {p.exclusoes.length > 0 && (
          <div style={{ marginTop: '5mm', paddingTop: '4mm' }}>
            <p style={{ fontSize: 9, fontWeight: 600, color: '#495057', margin: '0 0 2mm 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>4. Exclusões (não incluídas)</p>
            <ul style={{ margin: 0, paddingLeft: '5mm', fontSize: 9, color: '#495057', lineHeight: 1.6, listStyleType: 'disc' }}>
              {p.exclusoes.map((label) => (
                <li key={label} style={{ pageBreakInside: 'avoid' }}>{label}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Notas */}
        <div style={{ marginTop: '5mm', paddingTop: '4mm', fontSize: 9, color: '#495057' }}>
          <p style={{ fontSize: 9, fontWeight: 600, color: '#495057', margin: '0 0 2mm 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>5. Notas contratuais</p>
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
              <p style={{ fontWeight: 600, margin: '0 0 1mm 0', color: '#1e3a5f', fontSize: 9 }}>Técnico responsável</p>
              {branding.architectName && (
                <p style={{ margin: 0, color: '#495057' }}>
                  {branding.architectName}{branding.architectOasrn ? ` — n.º ${branding.architectOasrn} OASRN` : ''}
                </p>
              )}
              <div style={{ marginTop: '5mm', borderBottom: '1.5px solid #1e3a5f', width: '45mm', height: '6mm' }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, margin: '0 0 1mm 0', color: '#1e3a5f', fontSize: 9 }}>Cliente</p>
              {p.cliente && <p style={{ margin: 0, color: '#495057' }}>{p.cliente}</p>}
              <div style={{ marginTop: '5mm', borderBottom: '1.5px solid #1e3a5f', width: '45mm', height: '6mm' }} />
            </div>
          </div>
        )}

        <p style={{ fontSize: 8, color: '#6c757d', margin: '5mm 0 0 0', fontStyle: 'italic' }}>
          Referência orientativa. Valores sujeitos a confirmação. Tabelas OA não são vinculativas.
        </p>
      </div>
    </div>
  );
}
