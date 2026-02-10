/**
 * Utilitário partilhado para geração de PDF de propostas.
 * Usa html2pdf.js (já instalado) para converter o ProposalDocument em PDF A4.
 * Adiciona rodapé com número de página e contactos em todas as páginas.
 */

const A4_WIDTH_PX = 794;

export interface PdfBranding {
  appName?: string;
  email?: string;
  telefone?: string;
  website?: string;
}

export interface GeneratePdfOptions {
  filename: string;
  reference?: string;
  branding?: PdfBranding;
  lang?: 'pt' | 'en';
  onProgress?: (msg: string) => void;
}

export async function generateProposalPdf(
  element: HTMLElement,
  options: GeneratePdfOptions,
): Promise<void> {
  const { filename, reference, branding, lang = 'pt', onProgress } = options;

  // Aguardar fontes
  onProgress?.('A preparar fontes...');
  try {
    await document.fonts.ready;
  } catch {
    /* ignore */
  }

  // Pequeno delay para garantir render completo
  await new Promise((r) => setTimeout(r, 150));

  onProgress?.('A gerar PDF...');

  const opt = {
    margin: [10, 12, 18, 12] as [number, number, number, number],
    filename,
    image: { type: 'jpeg' as const, quality: 0.95 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      width: A4_WIDTH_PX,
      windowWidth: A4_WIDTH_PX,
      scrollY: 0,
      scrollX: 0,
      backgroundColor: '#ffffff',
    },
    jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
    pagebreak: {
      mode: ['css', 'legacy'] as string[],
      avoid: ['.pdf-no-break', 'tr', 'thead', 'h1', 'h2', 'h3', 'li'],
    },
  };

  const html2pdf = (await import('html2pdf.js')).default;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdf: any = await html2pdf().set(opt).from(element).toPdf().get('pdf');
  const totalPages: number = pdf.internal.getNumberOfPages();
  const w: number = pdf.internal.pageSize.getWidth();
  const h: number = pdf.internal.pageSize.getHeight();

  onProgress?.('A adicionar rodapé...');

  // Textos do rodapé
  const footerLeft = branding?.appName || 'FA-360';
  const contactParts = [branding?.email, branding?.telefone, branding?.website].filter(Boolean);
  const footerRight = contactParts.join(' · ');
  const pageLabel = lang === 'en' ? 'Page' : 'Página';

  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);

    // Linha separadora
    pdf.setDrawColor(200);
    pdf.setLineWidth(0.3);
    pdf.line(12, h - 16, w - 12, h - 16);

    // Rodapé esquerdo (nome da empresa)
    pdf.setFontSize(7);
    pdf.setTextColor(120, 120, 120);
    pdf.text(footerLeft, 12, h - 12, { align: 'left' });

    // Rodapé centro (referência)
    if (reference) {
      pdf.setFontSize(7);
      pdf.setTextColor(150, 150, 150);
      pdf.text(reference, w / 2, h - 12, { align: 'center' });
    }

    // Rodapé direito (contactos)
    if (footerRight) {
      pdf.setFontSize(6.5);
      pdf.setTextColor(140, 140, 140);
      pdf.text(footerRight, w - 12, h - 12, { align: 'right' });
    }

    // Número da página (centrado, mais abaixo)
    pdf.setFontSize(7.5);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`${pageLabel} ${i} / ${totalPages}`, w / 2, h - 7, { align: 'center' });

    // Cabeçalho discreto nas páginas 2+ (nome + referência)
    if (i > 1) {
      pdf.setFontSize(6.5);
      pdf.setTextColor(180, 180, 180);
      const headerText = reference ? `${footerLeft} — ${reference}` : footerLeft;
      pdf.text(headerText, w - 12, 7, { align: 'right' });
    }
  }

  onProgress?.('A guardar ficheiro...');
  pdf.save(filename);
}
