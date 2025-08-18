import type { TagKey } from '@shared/tags';
import { TAG } from '@shared/tags';

import type { CellTuple, PatternMatrix } from '@/types';

import { createMatrix } from './utils';

const ORT_DIRS = [
  [-1, 0],
  [0, -1],
  [0, 1],
  [1, 0],
] as const;

const ALL_DIRS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
] as const;

const createInBoundsChecker = (size: number) => (row: number, col: number) =>
  row >= 0 && row < size && col >= 0 && col < size;

export const rowSums = (p: PatternMatrix): number[] =>
  p.map((row) => row.reduce((a, b) => a + b, 0));

export const colSums = (p: PatternMatrix): number[] =>
  Array.from({ length: 5 }, (_, c) => p.reduce((a, row) => a + row[c], 0));

export const boundingBox = (matrix: PatternMatrix) => {
  const size = matrix.length;
  let minR = size;
  let maxR = -1;
  let minC = size;
  let maxC = -1;

  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++) {
      if (matrix[r][c] === 0) continue;

      minR = Math.min(minR, r);
      maxR = Math.max(maxR, r);
      minC = Math.min(minC, c);
      maxC = Math.max(maxC, c);
    }

  if (maxR < 0)
    return { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 };

  return {
    top: minR,
    left: minC,
    bottom: maxR,
    right: maxC,
    width: maxC - minC + 1,
    height: maxR - minR + 1,
  };
};

export const components = (matrix: PatternMatrix): number => {
  const size = matrix.length;
  const visited = createMatrix(size, false);
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ] as const;

  const isInBounds = createInBoundsChecker(size);

  let componentCount = 0;
  for (let row = 0; row < size; row++)
    for (let col = 0; col < size; col++) {
      if (matrix[row][col] === 0 || visited[row][col]) continue;

      componentCount++;
      const queue: [number, number][] = [[row, col]];
      visited[row][col] = true;

      while (queue.length) {
        const [currentRow, currentCol] = queue.shift()!;
        for (const [dRow, dCol] of directions) {
          const nextRow = currentRow + dRow;
          const nextCol = currentCol + dCol;
          if (
            isInBounds(nextRow, nextCol) &&
            matrix[nextRow][nextCol] === 1 &&
            !visited[nextRow][nextCol]
          ) {
            visited[nextRow][nextCol] = true;
            queue.push([nextRow, nextCol]);
          }
        }
      }
    }
  return componentCount;
};

export const perimeter = (matrix: PatternMatrix): number => {
  const size = matrix.length;
  const isInBounds = createInBoundsChecker(size);

  let per = 0;
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (matrix[r][c] === 1) {
        if (!isInBounds(r - 1, c) || matrix[r - 1][c] === 0) per++;
        if (!isInBounds(r + 1, c) || matrix[r + 1][c] === 0) per++;
        if (!isInBounds(r, c - 1) || matrix[r][c - 1] === 0) per++;
        if (!isInBounds(r, c + 1) || matrix[r][c + 1] === 0) per++;
      }

  return per;
};

export const quadrantPercents = (matrix: PatternMatrix) => {
  const size = matrix.length;
  const mid = Math.floor(size / 2);
  const even = size % 2 === 0;

  let tl = 0;
  let tr = 0;
  let bl = 0;
  let br = 0;
  let center = 0;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c] === 0) continue;

      const top = r < mid;
      const bot = even ? r >= mid : r > mid;
      const left = c < mid;
      const right = even ? c >= mid : c > mid;

      if (top && left) tl++;
      else if (top && right) tr++;
      else if (bot && left) bl++;
      else if (bot && right) br++;
      else center++;
    }
  }

  const quadrantsTotal = tl + tr + bl + br;

  const pct = (x: number) =>
    quadrantsTotal === 0 ? 0 : (x / quadrantsTotal) * 100;

  return {
    tl: pct(tl),
    tr: pct(tr),
    bl: pct(bl),
    br: pct(br),
    counts: {
      tl,
      tr,
      bl,
      br,
      center,
      total: quadrantsTotal + center,
    },
  };
};

export const longestRun = (matrix: PatternMatrix) => {
  const size = matrix.length;

  let hMax = 0;
  let vMax = 0;
  const vRun: number[] = new Array(size).fill(0);

  for (let r = 0; r < size; r++) {
    let hRun = 0;
    const row = matrix[r];

    for (let c = 0; c < size; c++) {
      if (row[c] === 1) {
        hRun++;

        if (hRun > hMax) hMax = hRun;

        vRun[c] = vRun[c] + 1;
        if (vRun[c] > vMax) vMax = vRun[c];
      } else {
        hRun = 0;
        vRun[c] = 0;
      }
    }
  }

  return { horizontal: hMax, vertical: vMax };
};

export const centerOfMass = (matrix: PatternMatrix) => {
  const size = matrix.length;

  let sumR = 0;
  let sumC = 0;
  let cnt = 0;

  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++) {
      if (matrix[r][c] === 0) continue;
      sumR += r;
      sumC += c;
      cnt++;
    }

  if (cnt === 0) return { row: size / 2, col: size / 2 };

  return { row: sumR / cnt, col: sumC / cnt };
};

export const holes = (matrix: PatternMatrix): number => {
  const size = matrix.length;
  const lastIndex = size - 1;

  const visited = createMatrix(size, false);
  const isInBounds = createInBoundsChecker(size);
  const isZeroUnvisited = (r: number, c: number) =>
    isInBounds(r, c) && matrix[r][c] === 0 && !visited[r][c];

  const bfsFill = (seeds: CellTuple[]) => {
    let head = 0;

    while (head < seeds.length) {
      const [r, c] = seeds[head++];

      if (!isZeroUnvisited(r, c)) continue;

      visited[r][c] = true;

      for (const [dr, dc] of ORT_DIRS) {
        seeds.push([r + dr, c + dc]);
      }
    }
  };

  const borderSeeds: CellTuple[] = [];

  for (let i = 0; i < size; i++) {
    if (matrix[0][i] === 0) borderSeeds.push([0, i]);
    if (matrix[lastIndex][i] === 0) borderSeeds.push([lastIndex, i]);
    if (matrix[i][0] === 0) borderSeeds.push([i, 0]);
    if (matrix[i][lastIndex] === 0) borderSeeds.push([i, lastIndex]);
  }

  bfsFill(borderSeeds);

  let holeCount = 0;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (isZeroUnvisited(r, c)) {
        holeCount++;
        bfsFill([[r, c]]);
      }
    }
  }

  return holeCount;
};

export const centerEdgeCounts = (matrix: PatternMatrix, tags: TagKey[]) => {
  const size = matrix.length;
  const lastIndex = size - 1;
  let edge = 0;
  let center = 0;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c] === 0) continue;

      if (r === 0 || c === 0 || r === lastIndex || c === lastIndex) {
        edge++;
      } else {
        center++;
      }
    }
  }

  let label = 'Balanced';
  if (tags.includes(TAG.WEIGHT_CENTER_EMPTY.key)) label = 'Center empty';
  else if (tags.includes(TAG.WEIGHT_CENTER_HEAVY.key)) label = 'Center heavy';
  else if (tags.includes(TAG.WEIGHT_EDGE_HEAVY.key)) label = 'Edge heavy';

  return { center, edge, label };
};

export const adjacencyCoverage = (matrix: PatternMatrix) => {
  const size = matrix.length;

  const isInBounds = createInBoundsChecker(size);

  let withNeighbor = 0;
  let isolated = 0;
  let total = 0;

  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++) {
      if (matrix[r][c] === 0) continue;

      total++;
      let hasNeighbor = false;

      for (const [dr, dc] of ALL_DIRS) {
        const nr = r + dr;
        const nc = c + dc;

        if (isInBounds(nr, nc) && matrix[nr][nc] === 1) {
          hasNeighbor = true;
          break;
        }
      }

      if (hasNeighbor) withNeighbor++;
      else isolated++;
    }

  const pct = total === 0 ? 0 : Math.round((withNeighbor / total) * 100);
  return { withNeighborPct: pct, isolatedCount: isolated };
};
