import { User } from 'src/domain/user/entity/user'
import { UserService } from 'src/domain/user/service/user-service'
import { createRandomIdString } from 'src/util/random'
import { IUserRepository } from './repository-interface/user-repository'

export class CreateUserUsecase {
  private readonly userRepo: IUserRepository
  private readonly userService: UserService

  public constructor(userRepo: IUserRepository) {
    this.userRepo = userRepo
    this.userService = new UserService(this.userRepo)
  }
  public async do(params: { name: string; mail: string }): Promise<void> {
    const { name, mail } = params
    const userEntity = new User({
      id: createRandomIdString(),
      name,
      mail,
    })
    await this.userService.duplicateMailCheck(userEntity)

    await this.userRepo.save(userEntity)
  }
}
