import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { getMenu, getFeatured } from '../controllers/menu.controller';

const router = Router();

// GET /api/menu          — full menu grouped by category
// GET /api/menu/featured — the 4 "heavy hitters"
router.get('/', asyncHandler(getMenu));
router.get('/featured', asyncHandler(getFeatured));

export default router;
