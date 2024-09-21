import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Either, right } from '@/core/either'

export interface FetchRecentQuestionsRequest {
  page: number
}

type FetchRecentQuestionsResponse = Either<
  null,
  {
    questions: Question[]
  }
>

export class FetchRecentQuestionsUseCase {
  constructor(private questionRepository: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsRequest): Promise<FetchRecentQuestionsResponse> {
    const questions = await this.questionRepository.findManyRecent({ page })

    return right({ questions })
  }
}
