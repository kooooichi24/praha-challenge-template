import { Body, Controller, Get, HttpCode, Param, Put } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { PrismaClient } from '@prisma/client'
import { GetByUserIdRouteParameters } from './route-parameters/get-by-user-id-route-parameters'
import { GetByUserIdResponse } from './response/get-by-user-id-response'
import { TaskStatusRepository } from 'src/infra/db/repository/task-status/task-status-repository'
import { GetTaskStatusUseCase } from 'src/app/task-status/get-task-status-usecase'
import { UserRepository } from 'src/infra/db/repository/user/user-repository'
import { UpdateRouteParameters } from './route-parameters/update-route-parameters'
import { UpdateRequest } from './request/update-request'
import { UpdateResponse } from './response/update-response'
import { UpdateTaskStatusUsecase } from 'src/app/task-status/update-task-status-usecase'

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
    const taskStatusRepo = new TaskStatusRepository(prisma)
    const userRepo = new UserRepository(prisma)
    const usecase = new GetTaskStatusUseCase(taskStatusRepo, userRepo)
    const result = await usecase.do({ userId: params.userId })
    const response = new GetByUserIdResponse({ tasks: result })
    return response
  }

  @Put(':userId')
  @HttpCode(200)
  @ApiResponse({ status: 200, type: UpdateResponse })
  async update(
    @Param() params: UpdateRouteParameters,
    @Body() request: UpdateRequest,
  ): Promise<UpdateResponse> {
    const prisma = new PrismaClient()
    const repo = new TaskStatusRepository(prisma)
    const usecase = new UpdateTaskStatusUsecase(repo)
    const result = await usecase.do({
      userId: params.userId,
      taskId: request.taskId,
      status: request.status,
    })
    const response = new UpdateResponse({ ...result.getAllProperties() })
    return response
  }
}
