import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(answerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    answerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )

    answerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )

    answerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('should be able to fetch paginated answer comments', async () => {
    for (let i = 1; i <= 22; i++) {
      answerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.value?.answerComments).toHaveLength(2)
  })
})
