// One-off: pull a curated set of food photos into Cloudinary under `grindhouse/`.
// Cloudinary fetches each remote source and stores it; we then deliver via
// transformation URLs (see client/server `cld()` helpers) for a consistent look.
//
// Run from server/:  node scripts/upload-cloudinary.mjs
import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const src = (id) =>
  `https://images.unsplash.com/photo-${id}?w=1400&q=80&fm=jpg&fit=max`;

// public_id (under grindhouse/) -> source photo
const ASSETS = {
  // menu
  'menu/og-smash': '1568901346375-23c9450c58cd',
  'menu/double-down': '1610440042657-612c34d95e9f',
  'menu/spicy-diablo': '1550547660-d9450f859349',
  'menu/mushroom-cloud': '1525059696034-4967a8e1dca2',
  'menu/bbq-bacon': '1571091718767-18b5b1457add',
  'menu/truffle-shuffle': '1572802419224-296b0aeee0d9',
  'menu/classic': '1586190848861-99aa4a171e90',
  'menu/breakfast-smash': '1607013251379-e6eecfffe234',
  'menu/og-fries': '1573080496219-bb080dd4f877',
  'menu/cheese-bomb': '1639024471283-03518883512d',
  'menu/truffle-parm': '1630384060421-cb20d0e0649d',
  'menu/chili-fries': '1598679253544-2c97992403ea',
  'menu/onion-rings': '1632778149955-e80f8ceca2e8',
  'menu/coleslaw': '1607532941433-304659e8198a',
  'menu/mac-bites': '1543339308-43e59d6b73a6',
  'menu/vanilla-shake': '1572490122747-3968b75cc699',
  'menu/oreo-shake': '1568901839119-631418a3910d',
  'menu/strawberry-shake': '1629203851122-3726ecdf080e',
  'menu/lemonade': '1437418747212-8d9709afab22',
  'menu/cola': '1581006852262-e4307cf6283a',
  // sauces (new menu items)
  'menu/house-sauce': '1528735602780-2552fd46c7af',
  'menu/diablo-sauce': '1601050690597-df0568f70950',
  // site / story / about / crew / gallery
  'site/hero': '1568901346375-23c9450c58cd',
  'site/about-hero': '1514516345957-556ca7d90a29',
  'story/grill': '1606131731446-5568d87113aa',
  'story/stack': '1550547660-d9450f859349',
  'story/combo': '1571091718767-18b5b1457add',
  'about/origin': '1556910103-1c02745aae4d',
  'about/meat': '1551782450-a2132b4ba21d',
  'about/sauce': '1607013251379-e6eecfffe234',
  'crew/theo': '1583394838336-acd977736f90',
  'crew/lena': '1577219491135-ce391730fb2c',
  'crew/dre': '1622253692010-333f2da6031d',
  'gallery/g1': '1568901346375-23c9450c58cd',
  'gallery/g2': '1571091718767-18b5b1457add',
  'gallery/g3': '1550547660-d9450f859349',
  'gallery/g4': '1572802419224-296b0aeee0d9',
  'gallery/g5': '1639024471283-03518883512d',
  'gallery/g6': '1572490122747-3968b75cc699',
  'gallery/g7': '1607013251379-e6eecfffe234',
  'gallery/g8': '1610440042657-612c34d95e9f',
};

const results = { ok: [], failed: [] };

for (const [publicId, photoId] of Object.entries(ASSETS)) {
  try {
    const res = await cloudinary.uploader.upload(src(photoId), {
      public_id: `grindhouse/${publicId}`,
      overwrite: true,
      invalidate: true,
      resource_type: 'image',
    });
    results.ok.push(publicId);
    console.log(`✓ ${publicId}  (${res.width}x${res.height})`);
  } catch (err) {
    results.failed.push({ publicId, error: err?.message || String(err) });
    console.error(`✗ ${publicId}  — ${err?.message || err}`);
  }
}

console.log(`\nDone. ${results.ok.length} uploaded, ${results.failed.length} failed.`);
if (results.failed.length) console.log(JSON.stringify(results.failed, null, 2));
