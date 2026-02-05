// labelConfig.ts - Configuração e regras para labels de detalhes construtivos
// ============================================================================

// ============================================================
// CONSTANTES DE DIMENSIONAMENTO
// ============================================================

export const LABEL_CONFIG = {
  // Tamanho padrão do label (raio do círculo)
  defaultSize: 2.5,
  
  // Tamanho para labels em vistas com escala reduzida (ex: Planta com scale 0.85)
  scaledSize: 3, // 2.5 / 0.85 ≈ 3 para compensar
  
  // Distância mínima entre centros de labels (evita sobreposição)
  minDistance: 6,
  
  // Margem mínima da borda da área de desenho
  margin: 5,
  
  // Espessura do contorno do label
  strokeWidth: 0.3,
  
  // Cores
  colors: {
    fill: '#fff',
    stroke: '#333',
    text: '#333',
  },
};

// ============================================================
// CONSTANTES DE COTAGEM
// ============================================================

export const DIMENSION_CONFIG = {
  // Linhas de extensão
  extensionLine: {
    strokeWidth: 0.15,
    color: '#333',
  },
  
  // Linhas de cota
  dimensionLine: {
    strokeWidth: 0.2,
    color: '#333',
  },
  
  // Terminadores oblíquos (45°)
  terminator: {
    strokeWidth: 0.35,
    length: 3, // comprimento do traço
    color: '#333',
  },
  
  // Texto das cotas
  text: {
    partial: {
      fontSize: 2.5,
      color: '#555',
      fontWeight: 'normal',
    },
    total: {
      fontSize: 3,
      color: '#333',
      fontWeight: '600',
    },
  },
  
  // Fundo do texto (para legibilidade)
  textBackground: '#fafaf8',
};

// ============================================================
// TIPOS
// ============================================================

export interface LabelPosition {
  num: number;
  x: number;
  y: number;
  size?: number;
}

export interface LabelZone {
  name: string;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

// ============================================================
// FUNÇÕES UTILITÁRIAS
// ============================================================

/**
 * Calcula a distância entre dois pontos
 */
export const getDistance = (
  x1: number, y1: number, 
  x2: number, y2: number
): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

/**
 * Verifica se dois labels colidem (distância < mínimo)
 */
export const checkCollision = (
  label1: LabelPosition,
  label2: LabelPosition,
  minDistance: number = LABEL_CONFIG.minDistance
): boolean => {
  const distance = getDistance(label1.x, label1.y, label2.x, label2.y);
  return distance < minDistance;
};

/**
 * Verifica colisões em um array de labels
 * Retorna array de pares que colidem
 */
export const findCollisions = (
  labels: LabelPosition[],
  minDistance: number = LABEL_CONFIG.minDistance
): Array<[LabelPosition, LabelPosition]> => {
  const collisions: Array<[LabelPosition, LabelPosition]> = [];
  
  for (let i = 0; i < labels.length; i++) {
    for (let j = i + 1; j < labels.length; j++) {
      if (checkCollision(labels[i], labels[j], minDistance)) {
        collisions.push([labels[i], labels[j]]);
      }
    }
  }
  
  return collisions;
};

/**
 * Valida posições de labels e retorna relatório
 */
export const validateLabels = (
  labels: LabelPosition[],
  bounds?: { width: number; height: number }
): {
  valid: boolean;
  collisions: Array<[LabelPosition, LabelPosition]>;
  outOfBounds: LabelPosition[];
} => {
  const collisions = findCollisions(labels);
  const outOfBounds: LabelPosition[] = [];
  
  if (bounds) {
    const margin = LABEL_CONFIG.margin;
    labels.forEach(label => {
      const size = label.size || LABEL_CONFIG.defaultSize;
      if (
        label.x - size < margin ||
        label.x + size > bounds.width - margin ||
        label.y - size < margin ||
        label.y + size > bounds.height - margin
      ) {
        outOfBounds.push(label);
      }
    });
  }
  
  return {
    valid: collisions.length === 0 && outOfBounds.length === 0,
    collisions,
    outOfBounds,
  };
};

// ============================================================
// TEMPLATES DE POSICIONAMENTO POR TIPO DE DETALHE
// ============================================================

/**
 * Template para detalhes de parede (corte vertical)
 * Zonas sugeridas para posicionamento de labels
 */
export const WALL_DETAIL_ZONES: LabelZone[] = [
  { name: 'topo-esquerda', xMin: 10, xMax: 40, yMin: 15, yMax: 35 },
  { name: 'topo-centro', xMin: 45, xMax: 65, yMin: 15, yMax: 35 },
  { name: 'topo-direita', xMin: 70, xMax: 100, yMin: 15, yMax: 35 },
  { name: 'meio-esquerda', xMin: 10, xMax: 40, yMin: 40, yMax: 60 },
  { name: 'meio-centro', xMin: 45, xMax: 65, yMin: 40, yMax: 60 },
  { name: 'meio-direita', xMin: 70, xMax: 100, yMin: 40, yMax: 60 },
  { name: 'base-esquerda', xMin: 10, xMax: 40, yMin: 62, yMax: 80 },
  { name: 'base-centro', xMin: 45, xMax: 65, yMin: 62, yMax: 80 },
  { name: 'base-direita', xMin: 70, xMax: 100, yMin: 62, yMax: 80 },
  { name: 'inferior', xMin: 45, xMax: 65, yMin: 82, yMax: 95 },
];

/**
 * Sugere uma posição dentro de uma zona que não colida com labels existentes
 */
export const suggestPosition = (
  zone: LabelZone,
  existingLabels: LabelPosition[],
  minDistance: number = LABEL_CONFIG.minDistance
): { x: number; y: number } | null => {
  const centerX = (zone.xMin + zone.xMax) / 2;
  const centerY = (zone.yMin + zone.yMax) / 2;
  
  // Tenta o centro primeiro
  const centerLabel = { num: 0, x: centerX, y: centerY };
  if (!existingLabels.some(l => checkCollision(centerLabel, l, minDistance))) {
    return { x: centerX, y: centerY };
  }
  
  // Tenta posições alternativas na zona
  const offsets = [
    { dx: -5, dy: 0 }, { dx: 5, dy: 0 },
    { dx: 0, dy: -5 }, { dx: 0, dy: 5 },
    { dx: -5, dy: -5 }, { dx: 5, dy: -5 },
    { dx: -5, dy: 5 }, { dx: 5, dy: 5 },
  ];
  
  for (const offset of offsets) {
    const x = centerX + offset.dx;
    const y = centerY + offset.dy;
    
    if (x >= zone.xMin && x <= zone.xMax && y >= zone.yMin && y <= zone.yMax) {
      const testLabel = { num: 0, x, y };
      if (!existingLabels.some(l => checkCollision(testLabel, l, minDistance))) {
        return { x, y };
      }
    }
  }
  
  return null; // Não encontrou posição válida
};
