import express from 'express';
import productController from '../controllers/product';
import reviewController from '../controllers/review';
import { requireAdmin, requireLogin } from '../middleware/requireAuth';

const router = express.Router();

router.get('/', productController.readAll);
router.get('/:id', productController.read);
router.post('/', requireAdmin, productController.create);
router.put('/:id', requireAdmin, productController.update);
router.delete('/:id', requireAdmin, productController.destroy);

router.post('/:productId/reviews', requireLogin, reviewController.create);
router.put(
  '/:productId/reviews/:reviewId',
  requireLogin,
  reviewController.update
);
router.delete(
  '/:productId/reviews/:reviewId',
  requireLogin,
  reviewController.destroy
);

export default router;
