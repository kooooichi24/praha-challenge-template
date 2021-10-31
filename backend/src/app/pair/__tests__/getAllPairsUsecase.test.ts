import { PrismaClient } from '@prisma/client'
import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { PairQS } from 'src/infra/db/query-service/pair/pair-qs'
import { PairDTO } from '../query-service-interface/pair-qs'
import { GetAllPairsUsecase } from '../getAllPairsUsecase'

jest.mock('@prisma/client')
jest.mock('src/infra/db/query-service/pair/pair-qs')

describe('do', () => {
  let mockPairQS: MockedObjectDeep<PairQS>

  beforeAll(() => {
    const prisma = new PrismaClient()
    mockPairQS = mocked(new PairQS(prisma), true)
  })

  test('[正常系]: PairDTO[]を取得できること', async () => {
    // Arrange
    const mockResponsePairDTO: PairDTO[] = [
      {
        id: '1',
        name: 'pair1',
        belongingUsers: [
          {
            id: 'user1',
            name: 'user1',
            mail: 'user1@gmail.com',
            status: 'ENROLLMENT',
          },
          {
            id: 'user2',
            name: 'user2',
            mail: 'user2@gmail.com',
            status: 'ENROLLMENT',
          },
        ],
      },
      {
        id: '2',
        name: 'pair2',
        belongingUsers: [
          {
            id: 'user3',
            name: 'user3',
            mail: 'user3@gmail.com',
            status: 'ENROLLMENT',
          },
          {
            id: 'user4',
            name: 'user4',
            mail: 'user4@gmail.com',
            status: 'ENROLLMENT',
          },
        ],
      },
    ]
    mockPairQS.findAll.mockResolvedValueOnce(mockResponsePairDTO)

    // Act
    const usecase = new GetAllPairsUsecase(mockPairQS)
    const actual = await usecase.do()

    // Assert
    expect(mockPairQS.findAll).toHaveBeenCalled()
    expect(actual).toStrictEqual(mockResponsePairDTO)
  })

  test('[異常系]: allPairsQS.findAllで例外が発生した場合、例外が発生する', async () => {
    // Arrange
    const ERROR_MESSAGE = 'error!'
    mockPairQS.findAll.mockRejectedValueOnce(ERROR_MESSAGE)

    try {
      // Act
      const usecase = new GetAllPairsUsecase(mockPairQS)
      await usecase.do()
      fail()
    } catch (e) {
      // Assert
      expect(e).toBe(ERROR_MESSAGE)
    }
  })
})
