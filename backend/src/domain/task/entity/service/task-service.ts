import { ITaskRepository } from 'src/app/task/repository-interface/task-repository'
import { Task } from '../task'

export class TaskService {
  private readonly taskRepo: ITaskRepository

  public constructor(taskRepo: ITaskRepository) {
    this.taskRepo = taskRepo
  }

  public async duplicateCheck(taskEntity: Task): Promise<void> {
    const { title } = taskEntity.getAllProperties()
    const result = await this.taskRepo.getByTitle(title)

    if (result != undefined) {
      throw Error('課題タイトルが重複しています!')
    }
  }
}
