import { Router } from 'express';
import { ordersController } from './orders.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post('/', auth(USER_ROLE.user), ordersController.createOrders);
router.patch(
  '/:id',
  auth(USER_ROLE.user, USER_ROLE.seller, USER_ROLE.admin),
  ordersController.updateOrders,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.seller),
  ordersController.deleteOrders,
);
router.get(
  '/:id',
  auth(USER_ROLE.user, USER_ROLE.seller, USER_ROLE.admin),
  ordersController.getOrdersById,
);
router.get(
  '/',
  auth(USER_ROLE.user, USER_ROLE.seller, USER_ROLE.admin),
  ordersController.getAllOrders,
);

export const ordersRoutes = router;
