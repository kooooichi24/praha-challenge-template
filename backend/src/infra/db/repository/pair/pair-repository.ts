import { PrismaClient, UserBelongingPair } from '@prisma/client'
import { IPairRepository } from 'src/app/pair/repository-interface/IPairRepository'
import { BelongingUsers } from 'src/domain/pair/belongingUserIds'
import { Pair } from 'src/domain/pair/pair'
import { PairName } from 'src/domain/pair/pairName'
import { DomainEvents } from 'src/domain/shared/events/DomainEvents'
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
    if (!userBelongingPair) {
      return undefined
    }
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

  async findByPairId(pairId: string): Promise<Pair | null> {
    const pair = await this.prismaClient.pairs.findUnique({
      where: {
        id: pairId,
      },
      include: {
        UserBelongingPair: true,
      },
    })
    if (!pair) {
      return null
    }

    const userIds: UserId[] = pair.UserBelongingPair.map(
      (ubp: UserBelongingPair) => {
        return UserId.create(new UniqueEntityID(ubp.userId))
      },
    )

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

  async findOneMinimumPair(): Promise<Pair | null> {
    const pairId = await this.prismaClient.userBelongingPair.groupBy({
      by: ['pairId'],
      orderBy: {
        pairId: 'asc',
      },
      having: {
        pairId: {
          _count: {
            lte: 2,
          },
        },
      },
      take: 1,
    })

    const pair = await this.prismaClient.pairs.findFirst({
      where: {
        id: pairId[0]?.pairId,
      },
      include: {
        UserBelongingPair: true,
      },
    })
    if (!pair) {
      return null
    }

    const userIds: UserId[] = pair.UserBelongingPair.map(
      (ubp: UserBelongingPair) => {
        return UserId.create(new UniqueEntityID(ubp.userId))
      },
    )
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

  async save(pair: Pair): Promise<void> {
    const task1 = this.prismaClient.pairs.deleteMany({
      where: {
        id: pair.id.toString(),
      },
    })
    const task2 = this.prismaClient.userBelongingPair.deleteMany({
      where: {
        pairId: pair.id.toString(),
      },
    })

    const task3 = this.prismaClient.pairs.create({
      data: {
        id: pair.id.toString(),
        name: pair.name.value,
      },
    })

    const datas: UserBelongingPair[] = pair.belongingUsers.userIds.map(
      (userId: UserId) => {
        return {
          pairId: pair.pairId.id.toString(),
          userId: userId.id.toString(),
        }
      },
    )
    const task4 = this.prismaClient.userBelongingPair.createMany({
      data: datas,
    })

    await this.prismaClient.$transaction([task1, task2, task3, task4])
  }

  async delete(pair: Pair): Promise<void> {
    const task1 = this.prismaClient.pairs.deleteMany({
      where: {
        id: pair.id.toString(),
      },
    })
    const task2 = this.prismaClient.userBelongingPair.deleteMany({
      where: {
        pairId: pair.id.toString(),
      },
    })

    await this.prismaClient.$transaction([task1, task2])
  }
}
