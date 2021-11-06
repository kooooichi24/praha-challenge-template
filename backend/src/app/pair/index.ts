import { RemoveBelongingUserUsecase } from './RemoveBelongingUserUsecase'
import { PairRepository } from 'src/infra/db/repository/pair/pair-repository'
import { PrismaClient } from '.prisma/client'
import { AddBelongingUserUsecase } from './AddBelongingUserUsecase'
import { TeamRepository } from 'src/infra/db/repository/team/team-repository'

const removeBelongingUserUsecase = new RemoveBelongingUserUsecase(
  new PairRepository(new PrismaClient()),
)
const addBelongingUserUsecase = new AddBelongingUserUsecase(
  new PairRepository(new PrismaClient()),
  new TeamRepository(new PrismaClient()),
)

export { removeBelongingUserUsecase, addBelongingUserUsecase }
