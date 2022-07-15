import express from 'express';
import controller from '../controllers/user';
import extractFirebaseInfo from '../middleware/extractFirebaseInfo';

const router = express.Router();

router.get('/validate', extractFirebaseInfo, controller.validate);
router.get('/:id', controller.read);
router.post('/', extractFirebaseInfo, controller.create);
router.post('/login', extractFirebaseInfo, controller.login);
router.get('/', controller.readAll);

export default router;
