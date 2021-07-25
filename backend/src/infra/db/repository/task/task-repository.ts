import { PrismaClient } from '@prisma/client'
import { ITaskRepository } from 'src/app/task/repository-interface/task-repository'
import { Task } from 'src/domain/task/entity/task'

export class TaskRepository implements ITaskRepository {
  private prismaClient: PrismaClient

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async save(taskEntity: Task): Promise<Task> {
    throw new Error('Method not implemented.')
  }

  public async getByTitle(title: string): Promise<Task | undefined> {
    throw new Error('Method not implemented.')
  }

  // public async save(userEntity: User): Promise<User> {
  //   const { id, name, mail, status } = userEntity.getAllProperties()
  //   const savedUserDataModel = await this.prismaClient.users.create({
  //     data: {
  //       id,
  //       name,
  //       mail,
  //       status,
  //     },
  //   })

  //   const savedUserEntity = new User({
  //     ...savedUserDataModel,
  //   })
  //   return savedUserEntity
  // }
}
