import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, type ApiError } from '../services/api';
import { useToast } from './useToast';

export interface UserComment {
  id: number;
  content: string;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
  recipe: {
    id: number;
    title: string;
    image: string;
  };
}

export interface UserCommentsResponse {
  comments: UserComment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useUserComments(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['user-comments', page, limit],
    queryFn: async (): Promise<UserCommentsResponse> => {
      return await apiClient.get<UserCommentsResponse>(`/comments/my/list?page=${page}&limit=${limit}`);
    },
  });
}

export function useDeleteUserComment() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: async (commentId: number) => {
      return await apiClient.delete(`/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-comments'] });
      success('Comment deleted successfully');
    },
    onError: (err: ApiError) => {
      const message = err.message || 'Failed to delete comment';
      error(message);
    },
  });
}