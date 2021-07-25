import { prisma } from '@testUtil/prisma'
import { UserRepository } from '../../repository/user/user-repository'
import { User } from 'src/domain/user/entity/user'
import { createRandomIdString } from 'src/util/random'
import { TaskRepository } from '../../repository/task/task-repository'
import { Task } from 'src/domain/task/entity/task'

describe('task-repository.integration.ts', () => {
  const taskRepository = new TaskRepository(prisma)

  beforeAll(async () => {
    await prisma.users.deleteMany({})
  })
  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('getByTitle', () => {
    afterEach(async () => {
      await prisma.tasks.deleteMany({})
    })

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
    afterEach(async () => {
      await prisma.tasks.deleteMany({})
    })

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

  // describe('delete', () => {
  //   afterEach(async () => {
  //     await prisma.users.deleteMany({})
  //   })

  //   it('[正常系]idに合致したuserを削除できる', async () => {
  //     // Arrange
  //     const deleteId = createRandomIdString()
  //     const deleteUser = new User({
  //       id: deleteId,
  //       name: 'delete-san',
  //       mail: 'delete@gmail.com',
  //       status: 'ENROLLMENT',
  //     })
  //     const nonDeleteId = createRandomIdString()
  //     const nonDeleteUser = new User({
  //       id: nonDeleteId,
  //       name: 'non-delete-san',
  //       mail: 'non-delete@gmail.com',
  //       status: 'ENROLLMENT',
  //     })
  //     await prisma.users.create({ data: deleteUser.getAllProperties() })
  //     await prisma.users.create({ data: nonDeleteUser.getAllProperties() })

  //     // Act
  //     await userRepository.delete(deleteUser)
  //     const actual = await prisma.users.findMany({})

  //     // Assert
  //     expect(actual).toHaveLength(1)
  //     expect(actual[0]).toEqual(nonDeleteUser)
  //   })
  // })

  // describe('updateStatus', () => {
  //   afterEach(async () => {
  //     await prisma.users.deleteMany({})
  //   })

  //   it('[正常系]: statusを更新できる', async () => {
  //     // Arrange
  //     const targetId = createRandomIdString()
  //     const userEntity = new User({
  //       id: targetId,
  //       name: 'testName',
  //       mail: 'test@gmail.com',
  //       status: 'ENROLLMENT',
  //     })
  //     await prisma.users.create({ data: userEntity.getAllProperties() })
  //     const expected = new User({
  //       id: targetId,
  //       name: 'testName',
  //       mail: 'test@gmail.com',
  //       status: 'RECESS',
  //     })

  //     // Act
  //     await userRepository.updateStatus(expected)
  //     const actual = await prisma.users.findMany({})

  //     // Assert
  //     expect(actual).toHaveLength(1)
  //     expect(actual[0]).toEqual(expected)
  //   })
  // })
})
