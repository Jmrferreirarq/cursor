import { useSearchParams } from 'react-router-dom';
import { decodeProposalPayload } from '../lib/proposalPayload';
import { PROPOSAL_PALETTE } from '../lib/proposalPalette';
import { t, type Lang } from '../locales';
import { ProposalDocument } from '../components/proposals/ProposalDocument';

function PropostaPublicPage() {
  const [searchParams] = useSearchParams();
  const encoded = searchParams.get('d');
  const urlLang = searchParams.get('lang') as Lang | null;
  const p = encoded ? decodeProposalPayload(encoded) : null;
  const lang: Lang = urlLang === 'en' ? 'en' : (p?.lang ?? 'pt');

  if (!p) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: PROPOSAL_PALETTE.offWhite }}>
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold text-gray-800 mb-2">{t('proposalError.notFound', lang)}</h1>
          <p className="text-gray-600 text-sm">
            {t('proposalError.linkExpired', lang)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="print-proposal relative min-h-screen" style={{ backgroundColor: PROPOSAL_PALETTE.offWhite }}>
      <button
        type="button"
        onClick={() => window.print()}
        className="no-print fixed top-4 right-4 z-50 px-4 py-2 text-white text-sm font-medium rounded-lg shadow-md hover:opacity-90 transition-opacity print:hidden"
        style={{ backgroundColor: PROPOSAL_PALETTE.accent }}
      >
        {t('proposalPrint', lang)}
      </button>
      <div className="print-proposal-center flex justify-center px-4" style={{ paddingTop: 24, paddingBottom: 24 }}>
        <ProposalDocument payload={p} lang={lang} style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }} />
      </div>
    </div>
  );
}

export default PropostaPublicPage;
