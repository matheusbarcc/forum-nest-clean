import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerRepository } from 'test/repositories/in-memory-answer-repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachments-repository'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let answerRepository: InMemoryAnswerRepository
let questionRepository: InMemoryQuestionRepository
let studentsRepository: InMemoryStudentRepository
let attachmentsRepository: InMemoryAttachmentRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    answerRepository = new InMemoryAnswerRepository(answerAttachmentsRepository)
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    studentsRepository = new InMemoryStudentRepository()
    attachmentsRepository = new InMemoryAttachmentRepository()
    questionRepository = new InMemoryQuestionRepository(
      questionAttachmentsRepository,
      studentsRepository,
      attachmentsRepository,
    )
    sut = new ChooseQuestionBestAnswerUseCase(
      questionRepository,
      answerRepository,
    )
  })

  it('should be able to choose a question best answer', async () => {
    const question = makeQuestion({})

    const answer = makeAnswer({
      questionId: new UniqueEntityID(question.id.toString()),
    })

    await questionRepository.create(question)
    await answerRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toValue(),
      authorId: question.authorId.toValue(),
    })

    expect(questionRepository.items[0].bestAnswerId).toEqual(answer.id)
  })

  it('should not be able to choose a question best answer from another user', async () => {
    const question = makeQuestion({ authorId: new UniqueEntityID('author-1') })

    const answer = makeAnswer({
      questionId: new UniqueEntityID(question.id.toString()),
    })

    await questionRepository.create(question)
    await answerRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toValue(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
