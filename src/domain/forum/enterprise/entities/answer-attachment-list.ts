import { WatchedList } from '@/core/entities/watched-list'
import { AnswerAttachment } from './attachment-answer'

export class AnswerAttachmentList extends WatchedList<AnswerAttachment> {
  compareItems(a: AnswerAttachment, b: AnswerAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
