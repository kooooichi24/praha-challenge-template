import { PrismaClient } from '@prisma/client'
import { UserRepository } from 'src/infra/db/repository/user/user-repository'
import { User } from 'src/domain/user/user'
import { UpdateUserStateUseCase } from '../update-user-state-usecase'
import { UserQS } from 'src/infra/db/query-service/user/user-qs'
import { UserDTO } from '../query-service-interface/user-qs'
import { UniqueEntityID } from 'src/domain/shared/UniqueEntityID'

describe('do', () => {
  const prisma = new PrismaClient()

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('[正常系]: 例外が発生しない', async () => {
    // Arrange
    const mockResponseUserDTO = new UserDTO({
      id: '123',
      mail: 'mail@gmail.com',
      name: 'name',
      status: 'ENROLLMENT',
      tasksStatus: [],
    })
    const userQSSpy = jest
      .spyOn(UserQS.prototype, 'findById')
      .mockResolvedValueOnce(mockResponseUserDTO)

    const mockResponseUser = User.create(
      {
        mail: 'mail@gmail.com',
        name: 'name',
        status: 'RECESS',
      },
      new UniqueEntityID('123'),
    )
    const userRepoSpy = jest
      .spyOn(UserRepository.prototype, 'updateStatus')
      .mockResolvedValueOnce(mockResponseUser)
    const expected = User.create(
      {
        mail: 'mail@gmail.com',
        name: 'name',
        status: 'RECESS',
      },
      new UniqueEntityID('123'),
    )

    // Act
    const usecase = new UpdateUserStateUseCase(
      new UserRepository(prisma),
      new UserQS(prisma),
    )
    const actual = await usecase.do({ id: '123', status: 'RECESS' })

    // Assert
    expect(userQSSpy).toHaveBeenLastCalledWith('123')
    expect(userRepoSpy).toHaveBeenLastCalledWith(expected)
    expect(actual).toStrictEqual(expected)
  })

  test('[異常系]: idに該当するユーザーが存在しない場合、例外が発生する', async () => {
    // Arrange
    const ERROR_MESSAGE = 'idに該当するユーザーが存在しません'
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
    } catch (error: any) {
      // Assert
      expect(error.message).toBe(ERROR_MESSAGE)
    }
  })
})
