import { prisma } from '@testUtil/prisma'
import { AllUsersQS } from '../../query-service/user/all-users-qs'
import { AllUsersDTO } from 'src/app/user/query-service-interface/all-users-qs'

describe('all-users-qs.integration.ts', () => {
  const allUsersQS = new AllUsersQS(prisma)

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
        new AllUsersDTO({
          id: '1',
          name: 'furukawa',
          mail: 'furukawa@gmai.com',
        }),
        new AllUsersDTO({
          id: '2',
          name: 'nakano',
          mail: 'nakano@gmai.com',
        }),
        new AllUsersDTO({
          id: '3',
          name: 'sasaki',
          mail: 'sasaki@gmai.com',
        }),
      ]
      await Promise.all(
        usersExpected.map(async (user: AllUsersDTO) => {
          await prisma.user.create({
            data: user,
          })
        }),
      )

      // Act
      const actual = await allUsersQS.getAll()

      // Assert
      expect(actual).toEqual(usersExpected)
    })
  })
})
