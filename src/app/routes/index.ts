import { Router } from 'express';
import { otpRoutes } from '../modules/otp/otp.routes';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { notificationRoutes } from '../modules/notification/notificaiton.route';
import { contentsRoutes } from '../modules/contents/contents.route';
import { productsRoutes } from '../modules/products/products.route';
import { categoryRoutes } from './../modules/category/category.route';
import { artsRoutes } from '../modules/arts/arts.route';
import stripeRoute from '../modules/stripe/stripe.route';
import { ordersRoutes } from '../modules/orders/orders.route';
import { bannersRoutes } from '../modules/banners/banners.route';

const router = Router();
const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/otp',
    route: otpRoutes,
  },
  {
    path: '/notifications',
    route: notificationRoutes,
  },
  {
    path: '/contents',
    route: contentsRoutes,
  },
  {
    path: '/products',
    route: productsRoutes,
  },
  {
    path: '/category',
    route: categoryRoutes,
  },
  {
    path: '/arts',
    route: artsRoutes,
  },
  {
    path: '/orders',
    route: ordersRoutes,
  },
  {
    path: '/stripe',
    route: stripeRoute,
  },
  {
    path: '/banners',
    route: bannersRoutes,
  },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
