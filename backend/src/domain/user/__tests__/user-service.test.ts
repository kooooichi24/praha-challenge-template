import { PrismaClient } from '@prisma/client'
import { UserRepository } from 'src/infra/db/repository/user/user-repository'
import { User } from 'src/domain/user/user'
import { UserService } from 'src/domain/user/service/user-service'

jest.mock('uuidv4')

describe('UserService', () => {
  const prisma = new PrismaClient()

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('duplicateMailCheck', () => {
    test('[正常系]: メールアドレスが重複していない場合、例外が発生しないこと', async () => {
      // Arrange
      const user = User.create({
        mail: 'mail@gmail.com',
        name: 'name',
      })
      const userRepoSpy = jest
        .spyOn(UserRepository.prototype, 'getByMail')
        .mockResolvedValueOnce(undefined)

      // Act
      const target = new UserService(new UserRepository(prisma))
      await target.duplicateMailCheck(user)

      // Assert
      expect(userRepoSpy).toHaveBeenLastCalledWith('mail@gmail.com')
    })

    test('[異常系]: メールアドレスが重複している場合、例外が発生すること', async () => {
      // Arrange
      const user = User.create({
        mail: 'mail@gmail.com',
        name: 'name',
      })
      const userRepoSpy = jest
        .spyOn(UserRepository.prototype, 'getByMail')
        .mockResolvedValueOnce(user)

      try {
        // Act
        const target = new UserService(new UserRepository(prisma))
        await target.duplicateMailCheck(user)
        fail('should not reach here!')
      } catch (e: any) {
        // Assert
        expect(e.message).toBe('メールアドレスが重複しています!')
      }
    })
  })

  describe('checkExist', () => {
    test('[正常系]: ユーザが存在している場合、例外が発生しないこと', async () => {
      // Arrange
      const userRepoSpy = jest
        .spyOn(UserRepository.prototype, 'exist')
        .mockResolvedValueOnce(true)

      // Act
      const target = new UserService(new UserRepository(prisma))
      await target.checkExist({ userId: '123' })

      // Assert
      expect(userRepoSpy).toHaveBeenLastCalledWith('123')
    })

    test('[異常系]: ユーザが存在しない場合、例外が発生すること', async () => {
      // Arrange
      const userRepoSpy = jest
        .spyOn(UserRepository.prototype, 'exist')
        .mockResolvedValueOnce(false)

      try {
        // Act
        const target = new UserService(new UserRepository(prisma))
        await target.checkExist({ userId: '123' })
        fail('should not reach here!')
      } catch (e: any) {
        // Assert
        expect(e.message).toBe('ユーザーが存在しません')
      }
    })
  })
})
