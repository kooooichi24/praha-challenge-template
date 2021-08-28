import { User } from 'src/domain/user/entity/user'
import { ITaskStatusRepository } from '../task-status/repository-interface/task-status-repository'
import { IUserQS } from './query-service-interface/user-qs'
import { IUserRepository } from './repository-interface/user-repository'

export class DeleteUserUseCase {
  private readonly userRepo: IUserRepository
  private readonly userQS: IUserQS
  private readonly taskStatusRepo: ITaskStatusRepository

  public constructor(
    userRepo: IUserRepository,
    userQS: IUserQS,
    taskStatusRepo: ITaskStatusRepository,
  ) {
    this.userRepo = userRepo
    this.userQS = userQS
    this.taskStatusRepo = taskStatusRepo
  }

  public async do(params: { id: string }): Promise<void> {
    const { id } = params

    const userDTO = await this.userQS.findById(id)
    if (!userDTO) {
      throw Error('idに該当するユーザーが存在しません')
    }
    const userEntity = new User({ ...userDTO })
    await this.userRepo.delete(userEntity)

    const taskStatusList = await this.taskStatusRepo.getByUserId(id)
    if (!taskStatusList || taskStatusList.length === 0) {
      return
    }
    await this.taskStatusRepo.deleteAll(taskStatusList)
  }
}
