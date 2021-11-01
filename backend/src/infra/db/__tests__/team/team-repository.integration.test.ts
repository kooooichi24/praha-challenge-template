import { prisma } from '@testUtil/prisma'
import { UniqueEntityID } from 'src/domain/shared/UniqueEntityID'
import { UserId } from 'src/domain/user/userId'
import { uuid as uuidv4 } from 'uuidv4'
import { Team } from 'src/domain/team/team'
import { PairId } from 'src/domain/pair/pairId'
import { TeamName } from 'src/domain/team/teamName'
import { TeamRepository } from '../../repository/team/team-repository'

jest.mock('uuidv4')

describe('team-repository.integration.ts', () => {
  const mockUuidv4 = uuidv4 as jest.Mock
  const mockUuidv4Response = '3f86f7dd-d67f-4516-afba-8021d7696462'
  const teamRepository = new TeamRepository(prisma)

  beforeEach(async () => {
    mockUuidv4.mockImplementation(() => mockUuidv4Response)
    await setBaseDb()
  })

  afterEach(async () => {
    await prisma.users.deleteMany({})
    await prisma.userBelongingPair.deleteMany({})
    await prisma.pairs.deleteMany({})
    await prisma.pairBelongingTeam.deleteMany({})
    await prisma.teams.deleteMany({})
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('getByUserId', () => {
    test('[正常系] ユーザが所属するチームを取得できること', async () => {
      // Arrange
      const expected = Team.create(
        {
          name: TeamName.create(1),
          belongingPairIds: [
            PairId.create(new UniqueEntityID('pair1')),
            PairId.create(new UniqueEntityID('pair2')),
          ],
          belongingUserIds: [
            UserId.create(new UniqueEntityID('user1')),
            UserId.create(new UniqueEntityID('user2')),
            UserId.create(new UniqueEntityID('user3')),
            UserId.create(new UniqueEntityID('user4')),
            UserId.create(new UniqueEntityID('user5')),
          ],
        },
        new UniqueEntityID('team1'),
      )
      console.log('expected: ', expected)

      // Act
      const userIdArgs = UserId.create(new UniqueEntityID('user1'))
      const actual = await teamRepository.findByUserId(userIdArgs)

      // Assert
      expect(actual).toEqual(expected)
    })

    test('[正常系] ユーザが所属していない場合、nullを返すこと', async () => {
      // Arrange
      // Act
      const userIdArgs = UserId.create(new UniqueEntityID('999999'))
      const actual = await teamRepository.findByUserId(userIdArgs)

      // Assert
      expect(actual).toBeNull()
    })
  })

  // describe('save', () => {
  //   test('[正常系] pairとuserBelongingPairが保存されること', async () => {
  //     // Arrange
  //     await prisma.users.createMany({
  //       data: [
  //         {
  //           id: '100',
  //           name: 'test100',
  //           mail: 'test100@example.com',
  //         },
  //         {
  //           id: '101',
  //           name: 'test101',
  //           mail: 'test101@example.com',
  //         },
  //       ],
  //     })

  //     const expectedPair: Pairs = {
  //       id: '200',
  //       name: 'a',
  //     }
  //     const expectedUserBelongingPair: UserBelongingPair[] = [
  //       {
  //         pairId: '200',
  //         userId: '100',
  //       },
  //       {
  //         pairId: '200',
  //         userId: '101',
  //       },
  //     ]

  //     // Act
  //     const pairArgs = Pair.create(
  //       {
  //         name: PairName.create('a'),
  //         belongingUsers: BelongingUsers.create({
  //           userIds: [
  //             UserId.create(new UniqueEntityID('100')),
  //             UserId.create(new UniqueEntityID('101')),
  //           ],
  //         }),
  //       },
  //       new UniqueEntityID('200'),
  //     )
  //     await pairRepository.save(pairArgs)
  //     const actualPair = await prisma.pairs.findMany({})
  //     const actualUserBelongingPair = await prisma.userBelongingPair.findMany(
  //       {},
  //     )

  //     // Assert
  //     expect(actualPair).toHaveLength(1)
  //     expect(actualPair[0]).toEqual(expectedPair)
  //     expect(actualUserBelongingPair).toHaveLength(2)
  //     expect(actualUserBelongingPair).toEqual(expectedUserBelongingPair)
  //   })
  // })
})

async function setBaseDb(): Promise<void> {
  await prisma.users.createMany({
    data: [
      {
        id: 'user1',
        name: 'user1',
        mail: 'user1@example.com',
        status: 'ENROLLMENT',
      },
      {
        id: 'user2',
        name: 'user2',
        mail: 'user2@example.com',
        status: 'ENROLLMENT',
      },
      {
        id: 'user3',
        name: 'user3',
        mail: 'user3@example.com',
        status: 'ENROLLMENT',
      },
      {
        id: 'user4',
        name: 'user4',
        mail: 'user4@example.com',
        status: 'ENROLLMENT',
      },
      {
        id: 'user5',
        name: 'user5',
        mail: 'user5@example.com',
        status: 'ENROLLMENT',
      },
    ],
  })
  await prisma.pairs.createMany({
    data: [
      {
        id: 'pair1',
        name: 'a',
      },
      {
        id: 'pair2',
        name: 'b',
      },
    ],
  })
  await prisma.userBelongingPair.createMany({
    data: [
      {
        pairId: 'pair1',
        userId: 'user1',
      },
      {
        pairId: 'pair1',
        userId: 'user2',
      },
      {
        pairId: 'pair2',
        userId: 'user3',
      },
      {
        pairId: 'pair2',
        userId: 'user4',
      },
      {
        pairId: 'pair2',
        userId: 'user5',
      },
    ],
  })
  await prisma.teams.createMany({
    data: [
      {
        id: 'team1',
        name: 1,
      },
    ],
  })
  await prisma.pairBelongingTeam.createMany({
    data: [
      {
        teamId: 'team1',
        pairId: 'pair1',
      },
      {
        teamId: 'team1',
        pairId: 'pair2',
      },
    ],
  })
}
