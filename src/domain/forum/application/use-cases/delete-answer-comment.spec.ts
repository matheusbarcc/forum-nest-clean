import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let answerCommentRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    answerCommentRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(answerCommentRepository)
  })

  it('should be able to delete an answer comment', async () => {
    const answerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answercomment-1'),
    )

    await answerCommentRepository.create(answerComment)

    await sut.execute({
      authorId: 'author-1',
      answerCommentId: 'answercomment-1',
    })

    expect(answerCommentRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an answer comment from another user', async () => {
    const answerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answercomment-1'),
    )

    await answerCommentRepository.create(answerComment)

    const result = await sut.execute({
      authorId: 'author-2',
      answerCommentId: answerComment.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
