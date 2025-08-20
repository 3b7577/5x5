import { useEffect, type FC } from 'react';

import { fetchInfo } from '@/lib/api';
import { useThemeEffect } from '@/hooks/useThemeEffect';
import useFiltersStore from '@/stores/useFiltersStore';

import PatternsGridLayout from './layouts/PatternsGrid';
import Sidebar from './layouts/Sidebar';
import Toolbar from './layouts/Toolbar';

const App: FC = () => {
  useThemeEffect();
  const { setDensityBounds } = useFiltersStore();

  useEffect(() => {
    fetchInfo().then(({ density }) => {
      setDensityBounds([density.min, density.max]);
    });
  }, []);

  return (
    <div className='bg-background flex h-screen'>
      <Sidebar />

      <div className='flex flex-1 flex-col'>
        <Toolbar />
        <PatternsGridLayout />
      </div>
    </div>
  );
};

export default App;
