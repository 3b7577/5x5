import { create } from 'zustand';
import type { DensityRange } from '@/types';
import type { Tag } from '@shared/tags';

interface IFiltersValues {
  density: DensityRange;
  selectedTags: Tag['key'][];
}
interface IFiltersStore extends IFiltersValues {
  setDensity: (range: DensityRange) => void;
  toggleTag: (tagKey: Tag['key']) => void;
  resetDensity: () => void;
  resetTags: () => void;
  resetAll: () => void;
}

const FiltersStoreValues: IFiltersValues = {
  density: [0, 25],
  selectedTags: [],
};
const useFiltersStore = create<IFiltersStore>((set) => ({
  ...FiltersStoreValues,
  setDensity: (range) => set({ density: range }),
  toggleTag: (tagKey) =>
    set((state) => {
      const selectedTags = state.selectedTags.includes(tagKey)
        ? state.selectedTags.filter((t) => t !== tagKey)
        : [...state.selectedTags, tagKey];

      return { selectedTags };
    }),
  resetDensity: () => set({ density: FiltersStoreValues.density }),
  resetTags: () => set({ selectedTags: FiltersStoreValues.selectedTags }),
  resetAll: () => set(FiltersStoreValues),
}));

export default useFiltersStore;
