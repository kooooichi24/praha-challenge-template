import { RemoveBelongingUserUsecase } from './RemoveBelongingUserUsecase'
import { PrismaClient } from '.prisma/client'
import { TeamRepository } from 'src/infra/db/repository/team/team-repository'

const removeBelongingUserUsecase = new RemoveBelongingUserUsecase(
  new TeamRepository(new PrismaClient()),
)

export { removeBelongingUserUsecase }
