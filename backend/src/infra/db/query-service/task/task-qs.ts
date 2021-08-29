import { PrismaClient } from '@prisma/client'
import { ITaskQS, TaskDTO } from 'src/app/task/query-service-interface/task-qs'

export class TaskQS implements ITaskQS {
  private prismaClient: PrismaClient

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async findById(id: string): Promise<TaskDTO | undefined> {
    throw new Error('Method not implemented.')
  }
}
