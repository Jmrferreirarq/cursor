// Label.tsx - Componente reutilizável para labels de identificação
// ================================================================

import React from 'react';
import { LABEL_CONFIG } from './labelConfig';

// ============================================================
// TIPOS
// ============================================================

export interface LabelProps {
  /** Número do label (1-99) */
  num: number;
  /** Posição X do centro */
  x: number;
  /** Posição Y do centro */
  y: number;
  /** Tamanho (raio) do círculo - default: 2.5 */
  size?: number;
  /** Cor de preenchimento - default: #fff */
  fill?: string;
  /** Cor do contorno - default: #333 */
  stroke?: string;
  /** Cor do texto - default: #333 */
  textColor?: string;
}

export interface LabelSetProps {
  /** Array de labels a renderizar */
  labels: Array<{
    num: number;
    x: number;
    y: number;
    size?: number;
  }>;
  /** Tamanho padrão para todos os labels */
  defaultSize?: number;
}

// ============================================================
// COMPONENTES
// ============================================================

/**
 * Label individual - círculo numerado para identificação de materiais
 */
export const Label: React.FC<LabelProps> = ({
  num,
  x,
  y,
  size = LABEL_CONFIG.defaultSize,
  fill = LABEL_CONFIG.colors.fill,
  stroke = LABEL_CONFIG.colors.stroke,
  textColor = LABEL_CONFIG.colors.text,
}) => (
  <g>
    <circle 
      cx={x} 
      cy={y} 
      r={size} 
      fill={fill} 
      stroke={stroke} 
      strokeWidth={LABEL_CONFIG.strokeWidth}
    />
    <text 
      x={x} 
      y={y + size * 0.38} 
      fill={textColor} 
      fontSize={size * 0.85} 
      fontWeight="600"
      textAnchor="middle" 
      fontFamily="Arial"
    >
      {num}
    </text>
  </g>
);

/**
 * LabelSet - renderiza múltiplos labels de uma vez
 * Útil para manter consistência e facilitar manutenção
 */
export const LabelSet: React.FC<LabelSetProps> = ({
  labels,
  defaultSize = LABEL_CONFIG.defaultSize,
}) => (
  <g className="label-set">
    {labels.map((label) => (
      <Label
        key={label.num}
        num={label.num}
        x={label.x}
        y={label.y}
        size={label.size || defaultSize}
      />
    ))}
  </g>
);

// ============================================================
// EXPORTS
// ============================================================

export default Label;
