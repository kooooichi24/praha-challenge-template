import { PrismaClient, User } from '@prisma/client'
import {
  AllUsersDTO,
  IAllUsersQS,
} from 'src/app/user/query-service-interface/all-users-qs'

export class AllUsersQS implements IAllUsersQS {
  private prismaClient: PrismaClient
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async getAll(): Promise<AllUsersDTO[]> {
    const allUsersDatas: User[] = await this.prismaClient.user.findMany()
    return allUsersDatas.map(
      (userDM: User) =>
        new AllUsersDTO({
          ...userDM,
        }),
    )
  }
}
