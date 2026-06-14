import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { signAdminToken } from '../utils/jwt';
import { startOfTodayUTC } from '../utils/date';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/** POST /api/admin/login */
export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body);

  const admin = await prisma.adminUser.findUnique({
    where: { email: email.toLowerCase() },
  });

  // Constant-ish time: always run a compare to avoid user enumeration.
  const hash = admin?.password ?? '$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva';
  const ok = await bcrypt.compare(password, hash);

  if (!admin || !ok) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = signAdminToken({ sub: admin.id, email: admin.email });
  res.json({
    token,
    admin: { id: admin.id, email: admin.email },
  });
}

/** GET /api/admin/me — verify the current token. */
export async function me(req: Request, res: Response) {
  res.json({ admin: req.admin });
}

/** GET /api/admin/dashboard — headline stats for the dashboard. */
export async function dashboard(_req: Request, res: Response) {
  const today = startOfTodayUTC();
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

  const [
    todaysReservations,
    pendingReservations,
    confirmedReservations,
    unreadMessages,
    totalMenuItems,
    availableMenuItems,
    upcoming,
  ] = await Promise.all([
    prisma.reservation.count({ where: { date: { gte: today, lt: tomorrow } } }),
    prisma.reservation.count({ where: { status: 'PENDING' } }),
    prisma.reservation.count({ where: { status: 'CONFIRMED' } }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.menuItem.count(),
    prisma.menuItem.count({ where: { available: true } }),
    prisma.reservation.findMany({
      where: { date: { gte: today } },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
      take: 5,
    }),
  ]);

  res.json({
    stats: {
      todaysReservations,
      pendingReservations,
      confirmedReservations,
      unreadMessages,
      totalMenuItems,
      availableMenuItems,
    },
    upcoming,
  });
}
