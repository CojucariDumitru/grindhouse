import { FoodImage } from '../ui/FoodImage';

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=500&q=80`;

const IMAGES = [
  { src: u('1568901346375-23c9450c58cd'), alt: 'Smash burger' },
  { src: u('1571091718767-18b5b1457add'), alt: 'Burger and fries' },
  { src: u('1550547660-d9450f859349'), alt: 'Spicy burger' },
  { src: u('1572802419224-296b0aeee0d9'), alt: 'Truffle burger' },
  { src: u('1639024471283-03518883512d'), alt: 'Loaded fries' },
  { src: u('1572490122747-3968b75cc699'), alt: 'Milkshake' },
  { src: u('1607013251379-e6eecfffe234'), alt: 'Breakfast burger' },
  { src: u('1553979459-d2229ba7433a'), alt: 'Double burger' },
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
