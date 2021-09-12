import { PrismaClient } from '@prisma/client'
import { BelongingUsers } from 'src/domain/pair/belongingUserIds'
import { Pair } from 'src/domain/pair/pair'
import { PairName } from 'src/domain/pair/pairName'
import { UniqueEntityID } from 'src/domain/shared/UniqueEntityID'
import { UserId } from 'src/domain/user/userId'
import { PairRepository } from 'src/infra/db/repository/pair/pair-repository'
import { MoveBelongingUserUsecase } from '../MoveBelongingUserUsecase'
import { uuid as uuidv4 } from 'uuidv4'

jest.mock('uuidv4')

describe('MoveBelongingUserUsecase', () => {
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
    test('[正常系]: 現在のペアに所属しているユーザ数が1の場合、最も参加人数が少ないペアにユーザを移動させ、現在のペアは削除されること', async () => {
      // Arrange
      const currentPairResponse = Pair.create(
        {
          name: PairName.create('a'),
          belongingUsers: BelongingUsers.create({
            userIds: [
              UserId.create(new UniqueEntityID('1')),
              UserId.create(new UniqueEntityID('2')),
              UserId.create(new UniqueEntityID('3')),
            ],
          }),
        },
        new UniqueEntityID('1'),
      )
      currentPairResponse.removeUser(UserId.create(new UniqueEntityID('2')))
      currentPairResponse.removeUser(UserId.create(new UniqueEntityID('3')))
      const findByPairIdSpy = jest
        .spyOn(PairRepository.prototype, 'findByPairId')
        .mockResolvedValue(currentPairResponse)
      const minimumPairResponse = Pair.create({
        name: PairName.create('b'),
        belongingUsers: BelongingUsers.create({
          userIds: [
            UserId.create(new UniqueEntityID('4')),
            UserId.create(new UniqueEntityID('5')),
          ],
        }),
      })
      const findOneMinimumPairSpy = jest
        .spyOn(PairRepository.prototype, 'findOneMinimumPair')
        .mockResolvedValue(minimumPairResponse)
      const saveSpy = jest
        .spyOn(PairRepository.prototype, 'save')
        .mockImplementation()
      const deleteSpy = jest
        .spyOn(PairRepository.prototype, 'delete')
        .mockImplementation()

      // Act
      const usecase = new MoveBelongingUserUsecase(new PairRepository(prisma))
      const req = {
        currentPairId: '1',
        userIds: [UserId.create(new UniqueEntityID('1'))],
      }
      await usecase.do(req)

      // Assert
      expect(findByPairIdSpy).toHaveBeenCalledWith('1')
      expect(findOneMinimumPairSpy).toHaveBeenCalledWith()
      expect(saveSpy).toHaveBeenCalledWith(
        Pair.create({
          name: PairName.create('b'),
          belongingUsers: BelongingUsers.create({
            userIds: [
              UserId.create(new UniqueEntityID('4')),
              UserId.create(new UniqueEntityID('5')),
              UserId.create(new UniqueEntityID('1')),
            ],
          }),
        }),
      )
      expect(deleteSpy).toHaveBeenCalledWith(currentPairResponse)
    })
  })
})
