import { TaskService } from 'src/domain/task/entity/service/task-service'
import { Task } from 'src/domain/task/entity/task'
import { createRandomIdString } from 'src/util/random'
import { ITaskRepository } from './repository-interface/task-repository'

export class CreateTaskUseCase {
  private readonly taskRepo: ITaskRepository
  private readonly taskService: TaskService

  public constructor(taskRepo: ITaskRepository) {
    this.taskRepo = taskRepo
    this.taskService = new TaskService(taskRepo)
  }

  public async do(params: { title: string; content: string }): Promise<Task> {
    const { title, content } = params
    const taskEntity = new Task({
      id: createRandomIdString(),
      title,
      content,
    })
    await this.taskService.duplicateCheck(taskEntity)

    return await this.taskRepo.save(taskEntity)
  }
}
