import { prisma } from '@testUtil/prisma'
import { TaskDTO } from 'src/app/task/query-service-interface/task-qs'
import { createRandomIdString } from 'src/util/random'
import { TaskQS } from '../../query-service/task/task-qs'

describe('task-qs.integration.ts', () => {
  const taskQS = new TaskQS(prisma)

  afterEach(async () => {
    await prisma.tasks.deleteMany({})
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('findById', () => {
    test('[正常系]idに合致したtaskDTOを取得できる', async () => {
      // Arrange
      const id = createRandomIdString()
      const expected = new TaskDTO({
        id,
        title: 'title',
        content: 'content',
        tasksStatus: [],
      })
      await prisma.tasks.create({
        data: {
          id,
          title: 'title',
          content: 'content',
        },
      })

      // Act
      const actual = await taskQS.findById(id)

      // Assert
      expect(actual).toStrictEqual(expected)
    })

    test('[正常系]idに合致したtaskが存在しない場合、undefinedを取得できる', async () => {
      // Arrange
      // Act
      const actual = await taskQS.findById('evalId')

      // Assert
      expect(actual).toBeUndefined()
    })
  })
})
