import { create } from 'zustand';

import type { Axis, Pattern, PatternInfoTab, QuadrantKey } from '@/types';

export type HoverOverlay =
  | { type: 'axis'; axis: Axis }
  | { type: 'quadrant'; key: QuadrantKey }
  | { type: 'bbox' }
  | null;

export interface PatternMetrics {
  componentsCount: number;
  perimeter: number;
  borderHitCellsCount: number;
  centerVsEdge: { center: number; edge: number; label: string };
  holeCount: number;
  runs: { horizontal: number; vertical: number };
  adjacency: { withNeighborPct: number };
  quadrants: { tl: number; tr: number; bl: number; br: number };
  bbox: {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
  };
  centroid: { row: number; col: number };
  symmetryCount: number;
  fillPct: number;
  centerPct: number;
}

interface PatternInfoStateValues {
  currentPattern: Pattern | null;
  metrics: PatternMetrics | null;
  hoverOverlay: HoverOverlay;
  bitId: number | null;
  bitsHex: string | null;
  bitsBinary: string | null;
  activeTab: PatternInfoTab;
}

interface PatternInfoStore extends PatternInfoStateValues {
  setPatternInfo: (pattern: Pattern, metrics: PatternMetrics) => void;
  setHoverOverlay: (o: HoverOverlay) => void;
  resetPatternInfo: () => void;
  setActiveTab: (tab: PatternInfoTab) => void;
}

const initialState: PatternInfoStateValues = {
  currentPattern: null,
  metrics: null,
  hoverOverlay: null,
  bitId: null,
  bitsHex: null,
  bitsBinary: null,
  activeTab: 'overview',
};

const usePatternInfoStore = create<PatternInfoStore>((set) => ({
  ...initialState,
  setPatternInfo: (pattern, metrics) => {
    const bitId = pattern.id;
    const size = pattern.matrix.length;
    const bitsHex = '0x' + bitId.toString(16);
    const bitsBinary = bitId.toString(2).padStart(Math.pow(size, 2), '0');
    set({ currentPattern: pattern, metrics, bitId, bitsHex, bitsBinary });
  },
  setHoverOverlay: (o) => set({ hoverOverlay: o }),
  resetPatternInfo: () => set({ ...initialState }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

export default usePatternInfoStore;
