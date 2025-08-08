import type { Tag } from '@shared/tags';
import { create } from 'zustand';

import type { Range } from '@/types';

interface IFiltersValues {
  density: Range;
  selectedTags: Tag['key'][];
}
interface IFiltersStore extends IFiltersValues {
  setDensity: (range: Range) => void;
  toggleTag: (tagKey: Tag['key']) => void;
  resetFilters: () => void;
}

const filtersStoreValues: IFiltersValues = {
  density: [0, 25],
  selectedTags: [],
};

const useFiltersStore = create<IFiltersStore>((set) => ({
  ...filtersStoreValues,
  setDensity: (range) => set({ density: range }),
  toggleTag: (tagKey) =>
    set((state) => {
      const selectedTags = state.selectedTags.includes(tagKey)
        ? state.selectedTags.filter((t) => t !== tagKey)
        : [...state.selectedTags, tagKey];

      return { selectedTags };
    }),
  resetFilters: () => set(filtersStoreValues),
}));

export default useFiltersStore;
