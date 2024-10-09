import { InMemoryQuestionRepository } from 'test/repositories/in-memory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachments-repository'

let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let questionRepository: InMemoryQuestionRepository
let studentsRepository: InMemoryStudentRepository
let attachmentsRepository: InMemoryAttachmentRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    studentsRepository = new InMemoryStudentRepository()
    attachmentsRepository = new InMemoryAttachmentRepository()
    questionRepository = new InMemoryQuestionRepository(
      questionAttachmentsRepository,
      studentsRepository,
      attachmentsRepository,
    )
    sut = new FetchRecentQuestionsUseCase(questionRepository)
  })

  it('should be able to fetch recent questions', async () => {
    questionRepository.create(
      makeQuestion({ createdAt: new Date(2024, 0, 20) }),
    )
    questionRepository.create(
      makeQuestion({ createdAt: new Date(2024, 0, 18) }),
    )
    questionRepository.create(
      makeQuestion({ createdAt: new Date(2024, 0, 23) }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 0, 23) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2024, 0, 18) }),
    ])
  })

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      questionRepository.create(makeQuestion({}))
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.questions).toHaveLength(2)
  })
})
