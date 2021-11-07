// @see https://docs.nestjs.com/openapi/types-and-parameters

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class TaskFilteringAndPaginationRouteParameters {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly ids!: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly status!: string

  @ApiProperty()
  @IsString()
  readonly per_page!: string

  @ApiProperty()
  @IsString()
  readonly page!: string
}
