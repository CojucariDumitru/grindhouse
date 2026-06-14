import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { fetchMenu } from '../api/menu.api';
import { MenuCategory } from '../components/menu/MenuCategory';
import { PageHeader } from '../components/ui/PageHeader';
import { CATEGORY_LABELS, type MenuCategory as Cat } from '../lib/types';

export default function Menu() {
  const { data, isLoading, isError } = useQuery({ queryKey: ['menu'], queryFn: fetchMenu });
  const [active, setActive] = useState<Cat | null>(null);
  const clickScrolling = useRef(false);

  const categories = data?.categories ?? [];

  useEffect(() => {
    if (categories.length && !active) setActive(categories[0].category);
  }, [categories, active]);

  // Highlight the tab for whichever category is in view.
  useEffect(() => {
    if (!categories.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (clickScrolling.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id as Cat);
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5] },
    );
    categories.forEach((c) => {
      const el = document.getElementById(c.category);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [categories]);

  const scrollTo = (cat: Cat) => {
    setActive(cat);
    clickScrolling.current = true;
    document.getElementById(cat)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => (clickScrolling.current = false), 800);
  };

  return (
    <>
      <PageHeader
        eyebrow="No shortcuts. No apologies."
        title="The Menu"
        subtitle="Every patty hand-smashed to order. Every sauce made in-house. Pick your weapon."
      />

      {/* sticky category tabs */}
      <div className="sticky top-[58px] z-40 bg-black/95 backdrop-blur border-b-2 border-red">
        <div className="mx-auto max-w-7xl px-2">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {categories.map((c) => (
              <button
                key={c.category}
                onClick={() => scrollTo(c.category)}
                className={clsx(
                  'whitespace-nowrap px-4 py-3 font-display text-xl md:text-2xl uppercase tracking-wide transition-colors border-b-4',
                  active === c.category
                    ? 'text-red border-red'
                    : 'text-white/55 border-transparent hover:text-white',
                )}
              >
                {CATEGORY_LABELS[c.category]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-24 min-h-[50vh]">
        {isLoading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 pt-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 bg-grey animate-pulse" />
            ))}
          </div>
        )}

        {isError && (
          <p className="pt-16 font-mono text-white/50">
            The menu is taking a smoke break. Try refreshing in a moment.
          </p>
        )}

        {categories.map((group) => (
          <MenuCategory key={group.category} group={group} />
        ))}
      </div>
    </>
  );
}
