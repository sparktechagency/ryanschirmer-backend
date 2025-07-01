
import { model, Schema } from 'mongoose';
import { IColorTheme, IColorThemeModules } from './colorTheme.interface';

const colorThemeSchema = new Schema<IColorTheme>(
  {
    
  },
  {
    timestamps: true,
  }
);

 
const ColorTheme = model<IColorTheme, IColorThemeModules>(
  'ColorTheme',
  colorThemeSchema
);
export default ColorTheme;