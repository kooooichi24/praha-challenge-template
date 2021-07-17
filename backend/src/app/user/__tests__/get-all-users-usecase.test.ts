import { PrismaClient } from '@prisma/client'
import { AllUsersQS } from 'src/infra/db/query-service/user/all-users-qs'
import { GetAllUsersUseCase } from '../get-all-users-usecase'
import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { AllUsersDTO } from '../query-service-interface/all-users-qs'

jest.mock('@prisma/client')
jest.mock('src/infra/db/query-service/user/all-users-qs')

describe('do', () => {
  let mockAllUsersQS: MockedObjectDeep<AllUsersQS>

  beforeAll(() => {
    const prisma = new PrismaClient()
    mockAllUsersQS = mocked(new AllUsersQS(prisma), true)
  })

  it('[正常系]: AllUsersDTO[]を取得できること', async () => {
    // Arrange
    const mockResponseAllUsersDTO: AllUsersDTO[] = [
      {
        id: '1',
        name: 'furukawa',
        mail: 'furukawa@gmai.com',
      },
      {
        id: '2',
        name: 'nakano',
        mail: 'nakano@gmai.com',
      },
      {
        id: '3',
        name: 'sasaki',
        mail: 'sasaki@gmai.com',
      },
    ]
    mockAllUsersQS.getAll.mockResolvedValueOnce(mockResponseAllUsersDTO)

    // Act
    const usecase = new GetAllUsersUseCase(mockAllUsersQS)
    const actual = await usecase.do()

    // Assert
    expect(mockAllUsersQS.getAll).toHaveBeenCalled()
    expect(actual).toStrictEqual(mockResponseAllUsersDTO)
  })

  it('[異常系]: allUsersQS.getAllで例外が発生した場合、例外が発生する', async () => {
    // Arrange
    const ERROR_MESSAGE = 'error!'
    mockAllUsersQS.getAll.mockRejectedValueOnce(ERROR_MESSAGE)

    const usecase = new GetAllUsersUseCase(mockAllUsersQS)

    // Act
    try {
      const actual = await usecase.do()
      fail()
    } catch (e) {
      // Assert
      expect(e).toBe(ERROR_MESSAGE)
    }
  })
})
