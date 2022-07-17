import express from 'express';
import categoryController from '../controllers/category';
import { requireAdmin } from '../middleware/requireAuth';

const router = express.Router();

router.post('/', requireAdmin, categoryController.create);
router.get('/', categoryController.readAll);
router.get('/:id', categoryController.read);
router.put('/:id', requireAdmin, categoryController.update);
router.delete('/:id', requireAdmin, categoryController.destroy);

export default router;
