import { PrismaClient } from '@prisma/client'
import { ITeamRepository } from 'src/app/team/repository-interface/ITeamRepository'
import { PairId } from 'src/domain/pair/pairId'
import { UniqueEntityID } from 'src/domain/shared/UniqueEntityID'
import { Team } from 'src/domain/team/team'
import { TeamName } from 'src/domain/team/teamName'
import { UserId } from 'src/domain/user/userId'

export class TeamRepository implements ITeamRepository {
  private prismaClient: PrismaClient

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  save(team: Team): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findByUserId(userId: UserId): Promise<Team | null> {
    const userBelongingPair =
      await this.prismaClient.userBelongingPair.findFirst({
        where: {
          userId: userId.id.toString(),
        },
      })

    if (!userBelongingPair) return null
    // 本当は1クエリで取得したい
    const pair = await this.prismaClient.pairs.findFirst({
      where: {
        id: userBelongingPair.pairId,
      },
      include: {
        UserBelongingPair: true,
      },
    })
    if (!pair) return null
    const pairBelongingTeam =
      await this.prismaClient.pairBelongingTeam.findFirst({
        where: {
          pairId: pair.id,
        },
      })
    if (!pairBelongingTeam) return null
    const teamData = await this.prismaClient.teams.findFirst({
      where: {
        id: pairBelongingTeam.teamId,
      },
      include: {
        PairBelongingTeam: {
          include: {
            Pair: {
              include: {
                UserBelongingPair: {
                  include: {
                    User: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!teamData) {
      return null
    }

    const belongingPairIds = teamData.PairBelongingTeam.map((pbt) =>
      PairId.create(new UniqueEntityID(pbt.pairId)),
    )

    let belongingUserIds: UserId[] = []
    teamData.PairBelongingTeam.forEach((pbt) => {
      pbt.Pair.UserBelongingPair.forEach((ubp) => {
        belongingUserIds.concat(UserId.create(new UniqueEntityID(ubp.userId)))
      })
    })

    return Team.create(
      {
        name: TeamName.create(teamData.name),
        belongingPairIds,
        belongingUserIds,
      },
      new UniqueEntityID(teamData.id),
    )
  }

  // async save(pair: Pair): Promise<void> {
  //   const task1 = this.prismaClient.pairs.deleteMany({
  //     where: {
  //       id: pair.id.toString(),
  //     },
  //   })
  //   const task2 = this.prismaClient.userBelongingPair.deleteMany({
  //     where: {
  //       pairId: pair.id.toString(),
  //     },
  //   })

  //   const task3 = this.prismaClient.pairs.create({
  //     data: {
  //       id: pair.id.toString(),
  //       name: pair.name.value,
  //     },
  //   })

  //   const datas: UserBelongingPair[] = pair.belongingUsers.userIds.map(
  //     (userId: UserId) => {
  //       return {
  //         pairId: pair.pairId.id.toString(),
  //         userId: userId.id.toString(),
  //       }
  //     },
  //   )
  //   const task4 = this.prismaClient.userBelongingPair.createMany({
  //     data: datas,
  //   })

  //   await this.prismaClient.$transaction([task1, task2, task3, task4])
  // }
}
