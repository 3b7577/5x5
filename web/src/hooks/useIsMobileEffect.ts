import { useEffect } from 'react';

import useDeviceStore from '@/stores/useDeviceStore';

const MOBILE_BREAKPOINT_PX = 768;

export const useIsMobileEffect = () => {
  const setIsMobile = useDeviceStore((s) => s.setIsMobile);

  useEffect(() => {
    const evaluate = () => {
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT_PX;
      setIsMobile(isMobile);
    };

    evaluate();
    window.addEventListener('resize', evaluate);
    return () => window.removeEventListener('resize', evaluate);
  }, [setIsMobile]);
};
