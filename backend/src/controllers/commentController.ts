import { Request, Response } from 'express';
import { commentService, CreateCommentRequest, UpdateCommentRequest, ReportCommentRequest } from '../services/commentService';
import { AuthenticatedRequest } from '../middleware/auth';

export class CommentController {
  // GET /api/comments?recipeId=xxx&page=1&limit=10
  async getComments(req: Request, res: Response) {
    try {
      const { recipeId, page = '1', limit = '10' } = req.query;

      if (!recipeId || typeof recipeId !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Recipe ID is required',
        });
      }

      const result = await commentService.getComments({
        recipeId,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      });

      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error getting comments:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get comments',
      });
    }
  }

  // GET /api/comments/:id
  async getCommentById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const comment = await commentService.getCommentById(id);

      if (!comment) {
        return res.status(404).json({
          success: false,
          message: 'Comment not found',
        });
      }

      return res.json({
        success: true,
        data: comment,
      });
    } catch (error) {
      console.error('Error getting comment:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get comment',
      });
    }
  }

  // POST /api/comments
  async createComment(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { content, rating, recipeId, parentId }: CreateCommentRequest = req.body;

      if (!content || !recipeId) {
        return res.status(400).json({
          success: false,
          message: 'Content and recipe ID are required',
        });
      }

      if (content.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Comment content cannot be empty',
        });
      }

      if (rating && (rating < 1 || rating > 5)) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5',
        });
      }

      const comment = await commentService.createComment(userId, {
        content: content.trim(),
        rating,
        recipeId,
        parentId,
      });

      return res.status(201).json({
        success: true,
        data: comment,
      });
    } catch (error) {
      console.error('Error creating comment:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          return res.status(404).json({
            success: false,
            message: error.message,
          });
        }
        
        if (error.message.includes('Rating must be')) {
          return res.status(400).json({
            success: false,
            message: error.message,
          });
        }

        if (error.message.includes('cannot reply to your own comment')) {
          return res.status(403).json({
            success: false,
            message: error.message,
          });
        }
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to create comment',
      });
    }
  }

  // PUT /api/comments/:id
  async updateComment(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const { content, rating }: UpdateCommentRequest = req.body;

      if (!content && rating === undefined) {
        return res.status(400).json({
          success: false,
          message: 'At least content or rating must be provided',
        });
      }

      if (content && content.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Comment content cannot be empty',
        });
      }

      if (rating && (rating < 1 || rating > 5)) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5',
        });
      }

      const updateData: UpdateCommentRequest = {};
      if (content) updateData.content = content.trim();
      if (rating !== undefined) updateData.rating = rating;

      const comment = await commentService.updateComment(id, userId, updateData);

      return res.json({
        success: true,
        data: comment,
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          return res.status(404).json({
            success: false,
            message: error.message,
          });
        }
        
        if (error.message.includes('only edit your own')) {
          return res.status(403).json({
            success: false,
            message: error.message,
          });
        }
        
        if (error.message.includes('Rating must be')) {
          return res.status(400).json({
            success: false,
            message: error.message,
          });
        }
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to update comment',
      });
    }
  }

  // DELETE /api/comments/:id
  async deleteComment(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      await commentService.deleteComment(id, userId);

      return res.json({
        success: true,
        message: 'Comment deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          return res.status(404).json({
            success: false,
            message: error.message,
          });
        }
        
        if (error.message.includes('only delete your own')) {
          return res.status(403).json({
            success: false,
            message: error.message,
          });
        }
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to delete comment',
      });
    }
  }

  // POST /api/comments/:id/report
  async reportComment(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const { reason }: ReportCommentRequest = req.body;

      if (!reason || reason.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Report reason is required',
        });
      }

      const comment = await commentService.reportComment(id, userId, {
        reason: reason.trim(),
      });

      return res.json({
        success: true,
        data: comment,
        message: 'Comment reported successfully',
      });
    } catch (error) {
      console.error('Error reporting comment:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          return res.status(404).json({
            success: false,
            message: error.message,
          });
        }
        
        if (error.message.includes('Only the recipe owner')) {
          return res.status(403).json({
            success: false,
            message: error.message,
          });
        }
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to report comment',
      });
    }
  }

  // GET /api/comments/my?page=1&limit=10
  async getMyComments(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { page = '1', limit = '10' } = req.query;

      const result = await commentService.getUserComments(
        userId,
        parseInt(page as string),
        parseInt(limit as string)
      );

      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error getting user comments:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get user comments',
      });
    }
  }
}

export const commentController = new CommentController();