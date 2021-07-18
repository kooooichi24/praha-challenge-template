import { User } from 'src/domain/user/entity/user'
import { IUserQS } from './query-service-interface/user-qs'
import { IUserRepository } from './repository-interface/user-repository'

export class DeleteUserUseCase {
  private readonly userRepo: IUserRepository
  private readonly userQS: IUserQS
  public constructor(userRepo: IUserRepository, userQS: IUserQS) {
    this.userRepo = userRepo
    this.userQS = userQS
  }
  public async do(params: { id: string }): Promise<void> {
    const { id } = params
    const userDTO = await this.userQS.findById(id)
    const userEntity = new User({
      id: userDTO.id,
      mail: userDTO.mail,
      name: userDTO.name,
    })

    await this.userRepo.delete(userEntity)
  }
}
