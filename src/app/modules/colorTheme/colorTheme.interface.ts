
import { Model } from 'mongoose';

export interface IColorTheme {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
}

export type IColorThemeModules = Model<IColorTheme, Record<string, unknown>>;