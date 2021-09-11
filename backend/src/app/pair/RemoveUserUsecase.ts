import { UserId } from 'src/domain/user/userId'
import { UseCase } from '../shared/UseCase'

interface Request {
  userId: UserId
}

export class RemoveUserUsecase implements UseCase<Request, Promise<void>> {
  constructor() {}

  public async do(req: Request): Promise<void> {
    console.log('called AddUserUsecase.do()')
    // const pair = pairRepo.findByUserId(req.userId)
    // pair.removeUser(userId)
    // await this.pairRepo.save(pair)
  }
}
