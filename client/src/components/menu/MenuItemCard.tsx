import { motion } from 'framer-motion';
import { Flame, Leaf, Star } from 'lucide-react';
import { FoodImage } from '../ui/FoodImage';
import type { MenuItem } from '../../lib/types';

function Badge({
  icon: Icon,
  label,
  className,
}: {
  icon: typeof Flame;
  label: string;
  className: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 ${className}`}
    >
      <Icon size={11} /> {label}
    </span>
  );
}

export function MenuItemCard({ item, index = 0 }: { item: MenuItem; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.06 }}
      className="group flex flex-col bg-grey border-2 border-grey-mid hover:border-red transition-colors"
    >
      <div className="relative aspect-square overflow-hidden">
        <FoodImage
          src={item.image}
          alt={item.name}
          fallbackLabel={item.name}
          className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        {/* corner flags */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 items-start z-10">
          {item.isNew && <Badge icon={Star} label="New" className="bg-yellow text-black" />}
          {item.isSpicy && <Badge icon={Flame} label="Spicy" className="bg-red text-white" />}
          {item.isVeg && <Badge icon={Leaf} label="Veg" className="bg-green-600 text-white" />}
        </div>
        {item.isPopular && (
          <span className="absolute top-2 right-2 z-10 font-mono text-[10px] uppercase tracking-wider bg-black/80 text-yellow px-2 py-0.5">
            ★ Popular
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-body font-bold text-white text-lg leading-tight">{item.name}</h3>
          <span className="price-tag text-xl shrink-0">${item.price.toFixed(2)}</span>
        </div>
        <p className="mt-2 text-sm text-white/55 font-body leading-relaxed flex-1">
          {item.description}
        </p>
        {item.calories != null && (
          <p className="mt-3 font-mono text-[11px] text-white/35 uppercase tracking-wider">
            {item.calories} Cal
          </p>
        )}
      </div>
    </motion.article>
  );
}
