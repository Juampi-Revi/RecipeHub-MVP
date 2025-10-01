import { useTranslation } from 'react-i18next';
import { useCommentItem } from '../../hooks/useCommentItem';
import { CommentForm } from './CommentForm';
import type { Comment } from '../../services/commentService';

interface CommentItemProps {
  comment: Comment;
  recipeId: string;
  recipeOwnerId: string;
  onDelete: (commentId: string) => void;
  onReport: (commentId: string, reason: string) => void;
  canReply?: boolean;
  isReply?: boolean;
}

export function CommentItem({
  comment,
  recipeId,
  recipeOwnerId,
  onDelete,
  onReport,
  canReply = true,
  isReply = false
}: CommentItemProps) {
  const { t } = useTranslation();
  
  const {
    user,
    isEditing,
    showReplyForm,
    showReportForm,
    reportReason,
    canEdit,
    canReport,
    canReplyToComment,
    handleEdit,
    handleReport,
    handleDelete,
    handleToggleEdit,
    handleToggleReply,
    handleToggleReport,
    handleReplySuccess,
    handleEditCancel,
    handleReportReasonChange
  } = useCommentItem({ comment, recipeOwnerId, onDelete, onReport });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 ${
      comment.isHidden ? 'opacity-60' : ''
    }`}>
      {/* Comment Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
            {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {comment.user?.name || t('comments.anonymousUser')}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(comment.createdAt)}
              {comment.updatedAt !== comment.createdAt && (
                <span className="ml-2">({t('comments.edited')})</span>
              )}
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        {user && (
          <div className="flex items-center space-x-2">
            {canEdit && (
              <button
                onClick={handleToggleEdit}
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm"
              >
                {t('comments.edit')}
              </button>
            )}
            {canEdit && (
              <button
                onClick={handleDelete}
                className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 text-sm"
              >
                {t('comments.delete')}
              </button>
            )}
            {canReport && (
              <button
                onClick={handleToggleReport}
                className="text-gray-500 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400 text-sm"
              >
                {t('comments.report')}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Rating (only for parent comments) */}
      {!isReply && comment.rating && (
        <div className="flex items-center mb-3">
          <div className="flex items-center mr-2">
            {renderStars(comment.rating)}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            ({comment.rating}/5)
          </span>
        </div>
      )}

      {/* Comment Content */}
      {isEditing ? (
        <CommentForm
          recipeId={recipeId}
          initialContent={comment.content}
          initialRating={comment.rating}
          isEditing={true}
          isReply={isReply}
          onSuccess={(content, rating) => content && handleEdit(content, rating)}
          onCancel={handleEditCancel}
        />
      ) : (
        <div className="text-gray-800 dark:text-gray-200 mb-3 whitespace-pre-wrap">
          {comment.content}
        </div>
      )}

      {/* Hidden Comment Notice */}
      {comment.isHidden && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded p-2 mb-3">
          <p className="text-orange-800 dark:text-orange-200 text-sm">
            {t('comments.hiddenNotice')}
          </p>
        </div>
      )}

      {/* Reply Button */}
      {canReply && !isReply && canReplyToComment && (
        <button
          onClick={handleToggleReply}
          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
        >
          {showReplyForm ? t('comments.cancel') : t('comments.reply')}
        </button>
      )}

      {/* Reply Form */}
      {showReplyForm && (
        <div className="mt-3 bg-gray-50 dark:bg-gray-700 rounded p-3">
          <CommentForm
            recipeId={recipeId}
            parentId={comment.id}
            isReply={true}
            onSuccess={handleReplySuccess}
            onCancel={handleToggleReply}
          />
        </div>
      )}

      {/* Report Form */}
      {showReportForm && (
        <div className="mt-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3">
          <form onSubmit={handleReport} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                {t('comments.reportReason')}
              </label>
              <select
                value={reportReason}
                onChange={handleReportReasonChange}
                className="w-full px-3 py-2 border border-red-300 dark:border-red-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              >
                <option value="">{t('comments.selectReason')}</option>
                <option value="spam">{t('comments.reasons.spam')}</option>
                <option value="inappropriate">{t('comments.reasons.inappropriate')}</option>
                <option value="harassment">{t('comments.reasons.harassment')}</option>
                <option value="misinformation">{t('comments.reasons.misinformation')}</option>
                <option value="other">{t('comments.reasons.other')}</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                {t('comments.submitReport')}
              </button>
              <button
                type="button"
                onClick={handleToggleReport}
                className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                {t('comments.cancel')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}