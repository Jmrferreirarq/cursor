/**
 * Página para carregar propostas via link curto (/p/:shortId)
 * Obtém o payload da base de dados e redireciona para a página pública
 */

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { getProposalByShortId } from '../lib/supabase';
import { proposalPayloadSchema, encodeProposalPayload } from '../lib/proposalPayload';
import { PROPOSAL_PALETTE } from '../lib/proposalPalette';
import { t, type Lang } from '../locales';

const C = PROPOSAL_PALETTE;

function PropostaShortPage() {
  const { shortId } = useParams<{ shortId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlLang = searchParams.get('lang') as Lang | null;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const lang: Lang = urlLang === 'en' ? 'en' : 'pt';

  useEffect(() => {
    async function loadProposal() {
      if (!shortId) {
        setError('ID não fornecido');
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
        if (!proposal.payload) {
          console.error('Payload está vazio ou undefined');
          setError('Dados da proposta em falta');
          setLoading(false);
          return;
        }
        
        const validated = proposalPayloadSchema.safeParse(proposal.payload);
        
        if (!validated.success) {
          console.error('Payload inválido:', validated.error.issues.map(i => `${i.path.join('.')}: ${i.message}`));
          setError('Dados da proposta inválidos');
          setLoading(false);
          return;
        }
        
        // Redirecionar para a página pública com o payload codificado
        const encoded = encodeProposalPayload(validated.data);
        const targetLang = validated.data.lang || lang;
        navigate(`/public/proposta?d=${encoded}&lang=${targetLang}`, { replace: true });
      } catch (e) {
        console.error('Erro ao processar proposta:', e);
        setError('Erro ao processar proposta');
        setLoading(false);
      }
    }

    loadProposal();
  }, [shortId, navigate, lang]);

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
  if (error) {
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

  // Default: still loading (will redirect when done)
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: C.offWhite }}>
      <div className="text-center">
        <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" style={{ color: C.accent }} />
        <p style={{ color: C.cinzaMarca }}>A carregar proposta...</p>
      </div>
    </div>
  );
}

export default PropostaShortPage;
