import { RemoveBelongingUserUsecase } from './RemoveBelongingUserUsecase'
import { PairRepository } from 'src/infra/db/repository/pair/pair-repository'
import { PrismaClient } from '.prisma/client'

const removeBelongingUserUsecase = new RemoveBelongingUserUsecase(
  new PairRepository(new PrismaClient()),
)

export { removeBelongingUserUsecase }
