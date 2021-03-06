import { PrismaClient } from '@prisma/client'
import { UserQS } from 'src/infra/db/query-service/user/user-qs'
import { GetAllUsersUseCase } from '../get-all-users-usecase'
import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { UserWithTasksStatusDTO } from '../query-service-interface/user-qs'

jest.mock('@prisma/client')
jest.mock('src/infra/db/query-service/user/user-qs')

describe('do', () => {
  let mockUserQS: MockedObjectDeep<UserQS>

  beforeAll(() => {
    const prisma = new PrismaClient()
    mockUserQS = mocked(new UserQS(prisma), true)
  })

  test('[正常系]: UserDTO[]を取得できること', async () => {
    // Arrange
    const mockResponseUserDTO: UserWithTasksStatusDTO[] = [
      {
        id: '1',
        name: 'furukawa',
        mail: 'furukawa@gmai.com',
        status: 'ENROLLMENT',
        tasksStatus: [],
      },
      {
        id: '2',
        name: 'nakano',
        mail: 'nakano@gmai.com',
        status: 'ENROLLMENT',
        tasksStatus: [],
      },
      {
        id: '3',
        name: 'sasaki',
        mail: 'sasaki@gmai.com',
        status: 'ENROLLMENT',
        tasksStatus: [],
      },
    ]
    mockUserQS.findAll.mockResolvedValueOnce(mockResponseUserDTO)

    // Act
    const usecase = new GetAllUsersUseCase(mockUserQS)
    const actual = await usecase.do()

    // Assert
    expect(mockUserQS.findAll).toHaveBeenCalled()
    expect(actual).toStrictEqual(mockResponseUserDTO)
  })

  test('[異常系]: allUsersQS.findAllで例外が発生した場合、例外が発生する', async () => {
    // Arrange
    const ERROR_MESSAGE = 'error!'
    mockUserQS.findAll.mockRejectedValueOnce(ERROR_MESSAGE)

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
