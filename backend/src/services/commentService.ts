import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateCommentRequest {
  content: string;
  rating?: number;
  recipeId: string;
  parentId?: string;
}

export interface UpdateCommentRequest {
  content?: string;
  rating?: number;
}

export interface ReportCommentRequest {
  reason: string;
}

export interface CommentWithDetails {
  id: string;
  content: string;
  rating: number | null;
  isReported: boolean;
  isHidden: boolean;
  reportReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  recipeId: string;
  parentId: string | null;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
  recipe: {
    id: string;
    title: string;
    imageUrl: string | null;
  };
  replies: CommentWithDetails[];
  _count: {
    replies: number;
  };
}

export interface GetCommentsParams {
  recipeId?: string;
  userId?: string;
  includeHidden?: boolean;
  page?: number;
  limit?: number;
}

export class CommentService {
  // Get comments for a recipe or user
  async getComments(params: GetCommentsParams) {
    const { recipeId, userId, includeHidden = false, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      parentId: null, // Only get top-level comments
    };

    if (recipeId) {
      where.recipeId = recipeId;
    }

    if (userId) {
      where.userId = userId;
    }

    if (!includeHidden) {
      where.isHidden = false;
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          recipe: {
            select: {
              id: true,
              title: true,
              imageUrl: true,
            },
          },
          replies: {
            where: includeHidden ? {} : { isHidden: false },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
              _count: {
                select: {
                  replies: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
          _count: {
            select: {
              replies: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.comment.count({ where }),
    ]);

    return {
      comments: comments as CommentWithDetails[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get a single comment by ID
  async getCommentById(id: string): Promise<CommentWithDetails | null> {
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        recipe: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
          },
        },
        replies: {
          where: { isHidden: false },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            _count: {
              select: {
                replies: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    return comment as CommentWithDetails | null;
  }

  // Create a new comment
  async createComment(userId: string, data: CreateCommentRequest): Promise<CommentWithDetails> {
    // Validate rating if provided
    if (data.rating && (data.rating < 1 || data.rating > 5)) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Verify recipe exists
    const recipe = await prisma.recipe.findUnique({
      where: { id: data.recipeId },
    });

    if (!recipe) {
      throw new Error('Recipe not found');
    }

    // If it's a reply, verify parent comment exists
    if (data.parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: data.parentId },
      });

      if (!parentComment) {
        throw new Error('Parent comment not found');
      }

      if (parentComment.recipeId !== data.recipeId) {
        throw new Error('Parent comment must belong to the same recipe');
      }

      // Prevent users from replying to their own comments
      if (parentComment.userId === userId) {
        throw new Error('You cannot reply to your own comment');
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        rating: data.rating,
        userId,
        recipeId: data.recipeId,
        parentId: data.parentId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        recipe: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            _count: {
              select: {
                replies: true,
              },
            },
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    return comment as CommentWithDetails;
  }

  // Update a comment
  async updateComment(
    commentId: string,
    userId: string,
    data: UpdateCommentRequest
  ): Promise<CommentWithDetails> {
    // Verify comment exists and belongs to user
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment) {
      throw new Error('Comment not found');
    }

    if (existingComment.userId !== userId) {
      throw new Error('You can only edit your own comments');
    }

    // Validate rating if provided
    if (data.rating && (data.rating < 1 || data.rating > 5)) {
      throw new Error('Rating must be between 1 and 5');
    }

    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content: data.content,
        rating: data.rating,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        recipe: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
          },
        },
        replies: {
          where: { isHidden: false },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            _count: {
              select: {
                replies: true,
              },
            },
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    return comment as CommentWithDetails;
  }

  // Delete a comment
  async deleteComment(commentId: string, userId: string): Promise<void> {
    // Verify comment exists and belongs to user
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!existingComment) {
      throw new Error('Comment not found');
    }

    if (existingComment.userId !== userId) {
      throw new Error('You can only delete your own comments');
    }

    // Delete the comment and all its replies (cascade)
    await prisma.comment.delete({
      where: { id: commentId },
    });
  }

  // Report a comment (only recipe owner can report)
  async reportComment(
    commentId: string,
    reporterId: string,
    data: ReportCommentRequest
  ): Promise<CommentWithDetails> {
    // Get comment with recipe info
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        recipe: {
          select: {
            authorId: true,
          },
        },
      },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    // Only recipe owner can report comments on their recipe
    if (comment.recipe.authorId !== reporterId) {
      throw new Error('Only the recipe owner can report comments');
    }

    // Update comment to reported and hidden
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        isReported: true,
        isHidden: true,
        reportReason: data.reason,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        recipe: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
          },
        },
        replies: {
          where: { isHidden: false },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            _count: {
              select: {
                replies: true,
              },
            },
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    return updatedComment as CommentWithDetails;
  }

  // Get user's comments for "My Comments" page
  async getUserComments(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: {
          userId,
          parentId: null, // Only top-level comments
        },
        include: {
          recipe: {
            select: {
              id: true,
              title: true,
              imageUrl: true,
            },
          },
          _count: {
            select: {
              replies: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.comment.count({
        where: {
          userId,
          parentId: null,
        },
      }),
    ]);

    return {
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const commentService = new CommentService();