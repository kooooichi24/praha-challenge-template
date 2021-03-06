import { PrismaClient } from '@prisma/client'
import { createRandomIdString } from 'src/util/random'
import { TaskRepository } from 'src/infra/db/repository/task/task-repository'
import { Task } from '../entity/task'
import { TaskService } from '../entity/service/task-service'

describe('TaskService', () => {
  const prisma = new PrismaClient()

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('duplicateCheck', () => {
    it('[正常系]: タイトルが重複していない場合、例外が発生しないこと', async () => {
      // Arrange
      const taskRepoSpy = jest
        .spyOn(TaskRepository.prototype, 'getByTitle')
        .mockResolvedValueOnce(undefined)
      const request = new Task({
        id: createRandomIdString(),
        title: 'title',
        content: 'content',
      })

      // Act
      const target = new TaskService(new TaskRepository(prisma))
      await target.duplicateCheck(request)

      // Assert
      expect(taskRepoSpy).toHaveBeenLastCalledWith('title')
    })

    it('[異常系]: タイトルが重複している場合、例外が発生すること', async () => {
      // Arrange
      const request = new Task({
        id: createRandomIdString(),
        title: 'title',
        content: 'content',
      })
      const taskRepoSpy = jest
        .spyOn(TaskRepository.prototype, 'getByTitle')
        .mockResolvedValueOnce(request)

      try {
        // Act
        const target = new TaskService(new TaskRepository(prisma))
        await target.duplicateCheck(request)
        fail('should not reach here!')
      } catch (e: any) {
        // Assert
        expect(e.message).toBe('課題タイトルが重複しています!')
      }
    })
  })
})
