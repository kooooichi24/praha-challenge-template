import { PrismaClient } from '@prisma/client'
import { UserRepository } from 'src/infra/db/repository/user/user-repository'
import { User } from 'src/domain/user/entity/user'
import { UpdateUserStateUseCase } from '../update-user-state-usecase'
import { UserQS } from 'src/infra/db/query-service/user/user-qs'
import { UserDTO } from '../query-service-interface/user-qs'
import { UserService } from 'src/domain/user/service/user-service'

describe('do', () => {
  const prisma = new PrismaClient()

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('[正常系]: 例外が発生しない', async () => {
    // Arrange
    const mockResponseUserDTO = new UserDTO({
      id: '123',
      mail: 'mail@gmail.com',
      name: 'name',
      status: 'ENROLLMENT',
    })
    const userServiceSpy = jest
      .spyOn(UserService.prototype, 'checkExist')
      .mockImplementation(async (params) => {
        // noop
      })
    const userQSSpy = jest
      .spyOn(UserQS.prototype, 'findById')
      .mockResolvedValueOnce(mockResponseUserDTO)
    const mockResponseUser = new User({
      id: '123',
      mail: 'mail@gmail.com',
      name: 'name',
      status: 'RECESS',
    })
    const userRepoSpy = jest
      .spyOn(UserRepository.prototype, 'updateStatus')
      .mockResolvedValueOnce(mockResponseUser)
    const expected = new User({
      id: '123',
      mail: 'mail@gmail.com',
      name: 'name',
      status: 'RECESS',
    })

    // Act
    const usecase = new UpdateUserStateUseCase(
      new UserRepository(prisma),
      new UserQS(prisma),
    )
    const actual = await usecase.do({ id: '123', status: 'RECESS' })

    // Assert
    expect(userServiceSpy).toHaveBeenLastCalledWith({ userId: '123' })
    expect(userQSSpy).toHaveBeenLastCalledWith('123')
    expect(userRepoSpy).toHaveBeenLastCalledWith(expected)
    expect(actual).toStrictEqual(expected)
  })

  it('[異常系]: idに該当するユーザーが存在しない場合、例外が発生する', async () => {
    // Arrange
    const ERROR_MESSAGE = 'idに該当するユーザーが存在しません'
    const userServiceSpy = jest
      .spyOn(UserService.prototype, 'checkExist')
      .mockImplementation(async (params) => {
        // noop
      })
    const userQSSpy = jest
      .spyOn(UserQS.prototype, 'findById')
      .mockResolvedValueOnce(undefined)

    try {
      // Act
      const usecase = new UpdateUserStateUseCase(
        new UserRepository(prisma),
        new UserQS(prisma),
      )
      await usecase.do({ id: '123', status: 'RECESS' })
      fail('can not reach here!')
    } catch (error) {
      // Assert
      expect(error.message).toBe(ERROR_MESSAGE)
    }
  })

  it('[異常系]: ユーザーが存在しない場合、例外が発生する', async () => {
    // Arrange
    const ERROR_MESSAGE = 'ユーザーが存在しません'
    const userServiceSpy = jest
      .spyOn(UserService.prototype, 'checkExist')
      .mockRejectedValue(ERROR_MESSAGE)

    try {
      // Act
      const usecase = new UpdateUserStateUseCase(
        new UserRepository(prisma),
        new UserQS(prisma),
      )
      await usecase.do({ id: '123', status: 'RECESS' })
      fail('can not reach here!')
    } catch (error) {
      // Assert
      expect(error).toBe(ERROR_MESSAGE)
    }
  })
})
