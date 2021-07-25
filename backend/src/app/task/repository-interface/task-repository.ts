import { Task } from 'src/domain/task/entity/task'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITaskRepository {
  save(task: Task): Promise<Task>
  getByTitle(title: string): Promise<Task | undefined>
  // delete(user: User): Promise<User>
  // updateStatus(user: User): Promise<User>
}
