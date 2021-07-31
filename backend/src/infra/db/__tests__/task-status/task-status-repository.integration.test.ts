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
})
