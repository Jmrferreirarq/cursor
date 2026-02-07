/**
 * PDF Text Extractor — Uses pdfjs-dist to extract text from PDF files in the browser.
 */

import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker from CDN (avoids bundling the worker)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export interface PDFExtractionResult {
  text: string;
  pages: number;
  fileName: string;
  sizeKB: number;
}

/**
 * Extract text content from a PDF file.
 */
export async function extractTextFromPDF(file: File): Promise<PDFExtractionResult> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const textParts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (pageText) {
      textParts.push(`--- Página ${i} ---\n${pageText}`);
    }
  }

  return {
    text: textParts.join('\n\n'),
    pages: pdf.numPages,
    fileName: file.name,
    sizeKB: Math.round(file.size / 1024),
  };
}

/**
 * Read an image file as base64 data URL.
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Check if a file is a supported type.
 */
export function getFileType(file: File): 'pdf' | 'image' | 'unsupported' {
  if (file.type === 'application/pdf') return 'pdf';
  if (file.type.startsWith('image/')) return 'image';
  return 'unsupported';
}
