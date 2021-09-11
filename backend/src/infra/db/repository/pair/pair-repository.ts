import { PrismaClient } from '@prisma/client'
import { IPairRepository } from 'src/app/pair/repository-interface/IPairRepository'
import { Pair } from 'src/domain/pair/pair'
import { UserId } from 'src/domain/user/userId'

export class PairRepository implements IPairRepository {
  private prismaClient: PrismaClient

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  findByUserId(userId: UserId): Promise<Pair> {
    throw new Error('Method not implemented.')
  }

  save(pair: Pair): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
