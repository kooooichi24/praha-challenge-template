import { PrismaClient } from '@prisma/client'
import { BelongingUsers } from 'src/domain/pair/belongingUserIds'
import { Pair } from 'src/domain/pair/pair'
import { PairName } from 'src/domain/pair/pairName'
import { UniqueEntityID } from 'src/domain/shared/UniqueEntityID'
import { UserId } from 'src/domain/user/userId'
import { PairRepository } from 'src/infra/db/repository/pair/pair-repository'
import { RemoveBelongingUserUsecase } from '../RemoveBelongingUserUsecase'
import { uuid as uuidv4 } from 'uuidv4'

jest.mock('uuidv4')

describe('RemoveBelongingUserUsecase', () => {
  const mockUuidv4 = uuidv4 as jest.Mock
  const mockUuidv4Response = '3f86f7dd-d67f-4516-afba-8021d7696462'
  const prisma = new PrismaClient()

  beforeEach(() => {
    mockUuidv4.mockImplementation(() => mockUuidv4Response)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  describe('do', () => {
    test('[正常系]: 例外が発生しない', async () => {
      // Arrange
      const expectedFindByUserIdArgs = UserId.create(new UniqueEntityID('1'))
      const expectedSaveArgs = Pair.create({
        name: PairName.create('a'),
        belongingUsers: BelongingUsers.create({
          userIds: [
            UserId.create(new UniqueEntityID('2')),
            UserId.create(new UniqueEntityID('3')),
          ],
        }),
      })

      const pairResponse = Pair.create({
        name: PairName.create('a'),
        belongingUsers: BelongingUsers.create({
          userIds: [
            UserId.create(new UniqueEntityID('1')),
            UserId.create(new UniqueEntityID('2')),
            UserId.create(new UniqueEntityID('3')),
          ],
        }),
      })
      const pairRepoFindByUserIdSpy = jest
        .spyOn(PairRepository.prototype, 'findByUserId')
        .mockResolvedValue(pairResponse)
      const pairRepoSaveSpy = jest
        .spyOn(PairRepository.prototype, 'save')
        .mockImplementation()

      // Act
      const usecase = new RemoveBelongingUserUsecase(new PairRepository(prisma))
      const req = {
        userId: UserId.create(new UniqueEntityID('1')),
      }
      await usecase.do(req)

      // Assert
      expect(pairRepoFindByUserIdSpy).toHaveBeenCalledWith(
        expectedFindByUserIdArgs,
      )
      expect(pairRepoFindByUserIdSpy).toHaveBeenCalledTimes(1)
      expect(pairRepoSaveSpy).toHaveBeenCalledWith(expectedSaveArgs)
      expect(pairRepoSaveSpy).toHaveBeenCalledTimes(1)
    })
  })
})
