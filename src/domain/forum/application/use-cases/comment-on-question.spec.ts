import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { InMemoryQuestionCommentsRepository } from '../../../../../test/repositories/in-memory-question-comments-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionRepository: InMemoryQuestionRepository
let questionCommentRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment On Question', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionRepository = new InMemoryQuestionRepository(
      questionAttachmentsRepository,
    )
    questionCommentRepository = new InMemoryQuestionCommentsRepository()
    sut = new CommentOnQuestionUseCase(
      questionRepository,
      questionCommentRepository,
    )
  })

  it('should be able to comment on a question', async () => {
    const question = makeQuestion({})

    questionRepository.create(question)

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'New comment',
    })

    expect(questionCommentRepository.items[0].content).toEqual('New comment')
  })
})
