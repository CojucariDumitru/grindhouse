import { ReactNode } from 'react';
import clsx from 'clsx';

interface MarqueeProps {
  items: ReactNode[];
  direction?: 'left' | 'right';
  className?: string;
  separator?: ReactNode;
}

/**
 * Infinite horizontal marquee. The content is duplicated and translated
 * -50% / +50% so it loops seamlessly. Pauses on hover.
 */
export function Marquee({ items, direction = 'left', className, separator }: MarqueeProps) {
  const sep = separator ?? <span className="mx-6 text-yellow">★</span>;
  const row = (
    <div className="flex items-center shrink-0">
      {items.map((item, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          {item}
          {sep}
        </span>
      ))}
    </div>
  );

  return (
    <div className={clsx('overflow-hidden pause-hover', className)}>
      <div
        className={clsx(
          'flex w-max',
          direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right',
        )}
      >
        {row}
        {row}
      </div>
    </div>
  );
}
