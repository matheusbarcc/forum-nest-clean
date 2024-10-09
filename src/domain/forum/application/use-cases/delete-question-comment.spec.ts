import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'

let questionCommentRepository: InMemoryQuestionCommentsRepository
let studentsRepository: InMemoryStudentRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
  beforeEach(() => {
    studentsRepository = new InMemoryStudentRepository()
    questionCommentRepository = new InMemoryQuestionCommentsRepository(
      studentsRepository,
    )
    sut = new DeleteQuestionCommentUseCase(questionCommentRepository)
  })

  it('should be able to delete a question comment', async () => {
    const newQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('questioncomment-1'),
    )

    await questionCommentRepository.create(newQuestionComment)

    await sut.execute({
      authorId: 'author-1',
      questionCommentId: 'questioncomment-1',
    })

    expect(questionCommentRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question comment from another user', async () => {
    const newQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('questioncomment-1'),
    )

    await questionCommentRepository.create(newQuestionComment)

    const result = await sut.execute({
      authorId: 'author-2',
      questionCommentId: 'questioncomment-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
