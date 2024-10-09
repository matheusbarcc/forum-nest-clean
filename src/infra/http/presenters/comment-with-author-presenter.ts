import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class CommentWithAuthorPresenter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toHTTP(comment: CommentWithAuthor) {
    return {
      commentId: comment.commentId.toString(),
      content: comment.content,
      authorId: comment.authorId.toString(),
      authorName: comment.author,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }
  }
}
