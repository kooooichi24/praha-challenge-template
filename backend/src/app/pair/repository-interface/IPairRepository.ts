import { Pair } from 'src/domain/pair/pair'
import { UserId } from 'src/domain/user/userId'

export interface IPairRepository {
  findByUserId(userId: UserId): Promise<Pair | undefined>
  save(pair: Pair): Promise<void>
}
