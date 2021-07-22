import { PrismaClient } from '@prisma/client'
import { UserRepository } from 'src/infra/db/repository/user/user-repository'
import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { User } from 'src/domain/user/entity/user'
import { UpdateUserStateUseCase } from '../update-user-state-usecase'
import { UserQS } from 'src/infra/db/query-service/user/user-qs'
import { UserDTO } from '../query-service-interface/user-qs'

jest.mock('@prisma/client')
jest.mock('src/infra/db/repository/user/user-repository')
jest.mock('src/infra/db/query-service/user/user-qs')

describe('do', () => {
  let mockUserRepo: MockedObjectDeep<UserRepository>
  let mockUserQS: MockedObjectDeep<UserQS>

  beforeAll(() => {
    const prisma = new PrismaClient()
    mockUserRepo = mocked(new UserRepository(prisma), true)
    mockUserQS = mocked(new UserQS(prisma), true)
  })

  it('[正常系]: 例外が発生しない', async () => {
    // Arrange
    const mockResponseUserDTO = new UserDTO({
      id: '123',
      mail: 'mail@gmail.com',
      name: 'name',
      status: 'ENROLLMENT',
    })
    mockUserQS.findById.mockResolvedValueOnce(mockResponseUserDTO)
    const mockResponseUser = new User({
      id: '123',
      mail: 'mail@gmail.com',
      name: 'name',
      status: 'RECESS',
    })
    mockUserRepo.updateStatus.mockResolvedValueOnce(mockResponseUser)
    const expected = new User({
      id: '123',
      mail: 'mail@gmail.com',
      name: 'name',
      status: 'RECESS',
    })

    // Act
    const usecase = new UpdateUserStateUseCase(mockUserRepo, mockUserQS)
    const actual = await usecase.do({ id: '123', status: 'RECESS' })

    // Assert
    expect(mockUserQS.findById).toHaveBeenLastCalledWith('123')
    expect(mockUserRepo.updateStatus).toHaveBeenLastCalledWith(expected)
    expect(actual).toStrictEqual(expected)
  })

  it('[異常系]: idに該当するユーザーが存在しない場合、例外が発生する', async () => {
    // Arrange
    const ERROR_MESSAGE = 'idに該当するユーザーが存在しません'
    mockUserQS.findById.mockResolvedValueOnce(undefined)

    try {
      // Act
      const usecase = new UpdateUserStateUseCase(mockUserRepo, mockUserQS)
      await usecase.do({ id: '123', status: 'RECESS' })
      fail('can not reach here!')
    } catch (error) {
      // Assert
      expect(error.message).toBe(ERROR_MESSAGE)
    }
  })
})
