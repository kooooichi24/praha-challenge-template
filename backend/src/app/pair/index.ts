import { RemoveBelongingUserUsecase } from './RemoveBelongingUserUsecase'
import { PairRepository } from 'src/infra/db/repository/pair/pair-repository'
import { PrismaClient } from '.prisma/client'
import { MoveBelongingUserUsecase } from './MoveBelongingUserUsecase'

const removeBelongingUserUsecase = new RemoveBelongingUserUsecase(
  new PairRepository(new PrismaClient()),
)
const moveBelongingUserUsecase = new MoveBelongingUserUsecase(
  new PairRepository(new PrismaClient()),
)

export { removeBelongingUserUsecase, moveBelongingUserUsecase }
