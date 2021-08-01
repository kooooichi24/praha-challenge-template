// @see https://docs.nestjs.com/openapi/types-and-parameters

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly taskId!: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly status!: 'TODO' | 'REVIEWING' | 'DONE'
}
