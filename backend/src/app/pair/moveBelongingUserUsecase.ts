import { UniqueEntityID } from 'src/domain/shared/UniqueEntityID'
import { UserId } from 'src/domain/user/userId'
import { UseCase } from '../shared/UseCase'
import { IPairRepository } from './repository-interface/IPairRepository'

interface Request {
  userId: string
  to: string
}

export class MoveBelongingUserUsecase
  implements UseCase<Request, Promise<void>>
{
  constructor(private pairRepo: IPairRepository) {}

  public async do(req: Request): Promise<void> {
    console.log('called MoveBelongingUserUsecase.do()')

    const userId = UserId.create(new UniqueEntityID(req.userId))
    const targetPair = await this.pairRepo.findByPairId(req.to)
    const currentPair = await this.pairRepo.findByUserId(userId)

    if (!targetPair || !currentPair) {
      throw Error('存在しません')
    }

    if (targetPair.isMax() || currentPair.isMin()) {
      throw Error('移動できません')
    }

    currentPair.removeUser(userId)
    targetPair.addUser(userId)
    await this.pairRepo.save(currentPair)
    await this.pairRepo.save(targetPair)
  }
}
