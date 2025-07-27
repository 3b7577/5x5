import { create } from 'zustand';

interface ILoadingStateValues {
  isLoading: boolean | null;
  nextCursor: string | null;
  totalCount: number | null;
}

interface ILoadingStateStore extends ILoadingStateValues {
  setIsLoading: (isLoading: ILoadingStateValues['isLoading']) => void;
  setNextCursor: (nextCursor: ILoadingStateValues['nextCursor']) => void;
  setTotalCount: (totalCount: ILoadingStateValues['totalCount']) => void;
}

const LoadingStateValues: ILoadingStateValues = {
  isLoading: null,
  nextCursor: null,
  totalCount: null,
};

const useLoadingStateStore = create<ILoadingStateStore>((set) => ({
  ...LoadingStateValues,
  setIsLoading: (isLoading) => set({ isLoading }),
  setNextCursor: (nextCursor) => set({ nextCursor }),
  setTotalCount: (totalCount) => set({ totalCount }),
}));

export default useLoadingStateStore;
