import { Pair } from 'src/domain/pair/pair'
import { UserId } from 'src/domain/user/userId'

export interface IPairRepository {
  findByUserId(userId: UserId): Promise<Pair | undefined>
  findByPairId(pairId: string): Promise<Pair | null>
  findOneMinimumPair(): Promise<Pair | null>
  save(pair: Pair): Promise<void>
  delete(pair: Pair): Promise<void>
}
