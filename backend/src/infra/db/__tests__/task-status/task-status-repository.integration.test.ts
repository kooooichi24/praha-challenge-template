import { prisma } from '@testUtil/prisma'
import { UserTaskStatus } from 'src/domain/user-task-status/entity/user-task-status'
import { TaskStatusRepository } from '../../repository/task-status/task-status-repository'

describe('task-status-repository.integration.ts', () => {
  const taskStatusRepository = new TaskStatusRepository(prisma)

  afterEach(async () => {
    await prisma.userTaskStatus.deleteMany({})
    await prisma.users.deleteMany({})
    await prisma.tasks.deleteMany({})
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('save', () => {
    test('[正常系] TaskStatusを保存できること', async () => {
      // Arrange
      const expected = { userId: '1', taskId: '1', status: 'DONE' }
      await prisma.users.create({
        data: {
          id: '1',
          name: '',
          mail: 'mail1@gmail.com',
        },
      })
      await prisma.tasks.create({
        data: {
          id: '1',
          title: 'title1',
          content: '',
        },
      })

      const args = new UserTaskStatus({
        userId: expected.userId,
        taskId: expected.taskId,
        status: expected.status as 'DONE' | 'TODO' | 'REVIEWING',
      })

      // Act
      await taskStatusRepository.save(args)
      const actual = await prisma.userTaskStatus.findMany({})

      // Assert
      expect(actual[0]).toStrictEqual(expected)
      expect(actual).toHaveLength(1)
    })
  })

  describe('saveAll', () => {
    test('[正常系] TaskStatus[]を保存できること', async () => {
      // Arrange
      const expected = [
        { userId: '1', taskId: '1', status: 'TODO' },
        { userId: '2', taskId: '2', status: 'REVIEWING' },
        { userId: '3', taskId: '3', status: 'DONE' },
      ]
      await prisma.users.createMany({
        data: [
          { id: '1', name: '', mail: 'mail1@gmail.com' },
          { id: '2', name: '', mail: 'mail2@gmail.com' },
          { id: '3', name: '', mail: 'mail3@gmail.com' },
        ],
      })
      await prisma.tasks.createMany({
        data: [
          { id: '1', title: 'title1', content: '' },
          { id: '2', title: 'title2', content: '' },
          { id: '3', title: 'title3', content: '' },
        ],
      })

      const args = expected.map((data: any) => {
        return new UserTaskStatus({
          userId: data.userId,
          taskId: data.taskId,
          status: data.status,
        })
      })

      // Act
      await taskStatusRepository.saveAll(args)
      const actual = await prisma.userTaskStatus.findMany({})

      // Assert
      expect(actual).toStrictEqual(expected)
    })
  })

  describe('getByUserId', () => {
    it('[正常系] userIDに対応するタスクが存在する場合、ユーザのタスクステータスを全権取得できること', async () => {
      // Arrange
      const expectedUserId = '100'
      const expectedUserTaskStatusEntities = [
        new UserTaskStatus({
          userId: expectedUserId,
          taskId: '200',
          status: 'TODO',
        }),
        new UserTaskStatus({
          userId: expectedUserId,
          taskId: '201',
          status: 'TODO',
        }),
      ]
      await prisma.users.create({
        data: {
          id: expectedUserId,
          name: 'namae-san',
          mail: 'test@example.com',
          status: 'ENROLLMENT',
        },
      })
      await prisma.tasks.createMany({
        data: [
          {
            id: '200',
            title: 'task-title-200',
            content: 'task-content-200',
          },
          {
            id: '201',
            title: 'task-title-201',
            content: 'task-content-201',
          },
        ],
      })
      await prisma.userTaskStatus.createMany({
        data: [
          { userId: expectedUserId, taskId: '200', status: 'TODO' },
          { userId: expectedUserId, taskId: '201', status: 'TODO' },
        ],
      })

      // Act
      const actual = await taskStatusRepository.getByUserId(expectedUserId)

      // Assert
      expect(actual).toEqual(expectedUserTaskStatusEntities)
    })
  })

  describe('getByUserIdAndTaskId', () => {
    test('[正常系] userIDとtaskIdに一致するタスクが存在する場合、タスクステータスを取得できること', async () => {
      // Arrange
      const expectedUserId = '1'
      const expectedTaskId = '2'
      const expected = new UserTaskStatus({
        userId: expectedUserId,
        taskId: expectedTaskId,
        status: 'REVIEWING',
      })

      await prisma.users.createMany({
        data: [
          {
            id: expectedUserId,
            name: '',
            mail: 'mail1@example.com',
            status: 'ENROLLMENT',
          },
          {
            id: '2',
            name: '',
            mail: 'mail2@example.com',
            status: 'ENROLLMENT',
          },
        ],
      })
      await prisma.tasks.createMany({
        data: [
          {
            id: '1',
            title: 'title1',
            content: '',
          },
          {
            id: expectedTaskId,
            title: 'title2',
            content: '',
          },
        ],
      })
      await prisma.userTaskStatus.createMany({
        data: [
          { userId: expectedUserId, taskId: '1', status: 'TODO' },
          {
            userId: expectedUserId,
            taskId: expectedTaskId,
            status: 'REVIEWING',
          },
          { userId: '2', taskId: '1', status: 'DONE' },
          { userId: '2', taskId: expectedTaskId, status: 'TODO' },
        ],
      })

      // Act
      const actual = await taskStatusRepository.getByUserIdAndTaskId(
        expectedUserId,
        expectedTaskId,
      )

      // Assert
      expect(actual).toStrictEqual(expected)
    })
    test('[正常系] userIDとtaskIdに一致するタスクが存在しない場合、undefinedを取得できること', async () => {
      // Arrange
      await prisma.users.create({
        data: {
          id: '1',
          name: '',
          mail: 'mail1@example.com',
          status: 'ENROLLMENT',
        },
      })
      await prisma.tasks.create({
        data: {
          id: '1',
          title: 'title1',
          content: '',
        },
      })
      await prisma.userTaskStatus.create({
        data: { userId: '1', taskId: '1', status: 'TODO' },
      })

      // Act
      const actual = await taskStatusRepository.getByUserIdAndTaskId(
        '9999',
        '9999',
      )

      // Assert
      expect(actual).toBeUndefined()
    })
  })
})
