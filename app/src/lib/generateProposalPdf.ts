/**
 * Utilitário partilhado para geração de PDF de propostas.
 * Usa html2pdf.js (já instalado) para converter o ProposalDocument em PDF A4.
 * Adiciona rodapé com número de página e contactos em todas as páginas.
 *
 * IMPORTANTE: Page breaks são calculados MANUALMENTE antes de chamar html2pdf.js
 * porque o mecanismo pagebreak.avoid do html2pdf.js não funciona de forma fiável.
 */

const A4_WIDTH_PX = 794;

// A4 dimensions in mm
const A4_HEIGHT_MM = 297;
const A4_WIDTH_MM = 210;
const MARGIN_TOP_MM = 10;
const MARGIN_BOTTOM_MM = 18;
const MARGIN_LEFT_MM = 12;
const MARGIN_RIGHT_MM = 12;

// Usable content area on each page (mm)
const CONTENT_WIDTH_MM = A4_WIDTH_MM - MARGIN_LEFT_MM - MARGIN_RIGHT_MM; // 186mm
const CONTENT_HEIGHT_MM = A4_HEIGHT_MM - MARGIN_TOP_MM - MARGIN_BOTTOM_MM; // 269mm

// Convert page content height to element pixels
// Our element is 794px wide, which maps to CONTENT_WIDTH_MM on the PDF page
const PX_PER_MM = A4_WIDTH_PX / CONTENT_WIDTH_MM; // ~4.269 px/mm
const PAGE_CONTENT_HEIGHT_PX = CONTENT_HEIGHT_MM * PX_PER_MM; // ~1148px per page

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

/**
 * Calcula e insere spacers antes de elementos que seriam cortados por page breaks.
 * Isto substitui o mecanismo pagebreak.avoid do html2pdf.js que não funciona.
 */
function insertManualPageBreaks(container: HTMLElement): void {
  // Selectors for elements that should NOT be split across pages
  const avoidSelectors = '.pdf-no-break, tr, thead, h1, h2, h3, li';
  const elements = container.querySelectorAll(avoidSelectors);

  // Get container's top offset to calculate relative positions
  const containerRect = container.getBoundingClientRect();
  const containerTop = containerRect.top;

  // Track inserted spacers' total height (as we insert spacers, positions shift)
  let totalSpacerHeight = 0;

  // Collect elements and their positions, sorted by top position
  const measured: { el: Element; top: number; bottom: number; height: number }[] = [];
  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const top = rect.top - containerTop;
    const height = rect.height;
    // Skip tiny elements (borders, separators) and elements taller than a page
    if (height < 8 || height > PAGE_CONTENT_HEIGHT_PX * 0.95) return;
    measured.push({ el, top, bottom: top + height, height });
  });

  // Sort by top position
  measured.sort((a, b) => a.top - b.top);

  // Process each element
  for (const item of measured) {
    const adjustedTop = item.top + totalSpacerHeight;
    const adjustedBottom = adjustedTop + item.height;

    // Which page does this element start on?
    const startPage = Math.floor(adjustedTop / PAGE_CONTENT_HEIGHT_PX);
    // Which page does this element end on?
    const endPage = Math.floor((adjustedBottom - 1) / PAGE_CONTENT_HEIGHT_PX);

    // If the element spans two pages, push it to the next page
    if (startPage !== endPage && item.height < PAGE_CONTENT_HEIGHT_PX * 0.95) {
      const nextPageTop = (startPage + 1) * PAGE_CONTENT_HEIGHT_PX;
      const spacerHeight = nextPageTop - adjustedTop + 2; // +2px safety margin

      // Insert spacer div before the element
      const spacer = document.createElement('div');
      spacer.style.cssText = `height:${spacerHeight}px;width:100%;flex-shrink:0;`;
      spacer.className = 'pdf-page-spacer';

      // For <tr> elements, we need to insert before the row's parent table if possible
      const target = item.el;
      if (target.tagName === 'TR') {
        // Check if this is the first row being cut — insert spacer before the table
        const table = target.closest('table');
        if (table && table.parentElement) {
          // Only add spacer if we haven't already added one right before this table
          const prev = table.previousElementSibling;
          if (!prev || !prev.classList.contains('pdf-page-spacer')) {
            table.parentElement.insertBefore(spacer, table);
            totalSpacerHeight += spacerHeight;
          }
        }
      } else {
        const parent = target.parentElement;
        if (parent) {
          parent.insertBefore(spacer, target as Node);
          totalSpacerHeight += spacerHeight;
        }
      }
    }
  }
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

  onProgress?.('A calcular quebras de página...');

  // MANUAL PAGE BREAK CALCULATION
  // O html2pdf.js pagebreak.avoid não funciona — fazemos nós próprios
  insertManualPageBreaks(element);

  // Reflow after inserting spacers
  void element.offsetHeight;
  await new Promise((r) => setTimeout(r, 100));

  onProgress?.('A gerar PDF...');

  const opt = {
    margin: [MARGIN_TOP_MM, MARGIN_RIGHT_MM, MARGIN_BOTTOM_MM, MARGIN_LEFT_MM] as [number, number, number, number],
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
    // pagebreak desactivado — usamos cálculo manual acima
    pagebreak: { mode: [] as string[], avoid: [] as string[] },
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
