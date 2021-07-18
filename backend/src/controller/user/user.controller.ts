import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { PrismaClient } from '@prisma/client'
import { PostUserRequest } from './request/post-user-request'
import { DeleteUserRouteParameters } from './request/delete-user-route-parameters'
import { GetAllUsersResponse } from './response/get-all-users-response'
import { GetAllUsersUseCase } from '../../app/user/get-all-users-usecase'
import { PostUserUseCase } from 'src/app/user/post-user-usecase'
import { DeleteUserUseCase } from 'src/app/user/delete-user-usecase'
import { UserQS } from 'src/infra/db/query-service/user/user-qs'
import { UserRepository } from 'src/infra/db/repository/user/user-repository'

@Controller({
  path: '/user',
})
export class UserController {
  // memo: @ApiResponseを定義しておかないとSwaggerに出力されない
  @Get()
  @HttpCode(200)
  @ApiResponse({ status: 200, type: GetAllUsersResponse })
  async findAll(): Promise<GetAllUsersResponse> {
    const prisma = new PrismaClient()
    const qs = new UserQS(prisma)
    const usecase = new GetAllUsersUseCase(qs)
    const result = await usecase.do()
    const response = new GetAllUsersResponse({ users: result })
    return response
  }

  @Post()
  @HttpCode(201)
  @ApiResponse({ status: 201 })
  async create(@Body() request: PostUserRequest): Promise<void> {
    const prisma = new PrismaClient()
    const repo = new UserRepository(prisma)
    const usecase = new PostUserUseCase(repo)
    await usecase.do({ name: request.name, mail: request.mail })
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  async remove(@Param() params: DeleteUserRouteParameters): Promise<void> {
    const prisma = new PrismaClient()
    const repo = new UserRepository(prisma)
    const usecase = new DeleteUserUseCase(repo)
    await usecase.do({ id: params.id })
  }
}
