/**
 * Página para carregar propostas via link curto (/p/:shortId)
 * Obtém o payload da base de dados e renderiza a proposta
 */

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { FileText, Loader2, AlertCircle } from 'lucide-react';
import { getProposalByShortId, isSupabaseConfigured } from '../lib/supabase';
import { proposalPayloadSchema, type ProposalPayload } from '../lib/proposalPayload';
import { PROPOSAL_PALETTE } from '../lib/proposalPalette';
import { t, type Lang } from '../locales';
import { ProposalDocument } from '../components/proposals/ProposalDocument';

const C = PROPOSAL_PALETTE;

function PropostaShortPage() {
  const { shortId } = useParams<{ shortId: string }>();
  const [searchParams] = useSearchParams();
  const urlLang = searchParams.get('lang') as Lang | null;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<ProposalPayload | null>(null);
  
  const lang: Lang = urlLang === 'en' ? 'en' : (payload?.lang ?? 'pt');

  useEffect(() => {
    async function loadProposal() {
      if (!shortId) {
        setError('ID não fornecido');
        setLoading(false);
        return;
      }

      if (!isSupabaseConfigured()) {
        setError('Sistema não configurado');
        setLoading(false);
        return;
      }

      const { proposal, error: fetchError } = await getProposalByShortId(shortId);
      
      if (fetchError || !proposal) {
        setError(fetchError || 'Proposta não encontrada');
        setLoading(false);
        return;
      }

      try {
        // O payload já vem parseado da API
        const validated = proposalPayloadSchema.safeParse(proposal.payload);
        
        if (!validated.success) {
          console.error('Payload inválido:', validated.error);
          setError('Dados da proposta inválidos');
          setLoading(false);
          return;
        }
        
        setPayload(validated.data);
      } catch (e) {
        console.error('Erro ao processar proposta:', e);
        setError('Erro ao processar proposta');
      }
      
      setLoading(false);
    }

    loadProposal();
  }, [shortId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: C.offWhite }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" style={{ color: C.accent }} />
          <p style={{ color: C.cinzaMarca }}>A carregar proposta...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !payload) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: C.offWhite }}>
        <div className="max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#fee2e2' }}>
            <AlertCircle className="w-8 h-8" style={{ color: '#dc2626' }} />
          </div>
          <h1 className="text-2xl font-bold mb-3" style={{ color: C.grafite }}>
            {t('proposalError.notFound', lang)}
          </h1>
          <p className="text-base" style={{ color: C.cinzaMarca }}>
            {error || t('proposalError.linkExpired', lang)}
          </p>
        </div>
      </div>
    );
  }

  // Render proposal - redirect to full page with payload
  // For now, render inline with ProposalDocument
  return (
    <div className="min-h-screen" style={{ backgroundColor: C.offWhite }}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl" style={{ backgroundColor: 'rgba(246, 245, 242, 0.9)', borderBottom: `1px solid ${C.cinzaLinha}` }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: C.accent }}>
              <span className="text-sm font-bold" style={{ color: C.onAccent }}>FA</span>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: C.grafite }}>{payload.branding?.appName || 'Proposta'}</p>
              <p className="text-xs" style={{ color: C.cinzaMarca }}>{payload.ref}</p>
            </div>
          </div>
          
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            style={{ backgroundColor: C.accent, color: C.onAccent }}
          >
            Exportar PDF
          </button>
        </div>
      </header>

      {/* Proposal Document */}
      <div className="py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center">
            <div
              className="bg-white text-black rounded-xl overflow-hidden shadow-2xl"
              style={{ 
                width: '210mm', 
                maxWidth: '100%', 
                minHeight: '297mm', 
                boxSizing: 'border-box'
              }}
            >
              <ProposalDocument payload={payload} lang={lang} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 text-center" style={{ backgroundColor: C.accent }}>
        <p className="text-sm" style={{ color: C.onAccent }}>{payload.branding?.appName}</p>
        {payload.branding?.website && (
          <p className="text-xs mt-1" style={{ color: C.onAccentMuted }}>{payload.branding.website}</p>
        )}
      </footer>
    </div>
  );
}

export default PropostaShortPage;
