/**
 * Página para propostas via link curto (/p/:shortId)
 * Mostra página personalizada ou 404 elegante
 */

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, FileText, MapPin, Phone, Mail, MessageCircle, ArrowRight } from 'lucide-react';
import { getProposalByShortId } from '../lib/supabase';
import { proposalPayloadSchema, savePayloadLocally, type ProposalPayload } from '../lib/proposalPayload';
import { PROPOSAL_PALETTE } from '../lib/proposalPalette';
import { t, type Lang } from '../locales';

const C = PROPOSAL_PALETTE;

function formatCurrency(value: number, lang: Lang) {
  return new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
}

function ProposalPersonalizedView({ payload, shortId }: { payload: ProposalPayload; shortId: string }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lang: Lang = (searchParams.get('lang') as Lang) === 'en' ? 'en' : (payload.lang || 'pt');

  useEffect(() => {
    const localId = savePayloadLocally(payload);
    (window as unknown as { _proposalLocalId?: string })._proposalLocalId = localId;
  }, [payload]);

  const viewFullProposal = () => {
    const localId = (window as unknown as { _proposalLocalId?: string })._proposalLocalId;
    if (localId) navigate(`/cotacao?lid=${localId}&lang=${lang}`);
    else {
      const id = savePayloadLocally(payload);
      navigate(`/cotacao?lid=${id}&lang=${lang}`);
    }
  };

  useEffect(() => {
    document.title = `Proposta ${payload.ref} — ${payload.branding?.appName || 'FERREIRARQUITETOS'}`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', `Proposta para ${payload.cliente} — ${payload.projeto}`);
  }, [payload]);

  return (
    <div className="min-h-screen bg-background" style={{ backgroundColor: C.offWhite }}>
      <header className="border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: C.accent }}>
              <span className="text-sm font-bold text-white">FA</span>
            </div>
            <span className="font-semibold" style={{ color: C.grafite }}>
              {payload.branding?.appName || 'FERREIRARQUITETOS'}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Greeting */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: C.grafite }}>
              Olá {payload.cliente?.split(' ')[0] || 'Cliente'}
            </h1>
            <p className="text-muted-foreground">
              A sua proposta está pronta. Segue um resumo.
            </p>
          </div>

          {/* Summary card */}
          <div
            className="p-6 rounded-2xl border"
            style={{ backgroundColor: C.white, borderColor: C.cinzaLinha, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5" style={{ color: C.accent }} />
              <span className="font-semibold" style={{ color: C.grafite }}>{payload.projeto || 'Proposta'}</span>
            </div>
            <p className="text-sm mb-4" style={{ color: C.cinzaMarca }}>
              {t('proposal.ref', lang)} {payload.ref} · {payload.data}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: C.cinzaMarca }}>Tipo</p>
                <p className="font-medium" style={{ color: C.grafite }}>{payload.modo}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: C.cinzaMarca }}>Valor estimado</p>
                <p className="font-bold text-lg" style={{ color: C.accent }}>{formatCurrency(payload.total, lang)}</p>
              </div>
              {payload.local && (
                <div className="sm:col-span-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: C.accent }} />
                  <span className="text-sm" style={{ color: C.cinzaMarca }}>{payload.local}</span>
                </div>
              )}
            </div>

            {/* Gallery placeholder */}
            <div
              className="aspect-video rounded-xl mb-6 flex items-center justify-center"
              style={{ backgroundColor: `${C.accent}10` }}
            >
              <span className="text-6xl font-light select-none" style={{ color: `${C.accent}30` }}>
                {payload.projeto?.charAt(0) || 'P'}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={viewFullProposal}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors"
                style={{ backgroundColor: C.accent, color: C.onAccent }}
              >
                <FileText className="w-5 h-5" />
                Ver Proposta Completa
              </button>
              <a
                href={`mailto:${payload.branding?.email || 'contacto@fa360.pt'}?subject=Proposta ${payload.ref} - Pedido de Revisão`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium border transition-colors"
                style={{ borderColor: C.cinzaLinha, color: C.grafite }}
              >
                <MessageCircle className="w-5 h-5" />
                Pedir Revisão
              </a>
              <a
                href={`tel:${payload.branding?.telefone?.replace(/\s/g, '') || '351910662814'}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium border transition-colors"
                style={{ borderColor: C.cinzaLinha, color: C.grafite }}
              >
                <Phone className="w-5 h-5" />
                Falar com o Arquitecto
              </a>
            </div>
          </div>

          {/* Contact info */}
          <div className="p-6 rounded-xl border" style={{ backgroundColor: C.white, borderColor: C.cinzaLinha }}>
            <h3 className="font-semibold mb-3" style={{ color: C.grafite }}>Contactos</h3>
            <div className="space-y-2 text-sm" style={{ color: C.cinzaMarca }}>
              {payload.branding?.morada && (
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0" />
                  {payload.branding.morada}
                </p>
              )}
              {payload.branding?.telefone && (
                <a href={`tel:${payload.branding.telefone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:underline">
                  <Phone className="w-4 h-4 shrink-0" />
                  {payload.branding.telefone}
                </a>
              )}
              {payload.branding?.email && (
                <a href={`mailto:${payload.branding.email}`} className="flex items-center gap-2 hover:underline">
                  <Mail className="w-4 h-4 shrink-0" />
                  {payload.branding.email}
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function NotFoundView({ onContact }: { onContact: () => void }) {
  const lang: Lang = 'pt';
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: C.offWhite }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md text-center"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#fee2e2' }}>
          <AlertCircle className="w-8 h-8" style={{ color: '#dc2626' }} />
        </div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: C.grafite }}>
          {t('proposalError.notFound', lang)}
        </h1>
        <p className="text-base mb-8" style={{ color: C.cinzaMarca }}>
          Esta proposta não foi encontrada ou já expirou.
        </p>
        <button
          onClick={onContact}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium"
          style={{ backgroundColor: C.accent, color: C.onAccent }}
        >
          Contacte-nos
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}

export default function PropostaShortPage() {
  const { shortId } = useParams<{ shortId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlLang = searchParams.get('lang') as Lang | null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<ProposalPayload | null>(null);

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
          setError('Dados da proposta em falta');
          setLoading(false);
          return;
        }

        const validated = proposalPayloadSchema.safeParse(proposal.payload);

        if (!validated.success) {
          setError('Dados da proposta inválidos');
          setLoading(false);
          return;
        }

        setPayload(validated.data);
      } catch (e) {
        console.error('Erro ao processar proposta:', e);
        setError('Erro ao processar proposta');
      } finally {
        setLoading(false);
      }
    }

    loadProposal();
  }, [shortId]);

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

  if (error && !payload) {
    return <NotFoundView onContact={() => navigate('/cotacao')} />;
  }

  if (payload && shortId) {
    return <ProposalPersonalizedView payload={payload} shortId={shortId} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: C.offWhite }}>
      <Loader2 className="w-12 h-12 animate-spin" style={{ color: C.accent }} />
    </div>
  );
}
