import { UserTaskStatus } from 'src/domain/user-task-status/entity/user-task-status'
import { UserService } from 'src/domain/user/service/user-service'
import { IUserRepository } from '../user/repository-interface/user-repository'
import { ITaskStatusRepository } from './repository-interface/task-status-repository'

export class GetTaskStatusUseCase {
  private readonly taskStatusRepo: ITaskStatusRepository
  private readonly userRepo: IUserRepository
  private readonly userService: UserService

  public constructor(
    taskStatusRepo: ITaskStatusRepository,
    userRepo: IUserRepository,
  ) {
    this.taskStatusRepo = taskStatusRepo
    this.userRepo = userRepo
    this.userService = new UserService(this.userRepo)
  }

  public async do(params: { userId: string }): Promise<UserTaskStatus[]> {
    const { userId } = params
    await this.userService.checkExist({ userId })

    return await this.taskStatusRepo.getByUserId(userId)
  }
}
