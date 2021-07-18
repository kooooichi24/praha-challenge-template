import { prisma } from '@testUtil/prisma'
import { UserQS } from '../../query-service/user/user-qs'
import { UserDTO } from 'src/app/user/query-service-interface/user-qs'

describe('all-users-qs.integration.ts', () => {
  const userQS = new UserQS(prisma)

  beforeAll(async () => {
    await prisma.user.deleteMany({})
  })
  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('getAll', () => {
    afterEach(async () => {
      await prisma.user.deleteMany({})
    })

    it('[正常系]userを取得できる', async () => {
      // Arrange
      const usersExpected = [
        new UserDTO({
          id: '1',
          name: 'furukawa',
          mail: 'furukawa@gmai.com',
        }),
        new UserDTO({
          id: '2',
          name: 'nakano',
          mail: 'nakano@gmai.com',
        }),
        new UserDTO({
          id: '3',
          name: 'sasaki',
          mail: 'sasaki@gmai.com',
        }),
      ]
      await Promise.all(
        usersExpected.map(async (user: UserDTO) => {
          await prisma.user.create({
            data: user,
          })
        }),
      )

      // Act
      const actual = await userQS.getAll()

      // Assert
      expect(actual).toEqual(usersExpected)
    })
  })
})
