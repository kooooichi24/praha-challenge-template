import { PrismaClient } from '@prisma/client'
import { ITaskStatusRepository } from 'src/app/task-status/repository-interface/task-status-repository'

export class TaskStatusRepository implements ITaskStatusRepository {
  private prismaClient: PrismaClient

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }
}
