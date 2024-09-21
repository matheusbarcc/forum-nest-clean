import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { EditQuestionUseCase } from './edit-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let questionRepository: InMemoryQuestionRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionRepository = new InMemoryQuestionRepository(
      questionAttachmentsRepository,
    )
    sut = new EditQuestionUseCase(
      questionRepository,
      questionAttachmentsRepository,
    )
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await questionRepository.create(newQuestion)

    questionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: 'author-1',
      title: 'New title',
      content: 'New content',
      attachmentsIds: ['1', '3'],
    })

    expect(questionRepository.items[0]).toMatchObject({
      title: 'New title',
      content: 'New content',
    })
    expect(questionRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(questionRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await questionRepository.create(newQuestion)

    const result = await sut.execute({
      authorId: 'author-2',
      questionId: newQuestion.id.toString(),
      title: 'New title',
      content: 'New content',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
