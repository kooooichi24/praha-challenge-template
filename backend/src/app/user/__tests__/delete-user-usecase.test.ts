import { PrismaClient } from '@prisma/client'
import { UserRepository } from 'src/infra/db/repository/user/user-repository'
import { UserQS } from 'src/infra/db/query-service/user/user-qs'
import { DeleteUserUseCase } from '../delete-user-usecase'
import { User } from 'src/domain/user/entity/user'
import { createRandomIdString } from 'src/util/random'
import { UserDTO } from '../query-service-interface/user-qs'
import { UserService } from 'src/domain/user/service/user-service'

describe('do', () => {
  const prisma = new PrismaClient()

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('[正常系]: 例外が発生しない', async () => {
    // Arrange
    const deleteUserId = createRandomIdString()
    const responseFindByIdUser = new UserDTO({
      id: deleteUserId,
      mail: 'mail@gmail.com',
      name: 'name',
      status: 'ENROLLMENT',
    })
    const userQSSpy = jest
      .spyOn(UserQS.prototype, 'findById')
      .mockResolvedValueOnce(responseFindByIdUser)
    const deleteUser = new User({
      id: deleteUserId,
      mail: 'mail@gmail.com',
      name: 'name',
      status: 'ENROLLMENT',
    })
    const userRepoSpy = jest
      .spyOn(UserRepository.prototype, 'delete')
      .mockResolvedValueOnce(deleteUser)

    // Act
    const usecase = new DeleteUserUseCase(
      new UserRepository(prisma),
      new UserQS(prisma),
    )
    const target = await usecase.do({ id: deleteUserId })

    // Assert
    expect(userRepoSpy).toHaveBeenLastCalledWith(deleteUser)
    expect(target).toBe(undefined)
  })

  it('[異常系]: idに該当するユーザが存在しない場合、例外が発生する', async () => {
    // Arrange
    const deleteUserId = createRandomIdString()
    const userQSSpy = jest
      .spyOn(UserQS.prototype, 'findById')
      .mockResolvedValueOnce(undefined)

    try {
      // Act
      const usecase = new DeleteUserUseCase(
        new UserRepository(prisma),
        new UserQS(prisma),
      )
      const target = await usecase.do({ id: deleteUserId })
      fail()
    } catch (e) {
      // Assert
      expect(userQSSpy).toHaveBeenLastCalledWith(deleteUserId)
      expect(e.message).toBe('idに該当するユーザーが存在しません')
    }
  })
})
