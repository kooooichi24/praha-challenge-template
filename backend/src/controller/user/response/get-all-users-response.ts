import { ApiProperty } from '@nestjs/swagger'
import { UserTaskStatus } from '@prisma/client'
import { UserDTO } from 'src/app/user/query-service-interface/user-qs'

export class GetAllUsersResponse {
  @ApiProperty({ type: () => [User] })
  users: User[]

  public constructor(params: { users: UserDTO[] }) {
    const { users } = params
    this.users = users.map(({ id, name, mail, status, tasksStatus }) => {
      return new User({
        id,
        name,
        mail,
        status,
        tasksStatus,
      })
    })
  }
}

class User {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  mail: string

  @ApiProperty()
  status: string

  @ApiProperty()
  tasksStatus: UserTaskStatus[]

  public constructor(params: {
    id: string
    name: string
    mail: string
    status: string
    tasksStatus: UserTaskStatus[]
  }) {
    this.id = params.id
    this.name = params.name
    this.mail = params.mail
    this.status = params.status
    this.tasksStatus = params.tasksStatus
  }
}
