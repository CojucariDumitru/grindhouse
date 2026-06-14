import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { formLimiter } from '../middleware/rateLimiter';
import { createContactMessage } from '../controllers/contact.controller';

const router = Router();

// POST /api/contact — public contact form
router.post('/', formLimiter, asyncHandler(createContactMessage));

export default router;
