import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'

export class InMemoryAttachmentRepository implements AttachmentsRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment) {
    this.items.push(attachment)
  }
}
