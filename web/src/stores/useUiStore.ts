import { create } from 'zustand';

interface UiStateValues {
  isSidebarOpen: boolean;
}

interface UiStore extends UiStateValues {
  openSidebar: () => void;
  closeSidebar: () => void;
}

const initialState: UiStateValues = {
  isSidebarOpen: false,
};

const useUiStore = create<UiStore>((set) => ({
  ...initialState,
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
}));

export default useUiStore;
