import { TaskService } from 'src/domain/task/entity/service/task-service'
import { Task } from 'src/domain/task/entity/task'
import { UserTaskStatus } from 'src/domain/user-task-status/entity/user-task-status'
import { User } from 'src/domain/user/user'
import { createRandomIdString } from 'src/util/random'
import { ITaskStatusRepository } from '../task-status/repository-interface/task-status-repository'
import { IUserRepository } from '../user/repository-interface/user-repository'
import { ITaskRepository } from './repository-interface/task-repository'

export class CreateTaskUseCase {
  private readonly taskRepo: ITaskRepository
  private readonly taskService: TaskService
  private readonly userRepo: IUserRepository
  private readonly taskStatusRepo: ITaskStatusRepository

  public constructor(
    taskRepo: ITaskRepository,
    userRepo: IUserRepository,
    taskStatusRepo: ITaskStatusRepository,
  ) {
    this.taskRepo = taskRepo
    this.taskService = new TaskService(taskRepo)
    this.userRepo = userRepo
    this.taskStatusRepo = taskStatusRepo
  }

  public async do(params: { title: string; content: string }): Promise<Task> {
    const { title, content } = params
    const taskId = createRandomIdString()
    const taskEntity = new Task({
      id: taskId,
      title,
      content,
    })
    await this.taskService.duplicateCheck(taskEntity)
    const savedTask = await this.taskRepo.save(taskEntity)

    const users: User[] = await this.userRepo.findAll()
    const userTasksStatusList: UserTaskStatus[] =
      this.convertUsersToTaskStatusList(users, taskId)

    await this.taskStatusRepo.saveAll(userTasksStatusList)

    return savedTask
  }

  private convertUsersToTaskStatusList(
    users: User[],
    taskId: string,
  ): UserTaskStatus[] {
    return users.map((user) => {
      const { id } = user.getAllProperties()
      return new UserTaskStatus({
        userId: id.toString(),
        taskId,
        status: 'TODO',
      })
    })
  }
}
