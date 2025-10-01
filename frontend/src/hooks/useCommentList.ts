import { useState } from 'react';
import { useAuth } from './useAuth';
import { useRecipeComments, useDeleteComment, useReportComment } from './useComments';
import { useTranslation } from 'react-i18next';
import type { Comment } from '../services/commentService';

interface UseCommentListProps {
  recipeId: string;
  recipeOwnerId: string;
}

export function useCommentList({ recipeId, recipeOwnerId }: UseCommentListProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [showCommentForm, setShowCommentForm] = useState(false);
  
  const { 
    data: comments = [], 
    isLoading, 
    error,
    refetch 
  } = useRecipeComments(recipeId);
  
  const deleteCommentMutation = useDeleteComment();
  const reportCommentMutation = useReportComment();

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm(t('comments.confirmDelete'))) {
      await deleteCommentMutation.mutateAsync(commentId);
      refetch();
    }
  };

  const handleReportComment = async (commentId: string, reason: string) => {
    await reportCommentMutation.mutateAsync({ id: commentId, data: { reason } });
    refetch();
  };

  const handleCommentAdded = () => {
    setShowCommentForm(false);
    refetch();
  };

  const handleToggleCommentForm = () => {
    setShowCommentForm(!showCommentForm);
  };

  const visibleComments = comments.filter(comment => {
    if (user?.id === recipeOwnerId) return true;
    if (user?.id === comment.userId) return true;
    return !comment.isHidden;
  });

  const parentComments = visibleComments.filter(comment => !comment.parentId);
  const repliesByParent = visibleComments.reduce((acc, comment) => {
    if (comment.parentId) {
      if (!acc[comment.parentId]) {
        acc[comment.parentId] = [];
      }
      acc[comment.parentId].push(comment);
    }
    return acc;
  }, {} as Record<string, Comment[]>);

  return {
    // State
    user,
    showCommentForm,
    isLoading,
    error,
    parentComments,
    repliesByParent,
    
    // Actions
    handleDeleteComment,
    handleReportComment,
    handleCommentAdded,
    handleToggleCommentForm,
    refetch
  };
}