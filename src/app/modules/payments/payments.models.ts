import { model, Schema } from 'mongoose';
import { IPayments, IPaymentsModules } from './payments.interface';

const paymentsSchema = new Schema<IPayments>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Orders', required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'canceled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['stripe'],
      default: 'stripe',
    },
    sellerAmount: {
      type: Number,
    },
    adminAmount: {
      type: Number,
    },
    tranId: { type: String, unique: true, sparse: true },
    paymentIntentId: { type: String, unique: true, sparse: true },
    isTransfer: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

paymentsSchema.pre('save', function (next) {
  if (this.amount) {
    this.sellerAmount = this.amount * 0.9; // Assuming 10% admin fee
    this.adminAmount = this.amount * 0.1; // Assuming 10% admin fee
  }
  next();
});

const Payments = model<IPayments, IPaymentsModules>('Payments', paymentsSchema);
export default Payments;
