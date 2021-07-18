// @see https://docs.nestjs.com/openapi/types-and-parameters

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class DeleteUserRouteParameters {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly id!: string
}
