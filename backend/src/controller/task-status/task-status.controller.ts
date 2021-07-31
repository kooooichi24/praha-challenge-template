import { Controller, Get, HttpCode, Param } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { PrismaClient } from '@prisma/client'
import { GetByUserIdRouteParameters } from './route-parameters/get-by-user-id-route-parameters'
import { GetByUserIdResponse } from './response/get-by-user-id-response'
import { TaskStatusRepository } from 'src/infra/db/repository/task-status/task-status-repository'
import { GetTaskStatusUseCase } from 'src/app/task-status/get-task-status-usecase'

@Controller({
  path: '/task-status',
})
export class TaskStatusController {
  // memo: @ApiResponseを定義しておかないとSwaggerに出力されない
  @Get(':userId')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: GetByUserIdResponse })
  async getByUserId(
    @Param() params: GetByUserIdRouteParameters,
  ): Promise<GetByUserIdResponse> {
    console.log('task-status controller called.')

    const prisma = new PrismaClient()
    const repo = new TaskStatusRepository(prisma)
    const usecase = new GetTaskStatusUseCase(repo)
    const result = await usecase.do({ userId: params.userId })
    const response = new GetByUserIdResponse({ tasks: result })
    return response
  }

  // @Delete(':id')
  // @HttpCode(204)
  // @ApiResponse({ status: 204 })
  // async remove(@Param() params: RemoveUserRouteParameters): Promise<void> {
  //   const prisma = new PrismaClient()
  //   const repo = new UserRepository(prisma)
  //   const qs = new UserQS(prisma)
  //   const usecase = new DeleteUserUseCase(repo, qs)
  //   await usecase.do({ id: params.id })
  // }

  // @Put(':id')
  // @HttpCode(200)
  // @ApiResponse({ status: 200, type: UpdateTaskStatusResponse })
  // async update(
  //   @Param() params: UpdateTaskStatusRouteParameters,
  //   @Body() request: UpdateTaskStatusRequest,
  // ): Promise<UpdateTaskStatusResponse> {
  //   const prisma = new PrismaClient()
  //   const repo = new TaskStatusRepository(prisma)
  //   const usecase = new UpdateUserStateUseCase(repo)
  //   const result = await usecase.do({ id: params.id, status: request.status })
  //   const response = new UpdateUserResponse({ ...result.getAllProperties() })
  //   return response
  // }
}
