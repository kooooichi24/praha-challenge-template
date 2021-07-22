import { PrismaClient } from '@prisma/client'
import { UserRepository } from 'src/infra/db/repository/user/user-repository'
import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { User } from 'src/domain/user/entity/user'
import { createRandomIdString } from 'src/util/random'
import { uuid as uuidv4 } from 'uuidv4'
import { UpdateUserStateUseCase } from '../update-user-state-usecase'
import { UserQS } from 'src/infra/db/query-service/user/user-qs'
import { UserDTO } from '../query-service-interface/user-qs'

jest.mock('@prisma/client')
jest.mock('uuidv4')
jest.mock('src/infra/db/repository/user/user-repository')
jest.mock('src/infra/db/query-service/user/user-qs')

describe('do', () => {
  let mockUserRepo: MockedObjectDeep<UserRepository>
  let mockUserQS: MockedObjectDeep<UserQS>
  const mockUuidv4 = uuidv4 as jest.Mock
  const mockUuidv4Response = '3f86f7dd-d67f-4516-afba-8021d7696462'

  beforeAll(() => {
    const prisma = new PrismaClient()
    mockUserRepo = mocked(new UserRepository(prisma), true)
    mockUserQS = mocked(new UserQS(prisma), true)
    mockUuidv4.mockImplementation(() => mockUuidv4Response)
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
  // it('[異常系]: userRepo.saveで例外が発生した場合、例外が発生する', async () => {
  //   // Arrange
  //   const ERROR_MESSAGE = 'error!'
  //   mockUserRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)

  //   try {
  //     // Act
  //     const usecase = new PostUserUseCase(mockUserRepo)
  //     await usecase.do({ name: 'name', mail: 'mail@gmail.com' })
  //     fail()
  //   } catch (e) {
  //     // Assert
  //     expect(e).toBe(ERROR_MESSAGE)
  //   }
  // })
})
