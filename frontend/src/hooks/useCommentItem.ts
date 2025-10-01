import { useState } from 'react';
import { useAuth } from './useAuth';
import { useUpdateComment, useCanEditComment, useCanReportComment } from './useComments';
import type { Comment } from '../services/commentService';

interface UseCommentItemProps {
  comment: Comment;
  recipeOwnerId: string;
  onDelete: (commentId: string) => void;
  onReport: (commentId: string, reason: string) => void;
}

export function useCommentItem({ comment, recipeOwnerId, onDelete, onReport }: UseCommentItemProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const updateCommentMutation = useUpdateComment();
  const canEdit = useCanEditComment(comment.userId);
  const canReport = useCanReportComment(comment.userId, recipeOwnerId);

  const handleEdit = async (content: string, rating?: number) => {
    await updateCommentMutation.mutateAsync({
      id: comment.id,
      data: { content, rating }
    });
    setIsEditing(false);
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reportReason.trim()) {
      await onReport(comment.id, reportReason);
      setShowReportForm(false);
      setReportReason('');
    }
  };

  const handleDelete = () => {
    onDelete(comment.id);
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleToggleReply = () => {
    setShowReplyForm(!showReplyForm);
  };

  const handleToggleReport = () => {
    setShowReportForm(!showReportForm);
    if (!showReportForm) {
      setReportReason('');
    }
  };

  const handleReplySuccess = () => {
    setShowReplyForm(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleReportReasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReportReason(e.target.value);
  };

  // Check if user can reply to this comment
  const canReplyToComment = user && user.id !== comment.userId;

  return {
    // State
    user,
    isEditing,
    showReplyForm,
    showReportForm,
    reportReason,
    canEdit,
    canReport,
    canReplyToComment,
    
    // Actions
    handleEdit,
    handleReport,
    handleDelete,
    handleToggleEdit,
    handleToggleReply,
    handleToggleReport,
    handleReplySuccess,
    handleEditCancel,
    handleReportReasonChange
  };
}