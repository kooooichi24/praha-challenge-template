import { PrismaClient } from '@prisma/client'
import { PairDTO } from 'src/app/pair/query-service-interface/pair-qs'
import { ITeamQS, TeamDTO } from 'src/app/team/query-service-interface/team-qs'

export class TeamQS implements ITeamQS {
  private prismaClient: PrismaClient

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async findAll(): Promise<TeamDTO[]> {
    const teamDatas = await this.prismaClient.teams.findMany({
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
      orderBy: {
        id: 'asc',
      },
    })

    return teamDatas.map((teamDM) => {
      const belongingPairs = teamDM.PairBelongingTeam.map(
        (pairBelongingTeamDM) => {
          const belongingUsers = pairBelongingTeamDM.Pair.UserBelongingPair.map(
            (userBelongingPairDM) => {
              return {
                id: userBelongingPairDM.User.id,
                name: userBelongingPairDM.User.name,
                mail: userBelongingPairDM.User.mail,
                status: userBelongingPairDM.User.status,
              }
            },
          )

          return {
            id: pairBelongingTeamDM.Pair.id,
            name: pairBelongingTeamDM.Pair.name,
            belongingUsers,
          }
        },
      )

      return new TeamDTO({
        id: teamDM.id,
        name: teamDM.name,
        belongingPairs,
      })
    })
  }
}
