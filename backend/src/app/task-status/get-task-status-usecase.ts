import { UserTaskStatus } from 'src/domain/user-task-status/entity/user-task-status'
import { ITaskStatusRepository } from './repository-interface/task-status-repository'

export class GetTaskStatusUseCase {
  private readonly taskStatusRepo: ITaskStatusRepository
  public constructor(taskStatusRepo: ITaskStatusRepository) {
    this.taskStatusRepo = taskStatusRepo
  }
  public async do(params: { userId: string }): Promise<UserTaskStatus[]> {
    // throw Error('not yet')
    return [
      new UserTaskStatus({
        userId: '1',
        taskId: '1',
        status: 'TODO',
      }),
    ]
  }
}
