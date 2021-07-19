import { PrismaClient } from '@prisma/client'
import { UserQS } from 'src/infra/db/query-service/user/user-qs'
import { GetAllUsersUseCase } from '../get-all-users-usecase'
import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { UserDTO } from '../query-service-interface/user-qs'

jest.mock('@prisma/client')
jest.mock('src/infra/db/query-service/user/user-qs')

describe('do', () => {
  let mockUserQS: MockedObjectDeep<UserQS>

  beforeAll(() => {
    const prisma = new PrismaClient()
    mockUserQS = mocked(new UserQS(prisma), true)
  })

  it('[正常系]: UserDTO[]を取得できること', async () => {
    // Arrange
    const mockResponseUserDTO: UserDTO[] = [
      {
        id: '1',
        name: 'furukawa',
        mail: 'furukawa@gmai.com',
        status: 'ENROLLMENT',
      },
      {
        id: '2',
        name: 'nakano',
        mail: 'nakano@gmai.com',
        status: 'ENROLLMENT',
      },
      {
        id: '3',
        name: 'sasaki',
        mail: 'sasaki@gmai.com',
        status: 'ENROLLMENT',
      },
    ]
    mockUserQS.getAll.mockResolvedValueOnce(mockResponseUserDTO)

    // Act
    const usecase = new GetAllUsersUseCase(mockUserQS)
    const actual = await usecase.do()

    // Assert
    expect(mockUserQS.getAll).toHaveBeenCalled()
    expect(actual).toStrictEqual(mockResponseUserDTO)
  })

  it('[異常系]: allUsersQS.getAllで例外が発生した場合、例外が発生する', async () => {
    // Arrange
    const ERROR_MESSAGE = 'error!'
    mockUserQS.getAll.mockRejectedValueOnce(ERROR_MESSAGE)

    try {
      // Act
      const usecase = new GetAllUsersUseCase(mockUserQS)
      const actual = await usecase.do()
      fail()
    } catch (e) {
      // Assert
      expect(e).toBe(ERROR_MESSAGE)
    }
  })
})
