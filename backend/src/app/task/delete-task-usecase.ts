import { Task } from 'src/domain/task/entity/task'
import { ITaskQS } from './query-service-interface/task-qs'
import { ITaskRepository } from './repository-interface/task-repository'

export class DeleteTaskUseCase {
  private readonly taskRepo: ITaskRepository
  private readonly taskQS: ITaskQS

  public constructor(taskRepo: ITaskRepository, taskQS: ITaskQS) {
    this.taskRepo = taskRepo
    this.taskQS = taskQS
  }

  public async do(params: { id: string }): Promise<void> {
    const { id } = params

    const taskDTO = await this.taskQS.findById(id)
    if (!taskDTO) {
      throw Error('idに該当する課題が存在しません')
    }
    const taskEntity = new Task({
      id: taskDTO.id,
      title: taskDTO.title,
      content: taskDTO.content,
    })
    await this.taskRepo.delete(taskEntity)
  }
}
