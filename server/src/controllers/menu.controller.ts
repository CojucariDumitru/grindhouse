import { Request, Response } from 'express';
import { z } from 'zod';
import { MenuCategory, Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { uploadMenuImage } from '../config/cloudinary';

const CATEGORY_ORDER: MenuCategory[] = [
  'BURGERS',
  'LOADED_FRIES',
  'SIDES',
  'MILKSHAKES',
  'SODAS',
  'SAUCES',
];

/** Serialise a MenuItem, converting Decimal price to a number for JSON. */
function serialize(item: {
  price: Prisma.Decimal;
  [k: string]: unknown;
}) {
  return { ...item, price: Number(item.price) };
}

/* ----------------------------- PUBLIC ----------------------------- */

/** GET /api/menu — all available items, grouped by category in display order. */
export async function getMenu(req: Request, res: Response) {
  const includeUnavailable = req.query.all === 'true';

  const items = await prisma.menuItem.findMany({
    where: includeUnavailable ? {} : { available: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  });

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    items: items.filter((i) => i.category === category).map(serialize),
  })).filter((g) => g.items.length > 0);

  res.json({ categories: grouped, total: items.length });
}

/** GET /api/menu/featured — the heavy hitters (isPopular). */
export async function getFeatured(_req: Request, res: Response) {
  const items = await prisma.menuItem.findMany({
    where: { isPopular: true, available: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    take: 4,
  });
  res.json(items.map(serialize));
}

/* ------------------------------ ADMIN ----------------------------- */

const menuItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  description: z.string().min(1, 'Description is required').max(500),
  price: z.coerce.number().positive('Price must be positive'),
  category: z.nativeEnum(MenuCategory),
  image: z.string().url().nullable().optional(),
  isPopular: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isSpicy: z.boolean().optional(),
  isVeg: z.boolean().optional(),
  available: z.boolean().optional(),
  order: z.coerce.number().int().optional(),
  calories: z.coerce.number().int().nullable().optional(),
});

/** GET /api/admin/menu — every item, including unavailable. */
export async function adminListMenu(_req: Request, res: Response) {
  const items = await prisma.menuItem.findMany({
    orderBy: [{ category: 'asc' }, { order: 'asc' }, { createdAt: 'asc' }],
  });
  res.json(items.map(serialize));
}

/** POST /api/admin/menu */
export async function createMenuItem(req: Request, res: Response) {
  const data = menuItemSchema.parse(req.body);
  const item = await prisma.menuItem.create({
    data: { ...data, price: new Prisma.Decimal(data.price) },
  });
  res.status(201).json(serialize(item));
}

/** PATCH /api/admin/menu/:id */
export async function updateMenuItem(req: Request, res: Response) {
  const { id } = req.params;
  const data = menuItemSchema.partial().parse(req.body);

  const update: Prisma.MenuItemUpdateInput = { ...data };
  if (data.price !== undefined) {
    update.price = new Prisma.Decimal(data.price);
  }

  const item = await prisma.menuItem.update({ where: { id }, data: update });
  res.json(serialize(item));
}

/** PATCH /api/admin/menu/:id/availability — quick toggle. */
export async function toggleAvailability(req: Request, res: Response) {
  const { id } = req.params;
  const existing = await prisma.menuItem.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Menu item not found');

  const item = await prisma.menuItem.update({
    where: { id },
    data: { available: !existing.available },
  });
  res.json(serialize(item));
}

/** DELETE /api/admin/menu/:id */
export async function deleteMenuItem(req: Request, res: Response) {
  const { id } = req.params;
  await prisma.menuItem.delete({ where: { id } });
  res.status(204).send();
}

const uploadSchema = z.object({
  image: z.string().min(1, 'image (data URI) is required'),
});

/** POST /api/admin/menu/upload — accepts a base64 data URI, returns Cloudinary URL. */
export async function uploadImage(req: Request, res: Response) {
  const { image } = uploadSchema.parse(req.body);
  const url = await uploadMenuImage(image);
  res.json({ url });
}
