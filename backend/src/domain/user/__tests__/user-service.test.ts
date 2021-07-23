import { PrismaClient } from '@prisma/client'
import { UserRepository } from 'src/infra/db/repository/user/user-repository'
import { User } from 'src/domain/user/entity/user'
import { createRandomIdString } from 'src/util/random'
import { UserService } from 'src/domain/user/service/user-service'

jest.mock('uuidv4')

describe('UserService', () => {
  const prisma = new PrismaClient()

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('duplicateMailCheck', () => {
    it('[正常系]: メールアドレスが重複していない場合、例外が発生しないこと', async () => {
      // Arrange
      const userRepoSpy = jest
        .spyOn(UserRepository.prototype, 'getByMail')
        .mockResolvedValueOnce(undefined)
      const request = new User({
        id: createRandomIdString(),
        mail: 'mail@gmail.com',
        name: 'name',
        status: 'ENROLLMENT',
      })

      // Act
      const target = new UserService(new UserRepository(prisma))
      await target.duplicateMailCheck(request)

      // Assert
      expect(userRepoSpy).toHaveBeenLastCalledWith('mail@gmail.com')
    })

    it('[異常系]: メールアドレスが重複している場合、例外が発生すること', async () => {
      // Arrange
      const request = new User({
        id: createRandomIdString(),
        mail: 'mail@gmail.com',
        name: 'name',
        status: 'ENROLLMENT',
      })
      const userRepoSpy = jest
        .spyOn(UserRepository.prototype, 'getByMail')
        .mockResolvedValueOnce(request)

      try {
        // Act
        const target = new UserService(new UserRepository(prisma))
        await target.duplicateMailCheck(request)
        fail('should not reach here!')
      } catch (e) {
        // Assert
        expect(e.message).toBe('メールアドレスが重複しています!')
      }
    })
  })
})
