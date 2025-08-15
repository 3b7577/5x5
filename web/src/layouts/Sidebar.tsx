import { type FC } from 'react';

import {
  DensityFilter,
  ResetControls,
  SidebarHeader,
  TagCategories,
} from '@/components/sidebar';

const Sidebar: FC = () => (
  <div className='bg-sidebar border-border h-full w-80 overflow-y-auto border-2 border-r-2 p-4 shadow-[3px_3px_0px_0px_var(--border)]'>
    <div className='space-y-4'>
      <SidebarHeader />
      <DensityFilter />
      <TagCategories />
      <ResetControls />
    </div>
  </div>
);

export default Sidebar;
