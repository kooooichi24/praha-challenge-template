import { PrismaClient } from '@prisma/client'
import { UserDTO } from 'src/app/user/query-service-interface/user-qs'
import { UserTaskStatus } from 'src/domain/user-task-status/entity/user-task-status'
import { UserService } from 'src/domain/user/service/user-service'
import { TaskStatusRepository } from 'src/infra/db/repository/task-status/task-status-repository'
import { UserRepository } from 'src/infra/db/repository/user/user-repository'
import { GetTaskStatusUseCase } from '../get-task-status-usecase'

jest.mock('@prisma/client')
jest.mock('src/infra/db/query-service/user/user-qs')

describe('do', () => {
  const prisma = new PrismaClient()

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('[正常系]: ユーザの課題を取得できること', async () => {
    // Arrange
    const userServiceSpy = jest
      .spyOn(UserService.prototype, 'checkExist')
      .mockImplementation(async (params) => {
        // noop
      })
    const mockResponseUserTaskStatus: UserTaskStatus[] = [
      new UserTaskStatus({
        userId: '1',
        taskId: '1',
        status: 'TODO',
      }),
    ]
    const taskStatusRepoSpy = jest
      .spyOn(TaskStatusRepository.prototype, 'getByUserId')
      .mockResolvedValue(mockResponseUserTaskStatus)

    // Act
    const usecase = new GetTaskStatusUseCase(
      new TaskStatusRepository(prisma),
      new UserRepository(prisma),
    )
    const actual = await usecase.do({ userId: '1' })

    // Assert
    expect(userServiceSpy).toHaveBeenCalledWith({ userId: '1' })
    expect(taskStatusRepoSpy).toHaveBeenCalledWith('1')
    expect(actual).toStrictEqual(mockResponseUserTaskStatus)
  })

  it('[異常系]: idに該当するユーザーが存在しない場合、例外が発生する', async () => {
    // Arrange
    const ERROR_MESSAGE = 'ユーザーが存在しません'
    const userServiceSpy = jest
      .spyOn(UserService.prototype, 'checkExist')
      .mockRejectedValue('ユーザーが存在しません')
    const taskStatusRepoSpy = jest
      .spyOn(TaskStatusRepository.prototype, 'getByUserId')
      .mockImplementation()

    try {
      // Act
      const usecase = new GetTaskStatusUseCase(
        new TaskStatusRepository(prisma),
        new UserRepository(prisma),
      )
      await usecase.do({ userId: '1' })
      fail('should not reach here!')
    } catch (error) {
      // Assert
      expect(error).toBe(ERROR_MESSAGE)
    }
    // Assert
    expect(taskStatusRepoSpy).toHaveBeenCalledTimes(0)
  })
})
