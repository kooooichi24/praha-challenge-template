import { PrismaClient } from '@prisma/client'
import { UserRepository } from 'src/infra/db/repository/user/user-repository'
import { CreateUserUsecase } from '../create-user-usecase'
import { User } from 'src/domain/user/user'
import { uuid as uuidv4 } from 'uuidv4'
import { UserService } from 'src/domain/user/service/user-service'
import { TaskRepository } from 'src/infra/db/repository/task/task-repository'
import { TaskStatusRepository } from 'src/infra/db/repository/task-status/task-status-repository'
import { Task } from 'src/domain/task/entity/task'
import { UserTaskStatus } from 'src/domain/user-task-status/entity/user-task-status'

jest.mock('uuidv4')

describe('create-user-usecase', () => {
  const prisma = new PrismaClient()
  let usecase: CreateUserUsecase

  beforeEach(() => {
    usecase = new CreateUserUsecase(
      new UserRepository(prisma),
      new TaskRepository(prisma),
      new TaskStatusRepository(prisma),
    )
  })

  describe('do', () => {
    const mockUuidv4 = uuidv4 as jest.Mock
    const mockUuidv4Response = '3f86f7dd-d67f-4516-afba-8021d7696462'
    let userRepoSpy: jest.SpyInstance
    let userServiceSpy: jest.SpyInstance
    let taskRepoSpy: jest.SpyInstance
    let taskStatusRepo: jest.SpyInstance

    beforeEach(() => {
      mockUuidv4.mockImplementation(() => mockUuidv4Response)
      initSpy()
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    test('[正常系]: 例外が発生しない', async () => {
      // Arrange
      const mockTasksResponse = [
        new Task({ id: '1', title: '', content: '' }),
        new Task({ id: '2', title: '', content: '' }),
        new Task({ id: '3', title: '', content: '' }),
      ]
      taskRepoSpy = jest
        .spyOn(TaskRepository.prototype, 'findAll')
        .mockResolvedValue(mockTasksResponse)

      const expectedUser = User.create({
        name: 'name',
        mail: 'mail@gmail.com',
      })
      const expectedTaskStatusList = [
        new UserTaskStatus({
          userId: expectedUser.id.toString(),
          taskId: '1',
          status: 'TODO',
        }),
        new UserTaskStatus({
          userId: expectedUser.id.toString(),
          taskId: '2',
          status: 'TODO',
        }),
        new UserTaskStatus({
          userId: expectedUser.id.toString(),
          taskId: '3',
          status: 'TODO',
        }),
      ]

      // Act
      await usecase.do({ name: 'name', mail: 'mail@gmail.com' })

      // Assert
      expect(userRepoSpy).toHaveBeenCalledWith(expectedUser)
      expect(taskStatusRepo).toHaveBeenCalledWith(expectedTaskStatusList)
      expect(userServiceSpy).toHaveBeenCalledTimes(1)
      expect(taskRepoSpy).toHaveBeenCalledTimes(1)
    })

    test('[異常系]: userRepo.saveで例外が発生した場合、例外が発生する', async () => {
      // Arrange
      const ERROR_MESSAGE = 'error!'
      userRepoSpy = jest
        .spyOn(UserRepository.prototype, 'save')
        .mockRejectedValueOnce(ERROR_MESSAGE)

      try {
        // Act
        await usecase.do({ name: 'name', mail: 'mail@gmail.com' })
        fail('should not reach here!')
      } catch (e) {
        // Assert
        expect(e).toBe(ERROR_MESSAGE)
      }
      expect(userServiceSpy).toHaveBeenCalledTimes(1)
      expect(taskRepoSpy).toHaveBeenCalledTimes(0)
      expect(taskStatusRepo).toHaveBeenCalledTimes(0)
    })

    test('[異常系]: メールアドレスが重複している場合、例外が発生する', async () => {
      // Arrange
      const ERROR_MESSAGE = 'メールアドレスが重複しています!'
      userServiceSpy = jest
        .spyOn(UserService.prototype, 'duplicateMailCheck')
        .mockRejectedValueOnce(ERROR_MESSAGE)

      try {
        // Act
        await usecase.do({ name: 'name', mail: 'mail@gmail.com' })
        fail('should not reach here!')
      } catch (e) {
        // Assert
        expect(e).toBe(ERROR_MESSAGE)
      }
      expect(userRepoSpy).toHaveBeenCalledTimes(0)
      expect(taskRepoSpy).toHaveBeenCalledTimes(0)
      expect(taskStatusRepo).toHaveBeenCalledTimes(0)
    })

    function initSpy(): void {
      userRepoSpy = jest
        .spyOn(UserRepository.prototype, 'save')
        .mockImplementation()
      userServiceSpy = jest
        .spyOn(UserService.prototype, 'duplicateMailCheck')
        .mockResolvedValue()
      taskRepoSpy = jest
        .spyOn(TaskRepository.prototype, 'findAll')
        .mockImplementation()
      taskStatusRepo = jest
        .spyOn(TaskStatusRepository.prototype, 'saveAll')
        .mockResolvedValue()
    }
  })

  describe('createTaskStatusList', () => {
    test('[正常系] 引数にTask[]とuserIdを受け取った場合、UserTaskStatus[]を生成できる', () => {
      // Arrange
      const targetUserId = '1'
      const tasks = [
        new Task({ id: '1', title: '', content: '' }),
        new Task({ id: '2', title: '', content: '' }),
        new Task({ id: '3', title: '', content: '' }),
      ]
      const expected = [
        new UserTaskStatus({
          userId: targetUserId,
          taskId: '1',
          status: 'TODO',
        }),
        new UserTaskStatus({
          userId: targetUserId,
          taskId: '2',
          status: 'TODO',
        }),
        new UserTaskStatus({
          userId: targetUserId,
          taskId: '3',
          status: 'TODO',
        }),
      ]

      // Act
      const actual = usecase['createTaskStatusList'](tasks, targetUserId)

      // Assert
      expect(actual).toStrictEqual(expected)
    })
  })
})
