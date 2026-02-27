// A01FullSheet.tsx - Folha A4 completa do detalhe A.01
// Base de Parede — Zona Seca
// Inclui: Corte, Planta e Axonometria

import React from 'react';
import { DetailSheetA4 } from './DetailSheetA4';

// Dados do detalhe A.01
const legendA01 = [
  { num: 1, title: 'Placa gesso BA13', desc: '1×12.5 mm por face' },
  { num: 2, title: 'Montante C48', desc: 'Aço galv. e=0.6 mm' },
  { num: 3, title: 'Lã mineral', desc: '40 mm, ρ≥40 kg/m³' },
  { num: 4, title: 'Guia U inferior', desc: 'U 48/30, fix. @600' },
  { num: 5, title: 'Banda resiliente', desc: 'Sob guia U' },
  { num: 6, title: 'Rodapé MDF', desc: '70×15 mm, lacado' },
  { num: 7, title: 'Selante elástico', desc: 'Perimetral' },
  { num: 8, title: 'Revestimento', desc: 'Cerâmico ~12 mm' },
  { num: 9, title: 'Betonilha', desc: '~20 mm' },
  { num: 10, title: 'Laje estrutural', desc: 'Betão armado' },
];

const specsA01 = [
  { label: 'Espessura parede', value: '80 mm' },
  { label: 'Altura máx. (e=0.6)', value: '3.00 m' },
  { label: 'Montantes', value: '@600 mm' },
  { label: 'Rodapé', value: '70×15 mm' },
  { label: 'Fix. guia U', value: 'Ø6 @600' },
];

// Componente Label para as vistas
const Label: React.FC<{ num: number; x: number; y: number; size?: number }> = ({ 
  num, x, y, size = 2.5 
}) => (
  <g>
    <circle cx={x} cy={y} r={size} fill="#fff" stroke="#000" strokeWidth=".25"/>
    <text x={x} y={y + size * 0.35} fill="#000" fontSize={size * 0.8} fontWeight="600" 
          textAnchor="middle" fontFamily="Arial">{num}</text>
  </g>
);

// ============================================================
// VISTA: CORTE A-A' (Corte Vertical) - VERSÃO MAIOR
// ============================================================
const CorteView: React.FC = () => (
  <g transform="translate(0, 0)">
    {/* Título da vista */}
    <text x="45" y="8" fill="#000" fontSize="3.5" fontWeight="700" fontFamily="Arial">
      CORTE A-A'
    </text>
    <text x="45" y="13" fill="#666" fontSize="2.2" fontFamily="Arial">
      Escala 1:5
    </text>
    
    {/* Área do desenho - escala 1.4x maior */}
    <g transform="translate(5, 15) scale(1.4)">
      {/* Laje */}
      <rect x="5" y="75" width="70" height="25" fill="url(#s-pc)"/>
      <line x1="5" y1="75" x2="75" y2="75" stroke="#000" strokeWidth=".6"/>
      
      {/* Betonilha */}
      <rect x="5" y="70" width="70" height="5" fill="url(#s-pm)"/>
      <line x1="5" y1="70" x2="75" y2="70" stroke="#000" strokeWidth=".35"/>
      
      {/* Cola + Revestimento */}
      <rect x="5" y="67" width="70" height="3" fill="url(#s-pk)"/>
      <line x1="5" y1="67" x2="75" y2="67" stroke="#000" strokeWidth=".3"/>
      
      {/* Guia U */}
      <rect x="28" y="67" width="14" height="3" fill="url(#s-ps)"/>
      <line x1="28" y1="67" x2="42" y2="67" stroke="#000" strokeWidth=".45"/>
      <line x1="28" y1="70" x2="42" y2="70" stroke="#000" strokeWidth=".45"/>
      <line x1="28" y1="67" x2="28" y2="70" stroke="#000" strokeWidth=".45"/>
      <line x1="42" y1="67" x2="42" y2="70" stroke="#000" strokeWidth=".45"/>
      
      {/* Banda resiliente */}
      <rect x="28" y="70" width="14" height="1.2" fill="url(#s-pr)"/>
      
      {/* Montante */}
      <line x1="30" y1="18" x2="30" y2="67" stroke="#000" strokeWidth=".45"/>
      <line x1="40" y1="18" x2="40" y2="67" stroke="#000" strokeWidth=".45"/>
      <line x1="30" y1="18" x2="40" y2="18" stroke="#000" strokeWidth=".45"/>
      
      {/* Lã mineral */}
      <rect x="30" y="18" width="10" height="49" fill="url(#s-pi)"/>
      
      {/* Placa gesso esquerda */}
      <rect x="25" y="15" width="5" height="54" fill="url(#s-pg)"/>
      <line x1="25" y1="15" x2="25" y2="69" stroke="#000" strokeWidth=".55"/>
      <line x1="30" y1="15" x2="30" y2="69" stroke="#000" strokeWidth=".35"/>
      
      {/* Placa gesso direita */}
      <rect x="40" y="15" width="5" height="54" fill="url(#s-pg)"/>
      <line x1="40" y1="15" x2="40" y2="69" stroke="#000" strokeWidth=".35"/>
      <line x1="45" y1="15" x2="45" y2="69" stroke="#000" strokeWidth=".55"/>
      
      {/* Rodapé esquerdo */}
      <rect x="21" y="59" width="4" height="8" fill="url(#s-pw)"/>
      <line x1="21" y1="59" x2="25" y2="59" stroke="#000" strokeWidth=".4"/>
      <line x1="21" y1="67" x2="25" y2="67" stroke="#000" strokeWidth=".3"/>
      <line x1="21" y1="59" x2="21" y2="67" stroke="#000" strokeWidth=".4"/>
      
      {/* Rodapé direito */}
      <rect x="45" y="59" width="4" height="8" fill="url(#s-pw)"/>
      <line x1="45" y1="59" x2="49" y2="59" stroke="#000" strokeWidth=".4"/>
      <line x1="45" y1="67" x2="49" y2="67" stroke="#000" strokeWidth=".3"/>
      <line x1="49" y1="59" x2="49" y2="67" stroke="#000" strokeWidth=".4"/>
      
      {/* Selante */}
      <ellipse cx="25.5" cy="68" rx="1" ry=".6" fill="#666"/>
      <ellipse cx="44.5" cy="68" rx="1" ry=".6" fill="#666"/>
      
      {/* Cotas - topo */}
      <line x1="25" y1="10" x2="25" y2="14" stroke="#000" strokeWidth=".2"/>
      <line x1="45" y1="10" x2="45" y2="14" stroke="#000" strokeWidth=".2"/>
      <line x1="25" y1="12" x2="45" y2="12" stroke="#000" strokeWidth=".25"/>
      <line x1="25" y1="10.5" x2="25" y2="13.5" stroke="#000" strokeWidth=".35"/>
      <line x1="45" y1="10.5" x2="45" y2="13.5" stroke="#000" strokeWidth=".35"/>
      <text x="35" y="9" fill="#000" fontSize="2.5" fontWeight="600" textAnchor="middle" fontFamily="Arial">80</text>
      
      {/* Cota rodapé */}
      <line x1="16" y1="59" x2="20" y2="59" stroke="#000" strokeWidth=".2"/>
      <line x1="16" y1="67" x2="20" y2="67" stroke="#000" strokeWidth=".2"/>
      <line x1="18" y1="59" x2="18" y2="67" stroke="#000" strokeWidth=".25"/>
      <text x="14" y="64" fill="#000" fontSize="2.2" fontWeight="500" textAnchor="end" fontFamily="Arial">70</text>
    </g>
    
    {/* Labels - fora da escala */}
    <Label num={1} x={18} y={55} size={3}/>
    <Label num={2} x={55} y={40} size={3}/>
    <Label num={3} x={55} y={60} size={3}/>
    <Label num={6} x={18} y={95} size={3}/>
    <Label num={10} x={80} y={125} size={3}/>
  </g>
);

// ============================================================
// VISTA: PLANTA (Vista de Cima) - VERSÃO MAIOR
// ============================================================
const PlantaView: React.FC = () => (
  <g transform="translate(0, 128)">
    {/* Título da vista */}
    <text x="45" y="5" fill="#000" fontSize="3.2" fontWeight="700" fontFamily="Arial">
      PLANTA
    </text>
    <text x="45" y="9" fill="#666" fontSize="2" fontFamily="Arial">
      Escala 1:5
    </text>
    
    {/* Área do desenho - escala 1.2x */}
    <g transform="translate(5, 12) scale(1.2)">
      {/* Pavimento esquerdo */}
      <rect x="0" y="0" width="20" height="25" fill="url(#s-pk)"/>
      
      {/* Placa gesso esquerda */}
      <rect x="20" y="0" width="5" height="25" fill="url(#s-pg)"/>
      <line x1="20" y1="0" x2="20" y2="25" stroke="#000" strokeWidth=".55"/>
      <line x1="25" y1="0" x2="25" y2="25" stroke="#000" strokeWidth=".35"/>
      
      {/* Cavidade com isolamento */}
      <rect x="25" y="0" width="10" height="25" fill="url(#s-pi)"/>
      
      {/* Montantes (vista de cima) @600mm */}
      <rect x="25" y="1" width="10" height="1.8" fill="url(#s-ps)"/>
      <rect x="25" y="8" width="10" height="1.8" fill="url(#s-ps)"/>
      <rect x="25" y="15" width="10" height="1.8" fill="url(#s-ps)"/>
      <rect x="25" y="22" width="10" height="1.8" fill="url(#s-ps)"/>
      
      {/* Placa gesso direita */}
      <rect x="35" y="0" width="5" height="25" fill="url(#s-pg)"/>
      <line x1="35" y1="0" x2="35" y2="25" stroke="#000" strokeWidth=".35"/>
      <line x1="40" y1="0" x2="40" y2="25" stroke="#000" strokeWidth=".55"/>
      
      {/* Pavimento direito */}
      <rect x="40" y="0" width="25" height="25" fill="url(#s-pk)"/>
      
      {/* Rodapé esquerdo */}
      <rect x="16" y="0" width="4" height="25" fill="url(#s-pw)"/>
      <line x1="16" y1="0" x2="16" y2="25" stroke="#000" strokeWidth=".4"/>
      
      {/* Rodapé direito */}
      <rect x="40" y="0" width="4" height="25" fill="url(#s-pw)"/>
      <line x1="44" y1="0" x2="44" y2="25" stroke="#000" strokeWidth=".4"/>
      
      {/* Indicação de corte A-A' */}
      <line x1="-5" y1="12.5" x2="70" y2="12.5" stroke="#000" strokeWidth=".3" strokeDasharray="3,1,1,1"/>
      <circle cx="-6" cy="12.5" r="2.5" fill="#fff" stroke="#000" strokeWidth=".3"/>
      <text x="-6" y="13.5" fill="#000" fontSize="2.5" fontWeight="700" textAnchor="middle" fontFamily="Arial">A</text>
      <circle cx="71" cy="12.5" r="2.5" fill="#fff" stroke="#000" strokeWidth=".3"/>
      <text x="71" y="13.5" fill="#000" fontSize="2.5" fontWeight="700" textAnchor="middle" fontFamily="Arial">A'</text>
      
      {/* Cotas - largura parede */}
      <line x1="20" y1="28" x2="20" y2="32" stroke="#000" strokeWidth=".2"/>
      <line x1="40" y1="28" x2="40" y2="32" stroke="#000" strokeWidth=".2"/>
      <line x1="20" y1="30" x2="40" y2="30" stroke="#000" strokeWidth=".25"/>
      <line x1="20" y1="28.5" x2="20" y2="31.5" stroke="#000" strokeWidth=".4"/>
      <line x1="40" y1="28.5" x2="40" y2="31.5" stroke="#000" strokeWidth=".4"/>
      <text x="30" y="35" fill="#000" fontSize="2.5" fontWeight="500" textAnchor="middle" fontFamily="Arial">80</text>
    </g>
    
    {/* Labels - fora da escala */}
    <Label num={2} x={40} y={25} size={2.5}/>
    <Label num={3} x={40} y={35} size={2.5}/>
    <Label num={8} x={70} y={30} size={2.5}/>
  </g>
);

// ============================================================
// VISTA: AXONOMETRIA (3D Isométrica) - VERSÃO MAIOR
// ============================================================
const AxonometriaView: React.FC = () => (
  <g transform="translate(100, 0)">
    {/* Título da vista */}
    <text x="55" y="8" fill="#000" fontSize="3.5" fontWeight="700" fontFamily="Arial">
      AXONOMETRIA
    </text>
    <text x="55" y="13" fill="#666" fontSize="2.2" fontFamily="Arial">
      Sem escala
    </text>
    
    {/* Desenho ampliado - escala 1.15x */}
    <g transform="translate(-5, 10) scale(1.15)">
      {/* Base/Laje - face superior */}
      <polygon points="15,95 70,75 115,95 60,115" fill="url(#s-pc)" stroke="#000" strokeWidth=".5"/>
      
      {/* Parede - face frontal esquerda (placa gesso) */}
      <polygon points="50,30 50,88 62,94 62,36" fill="url(#s-pg)" stroke="#000" strokeWidth=".5"/>
      
      {/* Parede - topo */}
      <polygon points="50,30 62,36 78,30 66,24" fill="url(#s-pg)" stroke="#000" strokeWidth=".35"/>
      
      {/* Parede - face frontal direita (placa gesso) */}
      <polygon points="62,36 62,94 78,88 78,30" fill="url(#s-pg)" stroke="#000" strokeWidth=".5"/>
      
      {/* Cavidade visível (lã mineral) - lateral */}
      <polygon points="53,32 53,86 62,91 62,35" fill="url(#s-pi)" stroke="#000" strokeWidth=".25"/>
      
      {/* Montantes visíveis */}
      <line x1="56" y1="34" x2="56" y2="89" stroke="#000" strokeWidth=".7"/>
      <line x1="60" y1="35" x2="60" y2="90" stroke="#000" strokeWidth=".5"/>
      
      {/* Guia U inferior */}
      <polygon points="50,86 62,91 78,86 66,80" fill="url(#s-ps)" stroke="#000" strokeWidth=".4"/>
      
      {/* Banda resiliente (linha) */}
      <line x1="50" y1="87" x2="78" y2="87" stroke="#988868" strokeWidth="1.2"/>
      
      {/* Rodapé frontal esquerdo */}
      <polygon points="42,76 42,88 50,91 50,79" fill="url(#s-pw)" stroke="#000" strokeWidth=".4"/>
      
      {/* Rodapé frontal direito */}
      <polygon points="78,79 78,91 86,88 86,76" fill="url(#s-pw)" stroke="#000" strokeWidth=".4"/>
      
      {/* Pavimento visível */}
      <polygon points="15,95 50,82 50,91 15,104" fill="url(#s-pk)" stroke="#000" strokeWidth=".3"/>
      <polygon points="78,91 78,82 115,95 115,104" fill="url(#s-pk)" stroke="#000" strokeWidth=".3"/>
      
      {/* Anotações com linhas de chamada */}
      <line x1="35" y1="55" x2="48" y2="62" stroke="#333" strokeWidth=".25"/>
      <text x="22" y="53" fill="#000" fontSize="2.2" fontWeight="500" fontFamily="Arial">Placa gesso</text>
      
      <line x1="95" y1="55" x2="80" y2="62" stroke="#333" strokeWidth=".25"/>
      <text x="88" y="53" fill="#000" fontSize="2.2" fontWeight="500" fontFamily="Arial">Isolamento</text>
      
      <line x1="35" y1="100" x2="45" y2="95" stroke="#333" strokeWidth=".25"/>
      <text x="18" y="102" fill="#000" fontSize="2.2" fontWeight="500" fontFamily="Arial">Pavimento</text>
      
      <line x1="38" y1="84" x2="44" y2="82" stroke="#333" strokeWidth=".25"/>
      <text x="22" y="86" fill="#000" fontSize="2.2" fontWeight="500" fontFamily="Arial">Rodapé</text>
      
      {/* Cota 80mm */}
      <line x1="40" y1="38" x2="40" y2="44" stroke="#000" strokeWidth=".2"/>
      <text x="36" y="42" fill="#000" fontSize="2.2" fontWeight="500" fontFamily="Arial">80</text>
    </g>
  </g>
);

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export const A01FullSheet: React.FC<{ className?: string }> = ({ className }) => (
  <div className={className}>
    <DetailSheetA4
      reference="FA—A.01"
      title="Base de Parede — Zona Seca"
      subtitle="Corte vertical — Encontro com pavimento acabado"
      scale="1:5"
      date="Fev 2025"
      revision="A"
      legend={legendA01}
      specs={specsA01}
    >
      {/* Área de desenho: 210×168 unidades */}
      <CorteView />
      <PlantaView />
      <AxonometriaView />
      
      {/* Escala gráfica */}
      <g transform="translate(5, 155)">
        <rect x="0" y="0" width="15" height="2" fill="#000"/>
        <rect x="0" y="0" width="5" height="2" fill="#fff"/>
        <rect x="10" y="0" width="5" height="2" fill="#fff"/>
        <rect x="0" y="0" width="15" height="2" fill="none" stroke="#000" strokeWidth=".15"/>
        <line x1="5" y1="0" x2="5" y2="2" stroke="#000" strokeWidth=".1"/>
        <line x1="10" y1="0" x2="10" y2="2" stroke="#000" strokeWidth=".1"/>
        <text x="0" y="5" fill="#000" fontSize="1.5" fontFamily="Arial">0</text>
        <text x="7.5" y="5" fill="#000" fontSize="1.5" textAnchor="middle" fontFamily="Arial">25</text>
        <text x="15" y="5" fill="#000" fontSize="1.5" textAnchor="end" fontFamily="Arial">50mm</text>
      </g>
    </DetailSheetA4>
  </div>
);

export default A01FullSheet;
