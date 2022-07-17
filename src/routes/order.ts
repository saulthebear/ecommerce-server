import express from 'express';
import orderController from '../controllers/order';

const router = express.Router();

router.post('/', orderController.create);
router.get('/', orderController.readAll);
router.get('/:id', orderController.read);
router.put('/:id', orderController.update);
router.delete('/:id', orderController.destroy);

export default router;
