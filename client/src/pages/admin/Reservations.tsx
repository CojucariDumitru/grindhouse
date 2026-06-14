import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, Trash2 } from 'lucide-react';
import {
  adminFetchReservations,
  updateReservationStatus,
  deleteReservation,
} from '../../api/reservation.api';
import { getErrorMessage } from '../../api/client';
import { useToast } from '../../components/ui/Toast';
import { AdminHeading, StatusBadge } from './_components';
import type { ReservationStatus } from '../../lib/types';

const STATUS_FILTERS: (ReservationStatus | 'ALL')[] = [
  'ALL',
  'PENDING',
  'CONFIRMED',
  'CANCELLED',
  'COMPLETED',
];

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso));
}

export default function AdminReservations() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [status, setStatus] = useState<ReservationStatus | 'ALL'>('ALL');
  const [date, setDate] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reservations', status, date],
    queryFn: () =>
      adminFetchReservations({
        status: status === 'ALL' ? undefined : status,
        date: date || undefined,
      }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, next }: { id: string; next: ReservationStatus }) =>
      updateReservationStatus(id, next),
    onSuccess: (res, vars) => {
      qc.invalidateQueries({ queryKey: ['admin-reservations'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      const msg =
        vars.next === 'CONFIRMED'
          ? res.emailSent
            ? 'Confirmed — email sent to guest.'
            : 'Confirmed (email not configured).'
          : `Marked ${vars.next.toLowerCase()}.`;
      toast(msg, 'success');
    },
    onError: (err) => toast(getErrorMessage(err), 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReservation,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-reservations'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      toast('Reservation deleted.', 'info');
    },
    onError: (err) => toast(getErrorMessage(err), 'error'),
  });

  const rows = data ?? [];

  return (
    <div>
      <AdminHeading title="Reservations" subtitle="Confirm, cancel, and manage bookings." />

      {/* filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex flex-wrap gap-1">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`font-mono text-xs uppercase tracking-wider px-3 py-2 border-2 transition-colors ${
                status === s
                  ? 'border-red text-red'
                  : 'border-grey-mid text-white/50 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-black border-2 border-grey-mid text-white font-mono text-sm px-3 py-2 focus:outline-none focus:border-red"
        />
        {date && (
          <button onClick={() => setDate('')} className="label text-white/40 hover:text-red">
            Clear date
          </button>
        )}
      </div>

      <div className="bg-grey border-2 border-grey-mid overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b-2 border-grey-mid">
              {['Name', 'Contact', 'Date', 'Time', 'Guests', 'Status', 'Actions'].map((h) => (
                <th key={h} className="label text-white/40 px-4 py-3 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 font-mono text-white/40">
                  Loading…
                </td>
              </tr>
            )}
            {!isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 font-mono text-white/40">
                  No reservations match these filters.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-grey-mid/50 align-top">
                <td className="px-4 py-4 font-body font-semibold text-white whitespace-nowrap">
                  {r.name}
                  {r.notes && (
                    <p className="font-body font-normal text-xs text-white/40 max-w-[200px] mt-1">
                      “{r.notes}”
                    </p>
                  )}
                </td>
                <td className="px-4 py-4 font-mono text-xs text-white/50">
                  <div>{r.email}</div>
                  <div>{r.phone}</div>
                </td>
                <td className="px-4 py-4 font-mono text-sm text-white/80 whitespace-nowrap">
                  {formatDate(r.date)}
                </td>
                <td className="px-4 py-4 font-mono text-sm text-yellow">{r.time}</td>
                <td className="px-4 py-4 font-mono text-sm text-white/80">{r.guests}</td>
                <td className="px-4 py-4">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      title="Confirm"
                      disabled={r.status === 'CONFIRMED' || statusMutation.isPending}
                      onClick={() => statusMutation.mutate({ id: r.id, next: 'CONFIRMED' })}
                      className="p-2 border-2 border-grey-mid text-green-400 hover:border-green-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      title="Cancel"
                      disabled={r.status === 'CANCELLED' || statusMutation.isPending}
                      onClick={() => statusMutation.mutate({ id: r.id, next: 'CANCELLED' })}
                      className="p-2 border-2 border-grey-mid text-red hover:border-red disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <X size={16} />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => {
                        if (confirm(`Delete reservation for ${r.name}?`)) {
                          deleteMutation.mutate(r.id);
                        }
                      }}
                      className="p-2 border-2 border-grey-mid text-white/40 hover:border-white hover:text-white transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
