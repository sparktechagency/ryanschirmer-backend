import httpStatus from 'http-status';
import { IPayments } from './payments.interface';
import Payments from './payments.models';
import AppError from '../../error/AppError';
import config from '../../config';
import { startSession } from 'mongoose';
import { PAYMENT_STATUS } from './payments.constants';
import { User } from '../user/user.models';
import { USER_ROLE } from '../user/user.constants';
import { notificationServices } from '../notification/notification.service';
import { modeType } from '../notification/notification.interface';
import generateCryptoString from '../../utils/generateCryptoString';
import Orders from '../orders/orders.models';
import { IOrders } from '../orders/orders.interface';
import StripeService from '../../class/stripe/stripe';
import QueryBuilder from '../../class/builder/QueryBuilder';
import { Response } from 'express';
import moment from 'moment';

const checkout = async (payload: IPayments) => {
  const tranId = generateCryptoString(10);
  let paymentData: IPayments;

  const order: IOrders | null = await Orders?.findById(payload?.order).populate(
    'items.product',
  );
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order Not Found!');
  }

  const isExistPayment: IPayments | null = await Payments.findOne({
    order: payload?.order,
    status: 'pending',
    user: payload?.user,
  });

  if (isExistPayment) {
    const payment = await Payments.findByIdAndUpdate(
      isExistPayment?._id,
      { tranId },
      { new: true },
    );

    paymentData = payment as IPayments;
  } else {
    payload.tranId = tranId;
    payload.author = order?.author;
    payload.amount = order?.totalPrice;

    const createdPayment = await Payments.create(payload);

    if (!createdPayment) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to create payment',
      );
    }
    paymentData = createdPayment;
  }

  if (!paymentData)
    throw new AppError(httpStatus.BAD_REQUEST, 'payment not found');

  const product = {
    amount: paymentData?.amount,
    //@ts-ignore
    name: order?.items[0]?.product?.title || 'Product Payment',
    quantity: 1,
  };
  let customerId = '';
  const user = await User.IsUserExistId(paymentData?.user?.toString());
  if (user?.customerId) {
    customerId = user?.customerId;
  } else {
    const customer = await StripeService.createCustomer(
      user?.email,
      user?.name,
    );
    customerId = customer?.id;
  }

  const success_url = `${config.server_url}/payments/confirm-payment?sessionId={CHECKOUT_SESSION_ID}&paymentId=${paymentData?._id}`;

  const cancel_url = `${config.server_url}/payments/confirm-payment?sessionId={CHECKOUT_SESSION_ID}&paymentId=${paymentData?._id}`;
  console.log({
    success_url,
    cancel_url,
  });
  const checkoutSession = await StripeService.getCheckoutSession(
    product,
    success_url,
    cancel_url,
    customerId,
  );

  return checkoutSession?.url;
};

const confirmPayment = async (query: Record<string, any>, res: Response) => {
  const { sessionId, paymentId } = query;
  const session = await startSession();
  const PaymentSession = await StripeService.getPaymentSession(sessionId);
  const paymentIntentId = PaymentSession.payment_intent as string;

  if (!(await StripeService.isPaymentSuccess(sessionId))) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Payment session is not completed',
    );
  }

  try {
    session.startTransaction();
    const payment = await Payments.findByIdAndUpdate(
      paymentId,
      { status: PAYMENT_STATUS?.paid, paymentIntentId: paymentIntentId },
      { new: true, session },
    ).populate([
      { path: 'user', select: 'name _id email phoneNumber profile ' },
      { path: 'author', select: 'name _id email phoneNumber profile' },
    ]);

    if (!payment) {
      throw new AppError(httpStatus.NOT_FOUND, 'Payment Not Found!');
    }
    const order = await Orders.findByIdAndUpdate(
      payment?.order,
      {
        isPaid: true,
        tranId: payment?.tranId,
      },
      { new: true, session },
    );

    const admin = await User.findOne({ role: USER_ROLE.admin });

    notificationServices.insertNotificationIntoDb({
      receiver: admin?._id, // User
      message: 'A new payment has been processed.',
      description: `Payment ID #${payment._id} has been completed for Order #${order?.id}.`,
      refference: payment?._id,
      model_type: modeType?.Payments,
    });
    notificationServices.insertNotificationIntoDb({
      receiver: order?.author?.toString(),
      message: 'You received a new payment!',
      description: `You’ve received a payment for Order #${order?._id}.`,
      refference: payment?._id,
      model_type: modeType?.Payments,
    });
    notificationServices.insertNotificationIntoDb({
      receiver: order?.user?.toString(), // System Admin
      message: 'Your payment was successful!',
      description: `Your payment for Order #${order?._id} has been successfully processed.`,
      refference: payment?._id,
      model_type: modeType?.Payments,
    });

    await session.commitTransaction();
    return payment;
  } catch (error: any) {
    await session.abortTransaction();

    if (paymentIntentId) {
      try {
        await StripeService.refund(paymentIntentId);
      } catch (refundError: any) {
        console.error('Error processing refund:', refundError.message);
      }
    }
    res.redirect(
      `${config.client_Url}/payment-failed/?errorMessage=${error.message}`,
    );
    throw new AppError(httpStatus.BAD_GATEWAY, error.message);
  } finally {
    session.endSession();
  }
};

const dashboardData = async (query: Record<string, any>) => {
  const today = moment().startOf('day');
  const incomeYear = query.incomeYear
    ? Number(query.incomeYear)
    : moment().year();
  const userYear = query.JoinYear ? Number(query.JoinYear) : moment().year();

  const [usersData, earningsData, monthlyIncomeData, monthlyUserData] =
    await Promise.all([
      // User data aggregation
      User.aggregate([
        {
          $facet: {
            totalUsers: [
              {
                $match: {
                  'verification.status': true,
                  role: { $ne: USER_ROLE.admin },
                },
              },
              { $count: 'count' },
            ],
            userDetails: [
              {
                $match: { role: { $ne: USER_ROLE.admin } },
              },
              {
                $project: {
                  _id: 1,
                  name: 1,
                  email: 1,
                  status: 1,
                  phoneNumber: 1,
                  image: 1, 
                  role: 1,
                  createdAt: 1,
                },
              },
              {
                $sort: { createdAt: -1 },
              },
              {
                $limit: 15,
              },
            ],
          },
        },
      ]),

      // Earnings aggregation (including today's income)
      Payments.aggregate([
        {
          $match: { status: 'paid' },
        },
        {
          $facet: {
            totalEarnings: [
              {
                $group: {
                  _id: null,
                  total: { $sum: '$adminAmount' },
                },
              },
            ],
            todayEarnings: [
              {
                $match: {
                  createdAt: {
                    $gte: today.toDate(),
                    $lte: moment().endOf('day').toDate(),
                  },
                },
              },
              {
                $group: {
                  _id: null,
                  total: { $sum: '$adminAmount' },
                },
              },
            ],
          },
        },
      ]),

      // Monthly income aggregation
      Payments.aggregate([
        {
          $match: {
            status: 'paid',
            createdAt: {
              $gte: moment().year(incomeYear).startOf('year').toDate(),
              $lte: moment().year(incomeYear).endOf('year').toDate(),
            },
          },
        },
        {
          $group: {
            _id: { month: { $month: '$createdAt' } },
            income: { $sum: '$adminAmount' },
          },
        },
        {
          $sort: { '_id.month': 1 },
        },
      ]),

      // Monthly users aggregation
      User.aggregate([
        {
          $match: {
            'verification.status': true,
            createdAt: {
              $gte: moment().year(userYear).startOf('year').toDate(),
              $lte: moment().year(userYear).endOf('year').toDate(),
            },
          },
        },
        {
          $group: {
            _id: { month: { $month: '$createdAt' } },
            total: { $sum: 1 },
          },
        },
        {
          $sort: { '_id.month': 1 },
        },
      ]),
    ]);

  // Format monthly income
  const formattedMonthlyIncome = Array.from({ length: 12 }, (_, i) => ({
    month: moment().month(i).format('MMM'),
    income: 0,
  }));
  monthlyIncomeData.forEach(entry => {
    formattedMonthlyIncome[entry._id.month - 1].income = Math.round(
      entry.income,
    );
  });

  // Format monthly users
  const formattedMonthlyUsers = Array.from({ length: 12 }, (_, i) => ({
    month: moment().month(i).format('MMM'),
    total: 0,
  }));
  monthlyUserData.forEach(entry => {
    formattedMonthlyUsers[entry._id.month - 1].total = Math.round(entry.total);
  });

  return {
    totalUsers: usersData[0]?.totalUsers[0]?.count || 0,
    totalIncome: earningsData[0]?.totalEarnings[0]?.total || 0,
    todayIncome: earningsData[0]?.todayEarnings[0]?.total || 0,
    monthlyIncome: formattedMonthlyIncome,
    monthlyUsers: formattedMonthlyUsers,
    userDetails: usersData[0]?.userDetails || [],
  };
};

const createPayments = async (payload: IPayments) => {
  const result = await Payments.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create payments');
  }
  return result;
};

const getAllPayments = async (query: Record<string, any>) => {
  query['isDeleted'] = false;
  const paymentsModel = new QueryBuilder(Payments.find(), query)
    .search([''])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await paymentsModel.modelQuery;
  const meta = await paymentsModel.countTotal();

  return {
    data,
    meta,
  };
};

const getPaymentsById = async (id: string) => {
  const result = await Payments.findById(id);
  if (!result || result?.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Payments not found!');
  }
  return result;
};

const updatePayments = async (id: string, payload: Partial<IPayments>) => {
  const result = await Payments.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update Payments');
  }
  return result;
};

const deletePayments = async (id: string) => {
  const result = await Payments.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete payments');
  }
  return result;
};

export const paymentsService = {
  createPayments,
  getAllPayments,
  getPaymentsById,
  updatePayments,
  deletePayments,
  checkout,
  confirmPayment,
  dashboardData,
};
