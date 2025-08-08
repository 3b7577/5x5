import type { FC } from 'react';

interface PatternPreviewProps {
  pattern: number[][];
  color: string;
  bgColor: string;
  size?: number;
}

const PatternPreview: FC<PatternPreviewProps> = ({
  pattern,
  color,
  bgColor,
  size = 20,
}) => {
  return (
    <div
      className='border border-current'
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gridTemplateRows: 'repeat(5, 1fr)',
        gap: '1px',
      }}
    >
      {pattern.flat().map((cell, index) => (
        <div
          key={index}
          style={{
            backgroundColor: cell ? color : 'transparent',
            width: '100%',
            height: '100%',
          }}
        />
      ))}
    </div>
  );
};

export default PatternPreview;
