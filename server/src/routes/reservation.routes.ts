import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { formLimiter } from '../middleware/rateLimiter';
import { createReservation } from '../controllers/reservation.controller';

const router = Router();

// POST /api/reservations — public booking endpoint
router.post('/', formLimiter, asyncHandler(createReservation));

export default router;
