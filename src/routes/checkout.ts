import express from 'express';
import checkoutController from '../controllers/checkout';
import { requireLogin, requireAdmin } from '../middleware/requireAuth';

const router = express.Router();

router.post('/create-session', checkoutController.create_checkout_session);
router.get('/session', checkoutController.read_session);

export default router;
