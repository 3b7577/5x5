import { create } from 'zustand';

import { fetchImages, imgBitsToPattern, tagBitsToTags } from '@/lib/api';
import type { ApiImage, Pattern } from '@/types';

import useFiltersStore from './useFiltersStore';

interface IPatternsStoreValues {
  patterns: Pattern[];
  isLoading: boolean;
  error: string | null;
  nextCursor: string | null;
  totalCount: number;
  hasMore: boolean;
  isResetting: boolean;
}

interface IPatternsStore extends IPatternsStoreValues {
  fetchPatterns: () => Promise<void>;
  loadMore: () => Promise<void>;
  resetPatterns: () => void;
  setIsResetting: (isResetting: boolean) => void;
}

const apiImageToPattern = (apiImage: ApiImage): Pattern => ({
  id: apiImage.imgBits,
  matrix: imgBitsToPattern(apiImage.imgBits),
  density: apiImage.blackCnt,
  tags: tagBitsToTags(apiImage.tagBits),
});

const initalValues: IPatternsStoreValues = {
  patterns: [],
  isLoading: false,
  error: null,
  nextCursor: null,
  totalCount: 0,
  hasMore: false,
  isResetting: false,
};

const usePatternsStore = create<IPatternsStore>((set, get) => ({
  ...initalValues,

  fetchPatterns: async () => {
    const { isLoading } = get();
    if (isLoading) return;

    set({
      patterns: [],
      nextCursor: null,
      hasMore: false,
      totalCount: 0,
      isLoading: true,
      error: null,
    });

    try {
      const filters = useFiltersStore.getState();

      const response = await fetchImages({
        tags: filters.selectedTags,
        densityMin: filters.density[0],
        densityMax: filters.density[1],
        sortBy: 'blackCnt',
        sortOrder: 'asc',
      });

      const patterns = response.images.map(apiImageToPattern);

      set({
        patterns,
        nextCursor: response.nextCursor,
        totalCount: response.totalCount,
        hasMore: !!response.nextCursor,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        patterns: [],
        isLoading: false,
        error:
          error instanceof Error ? error.message : 'Failed to fetch patterns',
        nextCursor: null,
        totalCount: 0,
        hasMore: false,
      });
    }
  },

  loadMore: async () => {
    const { isLoading, nextCursor, patterns } = get();
    if (isLoading || !nextCursor) return;

    set({ isLoading: true });

    try {
      const filters = useFiltersStore.getState();

      const response = await fetchImages({
        tags: filters.selectedTags,
        densityMin: filters.density[0],
        densityMax: filters.density[1],
        cursor: nextCursor,
        sortBy: 'blackCnt',
        sortOrder: 'asc',
      });

      const newPatterns = response.images.map(apiImageToPattern);

      set({
        patterns: [...patterns, ...newPatterns],
        nextCursor: response.nextCursor,
        hasMore: !!response.nextCursor,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to load more patterns',
      });
    }
  },

  resetPatterns: () => {
    set({
      ...initalValues,
      isResetting: true,
    });
  },
  setIsResetting: (isResetting) => set({ isResetting }),
}));

export default usePatternsStore;
