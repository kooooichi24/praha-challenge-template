import { PrismaClient } from '@prisma/client'
import { UserDTO } from 'src/app/user/query-service-interface/user-qs'
import { UserTaskStatus } from 'src/domain/user-task-status/entity/user-task-status'
import { UserQS } from 'src/infra/db/query-service/user/user-qs'
import { TaskStatusRepository } from 'src/infra/db/repository/task-status/task-status-repository'
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
    const mockResponseUserDTO = new UserDTO({
      id: '1',
      mail: 'mail@gmail.com',
      name: 'name',
      status: 'ENROLLMENT',
    })
    const userQSSpy = jest
      .spyOn(UserQS.prototype, 'findById')
      .mockResolvedValue(mockResponseUserDTO)
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
      new UserQS(prisma),
    )
    const actual = await usecase.do({ userId: '1' })

    // Assert
    expect(userQSSpy).toHaveBeenCalledWith('1')
    expect(taskStatusRepoSpy).toHaveBeenCalledWith('1')
    expect(actual).toStrictEqual(mockResponseUserTaskStatus)
  })

  it('[異常系]: idに該当するユーザーが存在しない場合、例外が発生する', async () => {
    // Arrange
    const ERROR_MESSAGE = 'idに該当するユーザーが存在しません'
    const userQSSpy = jest
      .spyOn(UserQS.prototype, 'findById')
      .mockResolvedValue(undefined)
    const taskStatusRepoSpy = jest
      .spyOn(TaskStatusRepository.prototype, 'getByUserId')
      .mockImplementation()

    try {
      // Act
      const usecase = new GetTaskStatusUseCase(
        new TaskStatusRepository(prisma),
        new UserQS(prisma),
      )
      await usecase.do({ userId: '1' })
      fail('should not reach here!')
    } catch (error) {
      // Assert
      expect(error.message).toBe(ERROR_MESSAGE)
    }
    // Assert
    expect(taskStatusRepoSpy).toHaveBeenCalledTimes(0)
  })
})
