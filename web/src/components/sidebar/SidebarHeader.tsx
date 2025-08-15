import { type FC } from 'react';

const SidebarHeader: FC = () => {
  return (
    <div className='space-y-2 text-center'>
      <h2 className='text-sidebar-foreground crt-heading-lg tracking-wide uppercase'>
        {`<< Filters >>`}
      </h2>
      <p className='text-sidebar-primary crt-note uppercase'>
        Refine your search
      </p>
    </div>
  );
};

export default SidebarHeader;
