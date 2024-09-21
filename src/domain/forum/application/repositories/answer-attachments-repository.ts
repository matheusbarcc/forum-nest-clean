import { AnswerAttachment } from '../../enterprise/entities/attachment-answer'

export interface AnswerAttachmentsRepository {
  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>
  deleteManyByAnswerId(answerId: string): Promise<void>
}
