// A02HybridSheet.tsx - Folha Híbrida do detalhe A.02
// Base de Parede — Zona Húmida
// Layout: Corte + Planta (sem axonometria)

import React from 'react';
import { HybridSheetA4 } from './HybridSheetA4';
import { LabelSet } from './Label';
import { LABEL_CONFIG } from './labelConfig';

// ============================================================
// DADOS DO DETALHE A.02
// ============================================================

const legendA02 = [
  { num: 1, title: 'Placa gesso standard', desc: '2×8mm = 16mm (seca)' },
  { num: 2, title: 'Placa gesso H1', desc: '2×8mm = 16mm (húmida)' },
  { num: 3, title: 'Montante C48', desc: 'Aço galv. e=0.6' },
  { num: 4, title: 'Lã mineral', desc: '48mm ρ≥40kg/m³' },
  { num: 5, title: 'Guia U inferior', desc: 'U 48/30' },
  { num: 6, title: 'Banda resiliente', desc: 'Sob guia' },
  { num: 7, title: 'Selante hidrófugo', desc: 'Resistente humidade' },
  { num: 8, title: 'Rodapé MDF', desc: '70×15mm (seca)' },
  { num: 9, title: 'Rodapé cerâmico', desc: '70×10mm (húmida)' },
  { num: 10, title: 'Laje estrutural', desc: 'Betão armado' },
];

const specsA02 = [
  { label: 'Espessura total', value: '80 mm' },
  { label: 'Altura máxima', value: '3.00 m' },
  { label: 'Folga placa H1', value: '10 mm' },
  { label: 'Placa H1', value: 'Obrig. lado húmido' },
  { label: 'Fixação guia', value: 'Ø6 @600' },
];

// ============================================================
// POSIÇÕES DOS LABELS (respeitando distância mínima de 6 unidades)
// ============================================================

const sectionLabels = [
  { num: 1, x: 36, y: 38 },   // Placa gesso standard (esquerda)
  { num: 2, x: 74, y: 38 },   // Placa gesso H1 (direita)
  { num: 3, x: 55, y: 22 },   // Montante metálico
  { num: 4, x: 55, y: 48 },   // Lã mineral
  { num: 5, x: 52, y: 66 },   // Guia U inferior
  { num: 6, x: 60, y: 72 },   // Banda resiliente
  { num: 7, x: 74, y: 58 },   // Selante hidrófugo
  { num: 8, x: 28, y: 60 },   // Rodapé MDF (esquerda)
  { num: 9, x: 84, y: 60 },   // Rodapé cerâmico (direita)
  { num: 10, x: 55, y: 86 },  // Laje estrutural
];

const planLabels = [
  { num: 1, x: 37, y: 20 },   // Placa gesso standard
  { num: 2, x: 63, y: 20 },   // Placa gesso H1
  { num: 3, x: 50, y: 30 },   // Montante
  { num: 4, x: 50, y: 48 },   // Lã mineral
  { num: 8, x: 28, y: 30 },   // Rodapé MDF
  { num: 9, x: 80, y: 30 },   // Rodapé cerâmico
];

// ============================================================
// CORTE A-A' - Vista principal (contida na área branca)
// ============================================================
const SectionView: React.FC = () => (
  <g transform="translate(12, 8) scale(1.0)">
    {/* === LAJE ESTRUTURAL === */}
    <rect x="5" y="75" width="110" height="22" fill="url(#h-pc)"/>
    <line x1="5" y1="75" x2="115" y2="75" stroke="#333" strokeWidth=".8"/>
    <line x1="5" y1="97" x2="115" y2="97" stroke="#333" strokeWidth=".3"/>
    
    {/* === BETONILHA === */}
    <rect x="5" y="68" width="110" height="7" fill="url(#h-pm)"/>
    <line x1="5" y1="68" x2="115" y2="68" stroke="#333" strokeWidth=".4"/>
    
    {/* === REVESTIMENTO CERÂMICO === */}
    <rect x="5" y="64" width="110" height="4" fill="url(#h-pk)"/>
    <line x1="5" y1="64" x2="115" y2="64" stroke="#333" strokeWidth=".35"/>
    
    {/* === GUIA U INFERIOR === */}
    <rect x="45" y="64" width="20" height="4" fill="url(#h-ps)"/>
    <line x1="45" y1="64" x2="65" y2="64" stroke="#333" strokeWidth=".6"/>
    <line x1="45" y1="68" x2="65" y2="68" stroke="#333" strokeWidth=".6"/>
    <line x1="45" y1="64" x2="45" y2="68" stroke="#333" strokeWidth=".6"/>
    <line x1="65" y1="64" x2="65" y2="68" stroke="#333" strokeWidth=".6"/>
    
    {/* === BANDA RESILIENTE === */}
    <rect x="45" y="68" width="20" height="2" fill="url(#h-pr)"/>
    
    {/* === MONTANTE METÁLICO === */}
    <line x1="48" y1="15" x2="48" y2="64" stroke="#333" strokeWidth=".6"/>
    <line x1="62" y1="15" x2="62" y2="64" stroke="#333" strokeWidth=".6"/>
    <line x1="48" y1="15" x2="62" y2="15" stroke="#333" strokeWidth=".6"/>
    
    {/* === LÃ MINERAL === */}
    <rect x="48" y="15" width="14" height="49" fill="url(#h-pi)"/>
    
    {/* === PLACA GESSO ESQUERDA - STANDARD (2×8mm = 16mm) === */}
    <rect x="40" y="10" width="8" height="56" fill="url(#h-pg)"/>
    <line x1="40" y1="10" x2="40" y2="66" stroke="#333" strokeWidth=".7"/>
    <line x1="44" y1="10" x2="44" y2="66" stroke="#333" strokeWidth=".25" strokeDasharray="1,.5"/>
    <line x1="48" y1="10" x2="48" y2="66" stroke="#333" strokeWidth=".4"/>
    
    {/* === PLACA GESSO DIREITA - H1 HIDRÓFUGA (2×8mm = 16mm) com folga 10mm === */}
    <rect x="62" y="10" width="8" height="52" fill="#c8e8c8"/>
    <line x1="62" y1="10" x2="62" y2="62" stroke="#333" strokeWidth=".4"/>
    <line x1="66" y1="10" x2="66" y2="62" stroke="#333" strokeWidth=".25" strokeDasharray="1,.5"/>
    <line x1="70" y1="10" x2="70" y2="62" stroke="#333" strokeWidth=".7"/>
    <line x1="62" y1="62" x2="70" y2="62" stroke="#333" strokeWidth=".4"/>
    {/* Indicação H1 */}
    <text x="66" y="25" fill="#1a6a1a" fontSize="3" fontWeight="700" textAnchor="middle" fontFamily="Arial">H1</text>
    
    {/* === RODAPÉ ESQUERDO MDF (70×15mm) === */}
    <rect x="33" y="54" width="7" height="12" fill="url(#h-pw)"/>
    <line x1="33" y1="54" x2="40" y2="54" stroke="#333" strokeWidth=".5"/>
    <line x1="33" y1="66" x2="40" y2="66" stroke="#333" strokeWidth=".35"/>
    <line x1="33" y1="54" x2="33" y2="66" stroke="#333" strokeWidth=".5"/>
    
    {/* === RODAPÉ DIREITO CERÂMICO (70×10mm) === */}
    <rect x="70" y="54" width="5" height="12" fill="url(#h-pk)"/>
    <line x1="70" y1="54" x2="75" y2="54" stroke="#333" strokeWidth=".5"/>
    <line x1="70" y1="66" x2="75" y2="66" stroke="#333" strokeWidth=".35"/>
    <line x1="75" y1="54" x2="75" y2="66" stroke="#333" strokeWidth=".5"/>
    
    {/* === SELANTE HIDRÓFUGO === */}
    <ellipse cx="40.5" cy="65" rx="1.5" ry="1" fill="#3a6a6a"/>
    <ellipse cx="69.5" cy="61.5" rx="1.5" ry="1" fill="#3a6a6a"/>
    
    {/* === INDICAÇÃO DAS ZONAS === */}
    <text x="25" y="20" fill="#333" fontSize="3" fontStyle="italic" fontWeight="600" fontFamily="Arial">zona seca</text>
    <text x="85" y="20" fill="#1a6a1a" fontSize="3" fontStyle="italic" fontWeight="600" fontFamily="Arial">zona húmida</text>
    
    {/* === COTAS HORIZONTAIS (topo) === */}
    
    {/* Cotas parciais - 16 + 48 + 16 = 80mm */}
    <line x1="40" y1="3" x2="40" y2="8" stroke="#333" strokeWidth=".15"/>
    <line x1="48" y1="3" x2="48" y2="8" stroke="#333" strokeWidth=".15"/>
    <line x1="62" y1="3" x2="62" y2="8" stroke="#333" strokeWidth=".15"/>
    <line x1="70" y1="3" x2="70" y2="8" stroke="#333" strokeWidth=".15"/>
    <line x1="40" y1="5" x2="48" y2="5" stroke="#333" strokeWidth=".2"/>
    <line x1="48" y1="5" x2="62" y2="5" stroke="#333" strokeWidth=".2"/>
    <line x1="62" y1="5" x2="70" y2="5" stroke="#333" strokeWidth=".2"/>
    <line x1="38.5" y1="3.5" x2="41.5" y2="6.5" stroke="#333" strokeWidth=".35"/>
    <line x1="46.5" y1="3.5" x2="49.5" y2="6.5" stroke="#333" strokeWidth=".35"/>
    <line x1="60.5" y1="3.5" x2="63.5" y2="6.5" stroke="#333" strokeWidth=".35"/>
    <line x1="68.5" y1="3.5" x2="71.5" y2="6.5" stroke="#333" strokeWidth=".35"/>
    <text x="44" y="2" fill="#555" fontSize="2.5" textAnchor="middle" fontFamily="Arial">16</text>
    <text x="55" y="2" fill="#555" fontSize="2.5" textAnchor="middle" fontFamily="Arial">48</text>
    <text x="66" y="2" fill="#555" fontSize="2.5" textAnchor="middle" fontFamily="Arial">16</text>
    
    {/* Cota total (80mm) */}
    <line x1="40" y1="10" x2="40" y2="14" stroke="#333" strokeWidth=".15"/>
    <line x1="70" y1="10" x2="70" y2="14" stroke="#333" strokeWidth=".15"/>
    <line x1="40" y1="12" x2="70" y2="12" stroke="#333" strokeWidth=".2"/>
    <line x1="38.5" y1="10.5" x2="41.5" y2="13.5" stroke="#333" strokeWidth=".35"/>
    <line x1="68.5" y1="10.5" x2="71.5" y2="13.5" stroke="#333" strokeWidth=".35"/>
    <rect x="49" y="9" width="12" height="4" fill="#fafaf8"/>
    <text x="55" y="12" fill="#333" fontSize="3" fontWeight="600" textAnchor="middle" fontFamily="Arial">80</text>
    
    {/* === COTAS VERTICAIS ESQUERDA === */}
    
    {/* Cota rodapé altura (70mm) */}
    <line x1="20" y1="54" x2="28" y2="54" stroke="#333" strokeWidth=".15"/>
    <line x1="20" y1="66" x2="28" y2="66" stroke="#333" strokeWidth=".15"/>
    <line x1="24" y1="54" x2="24" y2="66" stroke="#333" strokeWidth=".2"/>
    <line x1="22.5" y1="52.5" x2="25.5" y2="55.5" stroke="#333" strokeWidth=".35"/>
    <line x1="22.5" y1="64.5" x2="25.5" y2="67.5" stroke="#333" strokeWidth=".35"/>
    <text x="18" y="62" fill="#333" fontSize="3" fontWeight="600" textAnchor="end" fontFamily="Arial">70</text>
    
    {/* Cota rodapé espessura (15mm) */}
    <line x1="33" y1="49" x2="33" y2="52" stroke="#333" strokeWidth=".15"/>
    <line x1="40" y1="49" x2="40" y2="52" stroke="#333" strokeWidth=".15"/>
    <line x1="33" y1="50.5" x2="40" y2="50.5" stroke="#333" strokeWidth=".2"/>
    <line x1="31.5" y1="49" x2="34.5" y2="52" stroke="#333" strokeWidth=".35"/>
    <line x1="38.5" y1="49" x2="41.5" y2="52" stroke="#333" strokeWidth=".35"/>
    <text x="36.5" y="48" fill="#555" fontSize="2.5" textAnchor="middle" fontFamily="Arial">15</text>
    
    {/* === COTA FOLGA H1 (10mm) - lado direito === */}
    <line x1="92" y1="62" x2="100" y2="62" stroke="#333" strokeWidth=".15"/>
    <line x1="92" y1="66" x2="100" y2="66" stroke="#333" strokeWidth=".15"/>
    <line x1="96" y1="62" x2="96" y2="66" stroke="#333" strokeWidth=".2"/>
    <line x1="94.5" y1="60.5" x2="97.5" y2="63.5" stroke="#333" strokeWidth=".35"/>
    <line x1="94.5" y1="64.5" x2="97.5" y2="67.5" stroke="#333" strokeWidth=".35"/>
    <text x="103" y="65" fill="#1a6a1a" fontSize="2.5" fontWeight="600" fontFamily="Arial">10</text>
    <text x="103" y="68" fill="#1a6a1a" fontSize="2" fontStyle="italic" fontFamily="Arial">folga</text>
    
    {/* === LABELS === */}
    <LabelSet labels={sectionLabels} defaultSize={LABEL_CONFIG.defaultSize} />
    
    {/* === COTAS DAS CAMADAS (lado direito) === */}
    <g transform="translate(108, 64)">
      <line x1="0" y1="0" x2="0" y2="18" stroke="#333" strokeWidth=".2"/>
      <line x1="-2" y1="0" x2="2" y2="0" stroke="#333" strokeWidth=".15"/>
      <line x1="-2" y1="4" x2="2" y2="4" stroke="#333" strokeWidth=".15"/>
      <text x="5" y="3" fill="#555" fontSize="2.5" fontFamily="Arial">12</text>
      <line x1="-2" y1="8" x2="2" y2="8" stroke="#333" strokeWidth=".15"/>
      <text x="5" y="7" fill="#555" fontSize="2.5" fontFamily="Arial">~8</text>
      <line x1="-2" y1="18" x2="2" y2="18" stroke="#333" strokeWidth=".15"/>
      <text x="5" y="14" fill="#555" fontSize="2.5" fontFamily="Arial">20</text>
    </g>
  </g>
);

// ============================================================
// PLANTA - Vista de cima (contida na área branca)
// ============================================================
const PlanView: React.FC = () => (
  <g transform="translate(8, 8) scale(0.85)">
    {/* === PAVIMENTO ESQUERDO (zona seca) === */}
    <rect x="8" y="8" width="24" height="58" fill="url(#h-pk)"/>
    
    {/* === PLACA GESSO ESQUERDA - STANDARD === */}
    <rect x="32" y="8" width="10" height="58" fill="url(#h-pg)"/>
    <line x1="32" y1="8" x2="32" y2="66" stroke="#333" strokeWidth=".7"/>
    <line x1="37" y1="8" x2="37" y2="66" stroke="#333" strokeWidth=".2" strokeDasharray="1.5,.8"/>
    <line x1="42" y1="8" x2="42" y2="66" stroke="#333" strokeWidth=".5"/>
    
    {/* === CAVIDADE COM ISOLAMENTO === */}
    <rect x="42" y="8" width="16" height="58" fill="url(#h-pi)"/>
    
    {/* === MONTANTES EM PLANTA @600mm === */}
    <rect x="42" y="10" width="16" height="3" fill="url(#h-ps)"/>
    <rect x="42" y="22" width="16" height="3" fill="url(#h-ps)"/>
    <rect x="42" y="34" width="16" height="3" fill="url(#h-ps)"/>
    <rect x="42" y="46" width="16" height="3" fill="url(#h-ps)"/>
    <rect x="42" y="58" width="16" height="3" fill="url(#h-ps)"/>
    
    {/* === PLACA GESSO DIREITA - H1 HIDRÓFUGA === */}
    <rect x="58" y="8" width="10" height="58" fill="#c8e8c8"/>
    <line x1="58" y1="8" x2="58" y2="66" stroke="#333" strokeWidth=".5"/>
    <line x1="63" y1="8" x2="63" y2="66" stroke="#333" strokeWidth=".2" strokeDasharray="1.5,.8"/>
    <line x1="68" y1="8" x2="68" y2="66" stroke="#333" strokeWidth=".7"/>
    {/* Indicação H1 */}
    <text x="63" y="37" fill="#1a6a1a" fontSize="4" fontWeight="700" textAnchor="middle" fontFamily="Arial">H1</text>
    
    {/* === PAVIMENTO DIREITO (zona húmida) === */}
    <rect x="68" y="8" width="32" height="58" fill="url(#h-pk)"/>
    
    {/* === RODAPÉ ESQUERDO MDF === */}
    <rect x="25" y="8" width="7" height="58" fill="url(#h-pw)"/>
    <line x1="25" y1="8" x2="25" y2="66" stroke="#333" strokeWidth=".5"/>
    
    {/* === RODAPÉ DIREITO CERÂMICO === */}
    <rect x="68" y="8" width="5" height="58" fill="url(#h-pk)"/>
    <line x1="73" y1="8" x2="73" y2="66" stroke="#333" strokeWidth=".5"/>
    
    {/* === INDICAÇÃO DAS ZONAS === */}
    <text x="16" y="5" fill="#333" fontSize="3" fontStyle="italic" fontWeight="500" fontFamily="Arial">zona seca</text>
    <text x="80" y="5" fill="#1a6a1a" fontSize="3" fontStyle="italic" fontWeight="500" fontFamily="Arial">zona húmida</text>
    
    {/* === LINHA DE CORTE A-A' === */}
    <line x1="3" y1="37" x2="105" y2="37" stroke="#222" strokeWidth=".6" strokeDasharray="6,2,1.5,2"/>
    <circle cx="3" cy="37" r="4" fill="#fff" stroke="#222" strokeWidth=".5"/>
    <text x="3" y="39" fill="#222" fontSize="4" fontWeight="700" textAnchor="middle" fontFamily="Arial">A</text>
    <circle cx="105" cy="37" r="4" fill="#fff" stroke="#222" strokeWidth=".5"/>
    <text x="105" y="39" fill="#222" fontSize="4" fontWeight="700" textAnchor="middle" fontFamily="Arial">A'</text>
    
    {/* === COTAS HORIZONTAIS === */}
    
    {/* COTAS PARCIAIS (16 + 48 + 16 = 80mm) */}
    <line x1="32" y1="68" x2="32" y2="73" stroke="#333" strokeWidth=".15"/>
    <line x1="42" y1="68" x2="42" y2="73" stroke="#333" strokeWidth=".15"/>
    <line x1="58" y1="68" x2="58" y2="73" stroke="#333" strokeWidth=".15"/>
    <line x1="68" y1="68" x2="68" y2="73" stroke="#333" strokeWidth=".15"/>
    <line x1="32" y1="70" x2="42" y2="70" stroke="#333" strokeWidth=".2"/>
    <line x1="42" y1="70" x2="58" y2="70" stroke="#333" strokeWidth=".2"/>
    <line x1="58" y1="70" x2="68" y2="70" stroke="#333" strokeWidth=".2"/>
    <line x1="30.5" y1="68.5" x2="33.5" y2="71.5" stroke="#333" strokeWidth=".35"/>
    <line x1="40.5" y1="68.5" x2="43.5" y2="71.5" stroke="#333" strokeWidth=".35"/>
    <line x1="56.5" y1="68.5" x2="59.5" y2="71.5" stroke="#333" strokeWidth=".35"/>
    <line x1="66.5" y1="68.5" x2="69.5" y2="71.5" stroke="#333" strokeWidth=".35"/>
    <text x="37" y="68" fill="#555" fontSize="2.5" textAnchor="middle" fontFamily="Arial">16</text>
    <text x="50" y="68" fill="#555" fontSize="2.5" textAnchor="middle" fontFamily="Arial">48</text>
    <text x="63" y="68" fill="#555" fontSize="2.5" textAnchor="middle" fontFamily="Arial">16</text>
    
    {/* COTA TOTAL (80mm) */}
    <line x1="32" y1="74" x2="32" y2="79" stroke="#333" strokeWidth=".15"/>
    <line x1="68" y1="74" x2="68" y2="79" stroke="#333" strokeWidth=".15"/>
    <line x1="32" y1="76" x2="68" y2="76" stroke="#333" strokeWidth=".2"/>
    <line x1="30.5" y1="74.5" x2="33.5" y2="77.5" stroke="#333" strokeWidth=".35"/>
    <line x1="66.5" y1="74.5" x2="69.5" y2="77.5" stroke="#333" strokeWidth=".35"/>
    <rect x="44" y="73" width="12" height="4" fill="#fafaf8"/>
    <text x="50" y="76" fill="#333" fontSize="3" fontWeight="600" textAnchor="middle" fontFamily="Arial">80</text>
    
    {/* Cota rodapé MDF (15mm) */}
    <line x1="25" y1="68" x2="25" y2="71" stroke="#333" strokeWidth=".15"/>
    <line x1="32" y1="68" x2="32" y2="71" stroke="#333" strokeWidth=".15"/>
    <line x1="25" y1="69.5" x2="32" y2="69.5" stroke="#333" strokeWidth=".15"/>
    <text x="28.5" y="68" fill="#555" fontSize="2.2" textAnchor="middle" fontFamily="Arial">15</text>
    
    {/* Cota rodapé cerâmico (10mm) */}
    <line x1="68" y1="68" x2="68" y2="71" stroke="#333" strokeWidth=".15"/>
    <line x1="73" y1="68" x2="73" y2="71" stroke="#333" strokeWidth=".15"/>
    <line x1="68" y1="69.5" x2="73" y2="69.5" stroke="#333" strokeWidth=".15"/>
    <text x="70.5" y="68" fill="#555" fontSize="2.2" textAnchor="middle" fontFamily="Arial">10</text>
    
    {/* Espaçamento montantes (600mm) */}
    <line x1="95" y1="10" x2="100" y2="10" stroke="#333" strokeWidth=".15"/>
    <line x1="95" y1="22" x2="100" y2="22" stroke="#333" strokeWidth=".15"/>
    <line x1="97.5" y1="10" x2="97.5" y2="22" stroke="#333" strokeWidth=".2"/>
    <line x1="96" y1="8.5" x2="99" y2="11.5" stroke="#333" strokeWidth=".35"/>
    <line x1="96" y1="20.5" x2="99" y2="23.5" stroke="#333" strokeWidth=".35"/>
    <text x="103" y="18" fill="#333" fontSize="3" fontWeight="600" fontFamily="Arial">600</text>
    
    {/* === LABELS === */}
    <LabelSet labels={planLabels} defaultSize={LABEL_CONFIG.scaledSize} />
  </g>
);

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export const A02HybridSheet: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className}>
    <HybridSheetA4
      reference="FA—A.02"
      title="Base de Parede — Zona Húmida"
      subtitle="Parede em gesso cartonado — Encontro com pavimento (humidade ocasional)"
      scale="1:5"
      date="Fev 2025"
      revision="A"
      legend={legendA02}
      specs={specsA02}
      sectionContent={<SectionView />}
      planContent={<PlanView />}
    />
  </div>
);

export default A02HybridSheet;
