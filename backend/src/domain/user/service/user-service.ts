import { IUserRepository } from 'src/app/user/repository-interface/user-repository'
import { User } from '../entity/user'

export class UserService {
  private readonly userRepo: IUserRepository

  public constructor(userRepo: IUserRepository) {
    this.userRepo = userRepo
  }

  public async duplicateMailCheck(userEntity: User): Promise<void> {
    const { mail } = userEntity.getAllProperties()
    const result = await this.userRepo.getByMail(mail)

    if (result != undefined) {
      throw Error('メールアドレスが重複しています!')
    }
  }
}
