import { User } from 'src/domain/user/entity/user'
import { UserConverter } from '../share/converter/user-converter'
import { IUserQS } from './query-service-interface/user-qs'
import { IUserRepository } from './repository-interface/user-repository'

export class UpdateUserStateUseCase {
  private readonly userRepo: IUserRepository
  private readonly userQS: IUserQS
  private readonly userConverter: UserConverter

  public constructor(userRepo: IUserRepository, userQS: IUserQS) {
    this.userRepo = userRepo
    this.userQS = userQS
    this.userConverter = new UserConverter()
  }

  public async do(params: {
    id: string
    status: 'ENROLLMENT' | 'RECESS' | 'LEFT'
  }): Promise<User> {
    const { id, status } = params
    const userDTO = await this.userQS.findById(id)
    if (!userDTO) {
      throw Error('idに該当するユーザーが存在しません')
    }

    const userEntity = this.userConverter.convertToEntity(userDTO)
    userEntity.changeStatus(status)
    return await this.userRepo.updateStatus(userEntity)
  }
}
