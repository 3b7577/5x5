import { TAG } from '@shared/tags';

import type {
  Cell,
  OverlayItem,
  OverlayPreset,
  Pattern,
  PatternMatrix,
} from '@/types';

import { centerEdgeCounts } from './patternMath';
import { pluralize } from './utils';

export const getBorderCells = (matrix: PatternMatrix): Cell[] => {
  const size = matrix.length;
  const lastIndex = size - 1;
  const borderCells: Cell[] = [];

  for (let c = 0; c < size; c++) {
    borderCells.push({ r: 0, c });
    borderCells.push({ r: lastIndex, c });
  }

  for (let r = 0; r < size; r++) {
    borderCells.push({ r, c: 0 });
    borderCells.push({ r, c: lastIndex });
  }

  return borderCells;
};
export const getBorderHitCells = (
  matrix: PatternMatrix,
): {
  top: number;
  bottom: number;
  left: number;
  right: number;
  total: number;
  cells: Cell[];
} => {
  const size = matrix.length;
  const lastIndex = size - 1;

  const cells: Cell[] = [];

  let top = 0;
  let bottom = 0;
  let left = 0;
  let right = 0;

  for (let c = 0; c < size; c++) {
    if (matrix[0][c]) {
      cells.push({ r: 0, c });
      top++;
    }
    if (matrix[lastIndex][c]) {
      cells.push({ r: lastIndex, c });
      bottom++;
    }
  }

  for (let r = 0; r < size; r++) {
    if (matrix[r][0]) {
      cells.push({ r, c: 0 });
      left++;
    }
    if (matrix[r][lastIndex]) {
      cells.push({ r, c: lastIndex });
      right++;
    }
  }

  const uniqueCells = new Set(cells.map((cell) => `${cell.r},${cell.c}`));

  return {
    top,
    left,
    right,
    bottom,
    total: uniqueCells.size,
    cells,
  };
};

export const getSymmetryPreset = (pattern: Pattern): OverlayPreset => {
  const { tags } = pattern;
  const overlays: OverlayItem[] = [];

  if (tags.includes(TAG.SYM_H.key)) overlays.push({ kind: 'axis', axis: 'H' });
  if (tags.includes(TAG.SYM_V.key)) overlays.push({ kind: 'axis', axis: 'V' });
  if (tags.includes(TAG.SYM_DIAG.key))
    overlays.push({ kind: 'axis', axis: 'D' });
  if (tags.includes(TAG.SYM_ANTI_DIAG.key))
    overlays.push({ kind: 'axis', axis: 'AD' });

  const summary: string[] = overlays.map((t) => t.axis).filter((x) => !!x);

  if (tags.includes(TAG.SYM_FOUR_FOLD_ROTATION.key)) {
    overlays.push({ kind: 'ring', dashed: true, opacity: 0.9 });
    summary.push('4*');
  }

  if (!summary.length) summary.push('Asymmetrical');

  return { label: 'Symmetry', summary, overlays, isActive: !!overlays.length };
};

export const getBordersPreset = (pattern: Pattern): OverlayPreset => {
  const { matrix, tags } = pattern;
  const borderCells = getBorderCells(matrix);
  const {
    top,
    bottom,
    left,
    right,
    cells: borderHitCells,
  } = getBorderHitCells(matrix);

  const summary = [];

  const overlays: OverlayItem[] = [
    { kind: 'cellZone', cells: borderCells, opacity: 0.2 },
    {
      kind: 'cellFill',
      cells: borderHitCells,
      opacity: 0.6,
    },
  ];

  if (
    tags.includes(TAG.BORDERS_TOP_BORDER_MODERATE.key) ||
    tags.includes(TAG.BORDERS_TOP_BORDER_STRICT.key)
  ) {
    summary.push(pluralize('top pixel', top, true));
  }

  if (
    tags.includes(TAG.BORDERS_BOTTOM_BORDER_MODERATE.key) ||
    tags.includes(TAG.BORDERS_BOTTOM_BORDER_STRICT.key)
  ) {
    summary.push(pluralize('bottom pixel', bottom, true));
  }

  if (
    tags.includes(TAG.BORDERS_LEFT_BORDER_MODERATE.key) ||
    tags.includes(TAG.BORDERS_LEFT_BORDER_STRICT.key)
  ) {
    summary.push(pluralize('left pixel', left, true));
  }

  if (
    tags.includes(TAG.BORDERS_RIGHT_BORDER_MODERATE.key) ||
    tags.includes(TAG.BORDERS_RIGHT_BORDER_STRICT.key)
  ) {
    summary.push(pluralize('right pixel', right, true));
  }

  const generalSummary = [
    pluralize('border pixel', borderHitCells.length, true),
  ];

  return {
    label: 'Borders',
    summary,
    generalSummary,
    overlays,
    isActive: !!borderHitCells.length,
  };
};

export const getEdgeVsCenterPreset = (pattern: Pattern): OverlayPreset => {
  const { matrix, tags } = pattern;
  const size = matrix.length;

  const overlays: OverlayItem[] = [
    {
      kind: 'rect',
      rectRC: { r0: 1, c0: 1, r1: size - 2, c1: size - 2 },
      dashed: true,
      opacity: 0.7,
    },
    {
      kind: 'cellZone',
      cells: getBorderCells(matrix),
      opacity: 0.06,
    },
  ];

  const { label } = centerEdgeCounts(matrix, tags);
  const summary: string[] = [label];
  const isActive = label !== 'Balanced';

  return { label: 'Center vs Edge', overlays, summary, isActive };
};

export const getIsolatedPreset = (pattern: Pattern): OverlayPreset => {
  const { matrix, tags } = pattern;
  const size = matrix.length;
  const lastIndex = size - 1;
  const isolatedCells: Cell[] = [];
  const isActive = tags.includes(TAG.GENERAL_ISOLATED_PIXELS.key);

  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++) {
      if (!matrix[r][c]) continue;

      const up = r > 0 && matrix[r - 1][c];
      const upLeft = r > 0 && c > 0 && matrix[r - 1][c - 1];
      const upRight = r > 0 && c < lastIndex && matrix[r - 1][c + 1];

      const left = c > 0 && matrix[r][c - 1];
      const right = c < lastIndex && matrix[r][c + 1];

      const down = r < lastIndex && matrix[r + 1][c];
      const downLeft = r < lastIndex && c > 0 && matrix[r + 1][c - 1];
      const downRight = r < lastIndex && c < lastIndex && matrix[r + 1][c + 1];

      if (
        !up &&
        !upLeft &&
        !upRight &&
        !left &&
        !right &&
        !down &&
        !downLeft &&
        !downRight
      ) {
        isolatedCells.push({ r, c });
      }
    }

  const overlays: OverlayItem[] = [
    { kind: 'dot', cells: isolatedCells, opacity: 0.85 },
  ];

  const summary: string[] = [
    pluralize('isolated pixel', isolatedCells.length, true),
  ];

  return { label: 'Isolated', overlays, summary, isActive };
};
