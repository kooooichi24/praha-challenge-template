import { UserTaskStatus } from 'src/domain/user-task-status/entity/user-task-status'
import { ITaskStatusRepository } from './repository-interface/task-status-repository'

export class UpdateTaskStatusUsecase {
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

    const taskStatus = await this.taskStatusRepo.getByUserIdAndTaskId(
      userId,
      taskId,
    )
    if (!taskStatus) {
      throw new Error('ユーザIDとタスクIDに該当するタスクは存在しません')
    }

    taskStatus.changeStatus(status)
    await this.taskStatusRepo.save(taskStatus)

    return taskStatus
  }
}
