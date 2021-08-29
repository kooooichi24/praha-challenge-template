import { PrismaClient } from '@prisma/client'
import { UserRepository } from 'src/infra/db/repository/user/user-repository'
import { UserQS } from 'src/infra/db/query-service/user/user-qs'
import { DeleteUserUseCase } from '../delete-user-usecase'
import { User } from 'src/domain/user/entity/user'
import { createRandomIdString } from 'src/util/random'
import { UserDTO } from '../query-service-interface/user-qs'

describe('do', () => {
  const prisma = new PrismaClient()
  let usecase: DeleteUserUseCase
  let userQSSpy: jest.SpyInstance
  let userRepoSpy: jest.SpyInstance

  beforeEach(() => {
    usecase = new DeleteUserUseCase(
      new UserRepository(prisma),
      new UserQS(prisma),
    )
    initSpy()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('[正常系] 例外が発生しない', async () => {
    // Arrange
    const deletedUserId = createRandomIdString()
    const findByIdResponse = new UserDTO({
      id: deletedUserId,
      mail: 'mail@gmail.com',
      name: 'name',
      status: 'ENROLLMENT',
      tasksStatus: [
        {
          userId: deletedUserId,
          taskId: '1',
          status: 'TODO',
        },
        {
          userId: deletedUserId,
          taskId: '2',
          status: 'REVIEWING',
        },
      ],
    })
    const deletedUser = new User({
      id: deletedUserId,
      mail: 'mail@gmail.com',
      name: 'name',
      status: 'ENROLLMENT',
    })
    userQSSpy = jest
      .spyOn(UserQS.prototype, 'findById')
      .mockResolvedValueOnce(findByIdResponse)

    // Act
    await usecase.do({ id: deletedUserId })

    // Assert
    expect(userQSSpy).toHaveBeenCalledWith(deletedUserId)
    expect(userRepoSpy).toHaveBeenLastCalledWith(deletedUser)
  })

  it('[異常系] idに該当するユーザが存在しない場合、例外が発生する', async () => {
    // Arrange
    const deleteUserId = createRandomIdString()
    userQSSpy = jest
      .spyOn(UserQS.prototype, 'findById')
      .mockResolvedValueOnce(undefined)

    try {
      // Act
      await usecase.do({ id: deleteUserId })
      fail()
    } catch (e: any) {
      // Assert
      expect(e.message).toBe('idに該当するユーザーが存在しません')
    }
    expect(userQSSpy).toHaveBeenLastCalledWith(deleteUserId)
  })

  function initSpy() {
    userQSSpy = jest.spyOn(UserQS.prototype, 'findById').mockImplementation()
    userRepoSpy = jest
      .spyOn(UserRepository.prototype, 'delete')
      .mockResolvedValueOnce()
  }
})
