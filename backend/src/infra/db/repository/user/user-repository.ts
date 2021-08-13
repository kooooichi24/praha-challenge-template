import { PrismaClient } from '@prisma/client'
import { IUserRepository } from 'src/app/user/repository-interface/user-repository'
import { User } from 'src/domain/user/entity/user'

export class UserRepository implements IUserRepository {
  private prismaClient: PrismaClient

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async findAll(): Promise<User[]> {
    const usersData = await this.prismaClient.users.findMany({
      orderBy: {
        id: 'asc',
      },
    })

    const usersEntity = usersData.map((user) => {
      return new User({ ...user })
    })

    return usersEntity
  }

  public async getByMail(mail: string): Promise<User | undefined> {
    const userData = await this.prismaClient.users.findUnique({
      where: {
        mail,
      },
    })
    if (!userData) {
      return undefined
    }

    return new User({ ...userData })
  }

  public async save(userEntity: User): Promise<User> {
    const { id, name, mail, status } = userEntity.getAllProperties()
    const savedUserDataModel = await this.prismaClient.users.create({
      data: {
        id,
        name,
        mail,
        status,
      },
    })

    const savedUserEntity = new User({
      ...savedUserDataModel,
    })
    return savedUserEntity
  }

  public async delete(userEntity: User): Promise<User> {
    const { id } = userEntity.getAllProperties()
    const deletedUserDataModel = await this.prismaClient.users.delete({
      where: { id },
    })

    const deleteUserEntity = new User({
      ...deletedUserDataModel,
    })
    return deleteUserEntity
  }

  public async updateStatus(userEntity: User): Promise<User> {
    const { id, status } = userEntity.getAllProperties()
    const updatedUserDataModel = await this.prismaClient.users.update({
      where: { id },
      data: { status },
    })

    const updatedUserEntity = new User({ ...updatedUserDataModel })
    return updatedUserEntity
  }

  public async exist(userId: string): Promise<boolean> {
    const found = await this.prismaClient.users.findUnique({
      where: { id: userId },
    })

    if (found) {
      return true
    }
    return false
  }
}
