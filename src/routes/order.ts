import express from 'express';
import orderController from '../controllers/order';
import { requireLogin, requireAdmin } from '../middleware/requireAuth';

const router = express.Router();

router.post('/', requireLogin, orderController.create);
router.get('/', requireAdmin, orderController.readAll);
router.get('/:id', requireLogin, orderController.read);
router.put('/:id', requireLogin, orderController.update);
router.delete('/:id', requireAdmin, orderController.destroy);

export default router;
