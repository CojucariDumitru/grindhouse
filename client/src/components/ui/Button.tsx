import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

type Variant = 'red' | 'outline' | 'yellow' | 'ghost';

const VARIANTS: Record<Variant, string> = {
  red: 'bg-red text-black hover:bg-yellow hover:shadow-neon',
  yellow: 'bg-yellow text-black hover:bg-red hover:text-white hover:shadow-neon',
  outline: 'border-2 border-white text-white hover:bg-white hover:text-black',
  ghost: 'border-2 border-grey-mid text-white hover:border-red hover:text-red',
};

const base =
  'inline-flex items-center justify-center gap-2 font-display uppercase tracking-wider ' +
  'px-8 py-3 text-xl md:text-2xl transition-all duration-200 active:translate-y-[1px] ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  to?: string;
  href?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'red', to, href, className, children, ...props }, ref) => {
    const classes = clsx(base, VARIANTS[variant], className);

    if (to) {
      return (
        <Link to={to} className={classes}>
          {children}
        </Link>
      );
    }
    if (href) {
      return (
        <a href={href} target="_blank" rel="noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
