import { PrismaClient } from '@prisma/client'
import { ITaskStatusRepository } from 'src/app/task-status/repository-interface/task-status-repository'
import { UserTaskStatus } from 'src/domain/user-task-status/entity/user-task-status'

export class TaskStatusRepository implements ITaskStatusRepository {
  private prismaClient: PrismaClient

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  async getByUserId(userId: string): Promise<UserTaskStatus[]> {
    const userTasksStatus = await this.prismaClient.userTaskStatus.findMany({
      where: {
        userId,
      },
    })

    const result = userTasksStatus.map((userTaskStatus) => {
      return new UserTaskStatus({ ...userTaskStatus })
    })

    return result
  }

  public async getByUserIdAndTaskId(
    userId: string,
    taskId: string,
  ): Promise<UserTaskStatus | undefined> {
    throw new Error('Method not implemented.')
  }

  public async save(taskStatus: UserTaskStatus): Promise<void> {
    const { userId, taskId, status } = taskStatus.getAllProperties()

    await this.prismaClient.userTaskStatus.create({
      data: {
        userId,
        taskId,
        status,
      },
    })
  }

  public async saveAll(taskStatusList: UserTaskStatus[]): Promise<void> {
    const taskStatusDatas = taskStatusList.map((taskStatus) => {
      const { userId, taskId, status } = taskStatus.getAllProperties()
      return {
        userId,
        taskId,
        status,
      }
    })

    await this.prismaClient.userTaskStatus.createMany({
      data: taskStatusDatas,
    })
  }
}
