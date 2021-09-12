import { PrismaClient, UserBelongingPair } from '@prisma/client'
import { IPairRepository } from 'src/app/pair/repository-interface/IPairRepository'
import { BelongingUsers } from 'src/domain/pair/belongingUserIds'
import { Pair } from 'src/domain/pair/pair'
import { PairName } from 'src/domain/pair/pairName'
import { UniqueEntityID } from 'src/domain/shared/UniqueEntityID'
import { UserId } from 'src/domain/user/userId'

export class PairRepository implements IPairRepository {
  private prismaClient: PrismaClient

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  async findByUserId(userId: UserId): Promise<Pair | undefined> {
    const userBelongingPair =
      await this.prismaClient.userBelongingPair.findFirst({
        where: {
          userId: userId.id.toString(),
        },
      })
    // 本当は1クエリで取得したい
    const pair = await this.prismaClient.pairs.findFirst({
      include: {
        UserBelongingPair: {
          where: {
            pairId: userBelongingPair?.pairId,
          },
        },
      },
    })
    if (!pair) {
      return undefined
    }

    const userIds = pair.UserBelongingPair.map((ubp: UserBelongingPair) => {
      return UserId.create(new UniqueEntityID(ubp.userId))
    })
    return Pair.create(
      {
        name: PairName.create(pair.name),
        belongingUsers: BelongingUsers.create({
          userIds,
        }),
      },
      new UniqueEntityID(pair.id),
    )
  }

  save(pair: Pair): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
