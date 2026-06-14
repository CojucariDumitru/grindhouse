import { PrismaClient, MenuCategory, ReservationStatus, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

/** Unsplash food photo. The frontend shows a branded fallback if any URL fails. */
const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;

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
    image: img('1568901346375-23c9450c58cd'),
    calories: 780,
    isPopular: true,
  },
  {
    name: 'Double Down',
    description:
      'Two quarter-pound smashed patties, double American cheese, double house sauce. For when one is never enough.',
    price: 16.99,
    category: 'BURGERS',
    image: img('1553979459-d2229ba7433a'),
    calories: 1120,
    isPopular: true,
  },
  {
    name: 'Spicy Diablo',
    description:
      'Smashed beef, pepper jack, charred jalapeño relish, ghost-pepper aioli. It bites back.',
    price: 14.99,
    category: 'BURGERS',
    image: img('1550547660-d9450f859349'),
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
    image: img('1525059696034-4967a8e1dca2'),
    calories: 720,
    isVeg: true,
  },
  {
    name: 'BBQ Bacon Stack',
    description:
      'Smashed beef, smoked bacon, crispy onion straws, aged cheddar, bourbon BBQ glaze.',
    price: 17.99,
    category: 'BURGERS',
    image: img('1571091718767-18b5b1457add'),
    calories: 1240,
  },
  {
    name: 'Truffle Shuffle',
    description:
      'Smashed beef, aged gruyère, black truffle aioli, wild arugula. Grown-up grindhouse.',
    price: 18.99,
    category: 'BURGERS',
    image: img('1572802419224-296b0aeee0d9'),
    calories: 960,
    isNew: true,
  },
  {
    name: 'The Classic',
    description:
      'Single smashed patty, American cheese, crisp lettuce, tomato, house sauce. No notes.',
    price: 11.99,
    category: 'BURGERS',
    image: img('1586190848861-99aa4a171e90'),
    calories: 650,
  },
  {
    name: 'Breakfast Smash',
    description:
      'Smashed beef, fried egg, hash brown, maple bacon, American cheese. Morning, noon, or 2am.',
    price: 13.99,
    category: 'BURGERS',
    image: img('1607013251379-e6eecfffe234'),
    calories: 850,
    isNew: true,
  },

  // ───────── LOADED FRIES ─────────
  {
    name: 'OG Fries',
    description: 'Hand-cut, double-fried, sea salt. The blank canvas.',
    price: 6.99,
    category: 'LOADED_FRIES',
    image: img('1573080496219-bb080dd4f877'),
    calories: 480,
  },
  {
    name: 'Cheese Bomb',
    description: 'Loaded with molten cheese sauce, crispy onions, and house seasoning.',
    price: 8.99,
    category: 'LOADED_FRIES',
    image: img('1639024471283-03518883512d'),
    calories: 720,
    isPopular: true,
  },
  {
    name: 'Truffle & Parm',
    description: 'Fries tossed in truffle oil, shaved parmesan, fresh parsley.',
    price: 9.99,
    category: 'LOADED_FRIES',
    image: img('1630384060421-cb20d0e0649d'),
    calories: 690,
    isNew: true,
  },
  {
    name: 'Chili Con Carne',
    description: 'Smothered in slow-cooked beef chili, cheddar, jalapeño, sour cream.',
    price: 9.99,
    category: 'LOADED_FRIES',
    image: img('1598679253544-2c97992403ea'),
    calories: 810,
    isSpicy: true,
  },

  // ───────── SIDES ─────────
  {
    name: 'Onion Rings',
    description: 'Beer-battered, golden, stacked high. Comes with house dip.',
    price: 5.99,
    category: 'SIDES',
    image: img('1639744210470-5e7e3d8b3b80'),
    calories: 420,
  },
  {
    name: 'Coleslaw',
    description: 'Crunchy, tangy, made fresh daily. The cooldown.',
    price: 3.99,
    category: 'SIDES',
    image: img('1625938145312-c12d9b0a9c79'),
    calories: 220,
    isVeg: true,
  },
  {
    name: 'Mac Bites',
    description: 'Crispy-fried mac & cheese bites with a molten center.',
    price: 6.99,
    category: 'SIDES',
    image: img('1612152328178-cbc3a4f4a0e2'),
    calories: 560,
  },

  // ───────── MILKSHAKES ─────────
  {
    name: 'Classic Vanilla',
    description: 'Real vanilla bean, hand-spun thick. Whipped cream recommended.',
    price: 7.99,
    category: 'MILKSHAKES',
    image: img('1572490122747-3968b75cc699'),
    calories: 540,
  },
  {
    name: 'Oreo Smash',
    description: 'Cookies & cream blended thick with crushed Oreo and a fudge swirl.',
    price: 8.99,
    category: 'MILKSHAKES',
    image: img('1568901839119-631418a3910d'),
    calories: 720,
    isPopular: true,
  },
  {
    name: 'Strawberry Lava',
    description: 'Fresh strawberry shake with a strawberry-compote ripple.',
    price: 8.99,
    category: 'MILKSHAKES',
    image: img('1629203851122-3726ecdf080e'),
    calories: 610,
  },

  // ───────── SODAS ─────────
  {
    name: 'House Lemonade',
    description: 'Fresh-squeezed, not too sweet, served over crushed ice.',
    price: 3.99,
    category: 'SODAS',
    image: img('1437418747212-8d9709afab22'),
    calories: 180,
    isVeg: true,
  },
  {
    name: 'Craft Cola',
    description: 'Our small-batch cola — vanilla, citrus, real cane sugar.',
    price: 3.99,
    category: 'SODAS',
    image: img('1581006852262-e4307cf6283a'),
    calories: 200,
    isVeg: true,
  },
];

const GALLERY: { url: string; alt: string }[] = [
  { url: img('1568901346375-23c9450c58cd'), alt: 'Smash burger close-up' },
  { url: img('1571091718767-18b5b1457add'), alt: 'Burger and loaded fries' },
  { url: img('1550547660-d9450f859349'), alt: 'Spicy burger stacked high' },
  { url: img('1572802419224-296b0aeee0d9'), alt: 'Truffle burger plated' },
  { url: img('1639024471283-03518883512d'), alt: 'Cheese-loaded fries' },
  { url: img('1572490122747-3968b75cc699'), alt: 'Thick vanilla milkshake' },
  { url: img('1607013251379-e6eecfffe234'), alt: 'Breakfast smash burger' },
  { url: img('1553979459-d2229ba7433a'), alt: 'Double stacked burger' },
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
