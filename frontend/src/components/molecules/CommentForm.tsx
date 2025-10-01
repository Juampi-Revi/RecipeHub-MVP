import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateComment, useReplyToComment } from '../../hooks/useComments';

interface CommentFormProps {
  recipeId: string;
  parentId?: string;
  initialContent?: string;
  initialRating?: number;
  isEditing?: boolean;
  isReply?: boolean;
  onSuccess: (content?: string, rating?: number) => void;
  onCancel: () => void;
}

export function CommentForm({
  recipeId,
  parentId,
  initialContent = '',
  initialRating,
  isEditing = false,
  isReply = false,
  onSuccess,
  onCancel
}: CommentFormProps) {
  const { t } = useTranslation();
  const [content, setContent] = useState(initialContent);
  const [rating, setRating] = useState(initialRating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const createCommentMutation = useCreateComment();
  const replyToCommentMutation = useReplyToComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;

    try {
      if (isEditing) {
        // For editing, call the onSuccess callback with the new values
        onSuccess(content, isReply ? undefined : rating);
      } else if (parentId) {
        // Creating a reply
        await replyToCommentMutation.mutateAsync({
          parentId,
          content: content.trim(),
          rating: 0,
          recipeId
        });
        onSuccess();
      } else {
        // Creating a new comment
        await createCommentMutation.mutateAsync({
          recipeId,
          content: content.trim(),
          rating: rating || 0
        });
        onSuccess();
      }
      
      // Reset form
      setContent('');
      setRating(0);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const renderStarRating = () => {
    if (isReply) return null;

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('comments.rating')} {rating > 0 && `(${rating}/5)`}
        </label>
        <div className="flex items-center space-x-1">
          {Array.from({ length: 5 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHoveredRating(i + 1)}
              onMouseLeave={() => setHoveredRating(0)}
              className={`text-2xl transition-colors ${
                i < (hoveredRating || rating)
                  ? 'text-yellow-400 hover:text-yellow-500'
                  : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
              }`}
            >
              ★
            </button>
          ))}
          {rating > 0 && (
            <button
              type="button"
              onClick={() => setRating(0)}
              className="ml-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {t('comments.clearRating')}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Star Rating (only for parent comments) */}
      {renderStarRating()}

      {/* Comment Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {isReply ? t('comments.replyPlaceholder') : t('comments.commentPlaceholder')}
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            isReply 
              ? t('comments.replyPlaceholder')
              : t('comments.commentPlaceholder')
          }
          rows={isReply ? 3 : 4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
          required
          maxLength={1000}
        />
        <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
          {content.length}/1000
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {t('comments.cancel')}
        </button>
        <button
          type="submit"
          disabled={!content.trim() || createCommentMutation.isPending || replyToCommentMutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {createCommentMutation.isPending || replyToCommentMutation.isPending
            ? t('comments.submitting')
            : isEditing
            ? t('comments.updateComment')
            : isReply
            ? t('comments.submitReply')
            : t('comments.submitComment')
          }
        </button>
      </div>
    </form>
  );
}