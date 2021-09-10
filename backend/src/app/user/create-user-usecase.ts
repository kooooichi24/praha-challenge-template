import { Task } from 'src/domain/task/entity/task'
import { UserTaskStatus } from 'src/domain/user-task-status/entity/user-task-status'
import { User } from 'src/domain/user/user'
import { UserService } from 'src/domain/user/service/user-service'
import { ITaskStatusRepository } from '../task-status/repository-interface/task-status-repository'
import { ITaskRepository } from '../task/repository-interface/task-repository'
import { IUserRepository } from './repository-interface/user-repository'

export class CreateUserUsecase {
  private readonly userRepo: IUserRepository
  private readonly userService: UserService
  private readonly taskRepo: ITaskRepository
  private readonly taskStatusRepo: ITaskStatusRepository

  public constructor(
    userRepo: IUserRepository,
    taskRepo: ITaskRepository,
    taskStatusRepo: ITaskStatusRepository,
  ) {
    this.userRepo = userRepo
    this.userService = new UserService(this.userRepo)
    this.taskRepo = taskRepo
    this.taskStatusRepo = taskStatusRepo
  }
  public async do(params: { name: string; mail: string }): Promise<void> {
    const { name, mail } = params
    const userEntity = User.create({ name, mail })
    await this.userService.duplicateMailCheck(userEntity)
    await this.userRepo.save(userEntity)

    const tasks: Task[] = await this.taskRepo.findAll()
    const taskStatusList = this.createTaskStatusList(
      tasks,
      userEntity.id.toString(),
    )
    await this.taskStatusRepo.saveAll(taskStatusList)
  }

  private createTaskStatusList(
    tasks: Task[],
    userId: string,
  ): UserTaskStatus[] {
    return tasks.map((task) => {
      const { id } = task.getAllProperties()
      return new UserTaskStatus({ userId, taskId: id, status: 'TODO' })
    })
  }
}
