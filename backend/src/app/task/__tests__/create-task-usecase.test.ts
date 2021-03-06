import { PrismaClient } from '@prisma/client'
import { createRandomIdString } from 'src/util/random'
import { uuid as uuidv4 } from 'uuidv4'
import { Task } from 'src/domain/task/entity/task'
import { TaskRepository } from 'src/infra/db/repository/task/task-repository'
import { CreateTaskUseCase } from '../create-task-usecase'
import { TaskService } from 'src/domain/task/entity/service/task-service'
import { UserRepository } from 'src/infra/db/repository/user/user-repository'
import { User } from 'src/domain/user/user'
import { TaskStatusRepository } from 'src/infra/db/repository/task-status/task-status-repository'
import { UserTaskStatus } from 'src/domain/user-task-status/entity/user-task-status'
import { UniqueEntityID } from 'src/domain/shared/UniqueEntityID'

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
    const expected = new Task({
      id: createRandomIdString(),
      title: 'title',
      content: 'content',
    })
    const mockResponseUserList = [
      User.create(
        {
          name: 'name1',
          mail: 'mail1@gmail.com',
          status: 'ENROLLMENT',
        },
        new UniqueEntityID('1'),
      ),
      User.create(
        {
          name: 'name2',
          mail: 'mail2@gmail.com',
          status: 'ENROLLMENT',
        },
        new UniqueEntityID('2'),
      ),
      User.create(
        {
          name: 'name3',
          mail: 'mail3@gmail.com',
          status: 'RECESS',
        },
        new UniqueEntityID('3'),
      ),
    ]
    const taskRepoSpy = jest
      .spyOn(TaskRepository.prototype, 'save')
      .mockResolvedValue(expected)
    const taskServiceSpy = jest
      .spyOn(TaskService.prototype, 'duplicateCheck')
      .mockResolvedValue()
    const userRepoSpy = jest
      .spyOn(UserRepository.prototype, 'findAll')
      .mockResolvedValue(mockResponseUserList)
    const taskStatusRepoSpy = jest
      .spyOn(TaskStatusRepository.prototype, 'saveAll')
      .mockImplementation()

    // Act
    const usecase = new CreateTaskUseCase(
      new TaskRepository(prisma),
      new UserRepository(prisma),
      new TaskStatusRepository(prisma),
    )
    const actual = await usecase.do({ title: 'title', content: 'content' })

    // Assert
    expect(actual).toBe(expected)
    expect(taskRepoSpy).toHaveBeenLastCalledWith(expected)
    expect(taskServiceSpy).toHaveBeenCalledTimes(1)
    expect(userRepoSpy).toHaveBeenCalledTimes(1)
    expect(taskStatusRepoSpy).toHaveBeenCalledTimes(1)
  })

  it('[異常系]: taskRepo.saveで例外が発生した場合、例外が発生する', async () => {
    // Arrange
    const ERROR_MESSAGE = 'error!'
    const mockResponseUserList = [
      User.create(
        {
          name: 'name1',
          mail: 'mail1@gmail.com',
          status: 'ENROLLMENT',
        },
        new UniqueEntityID('1'),
      ),
      User.create(
        {
          name: 'name2',
          mail: 'mail2@gmail.com',
          status: 'ENROLLMENT',
        },
        new UniqueEntityID('2'),
      ),
      User.create(
        {
          name: 'name3',
          mail: 'mail3@gmail.com',
          status: 'RECESS',
        },
        new UniqueEntityID('3'),
      ),
    ]
    const taskRepoSpy = jest
      .spyOn(TaskRepository.prototype, 'save')
      .mockRejectedValueOnce(ERROR_MESSAGE)
    const taskServiceSpy = jest
      .spyOn(TaskService.prototype, 'duplicateCheck')
      .mockResolvedValue()
    const userRepoSpy = jest
      .spyOn(UserRepository.prototype, 'findAll')
      .mockResolvedValue(mockResponseUserList)
    const taskStatusRepoSpy = jest
      .spyOn(TaskStatusRepository.prototype, 'saveAll')
      .mockImplementation()

    try {
      // Act
      const usecase = new CreateTaskUseCase(
        new TaskRepository(prisma),
        new UserRepository(prisma),
        new TaskStatusRepository(prisma),
      )
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
      const usecase = new CreateTaskUseCase(
        new TaskRepository(prisma),
        new UserRepository(prisma),
        new TaskStatusRepository(prisma),
      )
      await usecase.do({ title: 'title', content: 'content' })
      fail('should not reach here!')
    } catch (e) {
      // Assert
      expect(e).toBe(ERROR_MESSAGE)
      expect(taskRepoSpy).toHaveBeenCalledTimes(0)
    }
  })
})

describe('convertUsersToTaskStatusList', () => {
  const prisma = new PrismaClient()
  const usecase = new CreateTaskUseCase(
    new TaskRepository(prisma),
    new UserRepository(prisma),
    new TaskStatusRepository(prisma),
  )

  test('[正常系]: 引数にUser[]とtaskIdを受け取った場合、UserTaskStatus[]に変換できる', () => {
    // Arrange
    const targetTaskId = '1'
    const users = [
      User.create({ name: '', mail: '' }, new UniqueEntityID('1')),
      User.create({ name: '', mail: '' }, new UniqueEntityID('2')),
      User.create({ name: '', mail: '' }, new UniqueEntityID('3')),
    ]
    const expected = [
      new UserTaskStatus({ userId: '1', taskId: targetTaskId, status: 'TODO' }),
      new UserTaskStatus({ userId: '2', taskId: targetTaskId, status: 'TODO' }),
      new UserTaskStatus({ userId: '3', taskId: targetTaskId, status: 'TODO' }),
    ]

    // Act
    const actual = usecase['convertUsersToTaskStatusList'](users, targetTaskId)

    // Assert
    expect(actual).toStrictEqual(expected)
  })
})
