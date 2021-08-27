import { PrismaClient, Users } from '@prisma/client'
import { UserDTO, IUserQS } from 'src/app/user/query-service-interface/user-qs'

export class UserQS implements IUserQS {
  private prismaClient: PrismaClient
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async findAll(): Promise<UserDTO[]> {
    const tmp = await this.prismaClient.users.findMany({
      include: {
        UserTask: true,
      },
      orderBy: {
        id: 'asc',
      },
    })
    console.log('includes result: ', tmp)

    const allUsersDatas = await this.prismaClient.users.findMany({
      include: {
        UserTask: true,
      },
      orderBy: {
        id: 'asc',
      },
    })
    return allUsersDatas.map(
      (userDM) =>
        new UserDTO({
          id: userDM.id,
          name: userDM.name,
          mail: userDM.mail,
          status: userDM.status,
          tasksStatus: userDM.UserTask,
        }),
    )
  }

  public async findById(id: string): Promise<UserDTO | undefined> {
    const userData = await this.prismaClient.users.findUnique({
      include: {
        UserTask: true,
      },
      where: {
        id,
      },
    })
    if (!userData) {
      return undefined
    }

    return new UserDTO({
      id: userData.id,
      name: userData.name,
      mail: userData.mail,
      status: userData.status,
      tasksStatus: userData.UserTask,
    })
  }
}
