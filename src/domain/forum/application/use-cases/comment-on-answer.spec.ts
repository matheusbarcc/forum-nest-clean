import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answerRepository: InMemoryAnswerRepository
let answerCommentRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment On Answer', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answerRepository = new InMemoryAnswerRepository(answerAttachmentsRepository)
    answerCommentRepository = new InMemoryAnswerCommentsRepository()
    sut = new CommentOnAnswerUseCase(answerRepository, answerCommentRepository)
  })

  it('should be able to comment on a answer', async () => {
    const answer = makeAnswer({})

    answerRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: 'New comment',
    })

    expect(answerCommentRepository.items[0].content).toEqual('New comment')
  })
})
