import { prisma } from '@testUtil/prisma'
import { UserRepository } from '../../repository/user/user-repository'
import { User } from 'src/domain/user/entity/user'
import { createRandomIdString } from 'src/util/random'

describe('user-repository.integration.ts', () => {
  const userRepository = new UserRepository(prisma)

  beforeAll(async () => {
    await prisma.users.deleteMany({})
  })
  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('save', () => {
    afterEach(async () => {
      await prisma.users.deleteMany({})
    })

    it('[正常系]userを保存できる', async () => {
      // Arrange
      const expectedUserEntity = new User({
        id: createRandomIdString(),
        name: 'testName',
        mail: 'test@gmail.com',
        status: 'ENROLLMENT',
      })

      // Act
      await userRepository.save(expectedUserEntity)
      const actual = await prisma.users.findMany({})

      // Assert
      expect(actual).toHaveLength(1)
      expect(actual[0]).toEqual(expectedUserEntity)
    })
  })

  describe('delete', () => {
    afterEach(async () => {
      await prisma.users.deleteMany({})
    })

    it('[正常系]idに合致したuserを削除できる', async () => {
      // Arrange
      const deleteId = createRandomIdString()
      const deleteUser = new User({
        id: deleteId,
        name: 'delete-san',
        mail: 'delete@gmail.com',
        status: 'ENROLLMENT',
      })
      const nonDeleteId = createRandomIdString()
      const nonDeleteUser = new User({
        id: nonDeleteId,
        name: 'non-delete-san',
        mail: 'non-delete@gmail.com',
        status: 'ENROLLMENT',
      })
      await prisma.users.create({ data: deleteUser.getAllProperties() })
      await prisma.users.create({ data: nonDeleteUser.getAllProperties() })

      // Act
      await userRepository.delete(deleteUser)
      const actual = await prisma.users.findMany({})

      // Assert
      expect(actual).toHaveLength(1)
      expect(actual[0]).toEqual(nonDeleteUser)
    })
  })

  describe('updateStatus', () => {
    afterEach(async () => {
      await prisma.users.deleteMany({})
    })

    it('[正常系]: statusを更新できる', async () => {
      // Arrange
      const targetId = createRandomIdString()
      const userEntity = new User({
        id: targetId,
        name: 'testName',
        mail: 'test@gmail.com',
        status: 'ENROLLMENT',
      })
      await prisma.users.create({ data: userEntity.getAllProperties() })
      const expected = new User({
        id: targetId,
        name: 'testName',
        mail: 'test@gmail.com',
        status: 'RECESS',
      })

      // Act
      await userRepository.updateStatus(expected)
      const actual = await prisma.users.findMany({})

      // Assert
      expect(actual).toHaveLength(1)
      expect(actual[0]).toEqual(expected)
    })
  })
})
