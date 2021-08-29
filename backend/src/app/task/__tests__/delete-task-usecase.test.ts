import { PrismaClient } from '@prisma/client'
import { Task } from 'src/domain/task/entity/task'
import { TaskQS } from 'src/infra/db/query-service/task/task-qs'
import { TaskRepository } from 'src/infra/db/repository/task/task-repository'
import { createRandomIdString } from 'src/util/random'
import { DeleteTaskUseCase } from '../delete-task-usecase'
import { TaskDTO } from '../query-service-interface/task-qs'

describe('do', () => {
  const prisma = new PrismaClient()
  let usecase: DeleteTaskUseCase
  let taskQSSpy: jest.SpyInstance
  let taskRepoSpy: jest.SpyInstance

  beforeEach(() => {
    usecase = new DeleteTaskUseCase(
      new TaskRepository(prisma),
      new TaskQS(prisma),
    )
    initSpy()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('[正常系] 例外が発生しない', async () => {
    // Arrange
    const deletedTaskId = createRandomIdString()
    const findByIdResponse = new TaskDTO({
      id: deletedTaskId,
      title: 'title',
      content: 'content',
      tasksStatus: [
        {
          userId: '1',
          taskId: deletedTaskId,
          status: 'TODO',
        },
        {
          userId: '2',
          taskId: deletedTaskId,
          status: 'REVIEWING',
        },
      ],
    })
    const deletedTask = new Task({
      id: deletedTaskId,
      title: 'title',
      content: 'content',
    })
    taskQSSpy = jest
      .spyOn(TaskQS.prototype, 'findById')
      .mockResolvedValueOnce(findByIdResponse)

    // Act
    await usecase.do({ id: deletedTaskId })

    // Assert
    expect(taskQSSpy).toHaveBeenCalledWith(deletedTaskId)
    expect(taskRepoSpy).toHaveBeenLastCalledWith(deletedTask)
  })

  test('[異常系] idに該当する課題が存在しない場合、例外が発生する', async () => {
    // Arrange
    const deletedTaskId = createRandomIdString()
    taskQSSpy = jest
      .spyOn(TaskQS.prototype, 'findById')
      .mockResolvedValueOnce(undefined)

    try {
      // Act
      await usecase.do({ id: deletedTaskId })
      fail('shold not reach here.')
    } catch (e: any) {
      // Assert
      expect(e.message).toBe('idに該当する課題が存在しません')
    }
    expect(taskQSSpy).toHaveBeenLastCalledWith(deletedTaskId)
  })

  function initSpy() {
    taskQSSpy = jest.spyOn(TaskQS.prototype, 'findById').mockImplementation()
    taskRepoSpy = jest
      .spyOn(TaskRepository.prototype, 'delete')
      .mockResolvedValueOnce()
  }
})
