import {
  PairBelongingTeam,
  PrismaClient,
  UserBelongingTeam,
} from '@prisma/client'
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
        belongingUserIds = belongingUserIds.concat(
          UserId.create(new UniqueEntityID(ubp.userId)),
        )
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

  async findOneMinimumTeam(): Promise<Team | null> {
    const teamId = await this.prismaClient.userBelongingTeam.groupBy({
      by: ['teamId'],
      _count: {
        teamId: true,
      },
      orderBy: {
        _count: {
          teamId: 'asc',
        },
      },
      take: 1,
    })

    if (!teamId || teamId.length === 0) {
      return null
    }

    const team = await this.prismaClient.teams.findUnique({
      where: {
        id: teamId[0]?.teamId,
      },
      include: {
        UserBelongingTeam: true,
        PairBelongingTeam: true,
      },
    })
    if (!team) {
      return null
    }

    const belongingUserIds = team.UserBelongingTeam.map(
      (ubt: UserBelongingTeam) => {
        return UserId.create(new UniqueEntityID(ubt.userId))
      },
    )
    const belongingPairIds = team.PairBelongingTeam.map(
      (pbt: PairBelongingTeam) => {
        return PairId.create(new UniqueEntityID(pbt.pairId))
      },
    )
    return Team.create(
      {
        name: TeamName.create(team.name),
        belongingUserIds,
        belongingPairIds,
      },
      new UniqueEntityID(team.id),
    )
  }

  async save(team: Team): Promise<void> {
    const task1 = this.prismaClient.teams.deleteMany({
      where: {
        id: team.id.toString(),
      },
    })
    const task2 = this.prismaClient.teams.create({
      data: {
        id: team.id.toString(),
        name: team.name.value,
      },
    })

    const datas: PairBelongingTeam[] = team.belongingPairIds.map(
      (pairId: PairId) => {
        return {
          teamId: team.teamId.id.toString(),
          pairId: pairId.id.toString(),
        }
      },
    )
    const task3 = this.prismaClient.pairBelongingTeam.createMany({
      data: datas,
    })

    const userBelongingTeamDatas: UserBelongingTeam[] =
      team.belongingUserIds.map((userId: UserId) => {
        return {
          teamId: team.teamId.id.toString(),
          userId: userId.id.toString(),
        }
      })
    const task4 = this.prismaClient.userBelongingTeam.createMany({
      data: userBelongingTeamDatas,
    })

    await this.prismaClient.$transaction([task1, task2, task3, task4])
  }

  async delete(team: Team): Promise<void> {
    const task1 = this.prismaClient.teams.deleteMany({
      where: {
        id: team.id.toString(),
      },
    })

    await this.prismaClient.$transaction([task1])
  }
}
