import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { sendContactNotification } from '../services/email.service';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required').max(120),
  email: z.string().email('A valid email is required'),
  subject: z.string().min(2, 'Subject is required').max(150),
  message: z.string().min(5, 'Message is too short').max(2000),
});

/* ----------------------------- PUBLIC ----------------------------- */

/** POST /api/contact */
export async function createContactMessage(req: Request, res: Response) {
  const data = contactSchema.parse(req.body);

  const message = await prisma.contactMessage.create({ data });

  const result = await sendContactNotification(data).catch(() => ({ sent: false }));

  res.status(201).json({ message, emailSent: result.sent });
}

/* ------------------------------ ADMIN ----------------------------- */

/** GET /api/admin/messages?unread=true */
export async function adminListMessages(req: Request, res: Response) {
  const unreadOnly = req.query.unread === 'true';
  const messages = await prisma.contactMessage.findMany({
    where: unreadOnly ? { read: false } : {},
    orderBy: { createdAt: 'desc' },
  });
  res.json(messages);
}

/** PATCH /api/admin/messages/:id/read */
export async function markMessageRead(req: Request, res: Response) {
  const { id } = req.params;
  const read = req.body?.read === undefined ? true : Boolean(req.body.read);
  const message = await prisma.contactMessage.update({
    where: { id },
    data: { read },
  });
  res.json(message);
}

/** DELETE /api/admin/messages/:id */
export async function deleteMessage(req: Request, res: Response) {
  await prisma.contactMessage.delete({ where: { id: req.params.id } });
  res.status(204).send();
}
