import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID,
) {
  const question = Question.create(
    {
      title: faker.lorem.sentence(),
      authorId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return question
}
