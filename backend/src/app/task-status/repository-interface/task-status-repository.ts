import { UserTaskStatus } from 'src/domain/user-task-status/entity/user-task-status'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITaskStatusRepository {
  getByUserId(userId: string): Promise<UserTaskStatus[]>
}
