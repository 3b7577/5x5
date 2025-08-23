import { type FC } from 'react';

import {
  DensityFilter,
  ResetControls,
  SidebarHeader,
  TagCategories,
} from '@/components/sidebar';

const Sidebar: FC = () => (
  <div className='bg-sidebar border-border h-[100dvh] w-full overflow-y-auto border-2 border-r-2 p-4 shadow-[3px_3px_0px_0px_var(--border)] md:h-full md:w-80'>
    <div className='space-y-4'>
      <SidebarHeader />
      <DensityFilter />
      <TagCategories />
      <ResetControls />
    </div>
  </div>
);

export default Sidebar;
