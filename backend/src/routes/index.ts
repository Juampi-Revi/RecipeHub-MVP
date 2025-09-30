import { Router } from 'express';
import authRoutes from './auth';
import { healthRouter } from './health';
import recipeRoutes from './recipeRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/health', healthRouter);
router.use('/recipes', recipeRoutes);

export default router;