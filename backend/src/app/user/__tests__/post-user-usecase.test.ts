import { PrismaClient } from '@prisma/client'
import { UserRepository } from 'src/infra/db/repository/user/user-repository'
import { PostUserUseCase } from '../post-user-usecase'
import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { User } from 'src/domain/user/entity/user'
import { createRandomIdString } from 'src/util/random'
import { uuid as uuidv4 } from 'uuidv4'

jest.mock('@prisma/client')
jest.mock('uuidv4')
jest.mock('src/infra/db/repository/user/user-repository')

describe('do', () => {
  let mockUserRepo: MockedObjectDeep<UserRepository>
  const mockUuidv4 = uuidv4 as jest.Mock
  const mockUuidv4Response = '3f86f7dd-d67f-4516-afba-8021d7696462'

  beforeAll(() => {
    const prisma = new PrismaClient()
    mockUserRepo = mocked(new UserRepository(prisma), true)
    mockUuidv4.mockImplementation(() => mockUuidv4Response)
  })
  it('[正常系]: 例外が発生しない', async () => {
    // Arrange
    const mockResponseUser = new User({
      id: createRandomIdString(),
      mail: 'mail@gmail.com',
      name: 'name',
    })
    mockUserRepo.save.mockResolvedValueOnce(mockResponseUser)

    // Act
    const usecase = new PostUserUseCase(mockUserRepo)
    await usecase.do({ name: 'name', mail: 'mail@gmail.com' })

    // Assert
    expect(mockUserRepo.save).toHaveBeenLastCalledWith(mockResponseUser)
  })
  it('[異常系]: userRepo.saveで例外が発生した場合、例外が発生する', async () => {
    // Arrange
    const ERROR_MESSAGE = 'error!'
    mockUserRepo.save.mockRejectedValueOnce(ERROR_MESSAGE)

    try {
      // Act
      const usecase = new PostUserUseCase(mockUserRepo)
      await usecase.do({ name: 'name', mail: 'mail@gmail.com' })
      fail()
    } catch (e) {
      // Assert
      expect(e).toBe(ERROR_MESSAGE)
    }
  })
})
