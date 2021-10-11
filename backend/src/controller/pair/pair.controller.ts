import { Controller, Get, HttpCode } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { PrismaClient } from '@prisma/client'
import { GetAllPairsUsecase } from 'src/app/pair/getAllPairsUsecase'
import { PairQS } from 'src/infra/db/query-service/pair/pair-qs'
import { GetAllPairsResponse } from './response/get-all-pairs-response'

@Controller({
  path: '/pairs',
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
}
