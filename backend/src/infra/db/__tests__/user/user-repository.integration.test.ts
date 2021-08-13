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

  describe('findAll', () => {
    afterEach(async () => {
      await prisma.users.deleteMany({})
    })
    test('[正常系] ユーザが存在する場合、全てのユーザーを返却すること', async () => {
      // Arrange
      const expected = [
        new User({
          id: '1',
          name: 'name1',
          mail: 'mail1@gmai.com',
          status: 'ENROLLMENT',
        }),
        new User({
          id: '2',
          name: 'name2',
          mail: 'mail2@gmai.com',
          status: 'RECESS',
        }),
        new User({
          id: '3',
          name: 'name3',
          mail: 'mail3@gmai.com',
          status: 'LEFT',
        }),
      ]
      await Promise.all(
        expected.map(async (user: User) => {
          const { id, name, mail, status } = user.getAllProperties()
          await prisma.users.create({
            data: {
              id,
              name,
              mail,
              status,
            },
          })
        }),
      )

      // Act
      const actual = await userRepository.findAll()

      // Assert
      expect(actual).toStrictEqual(expected)
    })
  })

  describe('getByMail', () => {
    afterEach(async () => {
      await prisma.users.deleteMany({})
    })

    it('[正常系] mailに一致したユーザが存在する場合、ユーザエンティティを返却すること', async () => {
      // Arrange
      const expectedUserEntity = new User({
        id: createRandomIdString(),
        name: 'namae-san',
        mail: 'test@gmail.com',
        status: 'ENROLLMENT',
      })
      await prisma.users.create({ data: expectedUserEntity.getAllProperties() })

      // Act
      const actual = await userRepository.getByMail('test@gmail.com')

      // Assert
      expect(actual).toEqual(expectedUserEntity)
    })

    it('[正常系] mailに一致したユーザが存在しない場合、undefinedを返却すること', async () => {
      // Arrange
      const preData = new User({
        id: createRandomIdString(),
        name: 'namae-san',
        mail: 'not-match-mail@gmail.com',
        status: 'ENROLLMENT',
      })
      await prisma.users.create({ data: preData.getAllProperties() })

      // Act
      const actual = await userRepository.getByMail('test@gmail.com')

      // Assert
      expect(actual).toEqual(undefined)
    })
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

  describe('exist', () => {
    afterEach(async () => {
      await prisma.users.deleteMany({})
    })

    it('[正常系]: ユーザが存在している場合、trueを返すこと', async () => {
      // Arrange
      const targetId = createRandomIdString()
      const userEntity = new User({
        id: targetId,
        name: 'testName',
        mail: 'test@gmail.com',
        status: 'ENROLLMENT',
      })
      await prisma.users.create({ data: userEntity.getAllProperties() })

      // Act
      const actual = await userRepository.exist(targetId)

      // Assert
      expect(actual).toBeTruthy()
    })

    it('[正常系]: ユーザが存在していない場合、falseを返すこと', async () => {
      // Arrange
      const userEntity = new User({
        id: createRandomIdString(),
        name: 'testName',
        mail: 'test@gmail.com',
        status: 'ENROLLMENT',
      })
      await prisma.users.create({ data: userEntity.getAllProperties() })

      // Act
      const actual = await userRepository.exist('evalId')

      // Assert
      expect(actual).toBeFalsy()
    })
  })
})
