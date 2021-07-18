import { PrismaClient } from '@prisma/client'
import { IUserRepository } from 'src/app/user/repository-interface/user-repository'
import { User } from 'src/domain/user/entity/user'

export class UserRepository implements IUserRepository {
  private prismaClient: PrismaClient
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async save(userEntity: User): Promise<User> {
    const { id, name, mail } = userEntity.getAllProperties()
    const savedUserDataModel = await this.prismaClient.user.create({
      data: {
        id,
        name,
        mail,
      },
    })

    const savedUserEntity = new User({
      ...savedUserDataModel,
    })
    return savedUserEntity
  }

  public async delete(user: User): Promise<User> {
    return user
  }
}
