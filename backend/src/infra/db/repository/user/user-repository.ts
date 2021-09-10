import { PrismaClient } from '@prisma/client'
import { IUserRepository } from 'src/app/user/repository-interface/user-repository'
import { UniqueEntityID } from 'src/domain/shared/UniqueEntityID'
import { User } from 'src/domain/user/user'

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
      return User.create(
        { name: user.name, mail: user.mail, status: user.status },
        new UniqueEntityID(user.id),
      )
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

    return User.create(
      { name: userData.name, mail: userData.mail, status: userData.status },
      new UniqueEntityID(userData.id),
    )
  }

  public async save(userEntity: User): Promise<void> {
    const { id, name, mail, status } = userEntity.getAllProperties()
    await this.prismaClient.users.create({
      data: {
        id: id.toString(),
        name,
        mail,
        status,
      },
    })
  }

  public async delete(userEntity: User): Promise<void> {
    const { id } = userEntity.getAllProperties()
    await this.prismaClient.users.delete({
      where: { id: id.toString() },
    })
  }

  public async updateStatus(userEntity: User): Promise<User> {
    const { id, status } = userEntity.getAllProperties()
    const updatedUserDataModel = await this.prismaClient.users.update({
      where: { id: id.toString() },
      data: { status },
    })

    const updatedUserEntity = User.create(
      {
        name: updatedUserDataModel.name,
        mail: updatedUserDataModel.mail,
        status: updatedUserDataModel.status,
      },
      new UniqueEntityID(updatedUserDataModel.id),
    )
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
