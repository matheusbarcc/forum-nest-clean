import { WatchedList } from '@/core/entities/watched-list'
import { QuestionAttachment } from './attachment-question'

export class QuestionAttachmentsList extends WatchedList<QuestionAttachment> {
  compareItems(a: QuestionAttachment, b: QuestionAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
