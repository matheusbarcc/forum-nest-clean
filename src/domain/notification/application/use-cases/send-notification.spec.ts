import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

let notificationRepository: InMemoryNotificationRepository
let sut: SendNotificationUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository()
    sut = new SendNotificationUseCase(notificationRepository)
  })

  it('should be able to create a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'Novo titulo',
      content: 'Conteudo da notificacao',
    })

    expect(result.isRight()).toBe(true)
    expect(notificationRepository.items[0]).toEqual(result.value?.notification)
  })
})
