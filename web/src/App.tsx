import { useEffect, type FC } from 'react';

import { fetchInfo } from '@/lib/api';
import { useIsMobileEffect } from '@/hooks/useIsMobileEffect';
import { useThemeEffect } from '@/hooks/useThemeEffect';
import useFiltersStore from '@/stores/useFiltersStore';
import useUiStore from '@/stores/useUiStore';

import PatternsGridLayout from './layouts/PatternsGrid';
import Sidebar from './layouts/Sidebar';
import Toolbar from './layouts/Toolbar';

const App: FC = () => {
  useThemeEffect();
  const { setDensityBounds } = useFiltersStore();
  const { isSidebarOpen, closeSidebar } = useUiStore();
  const { selectedTags, density } = useFiltersStore();

  useIsMobileEffect();

  useEffect(() => {
    fetchInfo().then(({ density }) => {
      setDensityBounds([density.min, density.max]);
    });
  }, []);

  useEffect(() => {
    if (isSidebarOpen) closeSidebar();
  }, [selectedTags.join(''), density.join('-')]);

  return (
    <div className='bg-background flex h-screen'>
      <div className='hidden md:block'>
        <Sidebar />
      </div>

      {isSidebarOpen && (
        <div className='fixed inset-0 z-50 md:hidden'>
          <div
            className='bg-background/80 absolute inset-0 backdrop-blur-sm'
            onClick={closeSidebar}
          />
          <div className='absolute top-0 left-0 h-full w-full'>
            <Sidebar />
          </div>

          <button
            type='button'
            className='border-border bg-card text-foreground absolute top-4 right-4 z-[60] h-10 rounded-md border-2 px-3 font-mono text-xs uppercase shadow-[3px_3px_0px_0px_var(--border)]'
            onClick={closeSidebar}
          >
            X
          </button>
        </div>
      )}

      <div className='flex flex-1 flex-col'>
        <Toolbar />
        <PatternsGridLayout />
      </div>
    </div>
  );
};

export default App;
