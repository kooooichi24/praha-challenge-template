// @see https://docs.nestjs.com/openapi/types-and-parameters

import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class PostUserRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name!: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  readonly mail!: string
}
