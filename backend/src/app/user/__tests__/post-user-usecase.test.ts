import { PrismaClient } from '@prisma/client'
import { UserRepository } from 'src/infra/db/repository/user/user-repository'
import { PostUserUseCase } from '../post-user-usecase'
import { User } from 'src/domain/user/entity/user'
import { createRandomIdString } from 'src/util/random'
import { uuid as uuidv4 } from 'uuidv4'
import { UserService } from 'src/domain/user/service/user-service'

jest.mock('uuidv4')

describe('do', () => {
  const prisma = new PrismaClient()
  const mockUuidv4 = uuidv4 as jest.Mock
  const mockUuidv4Response = '3f86f7dd-d67f-4516-afba-8021d7696462'

  beforeAll(() => {
    mockUuidv4.mockImplementation(() => mockUuidv4Response)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('[正常系]: 例外が発生しない', async () => {
    // Arrange
    const mockResponseUser = new User({
      id: createRandomIdString(),
      mail: 'mail@gmail.com',
      name: 'name',
    })
    const userRepoSpy = jest
      .spyOn(UserRepository.prototype, 'save')
      .mockResolvedValue(mockResponseUser)
    const userServiceSpy = jest
      .spyOn(UserService.prototype, 'duplicateMailCheck')
      .mockResolvedValue()

    // Act
    const usecase = new PostUserUseCase(new UserRepository(prisma))
    await usecase.do({ name: 'name', mail: 'mail@gmail.com' })

    // Assert
    expect(userRepoSpy).toHaveBeenLastCalledWith(mockResponseUser)
    expect(userServiceSpy).toHaveBeenCalledTimes(1)
  })

  it('[異常系]: userRepo.saveで例外が発生した場合、例外が発生する', async () => {
    // Arrange
    const ERROR_MESSAGE = 'error!'
    const userRepoSpy = jest
      .spyOn(UserRepository.prototype, 'save')
      .mockRejectedValueOnce(ERROR_MESSAGE)
    const userServiceSpy = jest
      .spyOn(UserService.prototype, 'duplicateMailCheck')
      .mockResolvedValue()

    try {
      // Act
      const usecase = new PostUserUseCase(new UserRepository(prisma))
      await usecase.do({ name: 'name', mail: 'mail@gmail.com' })
      fail('should not reach here!')
    } catch (e) {
      // Assert
      expect(e).toBe(ERROR_MESSAGE)
      expect(userServiceSpy).toHaveBeenCalledTimes(1)
    }
  })

  it('[異常系]: メールアドレスが重複している場合、例外が発生する', async () => {
    // Arrange
    const ERROR_MESSAGE = 'メールアドレスが重複しています!'
    const mockResponseUser = new User({
      id: createRandomIdString(),
      mail: 'mail@gmail.com',
      name: 'name',
    })
    const userRepoSpy = jest
      .spyOn(UserRepository.prototype, 'save')
      .mockResolvedValue(mockResponseUser)
    const userServiceSpy = jest
      .spyOn(UserService.prototype, 'duplicateMailCheck')
      .mockRejectedValueOnce(ERROR_MESSAGE)

    try {
      // Act
      const usecase = new PostUserUseCase(new UserRepository(prisma))
      await usecase.do({ name: 'name', mail: 'mail@gmail.com' })
      fail('should not reach here!')
    } catch (e) {
      // Assert
      expect(e).toBe(ERROR_MESSAGE)
      expect(userRepoSpy).toHaveBeenCalledTimes(0)
    }
  })
})
