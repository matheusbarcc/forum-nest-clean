import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from '../../../../../test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswerRepository } from '../../../../../test/repositories/in-memory-answer-repository'
import { OnAnswerCreated } from './on-answer-created'
import { InMemoryQuestionRepository } from '../../../../../test/repositories/in-memory-question-repository'
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { InMemoryNotificationRepository } from '../../../../../test/repositories/in-memory-notifications-repository'
import { makeQuestion } from 'test/factories/make-question'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { SpyInstance } from 'vitest'
import { waitFor } from 'test/utils/wait-for'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionRepository: InMemoryQuestionRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswerRepository: InMemoryAnswerRepository
let inMemoryNotificationRepository: InMemoryNotificationRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Answer Created', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionRepository = new InMemoryQuestionRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryNotificationRepository = new InMemoryNotificationRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnAnswerCreated(inMemoryQuestionRepository, sendNotificationUseCase)
  })

  it('should send a notification when an answer is created', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    inMemoryQuestionRepository.create(question)
    inMemoryAnswerRepository.create(answer)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
