import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { NAV_LINKS, SITE } from '../../lib/site';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close mobile menu on route change
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        scrolled
          ? 'bg-black/95 backdrop-blur border-grey-mid py-3'
          : 'bg-transparent border-transparent py-5',
      )}
    >
      <nav className="mx-auto max-w-7xl px-5 flex items-center justify-between">
        <Link to="/" className="group flex items-center gap-2" aria-label="GRINDHOUSE home">
          <span className="font-display text-3xl md:text-4xl tracking-wider text-white leading-none">
            GRIND<span className="text-red group-hover:glow-red transition-all">HOUSE</span>
          </span>
        </Link>

        {/* desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  clsx(
                    'label transition-colors hover:text-red',
                    isActive ? 'text-red' : 'text-white/80',
                  )
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          <li>
            <Link
              to="/reservations"
              className="bg-red text-black font-display text-lg uppercase tracking-wider px-5 py-2 hover:bg-yellow hover:shadow-neon-sm transition-all"
            >
              Book a Table
            </Link>
          </li>
        </ul>

        {/* mobile toggle */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-black border-t border-grey-mid overflow-hidden"
          >
            <ul className="flex flex-col px-5 py-4">
              {NAV_LINKS.map((link) => (
                <li key={link.to} className="border-b border-grey/60 last:border-0">
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      clsx(
                        'block py-4 font-display text-3xl uppercase tracking-wide transition-colors',
                        isActive ? 'text-red' : 'text-white',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li className="pt-4">
                <a href={SITE.phoneHref} className="label text-white/60">
                  {SITE.phone}
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
