import { ApiProperty } from '@nestjs/swagger'

export class UpdateResponse {
  @ApiProperty()
  userId: string

  @ApiProperty()
  taskId: string

  @ApiProperty()
  status: string

  public constructor(params: {
    userId: string
    taskId: string
    status: string
  }) {
    this.userId = params.userId
    this.taskId = params.taskId
    this.status = params.status
  }
}
