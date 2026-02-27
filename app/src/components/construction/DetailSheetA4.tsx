// DetailSheetA4.tsx - Template A4 para Pormenores Construtivos
// Formato: A4 Paisagem (297×210mm) | Escala variável

import React from 'react';

interface DetailSheetA4Props {
  reference: string;        // FA—A.01
  title: string;            // Base de Parede — Zona Seca
  subtitle?: string;        // Corte vertical — Encontro com pavimento
  scale: string;            // 1:5
  date?: string;            // Fev 2025
  revision?: string;        // A
  children: React.ReactNode; // Conteúdo (vistas)
  legend?: { num: number; title: string; desc: string }[];
  specs?: { label: string; value: string }[];
}

export const DetailSheetA4: React.FC<DetailSheetA4Props> = ({
  reference,
  title,
  subtitle,
  scale,
  date = 'Fev 2025',
  revision = 'A',
  children,
  legend = [],
  specs = [],
}) => {
  return (
    <svg
      viewBox="0 0 297 210"
      className="w-full h-full bg-white"
      style={{ aspectRatio: '297/210' }}
    >
      {/* ===== DEFINIÇÕES ===== */}
      <defs>
        {/* Padrões de materiais */}
        <pattern id="s-pc" patternUnits="userSpaceOnUse" width="4" height="4">
          <rect width="4" height="4" fill="#d0d0d0"/>
          <line x1="0" y1="4" x2="4" y2="0" stroke="#999" strokeWidth=".15"/>
          <circle cx="1" cy="1" r=".3" fill="#a0a0a0"/>
        </pattern>
        <pattern id="s-pg" patternUnits="userSpaceOnUse" width="6" height="6">
          <rect width="6" height="6" fill="#f5f3ef"/>
          <line x1="0" y1="3" x2="6" y2="3" stroke="#e8e6e0" strokeWidth=".1"/>
        </pattern>
        <pattern id="s-ps" patternUnits="userSpaceOnUse" width="3" height="3">
          <rect width="3" height="3" fill="#8c9aa8"/>
        </pattern>
        <pattern id="s-pi" patternUnits="userSpaceOnUse" width="5" height="3">
          <rect width="5" height="3" fill="#fff8dc"/>
          <path d="M0,1.5 Q1.25,0.5 2.5,1.5 T5,1.5" stroke="#e0c860" fill="none" strokeWidth=".3"/>
        </pattern>
        <pattern id="s-pw" patternUnits="userSpaceOnUse" width="4" height="8">
          <rect width="4" height="8" fill="#d4a574"/>
          <path d="M1,0 Q1.2,4 1,8" stroke="#c49464" fill="none" strokeWidth=".2"/>
          <path d="M3,0 Q2.8,4 3,8" stroke="#c49464" fill="none" strokeWidth=".15"/>
        </pattern>
        <pattern id="s-pk" patternUnits="userSpaceOnUse" width="5" height="5">
          <rect width="5" height="5" fill="#c8c0b8"/>
          <rect x=".2" y=".2" width="4.6" height="4.6" fill="#f0ece4"/>
        </pattern>
        <pattern id="s-pm" patternUnits="userSpaceOnUse" width="2" height="2">
          <rect width="2" height="2" fill="#e0dcd0"/>
          <circle cx=".5" cy=".5" r=".15" fill="#c0b8a8"/>
          <circle cx="1.5" cy="1.5" r=".12" fill="#c0b8a8"/>
        </pattern>
        <pattern id="s-pr" patternUnits="userSpaceOnUse" width="2" height="2">
          <rect width="2" height="2" fill="#b8a888"/>
          <line x1="0" y1="2" x2="2" y2="0" stroke="#988868" strokeWidth=".2"/>
        </pattern>
      </defs>

      {/* ===== MARGEM E MOLDURA ===== */}
      <rect x="5" y="5" width="287" height="200" fill="none" stroke="#000" strokeWidth=".3"/>
      
      {/* ===== CABEÇALHO ===== */}
      <rect x="5" y="5" width="287" height="12" fill="#f8f8f8" stroke="#000" strokeWidth=".2"/>
      <text x="10" y="12.5" fill="#000" fontSize="4" fontWeight="700" fontFamily="Arial">
        PORMENORES CONSTRUTIVOS FA
      </text>
      <text x="150" y="12.5" fill="#000" fontSize="3.5" fontFamily="Arial">
        {title}
      </text>
      <text x="280" y="12.5" fill="#000" fontSize="4" fontWeight="700" fontFamily="Arial" textAnchor="end">
        {reference}
      </text>

      {/* ===== ÁREA DE DESENHO ===== */}
      <rect x="5" y="17" width="210" height="168" fill="#fff" stroke="#000" strokeWidth=".1"/>
      
      {/* Conteúdo das vistas */}
      <g transform="translate(5, 17)">
        {children}
      </g>

      {/* ===== PAINEL LATERAL - LEGENDA ===== */}
      <rect x="215" y="17" width="77" height="100" fill="#fff" stroke="#000" strokeWidth=".2"/>
      <rect x="215" y="17" width="77" height="6" fill="#f0f0f0" stroke="#000" strokeWidth=".1"/>
      <text x="253.5" y="21.5" fill="#000" fontSize="2.8" fontWeight="600" fontFamily="Arial" textAnchor="middle">
        LEGENDA
      </text>
      
      {/* Items da legenda */}
      <g transform="translate(217, 25)">
        {legend.slice(0, 12).map((item, i) => (
          <g key={i} transform={`translate(0, ${i * 7.5})`}>
            <circle cx="3" cy="2.5" r="2.5" fill="#fff" stroke="#000" strokeWidth=".3"/>
            <text x="3" y="3.5" fill="#000" fontSize="2" fontWeight="600" textAnchor="middle" fontFamily="Arial">
              {item.num}
            </text>
            <text x="8" y="2" fill="#000" fontSize="2" fontWeight="600" fontFamily="Arial">
              {item.title.length > 20 ? item.title.substring(0, 20) + '...' : item.title}
            </text>
            <text x="8" y="5" fill="#666" fontSize="1.8" fontFamily="Arial">
              {item.desc.length > 25 ? item.desc.substring(0, 25) + '...' : item.desc}
            </text>
          </g>
        ))}
      </g>

      {/* ===== PAINEL LATERAL - ESPECIFICAÇÕES ===== */}
      <rect x="215" y="117" width="77" height="50" fill="#fff" stroke="#000" strokeWidth=".2"/>
      <rect x="215" y="117" width="77" height="6" fill="#f0f0f0" stroke="#000" strokeWidth=".1"/>
      <text x="253.5" y="121.5" fill="#000" fontSize="2.8" fontWeight="600" fontFamily="Arial" textAnchor="middle">
        ESPECIFICAÇÕES
      </text>
      
      <g transform="translate(217, 125)">
        {specs.slice(0, 5).map((spec, i) => (
          <g key={i} transform={`translate(0, ${i * 7})`}>
            <text x="0" y="3" fill="#000" fontSize="2" fontFamily="Arial">{spec.label}</text>
            <text x="73" y="3" fill="#000" fontSize="2.2" fontWeight="600" fontFamily="Arial" textAnchor="end">
              {spec.value}
            </text>
          </g>
        ))}
      </g>

      {/* ===== PAINEL LATERAL - NOTAS ===== */}
      <rect x="215" y="167" width="77" height="18" fill="#fff" stroke="#000" strokeWidth=".2"/>
      <rect x="215" y="167" width="77" height="5" fill="#f0f0f0" stroke="#000" strokeWidth=".1"/>
      <text x="253.5" y="170.8" fill="#000" fontSize="2.5" fontWeight="600" fontFamily="Arial" textAnchor="middle">
        NOTAS
      </text>
      <text x="217" y="177" fill="#666" fontSize="1.6" fontFamily="Arial">
        Dimensões em milímetros.
      </text>
      <text x="217" y="180" fill="#666" fontSize="1.6" fontFamily="Arial">
        Cotas verificar em obra.
      </text>
      <text x="217" y="183" fill="#666" fontSize="1.6" fontFamily="Arial">
        Escala gráfica de referência.
      </text>

      {/* ===== CARIMBO (RODAPÉ) ===== */}
      <rect x="5" y="185" width="287" height="20" fill="#fff" stroke="#000" strokeWidth=".3"/>
      
      {/* Logo/Nome */}
      <rect x="5" y="185" width="45" height="20" fill="#1a1a1a"/>
      <text x="27.5" y="193" fill="#fff" fontSize="5" fontWeight="700" fontFamily="Arial" textAnchor="middle">
        FA-360
      </text>
      <text x="27.5" y="200" fill="#999" fontSize="2.5" fontFamily="Arial" textAnchor="middle">
        Arquitectura
      </text>

      {/* Título */}
      <rect x="50" y="185" width="80" height="20" fill="none" stroke="#000" strokeWidth=".1"/>
      <text x="90" y="192" fill="#000" fontSize="2.8" fontWeight="600" fontFamily="Arial" textAnchor="middle">
        {title}
      </text>
      <text x="90" y="198" fill="#666" fontSize="2.2" fontFamily="Arial" textAnchor="middle">
        {subtitle || 'Pormenor construtivo'}
      </text>

      {/* Escala */}
      <rect x="130" y="185" width="30" height="20" fill="none" stroke="#000" strokeWidth=".1"/>
      <text x="145" y="192" fill="#666" fontSize="2" fontFamily="Arial" textAnchor="middle">ESCALA</text>
      <text x="145" y="199" fill="#000" fontSize="4" fontWeight="700" fontFamily="Arial" textAnchor="middle">
        {scale}
      </text>

      {/* Data */}
      <rect x="160" y="185" width="30" height="20" fill="none" stroke="#000" strokeWidth=".1"/>
      <text x="175" y="192" fill="#666" fontSize="2" fontFamily="Arial" textAnchor="middle">DATA</text>
      <text x="175" y="199" fill="#000" fontSize="3" fontFamily="Arial" textAnchor="middle">{date}</text>

      {/* Revisão */}
      <rect x="190" y="185" width="20" height="20" fill="none" stroke="#000" strokeWidth=".1"/>
      <text x="200" y="192" fill="#666" fontSize="2" fontFamily="Arial" textAnchor="middle">REV</text>
      <text x="200" y="199" fill="#000" fontSize="4" fontWeight="700" fontFamily="Arial" textAnchor="middle">
        {revision}
      </text>

      {/* Desenho nº */}
      <rect x="210" y="185" width="40" height="20" fill="none" stroke="#000" strokeWidth=".1"/>
      <text x="230" y="192" fill="#666" fontSize="2" fontFamily="Arial" textAnchor="middle">DESENHO</text>
      <text x="230" y="199" fill="#000" fontSize="3.5" fontWeight="600" fontFamily="Arial" textAnchor="middle">
        {reference}
      </text>

      {/* Folha */}
      <rect x="250" y="185" width="22" height="20" fill="none" stroke="#000" strokeWidth=".1"/>
      <text x="261" y="192" fill="#666" fontSize="2" fontFamily="Arial" textAnchor="middle">FOLHA</text>
      <text x="261" y="199" fill="#000" fontSize="3" fontFamily="Arial" textAnchor="middle">1/1</text>

      {/* Formato */}
      <rect x="272" y="185" width="20" height="20" fill="#f0f0f0" stroke="#000" strokeWidth=".1"/>
      <text x="282" y="197" fill="#000" fontSize="5" fontWeight="700" fontFamily="Arial" textAnchor="middle">
        A4
      </text>
    </svg>
  );
};

export default DetailSheetA4;
