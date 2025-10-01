import { useTranslation } from 'react-i18next';
import { useCommentList } from '../../hooks/useCommentList';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';

interface CommentListProps {
  recipeId: string;
  recipeOwnerId: string;
  className?: string;
}

export function CommentList({ recipeId, recipeOwnerId, className = '' }: CommentListProps) {
  const { t } = useTranslation();
  
  const {
    user,
    showCommentForm,
    isLoading,
    error,
    parentComments,
    repliesByParent,
    handleDeleteComment,
    handleReportComment,
    handleCommentAdded,
    handleToggleCommentForm,
    refetch
  } = useCommentList({ recipeId, recipeOwnerId });

  if (isLoading) {
    return (
      <div className={`flex justify-center py-8 ${className}`}>
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <ErrorMessage 
          message={t('comments.loadError')}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t('comments.title')} ({parentComments.length})
        </h3>
        
        {user && (
          <button
          onClick={handleToggleCommentForm}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
            {showCommentForm ? t('comments.cancel') : t('comments.addComment')}
          </button>
        )}
      </div>

      {/* Comment Form */}
      {showCommentForm && user && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <CommentForm
            recipeId={recipeId}
            onSuccess={handleCommentAdded}
            onCancel={handleToggleCommentForm}
          />
        </div>
      )}

      {/* Comments List */}
      {parentComments.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 dark:text-gray-400 mb-4">
            {t('comments.noComments')}
          </div>
          {!user && (
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {t('comments.loginToComment')}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {parentComments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              <CommentItem
                comment={comment}
                recipeId={recipeId}
                recipeOwnerId={recipeOwnerId}
                onDelete={handleDeleteComment}
                onReport={handleReportComment}
                canReply={!!user}
              />
              
              {/* Replies */}
              {repliesByParent[comment.id] && (
                <div className="ml-8 space-y-3 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                  {repliesByParent[comment.id].map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      recipeId={recipeId}
                      recipeOwnerId={recipeOwnerId}
                      onDelete={handleDeleteComment}
                      onReport={handleReportComment}
                      isReply={true}
                      canReply={false}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Login prompt for non-authenticated users */}
      {!user && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
          <p className="text-blue-800 dark:text-blue-200 mb-2">
            {t('comments.loginPrompt')}
          </p>
          <a
            href="/login"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            {t('auth.login')}
          </a>
        </div>
      )}
    </div>
  );
}