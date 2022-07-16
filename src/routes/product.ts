import express from 'express';
import productController from '../controllers/product';
import reviewController from '../controllers/review';

const router = express.Router();

router.get('/', productController.readAll);
router.get('/:id', productController.read);
router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.destroy);

router.post('/:productId/reviews', reviewController.create);
router.put('/:productId/reviews/:reviewId', reviewController.update);
router.delete('/:productId/reviews/:reviewId', reviewController.destroy);

export default router;
