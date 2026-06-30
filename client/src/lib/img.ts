// Cloudinary delivery helper. Images live under the `grindhouse/` folder in
// the project's Cloudinary account; we apply transformations at delivery time
// for a consistent, optimised look (auto format + quality everywhere).
const CLOUD_NAME = 'dozr400tl';

export function cld(publicId: string, transform = 'c_fill,g_auto,w_800,h_800'): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transform},f_auto,q_auto/grindhouse/${publicId}`;
}

// Common presets
export const img = {
  square: (id: string, size = 800) => cld(id, `c_fill,g_auto,w_${size},h_${size}`),
  hero: (id: string) => cld(id, 'c_fill,g_auto,w_1100,h_1100'),
  wide: (id: string) => cld(id, 'c_fill,g_auto,w_1600,h_900'),
  card: (id: string) => cld(id, 'c_fill,g_auto,w_800,h_600'),
  portrait: (id: string) => cld(id, 'c_fill,g_face,w_500,h_650'),
};
