import { PrismaClient, MenuCategory, ReservationStatus, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

/** Cloudinary delivery URL (images uploaded under grindhouse/ — see scripts/upload-cloudinary.mjs). */
const cld = (id: string, t = 'c_fill,g_auto,w_900,h_900') =>
  `https://res.cloudinary.com/dozr400tl/image/upload/${t},f_auto,q_auto/grindhouse/${id}`;

type SeedItem = {
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  calories: number;
  isPopular?: boolean;
  isNew?: boolean;
  isSpicy?: boolean;
  isVeg?: boolean;
};

const MENU: SeedItem[] = [
  // ───────── BURGERS ─────────
  {
    name: 'The OG Smash',
    description:
      'The one that started it all. Double-smashed beef, American cheese, house sauce, pickles, diced onion on a toasted potato bun.',
    price: 12.99,
    category: 'BURGERS',
    image: cld('menu/og-smash'),
    calories: 780,
    isPopular: true,
  },
  {
    name: 'Double Down',
    description:
      'Two quarter-pound smashed patties, double American cheese, double house sauce. For when one is never enough.',
    price: 16.99,
    category: 'BURGERS',
    image: cld('menu/double-down'),
    calories: 1120,
    isPopular: true,
  },
  {
    name: 'Spicy Diablo',
    description:
      'Smashed beef, pepper jack, charred jalapeño relish, ghost-pepper aioli. It bites back.',
    price: 14.99,
    category: 'BURGERS',
    image: cld('menu/spicy-diablo'),
    calories: 890,
    isPopular: true,
    isSpicy: true,
  },
  {
    name: 'The Mushroom Cloud',
    description:
      'Grilled portobello, melted Swiss, caramelized onion, truffle mayo on brioche. Plant-forward, flavor-loaded.',
    price: 15.99,
    category: 'BURGERS',
    image: cld('menu/mushroom-cloud'),
    calories: 720,
    isVeg: true,
  },
  {
    name: 'BBQ Bacon Stack',
    description:
      'Smashed beef, smoked bacon, crispy onion straws, aged cheddar, bourbon BBQ glaze.',
    price: 17.99,
    category: 'BURGERS',
    image: cld('menu/bbq-bacon'),
    calories: 1240,
  },
  {
    name: 'Truffle Shuffle',
    description:
      'Smashed beef, aged gruyère, black truffle aioli, wild arugula. Grown-up grindhouse.',
    price: 18.99,
    category: 'BURGERS',
    image: cld('menu/truffle-shuffle'),
    calories: 960,
    isNew: true,
  },
  {
    name: 'The Classic',
    description:
      'Single smashed patty, American cheese, crisp lettuce, tomato, house sauce. No notes.',
    price: 11.99,
    category: 'BURGERS',
    image: cld('menu/classic'),
    calories: 650,
  },
  {
    name: 'Breakfast Smash',
    description:
      'Smashed beef, fried egg, hash brown, maple bacon, American cheese. Morning, noon, or 2am.',
    price: 13.99,
    category: 'BURGERS',
    image: cld('menu/breakfast-smash'),
    calories: 850,
    isNew: true,
  },

  // ───────── LOADED FRIES ─────────
  {
    name: 'OG Fries',
    description: 'Hand-cut, double-fried, sea salt. The blank canvas.',
    price: 6.99,
    category: 'LOADED_FRIES',
    image: cld('menu/og-fries'),
    calories: 480,
  },
  {
    name: 'Cheese Bomb',
    description: 'Loaded with molten cheese sauce, crispy onions, and house seasoning.',
    price: 8.99,
    category: 'LOADED_FRIES',
    image: cld('menu/cheese-bomb'),
    calories: 720,
    isPopular: true,
  },
  {
    name: 'Truffle & Parm',
    description: 'Fries tossed in truffle oil, shaved parmesan, fresh parsley.',
    price: 9.99,
    category: 'LOADED_FRIES',
    image: cld('menu/truffle-parm'),
    calories: 690,
    isNew: true,
  },
  {
    name: 'Chili Con Carne',
    description: 'Smothered in slow-cooked beef chili, cheddar, jalapeño, sour cream.',
    price: 9.99,
    category: 'LOADED_FRIES',
    image: cld('menu/chili-fries'),
    calories: 810,
    isSpicy: true,
  },

  // ───────── SIDES ─────────
  {
    name: 'Onion Rings',
    description: 'Beer-battered, golden, stacked high. Comes with house dip.',
    price: 5.99,
    category: 'SIDES',
    image: cld('menu/onion-rings'),
    calories: 420,
  },
  {
    name: 'Coleslaw',
    description: 'Crunchy, tangy, made fresh daily. The cooldown.',
    price: 3.99,
    category: 'SIDES',
    image: cld('menu/coleslaw'),
    calories: 220,
    isVeg: true,
  },
  {
    name: 'Mac Bites',
    description: 'Crispy-fried mac & cheese bites with a molten center.',
    price: 6.99,
    category: 'SIDES',
    image: cld('menu/mac-bites'),
    calories: 560,
  },

  // ───────── MILKSHAKES ─────────
  {
    name: 'Classic Vanilla',
    description: 'Real vanilla bean, hand-spun thick. Whipped cream recommended.',
    price: 7.99,
    category: 'MILKSHAKES',
    image: cld('menu/vanilla-shake'),
    calories: 540,
  },
  {
    name: 'Oreo Smash',
    description: 'Cookies & cream blended thick with crushed Oreo and a fudge swirl.',
    price: 8.99,
    category: 'MILKSHAKES',
    image: cld('menu/oreo-shake'),
    calories: 720,
    isPopular: true,
  },
  {
    name: 'Strawberry Lava',
    description: 'Fresh strawberry shake with a strawberry-compote ripple.',
    price: 8.99,
    category: 'MILKSHAKES',
    image: cld('menu/strawberry-shake'),
    calories: 610,
  },

  // ───────── SODAS ─────────
  {
    name: 'House Lemonade',
    description: 'Fresh-squeezed, not too sweet, served over crushed ice.',
    price: 3.99,
    category: 'SODAS',
    image: cld('menu/lemonade'),
    calories: 180,
    isVeg: true,
  },
  {
    name: 'Craft Cola',
    description: 'Our small-batch cola — vanilla, citrus, real cane sugar.',
    price: 3.99,
    category: 'SODAS',
    image: cld('menu/cola'),
    calories: 200,
    isVeg: true,
  },

  // ───────── SAUCES ─────────
  {
    name: 'House Sauce',
    description: 'The secret one. Tangy, smoky, slightly sweet. Goes on everything (it already does).',
    price: 1.99,
    category: 'SAUCES',
    image: cld('menu/house-sauce'),
    calories: 120,
    isVeg: true,
  },
  {
    name: 'Diablo Sauce',
    description: 'Ghost-pepper aioli for the brave. Adds heat to anything on the board.',
    price: 1.99,
    category: 'SAUCES',
    image: cld('menu/diablo-sauce'),
    calories: 110,
    isSpicy: true,
    isVeg: true,
  },
];

const GALLERY: { url: string; alt: string }[] = [
  { url: cld('gallery/g1'), alt: 'Smash burger close-up' },
  { url: cld('gallery/g2'), alt: 'Burger and loaded fries' },
  { url: cld('gallery/g3'), alt: 'Spicy burger stacked high' },
  { url: cld('gallery/g4'), alt: 'Truffle burger plated' },
  { url: cld('gallery/g5'), alt: 'Cheese-loaded fries' },
  { url: cld('gallery/g6'), alt: 'Thick vanilla milkshake' },
  { url: cld('gallery/g7'), alt: 'Breakfast smash burger' },
  { url: cld('gallery/g8'), alt: 'Double stacked burger' },
];

function daysFromNow(days: number, hours = 0): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  d.setUTCHours(hours, 0, 0, 0);
  return d;
}

async function main() {
  console.log('🍔 Seeding GRINDHOUSE...');

  // ---- Admin ----
  const adminEmail = (process.env.ADMIN_EMAIL ?? 'admin@grindhouse.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Grind2024!';
  const hashed = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { password: hashed },
    create: { email: adminEmail, password: hashed },
  });
  console.log(`   ✓ Admin: ${adminEmail}`);

  // ---- Menu (idempotent: wipe + reinsert) ----
  await prisma.menuItem.deleteMany();
  await prisma.menuItem.createMany({
    data: MENU.map((m, i) => ({
      name: m.name,
      description: m.description,
      price: new Prisma.Decimal(m.price),
      category: m.category,
      image: m.image,
      calories: m.calories,
      isPopular: m.isPopular ?? false,
      isNew: m.isNew ?? false,
      isSpicy: m.isSpicy ?? false,
      isVeg: m.isVeg ?? false,
      available: true,
      order: i,
    })),
  });
  console.log(`   ✓ Menu items: ${MENU.length}`);

  // ---- Gallery ----
  await prisma.galleryImage.deleteMany();
  await prisma.galleryImage.createMany({
    data: GALLERY.map((g, i) => ({ url: g.url, alt: g.alt, order: i })),
  });
  console.log(`   ✓ Gallery images: ${GALLERY.length}`);

  // ---- Reservations (demo) ----
  await prisma.reservation.deleteMany();
  await prisma.reservation.createMany({
    data: [
      {
        name: 'Marcus Reyes',
        email: 'marcus.reyes@example.com',
        phone: '+1 (212) 555-0192',
        date: daysFromNow(0),
        time: '19:00',
        guests: 4,
        notes: 'Window seat if possible.',
        status: ReservationStatus.PENDING,
      },
      {
        name: 'Dana Whitfield',
        email: 'dana.w@example.com',
        phone: '+1 (646) 555-0118',
        date: daysFromNow(0),
        time: '20:00',
        guests: 2,
        status: ReservationStatus.CONFIRMED,
      },
      {
        name: 'Priya Nair',
        email: 'priya.nair@example.com',
        phone: '+1 (917) 555-0143',
        date: daysFromNow(1),
        time: '18:30',
        guests: 6,
        notes: 'Birthday — any chance of a candle on a shake?',
        status: ReservationStatus.PENDING,
      },
      {
        name: 'Tom Castellano',
        email: 'tcastellano@example.com',
        phone: '+1 (212) 555-0170',
        date: daysFromNow(2),
        time: '19:30',
        guests: 3,
        status: ReservationStatus.CONFIRMED,
      },
      {
        name: 'Jess Okafor',
        email: 'jess.okafor@example.com',
        phone: '+1 (347) 555-0155',
        date: daysFromNow(6),
        time: '21:00',
        guests: 8,
        notes: 'Bachelor party — loud is fine.',
        status: ReservationStatus.PENDING,
      },
    ],
  });
  console.log('   ✓ Reservations: 5');

  // ---- Contact messages (unread) ----
  await prisma.contactMessage.deleteMany();
  await prisma.contactMessage.createMany({
    data: [
      {
        name: 'Olivia Brand',
        email: 'olivia@eventsbybrand.com',
        subject: 'Private event inquiry',
        message:
          "Hi! I'm planning a 30-person company dinner in July and would love to know about buyouts or a set menu. What are the options?",
        read: false,
      },
      {
        name: 'Sam Lerner',
        email: 'sam.lerner@example.com',
        subject: 'Vegan options?',
        message:
          'Love the Mushroom Cloud — any chance of a fully vegan bun and cheese? Bringing a group on Friday.',
        read: false,
      },
      {
        name: 'Riley Chen',
        email: 'riley.chen@example.com',
        subject: 'Left my jacket',
        message:
          'I think I left a black denim jacket on the back of a chair near the window last night around 10pm. Did anyone hand it in?',
        read: false,
      },
    ],
  });
  console.log('   ✓ Contact messages: 3');

  console.log('✅ Seed complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
