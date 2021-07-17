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
    // return allUsersDatas.map(
    //   (userDM: User) =>
    //     new AllUsersDTO({
    //       ...userDM,
    //     }),
    // )
    return await [
      {
        id: '1',
        name: 'furukawa',
        mail: 'furukawa@gmai.com',
      },
      {
        id: '2',
        name: 'nakano',
        mail: 'nakano@gmai.com',
      },
      {
        id: '3',
        name: 'sasaki',
        mail: 'sasaki@gmai.com',
      },
    ]
  }
}
