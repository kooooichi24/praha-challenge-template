import { RemoveBelongingUserUsecase } from './RemoveBelongingUserUsecase'
import { PairRepository } from 'src/infra/db/repository/pair/pair-repository'
import { PrismaClient } from '.prisma/client'
import { AddBelongingUserUsecase } from './AddBelongingUserUsecase'

const removeBelongingUserUsecase = new RemoveBelongingUserUsecase(
  new PairRepository(new PrismaClient()),
)
const addBelongingUserUsecase = new AddBelongingUserUsecase(
  new PairRepository(new PrismaClient()),
)

export { removeBelongingUserUsecase, addBelongingUserUsecase }
