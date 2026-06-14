import { Link } from 'react-router-dom';
import { Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { NAV_LINKS, SITE } from '../../lib/site';

// lucide has no TikTok glyph — small inline mark.
function TikTok({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.5 5.3c-.9-.6-1.6-1.6-1.8-2.8h-2.9v11.3c0 1.4-1.1 2.5-2.5 2.5S6.8 15.2 6.8 13.8s1.1-2.5 2.5-2.5c.3 0 .5 0 .8.1V8.4c-.3 0-.5-.1-.8-.1-3 0-5.4 2.4-5.4 5.4S6.3 19.2 9.3 19.2s5.4-2.4 5.4-5.4V8.1c1.1.8 2.5 1.3 4 1.3V6.5c-.8 0-1.6-.2-2.2-.6z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative bg-grey border-t-4 border-red overflow-hidden grain">
      <div className="relative z-10 mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* brand */}
          <div className="md:col-span-2">
            <h2 className="font-display text-5xl md:text-6xl tracking-wider text-white leading-none">
              GRIND<span className="text-red">HOUSE</span>
            </h2>
            <p className="label text-yellow mt-3">{SITE.tagline}</p>
            <p className="text-white/50 text-sm mt-6 max-w-xs font-body leading-relaxed">
              Premium smash burgers, loaded fries & craft shakes. Made to order. Every time.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 grid place-items-center border-2 border-grey-mid text-white hover:border-red hover:text-red transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href={SITE.social.tiktok}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="w-10 h-10 grid place-items-center border-2 border-grey-mid text-white hover:border-red hover:text-red transition-colors"
              >
                <TikTok />
              </a>
              <a
                href={SITE.social.twitter}
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-10 h-10 grid place-items-center border-2 border-grey-mid text-white hover:border-red hover:text-red transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* nav */}
          <div>
            <h3 className="label text-white/40 mb-4">Explore</h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="font-display text-2xl uppercase tracking-wide text-white hover:text-red transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div>
            <h3 className="label text-white/40 mb-4">Find Us</h3>
            <ul className="space-y-4 text-sm font-body text-white/70">
              <li className="flex gap-3">
                <MapPin size={18} className="text-red shrink-0 mt-0.5" />
                <span>
                  {SITE.address.line1}
                  <br />
                  {SITE.address.line2}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone size={18} className="text-red shrink-0" />
                <a href={SITE.phoneHref} className="hover:text-white">
                  {SITE.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="text-red shrink-0" />
                <a href={`mailto:${SITE.email}`} className="hover:text-white">
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-grey-mid flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-xs text-white/40">
            © {new Date().getFullYear()} GRINDHOUSE NYC — All rights reserved.
          </p>
          <p className="font-mono text-xs text-white/30 uppercase tracking-widest">
            {SITE.est}
          </p>
        </div>
      </div>
    </footer>
  );
}
