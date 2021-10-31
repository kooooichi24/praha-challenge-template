import { Controller, Get, HttpCode } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { PrismaClient } from '@prisma/client'
import { GetAllTeamsUsecase } from 'src/app/team/getAllTeamsUsecase'
import { TeamQS } from 'src/infra/db/query-service/team/team-qs'
import { GetAllTeamsResponse } from './response/get-all-teams-response'

@Controller({
  path: '/api/pairs',
})
export class PairController {
  // memo: @ApiResponseを定義しておかないとSwaggerに出力されない
  @Get()
  @HttpCode(200)
  @ApiResponse({ status: 200, type: GetAllTeamsResponse })
  async findAll(): Promise<GetAllTeamsResponse> {
    const prisma = new PrismaClient()
    const qs = new TeamQS(prisma)
    const usecase = new GetAllTeamsUsecase(qs)
    const result = await usecase.do()
    const response = new GetAllTeamsResponse({ teams: result })
    return response
  }
}
