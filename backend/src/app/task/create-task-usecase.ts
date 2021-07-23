import { Task } from 'src/domain/task/entity/task'
import { ITaskRepository } from './repository-interface/task-repository'

export class CreateTaskUseCase {
  private readonly taskRepo: ITaskRepository

  public constructor(taskRepo: ITaskRepository) {
    this.taskRepo = taskRepo
  }

  public async do(params: { title: string; content: string }): Promise<Task> {
    // const { name, mail } = params
    // const userEntity = new User({
    //   id: createRandomIdString(),
    //   name,
    //   mail,
    // })
    // await this.userService.duplicateMailCheck(userEntity)
    // await this.userRepo.save(userEntity)
    // throw Error('not yet')
    return new Task({
      id: '1',
      title: 'title',
      content: 'content',
      status: 'TODO',
    })
  }
}
