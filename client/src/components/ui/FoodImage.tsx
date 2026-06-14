import { useState } from 'react';
import clsx from 'clsx';

interface FoodImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  /** Short label shown on the fallback tile (e.g. item name). */
  fallbackLabel?: string;
}

/**
 * Food photo with a branded fallback. If `src` is missing or fails to load,
 * we render an on-brand dark tile with the item name instead of a broken image.
 */
export function FoodImage({ src, alt, className, fallbackLabel }: FoodImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={clsx(
          'relative flex items-center justify-center bg-grey overflow-hidden grain',
          className,
        )}
        aria-label={alt}
        role="img"
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_40%,#E63312_0%,transparent_60%)]" />
        <div className="relative z-10 text-center px-4">
          <div className="text-5xl mb-1">🍔</div>
          <div className="font-display text-2xl text-white/80 uppercase tracking-wide leading-none">
            {fallbackLabel ?? 'Grindhouse'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={clsx('object-cover', className)}
    />
  );
}
