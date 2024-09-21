import { Either, right } from '@/core/either'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-respository'

export interface FetchAnswerCommentsRequest {
  answerId: string
  page: number
}

type FetchAnswerCommentsResponse = Either<
  null,
  {
    answerComments: AnswerComment[]
  }
>

export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsRequest): Promise<FetchAnswerCommentsResponse> {
    const answerComments =
      await this.answerCommentRepository.findManyByAnswerId(answerId, {
        page,
      })

    return right({ answerComments })
  }
}
