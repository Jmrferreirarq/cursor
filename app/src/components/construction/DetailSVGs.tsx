// Pormenores Construtivos FA - SVG Components (Corrigidos)
// Todas as correções gráficas e técnicas aplicadas

import React from 'react';

// SVG Pattern Definitions - VERSÃO PROFISSIONAL
// Hachuras normalizadas segundo EN ISO 128
export const SVGDefs = () => (
  <defs>
    {/* ========== BETÃO - Hachura diagonal 45° + agregados ========== */}
    <pattern id="pc" patternUnits="userSpaceOnUse" width="16" height="16">
      <rect width="16" height="16" fill="#d0d0d0"/>
      {/* Hachura diagonal */}
      <line x1="0" y1="16" x2="16" y2="0" stroke="#999" strokeWidth=".5"/>
      <line x1="-4" y1="12" x2="12" y2="-4" stroke="#999" strokeWidth=".5"/>
      <line x1="4" y1="20" x2="20" y2="4" stroke="#999" strokeWidth=".5"/>
      {/* Agregados */}
      <circle cx="4" cy="4" r="1.2" fill="#a0a0a0"/>
      <circle cx="12" cy="10" r="1" fill="#a8a8a8"/>
      <circle cx="7" cy="14" r=".8" fill="#aaa"/>
    </pattern>
    
    {/* ========== GESSO CARTONADO - Liso com textura subtil ========== */}
    <pattern id="pg" patternUnits="userSpaceOnUse" width="24" height="24">
      <rect width="24" height="24" fill="#f5f3ef"/>
      <line x1="0" y1="12" x2="24" y2="12" stroke="#e8e6e0" strokeWidth=".4"/>
      <line x1="0" y1="24" x2="24" y2="24" stroke="#e8e6e0" strokeWidth=".4"/>
    </pattern>
    
    {/* ========== GESSO H1 HIDRÓFUGO - Tom verde ========== */}
    <pattern id="pgh1" patternUnits="userSpaceOnUse" width="24" height="24">
      <rect width="24" height="24" fill="#e0f0e0"/>
      <line x1="0" y1="12" x2="24" y2="12" stroke="#c0e0c0" strokeWidth=".4"/>
      <line x1="0" y1="24" x2="24" y2="24" stroke="#c0e0c0" strokeWidth=".4"/>
    </pattern>
    
    {/* ========== AÇO/METAL - Cinza-azulado sólido ========== */}
    <pattern id="ps" patternUnits="userSpaceOnUse" width="10" height="10">
      <rect width="10" height="10" fill="#8c9aa8"/>
      <line x1="0" y1="5" x2="10" y2="5" stroke="#7a8896" strokeWidth=".6"/>
      <line x1="0" y1="10" x2="10" y2="10" stroke="#7a8896" strokeWidth=".6"/>
    </pattern>
    
    {/* ========== ISOLAMENTO/LÃ MINERAL - Ondas visíveis ========== */}
    <pattern id="pi" patternUnits="userSpaceOnUse" width="20" height="12">
      <rect width="20" height="12" fill="#fff8dc"/>
      <path d="M0,4 Q5,0 10,4 T20,4" stroke="#e0c860" fill="none" strokeWidth="1.2"/>
      <path d="M0,10 Q5,6 10,10 T20,10" stroke="#e0c860" fill="none" strokeWidth="1.2"/>
    </pattern>
    
    {/* ========== TIJOLO/ALVENARIA - Aparelho ========== */}
    <pattern id="pb" patternUnits="userSpaceOnUse" width="24" height="12">
      <rect width="24" height="12" fill="#e8cbb0"/>
      <line x1="0" y1="6" x2="24" y2="6" stroke="#c8a888" strokeWidth=".7"/>
      <line x1="12" y1="0" x2="12" y2="6" stroke="#c8a888" strokeWidth=".7"/>
      <line x1="0" y1="6" x2="0" y2="12" stroke="#c8a888" strokeWidth=".7"/>
      <line x1="24" y1="6" x2="24" y2="12" stroke="#c8a888" strokeWidth=".7"/>
    </pattern>
    
    {/* ========== ARGAMASSA/BETONILHA - Pontilhado fino ========== */}
    <pattern id="pm" patternUnits="userSpaceOnUse" width="8" height="8">
      <rect width="8" height="8" fill="#e0dcd0"/>
      <circle cx="2" cy="2" r=".6" fill="#c0b8a8"/>
      <circle cx="6" cy="6" r=".5" fill="#c0b8a8"/>
      <circle cx="2" cy="6" r=".4" fill="#c8c0b0"/>
      <circle cx="6" cy="2" r=".4" fill="#c8c0b0"/>
    </pattern>
    
    {/* ========== CERÂMICO - Ladrilho com junta ========== */}
    <pattern id="pk" patternUnits="userSpaceOnUse" width="20" height="20">
      <rect width="20" height="20" fill="#c8c0b8"/>
      <rect x="1" y="1" width="18" height="18" fill="#f0ece4"/>
    </pattern>
    
    {/* ========== MADEIRA - Veios realistas ========== */}
    <pattern id="pw" patternUnits="userSpaceOnUse" width="20" height="30">
      <rect width="20" height="30" fill="#d4a574"/>
      <path d="M3,0 Q4,15 3,30" stroke="#c49464" fill="none" strokeWidth=".8"/>
      <path d="M8,0 Q7,10 9,20 Q8,25 8,30" stroke="#c49464" fill="none" strokeWidth=".6"/>
      <path d="M14,0 Q15,12 14,30" stroke="#c49464" fill="none" strokeWidth=".7"/>
      <path d="M18,0 Q17,8 18,16 Q17,24 18,30" stroke="#c49464" fill="none" strokeWidth=".5"/>
    </pattern>
    
    {/* ========== BANDA RESILIENTE - Diagonal ========== */}
    <pattern id="pr" patternUnits="userSpaceOnUse" width="6" height="6">
      <rect width="6" height="6" fill="#b8a888"/>
      <line x1="0" y1="6" x2="6" y2="0" stroke="#988868" strokeWidth=".8"/>
      <line x1="-2" y1="4" x2="4" y2="-2" stroke="#988868" strokeWidth=".8"/>
      <line x1="2" y1="8" x2="8" y2="2" stroke="#988868" strokeWidth=".8"/>
    </pattern>
    
    {/* ========== XPS/EPS - Pontos densos ========== */}
    <pattern id="pxps" patternUnits="userSpaceOnUse" width="6" height="6">
      <rect width="6" height="6" fill="#e0f0ff"/>
      <circle cx="1.5" cy="1.5" r=".5" fill="#c0d8f0"/>
      <circle cx="4.5" cy="4.5" r=".5" fill="#c0d8f0"/>
      <circle cx="1.5" cy="4.5" r=".4" fill="#c0d8f0"/>
      <circle cx="4.5" cy="1.5" r=".4" fill="#c0d8f0"/>
    </pattern>
    
    {/* ========== IMPERMEABILIZAÇÃO - Preto com hachura ========== */}
    <pattern id="pimp" patternUnits="userSpaceOnUse" width="8" height="8">
      <rect width="8" height="8" fill="#404040"/>
      <line x1="0" y1="8" x2="8" y2="0" stroke="#606060" strokeWidth="1"/>
    </pattern>
    
    {/* ========== VIDRO - Linhas diagonais finas ========== */}
    <pattern id="pv" patternUnits="userSpaceOnUse" width="10" height="10">
      <rect width="10" height="10" fill="#d8f0f8"/>
      <line x1="0" y1="10" x2="10" y2="0" stroke="#a0d0e0" strokeWidth=".4"/>
    </pattern>
    
    {/* ========== MARKERS - Estilo Arquitectura (oblíquos) ========== */}
    <marker id="ae" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
      <line x1="0" y1="8" x2="8" y2="0" stroke="#333" strokeWidth="1.5"/>
    </marker>
    <marker id="as" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
      <line x1="0" y1="8" x2="8" y2="0" stroke="#333" strokeWidth="1.5"/>
    </marker>
    
    {/* ========== MARKER - Ponto (alternativo) ========== */}
    <marker id="dot" markerWidth="4" markerHeight="4" refX="2" refY="2">
      <circle cx="2" cy="2" r="1.5" fill="#333"/>
    </marker>
    
    {/* ========== SOMBRA para labels ========== */}
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0.5" dy="0.5" stdDeviation="0.5" floodOpacity="0.2"/>
    </filter>
  </defs>
);

// Helper: Dimension line - ESTILO ARQUITECTURA
// Terminações oblíquas, linha contínua fina
const Dim: React.FC<{
  x1: number; y1: number;
  x2: number; y2: number;
  text: string;
  textX?: number;
  textY?: number;
  vertical?: boolean;
}> = ({ x1, y1, x2, y2, text, textX, textY, vertical }) => {
  const midX = textX ?? (x1 + x2) / 2;
  const midY = textY ?? (y1 + y2) / 2;
  const isVert = vertical || x1 === x2;
  
  return (
    <g className="dimension">
      {/* Linha de cota principal */}
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#333" strokeWidth=".5"/>
      
      {/* Terminações oblíquas (/) */}
      {isVert ? (
        <>
          <line x1={x1-3} y1={y1-3} x2={x1+3} y2={y1+3} stroke="#333" strokeWidth="1.2"/>
          <line x1={x2-3} y1={y2-3} x2={x2+3} y2={y2+3} stroke="#333" strokeWidth="1.2"/>
        </>
      ) : (
        <>
          <line x1={x1} y1={y1-4} x2={x1} y2={y1+4} stroke="#333" strokeWidth="1.2"/>
          <line x1={x2} y1={y2-4} x2={x2} y2={y2+4} stroke="#333" strokeWidth="1.2"/>
        </>
      )}
      
      {/* Fundo branco para texto */}
      <rect 
        x={midX - (text.length * 3.5)} 
        y={isVert ? midY - 5 : midY - 12} 
        width={text.length * 7} 
        height="10" 
        fill="#fafaf8"
        transform={isVert ? `rotate(-90,${midX},${midY})` : undefined}
      />
      
      {/* Texto da cota */}
      <text 
        x={midX} 
        y={isVert ? midY + 3 : midY - 4} 
        fill="#222" 
        fontSize="8" 
        fontWeight="500"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        transform={isVert ? `rotate(-90,${midX},${midY})` : undefined}
      >
        {text}
      </text>
    </g>
  );
};

// Helper: Escala Gráfica
const ScaleBar: React.FC<{ x: number; y: number; scale: string }> = ({ x, y, scale }) => (
  <g>
    <rect x={x} y={y} width="60" height="6" fill="#222"/>
    <rect x={x} y={y} width="20" height="6" fill="#fff"/>
    <rect x={x+40} y={y} width="20" height="6" fill="#fff"/>
    <rect x={x} y={y} width="60" height="6" fill="none" stroke="#222" strokeWidth=".5"/>
    <line x1={x+20} y1={y} x2={x+20} y2={y+6} stroke="#222" strokeWidth=".5"/>
    <line x1={x+40} y1={y} x2={x+40} y2={y+6} stroke="#222" strokeWidth=".5"/>
    <text x={x} y={y+14} fill="#333" fontSize="6" fontFamily="Arial, sans-serif">0</text>
    <text x={x+30} y={y+14} fill="#333" fontSize="6" textAnchor="middle" fontFamily="Arial, sans-serif">50</text>
    <text x={x+60} y={y+14} fill="#333" fontSize="6" textAnchor="end" fontFamily="Arial, sans-serif">100mm</text>
    <text x={x+30} y={y-4} fill="#333" fontSize="7" fontWeight="500" textAnchor="middle" fontFamily="Arial, sans-serif">Escala {scale}</text>
  </g>
);

// ============================================================
// A.01 — Base de Parede — Zona Seca (VERSÃO PROFISSIONAL)
// Rodapé: 70mm altura × 15mm espessura | Cotas completas
// Placas gesso: 2×8mm = 16mm por face
// ============================================================
export const A01: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 540 420" className={className}>
    <SVGDefs />
    
    {/* ===== LAJE ESTRUTURAL ===== */}
    <rect x="30" y="278" width="440" height="100" fill="url(#pc)"/>
    <line x1="30" y1="278" x2="470" y2="278" stroke="#1a1a1a" strokeWidth="2.5"/>
    
    {/* ===== BETONILHA - 20mm ===== */}
    <rect x="30" y="258" width="440" height="20" fill="url(#pm)"/>
    <line x1="30" y1="258" x2="470" y2="258" stroke="#333" strokeWidth="1.5"/>
    
    {/* ===== COLA + REVESTIMENTO ===== */}
    <rect x="30" y="250" width="440" height="8" fill="#e0dcd0"/>
    <rect x="30" y="238" width="148" height="12" fill="url(#pk)"/>
    <rect x="180" y="238" width="12" height="12" fill="url(#pk)"/>
    <rect x="236" y="238" width="12" height="12" fill="url(#pk)"/>
    <rect x="250" y="238" width="220" height="12" fill="url(#pk)"/>
    <line x1="30" y1="238" x2="178" y2="238" stroke="#333" strokeWidth="1.2"/>
    <line x1="250" y1="238" x2="470" y2="238" stroke="#333" strokeWidth="1.2"/>
    
    {/* ===== BANDA RESILIENTE ===== */}
    <rect x="180" y="253" width="68" height="5" fill="url(#pr)"/>
    <line x1="180" y1="253" x2="248" y2="253" stroke="#444" strokeWidth=".8"/>
    <line x1="180" y1="258" x2="248" y2="258" stroke="#444" strokeWidth=".8"/>
    
    {/* ===== GUIA U INFERIOR ===== */}
    <rect x="180" y="238" width="68" height="15" fill="url(#ps)"/>
    <line x1="180" y1="238" x2="248" y2="238" stroke="#1a1a1a" strokeWidth="2"/>
    <line x1="180" y1="253" x2="248" y2="253" stroke="#1a1a1a" strokeWidth="2"/>
    <line x1="180" y1="238" x2="180" y2="253" stroke="#1a1a1a" strokeWidth="2"/>
    <line x1="248" y1="238" x2="248" y2="253" stroke="#1a1a1a" strokeWidth="2"/>
    {/* Fixações */}
    <circle cx="198" cy="260" r="2.5" fill="#333"/>
    <circle cx="230" cy="260" r="2.5" fill="#333"/>
    
    {/* ===== MONTANTE C48 ===== */}
    <line x1="188" y1="50" x2="188" y2="238" stroke="#1a1a1a" strokeWidth="2"/>
    <line x1="240" y1="50" x2="240" y2="238" stroke="#1a1a1a" strokeWidth="2"/>
    <line x1="188" y1="50" x2="240" y2="50" stroke="#1a1a1a" strokeWidth="2"/>
    
    {/* ===== LÃ MINERAL ===== */}
    <rect x="188" y="50" width="52" height="188" fill="url(#pi)"/>
    
    {/* ===== PLACA GESSO ESQUERDA (2×8mm = 16mm) ===== */}
    <rect x="164" y="44" width="24" height="206" fill="url(#pg)"/>
    <line x1="164" y1="44" x2="164" y2="250" stroke="#1a1a1a" strokeWidth="2.5"/>
    <line x1="176" y1="44" x2="176" y2="250" stroke="#333" strokeWidth=".6" strokeDasharray="3,2"/>
    <line x1="188" y1="44" x2="188" y2="250" stroke="#333" strokeWidth="1.5"/>
    <line x1="164" y1="44" x2="188" y2="44" stroke="#333" strokeWidth="1.5"/>
    
    {/* ===== PLACA GESSO DIREITA (2×8mm = 16mm) ===== */}
    <rect x="240" y="44" width="24" height="206" fill="url(#pg)"/>
    <line x1="240" y1="44" x2="240" y2="250" stroke="#333" strokeWidth="1.5"/>
    <line x1="252" y1="44" x2="252" y2="250" stroke="#333" strokeWidth=".6" strokeDasharray="3,2"/>
    <line x1="264" y1="44" x2="264" y2="250" stroke="#1a1a1a" strokeWidth="2.5"/>
    <line x1="240" y1="44" x2="264" y2="44" stroke="#333" strokeWidth="1.5"/>
    
    {/* ===== SELANTE ELÁSTICO ===== */}
    <ellipse cx="166" cy="248" rx="4" ry="3" fill="#888"/>
    <ellipse cx="262" cy="248" rx="4" ry="3" fill="#888"/>
    
    {/* ===== RODAPÉ MDF 70×15mm ===== */}
    <rect x="149" y="210" width="15" height="28" fill="url(#pw)"/>
    <line x1="149" y1="210" x2="164" y2="210" stroke="#1a1a1a" strokeWidth="1.8"/>
    <line x1="149" y1="238" x2="164" y2="238" stroke="#333" strokeWidth="1.2"/>
    <line x1="149" y1="210" x2="149" y2="238" stroke="#1a1a1a" strokeWidth="1.8"/>
    
    <rect x="264" y="210" width="15" height="28" fill="url(#pw)"/>
    <line x1="264" y1="210" x2="279" y2="210" stroke="#1a1a1a" strokeWidth="1.8"/>
    <line x1="264" y1="238" x2="279" y2="238" stroke="#333" strokeWidth="1.2"/>
    <line x1="279" y1="210" x2="279" y2="238" stroke="#1a1a1a" strokeWidth="1.8"/>
    
    {/* ============ COTAS ============ */}
    {/* Cota TOTAL parede */}
    <Dim x1={164} y1={22} x2={264} y2={22} text="80"/>
    
    {/* Cotas parciais parede - 16 + 48 + 16 = 80mm */}
    <line x1="164" y1="30" x2="164" y2="44" stroke="#555" strokeWidth=".4"/>
    <line x1="188" y1="30" x2="188" y2="44" stroke="#555" strokeWidth=".4"/>
    <line x1="240" y1="30" x2="240" y2="44" stroke="#555" strokeWidth=".4"/>
    <line x1="264" y1="30" x2="264" y2="44" stroke="#555" strokeWidth=".4"/>
    <text x="176" y="42" fill="#333" fontSize="6" textAnchor="middle" fontFamily="Arial">16</text>
    <text x="214" y="42" fill="#333" fontSize="6" textAnchor="middle" fontFamily="Arial">48</text>
    <text x="252" y="42" fill="#333" fontSize="6" textAnchor="middle" fontFamily="Arial">16</text>
    
    {/* Cota rodapé altura */}
    <Dim x1={133} y1={210} x2={133} y2={238} text="70" vertical/>
    
    {/* Cota rodapé espessura */}
    <line x1="149" y1="200" x2="149" y2="208" stroke="#555" strokeWidth=".4"/>
    <line x1="164" y1="200" x2="164" y2="208" stroke="#555" strokeWidth=".4"/>
    <line x1="149" y1="204" x2="164" y2="204" stroke="#333" strokeWidth=".5"/>
    <text x="156" y="198" fill="#333" fontSize="6" textAnchor="middle" fontFamily="Arial">15</text>
    
    {/* Cotas pavimento */}
    <line x1="475" y1="238" x2="495" y2="238" stroke="#555" strokeWidth=".4"/>
    <line x1="475" y1="250" x2="495" y2="250" stroke="#555" strokeWidth=".4"/>
    <line x1="475" y1="258" x2="495" y2="258" stroke="#555" strokeWidth=".4"/>
    <line x1="475" y1="278" x2="495" y2="278" stroke="#555" strokeWidth=".4"/>
    <line x1="488" y1="238" x2="488" y2="278" stroke="#333" strokeWidth=".5"/>
    <text x="500" y="245" fill="#333" fontSize="6" fontFamily="Arial">12</text>
    <text x="500" y="255" fill="#333" fontSize="6" fontFamily="Arial">8</text>
    <text x="500" y="270" fill="#333" fontSize="6" fontFamily="Arial">20</text>
    
    {/* Cota total pavimento */}
    <Dim x1={510} y1={238} x2={510} y2={278} text="40" vertical/>
    
    {/* ============ ESCALA GRÁFICA ============ */}
    <ScaleBar x={380} y={390} scale="1:5"/>
    
    {/* ============ NOTAS ============ */}
    <text x="30" y="395" fill="#333" fontSize="7" fontWeight="500" fontFamily="Arial">① Banda resiliente contínua sob guia U — não preencher com argamassa.</text>
    <text x="30" y="407" fill="#333" fontSize="7" fontWeight="500" fontFamily="Arial">② Fix. guia U à laje: buchas/parafusos; passo máx. 600 mm; 150 mm das extremidades.</text>
  </svg>
);

// ============================================================
// A.02 — Base de Parede — Zona Húmida (VERSÃO PROFISSIONAL)
// Rodapé: 70mm altura × 15mm espessura | Cotas completas
// Placas gesso: 2×8mm = 16mm por face
// ============================================================
export const A02: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 540 420" className={className}>
    <SVGDefs />
    
    {/* ===== LAJE ===== */}
    <rect x="30" y="278" width="440" height="100" fill="url(#pc)"/>
    <line x1="30" y1="278" x2="470" y2="278" stroke="#1a1a1a" strokeWidth="2.5"/>
    
    {/* ===== BETONILHA ===== */}
    <rect x="30" y="258" width="440" height="20" fill="url(#pm)"/>
    <line x1="30" y1="258" x2="470" y2="258" stroke="#333" strokeWidth="1.5"/>
    
    {/* ===== REVESTIMENTO ===== */}
    <rect x="30" y="250" width="440" height="8" fill="#e0dcd0"/>
    <rect x="30" y="238" width="134" height="12" fill="url(#pk)"/>
    <rect x="264" y="238" width="206" height="12" fill="url(#pk)"/>
    <line x1="30" y1="238" x2="164" y2="238" stroke="#333" strokeWidth="1.2"/>
    <line x1="264" y1="238" x2="470" y2="238" stroke="#333" strokeWidth="1.2"/>
    
    {/* ===== BANDA RESILIENTE ===== */}
    <rect x="180" y="253" width="68" height="5" fill="url(#pr)"/>
    
    {/* ===== GUIA U ===== */}
    <rect x="180" y="238" width="68" height="15" fill="url(#ps)"/>
    <line x1="180" y1="238" x2="248" y2="238" stroke="#1a1a1a" strokeWidth="2"/>
    <line x1="180" y1="253" x2="248" y2="253" stroke="#1a1a1a" strokeWidth="2"/>
    <line x1="180" y1="238" x2="180" y2="253" stroke="#1a1a1a" strokeWidth="2"/>
    <line x1="248" y1="238" x2="248" y2="253" stroke="#1a1a1a" strokeWidth="2"/>
    
    {/* ===== MONTANTE ===== */}
    <line x1="188" y1="50" x2="188" y2="238" stroke="#1a1a1a" strokeWidth="2"/>
    <line x1="240" y1="50" x2="240" y2="238" stroke="#1a1a1a" strokeWidth="2"/>
    <line x1="188" y1="50" x2="240" y2="50" stroke="#1a1a1a" strokeWidth="2"/>
    
    {/* ===== LÃ MINERAL ===== */}
    <rect x="188" y="50" width="52" height="188" fill="url(#pi)"/>
    
    {/* ===== PLACA GESSO ESQUERDA (standard 2×8mm = 16mm) ===== */}
    <rect x="164" y="44" width="24" height="194" fill="url(#pg)"/>
    <line x1="164" y1="44" x2="164" y2="238" stroke="#1a1a1a" strokeWidth="2.5"/>
    <line x1="176" y1="44" x2="176" y2="238" stroke="#333" strokeWidth=".6" strokeDasharray="3,2"/>
    <line x1="188" y1="44" x2="188" y2="238" stroke="#333" strokeWidth="1.5"/>
    <line x1="164" y1="238" x2="188" y2="238" stroke="#333" strokeWidth="1.2"/>
    
    {/* ===== PLACA GESSO DIREITA (H1 2×8mm = 16mm) - com folga ===== */}
    <rect x="240" y="44" width="24" height="184" fill="url(#pgh1)"/>
    <line x1="240" y1="44" x2="240" y2="228" stroke="#333" strokeWidth="1.5"/>
    <line x1="252" y1="44" x2="252" y2="228" stroke="#333" strokeWidth=".6" strokeDasharray="3,2"/>
    <line x1="264" y1="44" x2="264" y2="228" stroke="#1a1a1a" strokeWidth="2.5"/>
    <line x1="240" y1="228" x2="264" y2="228" stroke="#333" strokeWidth="1.5"/>
    <text x="252" y="80" fill="#1a6a1a" fontSize="9" fontWeight="700" fontFamily="Arial">H1</text>
    
    {/* ===== SELANTE ===== */}
    <ellipse cx="166" cy="237" rx="4" ry="3" fill="#3a6a6a"/>
    <ellipse cx="262" cy="227" rx="4" ry="3" fill="#3a6a6a"/>
    
    {/* ===== RODAPÉ SECO (MDF) ===== */}
    <rect x="149" y="210" width="15" height="28" fill="url(#pw)"/>
    <line x1="149" y1="210" x2="164" y2="210" stroke="#1a1a1a" strokeWidth="1.8"/>
    <line x1="149" y1="238" x2="164" y2="238" stroke="#333" strokeWidth="1.2"/>
    <line x1="149" y1="210" x2="149" y2="238" stroke="#1a1a1a" strokeWidth="1.8"/>
    
    {/* ===== RODAPÉ HÚMIDO (cerâmico) ===== */}
    <rect x="264" y="210" width="15" height="28" fill="url(#pk)"/>
    <line x1="264" y1="210" x2="279" y2="210" stroke="#1a1a1a" strokeWidth="1.8"/>
    <line x1="264" y1="238" x2="279" y2="238" stroke="#333" strokeWidth="1.2"/>
    <line x1="279" y1="210" x2="279" y2="238" stroke="#1a1a1a" strokeWidth="1.8"/>
    
    {/* ============ COTAS ============ */}
    <Dim x1={164} y1={22} x2={264} y2={22} text="80"/>
    
    {/* Parciais - 16 + 48 + 16 = 80mm */}
    <line x1="164" y1="30" x2="164" y2="44" stroke="#555" strokeWidth=".4"/>
    <line x1="188" y1="30" x2="188" y2="44" stroke="#555" strokeWidth=".4"/>
    <line x1="240" y1="30" x2="240" y2="44" stroke="#555" strokeWidth=".4"/>
    <line x1="264" y1="30" x2="264" y2="44" stroke="#555" strokeWidth=".4"/>
    <text x="176" y="42" fill="#333" fontSize="6" textAnchor="middle" fontFamily="Arial">16</text>
    <text x="214" y="42" fill="#333" fontSize="6" textAnchor="middle" fontFamily="Arial">48</text>
    <text x="252" y="42" fill="#333" fontSize="6" textAnchor="middle" fontFamily="Arial">16</text>
    
    {/* Zonas */}
    <text x="100" y="60" fill="#333" fontSize="9" fontStyle="italic" fontWeight="600" fontFamily="Arial">zona seca</text>
    <text x="300" y="60" fill="#1a6a1a" fontSize="9" fontStyle="italic" fontWeight="600" fontFamily="Arial">zona húmida</text>
    
    {/* Rodapé esquerdo */}
    <Dim x1={133} y1={210} x2={133} y2={238} text="70" vertical/>
    
    {/* Folga H1 */}
    <line x1="284" y1="228" x2="302" y2="228" stroke="#555" strokeWidth=".4"/>
    <line x1="284" y1="238" x2="302" y2="238" stroke="#555" strokeWidth=".4"/>
    <line x1="294" y1="228" x2="294" y2="238" stroke="#333" strokeWidth=".5"/>
    <text x="307" y="235" fill="#333" fontSize="6" fontFamily="Arial" fontWeight="500">10</text>
    
    {/* Rodapé direito */}
    <line x1="284" y1="210" x2="302" y2="210" stroke="#555" strokeWidth=".4"/>
    <text x="307" y="222" fill="#333" fontSize="6" fontFamily="Arial" fontWeight="500">70</text>
    
    {/* Pavimento */}
    <line x1="475" y1="238" x2="495" y2="238" stroke="#555" strokeWidth=".4"/>
    <line x1="475" y1="258" x2="495" y2="258" stroke="#555" strokeWidth=".4"/>
    <line x1="475" y1="278" x2="495" y2="278" stroke="#555" strokeWidth=".4"/>
    <line x1="488" y1="238" x2="488" y2="278" stroke="#333" strokeWidth=".5"/>
    <text x="500" y="250" fill="#333" fontSize="6" fontFamily="Arial">20</text>
    <text x="500" y="270" fill="#333" fontSize="6" fontFamily="Arial">20</text>
    
    <Dim x1={510} y1={238} x2={510} y2={278} text="40" vertical/>
    
    {/* ============ ESCALA ============ */}
    <ScaleBar x={380} y={390} scale="1:5"/>
    
    {/* ============ NOTAS ============ */}
    <text x="30" y="395" fill="#333" fontSize="7" fontWeight="500" fontFamily="Arial">① Placa H1 (hidrófuga) na face húmida; standard na face seca. Folga inferior H1: 10mm.</text>
    <text x="30" y="407" fill="#333" fontSize="7" fontWeight="500" fontFamily="Arial">② Rodapé cerâmico no lado húmido; MDF lacado no lado seco. Selante hidrófugo nas juntas.</text>
  </svg>
);

// ============================================================
// A.03 — Topo de Parede Divisória (VERSÃO PROFISSIONAL)
// Cotas totais e parciais completas
// Placas gesso: 2×8mm = 16mm por face
// ============================================================
export const A03: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 500 375" className={className}>
    <SVGDefs />
    
    {/* LAJE SUPERIOR */}
    <rect x="40" y="40" width="420" height="60" fill="url(#pc)"/>
    <line x1="40" y1="100" x2="460" y2="100" stroke="#333" strokeWidth="2"/>
    <line x1="40" y1="40" x2="460" y2="40" stroke="#555" strokeWidth="1"/>
    
    {/* BANDA ACÚSTICA entre guia e laje - 5mm */}
    <rect x="188" y="97" width="52" height="3" fill="url(#pr)"/>
    
    {/* GUIA U SUPERIOR - 48mm */}
    <rect x="188" y="100" width="52" height="10" fill="url(#ps)"/>
    <line x1="188" y1="100" x2="240" y2="100" stroke="#333" strokeWidth="1.5"/>
    <line x1="188" y1="110" x2="240" y2="110" stroke="#333" strokeWidth="1.5"/>
    <line x1="188" y1="100" x2="188" y2="110" stroke="#333" strokeWidth="1.5"/>
    <line x1="240" y1="100" x2="240" y2="110" stroke="#333" strokeWidth="1.5"/>
    
    {/* MONTANTE C48 */}
    <line x1="196" y1="110" x2="196" y2="330" stroke="#333" strokeWidth="1.5"/>
    <line x1="232" y1="110" x2="232" y2="330" stroke="#333" strokeWidth="1.5"/>
    
    {/* LÃ MINERAL - 48mm */}
    <rect x="196" y="110" width="36" height="220" fill="url(#pi)" opacity=".7"/>
    
    {/* JUNTA LIVRE ~10mm - espaço entre placa e laje */}
    <rect x="156" y="100" width="116" height="12" fill="#fafaf8"/>
    
    {/* PLACA ESQUERDA - 16mm (2×8mm) - NÃO toca a laje */}
    <rect x="164" y="112" width="24" height="218" fill="url(#pg)"/>
    <line x1="164" y1="112" x2="164" y2="330" stroke="#333" strokeWidth="2"/>
    <line x1="176" y1="112" x2="176" y2="330" stroke="#333" strokeWidth=".6" strokeDasharray="3,2"/>
    <line x1="188" y1="112" x2="188" y2="330" stroke="#444" strokeWidth="1.2"/>
    
    {/* PLACA DIREITA - 16mm (2×8mm) - NÃO toca a laje */}
    <rect x="240" y="112" width="24" height="218" fill="url(#pg)"/>
    <line x1="240" y1="112" x2="240" y2="330" stroke="#444" strokeWidth="1.2"/>
    <line x1="252" y1="112" x2="252" y2="330" stroke="#333" strokeWidth=".6" strokeDasharray="3,2"/>
    <line x1="264" y1="112" x2="264" y2="330" stroke="#333" strokeWidth="2"/>
    
    {/* SELANTE TOPO */}
    <ellipse cx="168" cy="111" rx="4" ry="2" fill="#c8c4bc"/>
    <ellipse cx="260" cy="111" rx="4" ry="2" fill="#c8c4bc"/>
    
    {/* ============ COTAS HORIZONTAIS (TOPO) ============ */}
    {/* Cota TOTAL parede - 80mm */}
    <Dim x1={164} y1={25} x2={264} y2={25} text="80"/>
    
    {/* Cotas PARCIAIS parede - 16 + 48 + 16 = 80mm */}
    <line x1="164" y1="32" x2="164" y2="40" stroke="#666" strokeWidth=".4"/>
    <line x1="188" y1="32" x2="188" y2="40" stroke="#666" strokeWidth=".4"/>
    <line x1="240" y1="32" x2="240" y2="40" stroke="#666" strokeWidth=".4"/>
    <line x1="264" y1="32" x2="264" y2="40" stroke="#666" strokeWidth=".4"/>
    <text x="176" y="38" fill="#555" fontSize="5" textAnchor="middle" fontFamily="monospace">16</text>
    <text x="214" y="38" fill="#555" fontSize="5" textAnchor="middle" fontFamily="monospace">48</text>
    <text x="252" y="38" fill="#555" fontSize="5" textAnchor="middle" fontFamily="monospace">16</text>
    
    {/* ============ COTAS VERTICAIS ESQUERDA ============ */}
    {/* Junta livre - ~10mm */}
    <line x1="145" y1="100" x2="158" y2="100" stroke="#666" strokeWidth=".4"/>
    <line x1="145" y1="112" x2="158" y2="112" stroke="#666" strokeWidth=".4"/>
    <line x1="150" y1="100" x2="150" y2="112" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="140" y="108" fill="#333" fontSize="6" textAnchor="end" fontFamily="monospace" fontWeight="500">~10</text>
    
    {/* Guia U - altura */}
    <line x1="145" y1="110" x2="158" y2="110" stroke="#666" strokeWidth=".4"/>
    
    {/* ============ COTAS VERTICAIS DIREITA ============ */}
    {/* Laje */}
    <line x1="465" y1="40" x2="480" y2="40" stroke="#666" strokeWidth=".4"/>
    <line x1="465" y1="100" x2="480" y2="100" stroke="#666" strokeWidth=".4"/>
    <line x1="472" y1="40" x2="472" y2="100" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="485" y="74" fill="#333" fontSize="6" fontFamily="monospace" fontWeight="500">60</text>
    
    {/* Banda acústica */}
    <line x1="270" y1="97" x2="285" y2="97" stroke="#666" strokeWidth=".4"/>
    <line x1="270" y1="100" x2="285" y2="100" stroke="#666" strokeWidth=".4"/>
    <text x="290" y="100" fill="#555" fontSize="5" fontFamily="monospace">3-5</text>
    
    {/* NOTA */}
    <text x="40" y="352" fill="#444" fontSize="7" fontWeight="500">① Junta livre ≈10mm entre placa gesso e laje. Selante elástico no topo.</text>
    <text x="40" y="364" fill="#444" fontSize="7" fontWeight="500">② Banda acústica (3-5mm) entre guia U e laje para desacoplamento.</text>
  </svg>
);

// ============================================================
// A.04 — Encontro com Parede Existente (VERSÃO PROFISSIONAL)
// Cotas totais e parciais completas
// Placas gesso: 2×8mm = 16mm por face
// ============================================================
export const A04: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 500 375" className={className}>
    <SVGDefs />
    
    {/* PAREDE EXISTENTE (vertical) - ~200mm */}
    <rect x="40" y="60" width="140" height="260" fill="url(#pb)"/>
    <line x1="40" y1="60" x2="40" y2="320" stroke="#555" strokeWidth="1"/>
    <line x1="180" y1="60" x2="180" y2="320" stroke="#333" strokeWidth="2"/>
    
    {/* REBOCO EXISTENTE - ~15mm */}
    <rect x="180" y="60" width="10" height="260" fill="url(#pm)"/>
    <line x1="190" y1="60" x2="190" y2="320" stroke="#444" strokeWidth="1.2"/>
    
    {/* SELANTE + BANDA ACÚSTICA - 5mm */}
    <rect x="190" y="60" width="4" height="260" fill="#d8d4cc"/>
    
    {/* GUIA VERTICAL (rail) - 5mm */}
    <rect x="194" y="60" width="5" height="260" fill="url(#ps)"/>
    
    {/* NOVA PAREDE: montante + lã (horizontal no plano) - 48mm */}
    <rect x="199" y="126" width="231" height="130" fill="url(#pi)" opacity=".7"/>
    <line x1="199" y1="126" x2="430" y2="126" stroke="#333" strokeWidth="1.5"/>
    <line x1="199" y1="256" x2="430" y2="256" stroke="#333" strokeWidth="1.5"/>
    
    {/* MONTANTES indicados @600mm */}
    <line x1="199" y1="126" x2="199" y2="256" stroke="#555" strokeWidth="1" strokeDasharray="5,4"/>
    <line x1="260" y1="126" x2="260" y2="256" stroke="#555" strokeWidth="1" strokeDasharray="5,4"/>
    <line x1="360" y1="126" x2="360" y2="256" stroke="#555" strokeWidth="1" strokeDasharray="5,4"/>
    
    {/* PLACA GESSO CIMA - 16mm (2×8mm) */}
    <rect x="199" y="102" width="231" height="24" fill="url(#pg)"/>
    <line x1="199" y1="102" x2="430" y2="102" stroke="#333" strokeWidth="2"/>
    <line x1="199" y1="114" x2="430" y2="114" stroke="#333" strokeWidth=".6" strokeDasharray="3,2"/>
    <line x1="199" y1="126" x2="430" y2="126" stroke="#444" strokeWidth="1.2"/>
    
    {/* PLACA GESSO BAIXO - 16mm (2×8mm) */}
    <rect x="199" y="256" width="231" height="24" fill="url(#pg)"/>
    <line x1="199" y1="256" x2="430" y2="256" stroke="#444" strokeWidth="1.2"/>
    <line x1="199" y1="268" x2="430" y2="268" stroke="#333" strokeWidth=".6" strokeDasharray="3,2"/>
    <line x1="199" y1="280" x2="430" y2="280" stroke="#333" strokeWidth="2"/>
    
    {/* ============ COTAS HORIZONTAIS (TOPO) ============ */}
    {/* Parede existente */}
    <Dim x1={40} y1={45} x2={180} y2={45} text="~200"/>
    <text x="110" y="38" fill="#555" fontSize="5" textAnchor="middle" fontStyle="italic">exist.</text>
    
    {/* Reboco + banda + guia */}
    <line x1="180" y1="50" x2="180" y2="58" stroke="#666" strokeWidth=".4"/>
    <line x1="190" y1="50" x2="190" y2="58" stroke="#666" strokeWidth=".4"/>
    <line x1="199" y1="50" x2="199" y2="58" stroke="#666" strokeWidth=".4"/>
    <text x="185" y="56" fill="#555" fontSize="4" textAnchor="middle" fontFamily="monospace">10</text>
    <text x="194" y="56" fill="#555" fontSize="4" textAnchor="middle" fontFamily="monospace">9</text>
    
    {/* ============ COTAS VERTICAIS DIREITA ============ */}
    {/* Cota TOTAL nova parede - 80mm */}
    <line x1="435" y1="102" x2="455" y2="102" stroke="#666" strokeWidth=".4"/>
    <line x1="435" y1="280" x2="455" y2="280" stroke="#666" strokeWidth=".4"/>
    <line x1="448" y1="102" x2="448" y2="280" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="458" y="195" fill="#333" fontSize="7" fontFamily="monospace" fontWeight="500">80</text>
    
    {/* Cotas PARCIAIS nova parede - 16 + 48 + 16 = 80mm */}
    <line x1="435" y1="126" x2="445" y2="126" stroke="#666" strokeWidth=".4"/>
    <line x1="435" y1="256" x2="445" y2="256" stroke="#666" strokeWidth=".4"/>
    <text x="440" y="116" fill="#555" fontSize="5" textAnchor="middle" fontFamily="monospace">16</text>
    <text x="440" y="195" fill="#555" fontSize="5" textAnchor="middle" fontFamily="monospace">48</text>
    <text x="440" y="272" fill="#555" fontSize="5" textAnchor="middle" fontFamily="monospace">16</text>
    
    {/* ============ COTAS HORIZONTAIS (MONTANTES) ============ */}
    <line x1="199" y1="290" x2="199" y2="300" stroke="#666" strokeWidth=".4"/>
    <line x1="260" y1="290" x2="260" y2="300" stroke="#666" strokeWidth=".4"/>
    <line x1="199" y1="295" x2="260" y2="295" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="229" y="307" fill="#555" fontSize="5" textAnchor="middle" fontFamily="monospace">≤600</text>
    
    {/* Indicações */}
    <text x="395" y={335} fill="#555" fontSize="7" fontStyle="italic" fontWeight="500">corte em planta</text>
    
    {/* NOTA */}
    <text x="40" y="352" fill="#444" fontSize="7" fontWeight="500">① Banda acústica + selante elástico entre guia e parede existente.</text>
    <text x="40" y="364" fill="#444" fontSize="7" fontWeight="500">② Montantes @600mm. Lã mineral 40mm entre montantes.</text>
  </svg>
);

// ============================================================
// B.01 — Teto Falso — Suspensão Corrente (CORRIGIDO v2)
// Cotas totais e parciais completas
// ============================================================
export const B01: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 500 375" className={className}>
    <SVGDefs />
    
    {/* LAJE - 200mm */}
    <rect x="40" y="30" width="420" height="50" fill="url(#pc)"/>
    <line x1="40" y1="80" x2="460" y2="80" stroke="#333" strokeWidth="2"/>
    <line x1="40" y1="30" x2="460" y2="30" stroke="#555" strokeWidth="1"/>
    
    {/* PENDURAIS */}
    <rect x="146" y="78" width="8" height="6" fill="url(#ps)"/>
    <line x1="150" y1="84" x2="150" y2="190" stroke="#333" strokeWidth="1.5"/>
    <rect x="346" y="78" width="8" height="6" fill="url(#ps)"/>
    <line x1="350" y1="84" x2="350" y2="190" stroke="#333" strokeWidth="1.5"/>
    
    {/* CONECTOR ARTICULADO (clip) */}
    <rect x="146" y="187" width="8" height="6" fill="url(#ps)"/>
    <rect x="346" y="187" width="8" height="6" fill="url(#ps)"/>
    
    {/* PERFIL PRIMÁRIO F47 - 47mm */}
    <rect x="100" y="193" width="300" height="7" fill="url(#ps)"/>
    <line x1="100" y1="193" x2="400" y2="193" stroke="#333" strokeWidth="1.5"/>
    <line x1="100" y1="200" x2="400" y2="200" stroke="#333" strokeWidth="1.5"/>
    
    {/* PERFIL SECUNDÁRIO CD60 (perpendicular - indicado) */}
    <rect x="200" y="200" width="100" height="5" fill="url(#ps)"/>
    <line x1="200" y1="200" x2="300" y2="200" stroke="#444" strokeWidth="1"/>
    <line x1="200" y1="205" x2="300" y2="205" stroke="#444" strokeWidth="1"/>
    <text x="250" y="203" fill="#666" fontSize="5" textAnchor="middle" fontWeight="500">CD60</text>
    
    {/* PLACA GESSO - 12.5mm */}
    <rect x="80" y="212" width="340" height="16" fill="url(#pg)"/>
    <line x1="80" y1="212" x2="420" y2="212" stroke="#444" strokeWidth="1.2"/>
    <line x1="80" y1="228" x2="420" y2="228" stroke="#333" strokeWidth="2"/>
    
    {/* TEXTO PLENUM */}
    <text x="250" y="145" fill="#555" fontSize="9" textAnchor="middle" fontStyle="italic" fontWeight="500">plenum</text>
    
    {/* ============ COTAS VERTICAIS ESQUERDA ============ */}
    {/* Altura plenum mínima - ≥120mm */}
    <line x1="50" y1="80" x2="65" y2="80" stroke="#666" strokeWidth=".4"/>
    <line x1="50" y1="212" x2="65" y2="212" stroke="#666" strokeWidth=".4"/>
    <line x1="58" y1="80" x2="58" y2="212" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="45" y="150" fill="#333" fontSize="6" textAnchor="end" fontFamily="monospace" fontWeight="500" transform="rotate(-90,45,150)">≥120</text>
    
    {/* Laje */}
    <line x1="30" y1="30" x2="38" y2="30" stroke="#666" strokeWidth=".4"/>
    <line x1="30" y1="80" x2="38" y2="80" stroke="#666" strokeWidth=".4"/>
    <line x1="34" y1="30" x2="34" y2="80" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="26" y="58" fill="#333" fontSize="5" textAnchor="end" fontFamily="monospace" fontWeight="500" transform="rotate(-90,26,58)">200</text>
    
    {/* ============ COTAS VERTICAIS DIREITA ============ */}
    {/* Placa gesso - 12.5mm */}
    <line x1="430" y1="212" x2="455" y2="212" stroke="#666" strokeWidth=".4"/>
    <line x1="430" y1="228" x2="455" y2="228" stroke="#666" strokeWidth=".4"/>
    <line x1="448" y1="212" x2="448" y2="228" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="462" y="222" fill="#333" fontSize="6" fontFamily="monospace" fontWeight="500">12.5</text>
    
    {/* Perfil primário - altura */}
    <line x1="410" y1="193" x2="425" y2="193" stroke="#666" strokeWidth=".4"/>
    <line x1="410" y1="200" x2="425" y2="200" stroke="#666" strokeWidth=".4"/>
    <text x="430" y="198" fill="#555" fontSize="5" fontFamily="monospace">47</text>
    
    {/* ============ COTAS HORIZONTAIS (BAIXO) ============ */}
    {/* Afastamento pendurais - ≤1200mm */}
    <line x1="150" y1="240" x2="150" y2="255" stroke="#666" strokeWidth=".4"/>
    <line x1="350" y1="240" x2="350" y2="255" stroke="#666" strokeWidth=".4"/>
    <line x1="150" y1="248" x2="350" y2="248" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="250" y="262" fill="#333" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="500">≤1200</text>
    
    {/* Afastamento perfis secundários */}
    <line x1="200" y1="268" x2="200" y2="280" stroke="#666" strokeWidth=".4"/>
    <line x1="300" y1="268" x2="300" y2="280" stroke="#666" strokeWidth=".4"/>
    <line x1="200" y1="274" x2="300" y2="274" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="250" y="288" fill="#555" fontSize="5" textAnchor="middle" fontFamily="monospace">≤500</text>
    
    {/* NOTAS */}
    <text x="40" y="318" fill="#444" fontSize="7" fontWeight="500">① Pendurais @≤1200mm. Perfis primários F47 perpendiculares às placas.</text>
    <text x="40" y="330" fill="#444" fontSize="7" fontWeight="500">② Perfis secundários CD60 @≤500mm, paralelos às placas. Placa BA13 standard 12.5mm.</text>
  </svg>
);

// ============================================================
// G.01 — Caixa Eléctrica em Parede (CORRIGIDO v2)
// Cotas totais e parciais completas
// ============================================================
export const G01: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 500 375" className={className}>
    <SVGDefs />
    
    {/* PLACA ESQUERDA - 12.5mm */}
    <rect x="100" y="40" width="16" height="295" fill="url(#pg)"/>
    <line x1="100" y1="40" x2="100" y2="335" stroke="#333" strokeWidth="2"/>
    <line x1="116" y1="40" x2="116" y2="335" stroke="#444" strokeWidth="1.2"/>
    
    {/* CAVIDADE - 80mm (incluindo montantes) */}
    <rect x="116" y="40" width="80" height="295" fill="#fafaf8"/>
    <line x1="116" y1="40" x2="116" y2="335" stroke="#555" strokeWidth="1"/>
    <line x1="196" y1="40" x2="196" y2="335" stroke="#555" strokeWidth="1"/>
    
    {/* MONTANTES C48 */}
    <rect x="116" y="40" width="5" height="295" fill="url(#ps)"/>
    <rect x="191" y="40" width="5" height="295" fill="url(#ps)"/>
    
    {/* PLACA DIREITA - 12.5mm */}
    <rect x="196" y="40" width="16" height="295" fill="url(#pg)"/>
    <line x1="196" y1="40" x2="196" y2="335" stroke="#444" strokeWidth="1.2"/>
    <line x1="212" y1="40" x2="212" y2="335" stroke="#333" strokeWidth="2"/>
    
    {/* TUBO CORRUGADO Ø20 */}
    <line x1="109" y1="40" x2="109" y2="155" stroke="#666" strokeWidth="4" strokeDasharray="6,4"/>
    <line x1="109" y1="215" x2="109" y2="335" stroke="#666" strokeWidth="4" strokeDasharray="6,4"/>
    
    {/* CABO */}
    <path d="M109,60 L109,155" stroke="#c8a96e" strokeWidth="1.5"/>
    <path d="M109,215 L109,280" stroke="#c8a96e" strokeWidth="1.5"/>
    
    {/* CAIXA ELÉCTRICA - 60mm altura */}
    <rect x="102" y="155" width="14" height="60" fill="#ffffff" stroke="#333" strokeWidth="1.5" rx="2"/>
    
    {/* ESPELHO/MECANISMO */}
    <rect x="96" y="165" width="4" height="40" fill="url(#ps)"/>
    <line x1="96" y1="165" x2="100" y2="165" stroke="#444" strokeWidth="1"/>
    <line x1="96" y1="205" x2="100" y2="205" stroke="#444" strokeWidth="1"/>
    
    {/* ============ COTAS HORIZONTAIS (TOPO) ============ */}
    {/* Cota TOTAL parede */}
    <line x1="100" y1="25" x2="100" y2="38" stroke="#666" strokeWidth=".4"/>
    <line x1="212" y1="25" x2="212" y2="38" stroke="#666" strokeWidth=".4"/>
    <line x1="100" y1="30" x2="212" y2="30" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="156" y="24" fill="#333" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="500">112</text>
    
    {/* Cotas PARCIAIS */}
    <line x1="116" y1="32" x2="116" y2="40" stroke="#666" strokeWidth=".4"/>
    <line x1="196" y1="32" x2="196" y2="40" stroke="#666" strokeWidth=".4"/>
    <text x="108" y="50" fill="#555" fontSize="4.5" textAnchor="middle" fontFamily="monospace">12.5</text>
    <text x="156" y="50" fill="#555" fontSize="4.5" textAnchor="middle" fontFamily="monospace">80</text>
    <text x="204" y="50" fill="#555" fontSize="4.5" textAnchor="middle" fontFamily="monospace">12.5</text>
    
    {/* ============ COTAS VERTICAIS ESQUERDA ============ */}
    {/* Caixa eléctrica - 60mm */}
    <line x1="70" y1="155" x2="85" y2="155" stroke="#666" strokeWidth=".4"/>
    <line x1="70" y1="215" x2="85" y2="215" stroke="#666" strokeWidth=".4"/>
    <line x1="78" y1="155" x2="78" y2="215" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="65" y="188" fill="#333" fontSize="6" textAnchor="end" fontFamily="monospace" fontWeight="500">60</text>
    
    {/* Espelho/mecanismo - 40mm */}
    <line x1="82" y1="165" x2="94" y2="165" stroke="#666" strokeWidth=".4"/>
    <line x1="82" y1="205" x2="94" y2="205" stroke="#666" strokeWidth=".4"/>
    <text x="88" y="188" fill="#555" fontSize="5" textAnchor="middle" fontFamily="monospace" transform="rotate(-90,88,188)">40</text>
    
    {/* ============ COTAS VERTICAIS DIREITA ============ */}
    {/* Altura tomada standard - 300mm do chão */}
    <line x1="220" y1="185" x2="260" y2="185" stroke="#666" strokeWidth=".4"/>
    <line x1="220" y1="335" x2="260" y2="335" stroke="#666" strokeWidth=".4"/>
    <line x1="240" y1="185" x2="240" y2="335" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="265" y="265" fill="#333" fontSize="6" fontFamily="monospace" fontWeight="500">300</text>
    <text x="265" y="275" fill="#555" fontSize="5" fontStyle="italic">(tomada)</text>
    
    {/* Indicação */}
    <text x="300" y="340" fill="#555" fontSize="7" fontStyle="italic" fontWeight="500">corte vertical — tomada eléctrica</text>
    
    {/* NOTAS */}
    <text x="300" y="55" fill="#444" fontSize="7" fontWeight="500">① Caixa funda encastrada entre montantes.</text>
    <text x="300" y="67" fill="#444" fontSize="7" fontWeight="500">② Tubo corrugado Ø20mm (mín.) para cabos.</text>
    <text x="300" y="79" fill="#444" fontSize="7" fontWeight="500">③ Altura tomada: 300mm (standard).</text>
  </svg>
);

// ============================================================
// I.01 — Nariz de Degrau (CORRIGIDO v2)
// Cotas totais e parciais completas
// ============================================================
export const I01: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 500 375" className={className}>
    <SVGDefs />
    
    {/* BETÃO ESTRUTURAL - degrau inferior */}
    <polygon points="30,195 290,195 290,355 30,355" fill="url(#pc)"/>
    <line x1="30" y1="195" x2="290" y2="195" stroke="#333" strokeWidth="2"/>
    <line x1="290" y1="195" x2="290" y2="355" stroke="#333" strokeWidth="2"/>
    <line x1="30" y1="355" x2="290" y2="355" stroke="#555" strokeWidth="1"/>
    
    {/* BETÃO ESTRUTURAL - degrau superior */}
    <polygon points="290,30 470,30 470,195 290,195" fill="url(#pc)"/>
    <line x1="290" y1="30" x2="470" y2="30" stroke="#555" strokeWidth="1"/>
    <line x1="470" y1="30" x2="470" y2="195" stroke="#555" strokeWidth="1"/>
    <line x1="290" y1="30" x2="290" y2="195" stroke="#333" strokeWidth="2"/>
    
    {/* COLA sob cobertor inferior - 3mm */}
    <rect x="30" y="189" width="285" height="6" fill="#d8d4ca"/>
    
    {/* COBERTOR inferior - madeira 12mm */}
    <rect x="30" y="165" width="290" height="24" fill="url(#pw)"/>
    <line x1="30" y1="165" x2="320" y2="165" stroke="#333" strokeWidth="1.5"/>
    <line x1="30" y1="189" x2="290" y2="189" stroke="#444" strokeWidth="1"/>
    
    {/* NARIZ arredondado - avanço 25mm */}
    <path d="M320,165 Q338,165 338,183 L338,195" fill="url(#pw)"/>
    <path d="M320,165 Q338,165 338,183 L338,195" fill="none" stroke="#333" strokeWidth="1.5"/>
    <line x1="290" y1="195" x2="338" y2="195" stroke="#555" strokeWidth=".8"/>
    
    {/* PERFIL ANTI-DERRAPANTE */}
    <rect x="300" y="162" width="20" height="3" fill="url(#ps)"/>
    <line x1="300" y1="162" x2="320" y2="162" stroke="#444" strokeWidth=".8"/>
    <line x1="300" y1="165" x2="320" y2="165" stroke="#444" strokeWidth=".8"/>
    
    {/* ESPELHO - 7mm */}
    <rect x="283" y="35" width="7" height="130" fill="url(#pw)"/>
    <line x1="283" y1="35" x2="283" y2="165" stroke="#333" strokeWidth="1.5"/>
    <line x1="290" y1="35" x2="290" y2="165" stroke="#444" strokeWidth=".8"/>
    
    {/* COLA atrás do espelho - 3mm */}
    <rect x="290" y="35" width="6" height="130" fill="#d8d4ca"/>
    
    {/* COBERTOR superior - madeira 12mm */}
    <rect x="290" y="20" width="180" height="6" fill="#d8d4ca"/>
    <rect x="290" y="-4" width="180" height="24" fill="url(#pw)"/>
    <line x1="290" y1="-4" x2="470" y2="-4" stroke="#333" strokeWidth="1.5"/>
    <line x1="290" y1="20" x2="470" y2="20" stroke="#444" strokeWidth="1"/>
    
    {/* ============ COTAS HORIZONTAIS (TOPO - COBERTOR) ============ */}
    {/* Cobertor comprimento - 290mm */}
    <line x1="30" y1="150" x2="30" y2="162" stroke="#666" strokeWidth=".4"/>
    <line x1="320" y1="150" x2="320" y2="162" stroke="#666" strokeWidth=".4"/>
    <line x1="30" y1="155" x2="320" y2="155" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="175" y="148" fill="#333" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="500">290</text>
    
    {/* ============ COTAS HORIZONTAIS (BAIXO - NARIZ) ============ */}
    {/* Avanço nariz - 25mm */}
    <line x1="290" y1="205" x2="290" y2="220" stroke="#666" strokeWidth=".4"/>
    <line x1="338" y1="205" x2="338" y2="220" stroke="#666" strokeWidth=".4"/>
    <line x1="290" y1="212" x2="338" y2="212" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="314" y="228" fill="#333" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="500">25</text>
    
    {/* ============ COTAS VERTICAIS ESQUERDA ============ */}
    {/* Espessura cobertor - 12mm */}
    <line x1="15" y1="165" x2="28" y2="165" stroke="#666" strokeWidth=".4"/>
    <line x1="15" y1="189" x2="28" y2="189" stroke="#666" strokeWidth=".4"/>
    <line x1="22" y1="165" x2="22" y2="189" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="10" y="180" fill="#333" fontSize="6" textAnchor="end" fontFamily="monospace" fontWeight="500">12</text>
    
    {/* Cola - 3mm */}
    <text x="10" y="193" fill="#555" fontSize="4" textAnchor="end" fontFamily="monospace">+3 cola</text>
    
    {/* ============ COTAS VERTICAIS DIREITA ============ */}
    {/* Espelho altura - 175mm */}
    <line x1="350" y1="20" x2="365" y2="20" stroke="#666" strokeWidth=".4"/>
    <line x1="350" y1="195" x2="365" y2="195" stroke="#666" strokeWidth=".4"/>
    <line x1="358" y1="20" x2="358" y2="195" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="372" y="112" fill="#333" fontSize="6" fontFamily="monospace" fontWeight="500">175</text>
    
    {/* Cotas parciais espelho */}
    <line x1="350" y1="35" x2="358" y2="35" stroke="#666" strokeWidth=".4"/>
    <line x1="350" y1="165" x2="358" y2="165" stroke="#666" strokeWidth=".4"/>
    <text x="345" y="28" fill="#555" fontSize="5" textAnchor="end" fontFamily="monospace">12 cob.</text>
    <text x="345" y="105" fill="#555" fontSize="5" textAnchor="end" fontFamily="monospace">130 esp.</text>
    <text x="345" y="180" fill="#555" fontSize="5" textAnchor="end" fontFamily="monospace">12 cob.</text>
    
    {/* Espessura espelho - 7mm */}
    <line x1="283" y1="25" x2="283" y2="33" stroke="#666" strokeWidth=".4"/>
    <line x1="290" y1="25" x2="290" y2="33" stroke="#666" strokeWidth=".4"/>
    <text x="286" y="22" fill="#555" fontSize="5" textAnchor="middle" fontFamily="monospace">7</text>
    
    {/* ============ COTAS ESTRUTURA ============ */}
    {/* Altura degrau betão */}
    <line x1="478" y1="30" x2="492" y2="30" stroke="#666" strokeWidth=".4"/>
    <line x1="478" y1="195" x2="492" y2="195" stroke="#666" strokeWidth=".4"/>
    <line x1="485" y1="30" x2="485" y2="195" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="498" y="118" fill="#333" fontSize="6" fontFamily="monospace" fontWeight="500">165</text>
    <text x="498" y="128" fill="#555" fontSize="5" fontStyle="italic">estrut.</text>
    
    {/* Indicação */}
    <text x="250" y="340" fill="#555" fontSize="7" textAnchor="middle" fontStyle="italic" fontWeight="500">corte vertical — nariz de degrau em madeira</text>
    
    {/* NOTAS */}
    <text x="30" y="318" fill="#444" fontSize="7" fontWeight="500">① Cobertor madeira maciça 12mm colado. Nariz arredondado R≈15mm.</text>
    <text x="30" y="330" fill="#444" fontSize="7" fontWeight="500">② Espelho madeira 7mm. Perfil anti-derrapante em alumínio no nariz.</text>
  </svg>
);

// ============================================================
// G.04 — Sanita Suspensa (Estrutura autoportante)
// Corte vertical — Sistema tipo Geberit Duofix
// ============================================================
export const G04: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 500 375" className={className}>
    <SVGDefs />
    
    {/* LAJE ESTRUTURAL - base */}
    <rect x="30" y="320" width="440" height="35" fill="url(#pc)"/>
    <line x1="30" y1="320" x2="470" y2="320" stroke="#333" strokeWidth="2"/>
    
    {/* PAREDE SUPORTE (betão/alvenaria) - atrás */}
    <rect x="30" y="30" width="40" height="290" fill="url(#pc)"/>
    <line x1="70" y1="30" x2="70" y2="320" stroke="#333" strokeWidth="2"/>
    
    {/* ESTRUTURA AUTOPORTANTE - Geberit Duofix */}
    <rect x="70" y="60" width="8" height="260" fill="url(#ps)"/>
    <rect x="150" y="60" width="8" height="260" fill="url(#ps)"/>
    {/* Travessas horizontais */}
    <rect x="70" y="60" width="88" height="6" fill="url(#ps)"/>
    <rect x="70" y="140" width="88" height="6" fill="url(#ps)"/>
    <rect x="70" y="200" width="88" height="6" fill="url(#ps)"/>
    
    {/* RESERVATÓRIO embutido */}
    <rect x="82" y="70" width="60" height="65" fill="#e8f4fc" stroke="#666" strokeWidth="1.5" rx="3"/>
    <text x="112" y="105" fill="#666" fontSize="7" textAnchor="middle" fontWeight="500">6/3L</text>
    
    {/* PLACA DE COMANDO - abertura */}
    <rect x="158" y="85" width="4" height="40" fill="#fff" stroke="#444" strokeWidth="1"/>
    <circle cx="160" cy="100" r="6" fill="none" stroke="#888" strokeWidth="1"/>
    <circle cx="160" cy="115" r="4" fill="none" stroke="#888" strokeWidth="1"/>
    
    {/* TUBAGEM DESCARGA Ø90 */}
    <ellipse cx="112" cy="240" rx="12" ry="12" fill="#fff" stroke="#666" strokeWidth="1.5"/>
    <ellipse cx="112" cy="240" rx="8" ry="8" fill="#e0e0e0"/>
    <line x1="112" y1="252" x2="112" y2="320" stroke="#666" strokeWidth="3"/>
    
    {/* VARÕES ROSCADOS M12 */}
    <line x1="95" y1="206" x2="95" y2="260" stroke="#555" strokeWidth="2"/>
    <line x1="130" y1="206" x2="130" y2="260" stroke="#555" strokeWidth="2"/>
    <circle cx="95" cy="260" r="3" fill="#888"/>
    <circle cx="130" cy="260" r="3" fill="#888"/>
    
    {/* PLACA GESSO H1 - 2×12.5mm = 25mm */}
    <rect x="158" y="30" width="25" height="290" fill="url(#pgh1)"/>
    <line x1="158" y1="30" x2="158" y2="320" stroke="#444" strokeWidth="1.2"/>
    <line x1="183" y1="30" x2="183" y2="320" stroke="#333" strokeWidth="2"/>
    
    {/* REVESTIMENTO CERÂMICO */}
    <rect x="183" y="30" width="12" height="290" fill="url(#pk)"/>
    <line x1="195" y1="30" x2="195" y2="320" stroke="#444" strokeWidth="1"/>
    
    {/* SANITA SUSPENSA */}
    <ellipse cx="280" cy="255" rx="65" ry="35" fill="#fff" stroke="#333" strokeWidth="2"/>
    <ellipse cx="280" cy="255" rx="50" ry="25" fill="#f8f8f8" stroke="#666" strokeWidth="1"/>
    {/* Ligação à parede */}
    <rect x="195" y="235" width="25" height="40" fill="#fff" stroke="#333" strokeWidth="1.5"/>
    
    {/* PAVIMENTO CERÂMICO */}
    <rect x="70" y="305" width="400" height="15" fill="url(#pk)"/>
    <line x1="70" y1="305" x2="470" y2="305" stroke="#444" strokeWidth="1"/>
    
    {/* ============ COTAS ============ */}
    {/* Altura sanita - 420mm */}
    <line x1="360" y1="255" x2="380" y2="255" stroke="#666" strokeWidth=".4"/>
    <line x1="360" y1="305" x2="380" y2="305" stroke="#666" strokeWidth=".4"/>
    <line x1="370" y1="255" x2="370" y2="305" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="385" y="283" fill="#333" fontSize="6" fontFamily="monospace" fontWeight="500">420</text>
    
    {/* Altura placa comando - 1050mm */}
    <line x1="168" y1="105" x2="190" y2="105" stroke="#666" strokeWidth=".4"/>
    <line x1="190" y1="105" x2="190" y2="305" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="200" y="200" fill="#333" fontSize="6" fontFamily="monospace" fontWeight="500">1050</text>
    
    {/* Profundidade estrutura */}
    <line x1="70" y1="20" x2="70" y2="28" stroke="#666" strokeWidth=".4"/>
    <line x1="158" y1="20" x2="158" y2="28" stroke="#666" strokeWidth=".4"/>
    <line x1="70" y1="24" x2="158" y2="24" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="114" y="17" fill="#333" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="500">120</text>
    
    {/* Indicação */}
    <text x="300" y="355" fill="#555" fontSize="7" textAnchor="middle" fontStyle="italic" fontWeight="500">corte vertical — sanita suspensa c/ estrutura autoportante</text>
    
    {/* NOTAS */}
    <text x="250" y="45" fill="#444" fontSize="7" fontWeight="500">① Estrutura autoportante fixada à laje e parede suporte.</text>
    <text x="250" y="57" fill="#444" fontSize="7" fontWeight="500">② Reservatório 6/3L embutido. Placa comando a ~1050mm.</text>
    <text x="250" y="69" fill="#444" fontSize="7" fontWeight="500">③ Placa H1 obrigatória. Sanita a 400-450mm do NPA.</text>
  </svg>
);

// ============================================================
// G.05 — Lavatório Suspenso
// Corte vertical — Fixação com reforço em parede gesso
// ============================================================
export const G05: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 500 375" className={className}>
    <SVGDefs />
    
    {/* PAREDE - Estrutura */}
    {/* Placa esquerda */}
    <rect x="80" y="30" width="25" height="300" fill="url(#pgh1)"/>
    <line x1="80" y1="30" x2="80" y2="330" stroke="#333" strokeWidth="2"/>
    <line x1="105" y1="30" x2="105" y2="330" stroke="#444" strokeWidth="1"/>
    
    {/* Cavidade com montantes */}
    <rect x="105" y="30" width="70" height="300" fill="#fafaf8"/>
    <rect x="105" y="30" width="6" height="300" fill="url(#ps)"/>
    <rect x="169" y="30" width="6" height="300" fill="url(#ps)"/>
    
    {/* TRAVESSA DE REFORÇO - zona fixação lavatório */}
    <rect x="105" y="130" width="70" height="30" fill="url(#ps)"/>
    <line x1="105" y1="130" x2="175" y2="130" stroke="#555" strokeWidth="1"/>
    <line x1="105" y1="160" x2="175" y2="160" stroke="#555" strokeWidth="1"/>
    <text x="140" y="150" fill="#fff" fontSize="6" textAnchor="middle" fontWeight="500">REFORÇO</text>
    
    {/* Placa direita */}
    <rect x="175" y="30" width="25" height="300" fill="url(#pgh1)"/>
    <line x1="175" y1="30" x2="175" y2="330" stroke="#444" strokeWidth="1"/>
    <line x1="200" y1="30" x2="200" y2="330" stroke="#333" strokeWidth="2"/>
    
    {/* REVESTIMENTO CERÂMICO */}
    <rect x="200" y="30" width="12" height="300" fill="url(#pk)"/>
    <line x1="212" y1="30" x2="212" y2="330" stroke="#444" strokeWidth="1"/>
    
    {/* LAVATÓRIO SUSPENSO */}
    <path d="M212,145 L320,145 Q340,145 340,165 L340,180 Q340,200 320,200 L250,200 L250,210 L280,210 L280,200" fill="#fff" stroke="#333" strokeWidth="2"/>
    <ellipse cx="280" cy="172" rx="40" ry="20" fill="#f0f0f0" stroke="#666" strokeWidth="1"/>
    
    {/* FIXAÇÃO - parafusos M10 */}
    <line x1="200" y1="145" x2="212" y2="145" stroke="#333" strokeWidth="3"/>
    <circle cx="206" cy="145" r="4" fill="#888" stroke="#333" strokeWidth="1"/>
    
    {/* SIFÃO GARRAFA */}
    <rect x="273" y="210" width="14" height="50" fill="#ccc" stroke="#666" strokeWidth="1" rx="2"/>
    <ellipse cx="280" cy="260" rx="12" ry="6" fill="#bbb" stroke="#666" strokeWidth="1"/>
    <line x1="280" y1="266" x2="280" y2="290" stroke="#666" strokeWidth="4"/>
    <line x1="280" y1="290" x2="320" y2="290" stroke="#666" strokeWidth="4"/>
    
    {/* TORNEIRA */}
    <rect x="255" y="115" width="10" height="30" fill="#ccc" stroke="#666" strokeWidth="1" rx="2"/>
    <ellipse cx="260" cy="112" rx="8" ry="4" fill="#ddd" stroke="#666" strokeWidth="1"/>
    
    {/* TUBAGENS - água */}
    <line x1="140" y1="100" x2="140" y2="130" stroke="#4a90d9" strokeWidth="3"/>
    <line x1="160" y1="100" x2="160" y2="130" stroke="#d94a4a" strokeWidth="3"/>
    <text x="140" y="95" fill="#4a90d9" fontSize="5" textAnchor="middle">AF</text>
    <text x="160" y="95" fill="#d94a4a" fontSize="5" textAnchor="middle">AQ</text>
    
    {/* PAVIMENTO */}
    <rect x="80" y="330" width="390" height="25" fill="url(#pc)"/>
    <line x1="80" y1="330" x2="470" y2="330" stroke="#333" strokeWidth="2"/>
    <rect x="200" y="315" width="270" height="15" fill="url(#pk)"/>
    <line x1="200" y1="315" x2="470" y2="315" stroke="#444" strokeWidth="1"/>
    
    {/* ============ COTAS ============ */}
    {/* Altura lavatório - 850mm */}
    <line x1="360" y1="145" x2="380" y2="145" stroke="#666" strokeWidth=".4"/>
    <line x1="360" y1="315" x2="380" y2="315" stroke="#666" strokeWidth=".4"/>
    <line x1="370" y1="145" x2="370" y2="315" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="385" y="235" fill="#333" fontSize="6" fontFamily="monospace" fontWeight="500">850</text>
    
    {/* Altura travessa reforço */}
    <line x1="50" y1="130" x2="78" y2="130" stroke="#666" strokeWidth=".4"/>
    <line x1="50" y1="160" x2="78" y2="160" stroke="#666" strokeWidth=".4"/>
    <line x1="60" y1="130" x2="60" y2="160" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="45" y="148" fill="#333" fontSize="6" textAnchor="end" fontFamily="monospace" fontWeight="500">30</text>
    
    {/* Espessura parede */}
    <line x1="80" y1="20" x2="80" y2="28" stroke="#666" strokeWidth=".4"/>
    <line x1="200" y1="20" x2="200" y2="28" stroke="#666" strokeWidth=".4"/>
    <line x1="80" y1="24" x2="200" y2="24" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="140" y="17" fill="#333" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="500">120</text>
    
    {/* Indicação */}
    <text x="300" y="365" fill="#555" fontSize="7" textAnchor="middle" fontStyle="italic" fontWeight="500">corte vertical — lavatório suspenso c/ reforço</text>
    
    {/* NOTAS */}
    <text x="250" y="45" fill="#444" fontSize="7" fontWeight="500">① Travessa metálica horizontal entre montantes (750-900mm).</text>
    <text x="250" y="57" fill="#444" fontSize="7" fontWeight="500">② Fixação c/ parafusos M10. Carga ≥150 kg.</text>
    <text x="250" y="69" fill="#444" fontSize="7" fontWeight="500">③ Placa H1 obrigatória. Sifão acessível.</text>
  </svg>
);

// ============================================================
// F.05 — Nicho de Duche
// Corte vertical — Recesso impermeabilizado em parede
// ============================================================
export const F05: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 500 375" className={className}>
    <SVGDefs />
    
    {/* PAREDE PRINCIPAL - Estrutura */}
    {/* Placa exterior (fora duche) */}
    <rect x="60" y="30" width="25" height="320" fill="url(#pg)"/>
    <line x1="60" y1="30" x2="60" y2="350" stroke="#333" strokeWidth="2"/>
    <line x1="85" y1="30" x2="85" y2="350" stroke="#444" strokeWidth="1"/>
    
    {/* Cavidade */}
    <rect x="85" y="30" width="80" height="320" fill="#fafaf8"/>
    <rect x="85" y="30" width="6" height="320" fill="url(#ps)"/>
    <rect x="159" y="30" width="6" height="320" fill="url(#ps)"/>
    
    {/* Placa interior (lado duche) - H1 */}
    <rect x="165" y="30" width="25" height="100" fill="url(#pgh1)"/>
    <rect x="165" y="230" width="25" height="120" fill="url(#pgh1)"/>
    <line x1="165" y1="30" x2="165" y2="130" stroke="#444" strokeWidth="1"/>
    <line x1="165" y1="230" x2="165" y2="350" stroke="#444" strokeWidth="1"/>
    <line x1="190" y1="30" x2="190" y2="130" stroke="#333" strokeWidth="2"/>
    <line x1="190" y1="230" x2="190" y2="350" stroke="#333" strokeWidth="2"/>
    
    {/* ============ NICHO ============ */}
    {/* Fundo do nicho - placa H1 */}
    <rect x="105" y="130" width="60" height="100" fill="url(#pgh1)"/>
    <line x1="105" y1="130" x2="165" y2="130" stroke="#444" strokeWidth="1"/>
    <line x1="105" y1="230" x2="165" y2="230" stroke="#444" strokeWidth="1"/>
    <line x1="105" y1="130" x2="105" y2="230" stroke="#444" strokeWidth="1"/>
    
    {/* Impermeabilização - membrana azul (contínua) */}
    <rect x="103" y="128" width="64" height="104" fill="none" stroke="#4a90d9" strokeWidth="3" strokeDasharray="6,3"/>
    <line x1="188" y1="30" x2="188" y2="128" stroke="#4a90d9" strokeWidth="3" strokeDasharray="6,3"/>
    <line x1="188" y1="232" x2="188" y2="350" stroke="#4a90d9" strokeWidth="3" strokeDasharray="6,3"/>
    
    {/* REVESTIMENTO CERÂMICO */}
    {/* Parede acima nicho */}
    <rect x="190" y="30" width="12" height="100" fill="url(#pk)"/>
    {/* Parede abaixo nicho */}
    <rect x="190" y="230" width="12" height="120" fill="url(#pk)"/>
    {/* Fundo nicho */}
    <rect x="107" y="132" width="10" height="96" fill="url(#pk)"/>
    {/* Topo nicho */}
    <rect x="117" y="132" width="85" height="10" fill="url(#pk)"/>
    {/* Base nicho - inclinada 2% */}
    <polygon points="117,220 202,218 202,228 117,228" fill="url(#pk)"/>
    
    {/* Perfil esquineiro - arestas */}
    <line x1="117" y1="132" x2="117" y2="228" stroke="#888" strokeWidth="2"/>
    <line x1="117" y1="142" x2="202" y2="142" stroke="#888" strokeWidth="2"/>
    <line x1="117" y1="218" x2="202" y2="216" stroke="#888" strokeWidth="2"/>
    
    {/* Inclinação 2% - seta indicativa */}
    <path d="M140,223 L180,221" stroke="#d94a4a" strokeWidth="1.5" markerEnd="url(#arrow)"/>
    <text x="160" y="238" fill="#d94a4a" fontSize="6" textAnchor="middle" fontWeight="500">2%</text>
    
    {/* ÁREA DUCHE - lado direito */}
    <rect x="202" y="30" width="268" height="320" fill="#f0f8ff" opacity="0.3"/>
    <text x="336" y="180" fill="#4a90d9" fontSize="10" textAnchor="middle" opacity="0.5">ZONA DUCHE</text>
    
    {/* ============ COTAS ============ */}
    {/* Profundidade nicho - 85mm */}
    <line x1="105" y1="115" x2="105" y2="125" stroke="#666" strokeWidth=".4"/>
    <line x1="190" y1="115" x2="190" y2="125" stroke="#666" strokeWidth=".4"/>
    <line x1="105" y1="120" x2="190" y2="120" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="147" y="113" fill="#333" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="500">85</text>
    
    {/* Altura nicho - 100mm */}
    <line x1="220" y1="142" x2="235" y2="142" stroke="#666" strokeWidth=".4"/>
    <line x1="220" y1="218" x2="235" y2="218" stroke="#666" strokeWidth=".4"/>
    <line x1="228" y1="142" x2="228" y2="218" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="245" y="183" fill="#333" fontSize="6" fontFamily="monospace" fontWeight="500">300</text>
    
    {/* Largura nicho interna */}
    <line x1="117" y1="250" x2="117" y2="265" stroke="#666" strokeWidth=".4"/>
    <line x1="202" y1="250" x2="202" y2="265" stroke="#666" strokeWidth=".4"/>
    <line x1="117" y1="258" x2="202" y2="258" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="160" y="275" fill="#333" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="500">~400</text>
    
    {/* Espessura parede */}
    <line x1="60" y1="20" x2="60" y2="28" stroke="#666" strokeWidth=".4"/>
    <line x1="190" y1="20" x2="190" y2="28" stroke="#666" strokeWidth=".4"/>
    <line x1="60" y1="24" x2="190" y2="24" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="125" y="17" fill="#333" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="500">130</text>
    
    {/* Indicação */}
    <text x="250" y="365" fill="#555" fontSize="7" textAnchor="middle" fontStyle="italic" fontWeight="500">corte vertical — nicho de duche impermeabilizado</text>
    
    {/* NOTAS */}
    <text x="270" y="55" fill="#444" fontSize="7" fontWeight="500">① Impermeabilização contínua: fundo + laterais.</text>
    <text x="270" y="67" fill="#444" fontSize="7" fontWeight="500">② Inclinação 2% na base para drenagem.</text>
    <text x="270" y="79" fill="#444" fontSize="7" fontWeight="500">③ Perfil esquineiro em todas as arestas.</text>
    
    {/* LEGENDA IMPERMEABILIZAÇÃO */}
    <line x1="270" y1="295" x2="290" y2="295" stroke="#4a90d9" strokeWidth="3" strokeDasharray="6,3"/>
    <text x="295" y="298" fill="#4a90d9" fontSize="6">Membrana impermeab.</text>
  </svg>
);

// ============================================================
// B.02 — Sanca de Iluminação Indireta
// Corte vertical — Desnível com fita LED
// ============================================================
export const B02: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 500 375" className={className}>
    <SVGDefs />
    
    {/* LAJE ESTRUTURAL */}
    <rect x="30" y="30" width="440" height="40" fill="url(#pc)"/>
    <line x1="30" y1="70" x2="470" y2="70" stroke="#333" strokeWidth="2"/>
    
    {/* PENDURAIS */}
    <line x1="100" y1="70" x2="100" y2="120" stroke="#666" strokeWidth="2"/>
    <line x1="250" y1="70" x2="250" y2="120" stroke="#666" strokeWidth="2"/>
    <line x1="400" y1="70" x2="400" y2="170" stroke="#666" strokeWidth="2"/>
    
    {/* PERFILARIA CD60 - teto principal */}
    <rect x="60" y="120" width="230" height="8" fill="url(#ps)"/>
    <rect x="340" y="170" width="120" height="8" fill="url(#ps)"/>
    
    {/* TETO FALSO PRINCIPAL - nível superior */}
    <rect x="60" y="128" width="230" height="16" fill="url(#pg)"/>
    <line x1="60" y1="144" x2="290" y2="144" stroke="#333" strokeWidth="1.5"/>
    
    {/* TETO FALSO - nível inferior (sanca) */}
    <rect x="340" y="178" width="120" height="16" fill="url(#pg)"/>
    <line x1="340" y1="194" x2="460" y2="194" stroke="#333" strokeWidth="1.5"/>
    
    {/* DESCIDA VERTICAL SANCA */}
    <rect x="290" y="128" width="16" height="66" fill="url(#pg)"/>
    <line x1="290" y1="128" x2="290" y2="194" stroke="#333" strokeWidth="1.5"/>
    <line x1="306" y1="144" x2="306" y2="178" stroke="#444" strokeWidth="1"/>
    
    {/* ABA HORIZONTAL SANCA */}
    <rect x="306" y="162" width="34" height="16" fill="url(#pg)"/>
    <line x1="306" y1="162" x2="340" y2="162" stroke="#444" strokeWidth="1"/>
    <line x1="306" y1="178" x2="340" y2="178" stroke="#333" strokeWidth="1.5"/>
    
    {/* FITA LED */}
    <rect x="310" y="175" width="25" height="3" fill="#ffeb3b" stroke="#ffc107" strokeWidth="1"/>
    <line x1="310" y1="176" x2="335" y2="176" stroke="#fff" strokeWidth="1" opacity="0.8"/>
    
    {/* Luz difusa */}
    <path d="M315,175 L280,130 M320,175 L290,135 M325,175 L300,140 M330,175 L310,145" 
          stroke="#fff8c4" strokeWidth="2" opacity="0.4"/>
    
    {/* ============ COTAS ============ */}
    {/* Desnível - 50mm */}
    <line x1="250" y1="144" x2="270" y2="144" stroke="#666" strokeWidth=".4"/>
    <line x1="250" y1="194" x2="270" y2="194" stroke="#666" strokeWidth=".4"/>
    <line x1="260" y1="144" x2="260" y2="194" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="275" y="172" fill="#333" fontSize="6" fontFamily="monospace" fontWeight="500">50</text>
    
    {/* Abertura sanca - 120mm */}
    <line x1="306" y1="200" x2="306" y2="215" stroke="#666" strokeWidth=".4"/>
    <line x1="340" y1="200" x2="340" y2="215" stroke="#666" strokeWidth=".4"/>
    <line x1="306" y1="208" x2="340" y2="208" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="323" y="225" fill="#333" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="500">120</text>
    
    {/* Indicação */}
    <text x="250" y="340" fill="#555" fontSize="7" textAnchor="middle" fontStyle="italic" fontWeight="500">corte vertical — sanca de iluminação indireta c/ fita LED</text>
    
    {/* NOTAS */}
    <text x="60" y="270" fill="#444" fontSize="7" fontWeight="500">① Fita LED 24V CRI≥90, recuada ~30mm do bordo.</text>
    <text x="60" y="282" fill="#444" fontSize="7" fontWeight="500">② Abertura sanca ≥120mm para difusão adequada.</text>
  </svg>
);

// ============================================================
// B.03 — Encontro Teto / Parede
// Corte vertical — Junta perimetral
// ============================================================
export const B03: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 500 375" className={className}>
    <SVGDefs />
    
    {/* PAREDE DIVISÓRIA */}
    <rect x="30" y="30" width="100" height="320" fill="url(#pg)"/>
    <line x1="30" y1="30" x2="30" y2="350" stroke="#333" strokeWidth="2"/>
    <line x1="130" y1="30" x2="130" y2="350" stroke="#333" strokeWidth="2"/>
    
    {/* Montantes na parede */}
    <rect x="45" y="30" width="6" height="320" fill="url(#ps)"/>
    <rect x="109" y="30" width="6" height="320" fill="url(#ps)"/>
    
    {/* LAJE ESTRUTURAL */}
    <rect x="130" y="30" width="340" height="50" fill="url(#pc)"/>
    <line x1="130" y1="80" x2="470" y2="80" stroke="#333" strokeWidth="2"/>
    
    {/* PENDURAL */}
    <line x1="300" y1="80" x2="300" y2="140" stroke="#666" strokeWidth="2"/>
    
    {/* PERFILARIA CD60 */}
    <rect x="140" y="140" width="320" height="8" fill="url(#ps)"/>
    
    {/* CANTONEIRA PERIMETRAL */}
    <rect x="130" y="148" width="10" height="20" fill="url(#ps)"/>
    <line x1="130" y1="148" x2="140" y2="148" stroke="#555" strokeWidth="1"/>
    <line x1="140" y1="148" x2="140" y2="168" stroke="#555" strokeWidth="1"/>
    
    {/* TETO FALSO */}
    <rect x="140" y="148" width="320" height="16" fill="url(#pg)"/>
    <line x1="140" y1="164" x2="460" y2="164" stroke="#333" strokeWidth="1.5"/>
    
    {/* JUNTA PERIMETRAL - ~5mm */}
    <rect x="130" y="148" width="10" height="16" fill="#fafaf8"/>
    <line x1="130" y1="148" x2="130" y2="164" stroke="#888" strokeWidth="1" strokeDasharray="3,2"/>
    
    {/* SELANTE */}
    <line x1="130" y1="156" x2="138" y2="156" stroke="#999" strokeWidth="4"/>
    
    {/* ============ COTAS ============ */}
    {/* Junta - 5mm */}
    <line x1="130" y1="172" x2="130" y2="185" stroke="#666" strokeWidth=".4"/>
    <line x1="140" y1="172" x2="140" y2="185" stroke="#666" strokeWidth=".4"/>
    <line x1="130" y1="180" x2="140" y2="180" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="135" y="195" fill="#333" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="500">~5</text>
    
    {/* Plenum */}
    <line x1="475" y1="80" x2="485" y2="80" stroke="#666" strokeWidth=".4"/>
    <line x1="475" y1="148" x2="485" y2="148" stroke="#666" strokeWidth=".4"/>
    <line x1="480" y1="80" x2="480" y2="148" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="490" y="118" fill="#333" fontSize="6" fontFamily="monospace" fontWeight="500">~70</text>
    
    {/* Indicação */}
    <text x="300" y="340" fill="#555" fontSize="7" textAnchor="middle" fontStyle="italic" fontWeight="500">corte vertical — junta perimetral teto/parede</text>
    
    {/* NOTAS */}
    <text x="180" y="220" fill="#444" fontSize="7" fontWeight="500">① Teto NÃO fixo à parede — junta livre ~5mm.</text>
    <text x="180" y="232" fill="#444" fontSize="7" fontWeight="500">② Selante acrílico flexível pintável.</text>
    <text x="180" y="244" fill="#444" fontSize="7" fontWeight="500">③ Cantoneira de remate perimetral.</text>
  </svg>
);

// ============================================================
// C.01 — Transição Cerâmico — Madeira
// Corte vertical — Perfil T de nivelamento
// ============================================================
export const C01: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 500 375" className={className}>
    <SVGDefs />
    
    {/* LAJE ESTRUTURAL */}
    <rect x="30" y="250" width="440" height="100" fill="url(#pc)"/>
    <line x1="30" y1="250" x2="470" y2="250" stroke="#333" strokeWidth="2"/>
    
    {/* BETONILHA */}
    <rect x="30" y="220" width="440" height="30" fill="url(#pm)"/>
    <line x1="30" y1="220" x2="470" y2="220" stroke="#444" strokeWidth="1"/>
    
    {/* ============ LADO CERÂMICO (esquerda) ============ */}
    {/* Cola */}
    <rect x="30" y="210" width="200" height="10" fill="#d8d4ca"/>
    
    {/* Cerâmico */}
    <rect x="30" y="190" width="200" height="20" fill="url(#pk)"/>
    <line x1="30" y1="190" x2="230" y2="190" stroke="#333" strokeWidth="1.5"/>
    
    {/* ============ LADO MADEIRA (direita) ============ */}
    {/* Underlay */}
    <rect x="270" y="215" width="200" height="5" fill="#e8e0d8"/>
    
    {/* Soalho */}
    <rect x="270" y="190" width="200" height="25" fill="url(#pw)"/>
    <line x1="270" y1="190" x2="470" y2="190" stroke="#333" strokeWidth="1.5"/>
    
    {/* Junta perimetral madeira */}
    <rect x="260" y="190" width="10" height="30" fill="#fafaf8"/>
    
    {/* ============ PERFIL TRANSIÇÃO T ============ */}
    <rect x="230" y="185" width="40" height="8" fill="url(#ps)"/>
    <rect x="245" y="193" width="10" height="27" fill="url(#ps)"/>
    <line x1="230" y1="185" x2="270" y2="185" stroke="#555" strokeWidth="1.5"/>
    <line x1="230" y1="193" x2="270" y2="193" stroke="#555" strokeWidth="1"/>
    
    {/* ============ COTAS ============ */}
    {/* Cerâmico - 20mm */}
    <line x1="15" y1="190" x2="28" y2="190" stroke="#666" strokeWidth=".4"/>
    <line x1="15" y1="210" x2="28" y2="210" stroke="#666" strokeWidth=".4"/>
    <line x1="22" y1="190" x2="22" y2="210" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="10" y="203" fill="#333" fontSize="6" textAnchor="end" fontFamily="monospace" fontWeight="500">20</text>
    
    {/* Cola - 5mm */}
    <text x="10" y="216" fill="#555" fontSize="5" textAnchor="end" fontFamily="monospace">+5</text>
    
    {/* Soalho - 14mm */}
    <line x1="475" y1="190" x2="488" y2="190" stroke="#666" strokeWidth=".4"/>
    <line x1="475" y1="215" x2="488" y2="215" stroke="#666" strokeWidth=".4"/>
    <line x1="482" y1="190" x2="482" y2="215" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="495" y="205" fill="#333" fontSize="6" fontFamily="monospace" fontWeight="500">14</text>
    
    {/* Junta madeira */}
    <line x1="260" y1="165" x2="260" y2="178" stroke="#666" strokeWidth=".4"/>
    <line x1="270" y1="165" x2="270" y2="178" stroke="#666" strokeWidth=".4"/>
    <line x1="260" y1="172" x2="270" y2="172" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="265" y="162" fill="#333" fontSize="5" textAnchor="middle" fontFamily="monospace">8-10</text>
    
    {/* Indicação */}
    <text x="250" y="340" fill="#555" fontSize="7" textAnchor="middle" fontStyle="italic" fontWeight="500">corte vertical — transição cerâmico/madeira c/ perfil T</text>
    
    {/* NOTAS */}
    <text x="100" y="130" fill="#444" fontSize="7" fontWeight="500">① NPA nivelado: desnível máx. ≤2mm.</text>
    <text x="100" y="142" fill="#444" fontSize="7" fontWeight="500">② Junta perimetral madeira 8-10mm.</text>
    <text x="100" y="154" fill="#444" fontSize="7" fontWeight="500">③ Perfil T alumínio anodizado.</text>
  </svg>
);

// ============================================================
// C.02 — Rodapé Embutido
// Corte vertical — Encastrado com shadow gap
// ============================================================
export const C02: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 500 375" className={className}>
    <SVGDefs />
    
    {/* PAREDE DIVISÓRIA - recuada para rodapé */}
    <rect x="100" y="30" width="25" height="200" fill="url(#pg)"/>
    <rect x="80" y="230" width="45" height="90" fill="url(#pg)"/>
    <line x1="100" y1="30" x2="100" y2="230" stroke="#333" strokeWidth="2"/>
    <line x1="125" y1="30" x2="125" y2="230" stroke="#444" strokeWidth="1"/>
    <line x1="80" y1="230" x2="100" y2="230" stroke="#333" strokeWidth="1.5"/>
    <line x1="80" y1="230" x2="80" y2="320" stroke="#333" strokeWidth="2"/>
    <line x1="125" y1="230" x2="125" y2="320" stroke="#444" strokeWidth="1"/>
    
    {/* SHADOW GAP - 4mm */}
    <rect x="100" y="226" width="25" height="4" fill="#222"/>
    
    {/* PERFIL RODAPÉ ALUMÍNIO */}
    <rect x="80" y="235" width="20" height="80" fill="url(#ps)"/>
    <line x1="80" y1="235" x2="100" y2="235" stroke="#555" strokeWidth="1.5"/>
    <line x1="100" y1="235" x2="100" y2="315" stroke="#555" strokeWidth="1"/>
    <line x1="80" y1="315" x2="100" y2="315" stroke="#555" strokeWidth="1.5"/>
    
    {/* LAJE */}
    <rect x="30" y="320" width="440" height="35" fill="url(#pc)"/>
    <line x1="30" y1="320" x2="470" y2="320" stroke="#333" strokeWidth="2"/>
    
    {/* BETONILHA */}
    <rect x="125" y="300" width="345" height="20" fill="url(#pm)"/>
    
    {/* PAVIMENTO CERÂMICO */}
    <rect x="125" y="280" width="345" height="20" fill="url(#pk)"/>
    <line x1="125" y1="280" x2="470" y2="280" stroke="#444" strokeWidth="1"/>
    
    {/* ============ COTAS ============ */}
    {/* Shadow gap - 4mm */}
    <line x1="130" y1="226" x2="150" y2="226" stroke="#666" strokeWidth=".4"/>
    <line x1="130" y1="230" x2="150" y2="230" stroke="#666" strokeWidth=".4"/>
    <line x1="140" y1="226" x2="140" y2="230" stroke="#666" strokeWidth=".5"/>
    <text x="155" y="230" fill="#333" fontSize="6" fontFamily="monospace" fontWeight="500">4</text>
    
    {/* Altura rodapé - 80mm */}
    <line x1="55" y1="235" x2="75" y2="235" stroke="#666" strokeWidth=".4"/>
    <line x1="55" y1="315" x2="75" y2="315" stroke="#666" strokeWidth=".4"/>
    <line x1="65" y1="235" x2="65" y2="315" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="50" y="278" fill="#333" fontSize="6" textAnchor="end" fontFamily="monospace" fontWeight="500">80</text>
    
    {/* Profundidade - 18mm */}
    <line x1="80" y1="330" x2="80" y2="345" stroke="#666" strokeWidth=".4"/>
    <line x1="100" y1="330" x2="100" y2="345" stroke="#666" strokeWidth=".4"/>
    <line x1="80" y1="338" x2="100" y2="338" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="90" y="355" fill="#333" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="500">18</text>
    
    {/* Indicação */}
    <text x="300" y="180" fill="#555" fontSize="7" textAnchor="middle" fontStyle="italic" fontWeight="500">corte vertical — rodapé embutido c/ shadow gap</text>
    
    {/* NOTAS */}
    <text x="200" y="80" fill="#444" fontSize="7" fontWeight="500">① Perfil alumínio anodizado, fixação oculta.</text>
    <text x="200" y="92" fill="#444" fontSize="7" fontWeight="500">② Shadow gap 4mm no topo.</text>
    <text x="200" y="104" fill="#444" fontSize="7" fontWeight="500">③ Recesso parede: 18mm profundidade.</text>
  </svg>
);

// ============================================================
// D.01 — Contra-fachada Interior
// Corte horizontal — Isolamento térmico pelo interior
// ============================================================
export const D01: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 500 375" className={className}>
    <SVGDefs />
    
    {/* EXTERIOR (esquerda) */}
    <text x="30" y="50" fill="#666" fontSize="8" fontWeight="500">EXTERIOR</text>
    
    {/* ALVENARIA EXISTENTE */}
    <rect x="50" y="70" width="80" height="260" fill="url(#pb)"/>
    <line x1="50" y1="70" x2="50" y2="330" stroke="#333" strokeWidth="2"/>
    <line x1="130" y1="70" x2="130" y2="330" stroke="#333" strokeWidth="2"/>
    
    {/* REBOCO INTERIOR EXISTENTE */}
    <rect x="130" y="70" width="15" height="260" fill="url(#pm)"/>
    <line x1="145" y1="70" x2="145" y2="330" stroke="#444" strokeWidth="1"/>
    
    {/* CAIXA-DE-AR */}
    <rect x="145" y="70" width="15" height="260" fill="#fafaf8"/>
    
    {/* ISOLAMENTO XPS */}
    <rect x="160" y="70" width="70" height="260" fill="url(#pxps)"/>
    <line x1="160" y1="70" x2="160" y2="330" stroke="#4a90d9" strokeWidth="1.5"/>
    <line x1="230" y1="70" x2="230" y2="330" stroke="#4a90d9" strokeWidth="1.5"/>
    
    {/* PERFIL ÓMEGA */}
    <rect x="230" y="100" width="8" height="30" fill="url(#ps)"/>
    <rect x="230" y="200" width="8" height="30" fill="url(#ps)"/>
    <rect x="230" y="290" width="8" height="30" fill="url(#ps)"/>
    
    {/* PLACA GESSO */}
    <rect x="238" y="70" width="20" height="260" fill="url(#pg)"/>
    <line x1="258" y1="70" x2="258" y2="330" stroke="#333" strokeWidth="2"/>
    
    {/* INTERIOR */}
    <text x="280" y="50" fill="#666" fontSize="8" fontWeight="500">INTERIOR</text>
    
    {/* ============ COTAS ============ */}
    {/* Alvenaria - 200mm */}
    <line x1="50" y1="55" x2="50" y2="68" stroke="#666" strokeWidth=".4"/>
    <line x1="130" y1="55" x2="130" y2="68" stroke="#666" strokeWidth=".4"/>
    <line x1="50" y1="62" x2="130" y2="62" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="90" y="52" fill="#333" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="500">200</text>
    
    {/* XPS - 56mm */}
    <line x1="160" y1="340" x2="160" y2="355" stroke="#666" strokeWidth=".4"/>
    <line x1="230" y1="340" x2="230" y2="355" stroke="#666" strokeWidth=".4"/>
    <line x1="160" y1="348" x2="230" y2="348" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="195" y="365" fill="#333" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="500">56</text>
    
    {/* Sistema total */}
    <line x1="145" y1="340" x2="145" y2="360" stroke="#666" strokeWidth=".4"/>
    <line x1="258" y1="340" x2="258" y2="360" stroke="#666" strokeWidth=".4"/>
    <text x="202" y="372" fill="#555" fontSize="5" textAnchor="middle" fontStyle="italic">sistema ~100mm</text>
    
    {/* Indicação */}
    <text x="380" y="180" fill="#555" fontSize="7" fontStyle="italic" fontWeight="500">corte horizontal</text>
    <text x="380" y="192" fill="#555" fontSize="7" fontStyle="italic" fontWeight="500">contra-fachada</text>
    
    {/* NOTAS */}
    <text x="300" y="250" fill="#444" fontSize="7" fontWeight="500">U antes: ~1.60 W/(m²·K)</text>
    <text x="300" y="265" fill="#444" fontSize="7" fontWeight="500">U após: ~0.48 W/(m²·K)</text>
    <text x="300" y="280" fill="#d94a4a" fontSize="7" fontWeight="600">Redução ~70%</text>
  </svg>
);

// ============================================================
// D.02 — Ponte Térmica — Pilar
// Corte em planta — Encapsulamento contínuo
// ============================================================
export const D02: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 500 375" className={className}>
    <SVGDefs />
    
    {/* PILAR BETÃO */}
    <rect x="180" y="100" width="100" height="180" fill="url(#pc)"/>
    <line x1="180" y1="100" x2="280" y2="100" stroke="#333" strokeWidth="2"/>
    <line x1="280" y1="100" x2="280" y2="280" stroke="#333" strokeWidth="2"/>
    <line x1="180" y1="280" x2="280" y2="280" stroke="#333" strokeWidth="2"/>
    <line x1="180" y1="100" x2="180" y2="280" stroke="#333" strokeWidth="2"/>
    
    {/* ISOLAMENTO ENVOLVENTE - contínuo */}
    <rect x="150" y="70" width="30" height="240" fill="url(#pxps)"/>
    <rect x="280" y="70" width="30" height="240" fill="url(#pxps)"/>
    <rect x="180" y="70" width="100" height="30" fill="url(#pxps)"/>
    <rect x="180" y="280" width="100" height="30" fill="url(#pxps)"/>
    
    {/* Contorno isolamento */}
    <path d="M150,70 L150,310 L310,310 L310,70 L150,70" fill="none" stroke="#4a90d9" strokeWidth="1.5"/>
    
    {/* ALVENARIA ADJACENTE */}
    <rect x="30" y="130" width="120" height="120" fill="url(#pb)"/>
    <line x1="30" y1="130" x2="150" y2="130" stroke="#333" strokeWidth="1.5"/>
    <line x1="30" y1="250" x2="150" y2="250" stroke="#333" strokeWidth="1.5"/>
    
    <rect x="310" y="130" width="120" height="120" fill="url(#pb)"/>
    <line x1="310" y1="130" x2="430" y2="130" stroke="#333" strokeWidth="1.5"/>
    <line x1="310" y1="250" x2="430" y2="250" stroke="#333" strokeWidth="1.5"/>
    
    {/* PLACA GESSO interior */}
    <rect x="120" y="130" width="15" height="120" fill="url(#pg)"/>
    <rect x="325" y="130" width="15" height="120" fill="url(#pg)"/>
    
    {/* ============ COTAS ============ */}
    {/* Pilar */}
    <line x1="180" y1="55" x2="180" y2="68" stroke="#666" strokeWidth=".4"/>
    <line x1="280" y1="55" x2="280" y2="68" stroke="#666" strokeWidth=".4"/>
    <line x1="180" y1="62" x2="280" y2="62" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="230" y="52" fill="#333" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="500">300×400</text>
    
    {/* Isolamento - 30mm */}
    <line x1="150" y1="320" x2="150" y2="335" stroke="#666" strokeWidth=".4"/>
    <line x1="180" y1="320" x2="180" y2="335" stroke="#666" strokeWidth=".4"/>
    <line x1="150" y1="328" x2="180" y2="328" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="165" y="345" fill="#333" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="500">30</text>
    
    {/* Sobreposição */}
    <line x1="150" y1="130" x2="150" y2="100" stroke="#d94a4a" strokeWidth="1" strokeDasharray="4,2"/>
    <text x="140" y="115" fill="#d94a4a" fontSize="5" textAnchor="end">≥100</text>
    
    {/* Indicação */}
    <text x="230" y="365" fill="#555" fontSize="7" textAnchor="middle" fontStyle="italic" fontWeight="500">corte em planta — encapsulamento pilar</text>
    
    {/* NOTAS */}
    <text x="350" y="55" fill="#444" fontSize="7" fontWeight="500">① Isolamento contínuo envolvente.</text>
    <text x="350" y="67" fill="#444" fontSize="7" fontWeight="500">② Sobreposição ≥100mm c/ parede.</text>
  </svg>
);

// ============================================================
// D.03 — Piso Flutuante Acústico
// Corte vertical — Betonilha sobre manta resiliente
// ============================================================
export const D03: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 500 375" className={className}>
    <SVGDefs />
    
    {/* LAJE ESTRUTURAL */}
    <rect x="30" y="250" width="440" height="100" fill="url(#pc)"/>
    <line x1="30" y1="250" x2="470" y2="250" stroke="#333" strokeWidth="2"/>
    
    {/* MANTA RESILIENTE */}
    <rect x="50" y="230" width="400" height="20" fill="#b8e0b8"/>
    <path d="M50,240 Q70,235 90,240 T130,240 T170,240 T210,240 T250,240 T290,240 T330,240 T370,240 T410,240 T450,240" 
          stroke="#70b070" fill="none" strokeWidth="2"/>
    <line x1="50" y1="230" x2="450" y2="230" stroke="#60a060" strokeWidth="1"/>
    <line x1="50" y1="250" x2="450" y2="250" stroke="#60a060" strokeWidth="1"/>
    
    {/* FAIXA PERIMETRAL - dessolidarização */}
    <rect x="30" y="170" width="20" height="80" fill="#b8e0b8"/>
    <rect x="450" y="170" width="20" height="80" fill="#b8e0b8"/>
    
    {/* BETONILHA FLUTUANTE */}
    <rect x="50" y="190" width="400" height="40" fill="url(#pm)"/>
    <line x1="50" y1="190" x2="450" y2="190" stroke="#444" strokeWidth="1"/>
    
    {/* Malha armadura */}
    <line x1="60" y1="210" x2="440" y2="210" stroke="#888" strokeWidth="1" strokeDasharray="8,4"/>
    
    {/* COLA */}
    <rect x="50" y="180" width="400" height="10" fill="#d8d4ca"/>
    
    {/* PAVIMENTO CERÂMICO */}
    <rect x="50" y="160" width="400" height="20" fill="url(#pk)"/>
    <line x1="50" y1="160" x2="450" y2="160" stroke="#333" strokeWidth="1.5"/>
    
    {/* PAREDE (para mostrar dessolidarização) */}
    <rect x="30" y="60" width="60" height="110" fill="url(#pg)"/>
    <line x1="30" y1="60" x2="30" y2="170" stroke="#333" strokeWidth="2"/>
    <line x1="90" y1="60" x2="90" y2="170" stroke="#333" strokeWidth="2"/>
    
    {/* Rodapé */}
    <rect x="90" y="140" width="15" height="30" fill="url(#pw)"/>
    
    {/* ============ COTAS ============ */}
    {/* Sistema total */}
    <line x1="460" y1="160" x2="480" y2="160" stroke="#666" strokeWidth=".4"/>
    <line x1="460" y1="250" x2="480" y2="250" stroke="#666" strokeWidth=".4"/>
    <line x1="470" y1="160" x2="470" y2="250" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="485" y="210" fill="#333" fontSize="6" fontFamily="monospace" fontWeight="500">~63</text>
    
    {/* Manta - 16mm */}
    <line x1="460" y1="230" x2="475" y2="230" stroke="#666" strokeWidth=".4"/>
    <text x="455" y="242" fill="#555" fontSize="5" textAnchor="end" fontFamily="monospace">16</text>
    
    {/* Betonilha - 30mm */}
    <line x1="460" y1="190" x2="475" y2="190" stroke="#666" strokeWidth=".4"/>
    <text x="455" y="212" fill="#555" fontSize="5" textAnchor="end" fontFamily="monospace">30</text>
    
    {/* Indicação */}
    <text x="250" y="340" fill="#555" fontSize="7" textAnchor="middle" fontStyle="italic" fontWeight="500">corte vertical — piso flutuante acústico</text>
    
    {/* NOTAS */}
    <text x="150" y="80" fill="#444" fontSize="7" fontWeight="500">① Manta resiliente PE 16mm, ρ=30kg/m³.</text>
    <text x="150" y="92" fill="#444" fontSize="7" fontWeight="500">② Betonilha flutuante ≥30mm c/ malha.</text>
    <text x="150" y="104" fill="#444" fontSize="7" fontWeight="500">③ Faixa perimetral: dessolidarização total.</text>
    <text x="150" y="120" fill="#60a060" fontSize="7" fontWeight="600">ΔLw ≥22 dB</text>
  </svg>
);

// ============================================================
// E.01 — Aro de Porta Interior
// Corte em planta — Aro envolvente
// ============================================================
export const E01: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 500 375" className={className}>
    <SVGDefs />
    
    {/* PAREDE - lado esquerdo */}
    <rect x="30" y="30" width="25" height="140" fill="url(#pg)"/>
    <rect x="55" y="30" width="50" height="140" fill="#fafaf8"/>
    <rect x="105" y="30" width="25" height="140" fill="url(#pg)"/>
    <line x1="30" y1="30" x2="30" y2="170" stroke="#333" strokeWidth="2"/>
    <line x1="130" y1="30" x2="130" y2="170" stroke="#333" strokeWidth="2"/>
    
    {/* Montantes reforçados */}
    <rect x="55" y="30" width="12" height="140" fill="url(#ps)"/>
    <rect x="93" y="30" width="12" height="140" fill="url(#ps)"/>
    
    {/* PAREDE - lado direito */}
    <rect x="30" y="220" width="25" height="140" fill="url(#pg)"/>
    <rect x="55" y="220" width="50" height="140" fill="#fafaf8"/>
    <rect x="105" y="220" width="25" height="140" fill="url(#pg)"/>
    <line x1="30" y1="220" x2="30" y2="360" stroke="#333" strokeWidth="2"/>
    <line x1="130" y1="220" x2="130" y2="360" stroke="#333" strokeWidth="2"/>
    
    {/* Montantes reforçados */}
    <rect x="55" y="220" width="12" height="140" fill="url(#ps)"/>
    <rect x="93" y="220" width="12" height="140" fill="url(#ps)"/>
    
    {/* VÃO DA PORTA */}
    <rect x="130" y="170" width="300" height="50" fill="#fafaf8"/>
    
    {/* ARO MDF */}
    <rect x="130" y="160" width="15" height="70" fill="url(#pw)"/>
    <line x1="130" y1="160" x2="145" y2="160" stroke="#333" strokeWidth="1.5"/>
    <line x1="145" y1="160" x2="145" y2="230" stroke="#333" strokeWidth="1.5"/>
    <line x1="130" y1="230" x2="145" y2="230" stroke="#333" strokeWidth="1.5"/>
    
    {/* GUARNIÇÃO */}
    <rect x="145" y="155" width="60" height="12" fill="url(#pw)"/>
    <rect x="145" y="223" width="60" height="12" fill="url(#pw)"/>
    <line x1="145" y1="155" x2="205" y2="155" stroke="#444" strokeWidth="1"/>
    <line x1="145" y1="235" x2="205" y2="235" stroke="#444" strokeWidth="1"/>
    
    {/* FOLHA DE PORTA */}
    <rect x="150" y="175" width="280" height="40" fill="#e8e0d8"/>
    <line x1="150" y1="175" x2="430" y2="175" stroke="#333" strokeWidth="1.5"/>
    <line x1="150" y1="215" x2="430" y2="215" stroke="#333" strokeWidth="1.5"/>
    <line x1="430" y1="175" x2="430" y2="215" stroke="#333" strokeWidth="1.5"/>
    
    {/* Dobradiças */}
    <rect x="145" y="180" width="8" height="10" fill="url(#ps)"/>
    <rect x="145" y="200" width="8" height="10" fill="url(#ps)"/>
    
    {/* ============ COTAS ============ */}
    {/* Parede */}
    <line x1="30" y1="15" x2="30" y2="28" stroke="#666" strokeWidth=".4"/>
    <line x1="130" y1="15" x2="130" y2="28" stroke="#666" strokeWidth=".4"/>
    <line x1="30" y1="22" x2="130" y2="22" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="80" y="12" fill="#333" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="500">100</text>
    
    {/* Vão */}
    <line x1="145" y1="170" x2="145" y2="150" stroke="#666" strokeWidth=".4"/>
    <line x1="145" y1="220" x2="145" y2="240" stroke="#666" strokeWidth=".4"/>
    <text x="155" y="200" fill="#333" fontSize="6" fontFamily="monospace" fontWeight="500">≥800</text>
    
    {/* Folha porta */}
    <line x1="150" y1="250" x2="150" y2="265" stroke="#666" strokeWidth=".4"/>
    <line x1="430" y1="250" x2="430" y2="265" stroke="#666" strokeWidth=".4"/>
    <line x1="150" y1="258" x2="430" y2="258" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="290" y="280" fill="#333" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="500">folha 40mm</text>
    
    {/* Indicação */}
    <text x="300" y="340" fill="#555" fontSize="7" textAnchor="middle" fontStyle="italic" fontWeight="500">corte em planta — aro de porta interior</text>
  </svg>
);

// ============================================================
// E.02 — Porta de Correr Embutida
// Corte em planta — Sistema tipo Eclisse
// ============================================================
export const E02: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 500 375" className={className}>
    <SVGDefs />
    
    {/* CONTRA-PAREDE (bolsa) */}
    <rect x="30" y="80" width="200" height="12" fill="url(#pg)"/>
    <rect x="30" y="195" width="200" height="12" fill="url(#pg)"/>
    <line x1="30" y1="80" x2="230" y2="80" stroke="#333" strokeWidth="1.5"/>
    <line x1="30" y1="207" x2="230" y2="207" stroke="#333" strokeWidth="1.5"/>
    
    {/* Estrutura metálica bolsa */}
    <rect x="30" y="92" width="200" height="4" fill="url(#ps)"/>
    <rect x="30" y="191" width="200" height="4" fill="url(#ps)"/>
    
    {/* Espaço para folha */}
    <rect x="30" y="96" width="200" height="95" fill="#fafaf8"/>
    
    {/* FOLHA DE PORTA (dentro da bolsa) */}
    <rect x="40" y="115" width="180" height="44" fill="#d4a574" opacity="0.6"/>
    <line x1="40" y1="115" x2="220" y2="115" stroke="#666" strokeWidth="1" strokeDasharray="4,2"/>
    <line x1="40" y1="159" x2="220" y2="159" stroke="#666" strokeWidth="1" strokeDasharray="4,2"/>
    
    {/* CALHA SUPERIOR (indicação) */}
    <line x1="40" y1="96" x2="220" y2="96" stroke="#888" strokeWidth="2"/>
    <circle cx="60" cy="96" r="3" fill="#888"/>
    <circle cx="200" cy="96" r="3" fill="#888"/>
    
    {/* PAREDE - ombreira */}
    <rect x="230" y="80" width="25" height="127" fill="url(#pg)"/>
    <rect x="255" y="80" width="50" height="127" fill="#fafaf8"/>
    <rect x="305" y="80" width="25" height="127" fill="url(#pg)"/>
    <line x1="330" y1="80" x2="330" y2="207" stroke="#333" strokeWidth="2"/>
    
    {/* Montante ombreira */}
    <rect x="255" y="80" width="12" height="127" fill="url(#ps)"/>
    <rect x="293" y="80" width="12" height="127" fill="url(#ps)"/>
    
    {/* VÃO LIVRE */}
    <rect x="330" y="80" width="140" height="127" fill="#f0f8ff" opacity="0.3"/>
    <text x="400" y="150" fill="#4a90d9" fontSize="8" textAnchor="middle" opacity="0.7">VÃO LIVRE</text>
    
    {/* ARO ombreira */}
    <rect x="230" y="75" width="15" height="137" fill="url(#pw)"/>
    
    {/* ============ COTAS ============ */}
    {/* Bolsa */}
    <line x1="30" y1="65" x2="30" y2="78" stroke="#666" strokeWidth=".4"/>
    <line x1="230" y1="65" x2="230" y2="78" stroke="#666" strokeWidth=".4"/>
    <line x1="30" y1="72" x2="230" y2="72" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="130" y="62" fill="#333" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="500">≥vão+100</text>
    
    {/* Espessura sistema */}
    <line x1="30" y1="215" x2="30" y2="230" stroke="#666" strokeWidth=".4"/>
    <line x1="30" y1="80" x2="15" y2="80" stroke="#666" strokeWidth=".4"/>
    <line x1="30" y1="207" x2="15" y2="207" stroke="#666" strokeWidth=".4"/>
    <line x1="22" y1="80" x2="22" y2="207" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="10" y="147" fill="#333" fontSize="6" textAnchor="end" fontFamily="monospace" fontWeight="500">~125</text>
    
    {/* Vão livre */}
    <line x1="245" y1="215" x2="245" y2="230" stroke="#666" strokeWidth=".4"/>
    <line x1="470" y1="215" x2="470" y2="230" stroke="#666" strokeWidth=".4"/>
    <line x1="245" y1="222" x2="470" y2="222" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="358" y="245" fill="#333" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="500">≥800</text>
    
    {/* Indicação */}
    <text x="250" y="320" fill="#555" fontSize="7" textAnchor="middle" fontStyle="italic" fontWeight="500">corte em planta — porta de correr embutida</text>
    
    {/* NOTAS */}
    <text x="250" y="270" fill="#444" fontSize="7" fontWeight="500">① Contra-parede c/ caixilho metálico.</text>
    <text x="250" y="282" fill="#444" fontSize="7" fontWeight="500">② Bolsa ≥ vão + 100mm.</text>
  </svg>
);

// ============================================================
// F.01 — Revestimento Cerâmico em I.S.
// Corte horizontal — Sobre gesso hidrófugo
// ============================================================
export const F01: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 500 375" className={className}>
    <SVGDefs />
    
    {/* LADO SECO (esquerda) */}
    <text x="30" y="50" fill="#666" fontSize="8" fontWeight="500">SECO</text>
    
    {/* Placa gesso standard */}
    <rect x="50" y="70" width="20" height="260" fill="url(#pg)"/>
    <line x1="50" y1="70" x2="50" y2="330" stroke="#333" strokeWidth="2"/>
    <line x1="70" y1="70" x2="70" y2="330" stroke="#444" strokeWidth="1"/>
    
    {/* CAVIDADE + MONTANTES + LÃ */}
    <rect x="70" y="70" width="70" height="260" fill="url(#pi)"/>
    <rect x="70" y="70" width="6" height="260" fill="url(#ps)"/>
    <rect x="134" y="70" width="6" height="260" fill="url(#ps)"/>
    
    {/* Placa gesso H1 - lado húmido */}
    <rect x="140" y="70" width="20" height="260" fill="url(#pgh1)"/>
    <line x1="140" y1="70" x2="140" y2="330" stroke="#444" strokeWidth="1"/>
    <line x1="160" y1="70" x2="160" y2="330" stroke="#333" strokeWidth="2"/>
    
    {/* IMPERMEABILIZAÇÃO */}
    <line x1="160" y1="70" x2="160" y2="330" stroke="#4a90d9" strokeWidth="3" strokeDasharray="8,4"/>
    
    {/* COLA C2TE */}
    <rect x="163" y="70" width="8" height="260" fill="#d8d4ca"/>
    
    {/* AZULEJO */}
    <rect x="171" y="70" width="15" height="260" fill="url(#pk)"/>
    <line x1="186" y1="70" x2="186" y2="330" stroke="#444" strokeWidth="1.5"/>
    
    {/* LADO HÚMIDO */}
    <rect x="186" y="70" width="100" height="260" fill="#f0f8ff" opacity="0.3"/>
    <text x="236" y="180" fill="#4a90d9" fontSize="10" textAnchor="middle" opacity="0.5">I.S.</text>
    
    {/* ============ COTAS ============ */}
    {/* Parede total */}
    <line x1="50" y1="55" x2="50" y2="68" stroke="#666" strokeWidth=".4"/>
    <line x1="160" y1="55" x2="160" y2="68" stroke="#666" strokeWidth=".4"/>
    <line x1="50" y1="62" x2="160" y2="62" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="105" y="50" fill="#333" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="500">110</text>
    
    {/* Sistema total c/ azulejo */}
    <line x1="50" y1="340" x2="50" y2="355" stroke="#666" strokeWidth=".4"/>
    <line x1="186" y1="340" x2="186" y2="355" stroke="#666" strokeWidth=".4"/>
    <line x1="50" y1="348" x2="186" y2="348" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="118" y="365" fill="#333" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="500">~136</text>
    
    {/* Indicação */}
    <text x="350" y="180" fill="#555" fontSize="7" fontStyle="italic" fontWeight="500">corte horizontal</text>
    <text x="350" y="195" fill="#555" fontSize="7" fontStyle="italic" fontWeight="500">revestimento I.S.</text>
    
    {/* NOTAS */}
    <text x="300" y="250" fill="#444" fontSize="7" fontWeight="500">① Placa H1 obrigatória lado húmido.</text>
    <text x="300" y="265" fill="#444" fontSize="7" fontWeight="500">② Impermeab. até 1.80m mín.</text>
    <text x="300" y="280" fill="#444" fontSize="7" fontWeight="500">③ Cola C2TE (EN 12004).</text>
    
    {/* LEGENDA */}
    <line x1="300" y1="310" x2="320" y2="310" stroke="#4a90d9" strokeWidth="3" strokeDasharray="8,4"/>
    <text x="325" y="313" fill="#4a90d9" fontSize="6">Impermeab.</text>
  </svg>
);

// ============================================================
// H.01 — Junta de Dilatação — Teto
// Corte vertical — Interrupção em teto falso
// ============================================================
export const H01: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 500 375" className={className}>
    <SVGDefs />
    
    {/* LAJE ESTRUTURAL */}
    <rect x="30" y="30" width="440" height="50" fill="url(#pc)"/>
    <line x1="30" y1="80" x2="470" y2="80" stroke="#333" strokeWidth="2"/>
    
    {/* JUNTA ESTRUTURAL na laje */}
    <rect x="245" y="30" width="10" height="50" fill="#333"/>
    
    {/* PENDURAIS - independentes cada lado */}
    <line x1="120" y1="80" x2="120" y2="140" stroke="#666" strokeWidth="2"/>
    <line x1="380" y1="80" x2="380" y2="140" stroke="#666" strokeWidth="2"/>
    
    {/* PERFILARIA CD60 */}
    <rect x="60" y="140" width="180" height="8" fill="url(#ps)"/>
    <rect x="260" y="140" width="180" height="8" fill="url(#ps)"/>
    
    {/* TETO FALSO - lado esquerdo */}
    <rect x="60" y="148" width="180" height="16" fill="url(#pg)"/>
    <line x1="60" y1="164" x2="240" y2="164" stroke="#333" strokeWidth="1.5"/>
    
    {/* TETO FALSO - lado direito */}
    <rect x="260" y="148" width="180" height="16" fill="url(#pg)"/>
    <line x1="260" y1="164" x2="440" y2="164" stroke="#333" strokeWidth="1.5"/>
    
    {/* CANTONEIRAS DE BORDO */}
    <rect x="235" y="148" width="5" height="20" fill="url(#ps)"/>
    <rect x="260" y="148" width="5" height="20" fill="url(#ps)"/>
    
    {/* JUNTA ABERTA */}
    <rect x="240" y="148" width="20" height="20" fill="#fafaf8"/>
    <line x1="240" y1="148" x2="240" y2="168" stroke="#555" strokeWidth="1"/>
    <line x1="260" y1="148" x2="260" y2="168" stroke="#555" strokeWidth="1"/>
    
    {/* TAPA-JUNTAS decorativo */}
    <rect x="238" y="164" width="24" height="6" fill="url(#ps)"/>
    <line x1="238" y1="170" x2="262" y2="170" stroke="#444" strokeWidth="1"/>
    
    {/* ============ COTAS ============ */}
    {/* Junta - 20mm */}
    <line x1="240" y1="180" x2="240" y2="200" stroke="#666" strokeWidth=".4"/>
    <line x1="260" y1="180" x2="260" y2="200" stroke="#666" strokeWidth=".4"/>
    <line x1="240" y1="190" x2="260" y2="190" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="250" y="215" fill="#333" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="500">≥10</text>
    
    {/* Plenum */}
    <line x1="50" y1="80" x2="50" y2="148" stroke="#666" strokeWidth=".4"/>
    <line x1="45" y1="80" x2="55" y2="80" stroke="#666" strokeWidth=".4"/>
    <line x1="45" y1="148" x2="55" y2="148" stroke="#666" strokeWidth=".4"/>
    <text x="40" y="118" fill="#333" fontSize="6" textAnchor="end" fontFamily="monospace" fontWeight="500">~70</text>
    
    {/* Indicação */}
    <text x="250" y="300" fill="#555" fontSize="7" textAnchor="middle" fontStyle="italic" fontWeight="500">corte vertical — junta de dilatação em teto falso</text>
    
    {/* NOTAS */}
    <text x="100" y="240" fill="#444" fontSize="7" fontWeight="500">① Junta coincide com junta estrutural.</text>
    <text x="100" y="255" fill="#444" fontSize="7" fontWeight="500">② Suspensão independente cada lado.</text>
    <text x="100" y="270" fill="#444" fontSize="7" fontWeight="500">③ Tapa-juntas amovível p/ manutenção.</text>
  </svg>
);

// ============================================================
// J.01 — Corrimão Fixo a Parede
// Corte horizontal — Fixação com reforço interior
// ============================================================
export const J01: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 500 375" className={className}>
    <SVGDefs />
    
    {/* PAREDE DIVISÓRIA */}
    <rect x="50" y="80" width="25" height="220" fill="url(#pg)"/>
    <rect x="75" y="80" width="60" height="220" fill="#fafaf8"/>
    <rect x="135" y="80" width="25" height="220" fill="url(#pg)"/>
    <line x1="50" y1="80" x2="50" y2="300" stroke="#333" strokeWidth="2"/>
    <line x1="160" y1="80" x2="160" y2="300" stroke="#333" strokeWidth="2"/>
    
    {/* Montantes */}
    <rect x="75" y="80" width="6" height="220" fill="url(#ps)"/>
    <rect x="129" y="80" width="6" height="220" fill="url(#ps)"/>
    
    {/* REFORÇO INTERIOR - tábua madeira */}
    <rect x="85" y="160" width="40" height="60" fill="url(#pw)"/>
    <line x1="85" y1="160" x2="125" y2="160" stroke="#444" strokeWidth="1"/>
    <line x1="85" y1="220" x2="125" y2="220" stroke="#444" strokeWidth="1"/>
    
    {/* PLATINA FIXAÇÃO */}
    <rect x="160" y="175" width="8" height="30" fill="url(#ps)"/>
    <line x1="160" y1="175" x2="168" y2="175" stroke="#555" strokeWidth="1.5"/>
    <line x1="160" y1="205" x2="168" y2="205" stroke="#555" strokeWidth="1.5"/>
    
    {/* Parafuso travessante */}
    <line x1="100" y1="190" x2="168" y2="190" stroke="#666" strokeWidth="2"/>
    <circle cx="100" cy="190" r="4" fill="#888"/>
    
    {/* BRAÇO SUPORTE */}
    <rect x="168" y="182" width="80" height="16" fill="url(#ps)"/>
    <line x1="168" y1="182" x2="248" y2="182" stroke="#555" strokeWidth="1.5"/>
    <line x1="168" y1="198" x2="248" y2="198" stroke="#555" strokeWidth="1.5"/>
    
    {/* CORRIMÃO */}
    <ellipse cx="280" cy="190" rx="30" ry="30" fill="url(#pw)"/>
    <ellipse cx="280" cy="190" rx="30" ry="30" fill="none" stroke="#333" strokeWidth="2"/>
    
    {/* ============ COTAS ============ */}
    {/* Braço - 150mm */}
    <line x1="168" y1="210" x2="168" y2="230" stroke="#666" strokeWidth=".4"/>
    <line x1="248" y1="210" x2="248" y2="230" stroke="#666" strokeWidth=".4"/>
    <line x1="168" y1="220" x2="248" y2="220" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="208" y="245" fill="#333" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="500">150-200</text>
    
    {/* Corrimão Ø */}
    <line x1="250" y1="160" x2="250" y2="145" stroke="#666" strokeWidth=".4"/>
    <line x1="310" y1="160" x2="310" y2="145" stroke="#666" strokeWidth=".4"/>
    <line x1="250" y1="152" x2="310" y2="152" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="280" y="140" fill="#333" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="500">Ø40-50</text>
    
    {/* Parede */}
    <line x1="50" y1="65" x2="50" y2="78" stroke="#666" strokeWidth=".4"/>
    <line x1="160" y1="65" x2="160" y2="78" stroke="#666" strokeWidth=".4"/>
    <line x1="50" y1="72" x2="160" y2="72" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="105" y="60" fill="#333" fontSize="6" textAnchor="middle" fontFamily="monospace" fontWeight="500">110</text>
    
    {/* Indicação */}
    <text x="300" y="340" fill="#555" fontSize="7" textAnchor="middle" fontStyle="italic" fontWeight="500">corte horizontal — corrimão fixo a parede</text>
    
    {/* NOTAS */}
    <text x="200" y="280" fill="#444" fontSize="7" fontWeight="500">① Reforço interior madeira 18mm ou chapa 2mm.</text>
    <text x="200" y="295" fill="#444" fontSize="7" fontWeight="500">② Fixação travessante. Espaç. ≤1000mm.</text>
  </svg>
);

// ============================================================
// J.02 — Guarda Metálica em Laje
// Corte vertical — Fixação lateral ao bordo de laje
// ============================================================
export const J02: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 500 375" className={className}>
    <SVGDefs />
    
    {/* LAJE ESTRUTURAL */}
    <rect x="30" y="200" width="250" height="150" fill="url(#pc)"/>
    <line x1="30" y1="200" x2="280" y2="200" stroke="#333" strokeWidth="2"/>
    <line x1="280" y1="200" x2="280" y2="350" stroke="#333" strokeWidth="2"/>
    
    {/* PAVIMENTO */}
    <rect x="30" y="180" width="230" height="20" fill="url(#pk)"/>
    <line x1="30" y1="180" x2="260" y2="180" stroke="#333" strokeWidth="1.5"/>
    
    {/* PLATINA BASE */}
    <rect x="265" y="220" width="15" height="80" fill="url(#ps)"/>
    <line x1="265" y1="220" x2="280" y2="220" stroke="#555" strokeWidth="2"/>
    <line x1="265" y1="300" x2="280" y2="300" stroke="#555" strokeWidth="2"/>
    
    {/* Ancoragens químicas */}
    <circle cx="272" cy="235" r="4" fill="#888"/>
    <circle cx="272" cy="260" r="4" fill="#888"/>
    <circle cx="272" cy="285" r="4" fill="#888"/>
    <line x1="276" y1="235" x2="300" y2="235" stroke="#666" strokeWidth="1.5"/>
    <line x1="276" y1="260" x2="300" y2="260" stroke="#666" strokeWidth="1.5"/>
    <line x1="276" y1="285" x2="300" y2="285" stroke="#666" strokeWidth="1.5"/>
    
    {/* MONTANTE VERTICAL */}
    <rect x="320" y="50" width="20" height="250" fill="url(#ps)"/>
    <line x1="320" y1="50" x2="320" y2="300" stroke="#555" strokeWidth="2"/>
    <line x1="340" y1="50" x2="340" y2="300" stroke="#555" strokeWidth="2"/>
    
    {/* Ligação platina-montante */}
    <rect x="280" y="240" width="40" height="40" fill="url(#ps)"/>
    
    {/* CORRIMÃO */}
    <ellipse cx="330" cy="50" rx="15" ry="15" fill="url(#ps)"/>
    <ellipse cx="330" cy="50" rx="15" ry="15" fill="none" stroke="#555" strokeWidth="2"/>
    
    {/* Balaústres */}
    <rect x="325" y="90" width="10" height="150" fill="none" stroke="#555" strokeWidth="1.5"/>
    
    {/* NPA */}
    <line x1="30" y1="180" x2="30" y2="160" stroke="#d94a4a" strokeWidth="1"/>
    <text x="35" y="170" fill="#d94a4a" fontSize="6">NPA</text>
    
    {/* ============ COTAS ============ */}
    {/* Altura guarda - 900mm */}
    <line x1="360" y1="50" x2="380" y2="50" stroke="#666" strokeWidth=".4"/>
    <line x1="360" y1="180" x2="380" y2="180" stroke="#666" strokeWidth=".4"/>
    <line x1="370" y1="50" x2="370" y2="180" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="385" y="120" fill="#333" fontSize="6" fontFamily="monospace" fontWeight="500">≥900</text>
    
    {/* Espaçamento balaústres */}
    <line x1="325" y1="140" x2="325" y2="125" stroke="#666" strokeWidth=".4"/>
    <line x1="335" y1="140" x2="335" y2="125" stroke="#666" strokeWidth=".4"/>
    <text x="330" y="120" fill="#555" fontSize="5" textAnchor="middle" fontFamily="monospace">≤110</text>
    
    {/* Ancoragem */}
    <text x="310" y="260" fill="#555" fontSize="5" textAnchor="end">M10</text>
    
    {/* Indicação */}
    <text x="200" y="365" fill="#555" fontSize="7" textAnchor="middle" fontStyle="italic" fontWeight="500">corte vertical — guarda metálica fixação lateral</text>
    
    {/* NOTAS */}
    <text x="30" y="50" fill="#444" fontSize="7" fontWeight="500">① Platina c/ 4 ancoragens químicas M10.</text>
    <text x="30" y="65" fill="#444" fontSize="7" fontWeight="500">② Altura ≥900mm do NPA.</text>
    <text x="30" y="80" fill="#444" fontSize="7" fontWeight="500">③ Espaç. balaústres ≤110mm.</text>
  </svg>
);

// ============================================================
// J.11 — Guarda Escada Interior
// Corte vertical — Montantes metálicos com balaústres
// ============================================================
export const J11: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 500 375" className={className}>
    <SVGDefs />
    
    {/* DEGRAUS - escada inclinada */}
    <polygon points="30,350 150,350 150,300 100,300 100,250 50,250 50,200 30,200" fill="url(#pc)"/>
    <line x1="30" y1="200" x2="50" y2="200" stroke="#333" strokeWidth="2"/>
    <line x1="50" y1="200" x2="50" y2="250" stroke="#333" strokeWidth="2"/>
    <line x1="50" y1="250" x2="100" y2="250" stroke="#333" strokeWidth="2"/>
    <line x1="100" y1="250" x2="100" y2="300" stroke="#333" strokeWidth="2"/>
    <line x1="100" y1="300" x2="150" y2="300" stroke="#333" strokeWidth="2"/>
    <line x1="150" y1="300" x2="150" y2="350" stroke="#333" strokeWidth="2"/>
    
    {/* REVESTIMENTO DEGRAUS - madeira */}
    <rect x="30" y="185" width="20" height="15" fill="url(#pw)"/>
    <rect x="50" y="235" width="50" height="15" fill="url(#pw)"/>
    <rect x="100" y="285" width="50" height="15" fill="url(#pw)"/>
    
    {/* MONTANTE PRINCIPAL 1 */}
    <rect x="45" y="80" width="12" height="105" fill="url(#ps)"/>
    <line x1="45" y1="80" x2="57" y2="80" stroke="#555" strokeWidth="1.5"/>
    <line x1="45" y1="185" x2="57" y2="185" stroke="#555" strokeWidth="1.5"/>
    
    {/* PLATINA BASE 1 */}
    <rect x="40" y="185" width="22" height="6" fill="url(#ps)"/>
    <circle cx="46" cy="191" r="2" fill="#666"/>
    <circle cx="56" cy="191" r="2" fill="#666"/>
    
    {/* MONTANTE PRINCIPAL 2 */}
    <rect x="95" y="130" width="12" height="105" fill="url(#ps)"/>
    <line x1="95" y1="130" x2="107" y2="130" stroke="#555" strokeWidth="1.5"/>
    <line x1="95" y1="235" x2="107" y2="235" stroke="#555" strokeWidth="1.5"/>
    
    {/* PLATINA BASE 2 */}
    <rect x="90" y="235" width="22" height="6" fill="url(#ps)"/>
    <circle cx="96" cy="241" r="2" fill="#666"/>
    <circle cx="106" cy="241" r="2" fill="#666"/>
    
    {/* MONTANTE PRINCIPAL 3 */}
    <rect x="145" y="180" width="12" height="105" fill="url(#ps)"/>
    <line x1="145" y1="180" x2="157" y2="180" stroke="#555" strokeWidth="1.5"/>
    <line x1="145" y1="285" x2="157" y2="285" stroke="#555" strokeWidth="1.5"/>
    
    {/* PLATINA BASE 3 */}
    <rect x="140" y="285" width="22" height="6" fill="url(#ps)"/>
    <circle cx="146" cy="291" r="2" fill="#666"/>
    <circle cx="156" cy="291" r="2" fill="#666"/>
    
    {/* CORRIMÃO - inclinado */}
    <line x1="51" y1="65" x2="151" y2="165" stroke="#c49464" strokeWidth="12" strokeLinecap="round"/>
    <line x1="51" y1="65" x2="151" y2="165" stroke="#d4a574" strokeWidth="8" strokeLinecap="round"/>
    
    {/* BALAÚSTRES */}
    <line x1="65" y1="78" x2="65" y2="185" stroke="#666" strokeWidth="3"/>
    <line x1="80" y1="93" x2="80" y2="200" stroke="#666" strokeWidth="3"/>
    <line x1="115" y1="128" x2="115" y2="235" stroke="#666" strokeWidth="3"/>
    <line x1="130" y1="143" x2="130" y2="250" stroke="#666" strokeWidth="3"/>
    
    {/* ============ COTAS ============ */}
    {/* Altura guarda - 900mm */}
    <line x1="170" y1="185" x2="190" y2="185" stroke="#666" strokeWidth=".4"/>
    <line x1="170" y1="80" x2="190" y2="80" stroke="#666" strokeWidth=".4"/>
    <line x1="180" y1="80" x2="180" y2="185" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="195" y="140" fill="#333" fontSize="6" fontFamily="monospace" fontWeight="500">900</text>
    
    {/* Espaçamento balaústres */}
    <line x1="65" y1="195" x2="65" y2="210" stroke="#666" strokeWidth=".4"/>
    <line x1="80" y1="210" x2="80" y2="225" stroke="#666" strokeWidth=".4"/>
    <text x="72" y="220" fill="#555" fontSize="5" textAnchor="middle" fontFamily="monospace">≤110</text>
    
    {/* Indicação */}
    <text x="350" y="340" fill="#555" fontSize="7" textAnchor="middle" fontStyle="italic" fontWeight="500">corte vertical — guarda escada interior</text>
    
    {/* NOTAS */}
    <text x="250" y="60" fill="#444" fontSize="7" fontWeight="500">① Montantes @máx. 1200mm.</text>
    <text x="250" y="75" fill="#444" fontSize="7" fontWeight="500">② Balaústres ∅12mm @≤110mm.</text>
    <text x="250" y="90" fill="#444" fontSize="7" fontWeight="500">③ Corrimão contínuo, madeira ∅50mm.</text>
    <text x="250" y="105" fill="#444" fontSize="7" fontWeight="500">④ Altura 900mm desde focinho degrau.</text>
  </svg>
);

// ============================================================
// J.21 — Guarda Varanda — Vidro (VERSÃO CORRIGIDA)
// Corte vertical — Vidro laminado com perfil U base
// Escala 1:5 | Normas: EN ISO 128, EN ISO 7519
// ============================================================
export const J21: React.FC<{ className?: string }> = ({ className }) => {
  // Escala 1:5 → 1 unidade SVG = 5mm reais
  // Área de desenho: 280×300 unidades = 1400×1500mm reais
  const s = 1; // factor de escala (ajustável)
  
  // Dimensões reais (mm) convertidas para unidades SVG (÷5)
  const dims = {
    glassHeight: 220,      // 1100mm ÷ 5
    glassThick: 3.2,       // 16mm ÷ 5 (exagerado para 6 para visibilidade)
    profileU: { w: 10, h: 8, flange: 1.6 },  // 50×40mm, aba 8mm
    slab: 40,              // 200mm ÷ 5
    screed: 10,            // 50mm ÷ 5
    waterproof: 1,         // 5mm ÷ 5
    floor: 3,              // 15mm ÷ 5
  };
  
  // Posições base
  const base = { x: 40, y: 290 };  // NPA (nível pavimento acabado)
  
  return (
    <svg viewBox="0 0 500 375" className={className}>
      <SVGDefs />
      
      {/* ========== FUNDO E ZONAS ========== */}
      {/* Zona exterior */}
      <rect x="260" y="20" width="80" height="345" fill="#f0f8ff" opacity="0.15"/>
      
      {/* ========== ESTRUTURA — LAJE (cortada) ========== */}
      <rect x={base.x} y={base.y} width="220" height={dims.slab} fill="url(#pc)"/>
      {/* Contorno grosso — elemento cortado */}
      <line x1={base.x} y1={base.y} x2="260" y2={base.y} stroke="#222" strokeWidth="2"/>
      <line x1="260" y1={base.y} x2="260" y2={base.y + dims.slab} stroke="#222" strokeWidth="2"/>
      <line x1={base.x} y1={base.y + dims.slab} x2="260" y2={base.y + dims.slab} stroke="#222" strokeWidth="1"/>
      
      {/* ========== CAMADAS PAVIMENTO ========== */}
      {/* Impermeabilização — linha especial */}
      <line x1={base.x} y1={base.y - dims.waterproof} x2="260" y2={base.y - dims.waterproof} 
            stroke="#2563eb" strokeWidth="1.5"/>
      
      {/* Betonilha de regularização (com pendente 1.5%) */}
      <polygon 
        points={`${base.x},${base.y - dims.waterproof - dims.screed + 3} 260,${base.y - dims.waterproof - dims.screed} 260,${base.y - dims.waterproof} ${base.x},${base.y - dims.waterproof}`} 
        fill="url(#pm)"
      />
      <line x1={base.x} y1={base.y - dims.waterproof - dims.screed + 3} x2="220" y2={base.y - dims.waterproof - dims.screed} 
            stroke="#666" strokeWidth="0.5"/>
      
      {/* Pavimento cerâmico */}
      <rect x={base.x} y={base.y - dims.waterproof - dims.screed - dims.floor + 3} width="180" height={dims.floor} fill="url(#pk)"/>
      <line x1={base.x} y1={base.y - dims.waterproof - dims.screed - dims.floor + 3} x2="220" y2={base.y - dims.waterproof - dims.screed - dims.floor} 
            stroke="#444" strokeWidth="1"/>
      
      {/* ========== PERFIL U ALUMÍNIO ========== */}
      {/* Base do perfil */}
      <rect x="220" y={base.y - dims.waterproof - dims.profileU.h} width={dims.profileU.w * 4} height={dims.profileU.flange * 2} fill="#a0a8b0"/>
      {/* Aba interior */}
      <rect x="220" y={base.y - dims.waterproof - dims.profileU.h} width={dims.profileU.flange * 2} height={dims.profileU.h} fill="#a0a8b0"/>
      {/* Aba exterior */}
      <rect x={220 + dims.profileU.w * 4 - dims.profileU.flange * 2} y={base.y - dims.waterproof - dims.profileU.h} width={dims.profileU.flange * 2} height={dims.profileU.h} fill="#a0a8b0"/>
      {/* Contorno perfil */}
      <path d={`M220,${base.y - dims.waterproof} L220,${base.y - dims.waterproof - dims.profileU.h} L${220 + dims.profileU.flange * 2},${base.y - dims.waterproof - dims.profileU.h} L${220 + dims.profileU.flange * 2},${base.y - dims.waterproof - dims.profileU.flange * 2} L${220 + dims.profileU.w * 4 - dims.profileU.flange * 2},${base.y - dims.waterproof - dims.profileU.flange * 2} L${220 + dims.profileU.w * 4 - dims.profileU.flange * 2},${base.y - dims.waterproof - dims.profileU.h} L${220 + dims.profileU.w * 4},${base.y - dims.waterproof - dims.profileU.h} L${220 + dims.profileU.w * 4},${base.y - dims.waterproof}`} 
            fill="none" stroke="#444" strokeWidth="1"/>
      
      {/* ========== CALÇOS EPDM ========== */}
      <rect x="226" y={base.y - dims.waterproof - dims.profileU.flange * 2 - 4} width="3" height="4" fill="#333"/>
      <rect x="251" y={base.y - dims.waterproof - dims.profileU.flange * 2 - 4} width="3" height="4" fill="#333"/>
      
      {/* ========== VIDRO LAMINADO 8+8mm ========== */}
      {/* Espessura exagerada para visibilidade (6 unidades = 30mm visual, representa 16mm) */}
      <rect x="232" y={base.y - dims.waterproof - dims.profileU.h - dims.glassHeight} width="6" height={dims.glassHeight} 
            fill="#d4eaf7" fillOpacity="0.7"/>
      {/* Intercalar PVB */}
      <line x1="235" y1={base.y - dims.waterproof - dims.profileU.h - dims.glassHeight} x2="235" y2={base.y - dims.waterproof - dims.profileU.h} 
            stroke="#fff" strokeWidth="0.5" opacity="0.8"/>
      {/* Contorno vidro — linha média */}
      <rect x="232" y={base.y - dims.waterproof - dims.profileU.h - dims.glassHeight} width="6" height={dims.glassHeight} 
            fill="none" stroke="#0284c7" strokeWidth="1"/>
      
      {/* ========== SILICONE ESTRUTURAL ========== */}
      <rect x="226" y={base.y - dims.waterproof - dims.profileU.h + 1} width="6" height={dims.profileU.h - 2} fill="#888" fillOpacity="0.4"/>
      <rect x="238" y={base.y - dims.waterproof - dims.profileU.h + 1} width="6" height={dims.profileU.h - 2} fill="#888" fillOpacity="0.4"/>
      
      {/* ========== CORRIMÃO OPCIONAL ========== */}
      <circle cx="235" cy={base.y - dims.waterproof - dims.profileU.h - dims.glassHeight - 8} r="8" fill="#b0b8c0" stroke="#666" strokeWidth="1"/>
      <circle cx="235" cy={base.y - dims.waterproof - dims.profileU.h - dims.glassHeight - 8} r="5" fill="#d0d4d8"/>
      
      {/* ========== COTAGEM — EN ISO 7519 ========== */}
      {/* Função auxiliar para terminadores oblíquos a 45° */}
      
      {/* COTA 1: Altura vidro — 1100mm */}
      <g className="cota">
        {/* Linhas de chamada */}
        <line x1="238" y1={base.y - dims.waterproof - dims.profileU.h - dims.glassHeight} x2="270" y2={base.y - dims.waterproof - dims.profileU.h - dims.glassHeight} stroke="#333" strokeWidth="0.3"/>
        <line x1="238" y1={base.y - dims.waterproof - dims.profileU.h} x2="270" y2={base.y - dims.waterproof - dims.profileU.h} stroke="#333" strokeWidth="0.3"/>
        {/* Linha de cota */}
        <line x1="265" y1={base.y - dims.waterproof - dims.profileU.h - dims.glassHeight} x2="265" y2={base.y - dims.waterproof - dims.profileU.h} stroke="#333" strokeWidth="0.4"/>
        {/* Terminadores oblíquos */}
        <line x1="263" y1={base.y - dims.waterproof - dims.profileU.h - dims.glassHeight + 2} x2="267" y2={base.y - dims.waterproof - dims.profileU.h - dims.glassHeight - 2} stroke="#333" strokeWidth="0.5"/>
        <line x1="263" y1={base.y - dims.waterproof - dims.profileU.h + 2} x2="267" y2={base.y - dims.waterproof - dims.profileU.h - 2} stroke="#333" strokeWidth="0.5"/>
        {/* Valor */}
        <text x="268" y={base.y - dims.waterproof - dims.profileU.h - dims.glassHeight/2 + 2} fill="#222" fontSize="7" fontFamily="Arial, sans-serif">1100</text>
      </g>
      
      {/* COTA 2: Espessura vidro — 8+8 */}
      <g className="cota">
        <line x1="232" y1={base.y - dims.waterproof - dims.profileU.h - dims.glassHeight - 20} x2="232" y2={base.y - dims.waterproof - dims.profileU.h - dims.glassHeight - 30} stroke="#333" strokeWidth="0.3"/>
        <line x1="238" y1={base.y - dims.waterproof - dims.profileU.h - dims.glassHeight - 20} x2="238" y2={base.y - dims.waterproof - dims.profileU.h - dims.glassHeight - 30} stroke="#333" strokeWidth="0.3"/>
        <line x1="232" y1={base.y - dims.waterproof - dims.profileU.h - dims.glassHeight - 26} x2="238" y2={base.y - dims.waterproof - dims.profileU.h - dims.glassHeight - 26} stroke="#333" strokeWidth="0.4"/>
        <line x1="230" y1={base.y - dims.waterproof - dims.profileU.h - dims.glassHeight - 24} x2="234" y2={base.y - dims.waterproof - dims.profileU.h - dims.glassHeight - 28} stroke="#333" strokeWidth="0.5"/>
        <line x1="236" y1={base.y - dims.waterproof - dims.profileU.h - dims.glassHeight - 24} x2="240" y2={base.y - dims.waterproof - dims.profileU.h - dims.glassHeight - 28} stroke="#333" strokeWidth="0.5"/>
        <text x="235" y={base.y - dims.waterproof - dims.profileU.h - dims.glassHeight - 32} fill="#222" fontSize="6" fontFamily="Arial, sans-serif" textAnchor="middle">8+8</text>
      </g>
      
      {/* COTA 3: Perfil U — 50mm */}
      <g className="cota">
        <line x1="220" y1={base.y + 5} x2="220" y2={base.y + 15} stroke="#333" strokeWidth="0.3"/>
        <line x1="260" y1={base.y + 5} x2="260" y2={base.y + 15} stroke="#333" strokeWidth="0.3"/>
        <line x1="220" y1={base.y + 10} x2="260" y2={base.y + 10} stroke="#333" strokeWidth="0.4"/>
        <line x1="218" y1={base.y + 12} x2="222" y2={base.y + 8} stroke="#333" strokeWidth="0.5"/>
        <line x1="258" y1={base.y + 12} x2="262" y2={base.y + 8} stroke="#333" strokeWidth="0.5"/>
        <text x="240" y={base.y + 22} fill="#222" fontSize="6" fontFamily="Arial, sans-serif" textAnchor="middle">50</text>
      </g>
      
      {/* COTA 4: Laje — 200mm */}
      <g className="cota">
        <line x1="15" y1={base.y} x2="35" y2={base.y} stroke="#333" strokeWidth="0.3"/>
        <line x1="15" y1={base.y + dims.slab} x2="35" y2={base.y + dims.slab} stroke="#333" strokeWidth="0.3"/>
        <line x1="25" y1={base.y} x2="25" y2={base.y + dims.slab} stroke="#333" strokeWidth="0.4"/>
        <line x1="23" y1={base.y + 2} x2="27" y2={base.y - 2} stroke="#333" strokeWidth="0.5"/>
        <line x1="23" y1={base.y + dims.slab + 2} x2="27" y2={base.y + dims.slab - 2} stroke="#333" strokeWidth="0.5"/>
        <text x="22" y={base.y + dims.slab/2 + 2} fill="#222" fontSize="6" fontFamily="Arial, sans-serif" textAnchor="end" transform={`rotate(-90, 22, ${base.y + dims.slab/2})`}>200</text>
      </g>
      
      {/* ========== INDICADORES DE ZONA ========== */}
      <text x="100" y="150" fill="#666" fontSize="9" fontWeight="500">INT.</text>
      <text x="280" y="150" fill="#0284c7" fontSize="9" fontWeight="500">EXT.</text>
      
      {/* ========== NPA — Nível Pavimento Acabado ========== */}
      <line x1={base.x} y1={base.y - dims.waterproof - dims.screed - dims.floor + 3} x2={base.x - 15} y2={base.y - dims.waterproof - dims.screed - dims.floor + 3} stroke="#c00" strokeWidth="0.5"/>
      <text x={base.x - 18} y={base.y - dims.waterproof - dims.screed - dims.floor + 5} fill="#c00" fontSize="5" textAnchor="end">NPA ±0.00</text>
      
      {/* ========== LEGENDA DE MATERIAIS ========== */}
      <g className="legenda" transform="translate(340, 40)">
        <text x="0" y="0" fill="#222" fontSize="8" fontWeight="600">LEGENDA</text>
        <line x1="0" y1="5" x2="60" y2="5" stroke="#222" strokeWidth="0.5"/>
        
        {/* 1 - Vidro */}
        <circle cx="8" cy="20" r="6" fill="none" stroke="#222" strokeWidth="0.8"/>
        <text x="8" y="23" fill="#222" fontSize="7" textAnchor="middle" fontWeight="500">1</text>
        <text x="20" y="22" fill="#333" fontSize="6">Vidro laminado</text>
        <text x="20" y="30" fill="#666" fontSize="5">8+8mm PVB 0.76</text>
        
        {/* 2 - Perfil U */}
        <circle cx="8" cy="48" r="6" fill="none" stroke="#222" strokeWidth="0.8"/>
        <text x="8" y="51" fill="#222" fontSize="7" textAnchor="middle" fontWeight="500">2</text>
        <text x="20" y="50" fill="#333" fontSize="6">Perfil U alumínio</text>
        <text x="20" y="58" fill="#666" fontSize="5">50×40mm anodizado</text>
        
        {/* 3 - Calços */}
        <circle cx="8" cy="76" r="6" fill="none" stroke="#222" strokeWidth="0.8"/>
        <text x="8" y="79" fill="#222" fontSize="7" textAnchor="middle" fontWeight="500">3</text>
        <text x="20" y="78" fill="#333" fontSize="6">Calços EPDM</text>
        <text x="20" y="86" fill="#666" fontSize="5">Apoio do vidro</text>
        
        {/* 4 - Silicone */}
        <circle cx="8" cy="104" r="6" fill="none" stroke="#222" strokeWidth="0.8"/>
        <text x="8" y="107" fill="#222" fontSize="7" textAnchor="middle" fontWeight="500">4</text>
        <text x="20" y="106" fill="#333" fontSize="6">Silicone estrutural</text>
        <text x="20" y="114" fill="#666" fontSize="5">Vedação perimetral</text>
        
        {/* 5 - Corrimão */}
        <circle cx="8" cy="132" r="6" fill="none" stroke="#222" strokeWidth="0.8"/>
        <text x="8" y="135" fill="#222" fontSize="7" textAnchor="middle" fontWeight="500">5</text>
        <text x="20" y="134" fill="#333" fontSize="6">Corrimão (opc.)</text>
        <text x="20" y="142" fill="#666" fontSize="5">Inox AISI 316 ∅42</text>
        
        {/* 6 - Impermeabilização */}
        <circle cx="8" cy="160" r="6" fill="none" stroke="#222" strokeWidth="0.8"/>
        <text x="8" y="163" fill="#222" fontSize="7" textAnchor="middle" fontWeight="500">6</text>
        <text x="20" y="162" fill="#333" fontSize="6">Impermeabilização</text>
        <text x="20" y="170" fill="#666" fontSize="5">Membrana contínua</text>
        
        {/* 7 - Laje */}
        <circle cx="8" cy="188" r="6" fill="none" stroke="#222" strokeWidth="0.8"/>
        <text x="8" y="191" fill="#222" fontSize="7" textAnchor="middle" fontWeight="500">7</text>
        <text x="20" y="190" fill="#333" fontSize="6">Laje estrutural</text>
        <text x="20" y="198" fill="#666" fontSize="5">Betão armado</text>
      </g>
      
      {/* ========== LABELS NO DESENHO ========== */}
      <circle cx="235" cy={base.y - dims.waterproof - dims.profileU.h - dims.glassHeight/2} r="5" fill="#fff" stroke="#222" strokeWidth="0.6"/>
      <text x="235" y={base.y - dims.waterproof - dims.profileU.h - dims.glassHeight/2 + 2} fill="#222" fontSize="6" textAnchor="middle">1</text>
      
      <circle cx="240" cy={base.y - dims.waterproof - dims.profileU.h/2} r="5" fill="#fff" stroke="#222" strokeWidth="0.6"/>
      <text x="240" y={base.y - dims.waterproof - dims.profileU.h/2 + 2} fill="#222" fontSize="6" textAnchor="middle">2</text>
      
      <circle cx="227" cy={base.y - dims.waterproof - 6} r="5" fill="#fff" stroke="#222" strokeWidth="0.6"/>
      <text x="227" y={base.y - dims.waterproof - 4} fill="#222" fontSize="6" textAnchor="middle">3</text>
      
      <circle cx="248" cy={base.y - dims.waterproof - dims.profileU.h + 4} r="5" fill="#fff" stroke="#222" strokeWidth="0.6"/>
      <text x="248" y={base.y - dims.waterproof - dims.profileU.h + 6} fill="#222" fontSize="6" textAnchor="middle">4</text>
      
      <circle cx="235" cy={base.y - dims.waterproof - dims.profileU.h - dims.glassHeight - 20} r="5" fill="#fff" stroke="#222" strokeWidth="0.6"/>
      <text x="235" y={base.y - dims.waterproof - dims.profileU.h - dims.glassHeight - 18} fill="#222" fontSize="6" textAnchor="middle">5</text>
      
      <circle cx="180" cy={base.y - dims.waterproof} r="5" fill="#fff" stroke="#222" strokeWidth="0.6"/>
      <text x="180" y={base.y - dims.waterproof + 2} fill="#222" fontSize="6" textAnchor="middle">6</text>
      
      <circle cx="130" cy={base.y + dims.slab/2} r="5" fill="#fff" stroke="#222" strokeWidth="0.6"/>
      <text x="130" y={base.y + dims.slab/2 + 2} fill="#222" fontSize="6" textAnchor="middle">7</text>
      
      {/* ========== ESPECIFICAÇÕES TÉCNICAS ========== */}
      <g className="specs" transform="translate(340, 250)">
        <text x="0" y="0" fill="#222" fontSize="8" fontWeight="600">ESPECIFICAÇÕES</text>
        <line x1="0" y1="5" x2="60" y2="5" stroke="#222" strokeWidth="0.5"/>
        
        <text x="0" y="18" fill="#333" fontSize="6">Altura vidro:</text>
        <text x="50" y="18" fill="#222" fontSize="6" fontWeight="500">≥1100 mm</text>
        
        <text x="0" y="30" fill="#333" fontSize="6">Carga horiz.:</text>
        <text x="50" y="30" fill="#222" fontSize="6" fontWeight="500">≥1.0 kN/m</text>
        
        <text x="0" y="42" fill="#333" fontSize="6">Vidro:</text>
        <text x="50" y="42" fill="#222" fontSize="6" fontWeight="500">8+8 laminado</text>
        
        <text x="0" y="54" fill="#333" fontSize="6">Perfil U:</text>
        <text x="50" y="54" fill="#222" fontSize="6" fontWeight="500">50×40 alu.</text>
      </g>
      
      {/* ========== CABEÇALHO ========== */}
      <text x="40" y="18" fill="#222" fontSize="10" fontWeight="600">J.21 — Guarda Varanda — Vidro</text>
      <text x="40" y="30" fill="#666" fontSize="7">Corte vertical · Escala 1:5 · EN 12150, EN 14449</text>
      
      {/* ========== NOTAS ========== */}
      <g className="notas" transform="translate(40, 345)">
        <text x="0" y="0" fill="#444" fontSize="6">
          <tspan fontWeight="500">Notas:</tspan>
          <tspan dx="5">① Vidro laminado obrigatório.</tspan>
          <tspan dx="5">② Perfil U c/ furos drenagem ∅8 @500.</tspan>
          <tspan dx="5">③ Alt. ≥1100mm; queda {'>'}6m: ≥1200mm.</tspan>
        </text>
      </g>
    </svg>
  );
};

// ============================================================
// J.23 — Guarda Terraço — Fixação Pavimento
// Corte vertical — Platina sobre impermeabilização
// ============================================================
export const J23: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 500 375" className={className}>
    <SVGDefs />
    
    {/* EXTERIOR */}
    <rect x="350" y="30" width="120" height="320" fill="#e8f4fc" opacity="0.3"/>
    <text x="410" y="100" fill="#4a90d9" fontSize="10" textAnchor="middle" opacity="0.5">EXT.</text>
    
    {/* LAJE ESTRUTURAL */}
    <rect x="30" y="280" width="350" height="70" fill="url(#pc)"/>
    <line x1="30" y1="280" x2="380" y2="280" stroke="#333" strokeWidth="2"/>
    
    {/* IMPERMEABILIZAÇÃO - contínua */}
    <line x1="30" y1="270" x2="380" y2="270" stroke="#4a90d9" strokeWidth="4"/>
    <text x="50" y="268" fill="#4a90d9" fontSize="5">IMPERMEAB.</text>
    
    {/* PROTEÇÃO MECÂNICA - betonilha */}
    <rect x="30" y="250" width="300" height="20" fill="url(#pm)"/>
    <line x1="30" y1="250" x2="330" y2="250" stroke="#444" strokeWidth="1"/>
    
    {/* PAVIMENTO sobre plots (indicação) */}
    <rect x="30" y="230" width="80" height="20" fill="url(#pk)"/>
    <rect x="120" y="230" width="80" height="20" fill="url(#pk)"/>
    <rect x="210" y="230" width="80" height="20" fill="url(#pk)"/>
    {/* Plots */}
    <rect x="105" y="245" width="10" height="5" fill="#333"/>
    <rect x="195" y="245" width="10" height="5" fill="#333"/>
    <rect x="285" y="245" width="10" height="5" fill="#333"/>
    
    {/* PLATINA BASE */}
    <rect x="300" y="220" width="60" height="10" fill="url(#ps)"/>
    <line x1="300" y1="220" x2="360" y2="220" stroke="#555" strokeWidth="2"/>
    <line x1="300" y1="230" x2="360" y2="230" stroke="#555" strokeWidth="1.5"/>
    
    {/* VEDANTE EPDM sob platina */}
    <rect x="300" y="230" width="60" height="5" fill="#333"/>
    
    {/* ANCORAGENS - atravessam impermeabilização */}
    <line x1="315" y1="230" x2="315" y2="300" stroke="#666" strokeWidth="2"/>
    <line x1="345" y1="230" x2="345" y2="300" stroke="#666" strokeWidth="2"/>
    <circle cx="315" cy="300" r="4" fill="#888"/>
    <circle cx="345" cy="300" r="4" fill="#888"/>
    
    {/* Selagem ancoragens */}
    <ellipse cx="315" cy="270" rx="6" ry="3" fill="#d94a4a" opacity="0.6"/>
    <ellipse cx="345" cy="270" rx="6" ry="3" fill="#d94a4a" opacity="0.6"/>
    
    {/* MONTANTE VERTICAL */}
    <rect x="315" y="50" width="30" height="170" fill="url(#ps)"/>
    <line x1="315" y1="50" x2="345" y2="50" stroke="#555" strokeWidth="2"/>
    <line x1="315" y1="50" x2="315" y2="220" stroke="#555" strokeWidth="2"/>
    <line x1="345" y1="50" x2="345" y2="220" stroke="#555" strokeWidth="2"/>
    
    {/* CORRIMÃO */}
    <ellipse cx="330" cy="50" rx="18" ry="18" fill="url(#ps)"/>
    <ellipse cx="330" cy="50" rx="18" ry="18" fill="none" stroke="#555" strokeWidth="2"/>
    <ellipse cx="330" cy="50" rx="10" ry="10" fill="#fafaf8"/>
    
    {/* BALAÚSTRES/ENCHIMENTO */}
    <line x1="330" y1="68" x2="330" y2="220" stroke="#555" strokeWidth="1.5" strokeDasharray="15,8"/>
    
    {/* INTERIOR */}
    <text x="100" y="180" fill="#666" fontSize="10" textAnchor="middle">INT.</text>
    
    {/* ============ COTAS ============ */}
    {/* Altura guarda - 1100mm */}
    <line x1="370" y1="50" x2="390" y2="50" stroke="#666" strokeWidth=".4"/>
    <line x1="370" y1="230" x2="390" y2="230" stroke="#666" strokeWidth=".4"/>
    <line x1="380" y1="50" x2="380" y2="230" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="395" y="145" fill="#333" fontSize="6" fontFamily="monospace" fontWeight="500">≥1100</text>
    
    {/* Platina */}
    <line x1="300" y1="205" x2="300" y2="215" stroke="#666" strokeWidth=".4"/>
    <line x1="360" y1="205" x2="360" y2="215" stroke="#666" strokeWidth=".4"/>
    <line x1="300" y1="210" x2="360" y2="210" stroke="#666" strokeWidth=".5" strokeDasharray="2,1"/>
    <text x="330" y="200" fill="#333" fontSize="5" textAnchor="middle" fontFamily="monospace">150×150</text>
    
    {/* Indicação */}
    <text x="200" y="365" fill="#555" fontSize="7" textAnchor="middle" fontStyle="italic" fontWeight="500">corte vertical — guarda terraço c/ fixação sobre impermeab.</text>
    
    {/* NOTAS */}
    <text x="30" y="55" fill="#444" fontSize="7" fontWeight="500">① Platina assenta sobre impermeabilização.</text>
    <text x="30" y="70" fill="#444" fontSize="7" fontWeight="500">② Vedante EPDM compressível sob platina.</text>
    <text x="30" y="85" fill="#444" fontSize="7" fontWeight="500">③ Ancoragens c/ selagem (zona crítica).</text>
    <text x="30" y="100" fill="#d94a4a" fontSize="7" fontWeight="600">④ NÃO perfurar membrana sem selagem!</text>
    
    {/* LEGENDA */}
    <rect x="30" y="125" width="15" height="8" fill="#d94a4a" opacity="0.6"/>
    <text x="50" y="132" fill="#d94a4a" fontSize="6">Selagem ancoragem</text>
  </svg>
);

// Export all corrected SVG components
export const DetailSVGs: Record<string, React.FC<{ className?: string }>> = {
  A01,
  A02,
  A03,
  A04,
  B01,
  B02,
  B03,
  C01,
  C02,
  D01,
  D02,
  D03,
  E01,
  E02,
  F01,
  F05,
  G01,
  G04,
  G05,
  H01,
  I01,
  J01,
  J02,
  J11,
  J21,
  J23,
};

export default DetailSVGs;
