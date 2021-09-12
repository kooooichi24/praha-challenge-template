import { prisma } from '@testUtil/prisma'
import { UniqueEntityID } from 'src/domain/shared/UniqueEntityID'
import { PairRepository } from '../../repository/pair/pair-repository'
import { UserId } from 'src/domain/user/userId'
import { Pair } from 'src/domain/pair/pair'
import { PairName } from 'src/domain/pair/pairName'
import { BelongingUsers } from 'src/domain/pair/belongingUserIds'
import { uuid as uuidv4 } from 'uuidv4'

jest.mock('uuidv4')

describe('pair-repository.integration.ts', () => {
  const mockUuidv4 = uuidv4 as jest.Mock
  const mockUuidv4Response = '3f86f7dd-d67f-4516-afba-8021d7696462'
  const pairRepository = new PairRepository(prisma)

  beforeEach(() => {
    mockUuidv4.mockImplementation(() => mockUuidv4Response)
  })

  afterEach(async () => {
    await prisma.users.deleteMany({})
    await prisma.pairs.deleteMany({})
    await prisma.userBelongingPair.deleteMany({})
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('getByUserId', () => {
    test('[正常系] ユーザが所属するペアを取得できること', async () => {
      // Arrange
      await prisma.users.createMany({
        data: [
          {
            id: '100',
            name: 'test100',
            mail: 'test100@example.com',
          },
          {
            id: '101',
            name: 'test101',
            mail: 'test101@example.com',
          },
        ],
      })
      await prisma.pairs.create({
        data: {
          id: '200',
          name: 'a',
        },
      })
      await prisma.userBelongingPair.createMany({
        data: [
          {
            userId: '100',
            pairId: '200',
          },
          {
            userId: '101',
            pairId: '200',
          },
        ],
      })

      const expected = Pair.create(
        {
          name: PairName.create('a'),
          belongingUsers: BelongingUsers.create({
            userIds: [
              UserId.create(new UniqueEntityID('100')),
              UserId.create(new UniqueEntityID('101')),
            ],
          }),
        },
        new UniqueEntityID('200'),
      )

      // Act
      const userIdArgs = UserId.create(new UniqueEntityID('100'))
      const actual = await pairRepository.findByUserId(userIdArgs)

      // Assert
      expect(actual).toEqual(expected)
    })

    // test('[正常系] mailに一致したユーザが存在しない場合、undefinedを返却すること', async () => {
    //   // Arrange
    //   const preData = User.create({
    //     name: 'namae-san',
    //     mail: 'not-match-mail@gmail.com',
    //     status: 'ENROLLMENT',
    //   })
    //   await prisma.users.create({
    //     data: {
    //       ...preData.getAllProperties(),
    //       id: preData.id.toString(),
    //     },
    //   })

    //   // Act
    //   const actual = await userRepository.getByMail('test@gmail.com')

    //   // Assert
    //   expect(actual).toEqual(undefined)
    // })
  })
})
