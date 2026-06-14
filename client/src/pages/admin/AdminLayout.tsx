import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, CalendarCheck, MessageSquare, LogOut, Menu, X, ExternalLink } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/menu', label: 'Menu', icon: UtensilsCrossed, end: false },
  { to: '/admin/reservations', label: 'Reservations', icon: CalendarCheck, end: false },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare, end: false },
];

export default function AdminLayout() {
  const { logout, email } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const nav = (
    <nav className="flex-1 flex flex-col gap-1 p-3">
      {LINKS.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            clsx(
              'flex items-center gap-3 px-4 py-3 font-display text-2xl uppercase tracking-wide transition-colors',
              isActive ? 'bg-red text-black' : 'text-white/70 hover:text-white hover:bg-grey',
            )
          }
        >
          <l.icon size={20} /> {l.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      {/* mobile top bar */}
      <div className="md:hidden flex items-center justify-between bg-grey border-b-2 border-red px-4 py-3">
        <span className="font-display text-3xl text-white tracking-wide">
          GRIND<span className="text-red">HOUSE</span>
        </span>
        <button onClick={() => setOpen((o) => !o)} className="text-white" aria-label="Toggle menu">
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* sidebar */}
      <aside
        className={clsx(
          'md:w-64 md:flex md:flex-col bg-grey border-r-2 border-grey-mid md:min-h-screen',
          open ? 'flex flex-col' : 'hidden',
        )}
      >
        <div className="hidden md:block p-5 border-b-2 border-grey-mid">
          <Link to="/" className="font-display text-3xl text-white tracking-wide">
            GRIND<span className="text-red">HOUSE</span>
          </Link>
          <p className="label text-white/40 mt-1">Admin</p>
        </div>

        {nav}

        <div className="p-3 border-t-2 border-grey-mid">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 label text-white/50 hover:text-white transition-colors"
          >
            <ExternalLink size={14} /> View site
          </a>
          <p className="px-4 py-1 font-mono text-[11px] text-white/30 truncate">{email}</p>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 font-display text-xl uppercase tracking-wide text-white/70 hover:text-red transition-colors"
          >
            <LogOut size={18} /> Log out
          </button>
        </div>
      </aside>

      {/* content */}
      <main className="flex-1 p-5 md:p-8 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
