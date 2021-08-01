import { UserTaskStatus } from 'src/domain/user-task-status/entity/user-task-status'
import { ITaskStatusRepository } from './repository-interface/task-status-repository'

export class UpdateUserTaskStatusUseCase {
  private readonly taskStatusRepo: ITaskStatusRepository

  public constructor(taskStatusRepo: ITaskStatusRepository) {
    this.taskStatusRepo = taskStatusRepo
  }

  public async do(params: {
    userId: string
    taskId: string
    status: 'TODO' | 'REVIEWING' | 'DONE'
  }): Promise<UserTaskStatus> {
    const { userId, taskId, status } = params

    return new UserTaskStatus({ userId: '1', taskId: '1', status: 'TODO' })
  }
}
