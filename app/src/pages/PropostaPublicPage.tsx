import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
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
  const pdfRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const exportPDF = async () => {
    if (!pdfRef.current || !p) return;
    setExporting(true);
    try {
      await document.fonts.ready;
    } catch {
      /* ignore */
    }
    const baseName = `orcamento-${(p.ref || 'proposta').replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}`;
    const opt = {
      margin: [20, 20, 20, 20] as [number, number, number, number],
      filename: `${baseName}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.95 },
      html2canvas: { scale: 1.5, useCORS: true, logging: false },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'], avoid: ['li', 'tr', '.pdf-no-break'] },
    };
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const pageOfFormat = t('proposalPageOf', lang);
      const pdf = await html2pdf().set(opt).from(pdfRef.current).toPdf().get('pdf');
      const total = pdf.internal.getNumberOfPages();
      const w = pdf.internal.pageSize.getWidth();
      const h = pdf.internal.pageSize.getHeight();
      for (let i = 1; i <= total; i++) {
        pdf.setPage(i);
        pdf.setFontSize(9);
        pdf.setTextColor(89);
        const label = pageOfFormat.replace('{page}', String(i)).replace('{total}', String(total));
        pdf.text(label, w / 2, h - 12, { align: 'center' });
      }
      pdf.save(opt.filename);
      toast.success('PDF guardado');
    } catch (e) {
      toast.error('Erro ao gerar PDF');
    } finally {
      setExporting(false);
    }
  };

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
        onClick={exportPDF}
        disabled={exporting}
        className="no-print fixed top-4 right-4 z-50 px-4 py-2 text-white text-sm font-medium rounded-lg shadow-md hover:opacity-90 transition-opacity disabled:opacity-70"
        style={{ backgroundColor: PROPOSAL_PALETTE.accent }}
      >
        {exporting ? t('proposalSaving', lang) : t('proposalPrint', lang)}
      </button>
      <div className="print-proposal-center flex justify-center px-4" style={{ paddingTop: 24, paddingBottom: 24 }}>
        <div
          ref={pdfRef}
          className="bg-white text-black rounded-lg overflow-hidden"
          style={{ width: '210mm', maxWidth: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
        >
          <ProposalDocument payload={p} lang={lang} />
        </div>
      </div>
    </div>
  );
}

export default PropostaPublicPage;
