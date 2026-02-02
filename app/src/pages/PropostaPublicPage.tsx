import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { decodeProposalPayload } from '../lib/proposalPayload';
import { PROPOSAL_PALETTE } from '../lib/proposalPalette';
import { t, type Lang } from '../locales';
import { ProposalDocument } from '../components/proposals/ProposalDocument';

/** 210mm em px @ 96dpi para captura A4 independente do viewport */
const A4_WIDTH_PX = 794;

function PropostaPublicPage() {
  const [searchParams] = useSearchParams();
  const encoded = searchParams.get('d');
  const urlLang = searchParams.get('lang') as Lang | null;
  const p = encoded ? decodeProposalPayload(encoded) : null;
  const lang: Lang = urlLang === 'en' ? 'en' : (p?.lang ?? 'pt');
  const pdfRef = useRef<HTMLDivElement>(null);
  const captureRef = useRef<HTMLDivElement | null>(null);
  const [exporting, setExporting] = useState(false);
  const [capturing, setCapturing] = useState(false);

  const exportPDF = async () => {
    if (!p) return;
    setExporting(true);
    try {
      await document.fonts.ready;
    } catch {
      /* ignore */
    }
    setCapturing(true);
    await new Promise((r) => setTimeout(r, 100));
    const el = captureRef.current || pdfRef.current;
    if (!el) {
      setCapturing(false);
      setExporting(false);
      return;
    }
    const baseName = `orcamento-${(p.ref || 'proposta').replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}`;
    const opt = {
      margin: [25, 25, 25, 25] as [number, number, number, number],
      filename: `${baseName}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.95 },
      html2canvas: { scale: 1.5, useCORS: true, logging: false, width: A4_WIDTH_PX },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'], avoid: ['li', 'tr', '.pdf-no-break'] },
    };
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const pageOfFormat = t('proposalPageOf', lang);
      const pdf = await html2pdf().set(opt).from(el).toPdf().get('pdf');
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
      setCapturing(false);
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

  const captureEl = capturing && p && createPortal(
    <div
      ref={(r) => { captureRef.current = r; }}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: A4_WIDTH_PX,
        minWidth: A4_WIDTH_PX,
        overflow: 'hidden',
        backgroundColor: '#fff',
        zIndex: -1,
      }}
    >
      <ProposalDocument payload={p} lang={lang} />
    </div>,
    document.body
  );

  return (
    <div className="print-proposal relative min-h-screen" style={{ backgroundColor: PROPOSAL_PALETTE.offWhite }}>
      {captureEl}
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
          style={{ width: '210mm', maxWidth: '210mm', minWidth: '210mm', minHeight: '297mm', boxSizing: 'border-box', flexShrink: 0 }}
        >
          <ProposalDocument payload={p} lang={lang} />
        </div>
      </div>
    </div>
  );
}

export default PropostaPublicPage;
