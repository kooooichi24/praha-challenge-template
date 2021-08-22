import { PrismaClient, Users } from '@prisma/client'
import { UserDTO, IUserQS } from 'src/app/user/query-service-interface/user-qs'

export class UserQS implements IUserQS {
  private prismaClient: PrismaClient
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async findAll(): Promise<UserDTO[]> {
    const allUsersDatas: Users[] = await this.prismaClient.users.findMany({
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
    const userData = await this.prismaClient.users.findUnique({
      where: {
        id,
      },
    })
    if (!userData) {
      return undefined
    }

    return new UserDTO({ ...userData })
  }
}
