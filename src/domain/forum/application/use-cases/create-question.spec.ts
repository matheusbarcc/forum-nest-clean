import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { CreateQuestionUseCase } from './create-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionRepository: InMemoryQuestionRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionRepository = new InMemoryQuestionRepository(
      questionAttachmentsRepository,
    )
    sut = new CreateQuestionUseCase(questionRepository)
  })

  it('should be able to create an question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'Novo titulo',
      content: 'Conteudo da pergunta',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(questionRepository.items[0]).toEqual(result.value?.question)
    expect(questionRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(questionRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })

  it('should persist attachments when creating a new question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'Novo titulo',
      content: 'Conteudo da pergunta',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(questionAttachmentsRepository.items).toHaveLength(2)
    expect(questionAttachmentsRepository.items).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('2'),
      }),
    ])
  })
})
