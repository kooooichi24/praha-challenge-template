import { PrismaClient } from '@prisma/client'
import { UserRepository } from 'src/infra/db/repository/user/user-repository'
import { UserQS } from 'src/infra/db/query-service/user/user-qs'
import { DeleteUserUseCase } from '../delete-user-usecase'
import { User } from 'src/domain/user/user'
import { createRandomIdString } from 'src/util/random'
import { UserWithTasksStatusDTO } from '../query-service-interface/user-qs'
import { uuid as uuidv4 } from 'uuidv4'

jest.mock('uuidv4')

describe('do', () => {
  const mockUuidv4 = uuidv4 as jest.Mock
  const mockUuidv4Response = '3f86f7dd-d67f-4516-afba-8021d7696462'
  const prisma = new PrismaClient()
  let usecase: DeleteUserUseCase
  let userQSSpy: jest.SpyInstance
  let userRepoSpy: jest.SpyInstance

  beforeEach(() => {
    mockUuidv4.mockImplementation(() => mockUuidv4Response)
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
    const findByIdResponse = new UserWithTasksStatusDTO({
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
    const deletedUser = User.create({
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

  test('[異常系] idに該当するユーザが存在しない場合、例外が発生する', async () => {
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
