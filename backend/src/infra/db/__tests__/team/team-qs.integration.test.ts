import { prisma } from '@testUtil/prisma'
import { PairDTO } from 'src/app/pair/query-service-interface/pair-qs'
import { TeamDTO } from 'src/app/team/query-service-interface/team-qs'
import { TeamQS } from '../../query-service/team/team-qs'

describe('team-qs.integration.ts', () => {
  const teamQS = new TeamQS(prisma)

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

  describe('findAll', () => {
    test('[正常系] 全件teamDTO[]を取得できること', async () => {
      // Arrange
      const expected = [
        new TeamDTO({
          id: 'team1',
          name: 1,
          belongingPairs: [
            {
              id: 'pair1',
              name: 'a',
              belongingUsers: [
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
              ],
            },
            {
              id: 'pair2',
              name: 'b',
              belongingUsers: [
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
            },
          ],
        }),
      ]
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

      // Act
      const actual = await teamQS.findAll()

      // Assert
      expect(actual).toStrictEqual(expected)
    })
  })
})
