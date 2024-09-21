import { Question } from '../../enterprise/entities/question'
import { PaginationParams } from '@/core/repositories/pagination-params'

export interface QuestionsRepository {
  findById(id: string): Promise<Question | null>
  findManyRecent(params: PaginationParams): Promise<Question[]>
  findBySlug(slug: string): Promise<Question | null>
  save(question: Question): Promise<void>
  create(question: Question): Promise<void>
  delete(question: Question): Promise<void>
}
