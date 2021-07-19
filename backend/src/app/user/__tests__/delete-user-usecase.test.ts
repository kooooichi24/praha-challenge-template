import { PrismaClient } from '@prisma/client'
import { UserRepository } from 'src/infra/db/repository/user/user-repository'
import { UserQS } from 'src/infra/db/query-service/user/user-qs'
import { DeleteUserUseCase } from '../delete-user-usecase'
import { mocked } from 'ts-jest/utils'
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing'
import { User } from 'src/domain/user/entity/user'
import { createRandomIdString } from 'src/util/random'
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
    const deleteUserId = createRandomIdString()
    const responseFindByIdUser = new UserDTO({
      id: deleteUserId,
      mail: 'mail@gmail.com',
      name: 'name',
      status: 'ENROLLMENT',
    })
    mockUserQS.findById.mockResolvedValueOnce(responseFindByIdUser)
    const deleteUser = new User({
      id: deleteUserId,
      mail: 'mail@gmail.com',
      name: 'name',
      status: 'ENROLLMENT',
    })
    mockUserRepo.delete.mockResolvedValueOnce(deleteUser)

    // Act
    const usecase = new DeleteUserUseCase(mockUserRepo, mockUserQS)
    const target = await usecase.do({ id: deleteUserId })

    // Assert
    expect(mockUserQS.findById).toHaveBeenLastCalledWith(deleteUserId)
    expect(mockUserRepo.delete).toHaveBeenLastCalledWith(deleteUser)
    expect(target).toBe(undefined)
  })

  it('[異常系]: idに該当するユーザが存在しない場合、例外が発生する', async () => {
    // Arrange
    const deleteUserId = createRandomIdString()
    mockUserQS.findById.mockResolvedValueOnce(undefined)

    try {
      // Act
      const usecase = new DeleteUserUseCase(mockUserRepo, mockUserQS)
      const target = await usecase.do({ id: deleteUserId })
      fail()
    } catch (e) {
      // Assert
      expect(mockUserQS.findById).toHaveBeenLastCalledWith(deleteUserId)
      expect(e.message).toBe('idに該当するユーザーが存在しません')
    }
  })
})
