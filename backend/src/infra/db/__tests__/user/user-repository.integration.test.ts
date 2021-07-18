import { prisma } from '@testUtil/prisma'
import { UserRepository } from '../../repository/user/user-repository'
import { User } from 'src/domain/user/entity/user'
import { createRandomIdString } from 'src/util/random'

describe('user-repository.integration.ts', () => {
  const userRepository = new UserRepository(prisma)

  beforeAll(async () => {
    await prisma.user.deleteMany({})
  })
  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('save', () => {
    afterEach(async () => {
      await prisma.user.deleteMany({})
    })

    it('[正常系]userを保存できる', async () => {
      // Arrange
      const expectedUserEntity = new User({
        id: createRandomIdString(),
        name: 'testName',
        mail: 'test@gmail.com',
      })

      // Act
      await userRepository.save(expectedUserEntity)
      const actual = await prisma.user.findMany({})

      // Assert
      expect(actual).toHaveLength(1)
      expect(actual[0]).toEqual(expectedUserEntity)
    })
  })

  describe('delete', () => {
    afterEach(async () => {
      await prisma.user.deleteMany({})
    })

    it('[正常系]idに合致したuserを削除できる', async () => {
      // Arrange
      const deleteId = createRandomIdString()
      const deleteUser = {
        id: deleteId,
        name: 'delete-san',
        mail: 'delete@gmail.com',
      }
      const nonDeleteId = createRandomIdString()
      const nonDeleteUser = {
        id: nonDeleteId,
        name: 'non-delete-san',
        mail: 'non-delete@gmail.com',
      }
      await prisma.user.create({ data: deleteUser })
      await prisma.user.create({ data: nonDeleteUser })

      // Act
      await userRepository.delete(new User(deleteUser))
      const actual = await prisma.user.findMany({})

      // Assert
      expect(actual).toHaveLength(1)
      expect(actual[0]).toEqual(nonDeleteUser)
    })
  })
})
