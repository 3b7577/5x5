import { type FC } from 'react';

import { useThemeEffect } from '@/hooks/useThemeEffect';

import PatternsGridLayout from './layouts/PatternsGrid';
import Sidebar from './layouts/Sidebar';
import Toolbar from './layouts/Toolbar';

const App: FC = () => {
  useThemeEffect();

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
