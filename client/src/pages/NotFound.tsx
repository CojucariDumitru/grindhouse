import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black grain relative flex items-center justify-center px-5">
      <div className="relative z-10 text-center">
        <p className="label text-red mb-4">404 — Off the menu</p>
        <h1 className="display text-white text-[28vw] md:text-[200px] leading-none glow-red text-red">
          404
        </h1>
        <p className="text-white/60 font-body text-lg mt-4 mb-8">
          This page got smashed. Let&apos;s get you back to the good stuff.
        </p>
        <Link
          to="/"
          className="bg-red text-black font-display text-2xl uppercase tracking-wider px-8 py-3 hover:bg-yellow hover:shadow-neon transition-all"
        >
          Back Home
        </Link>
      </div>
    </div>
  );
}
