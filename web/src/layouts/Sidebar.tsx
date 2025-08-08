import { type FC } from 'react';

import {
  DensityFilter,
  ResetControls,
  SidebarHeader,
  TagCategories,
} from '@/components/sidebar';
import useThemeStore from '@/stores/useThemeStore';
import { getThemeConfig } from '@/theme';

const Sidebar: FC = () => {
  const { variant } = useThemeStore();
  const themeConfig = getThemeConfig(variant);

  return (
    <div
      className={`border-border bg-sidebar h-full w-80 overflow-y-auto border-2 border-r-2 p-4 ${themeConfig.styles.layoutShadow}`}
    >
      <div className='space-y-4'>
        <SidebarHeader />
        <DensityFilter />
        <TagCategories />
        <ResetControls />
      </div>
    </div>
  );
};

export default Sidebar;
