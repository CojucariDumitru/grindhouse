import { Marquee } from './Marquee';

const WORDS = ['GRINDHOUSE', 'NO SHORTCUTS', 'NO APOLOGIES', 'SMASH SEASON', 'NYC'];

function Row({ direction }: { direction: 'left' | 'right' }) {
  return (
    <Marquee
      direction={direction}
      items={WORDS.map((w) => (
        <span className="font-display text-4xl md:text-6xl tracking-wider uppercase">{w}</span>
      ))}
      separator={<span className="mx-6 text-black/70 text-2xl md:text-4xl">🍔</span>}
    />
  );
}

export function MarqueeStrip() {
  return (
    <section className="bg-red text-white py-6 md:py-8 border-y-4 border-black select-none">
      <Row direction="left" />
      <div className="h-2 md:h-3" />
      <Row direction="right" />
    </section>
  );
}
