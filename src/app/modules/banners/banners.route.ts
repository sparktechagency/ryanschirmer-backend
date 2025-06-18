import { Router } from 'express';
import { bannersController } from './banners.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middleware/parseData';

const router = Router();
const storage = memoryStorage();
const uploads = multer({ storage });
router.post(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  uploads.single("image"),
  parseData(),
  bannersController.createBanners,
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  uploads.single('image'),
  parseData(),
  bannersController.updateBanners,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  bannersController.deleteBanners,
);
router.get('/:id', bannersController.getBannersById);
router.get('/', bannersController.getAllBanners);

export const bannersRoutes = router;
