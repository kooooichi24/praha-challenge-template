import { ApiProperty } from '@nestjs/swagger'
import { Page } from 'src/app/shared/Paging'
import { UserDTO } from 'src/app/user/query-service-interface/user-qs'

export class PagingUsersResponse {
  @ApiProperty({ type: () => [User] })
  users: User[]

  @ApiProperty({ type: () => Paging })
  paging: Paging

  public constructor(params: Page<UserDTO>) {
    const { items, paging } = params
    this.users = items.map(({ id, name, mail, status }) => {
      return new User({
        id,
        name,
        mail,
        status,
      })
    })
    this.paging = paging
  }
}

class Paging {
  @ApiProperty()
  totalCount: number

  @ApiProperty()
  pageSize: number

  @ApiProperty()
  pageNumber: number

  public constructor(params: {
    totalCount: number
    pageSize: number
    pageNumber: number
  }) {
    this.totalCount = params.totalCount
    this.pageSize = params.pageSize
    this.pageNumber = params.pageNumber
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

  public constructor(params: {
    id: string
    name: string
    mail: string
    status: string
  }) {
    this.id = params.id
    this.name = params.name
    this.mail = params.mail
    this.status = params.status
  }
}
