import { ReactNode } from 'react';
import clsx from 'clsx';
import type { ReservationStatus } from '../../lib/types';

export function AdminHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-5xl md:text-6xl text-white tracking-wide leading-none">
        {title}
      </h1>
      {subtitle && <p className="text-white/40 font-body mt-2">{subtitle}</p>}
    </div>
  );
}

const STATUS_STYLES: Record<ReservationStatus, string> = {
  PENDING: 'bg-yellow/15 text-yellow border-yellow/40',
  CONFIRMED: 'bg-green-500/15 text-green-400 border-green-500/40',
  CANCELLED: 'bg-red/15 text-red border-red/40',
  COMPLETED: 'bg-white/10 text-white/60 border-white/20',
};

export function StatusBadge({ status }: { status: ReservationStatus }) {
  return (
    <span
      className={clsx(
        'inline-block font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 border',
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

export function AdminCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('bg-grey border-2 border-grey-mid', className)}>{children}</div>;
}
