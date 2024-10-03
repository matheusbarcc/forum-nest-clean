import { InMemoryAttachmentRepository } from 'test/repositories/in-memory-attachments-repository'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'
import { FakeUploader } from 'test/storage/fake-uploader'
import { InvalidAttachmentType } from './errors/invalid-attachment-type'

let attachmentsRepository: InMemoryAttachmentRepository
let fakeUploader: FakeUploader
let sut: UploadAndCreateAttachmentUseCase

describe('Upload and create attachment', () => {
  beforeEach(() => {
    attachmentsRepository = new InMemoryAttachmentRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadAndCreateAttachmentUseCase(
      attachmentsRepository,
      fakeUploader,
    )
  })

  it('should be able to upload and create an attachement', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: attachmentsRepository.items[0],
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    )
  })

  it('should not be able to upload an attachment with invalid type', async () => {
    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'image/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentType)
  })
})
