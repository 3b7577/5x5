import { type FC } from 'react';

import useThemeStore from '@/stores/useThemeStore';
import { useThemeContext } from '@/theme';

const SidebarHeader: FC = () => {
  const { variant } = useThemeStore();
  const {
    texts,
    config: { styles },
  } = useThemeContext(variant);

  return (
    <div className='space-y-2 text-center'>
      <h2
        className={`text-sidebar-foreground text-xl font-bold tracking-wide ${styles.title}`}
      >
        {texts.filtersTitle}
      </h2>
      <p
        className={`text-sidebar-primary text-sm font-normal ${styles.subtitle}`}
      >
        {texts.refineSearch}
      </p>
    </div>
  );
};

export default SidebarHeader;
