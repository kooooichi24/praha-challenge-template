import { User } from 'src/domain/user/entity/user'
import { createRandomIdString } from 'src/util/random'
import { IUserRepository } from './repository-interface/user-repository'

export class PostUserUseCase {
  private readonly userRepo: IUserRepository
  public constructor(userRepo: IUserRepository) {
    this.userRepo = userRepo
  }
  public async do(params: { name: string; mail: string }): Promise<void> {
    const { name, mail } = params

    const userEntity = new User({
      id: createRandomIdString(),
      name,
      mail,
    })
    await this.userRepo.save(userEntity)
  }
}
