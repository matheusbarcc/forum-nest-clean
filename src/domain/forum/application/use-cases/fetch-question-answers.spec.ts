import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answerRepository: InMemoryAnswerRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answerRepository = new InMemoryAnswerRepository(answerAttachmentsRepository)
    sut = new FetchQuestionAnswersUseCase(answerRepository)
  })

  it('should be able to fetch question answers', async () => {
    answerRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-1') }),
    )
    answerRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-1') }),
    )
    answerRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-1') }),
    )

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.value?.answers).toHaveLength(3)
  })

  it('should be able to fetch paginated question answers', async () => {
    for (let i = 1; i <= 22; i++) {
      answerRepository.create(
        makeAnswer({ questionId: new UniqueEntityID('question-1') }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.value?.answers).toHaveLength(2)
  })
})
