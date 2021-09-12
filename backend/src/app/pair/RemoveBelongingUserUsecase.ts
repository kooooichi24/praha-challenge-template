import { Pair } from 'src/domain/pair/pair'
import { UniqueEntityID } from 'src/domain/shared/UniqueEntityID'
import { UserId } from 'src/domain/user/userId'
import { UseCase } from '../shared/UseCase'
import { IPairRepository } from './repository-interface/IPairRepository'

interface Request {
  userId: UserId
}

export class RemoveBelongingUserUsecase
  implements UseCase<Request, Promise<void>>
{
  private readonly pairRepo: IPairRepository

  constructor(pairRepo: IPairRepository) {
    this.pairRepo = pairRepo
  }

  public async do(req: Request): Promise<void> {
    console.log('called RemoveBelongingUserUsecase.do()')

    const pair = await this.pairRepo.findByUserId(req.userId)
    if (!pair) {
      throw Error('ユーザが所属しているペアが見つかりません')
    }

    try {
      pair.removeUser(req.userId)
    } catch (e) {
      const targetPair = await this.pairRepo.findOneMinimumPair()
      if (!targetPair) {
        throw Error('ペアを取得できませんでした')
      }

      const lastUserId = this.getLastUserId(pair, req.userId)
      targetPair.addUser(lastUserId)

      await this.pairRepo.save(targetPair)
      await this.pairRepo.delete(pair)
      return
    }

    await this.pairRepo.save(pair)
  }

  private getLastUserId(pair: Pair, userId: UserId): UserId {
    const lastUserId = pair.belongingUsers.userIds
      .filter((uid: UserId) => !uid.equals(userId))[0]
      ?.id.toString()

    return UserId.create(new UniqueEntityID(lastUserId))
  }
}
