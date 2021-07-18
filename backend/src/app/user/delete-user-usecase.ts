import { IUserRepository } from './repository-interface/user-repository'

export class DeleteUserUseCase {
  private readonly userRepo: IUserRepository
  public constructor(userRepo: IUserRepository) {
    this.userRepo = userRepo
  }
  public async do(params: { id: string }): Promise<void> {
    // const { name, mail } = params
    // const userEntity = new User({
    //   id: createRandomIdString(),
    //   name,
    //   mail,
    // })
    // await this.userRepo.save(userEntity)
  }
}
