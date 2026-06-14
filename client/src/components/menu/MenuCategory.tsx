import { MenuItemCard } from './MenuItemCard';
import { CATEGORY_LABELS, type MenuGroup } from '../../lib/types';

export function MenuCategory({ group }: { group: MenuGroup }) {
  return (
    <section id={group.category} className="scroll-mt-32 py-12 first:pt-4">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="display text-white text-5xl md:text-6xl whitespace-nowrap">
          {CATEGORY_LABELS[group.category]}
        </h2>
        <span className="h-1 flex-1 bg-red" />
        <span className="font-mono text-sm text-white/40">{group.items.length}</span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {group.items.map((item, i) => (
          <MenuItemCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
