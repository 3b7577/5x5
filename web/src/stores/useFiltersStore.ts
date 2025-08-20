import type { Tag } from '@shared/tags';
import { create } from 'zustand';

import type { Range } from '@/types';

interface IFiltersValues {
  density: Range;
  densityBounds: Range;
  selectedTags: Tag['key'][];
}
interface IFiltersStore extends IFiltersValues {
  setDensity: (range: Range) => void;
  setDensityBounds: (range: Range) => void;
  toggleTag: (tagKey: Tag['key']) => void;
  resetFilters: () => void;
}

const clampRange = (range: Range, bounds: Range): Range => {
  const [bMin, bMax] = bounds;
  const [rMin, rMax] = range;
  const clamp = (v: number) => Math.min(bMax, Math.max(bMin, v));
  return [clamp(rMin), clamp(rMax)];
};

const filtersStoreValues: IFiltersValues = {
  density: [0, 25],
  densityBounds: [0, 25],
  selectedTags: [],
};

const useFiltersStore = create<IFiltersStore>((set) => ({
  ...filtersStoreValues,
  setDensity: (range) =>
    set((state) => ({ density: clampRange(range, state.densityBounds) })),
  setDensityBounds: (range) =>
    set((state) => ({
      densityBounds: range,
      density: clampRange(state.density, range),
    })),
  toggleTag: (tagKey) =>
    set((state) => {
      const selectedTags = state.selectedTags.includes(tagKey)
        ? state.selectedTags.filter((t) => t !== tagKey)
        : [...state.selectedTags, tagKey];

      return { selectedTags };
    }),
  resetFilters: () =>
    set((state) => ({
      selectedTags: [],
      density: state.densityBounds,
    })),
}));

export default useFiltersStore;
