import { PrismaClient } from '@prisma/client'
import { UserTaskStatus } from 'src/domain/user-task-status/entity/user-task-status'
import { TaskStatusRepository } from 'src/infra/db/repository/task-status/task-status-repository'
import { UpdateTaskStatusUsecase } from '../update-task-status-usecase'

describe('do', () => {
  const prisma = new PrismaClient()
  let usecase: UpdateTaskStatusUsecase
  let getByUserIdAndTaskIdSpy: jest.SpyInstance<
    Promise<UserTaskStatus | undefined>,
    [userId: string, taskId: string]
  >
  let saveSpy: jest.SpyInstance<Promise<void>, [taskStatus: UserTaskStatus]>

  beforeEach(() => {
    usecase = new UpdateTaskStatusUsecase(new TaskStatusRepository(prisma))
    initSpy()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('[正常系]: ユーザIDとタスクIDに一致するタスクが存在する場合、タスクのステータスを変更できること', async () => {
    // Arrange
    const mockResponse = new UserTaskStatus({
      userId: '1',
      taskId: '1',
      status: 'TODO',
    })
    getByUserIdAndTaskIdSpy = jest
      .spyOn(TaskStatusRepository.prototype, 'getByUserIdAndTaskId')
      .mockResolvedValue(mockResponse)
    const expected = new UserTaskStatus({
      userId: '1',
      taskId: '1',
      status: 'REVIEWING',
    })

    // Act
    const actual = await usecase.do({
      userId: '1',
      taskId: '1',
      status: 'REVIEWING',
    })

    // Assert
    expect(actual).toStrictEqual(expected)
    expect(saveSpy).toHaveBeenCalledWith(expected)
    expect(getByUserIdAndTaskIdSpy).toHaveBeenCalledWith('1', '1')
  })

  test('[異常系]: ユーザIDとタスクIDに一致するタスクが存在しない場合、例外が発生すること', async () => {
    // Arrange
    const ERROR_MESSAGE = 'ユーザIDとタスクIDに該当するタスクは存在しません'
    getByUserIdAndTaskIdSpy = jest
      .spyOn(TaskStatusRepository.prototype, 'getByUserIdAndTaskId')
      .mockResolvedValue(undefined)

    try {
      // Act
      await usecase.do({
        userId: '99999',
        taskId: '99999',
        status: 'REVIEWING',
      })
      fail('should not reach here!')
    } catch (e: any) {
      // Assert
      expect(e.message).toBe(ERROR_MESSAGE)
    }
    expect(getByUserIdAndTaskIdSpy).toHaveBeenCalledWith('99999', '99999')
    expect(saveSpy).toHaveBeenCalledTimes(0)
  })

  function initSpy(): void {
    // init spy
    getByUserIdAndTaskIdSpy = jest
      .spyOn(TaskStatusRepository.prototype, 'getByUserIdAndTaskId')
      .mockImplementation()
    saveSpy = jest
      .spyOn(TaskStatusRepository.prototype, 'save')
      .mockResolvedValue()
  }
})
