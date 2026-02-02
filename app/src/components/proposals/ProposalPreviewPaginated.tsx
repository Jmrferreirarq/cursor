/**
 * Previsualização da proposta em formato A4 contínuo.
 * Documento único com linhas de quebra de página a cada 297mm — sem cortes no meio do conteúdo.
 */
import { forwardRef } from 'react';
import { ProposalDocument } from './ProposalDocument';
import type { ProposalPayload } from '../../lib/proposalPayload';
import type { Lang } from '../../lib/proposalPayload';

export interface ProposalPreviewPaginatedProps {
  payload: ProposalPayload | null;
  lang: Lang;
}

export const ProposalPreviewPaginated = forwardRef<HTMLDivElement, ProposalPreviewPaginatedProps>(
  function ProposalPreviewPaginated({ payload, lang }, ref) {
  if (!payload) return null;

  return (
    <div
      ref={ref}
      className="flex-shrink-0 shadow-lg rounded-sm overflow-visible bg-white relative"
      style={{
        width: '210mm',
        minWidth: '210mm',
        boxSizing: 'border-box',
        backgroundImage: `repeating-linear-gradient(
          to bottom,
          transparent 0,
          transparent calc(297mm - 2px),
          rgba(0,0,0,0.12) calc(297mm - 2px),
          rgba(0,0,0,0.12) 297mm
        )`,
        backgroundPosition: '0 0',
        backgroundRepeat: 'repeat-y',
      }}
    >
      <ProposalDocument payload={payload} lang={lang} />
    </div>
  );
});
