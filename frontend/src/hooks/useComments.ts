import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '../services/commentService';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import type { 
  CreateCommentRequest, 
  UpdateCommentRequest, 
  ReportCommentRequest,
  GetCommentsParams
} from '../services/commentService';
import type { ApiError } from '../services/api';

// Query keys
export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (params: GetCommentsParams) => [...commentKeys.lists(), params] as const,
  myComments: () => [...commentKeys.all, 'my'] as const,
  recipeComments: (recipeId: string) => [...commentKeys.all, 'recipe', recipeId] as const,
  details: () => [...commentKeys.all, 'detail'] as const,
  detail: (id: string) => [...commentKeys.details(), id] as const,
};

// Hooks for queries
export function useComments(params: GetCommentsParams = {}) {
  return useQuery({
    queryKey: commentKeys.list(params),
    queryFn: () => commentService.getComments(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useComment(id: string) {
  return useQuery({
    queryKey: commentKeys.detail(id),
    queryFn: () => commentService.getCommentById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRecipeComments(recipeId: string, includeReplies: boolean = true) {
  return useQuery({
    queryKey: commentKeys.recipeComments(recipeId),
    queryFn: () => commentService.getRecipeComments(recipeId, includeReplies),
    enabled: !!recipeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useMyComments() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: commentKeys.myComments(),
    queryFn: () => commentService.getMyComments(),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hooks for mutations
export function useCreateComment() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: CreateCommentRequest) => commentService.createComment(data),
    onSuccess: (newComment) => {
      // Invalidate and refetch recipe comments
      queryClient.invalidateQueries({ queryKey: commentKeys.recipeComments(newComment.recipeId) });
      // Invalidate my comments
      queryClient.invalidateQueries({ queryKey: commentKeys.myComments() });
      // Invalidate general comments list
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
      
      success('Comentario agregado exitosamente');
    },
    onError: (err: ApiError) => {
      error(err.message || 'Error al agregar comentario');
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCommentRequest }) => 
      commentService.updateComment(id, data),
    onSuccess: (updatedComment) => {
      // Update the specific comment in cache
      queryClient.setQueryData(commentKeys.detail(updatedComment.id), updatedComment);
      // Invalidate recipe comments
      queryClient.invalidateQueries({ queryKey: commentKeys.recipeComments(updatedComment.recipeId) });
      // Invalidate my comments
      queryClient.invalidateQueries({ queryKey: commentKeys.myComments() });
      
      success('Comentario actualizado exitosamente');
    },
    onError: (err: ApiError) => {
      error(err.message || 'Error al actualizar comentario');
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => commentService.deleteComment(id),
    onSuccess: () => {
      // Remove from all relevant queries
      queryClient.invalidateQueries({ queryKey: commentKeys.all });
      
      success('Comentario eliminado exitosamente');
    },
    onError: (err: ApiError) => {
      error(err.message || 'Error al eliminar comentario');
    },
  });
}

export function useReportComment() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReportCommentRequest }) => 
      commentService.reportComment(id, data),
    onSuccess: (reportedComment) => {
      // Update the specific comment in cache
      queryClient.setQueryData(commentKeys.detail(reportedComment.id), reportedComment);
      // Invalidate recipe comments to show updated state
      queryClient.invalidateQueries({ queryKey: commentKeys.recipeComments(reportedComment.recipeId) });
      
      success('Comentario reportado. En revisión por el equipo de Customer Experience');
    },
    onError: (err: ApiError) => {
      error(err.message || 'Error al reportar comentario');
    },
  });
}

export function useReplyToComment() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ parentId, content, rating, recipeId }: { 
      parentId: string; 
      content: string; 
      rating: number; 
      recipeId: string; 
    }) => commentService.replyToComment(parentId, content, rating, recipeId),
    onSuccess: (newReply) => {
      // Invalidate recipe comments to show new reply
      queryClient.invalidateQueries({ queryKey: commentKeys.recipeComments(newReply.recipeId) });
      // Invalidate my comments
      queryClient.invalidateQueries({ queryKey: commentKeys.myComments() });
      
      success('Respuesta agregada exitosamente');
    },
    onError: (err: ApiError) => {
      error(err.message || 'Error al agregar respuesta');
    },
  });
}

// Utility hooks
export function useCanEditComment(commentUserId: string) {
  const { user } = useAuth();
  return user?.id === commentUserId;
}

export function useCanReportComment(commentUserId: string, recipeUserId: string) {
  const { user } = useAuth();
  // User can report if they are the recipe owner and not the comment author
  return user?.id === recipeUserId && user?.id !== commentUserId;
}