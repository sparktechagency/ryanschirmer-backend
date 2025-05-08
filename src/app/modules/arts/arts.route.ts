import { Router } from 'express';
import { artsController } from './arts.controller';
import { USER_ROLE } from '../user/user.constants';
import multer, { memoryStorage } from 'multer';
import auth from '../../middleware/auth';
import parseData from '../../middleware/parseData';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/',
  auth(USER_ROLE.seller),
  upload.single('image'),
  parseData(),
  artsController.createArts,
);
router.patch(
  '/:id',
  auth(USER_ROLE.seller),
  upload.single('image'),
  parseData(),

  artsController.updateArts,
);
router.delete(
  '/:id',
  auth(USER_ROLE.seller, USER_ROLE.admin),
  artsController.deleteArts,
);
router.get('/my-arts', auth(USER_ROLE.seller), artsController.getArtsById);
router.get('/:id', artsController.getArtsById);
router.get('/', artsController.getAllArts);

export const artsRoutes = router;
