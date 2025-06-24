import { Model } from 'mongoose';

export interface IBanners {
  _id?: string;
  category: string;
  image: string;
}

export interface IBannersModules
  extends Model<IBanners, Record<string, unknown>> {
  isExistByCategory(category: string): Promise<IBanners>;
}
