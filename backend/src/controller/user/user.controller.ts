import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { GetAllUsersResponse } from './response/get-all-users-response'
import { PostSomeDataRequest } from './request/post-some-data-request'
import { GetAllUsersUseCase } from '../../app/user/get-all-users-usecase'
import { PostSomeDataUseCase } from '../../app/sample/post-some-data-usecase'
import { SomeDataRepository } from 'src/infra/db/repository/sample/some-data-repository'
import { PrismaClient } from '@prisma/client'
import { AllUsersQS } from 'src/infra/db/query-service/user/all-users-qs'

@Controller({
  path: '/user',
})
export class UserController {
  // memo: @ApiResponseを定義しておかないとSwaggerに出力されない
  @Get('all')
  @ApiResponse({ status: 200, type: GetAllUsersResponse })
  async getAllUsers(): Promise<GetAllUsersResponse> {
    const prisma = new PrismaClient()
    const qs = new AllUsersQS(prisma)
    const usecase = new GetAllUsersUseCase(qs)
    const result = await usecase.do()
    const response = new GetAllUsersResponse({ users: result })
    return response
  }
}
