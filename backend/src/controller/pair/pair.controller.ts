import { Body, Controller, Get, HttpCode, Param, Put } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { PrismaClient } from '@prisma/client'
import { GetAllPairsUsecase } from 'src/app/pair/getAllPairsUsecase'
import { MoveBelongingUserUsecase } from 'src/app/pair/moveBelongingUserUsecase'
import { PairQS } from 'src/infra/db/query-service/pair/pair-qs'
import { PairRepository } from 'src/infra/db/repository/pair/pair-repository'
import { MovePairRequest } from './request/move-pair-request'
import { GetAllPairsResponse } from './response/get-all-pairs-response'
import { MovePairRouteParameters } from './route-parameters/move-pair-route-parameters'

@Controller({
  path: '/api/pairs',
})
export class PairController {
  // memo: @ApiResponseを定義しておかないとSwaggerに出力されない
  @Get()
  @HttpCode(200)
  @ApiResponse({ status: 200, type: GetAllPairsResponse })
  async findAll(): Promise<GetAllPairsResponse> {
    const prisma = new PrismaClient()
    const qs = new PairQS(prisma)
    const usecase = new GetAllPairsUsecase(qs)
    const result = await usecase.do()
    const response = new GetAllPairsResponse({ pairs: result })
    return response
  }

  @Put('/:userId')
  @HttpCode(200)
  @ApiResponse({ status: 200 })
  async move(
    @Param() params: MovePairRouteParameters,
    @Body() request: MovePairRequest,
  ): Promise<void> {
    const prisma = new PrismaClient()
    const repo = new PairRepository(prisma)
    const usecase = new MoveBelongingUserUsecase(repo)
    await usecase.do({ userId: params.userId, to: request.to })
  }
}
