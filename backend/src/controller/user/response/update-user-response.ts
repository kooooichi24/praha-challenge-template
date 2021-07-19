import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserResponse {
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
