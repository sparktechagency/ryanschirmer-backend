import { model, Schema } from 'mongoose';
import { IBanners, IBannersModules } from './banners.interface';

const bannersSchema = new Schema<IBanners>(
  {
    category: {
      type: String,
      enum: [
        'sign_in_left',
        'sign_in_right',
        'sign_up_left_top',
        'sign_up_left_bottom',
        'sign_up_right_top',
        'sign_up_right_bottom',
      ],
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

bannersSchema.statics.isExistByCategory = async (category: string) =>
  await Banners.findOne({ category });
const Banners = model<IBanners, IBannersModules>('Banners', bannersSchema);
export default Banners;
