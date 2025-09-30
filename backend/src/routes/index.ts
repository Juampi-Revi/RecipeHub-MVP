import { Router } from 'express';
import authRoutes from './auth';
import { healthRouter } from './health';

const router = Router();

router.use('/auth', authRoutes);
router.use('/health', healthRouter);

export default router;