import { AnswersRepository } from '../repositories/answers-repository'
import { Answer } from '../../enterprise/entities/answer'
import { Either, right } from '@/core/either'

export interface FetchQuestionAnswersRequest {
  questionId: string
  page: number
}

type FetchQuestionAnswersResponse = Either<
  null,
  {
    answers: Answer[]
  }
>

export class FetchQuestionAnswersUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionAnswersRequest): Promise<FetchQuestionAnswersResponse> {
    const answers = await this.answerRepository.findManyByQuestionId(
      questionId,
      { page },
    )

    return right({ answers })
  }
}
