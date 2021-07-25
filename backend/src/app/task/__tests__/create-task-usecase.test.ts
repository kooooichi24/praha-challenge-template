import { PrismaClient } from '@prisma/client'
import { createRandomIdString } from 'src/util/random'
import { uuid as uuidv4 } from 'uuidv4'
import { Task } from 'src/domain/task/entity/task'
import { TaskRepository } from 'src/infra/db/repository/task/task-repository'
import { CreateTaskUseCase } from '../create-task-usecase'
import { TaskService } from 'src/domain/task/entity/service/task-service'

jest.mock('uuidv4')

describe('do', () => {
  const prisma = new PrismaClient()
  const mockUuidv4 = uuidv4 as jest.Mock
  const mockUuidv4Response = '3f86f7dd-d67f-4516-afba-8021d7696462'

  beforeAll(() => {
    mockUuidv4.mockImplementation(() => mockUuidv4Response)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('[正常系]: 例外が発生しない', async () => {
    // Arrange
    const mockResponseTask = new Task({
      id: createRandomIdString(),
      title: 'title',
      content: 'content',
    })
    const taskRepoSpy = jest
      .spyOn(TaskRepository.prototype, 'save')
      .mockResolvedValue(mockResponseTask)
    const taskServiceSpy = jest
      .spyOn(TaskService.prototype, 'duplicateCheck')
      .mockResolvedValue()

    // Act
    const usecase = new CreateTaskUseCase(new TaskRepository(prisma))
    await usecase.do({ title: 'title', content: 'content' })

    // Assert
    expect(taskRepoSpy).toHaveBeenLastCalledWith(mockResponseTask)
    expect(taskServiceSpy).toHaveBeenCalledTimes(1)
  })

  it('[異常系]: taskRepo.saveで例外が発生した場合、例外が発生する', async () => {
    // Arrange
    const ERROR_MESSAGE = 'error!'
    const taskRepoSpy = jest
      .spyOn(TaskRepository.prototype, 'save')
      .mockRejectedValueOnce(ERROR_MESSAGE)
    const taskServiceSpy = jest
      .spyOn(TaskService.prototype, 'duplicateCheck')
      .mockResolvedValue()

    try {
      // Act
      const usecase = new CreateTaskUseCase(new TaskRepository(prisma))
      await usecase.do({ title: 'title', content: 'content' })
      fail('should not reach here!')
    } catch (e) {
      // Assert
      expect(e).toBe(ERROR_MESSAGE)
      expect(taskServiceSpy).toHaveBeenCalledTimes(1)
    }
  })

  it('[異常系]: タイトルが重複している場合、例外が発生する', async () => {
    // Arrange
    const ERROR_MESSAGE = '課題タイトルが重複しています!'
    const taskServiceSpy = jest
      .spyOn(TaskService.prototype, 'duplicateCheck')
      .mockRejectedValueOnce(ERROR_MESSAGE)
    const taskRepoSpy = jest.spyOn(TaskRepository.prototype, 'save')

    try {
      // Act
      const usecase = new CreateTaskUseCase(new TaskRepository(prisma))
      await usecase.do({ title: 'title', content: 'content' })
      fail('should not reach here!')
    } catch (e) {
      // Assert
      expect(e).toBe(ERROR_MESSAGE)
      expect(taskRepoSpy).toHaveBeenCalledTimes(0)
    }
  })
})
