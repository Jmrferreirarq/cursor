// HybridSheetA4.tsx - Template A4 Híbrido para Pormenores Construtivos
// Formato: A4 Paisagem (297×210mm) | Axonometria como protagonista
// Estilo: Visual elegante + Rigor técnico

import React from 'react';

interface HybridSheetA4Props {
  reference: string;
  title: string;
  subtitle?: string;
  scale: string;
  date?: string;
  revision?: string;
  sectionContent: React.ReactNode;
  planContent: React.ReactNode;
  legend?: { num: number; title: string; desc: string }[];
  specs?: { label: string; value: string }[];
}

export const HybridSheetA4: React.FC<HybridSheetA4Props> = ({
  reference,
  title,
  subtitle,
  scale,
  date = 'Fev 2025',
  revision = 'A',
  sectionContent,
  planContent,
  legend = [],
  specs = [],
}) => {
  return (
    <svg
      viewBox="0 0 297 210"
      className="w-full h-full"
      style={{ aspectRatio: '297/210' }}
    >
      {/* ===== DEFINIÇÕES AVANÇADAS ===== */}
      <defs>
        {/* === Gradiente de fundo (efeito sketch sutil) === */}
        <radialGradient id="bg-gradient" cx="40%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="70%" stopColor="#fafaf8"/>
          <stop offset="100%" stopColor="#f0efe8"/>
        </radialGradient>
        
        {/* === Sombra elegante === */}
        <filter id="shadow-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1.5" stdDeviation="2" floodColor="#000" floodOpacity="0.12"/>
        </filter>
        
        <filter id="shadow-medium" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1.5" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.18"/>
        </filter>
        
        {/* === Efeito sketch nas bordas === */}
        <filter id="sketch-edge" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        
        {/* === Máscara de vinheta === */}
        <radialGradient id="vignette" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="white"/>
          <stop offset="80%" stopColor="white"/>
          <stop offset="100%" stopColor="#f5f4f0"/>
        </radialGradient>
        
        {/* === Padrões de materiais (maior contraste) === */}
        
        {/* Betão/Laje - hachura diagonal com agregados */}
        <pattern id="h-pc" patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill="#c8c8c8"/>
          <line x1="0" y1="8" x2="8" y2="0" stroke="#888" strokeWidth=".5"/>
          <line x1="-2" y1="6" x2="6" y2="-2" stroke="#888" strokeWidth=".5"/>
          <line x1="2" y1="10" x2="10" y2="2" stroke="#888" strokeWidth=".5"/>
          <circle cx="2" cy="5" r="1" fill="#a0a0a0"/>
          <circle cx="6" cy="2" r=".7" fill="#aaa"/>
        </pattern>
        
        {/* Gesso cartonado - linhas horizontais finas */}
        <pattern id="h-pg" patternUnits="userSpaceOnUse" width="6" height="4">
          <rect width="6" height="4" fill="#f0ece4"/>
          <line x1="0" y1="2" x2="6" y2="2" stroke="#d5d0c5" strokeWidth=".3"/>
        </pattern>
        
        {/* Aço/Metal - sólido azul-cinza */}
        <pattern id="h-ps" patternUnits="userSpaceOnUse" width="4" height="4">
          <rect width="4" height="4" fill="#7a8a9a"/>
        </pattern>
        
        {/* Isolamento/Lã mineral - ondas distintivas */}
        <pattern id="h-pi" patternUnits="userSpaceOnUse" width="10" height="6">
          <rect width="10" height="6" fill="#fff8d0"/>
          <path d="M0,3 Q2.5,0 5,3 T10,3" stroke="#d4b040" fill="none" strokeWidth=".6"/>
          <path d="M0,5 Q2.5,2 5,5 T10,5" stroke="#d4b040" fill="none" strokeWidth=".4" opacity=".6"/>
        </pattern>
        
        {/* Madeira/MDF - veios verticais */}
        <pattern id="h-pw" patternUnits="userSpaceOnUse" width="5" height="10">
          <rect width="5" height="10" fill="#c8956a"/>
          <path d="M1,0 Q1.3,5 1,10" stroke="#a87550" fill="none" strokeWidth=".4"/>
          <path d="M3.5,0 Q3.2,5 3.5,10" stroke="#a87550" fill="none" strokeWidth=".3"/>
        </pattern>
        
        {/* Cerâmico/Pavimento - quadrículas */}
        <pattern id="h-pk" patternUnits="userSpaceOnUse" width="10" height="10">
          <rect width="10" height="10" fill="#e8e0d8"/>
          <rect x=".5" y=".5" width="9" height="9" fill="#f8f4f0"/>
          <line x1="0" y1="0" x2="10" y2="0" stroke="#c0b8b0" strokeWidth=".3"/>
          <line x1="0" y1="0" x2="0" y2="10" stroke="#c0b8b0" strokeWidth=".3"/>
        </pattern>
        
        {/* Betonilha/Argamassa - ponteado mais denso */}
        <pattern id="h-pm" patternUnits="userSpaceOnUse" width="4" height="4">
          <rect width="4" height="4" fill="#d8d4cc"/>
          <circle cx="1" cy="1" r=".4" fill="#b8b0a8"/>
          <circle cx="3" cy="3" r=".35" fill="#b8b0a8"/>
          <circle cx="1" cy="3" r=".25" fill="#c0b8b0"/>
          <circle cx="3" cy="1" r=".25" fill="#c0b8b0"/>
        </pattern>
        
        {/* Banda resiliente - diagonal mais visível */}
        <pattern id="h-pr" patternUnits="userSpaceOnUse" width="4" height="4">
          <rect width="4" height="4" fill="#a89060"/>
          <line x1="0" y1="4" x2="4" y2="0" stroke="#887040" strokeWidth=".6"/>
          <line x1="-1" y1="3" x2="3" y2="-1" stroke="#887040" strokeWidth=".4"/>
        </pattern>
        
        {/* === Marker para linhas de chamada === */}
        <marker id="dot-marker" markerWidth="6" markerHeight="6" refX="3" refY="3">
          <circle cx="3" cy="3" r="1.5" fill="#333"/>
        </marker>
        
        <marker id="arrow-small" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#333"/>
        </marker>
      </defs>

      {/* ===== FUNDO COM GRADIENTE ===== */}
      <rect x="0" y="0" width="297" height="210" fill="url(#bg-gradient)"/>
      
      {/* ===== MOLDURA EXTERIOR ELEGANTE ===== */}
      <rect x="4" y="4" width="289" height="202" fill="none" stroke="#ccc" strokeWidth=".2"/>
      <rect x="5" y="5" width="287" height="200" fill="none" stroke="#1a1a1a" strokeWidth=".4"/>

      {/* ===== TÍTULO SUPERIOR (elegante) ===== */}
      <g transform="translate(10, 12)">
        <text x="0" y="0" fill="#1a1a1a" fontSize="6" fontWeight="300" fontFamily="Arial" letterSpacing="3">
          {reference}
        </text>
        <line x1="0" y1="3" x2="30" y2="3" stroke="#1a1a1a" strokeWidth=".5"/>
        <text x="0" y="10" fill="#333" fontSize="4" fontWeight="600" fontFamily="Arial">
          {title}
        </text>
        <text x="0" y="16" fill="#666" fontSize="2.5" fontFamily="Arial">
          {subtitle || 'Pormenor construtivo tipo'}
        </text>
      </g>
      
      {/* ===== VISTA PRINCIPAL: CORTE ===== */}
      <g transform="translate(10, 28)">
        <rect x="0" y="0" width="145" height="125" fill="#fff" rx="1" filter="url(#shadow-soft)"/>
        <text x="72.5" y="-3" fill="#333" fontSize="3" fontWeight="600" fontFamily="Arial" textAnchor="middle" letterSpacing="1">
          CORTE A-A'
        </text>
        <text x="72.5" y="122" fill="#666" fontSize="2" fontFamily="Arial" textAnchor="middle">
          Escala {scale}
        </text>
        <g transform="translate(5, 5)">
          {sectionContent}
        </g>
      </g>

      {/* ===== VISTA: PLANTA ===== */}
      <g transform="translate(165, 28)">
        <rect x="0" y="0" width="122" height="85" fill="#fff" rx="1" filter="url(#shadow-soft)"/>
        <text x="61" y="-3" fill="#333" fontSize="3" fontWeight="600" fontFamily="Arial" textAnchor="middle" letterSpacing="1">
          PLANTA
        </text>
        <text x="61" y="82" fill="#666" fontSize="2" fontFamily="Arial" textAnchor="middle">
          Escala {scale}
        </text>
        <g transform="translate(5, 5)">
          {planContent}
        </g>
      </g>

      {/* ===== ESPECIFICAÇÕES (lado direito inferior) ===== */}
      <g transform="translate(165, 118)">
        <rect x="0" y="0" width="122" height="35" fill="#fff" rx="1" filter="url(#shadow-soft)"/>
        <text x="5" y="6" fill="#1a1a1a" fontSize="2.2" fontWeight="700" fontFamily="Arial" letterSpacing="0.5">
          ESPECIFICAÇÕES
        </text>
        <line x1="5" y1="8" x2="40" y2="8" stroke="#1a1a1a" strokeWidth=".3"/>
        <g transform="translate(5, 11)">
          {specs.slice(0, 5).map((spec, i) => (
            <g key={i} transform={`translate(0, ${i * 4.5})`}>
              <text x="0" y="3" fill="#555" fontSize="2" fontFamily="Arial">{spec.label}</text>
              <text x="117" y="3" fill="#1a1a1a" fontSize="2.2" fontWeight="600" fontFamily="Arial" textAnchor="end">
                {spec.value}
              </text>
            </g>
          ))}
        </g>
      </g>

      {/* ===== LEGENDA (parte inferior esquerda - 2 colunas) ===== */}
      <g transform="translate(10, 157)">
        <rect x="0" y="0" width="145" height="40" fill="#fff" rx="1" filter="url(#shadow-soft)"/>
        
        <text x="5" y="6" fill="#1a1a1a" fontSize="2.5" fontWeight="700" fontFamily="Arial" letterSpacing="0.5">
          LEGENDA
        </text>
        <line x1="5" y1="8" x2="25" y2="8" stroke="#1a1a1a" strokeWidth=".3"/>
        
        {/* Items da legenda em 2 colunas equilibradas */}
        <g transform="translate(5, 12)">
          {legend.slice(0, 10).map((item, i) => {
            const col = i < 5 ? 0 : 1;
            const row = i % 5;
            return (
              <g key={i} transform={`translate(${col * 72}, ${row * 5.2})`}>
                <circle cx="2.5" cy="2" r="2.2" fill="#fff" stroke="#333" strokeWidth=".35"/>
                <text x="2.5" y="2.8" fill="#333" fontSize="2" fontWeight="600" textAnchor="middle" fontFamily="Arial">
                  {item.num}
                </text>
                <text x="7" y="2.8" fill="#333" fontSize="2.1" fontFamily="Arial">
                  {item.title}
                </text>
              </g>
            );
          })}
        </g>
      </g>

      {/* ===== NOTAS E ESCALA (inferior direita) ===== */}
      <g transform="translate(165, 157)">
        <rect x="0" y="0" width="122" height="40" fill="#fff" rx="1" filter="url(#shadow-soft)"/>
        
        <text x="5" y="6" fill="#1a1a1a" fontSize="2.2" fontWeight="700" fontFamily="Arial" letterSpacing="0.5">
          NOTAS
        </text>
        <line x1="5" y1="8" x2="20" y2="8" stroke="#1a1a1a" strokeWidth=".3"/>
        
        <g transform="translate(5, 12)">
          <text x="0" y="3" fill="#555" fontSize="1.8" fontFamily="Arial">• Dimensões em milímetros</text>
          <text x="0" y="8" fill="#555" fontSize="1.8" fontFamily="Arial">• Cotas a verificar em obra</text>
          <text x="0" y="13" fill="#555" fontSize="1.8" fontFamily="Arial">• Escala gráfica de referência</text>
        </g>
        
        {/* Escala gráfica */}
        <g transform="translate(5, 30)">
          <rect x="0" y="0" width="30" height="3" fill="#1a1a1a"/>
          <rect x="0" y="0" width="10" height="3" fill="#fff"/>
          <rect x="20" y="0" width="10" height="3" fill="#fff"/>
          <rect x="0" y="0" width="30" height="3" fill="none" stroke="#1a1a1a" strokeWidth=".2"/>
          <line x1="10" y1="0" x2="10" y2="3" stroke="#1a1a1a" strokeWidth=".15"/>
          <line x1="20" y1="0" x2="20" y2="3" stroke="#1a1a1a" strokeWidth=".15"/>
          <text x="0" y="7" fill="#333" fontSize="1.5" fontFamily="Arial">0</text>
          <text x="15" y="7" fill="#333" fontSize="1.5" fontFamily="Arial" textAnchor="middle">25</text>
          <text x="30" y="7" fill="#333" fontSize="1.5" fontFamily="Arial" textAnchor="end">50mm</text>
          <text x="50" y="3" fill="#666" fontSize="1.8" fontFamily="Arial">Esc. {scale}</text>
        </g>
      </g>

      {/* ===== CARIMBO MINIMALISTA ===== */}
      <g transform="translate(5, 201)">
        <rect x="0" y="0" width="287" height="4" fill="#1a1a1a"/>
        <text x="3" y="2.8" fill="#fff" fontSize="2.5" fontWeight="700" fontFamily="Arial">FA-360</text>
        <text x="25" y="2.8" fill="#aaa" fontSize="1.8" fontFamily="Arial">Arquitectura</text>
        <text x="143.5" y="2.8" fill="#fff" fontSize="1.8" fontFamily="Arial" textAnchor="middle">
          {reference} — {title}
        </text>
        <text x="230" y="2.8" fill="#888" fontSize="1.6" fontFamily="Arial">
          {date} | Rev. {revision}
        </text>
        <text x="284" y="2.8" fill="#fff" fontSize="2" fontWeight="600" fontFamily="Arial" textAnchor="end">A4</text>
      </g>
    </svg>
  );
};

export default HybridSheetA4;
