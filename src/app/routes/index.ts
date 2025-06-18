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
    route: productsRoutes
  },
  {
    path:'/category',
    route:categoryRoutes 
  },
  {
    path:'/arts',
    route: artsRoutes
  },
  {
    path:'/stripe',
    route: stripeRoute
  }
];
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
