export type FillPattern =
  | 'sequential'
  | 'clear'
  | 'outline'
  | 'cross'
  | 'symmetric'
  | 'radial'
  | 'checker';

export const MATRIX_SIZE = 7; // Best with odd numbers

type Coord = [number, number];

const generateSequential = (size: number): Coord[] => {
  const out: Coord[] = [];

  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      out.push([r, c]);
    }
  }
  return out;
};

const generateBorder = (size: number): Coord[] => {
  const last = size - 1;
  const out: Coord[] = [];
  // top row
  for (let c = 0; c < size; c += 1) out.push([0, c]);
  // right col (skip top)
  for (let r = 1; r < size; r += 1) out.push([r, last]);
  // bottom row (skip right-corner)
  for (let c = last - 1; c >= 0; c -= 1) out.push([last, c]);
  // left col (skip bottom and top)
  for (let r = last - 1; r >= 1; r -= 1) out.push([r, 0]);
  return out;
};

const generateCross = (size: number): Coord[] => {
  const center = Math.floor(size / 2);
  const seen = new Set<string>();
  const out: Coord[] = [];
  for (let c = 0; c < size; c += 1) {
    const key = `${center},${c}`;
    if (!seen.has(key)) {
      out.push([center, c]);
      seen.add(key);
    }
  }

  for (let r = 0; r < size; r += 1) {
    const key = `${r},${center}`;
    if (!seen.has(key)) {
      out.push([r, center]);
      seen.add(key);
    }
  }

  return out;
};

const generateSpiral = (size: number): Coord[] => {
  const center = Math.floor(size / 2);
  const out: Coord[] = [];
  const seen = new Set<string>();
  const push = (r: number, c: number) => {
    const key = `${r},${c}`;
    if (r >= 0 && r < size && c >= 0 && c < size && !seen.has(key)) {
      out.push([r, c]);
      seen.add(key);
    }
  };

  push(center, center);

  for (let radius = 1; out.length < size * size; radius += 1) {
    // top edge of ring
    for (let c = center - radius + 1; c <= center + radius; c += 1)
      push(center - radius, c);
    // right edge
    for (let r = center - radius + 1; r <= center + radius; r += 1)
      push(r, center + radius);
    // bottom edge
    for (let c = center + radius - 1; c >= center - radius; c -= 1)
      push(center + radius, c);
    // left edge
    for (let r = center + radius - 1; r >= center - radius; r -= 1)
      push(r, center - radius);
  }
  return out;
};

const generateChecker = (size: number): Coord[] => {
  const even: Coord[] = [];
  const odd: Coord[] = [];
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      if ((r + c) % 2 === 0) even.push([r, c]);
      else odd.push([r, c]);
    }
  }

  return [...even, ...odd.reverse()];
};

const generateClear = (size: number): Coord[] => {
  // Outside-in: farthest from center first, center last
  const center = Math.floor(size / 2);
  const coords = generateSequential(size);
  coords.sort((a, b) => {
    const da = Math.abs(a[0] - center) + Math.abs(a[1] - center);
    const db = Math.abs(b[0] - center) + Math.abs(b[1] - center);
    return db - da;
  });

  return coords;
};

const PATTERN_ARRAYS: Record<FillPattern, Coord[]> = {
  sequential: generateSequential(MATRIX_SIZE),
  outline: generateBorder(MATRIX_SIZE),
  cross: generateCross(MATRIX_SIZE),
  symmetric: generateSequential(MATRIX_SIZE),
  radial: generateSpiral(MATRIX_SIZE),
  clear: generateClear(MATRIX_SIZE),
  checker: generateChecker(MATRIX_SIZE),
};

const groupPairs = (coords: Coord[]): Coord[][] => {
  const groups: Coord[][] = [];
  for (let i = 0; i < coords.length; i += 2) {
    groups.push(coords.slice(i, i + 2));
  }
  return groups;
};

const groupSinglesThenPairs = (coords: Coord[]): Coord[][] => {
  const groups: Coord[][] = [];
  if (coords.length % 2 === 1) groups.push(coords.slice(0, 1));
  for (let i = groups.length ? 1 : 0; i < coords.length; i += 2) {
    groups.push(coords.slice(i, i + 2));
  }
  return groups;
};

const groupClear = (coords: Coord[], size: number): Coord[][] => {
  // group each ring as a wave
  const center = Math.floor(size / 2);
  const rings: Map<number, Coord[]> = new Map(); // dict where key = radius

  for (const [r, c] of coords) {
    const radius = Math.max(Math.abs(r - center), Math.abs(c - center));
    if (!rings.has(radius)) rings.set(radius, []);
    rings.get(radius)!.push([r, c]);
  }

  const maxRadius = Math.max(...rings.keys());
  const groups: Coord[][] = [];

  for (let rad = maxRadius; rad >= 0; rad--) {
    const ring = rings.get(rad) ?? [];

    if (ring.length > 0) groups.push(ring);
  }
  return groups;
};

const groupOppositePairs = (size: number): Coord[][] => {
  const visitedCells = new Set<string>();
  const groupedPairs: Coord[][] = [];
  const maxDiagIndex = 2 * (size - 1);

  for (let diagIndex = 0; diagIndex <= maxDiagIndex; diagIndex += 1) {
    for (let rowIndex = 0; rowIndex < size; rowIndex += 1) {
      const colIndex = diagIndex - rowIndex;
      if (colIndex < 0 || colIndex >= size) continue;

      const cell: Coord = [rowIndex, colIndex];
      const cellKey = `${rowIndex},${colIndex}`;

      if (visitedCells.has(cellKey)) continue;

      visitedCells.add(cellKey);

      const oppositeCell: Coord = [size - 1 - rowIndex, size - 1 - colIndex];
      const oppositeKey = `${oppositeCell[0]},${oppositeCell[1]}`;

      if (!visitedCells.has(oppositeKey)) visitedCells.add(oppositeKey);

      groupedPairs.push(
        oppositeKey !== cellKey ? [cell, oppositeCell] : [cell],
      );
    }
  }
  return groupedPairs;
};

const PATTERN_GROUPS: Record<FillPattern, Coord[][]> = {
  outline: groupPairs(PATTERN_ARRAYS.outline),
  cross: groupPairs(PATTERN_ARRAYS.cross),
  sequential: groupPairs(PATTERN_ARRAYS.sequential),
  checker: groupPairs(PATTERN_ARRAYS.checker),
  // Opposite cells animate together from top-left/bottom-right toward center
  symmetric: groupOppositePairs(MATRIX_SIZE),
  // put center if MATRIX_SIZE odd then other
  radial: groupSinglesThenPairs(PATTERN_ARRAYS.radial),
  // out in with rings
  clear: groupClear(PATTERN_ARRAYS.clear, MATRIX_SIZE),
};

/**
 * Returns an array of "waves" (groups of coords) for filling animation.
 * Each wave is filled in one step.
 */
export const getPatternGroups = (pattern: FillPattern): Coord[][] =>
  PATTERN_GROUPS[pattern];

// Map categories to patterns
export const CATEGORY_PATTERNS: Record<string, FillPattern> = {
  Symmetry: 'symmetric',
  Border: 'outline',
  'Weight Distribution': 'radial',
  Shape: 'cross',
  'Basic Elements': 'checker',
  Reset: 'clear',
};
