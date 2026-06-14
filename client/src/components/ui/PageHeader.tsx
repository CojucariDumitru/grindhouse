import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
}

/** Consistent top banner for inner pages. Accounts for the fixed navbar. */
export function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <header className="relative bg-black pt-32 md:pt-40 pb-12 overflow-hidden grain border-b-2 border-grey-mid">
      <div className="absolute -top-20 right-0 w-[40vw] h-[40vw] bg-[radial-gradient(circle,rgba(230,51,18,0.14)_0%,transparent_60%)] pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-7xl px-5">
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="label text-red mb-4"
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="display text-white text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-white/60 font-body text-lg max-w-2xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </header>
  );
}
