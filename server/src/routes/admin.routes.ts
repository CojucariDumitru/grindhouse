import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { requireAdmin } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';
import { login, me, dashboard } from '../controllers/admin.controller';
import {
  adminListMenu,
  createMenuItem,
  updateMenuItem,
  toggleAvailability,
  deleteMenuItem,
  uploadImage,
} from '../controllers/menu.controller';
import {
  adminListReservations,
  updateReservationStatus,
  deleteReservation,
} from '../controllers/reservation.controller';
import {
  adminListMessages,
  markMessageRead,
  deleteMessage,
} from '../controllers/contact.controller';

const router = Router();

/* ---------------------------- auth ---------------------------- */
router.post('/login', authLimiter, asyncHandler(login));
router.get('/me', requireAdmin, asyncHandler(me));
router.get('/dashboard', requireAdmin, asyncHandler(dashboard));

/* ------------------------ menu management --------------------- */
router.get('/menu', requireAdmin, asyncHandler(adminListMenu));
router.post('/menu', requireAdmin, asyncHandler(createMenuItem));
router.post('/menu/upload', requireAdmin, asyncHandler(uploadImage));
router.patch('/menu/:id', requireAdmin, asyncHandler(updateMenuItem));
router.patch('/menu/:id/availability', requireAdmin, asyncHandler(toggleAvailability));
router.delete('/menu/:id', requireAdmin, asyncHandler(deleteMenuItem));

/* --------------------- reservation management ----------------- */
router.get('/reservations', requireAdmin, asyncHandler(adminListReservations));
router.patch('/reservations/:id/status', requireAdmin, asyncHandler(updateReservationStatus));
router.delete('/reservations/:id', requireAdmin, asyncHandler(deleteReservation));

/* ------------------------ message management ------------------ */
router.get('/messages', requireAdmin, asyncHandler(adminListMessages));
router.patch('/messages/:id/read', requireAdmin, asyncHandler(markMessageRead));
router.delete('/messages/:id', requireAdmin, asyncHandler(deleteMessage));

export default router;
