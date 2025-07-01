
import { Router } from 'express';
import { colorThemeController } from './colorTheme.controller';

const router = Router();

router.post('/', colorThemeController.createColorTheme);
router.patch('/:id', colorThemeController.updateColorTheme);
router.delete('/:id', colorThemeController.deleteColorTheme);
router.get('/:id', colorThemeController.getColorThemeById);
router.get('/', colorThemeController.getAllColorTheme);

export const colorThemeRoutes = router;