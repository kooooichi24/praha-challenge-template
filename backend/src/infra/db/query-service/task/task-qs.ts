import { PrismaClient } from '@prisma/client'
import { ITaskQS, TaskDTO } from 'src/app/task/query-service-interface/task-qs'

export class TaskQS implements ITaskQS {
  private prismaClient: PrismaClient

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async findById(id: string): Promise<TaskDTO | undefined> {
    const taskData = await this.prismaClient.tasks.findUnique({
      include: {
        UserTask: true,
      },
      where: {
        id,
      },
    })

    if (!taskData) {
      return undefined
    }

    return new TaskDTO({
      id: taskData.id,
      title: taskData.title,
      content: taskData.content,
      tasksStatus: taskData.UserTask,
    })
  }
}
