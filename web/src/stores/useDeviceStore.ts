import { create } from 'zustand';

interface DeviceStateValues {
  isMobile: boolean;
}

interface DeviceStore extends DeviceStateValues {
  setIsMobile: (isMobile: boolean) => void;
}

const initialState: DeviceStateValues = {
  isMobile: false,
};

const useDeviceStore = create<DeviceStore>((set) => ({
  ...initialState,
  setIsMobile: (isMobile) => set({ isMobile }),
}));

export default useDeviceStore;
