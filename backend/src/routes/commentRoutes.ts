import { Router } from 'express';
import { commentController } from '../controllers/commentController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', commentController.getComments); // GET /api/comments?recipeId=xxx
router.get('/:id', commentController.getCommentById); // GET /api/comments/:id

// Protected routes (require authentication)
router.post('/', authenticate, commentController.createComment); // POST /api/comments
router.put('/:id', authenticate, commentController.updateComment); // PUT /api/comments/:id
router.delete('/:id', authenticate, commentController.deleteComment); // DELETE /api/comments/:id
router.post('/:id/report', authenticate, commentController.reportComment); // POST /api/comments/:id/report
router.get('/my/list', authenticate, commentController.getMyComments); // GET /api/comments/my/list

export default router;