import { PrismaClient } from '@prisma/client'
import { BelongingUsers } from 'src/domain/pair/belongingUsers'
import { Pair } from 'src/domain/pair/pair'
import { PairId } from 'src/domain/pair/pairId'
import { PairName } from 'src/domain/pair/pairName'
import { UniqueEntityID } from 'src/domain/shared/UniqueEntityID'
import { Team } from 'src/domain/team/team'
import { TeamName } from 'src/domain/team/teamName'
import { UserId } from 'src/domain/user/userId'
import { PairRepository } from 'src/infra/db/repository/pair/pair-repository'
import { TeamRepository } from 'src/infra/db/repository/team/team-repository'
import { uuid as uuidv4 } from 'uuidv4'
import { AddBelongingUserUsecase } from '../AddBelongingUserUsecase'

jest.mock('../../../util/random', () => {
  return {
    createRandomIdString: jest.fn(),
    createRandomAlphabetChar: jest
      .fn()
      .mockReturnValueOnce('x')
      .mockReturnValueOnce('y'),
  }
})
jest.mock('uuidv4')

describe('AddBelongingUserUsecase', () => {
  const mockUuidv4 = uuidv4 as jest.Mock
  const mockUuidv4Response = '3f86f7dd-d67f-4516-afba-8021d7696462'
  const prisma = new PrismaClient()

  let usecase: AddBelongingUserUsecase
  let pairRepoSaveSpy: jest.SpyInstance
  let pairRepoDeleteSpy: jest.SpyInstance
  let teamRepoFindByPairIdSpy: jest.SpyInstance
  let teamRepoSaveSpy: jest.SpyInstance

  beforeEach(() => {
    mockUuidv4.mockImplementation(() => mockUuidv4Response)
    usecase = new AddBelongingUserUsecase(
      new PairRepository(prisma),
      new TeamRepository(prisma),
    )
    pairRepoSaveSpy = jest
      .spyOn(PairRepository.prototype, 'save')
      .mockImplementation()
    pairRepoDeleteSpy = jest
      .spyOn(PairRepository.prototype, 'delete')
      .mockImplementation()
    teamRepoFindByPairIdSpy = jest
      .spyOn(TeamRepository.prototype, 'findByPairId')
      .mockResolvedValue(
        Team.create(
          {
            name: TeamName.create(1),
            belongingPairIds: [
              PairId.create(new UniqueEntityID('pair1')),
              PairId.create(new UniqueEntityID('pair2')),
            ],
            belongingUserIds: [
              UserId.create(new UniqueEntityID('user1')),
              UserId.create(new UniqueEntityID('user2')),
              UserId.create(new UniqueEntityID('user3')),
              UserId.create(new UniqueEntityID('user4')),
              UserId.create(new UniqueEntityID('user5')),
            ],
          },
          new UniqueEntityID('team1'),
        ),
      )
    teamRepoSaveSpy = jest
      .spyOn(TeamRepository.prototype, 'save')
      .mockImplementation()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  describe('do', () => {
    test('[?????????]: ???????????????2???????????????1???????????????????????????????????????3???????????????????????????', async () => {
      // Arrange
      const expectedSaveArgs = Pair.create({
        name: PairName.create('a'),
        belongingUsers: BelongingUsers.create({
          userIds: [
            UserId.create(new UniqueEntityID('1')),
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
          ],
        }),
      })
      const pairRepoFindOneMinimumPair = jest
        .spyOn(PairRepository.prototype, 'findOneMinimumPair')
        .mockResolvedValue(pairResponse)

      // Act
      const req = {
        userId: UserId.create(new UniqueEntityID('3')),
      }
      try {
        await usecase.do(req)
      } catch (e) {
        fail('should not occur error')
      }

      // Assert
      expect(pairRepoFindOneMinimumPair).toHaveBeenCalledTimes(1)
      expect(pairRepoSaveSpy).toHaveBeenCalledWith(expectedSaveArgs)
      expect(pairRepoSaveSpy).toHaveBeenCalledTimes(1)
    })

    test('[?????????]: ???????????????3???????????????1????????????????????????2?????????????????????????????????????????????????????????3?????????????????????????????????', async () => {
      // Arrange
      const expectedFirstSaveArgs = Pair.create({
        name: PairName.create('x'),
        belongingUsers: BelongingUsers.create({
          userIds: [
            UserId.create(new UniqueEntityID('1')),
            UserId.create(new UniqueEntityID('2')),
          ],
        }),
      })
      const expectedSecondSaveArgs = Pair.create({
        name: PairName.create('y'),
        belongingUsers: BelongingUsers.create({
          userIds: [
            UserId.create(new UniqueEntityID('3')),
            UserId.create(new UniqueEntityID('4')),
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
      const pairRepoFindOneMinimumPair = jest
        .spyOn(PairRepository.prototype, 'findOneMinimumPair')
        .mockResolvedValue(pairResponse)

      // Act
      const req = {
        userId: UserId.create(new UniqueEntityID('4')),
      }
      try {
        await usecase.do(req)
      } catch (e) {
        fail('should not occur error')
      }

      // Assert
      expect(pairRepoFindOneMinimumPair).toHaveBeenCalledTimes(1)
      expect(pairRepoSaveSpy).toHaveBeenNthCalledWith(1, expectedFirstSaveArgs)
      expect(pairRepoSaveSpy).toHaveBeenNthCalledWith(2, expectedSecondSaveArgs)
      expect(pairRepoDeleteSpy).toHaveBeenCalledWith(pairResponse)
    })
  })
})
