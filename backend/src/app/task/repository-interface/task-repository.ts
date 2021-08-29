import { Task } from 'src/domain/task/entity/task'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITaskRepository {
  findAll(): Promise<Task[]>
  save(task: Task): Promise<Task>
  getByTitle(title: string): Promise<Task | undefined>
  delete(task: Task): Promise<void>
  // updateStatus(user: User): Promise<User>
}
