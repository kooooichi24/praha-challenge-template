import { UniqueEntityID } from 'src/domain/shared/UniqueEntityID'
import { User } from 'src/domain/user/user'
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
    if (!userDTO) {
      throw Error('idに該当するユーザーが存在しません')
    }
    const userEntity = User.create(
      { ...userDTO },
      new UniqueEntityID(userDTO.id),
    )
    await this.userRepo.delete(userEntity)
  }
}
