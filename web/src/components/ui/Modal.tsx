import {
  createContext,
  useContext,
  useEffect,
  type FC,
  type ReactNode,
} from 'react';

import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
  className?: string;
}

interface ModalContextValue {
  onClose: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);
export const useModalContext = (): ModalContextValue => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('Modal subcomponents must be used within <Modal>');
  return ctx;
};

const Modal: FC<ModalProps> = ({ isOpen, onClose, children, className }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center'
      aria-modal
      role='dialog'
    >
      <div
        className='bg-background/70 absolute inset-0 backdrop-blur-sm'
        onClick={onClose}
      />

      <ModalContext.Provider value={{ onClose }}>
        <div
          className={cn(
            'crt-card-lg relative z-10 max-h-[90vh] w-[min(100vw-24px,1100px)] overflow-hidden shadow-xl',
            'crt-shadow-base',
            className,
          )}
        >
          {children}
        </div>
      </ModalContext.Provider>
    </div>
  );
};

export const ModalHeader: FC<{ children?: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div
    className={cn(
      'flex items-center justify-between border-b px-4 py-3',
      className,
    )}
  >
    {children}
  </div>
);

export const ModalTitle: FC<{ children?: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn('crt-heading-sm text-sm font-bold', className)}>
    {children}
  </div>
);

export const ModalBody: FC<{ children?: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div
    className={cn('max-h-[calc(90vh-110px)] overflow-y-auto p-4', className)}
  >
    {children}
  </div>
);

export const ModalFooter: FC<{ children?: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn('bg-card/50 border-t px-4 py-3', className)}>
    {children}
  </div>
);

export const ModalClose: FC<{
  ariaLabel?: string;
  children?: ReactNode;
  className?: string;
}> = ({ ariaLabel = 'Close', children, className }) => {
  const { onClose } = useModalContext();
  return (
    <button
      className={cn('text-muted-foreground hover:text-foreground', className)}
      onClick={onClose}
      aria-label={ariaLabel}
    >
      {children ?? '✕'}
    </button>
  );
};

export default Modal;
