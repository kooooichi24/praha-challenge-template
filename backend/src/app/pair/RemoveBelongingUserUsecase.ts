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

    pair.removeUser(req.userId)
    await this.pairRepo.save(pair)
  }
}
