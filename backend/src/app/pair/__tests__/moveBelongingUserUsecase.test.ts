import { PrismaClient } from '@prisma/client'
import { BelongingUsers } from 'src/domain/pair/belongingUsers'
import { Pair } from 'src/domain/pair/pair'
import { PairName } from 'src/domain/pair/pairName'
import { UniqueEntityID } from 'src/domain/shared/UniqueEntityID'
import { UserId } from 'src/domain/user/userId'
import { PairRepository } from 'src/infra/db/repository/pair/pair-repository'
import { mocked, MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { MoveBelongingUserUsecase } from '../moveBelongingUserUsecase'
import { uuid as uuidv4 } from 'uuidv4'

jest.mock('uuidv4')
jest.mock('@prisma/client')
jest.mock('src/infra/db/repository/pair/pair-repository')

describe('MoveBelongingUserUsecase', () => {
  const mockUuidv4 = uuidv4 as jest.Mock
  const mockUuidv4Response = '3f86f7dd-d67f-4516-afba-8021d7696462'
  let mockPairRepo: MockedObjectDeep<PairRepository>

  beforeEach(() => {
    mockUuidv4.mockImplementation(() => mockUuidv4Response)
    const prisma = new PrismaClient()
    mockPairRepo = mocked(new PairRepository(prisma), true)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  describe('do', () => {
    test('[正常系]: 所属人数が最低ではないペアから、所属人数が最高ではないペアに移動できること', async () => {
      // Arrange
      const targetPair = Pair.create({
        name: PairName.create('a'),
        belongingUsers: BelongingUsers.create({
          userIds: [
            UserId.create(new UniqueEntityID('1')),
            UserId.create(new UniqueEntityID('2')),
          ],
        }),
      })
      const currentPair = Pair.create({
        name: PairName.create('b'),
        belongingUsers: BelongingUsers.create({
          userIds: [
            UserId.create(new UniqueEntityID('3')),
            UserId.create(new UniqueEntityID('4')),
            UserId.create(new UniqueEntityID('5')),
          ],
        }),
      })
      mockPairRepo.findByPairId.mockResolvedValueOnce(targetPair)
      mockPairRepo.findByUserId.mockResolvedValueOnce(currentPair)

      const expectedTargetPair = Pair.create({
        name: PairName.create('a'),
        belongingUsers: BelongingUsers.create({
          userIds: [
            UserId.create(new UniqueEntityID('1')),
            UserId.create(new UniqueEntityID('2')),
            UserId.create(new UniqueEntityID('3')),
          ],
        }),
      })
      const expectedCurrentPair = Pair.create({
        name: PairName.create('b'),
        belongingUsers: BelongingUsers.create({
          userIds: [
            UserId.create(new UniqueEntityID('4')),
            UserId.create(new UniqueEntityID('5')),
          ],
        }),
      })

      // Act
      const req = {
        userId: '3',
        to: 'a',
      }
      const usecase = new MoveBelongingUserUsecase(mockPairRepo)
      await usecase.do(req)

      // Assert
      expect(mockPairRepo.findByPairId).toHaveBeenCalledWith('a')
      expect(mockPairRepo.findByUserId).toHaveBeenCalledWith(
        UserId.create(new UniqueEntityID('3')),
      )
      expect(mockPairRepo.save).toHaveBeenCalledWith(expectedTargetPair)
      expect(mockPairRepo.save).toHaveBeenCalledWith(expectedCurrentPair)
    })
  })
})
