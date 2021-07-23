// @see https://docs.nestjs.com/openapi/types-and-parameters

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateTaskRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly title!: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly content!: string
}
