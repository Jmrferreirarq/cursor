/**
 * Paleta de cores da proposta (PDF e HTML).
 * Neutros + acento azul petróleo.
 */
export const PROPOSAL_PALETTE = {
  /** Texto principal */
  grafite: '#1F2328',
  /** Labels, secundário */
  cinzaMarca: '#58595B',
  /** Linhas, bordas de tabelas */
  cinzaLinha: '#D6D7D9',
  /** Fundo off-white (áreas premium) */
  offWhite: '#F6F5F2',
  /** Branco puro */
  white: '#FFFFFF',
  /** Acento principal (azul petróleo) */
  accent: '#1F4E5F',
  /** Acento com opacidade para fundos suaves */
  accentSoft: 'rgba(31, 78, 95, 0.06)',
  accentSoft2: 'rgba(31, 78, 95, 0.04)',
  /** Texto branco sobre acento */
  onAccent: '#FFFFFF',
  onAccentMuted: 'rgba(255, 255, 255, 0.9)',
} as const;
