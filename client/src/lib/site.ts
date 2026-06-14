export const SITE = {
  name: 'GRINDHOUSE',
  tagline: 'No shortcuts. No apologies.',
  est: 'EST. 2019 · NEW YORK CITY',
  phone: '+1 (212) 555-0147',
  phoneHref: 'tel:+12125550147',
  email: 'hello@grindhouse.com',
  reservationEmail: 'reservations@grindhouse.com',
  address: {
    line1: '247 West 14th St',
    line2: 'New York, NY 10011',
    full: '247 West 14th St, New York, NY 10011',
  },
  mapsQuery: '247+West+14th+St+New+York+NY+10011',
  hours: [
    { days: 'Mon – Thu', time: '11am – 11pm' },
    { days: 'Fri – Sat', time: '11am – 2am' },
    { days: 'Sunday', time: '12pm – 10pm' },
  ],
  social: {
    instagram: 'https://instagram.com',
    tiktok: 'https://tiktok.com',
    twitter: 'https://twitter.com',
  },
};

export const MAPS_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${SITE.mapsQuery}`;
export const MAPS_EMBED = `https://maps.google.com/maps?q=${SITE.mapsQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/menu' },
  { label: 'About', to: '/about' },
  { label: 'Reservations', to: '/reservations' },
  { label: 'Contact', to: '/contact' },
];
