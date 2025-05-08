import { model, Schema, Types } from 'mongoose';
import { IArts, IArtsModules } from './arts.interface';

const artsSchema = new Schema<IArts>(
  {
    title: {
      type: String,
      required: [true, 'Arts title is required'],
    },
    price: {
      type: Number,
      required: [true, 'Arts name is required'],
    },
    category: {
      type: Types.ObjectId,
      ref: 'Categories',
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Arts title is required'],
    },
    image: {
      type: String,
      required: [true, 'Arts title is required'],
    },

    author: { type: String, ref: 'User', require: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

//artsSchema.pre('find', function (next) {
//  //@ts-ignore
//  this.find({ isDeleted: { $ne: true } });
//  next();
//});

//artsSchema.pre('findOne', function (next) {
//@ts-ignore
//this.find({ isDeleted: { $ne: true } });
// next();
//});

artsSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const Arts = model<IArts, IArtsModules>('Arts', artsSchema);
export default Arts;
