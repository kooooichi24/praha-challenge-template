import { PrismaClient, User } from '@prisma/client'
import { UserDTO, IUserQS } from 'src/app/user/query-service-interface/user-qs'

export class UserQS implements IUserQS {
  private prismaClient: PrismaClient
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async getAll(): Promise<UserDTO[]> {
    const allUsersDatas: User[] = await this.prismaClient.user.findMany({
      orderBy: {
        id: 'asc',
      },
    })
    return allUsersDatas.map(
      (userDM) =>
        new UserDTO({
          ...userDM,
        }),
    )
  }

  public async findById(id: string): Promise<UserDTO | undefined> {
    const user = await this.prismaClient.user.findUnique({
      where: {
        id,
      },
    })
    if (!user) {
      return undefined
    }

    return new UserDTO({ id: user.id, name: user.name, mail: user.mail })
  }
}
