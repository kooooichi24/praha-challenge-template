import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { PrismaClient } from '@prisma/client'
import { PostUserRequest } from './request/post-user-request'
import { RemoveUserRouteParameters } from './route-parameters/remove-user-route-parameters'
import { UpdateUserRouteParameters } from './route-parameters/update-user-route-parameters'
import { GetAllUsersResponse } from './response/get-all-users-response'
import { GetAllUsersUseCase } from '../../app/user/get-all-users-usecase'
import { CreateUserUsecase } from 'src/app/user/create-user-usecase'
import { DeleteUserUseCase } from 'src/app/user/delete-user-usecase'
import { UserQS } from 'src/infra/db/query-service/user/user-qs'
import { UserRepository } from 'src/infra/db/repository/user/user-repository'
import { UpdateUserRequest } from './request/update-user-request'
import { UpdateUserResponse } from './response/update-user-response'
import { UpdateUserStateUseCase } from 'src/app/user/update-user-state-usecase'

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
    const usecase = new CreateUserUsecase(repo)
    await usecase.do({ name: request.name, mail: request.mail })
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  async remove(@Param() params: RemoveUserRouteParameters): Promise<void> {
    const prisma = new PrismaClient()
    const repo = new UserRepository(prisma)
    const qs = new UserQS(prisma)
    const usecase = new DeleteUserUseCase(repo, qs)
    await usecase.do({ id: params.id })
  }

  @Put(':id')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: UpdateUserResponse })
  async update(
    @Param() params: UpdateUserRouteParameters,
    @Body() request: UpdateUserRequest,
  ): Promise<UpdateUserResponse> {
    const prisma = new PrismaClient()
    const repo = new UserRepository(prisma)
    const qs = new UserQS(prisma)
    const usecase = new UpdateUserStateUseCase(repo, qs)
    const result = await usecase.do({ id: params.id, status: request.status })
    const response = new UpdateUserResponse({ ...result.getAllProperties() })
    return response
  }
}
