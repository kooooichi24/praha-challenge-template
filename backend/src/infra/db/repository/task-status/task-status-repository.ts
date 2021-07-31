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
}
