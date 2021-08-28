import { UserTaskStatus } from 'src/domain/user-task-status/entity/user-task-status'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITaskStatusRepository {
  getByUserId(userId: string): Promise<UserTaskStatus[]>
  getByUserIdAndTaskId(
    userId: string,
    taskId: string,
  ): Promise<UserTaskStatus | undefined>
  save(taskStatus: UserTaskStatus): Promise<void>
  saveAll(taskStatusList: UserTaskStatus[]): Promise<void>
  deleteAll(taskStatusList: UserTaskStatus[]): Promise<void>
}
