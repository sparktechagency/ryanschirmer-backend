
import { Router } from 'express';
import { artsController } from './arts.controller';

const router = Router();

router.post('/', artsController.createArts);
router.patch('/:id', artsController.updateArts);
router.delete('/:id', artsController.deleteArts);
router.get('/:id', artsController.getArtsById);
router.get('/', artsController.getAllArts);

export const artsRoutes = router;