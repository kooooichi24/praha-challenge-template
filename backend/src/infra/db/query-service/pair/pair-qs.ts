import { PrismaClient } from '@prisma/client'
import { IPairQS, PairDTO } from 'src/app/pair/query-service-interface/pair-qs'

export class PairQS implements IPairQS {
  private prismaClient: PrismaClient
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async findAll(): Promise<PairDTO[]> {
    const allPairsDatas = await this.prismaClient.pairs.findMany({
      include: {
        UserBelongingPair: {
          include: {
            User: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    })

    return allPairsDatas.map((pairDM) => {
      const belongingUsers = pairDM.UserBelongingPair.map((userDM) => {
        return {
          id: userDM.User.id,
          name: userDM.User.name,
          mail: userDM.User.mail,
          status: userDM.User.status,
        }
      })

      return new PairDTO({
        id: pairDM.id,
        name: pairDM.name,
        belongingUsers,
      })
    })
  }
}
