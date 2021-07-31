import { UserTaskStatus } from 'src/domain/user-task-status/entity/user-task-status'
import { UserConverter } from '../share/converter/user-converter'
import { IUserQS } from '../user/query-service-interface/user-qs'
import { ITaskStatusRepository } from './repository-interface/task-status-repository'

export class GetTaskStatusUseCase {
  private readonly taskStatusRepo: ITaskStatusRepository
  private readonly userQS: IUserQS

  public constructor(taskStatusRepo: ITaskStatusRepository, userQS: IUserQS) {
    this.taskStatusRepo = taskStatusRepo
    this.userQS = userQS
  }
  public async do(params: { userId: string }): Promise<UserTaskStatus> {
    const { userId } = params
    const userDTO = await this.userQS.findById(userId)
    if (!userDTO) {
      throw Error('idに該当するユーザーが存在しません')
    }

    return await this.taskStatusRepo.getByUserId(userId)
  }
}
