import { FoodImage } from '../ui/FoodImage';
import { img } from '../../lib/img';

const IMAGES = [
  { src: img.square('gallery/g1', 500), alt: 'Smash burger' },
  { src: img.square('gallery/g2', 500), alt: 'Burger and fries' },
  { src: img.square('gallery/g3', 500), alt: 'Spicy burger' },
  { src: img.square('gallery/g4', 500), alt: 'Truffle burger' },
  { src: img.square('gallery/g5', 500), alt: 'Loaded fries' },
  { src: img.square('gallery/g6', 500), alt: 'Milkshake' },
  { src: img.square('gallery/g7', 500), alt: 'Breakfast burger' },
  { src: img.square('gallery/g8', 500), alt: 'Double burger' },
];

export function GalleryStrip() {
  const row = [...IMAGES, ...IMAGES];
  return (
    <section className="bg-black py-16 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 mb-8">
        <p className="label text-red mb-2">@grindhousenyc</p>
        <h2 className="display text-white text-5xl md:text-7xl">Straight Off The Griddle</h2>
      </div>

      <div className="overflow-hidden pause-hover">
        <div className="flex w-max gap-4 animate-marquee-left">
          {row.map((img, i) => (
            <div
              key={i}
              className="w-64 h-64 md:w-80 md:h-80 shrink-0 overflow-hidden border-2 border-grey-mid transition-transform duration-300 hover:scale-105 hover:border-red"
            >
              <FoodImage src={img.src} alt={img.alt} className="w-full h-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
