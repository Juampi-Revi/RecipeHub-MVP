import { Router } from 'express';
import { getCategories, getCategoryById } from '../controllers/categoryController';

const router = Router();

// GET /api/categories - Get all categories
router.get('/', getCategories);

// GET /api/categories/:id - Get category by ID
router.get('/:id', getCategoryById);

export default router;