import { apiClient } from './api';

// Types
export interface Comment {
  id: string;
  content: string;
  rating: number;
  isReported: boolean;
  isHidden: boolean;
  reportReason?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  recipeId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  recipe: {
    id: string;
    title: string;
    image?: string;
  };
  replies?: Comment[];
}

export interface CreateCommentRequest {
  content: string;
  rating: number;
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

export interface GetCommentsParams {
  recipeId?: string;
  userId?: string;
  includeReplies?: boolean;
  includeHidden?: boolean;
  page?: number;
  limit?: number;
}

export interface CommentsResponse {
  comments: Comment[];
  total: number;
  page: number;
  totalPages: number;
}

class CommentService {
  private readonly baseUrl = '/comments';

  /**
   * Get comments with optional filters
   */
  async getComments(params: GetCommentsParams = {}): Promise<CommentsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.recipeId) queryParams.append('recipeId', params.recipeId);
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.includeReplies !== undefined) queryParams.append('includeReplies', params.includeReplies.toString());
    if (params.includeHidden !== undefined) queryParams.append('includeHidden', params.includeHidden.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const url = queryParams.toString() ? `${this.baseUrl}?${queryParams.toString()}` : this.baseUrl;
    return await apiClient.get<CommentsResponse>(url);
  }

  /**
   * Get a specific comment by ID
   */
  async getCommentById(id: string): Promise<Comment> {
    return await apiClient.get<Comment>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new comment
   */
  async createComment(data: CreateCommentRequest): Promise<Comment> {
    return await apiClient.post<Comment>(this.baseUrl, data);
  }

  /**
   * Update an existing comment
   */
  async updateComment(id: string, data: UpdateCommentRequest): Promise<Comment> {
    return await apiClient.put<Comment>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Delete a comment
   */
  async deleteComment(id: string): Promise<void> {
    return await apiClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Report a comment as inappropriate
   */
  async reportComment(id: string, data: ReportCommentRequest): Promise<Comment> {
    return await apiClient.post<Comment>(`${this.baseUrl}/${id}/report`, data);
  }

  /**
   * Get current user's comments
   */
  async getMyComments(): Promise<Comment[]> {
    return await apiClient.get<Comment[]>(`${this.baseUrl}/my/list`);
  }

  /**
   * Get comments for a specific recipe
   */
  async getRecipeComments(recipeId: string, includeReplies: boolean = true): Promise<Comment[]> {
    const response = await this.getComments({ 
      recipeId, 
      includeReplies,
      includeHidden: false 
    });
    return response.comments;
  }

  /**
   * Reply to a comment
   */
  async replyToComment(parentId: string, content: string, rating: number, recipeId: string): Promise<Comment> {
    return await this.createComment({
      content,
      rating,
      recipeId,
      parentId
    });
  }
}

export const commentService = new CommentService();
export default commentService;