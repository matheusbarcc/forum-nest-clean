import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationRepository implements NotificationsRepository {
  public items: Notification[] = []

  async findById(id: string) {
    const notification = this.items.find((item) => item.id.toString() === id)

    if (!notification) {
      return null
    }

    return notification
  }

  async create(notification: Notification) {
    this.items.push(notification)
  }

  async save(notification: Notification) {
    const notificationIndex = this.items.findIndex(
      (item) => item.id === notification.id,
    )

    this.items[notificationIndex] = notification
  }
}
