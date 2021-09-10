import { prisma } from '@testUtil/prisma'
import { UserRepository } from '../../repository/user/user-repository'
import { User } from 'src/domain/user/user'
import { createRandomIdString } from 'src/util/random'
import { UniqueEntityID } from 'src/domain/shared/UniqueEntityID'

describe('user-repository.integration.ts', () => {
  const userRepository = new UserRepository(prisma)

  afterEach(async () => {
    await prisma.users.deleteMany({})
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('findAll', () => {
    test('[正常系] ユーザが存在する場合、全てのユーザーを返却すること', async () => {
      // Arrange
      const expected = [
        User.create(
          {
            name: 'name1',
            mail: 'mail1@gmai.com',
            status: 'ENROLLMENT',
          },
          new UniqueEntityID('1'),
        ),
        User.create(
          {
            name: 'name2',
            mail: 'mail2@gmai.com',
            status: 'RECESS',
          },
          new UniqueEntityID('2'),
        ),
        User.create(
          {
            name: 'name3',
            mail: 'mail3@gmai.com',
            status: 'LEFT',
          },
          new UniqueEntityID('3'),
        ),
      ]
      await Promise.all(
        expected.map(async (user: User) => {
          const { id, name, mail, status } = user.getAllProperties()
          await prisma.users.create({
            data: {
              id: id.toString(),
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
    test('[正常系] mailに一致したユーザが存在する場合、ユーザエンティティを返却すること', async () => {
      // Arrange
      const expectedUserEntity = User.create({
        name: 'namae-san',
        mail: 'test@gmail.com',
        status: 'ENROLLMENT',
      })
      await prisma.users.create({
        data: {
          ...expectedUserEntity.getAllProperties(),
          id: expectedUserEntity.id.toString(),
        },
      })

      // Act
      const actual = await userRepository.getByMail('test@gmail.com')

      // Assert
      expect(actual).toEqual(expectedUserEntity)
    })

    test('[正常系] mailに一致したユーザが存在しない場合、undefinedを返却すること', async () => {
      // Arrange
      const preData = User.create({
        name: 'namae-san',
        mail: 'not-match-mail@gmail.com',
        status: 'ENROLLMENT',
      })
      await prisma.users.create({
        data: {
          ...preData.getAllProperties(),
          id: preData.id.toString(),
        },
      })

      // Act
      const actual = await userRepository.getByMail('test@gmail.com')

      // Assert
      expect(actual).toEqual(undefined)
    })
  })

  describe('save', () => {
    test('[正常系]userを保存できる', async () => {
      // Arrange
      const user = User.create({
        name: 'testName',
        mail: 'test@gmail.com',
        status: 'ENROLLMENT',
      })
      const expected = {
        id: user.id.toString(),
        name: user.getAllProperties().name,
        mail: user.getAllProperties().mail,
        status: user.getAllProperties().status,
      }

      // Act
      await userRepository.save(user)
      const actual = await prisma.users.findMany({})

      // Assert
      expect(actual).toHaveLength(1)
      expect(actual[0]).toEqual(expected)
    })
  })

  describe('delete', () => {
    test('[正常系]idに合致したuserを削除できる', async () => {
      // Arrange
      const deleteUser = User.create({
        name: 'delete-san',
        mail: 'delete@gmail.com',
        status: 'ENROLLMENT',
      })
      const nonDeleteUser = User.create(
        {
          name: 'non-delete-san',
          mail: 'non-delete@gmail.com',
          status: 'ENROLLMENT',
        },
        new UniqueEntityID('1'),
      )
      await prisma.users.create({
        data: {
          ...deleteUser.getAllProperties(),
          id: deleteUser.id.toString(),
        },
      })
      await prisma.users.create({
        data: {
          ...nonDeleteUser.getAllProperties(),
          id: nonDeleteUser.id.toString(),
        },
      })
      const expected = {
        id: '1',
        name: 'non-delete-san',
        mail: 'non-delete@gmail.com',
        status: 'ENROLLMENT',
      }

      // Act
      await userRepository.delete(deleteUser)
      const actual = await prisma.users.findMany({})

      // Assert
      expect(actual).toHaveLength(1)
      expect(actual[0]).toEqual(expected)
    })

    describe('カスケード', () => {
      afterEach(async () => {
        await prisma.tasks.deleteMany({})
        await prisma.userTaskStatus.deleteMany({})
      })
      test('[正常系] ユーザのタスクステータスが存在する場合、カスケード削除されること', async () => {
        // Arrange
        const deleteId = createRandomIdString()
        const deleteUser = User.create(
          {
            name: 'delete-san',
            mail: 'delete@gmail.com',
            status: 'ENROLLMENT',
          },
          new UniqueEntityID(deleteId),
        )

        await prisma.users.create({
          data: {
            ...deleteUser.getAllProperties(),
            id: deleteId,
          },
        })
        await prisma.tasks.create({
          data: {
            id: '1',
            title: 'title',
            content: 'content',
          },
        })
        await prisma.userTaskStatus.create({
          data: {
            userId: deleteId,
            taskId: '1',
            status: 'TODO' as 'TODO' | 'REVIEWING' | 'DONE',
          },
        })

        // Act
        await userRepository.delete(deleteUser)
        const actualUser = await prisma.users.findMany({})
        const actualUserTaskStatus = await prisma.userTaskStatus.findMany({})

        // Assert
        expect(actualUser).toHaveLength(0)
        expect(actualUserTaskStatus).toHaveLength(0)
      })
    })
  })

  describe('updateStatus', () => {
    test('[正常系]: statusを更新できる', async () => {
      // Arrange
      const targetId = createRandomIdString()
      const preUserEntity = User.create(
        {
          name: 'testName',
          mail: 'test@gmail.com',
          status: 'ENROLLMENT',
        },
        new UniqueEntityID(targetId),
      )
      await prisma.users.create({
        data: { ...preUserEntity.getAllProperties(), id: targetId },
      })
      const targetUserEntity = User.create(
        {
          name: 'testName',
          mail: 'test@gmail.com',
          status: 'RECESS',
        },
        new UniqueEntityID(targetId),
      )
      const expected = {
        id: targetId,
        name: 'testName',
        mail: 'test@gmail.com',
        status: 'RECESS',
      }

      // Act
      await userRepository.updateStatus(targetUserEntity)
      const actual = await prisma.users.findMany({})

      // Assert
      expect(actual).toHaveLength(1)
      expect(actual[0]).toEqual(expected)
    })
  })

  describe('exist', () => {
    test('[正常系]: ユーザが存在している場合、trueを返すこと', async () => {
      // Arrange
      const targetId = createRandomIdString()
      const userEntity = User.create(
        {
          name: 'testName',
          mail: 'test@gmail.com',
          status: 'ENROLLMENT',
        },
        new UniqueEntityID(targetId),
      )
      await prisma.users.create({
        data: { ...userEntity.getAllProperties(), id: targetId },
      })

      // Act
      const actual = await userRepository.exist(targetId)

      // Assert
      expect(actual).toBeTruthy()
    })

    test('[正常系]: ユーザが存在していない場合、falseを返すこと', async () => {
      // Arrange
      const userEntity = User.create({
        name: 'testName',
        mail: 'test@gmail.com',
        status: 'ENROLLMENT',
      })
      await prisma.users.create({
        data: {
          ...userEntity.getAllProperties(),
          id: userEntity.id.toString(),
        },
      })

      // Act
      const actual = await userRepository.exist('evalId')

      // Assert
      expect(actual).toBeFalsy()
    })
  })
})
