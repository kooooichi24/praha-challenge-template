import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { PrismaClient } from '@prisma/client'
import { CreateTaskRequest } from './request/create-user-request'
import { CreateTaskResponse } from './response/create-task-response'
import { TaskRepository } from 'src/infra/db/repository/task/task-repository'
import { CreateTaskUseCase } from 'src/app/task/create-task-usecase'
import { UserRepository } from 'src/infra/db/repository/user/user-repository'
import { TaskStatusRepository } from 'src/infra/db/repository/task-status/task-status-repository'

@Controller({
  path: '/task',
})
export class TaskController {
  // memo: @ApiResponseを定義しておかないとSwaggerに出力されない
  @Post()
  @HttpCode(200)
  @ApiResponse({ status: 200, type: CreateTaskResponse })
  async create(
    @Body() request: CreateTaskRequest,
  ): Promise<CreateTaskResponse> {
    const prisma = new PrismaClient()
    const usecase = new CreateTaskUseCase(
      new TaskRepository(prisma),
      new UserRepository(prisma),
      new TaskStatusRepository(prisma),
    )

    const task = await usecase.do({
      title: request.title,
      content: request.content,
    })

    const response = new CreateTaskResponse({ ...task.getAllProperties() })
    return response
  }
}
