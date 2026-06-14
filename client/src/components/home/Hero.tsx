import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { FoodImage } from '../ui/FoodImage';
import { Marquee } from './Marquee';
import { SITE } from '../../lib/site';

const HERO_IMG =
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1100&q=85';

const TICKER = [
  'SMASH BURGERS',
  'LOADED FRIES',
  'CRAFT SHAKES',
  'NO RESERVATIONS NEEDED',
  'OPEN TILL LATE',
];

const line = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.12, duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] as const },
  }),
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col bg-black overflow-hidden grain">
      {/* ambient red glow */}
      <div className="absolute -top-40 -right-40 w-[60vw] h-[60vw] bg-[radial-gradient(circle,rgba(230,51,18,0.18)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative z-10 flex-1 mx-auto max-w-7xl w-full px-5 pt-28 md:pt-24 pb-10 grid lg:grid-cols-[3fr_2fr] gap-8 items-center">
        {/* left */}
        <div>
          <motion.p
            initial="hidden"
            animate="show"
            custom={0}
            variants={line}
            className="label text-red mb-5"
          >
            {SITE.est}
          </motion.p>

          <h1 className="display text-white text-[16vw] sm:text-[14vw] lg:text-[9.5vw] xl:text-[150px]">
            {['BURGERS', 'THAT HIT', 'DIFFERENT.'].map((word, i) => (
              <motion.span
                key={word}
                initial="hidden"
                animate="show"
                custom={i + 1}
                variants={line}
                className="block"
              >
                {word === 'DIFFERENT.' ? (
                  <span className="text-red glow-red">{word}</span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial="hidden"
            animate="show"
            custom={4}
            variants={line}
            className="mt-6 text-white/70 font-body text-lg md:text-xl max-w-md"
          >
            Smashed. Stacked. Unapologetic.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            custom={5}
            variants={line}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Button to="/menu" variant="red">
              Order Now <ArrowRight size={22} />
            </Button>
            <Button to="/reservations" variant="outline">
              Book a Table
            </Button>
          </motion.div>
        </div>

        {/* right — floating hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative hidden lg:block"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(230,51,18,0.55)_0%,transparent_65%)] blur-2xl scale-110" />
          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <FoodImage
              src={HERO_IMG}
              alt="GRINDHOUSE signature smash burger"
              fallbackLabel="The OG Smash"
              className="w-full aspect-square border-4 border-red shadow-neon"
            />
            <div className="absolute -bottom-5 -left-5 bg-yellow text-black font-display text-2xl px-4 py-1.5 -rotate-3">
              SMASH IT
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* bottom ticker */}
      <div className="relative z-10 bg-red text-white py-3 border-y-2 border-black">
        <Marquee
          direction="left"
          items={TICKER.map((t) => (
            <span className="font-display text-2xl tracking-wider uppercase">{t}</span>
          ))}
          separator={<span className="mx-5 text-black">●</span>}
        />
      </div>
    </section>
  );
}
