import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { fetchFeatured } from '../../api/menu.api';
import { FoodImage } from '../ui/FoodImage';
import type { MenuItem } from '../../lib/types';

function Card({ item, index }: { item: MenuItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.1 }}
    >
      <Link
        to="/menu"
        className="group relative block aspect-[4/3] overflow-hidden border-2 border-grey-mid hover:border-red transition-colors"
      >
        <FoodImage
          src={item.image}
          alt={item.name}
          fallbackLabel={item.name}
          className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-110"
        />
        {/* base gradient for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        {/* popular badge */}
        <span className="absolute top-4 left-4 bg-yellow text-black font-display text-lg tracking-wider px-3 py-0.5 z-10">
          POPULAR
        </span>

        {/* content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
          <h3 className="font-display text-3xl md:text-4xl text-white leading-none">{item.name}</h3>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="price-tag text-xl">${item.price.toFixed(2)}</span>
            {item.calories && (
              <span className="font-mono text-xs text-white/50">{item.calories} CAL</span>
            )}
          </div>
        </div>

        {/* hover overlay */}
        <div className="absolute inset-0 bg-red/85 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <span className="font-display text-3xl md:text-4xl text-black tracking-wider flex items-center gap-2">
            View Menu <ArrowUpRight size={32} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export function FeaturedItems() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['featured'],
    queryFn: fetchFeatured,
  });

  return (
    <section className="relative bg-black py-20 md:py-28 overflow-hidden grain">
      <div className="relative z-10 mx-auto max-w-7xl px-5">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <p className="label text-red mb-3">★ Crowd favorites</p>
            <h2 className="display text-white text-6xl md:text-8xl">The Heavy Hitters</h2>
          </div>
          <Link
            to="/menu"
            className="label text-white/60 hover:text-red transition-colors flex items-center gap-2 self-start md:self-end"
          >
            Full Menu <ArrowUpRight size={16} />
          </Link>
        </div>

        {isLoading && (
          <div className="grid sm:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-grey animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <p className="font-mono text-white/50">
            Couldn&apos;t load featured items. The kitchen will be back shortly.
          </p>
        )}

        {data && data.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-5">
            {data.map((item, i) => (
              <Card key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
