import type { TagKey } from '@shared/tags';

export type Range = [number, number];
export type Matrix<T> = T[][];
export type PatternMatrix = Matrix<number>;

export interface Pattern {
  id: number;
  matrix: PatternMatrix;
  density: number;
  tags: TagKey[];
}

export interface ApiImage {
  imgBits: number;
  tagBits: number;
  blackCnt: number;
}

export interface ApiResponse {
  images: ApiImage[];
  nextCursor: string | null;
  totalCount: number;
}

export type PatternInfoTab = 'overview' | 'visual' | 'debug';

export type Cell = { r: number; c: number };
export type CellTuple = [number, number];

export type Axis = 'H' | 'V' | 'D' | 'AD';
export type QuadrantKey = 'tl' | 'tr' | 'bl' | 'br';

type OverlayKind =
  | 'axis'
  | 'cellFill'
  | 'cellOutline'
  | 'cellZone'
  | 'dot'
  | 'ring'
  | 'rect'
  | 'line'
  | 'circle';

export interface OverlayItem {
  kind: OverlayKind;

  axis?: Axis;
  cells?: Cell[];
  rectRC?: { r0: number; c0: number; r1: number; c1: number };
  line?: { x1: number; y1: number; x2: number; y2: number };
  circle?: { cx: number; cy: number; r: number };
  opacity?: number;
  dashed?: boolean;
  strokeWidth?: number;
  className?: string;
}

export interface OverlayPalette {
  base?: string;
  accent?: string;
  muted?: string;
  grid?: string;
  destructive?: string;
}

export type OverlayProps = {
  showSymmetry?: boolean;
  showBorders?: boolean;
  showCenterVsEdge?: boolean;
  showIsolated?: boolean;
};

export type OverlayPreset = {
  label: string;
  isActive: boolean;
  overlays: OverlayItem[];
  summary: string[];
  generalSummary?: string[];
};
