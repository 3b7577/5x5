import { useEffect, useRef, useState, type FC } from 'react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import usePatternInfoStore from '@/stores/usePatternInfoStore';

const CopyControls: FC = () => {
  const { bitId, bitsBinary } = usePatternInfoStore();
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<boolean>(false);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const onCopy = (text: string) => {
    window.navigator?.clipboard
      ?.writeText(text)
      .then(() => {
        setCopiedMessage('Copied!');
        setCopyError(false);
      })
      .catch(() => {
        setCopiedMessage('Copy failed');
        setCopyError(true);
      })
      .finally(() => {
        if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
        copyTimeoutRef.current = window.setTimeout(() => {
          setCopiedMessage(null);
          setCopyError(false);
        }, 1500);
      });
  };

  return (
    <div className='flex gap-2'>
      <Button variant='secondary' onClick={() => onCopy(String(bitId ?? ''))}>
        Copy ID
      </Button>
      <Button variant='secondary' onClick={() => onCopy(bitsBinary ?? '')}>
        Copy Binary String
      </Button>
      {copiedMessage && (
        <Badge
          className='select-none'
          variant={copyError ? 'destructive' : 'secondary'}
        >
          {copiedMessage}
        </Badge>
      )}
    </div>
  );
};

export default CopyControls;
