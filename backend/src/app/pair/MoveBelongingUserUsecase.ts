import { UniqueEntityID } from 'src/domain/shared/UniqueEntityID'
import { UserId } from 'src/domain/user/userId'
import { UseCase } from '../shared/UseCase'
import { IPairRepository } from './repository-interface/IPairRepository'

interface Request {
  currentPairId: string
  userIds: UserId[]
}

export class MoveBelongingUserUsecase
  implements UseCase<Request, Promise<void>>
{
  private readonly pairRepo: IPairRepository

  constructor(pairRepo: IPairRepository) {
    this.pairRepo = pairRepo
  }

  public async do(req: Request): Promise<void> {
    console.log('called MoveBelongingUserUsecase.do()')

    const currentPair = await this.pairRepo.findByPairId(req.currentPairId)

    if (currentPair.belongingUsers.userIds.length === 1) {
      const targetPair = await this.pairRepo.findOneMinimumPair()
      targetPair.addUser(
        UserId.create(new UniqueEntityID(req.userIds[0]?.id.toString())),
      )
      await this.pairRepo.save(targetPair)
      await this.pairRepo.delete(currentPair)
    }
  }
}
