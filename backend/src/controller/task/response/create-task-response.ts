import { ApiProperty } from '@nestjs/swagger'

export class CreateTaskResponse {
  @ApiProperty()
  id: string

  @ApiProperty()
  title: string

  @ApiProperty()
  content: string

  public constructor(params: { id: string; title: string; content: string }) {
    this.id = params.id
    this.title = params.title
    this.content = params.content
  }
}
