import { type FC } from 'react';

import Bottom from './overview/Bottom.tsx';
import Distribution from './overview/Distribution.tsx';
import GeometryAndStructure from './overview/GeometryAndStructure.tsx';
import Top from './overview/Top.tsx';

const OverviewTab: FC = () => {
  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
      <Top />

      <div className='lg:col-span-6'>
        <Distribution />
      </div>

      <div className='lg:col-span-6'>
        <GeometryAndStructure />
      </div>

      <Bottom />
    </div>
  );
};

export default OverviewTab;
