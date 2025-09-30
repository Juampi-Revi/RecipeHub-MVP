import { Router, Request, Response } from 'express';

const router = Router();

interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
}

router.get('/', (req: Request, res: Response): void => {
  const healthData: HealthResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  };

  res.status(200).json({
    success: true,
    data: healthData,
  });
});

export { router as healthRouter };