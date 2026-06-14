import { Request, Response } from 'express';
import { z } from 'zod';
import { ReservationStatus } from '@prisma/client';
import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { formatDateLabel, startOfTodayUTC } from '../utils/date';
import {
  sendReservationConfirmation,
  sendReservationNotification,
  sendReservationStatusEmail,
} from '../services/email.service';

const TIME_SLOTS = [
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30',
];

const reservationSchema = z.object({
  name: z.string().min(2, 'Name is required').max(120),
  email: z.string().email('A valid email is required'),
  phone: z.string().min(7, 'A valid phone number is required').max(30),
  date: z.coerce.date(),
  time: z.string().refine((t) => TIME_SLOTS.includes(t), 'Pick a valid time slot'),
  guests: z.coerce.number().int().min(1, 'At least 1 guest').max(20, 'Call us for parties over 20'),
  notes: z.string().max(1000).optional().nullable(),
});

/* ----------------------------- PUBLIC ----------------------------- */

/** POST /api/reservations */
export async function createReservation(req: Request, res: Response) {
  const data = reservationSchema.parse(req.body);

  if (data.date < startOfTodayUTC()) {
    throw ApiError.badRequest('Reservation date cannot be in the past');
  }

  const reservation = await prisma.reservation.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: data.date,
      time: data.time,
      guests: data.guests,
      notes: data.notes ?? null,
    },
  });

  const dateLabel = formatDateLabel(reservation.date);
  const emailPayload = {
    name: reservation.name,
    email: reservation.email,
    phone: reservation.phone,
    dateLabel,
    time: reservation.time,
    guests: reservation.guests,
    notes: reservation.notes,
  };

  // Fire emails but never let an email failure break the booking.
  const [confirmation] = await Promise.allSettled([
    sendReservationConfirmation(emailPayload),
    sendReservationNotification(emailPayload),
  ]);

  res.status(201).json({
    reservation,
    dateLabel,
    emailSent: confirmation.status === 'fulfilled' && confirmation.value.sent,
  });
}

/* ------------------------------ ADMIN ----------------------------- */

/** GET /api/admin/reservations?status=&date= */
export async function adminListReservations(req: Request, res: Response) {
  const { status, date } = req.query;

  const where: Record<string, unknown> = {};
  if (status && typeof status === 'string' && status in ReservationStatus) {
    where.status = status as ReservationStatus;
  }
  if (date && typeof date === 'string') {
    const d = new Date(date);
    if (!isNaN(d.getTime())) {
      const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 1);
      where.date = { gte: start, lt: end };
    }
  }

  const reservations = await prisma.reservation.findMany({
    where,
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
  });
  res.json(reservations);
}

const statusSchema = z.object({
  status: z.nativeEnum(ReservationStatus),
});

/** PATCH /api/admin/reservations/:id/status */
export async function updateReservationStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = statusSchema.parse(req.body);

  const reservation = await prisma.reservation.update({
    where: { id },
    data: { status },
  });

  // Email the customer when confirmed or cancelled.
  let emailSent = false;
  if (status === 'CONFIRMED' || status === 'CANCELLED') {
    const result = await sendReservationStatusEmail(
      {
        name: reservation.name,
        email: reservation.email,
        phone: reservation.phone,
        dateLabel: formatDateLabel(reservation.date),
        time: reservation.time,
        guests: reservation.guests,
        notes: reservation.notes,
      },
      status,
    );
    emailSent = result.sent;
  }

  res.json({ reservation, emailSent });
}

/** DELETE /api/admin/reservations/:id */
export async function deleteReservation(req: Request, res: Response) {
  await prisma.reservation.delete({ where: { id: req.params.id } });
  res.status(204).send();
}
