const parentCommentCache = new Map<number, CommentItem>();

export const setParentCommentCache = (comment: CommentItem) => {
  parentCommentCache.set(comment.id, comment);
};

export const getParentCommentCache = (commentId: number) => {
  return parentCommentCache.get(commentId) || null;
};

export const clearParentCommentCache = (commentId: number) => {
  parentCommentCache.delete(commentId);
};
