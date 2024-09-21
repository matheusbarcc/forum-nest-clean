import { Either, right } from '@/core/either'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

export interface FetchQuestionCommentsRequest {
  questionId: string
  page: number
}

type FetchQuestionCommentsResponse = Either<
  null,
  {
    questionComments: QuestionComment[]
  }
>

export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsRequest): Promise<FetchQuestionCommentsResponse> {
    const questionComments =
      await this.questionCommentRepository.findManyByQuestionId(questionId, {
        page,
      })

    return right({ questionComments })
  }
}
