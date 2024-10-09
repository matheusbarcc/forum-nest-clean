import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { makeStudent } from 'test/factories/make-student'
import { makeAttachment } from 'test/factories/make-attachment'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let studentsRepository: InMemoryStudentRepository
let attachmentsRepository: InMemoryAttachmentRepository
let questionRepository: InMemoryQuestionRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    studentsRepository = new InMemoryStudentRepository()
    attachmentsRepository = new InMemoryAttachmentRepository()
    questionRepository = new InMemoryQuestionRepository(
      questionAttachmentsRepository,
      studentsRepository,
      attachmentsRepository,
    )
    sut = new GetQuestionBySlugUseCase(questionRepository)
  })

  it('should be able to get a question by slug', async () => {
    const student = makeStudent({ name: 'John Doe' })

    studentsRepository.items.push(student)

    const newQuestion = makeQuestion({
      authorId: student.id,
      slug: Slug.create('example-question'),
    })

    await questionRepository.create(newQuestion)

    const attachment = makeAttachment({
      title: 'Some attachment',
    })

    attachmentsRepository.items.push(attachment)

    questionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        attachmentId: attachment.id,
        questionId: newQuestion.id,
      }),
    )

    const result = await sut.execute({
      slug: 'example-question',
    })

    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
        author: 'John Doe',
        attachments: [
          expect.objectContaining({
            title: 'Some attachment',
          }),
        ],
      }),
    })
  })
})
