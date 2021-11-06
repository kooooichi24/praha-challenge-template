import { PrismaClient } from '@prisma/client'
import { PagingCondition, Page } from 'src/app/shared/Paging'
import {
  UserWithTasksStatusDTO,
  IUserQS,
  UserDTO,
} from 'src/app/user/query-service-interface/user-qs'

export class UserQS implements IUserQS {
  private prismaClient: PrismaClient
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }

  public async findAll(): Promise<UserWithTasksStatusDTO[]> {
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
        new UserWithTasksStatusDTO({
          id: userDM.id,
          name: userDM.name,
          mail: userDM.mail,
          status: userDM.status,
          tasksStatus: userDM.UserTask,
        }),
    )
  }

  public async findById(
    id: string,
  ): Promise<UserWithTasksStatusDTO | undefined> {
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

    return new UserWithTasksStatusDTO({
      id: userData.id,
      name: userData.name,
      mail: userData.mail,
      status: userData.status,
      tasksStatus: userData.UserTask,
    })
  }

  async fetchPageByTaskAndStatus(
    taskIds: string[],
    taskStatus: 'TODO' | 'REVIEWING' | 'DONE',
    pagingCondition: PagingCondition,
  ): Promise<Page<UserDTO>> {
    const userDatas = await this.prismaClient.userTaskStatus.findMany({
      where: {
        taskId: { in: taskIds },
        status: taskStatus,
      },
      select: {
        User: true,
      },
      orderBy: {
        userId: 'asc',
      },
      skip: pagingCondition.pageSize * (pagingCondition.pageNumber - 1),
      take: pagingCondition.pageSize,
    })
    const count = await this.prismaClient.userTaskStatus.count({
      where: {
        taskId: { in: taskIds },
        status: taskStatus,
      },
    })

    const userDTOs = userDatas.map((userData) => {
      return new UserDTO({
        id: userData.User.id,
        name: userData.User.name,
        mail: userData.User.mail,
        status: userData.User.status,
      })
    })
    return new Page(userDTOs, {
      totalCount: count,
      pageSize: pagingCondition.pageSize,
      pageNumber: pagingCondition.pageNumber,
    })
  }
}
