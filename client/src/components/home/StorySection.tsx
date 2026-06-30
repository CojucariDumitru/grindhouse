import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FoodImage } from '../ui/FoodImage';
import { img } from '../../lib/img';

const GRID = [
  { src: img.square('story/grill', 600), alt: 'On the grill', span: 'row-span-2' },
  { src: img.square('story/stack', 600), alt: 'Stacked burger', span: '' },
  { src: img.square('story/combo', 600), alt: 'Burger & fries', span: '' },
];

const STATS = [
  { value: '12', label: 'Signature Burgers' },
  { value: '4', label: 'Years Grinding' },
  { value: '∞', label: 'Napkins Used' },
];

export function StorySection() {
  return (
    <section className="relative bg-grey py-20 md:py-28 overflow-hidden grain border-y-2 border-grey-mid">
      <div className="relative z-10 mx-auto max-w-7xl px-5 grid lg:grid-cols-2 gap-12 items-center">
        {/* left text */}
        <div>
          <p className="label text-red mb-4">Our story</p>
          <h2 className="display text-white text-5xl md:text-7xl">
            We Don&apos;t Do <span className="text-red glow-red">Average.</span>
          </h2>
          <div className="mt-6 space-y-4 text-white/70 font-body text-lg leading-relaxed max-w-xl">
            <p>
              GRINDHOUSE started in 2019 with one cast-iron griddle, a line out the door, and a
              simple rule: smash it hard, season it loud, and never cut a corner.
            </p>
            <p>
              Five years later the line&apos;s longer and the rule hasn&apos;t changed. Every patty
              is hand-pressed to order, every bun toasted in beef fat, every sauce made in-house.
              No freezers. No shortcuts. No apologies.
            </p>
          </div>

          {/* stats */}
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="border-l-2 border-red pl-3"
              >
                <div className="font-display text-5xl md:text-6xl text-yellow leading-none">
                  {s.value}
                </div>
                <div className="font-mono text-[11px] uppercase tracking-wider text-white/50 mt-2">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>

          <Link
            to="/about"
            className="inline-block mt-10 font-display text-2xl uppercase tracking-wider text-white border-b-2 border-red hover:text-red transition-colors"
          >
            Read the full story
          </Link>
        </div>

        {/* right image grid */}
        <div className="grid grid-cols-2 grid-rows-2 gap-3 h-[420px] md:h-[520px]">
          {GRID.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className={`overflow-hidden border-2 border-grey-mid ${g.span}`}
            >
              <FoodImage src={g.src} alt={g.alt} className="w-full h-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
