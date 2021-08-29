import { prisma } from '@testUtil/prisma'
import { createRandomIdString } from 'src/util/random'
import { TaskRepository } from '../../repository/task/task-repository'
import { Task } from 'src/domain/task/entity/task'

describe('task-repository.integration.ts', () => {
  const taskRepository = new TaskRepository(prisma)

  afterEach(async () => {
    await prisma.users.deleteMany({})
    await prisma.tasks.deleteMany({})
    await prisma.userTaskStatus.deleteMany({})
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('findAll', () => {
    test('[正常系] タスクが存在する場合、全てのタスクを返却すること', async () => {
      // Arrange
      const expected = [
        new Task({
          id: '1',
          title: 'title1',
          content: 'content1',
        }),
        new Task({
          id: '2',
          title: 'title2',
          content: 'content2',
        }),
        new Task({
          id: '3',
          title: 'title3',
          content: 'content3',
        }),
      ]
      await Promise.all(
        expected.map(async (task: Task) => {
          const { id, title, content } = task.getAllProperties()
          await prisma.tasks.create({
            data: {
              id,
              title,
              content,
            },
          })
        }),
      )

      // Act
      const actual = await taskRepository.findAll()

      // Assert
      expect(actual).toStrictEqual(expected)
    })
  })

  describe('getByTitle', () => {
    it('[正常系] titleに一致した課題が存在する場合、タスクエンティティを返却すること', async () => {
      // Arrange
      const expectedTaskEntity = new Task({
        id: createRandomIdString(),
        title: 'title',
        content: 'content',
      })
      await prisma.tasks.create({ data: expectedTaskEntity.getAllProperties() })

      // Act
      const actual = await taskRepository.getByTitle('title')

      // Assert
      expect(actual).toEqual(expectedTaskEntity)
    })

    it('[正常系] titleに一致した課題が存在しない場合、undefinedを返却すること', async () => {
      // Arrange
      const presetTaskEntity = new Task({
        id: createRandomIdString(),
        title: 'title',
        content: 'content',
      })
      await prisma.tasks.create({ data: presetTaskEntity.getAllProperties() })

      // Act
      const actual = await taskRepository.getByTitle('猿でもわかるDDD')

      // Assert
      expect(actual).toBeUndefined()
    })
  })

  describe('save', () => {
    it('[正常系] taskを保存できる', async () => {
      // Arrange
      const expectedTaskEntity = new Task({
        id: createRandomIdString(),
        title: 'title',
        content: 'content',
      })

      // Act
      await taskRepository.save(expectedTaskEntity)
      const actual = await prisma.tasks.findMany({})

      // Assert
      expect(actual).toHaveLength(1)
      expect(actual[0]).toEqual(expectedTaskEntity)
    })
  })

  describe('delete', () => {
    test('[正常系]idに合致したuserTaskStatusを削除できる', async () => {
      // Arrange
      const targetId = createRandomIdString()
      const targetTask = new Task({
        id: targetId,
        title: 'title1',
        content: 'content1',
      })
      const nonTargetId = createRandomIdString()
      const nonTargetTask = new Task({
        id: nonTargetId,
        title: 'title2',
        content: 'content2',
      })
      await prisma.tasks.createMany({
        data: [targetTask.getAllProperties(), nonTargetTask.getAllProperties()],
      })

      // Act
      await taskRepository.delete(targetTask)
      const actual = await prisma.tasks.findMany({})

      // Assert
      expect(actual).toHaveLength(1)
      expect(actual[0]).toEqual(nonTargetTask)
    })

    test('[正常系] タスクステータスが存在する場合、カスケード削除されること', async () => {
      // Arrange
      const targetId = createRandomIdString()
      const targetTask = new Task({
        id: targetId,
        title: 'title1',
        content: 'content1',
      })

      await prisma.tasks.create({ data: targetTask.getAllProperties() })
      await prisma.users.create({
        data: {
          id: '1',
          name: 'name',
          mail: 'mail@gmail.com',
          status: 'ENROLLMENT',
        },
      })
      await prisma.userTaskStatus.create({
        data: {
          userId: '1',
          taskId: targetId,
          status: 'TODO' as 'TODO' | 'REVIEWING' | 'DONE',
        },
      })

      // Act
      await taskRepository.delete(targetTask)
      const actualTasks = await prisma.tasks.findMany({})
      const actualUserTaskStatus = await prisma.userTaskStatus.findMany({})

      // Assert
      expect(actualTasks).toHaveLength(0)
      expect(actualUserTaskStatus).toHaveLength(0)
    })
  })
})
