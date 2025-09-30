import { Router } from 'express';
import { getIngredients, getIngredientById } from '../controllers/ingredientController';

const router = Router();

// GET /api/ingredients - Get all ingredients
router.get('/', getIngredients);

// GET /api/ingredients/:id - Get ingredient by ID
router.get('/:id', getIngredientById);

export default router;