import { Router } from 'express';
import authRoutes from './auth';
import { healthRouter } from './health';
import recipeRoutes from './recipeRoutes';
import categoryRoutes from './categoryRoutes';
import ingredientRoutes from './ingredientRoutes';
import commentRoutes from './commentRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/health', healthRouter);
router.use('/recipes', recipeRoutes);
router.use('/categories', categoryRoutes);
router.use('/ingredients', ingredientRoutes);
router.use('/comments', commentRoutes);

export default router;