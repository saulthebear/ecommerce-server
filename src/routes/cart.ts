import express from 'express';
import cartController from '../controllers/cart';
import { requireLogin } from '../middleware/requireAuth';

const router = express.Router();

router.put('/', requireLogin, cartController.update);
router.get('/', requireLogin, cartController.read);

export default router;
