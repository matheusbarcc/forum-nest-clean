import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { AnswerQuestionUseCase } from './answer-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answerRepository: InMemoryAnswerRepository
let sut: AnswerQuestionUseCase

describe('Answer Question', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answerRepository = new InMemoryAnswerRepository(answerAttachmentsRepository)
    sut = new AnswerQuestionUseCase(answerRepository)
  })

  it('should be able to answer an question', async () => {
    const result = await sut.execute({
      instructorId: '1',
      questionId: '1',
      content: 'Nova resposta da pergunta',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(answerRepository.items[0]).toEqual(result.value?.answer)
    expect(answerRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(answerRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })
})
