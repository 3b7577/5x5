import { type FC } from 'react';
import PatternsGrid from './layouts/PatternsGrid';
import Sidebar from './layouts/Sidebar';
import Toolbar from './layouts/Toolbar';

const App: FC = () => {
  return (
    <div className='flex h-screen bg-gray-50'>
      <Sidebar />

      <div className='flex flex-col'>
        <Toolbar />
        <PatternsGrid />
      </div>
    </div>
  );
};

export default App;
