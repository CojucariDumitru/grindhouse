import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CalendarCheck, Clock, MessageSquare, UtensilsCrossed } from 'lucide-react';
import { fetchDashboard } from '../../api/admin.api';
import { AdminHeading } from './_components';
import { StatusBadge } from './_components';

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso));
}

export default function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
  });

  const stats = data?.stats;

  const cards = [
    {
      label: "Today's Reservations",
      value: stats?.todaysReservations,
      icon: CalendarCheck,
      accent: 'text-yellow',
      to: '/admin/reservations',
    },
    {
      label: 'Pending Confirmation',
      value: stats?.pendingReservations,
      icon: Clock,
      accent: 'text-red',
      to: '/admin/reservations',
    },
    {
      label: 'Unread Messages',
      value: stats?.unreadMessages,
      icon: MessageSquare,
      accent: 'text-yellow',
      to: '/admin/messages',
    },
    {
      label: 'Menu Items',
      value: stats ? `${stats.availableMenuItems}/${stats.totalMenuItems}` : undefined,
      icon: UtensilsCrossed,
      accent: 'text-white',
      to: '/admin/menu',
    },
  ];

  return (
    <div>
      <AdminHeading title="Dashboard" subtitle="The state of the grind, right now." />

      {isError && (
        <p className="font-mono text-red">Couldn’t load dashboard. Check the API connection.</p>
      )}

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="group bg-grey border-2 border-grey-mid hover:border-red transition-colors p-5"
          >
            <div className="flex items-start justify-between">
              <c.icon className={c.accent} size={28} />
            </div>
            <div className="mt-6">
              <div className="font-display text-6xl text-white leading-none">
                {isLoading ? <span className="text-grey-mid">—</span> : (c.value ?? 0)}
              </div>
              <p className="label text-white/40 mt-2">{c.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* upcoming */}
      <div className="mt-10">
        <h2 className="font-display text-3xl text-white tracking-wide mb-4">Upcoming Reservations</h2>
        <div className="bg-grey border-2 border-grey-mid">
          {isLoading && <div className="p-6 font-mono text-white/40">Loading…</div>}
          {data && data.upcoming.length === 0 && (
            <div className="p-6 font-mono text-white/40">No upcoming reservations.</div>
          )}
          {data?.upcoming.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between gap-4 px-5 py-4 border-b border-grey-mid/60 last:border-0"
            >
              <div className="min-w-0">
                <p className="font-body font-semibold text-white truncate">{r.name}</p>
                <p className="font-mono text-xs text-white/40">
                  {formatDate(r.date)} · {r.time} · {r.guests} guests
                </p>
              </div>
              <StatusBadge status={r.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
