import { User } from 'src/domain/user/entity/user'
import { createRandomIdString } from 'src/util/random'
import { IUserQS } from './query-service-interface/user-qs'
import { IUserRepository } from './repository-interface/user-repository'

export class UpdateUserStateUseCase {
  private readonly userRepo: IUserRepository
  private readonly userQS: IUserQS
  public constructor(userRepo: IUserRepository, userQS: IUserQS) {
    this.userRepo = userRepo
    this.userQS = userQS
  }

  public async do(params: { id: string; status: string }): Promise<User> {
    // const { id, status } = params

    // const userEntity = new User({
    //   id: createRandomIdString(),
    //   name,
    //   mail,
    // })
    // await this.userRepo.save(userEntity)
    return new User({
      id: '1',
      name: 'name',
      mail: 'mail',
      status: 'RECESS',
    })
  }
}
