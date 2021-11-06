import { prisma } from '@testUtil/prisma'
import { UserQS } from '../../query-service/user/user-qs'
import { UserDTO } from 'src/app/user/query-service-interface/user-qs'
import { Page } from 'src/app/shared/Paging'

describe('user-qs.integration.ts', () => {
  const userQS = new UserQS(prisma)

  beforeEach(async () => {
    await setBaseDb()
  })

  afterEach(async () => {
    await prisma.users.deleteMany({})
    await prisma.tasks.deleteMany({})
    await prisma.userTaskStatus.deleteMany({})
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('getAll', () => {
    it('[正常系]userを取得できる', async () => {
      // Arrange
      const usersExpected = [
        new UserDTO({
          id: 'user1',
          name: 'user1',
          mail: 'user1@example.com',
          status: 'ENROLLMENT',
          tasksStatus: [
            {
              userId: 'user1',
              taskId: 'task1',
              status: 'DONE',
            },
            {
              userId: 'user1',
              taskId: 'task2',
              status: 'REVIEWING',
            },
            {
              userId: 'user1',
              taskId: 'task3',
              status: 'TODO',
            },
            {
              userId: 'user1',
              taskId: 'task4',
              status: 'TODO',
            },
            {
              userId: 'user1',
              taskId: 'task5',
              status: 'TODO',
            },
            {
              userId: 'user1',
              taskId: 'task6',
              status: 'TODO',
            },
          ],
        }),
        new UserDTO({
          id: 'user2',
          name: 'user2',
          mail: 'user2@example.com',
          status: 'ENROLLMENT',
          tasksStatus: [
            {
              userId: 'user2',
              taskId: 'task1',
              status: 'DONE',
            },
            {
              userId: 'user2',
              taskId: 'task2',
              status: 'DONE',
            },
            {
              userId: 'user2',
              taskId: 'task3',
              status: 'REVIEWING',
            },
            {
              userId: 'user2',
              taskId: 'task4',
              status: 'TODO',
            },
            {
              userId: 'user2',
              taskId: 'task5',
              status: 'TODO',
            },
            {
              userId: 'user2',
              taskId: 'task6',
              status: 'TODO',
            },
          ],
        }),
        new UserDTO({
          id: 'user3',
          name: 'user3',
          mail: 'user3@example.com',
          status: 'ENROLLMENT',
          tasksStatus: [
            {
              userId: 'user3',
              taskId: 'task1',
              status: 'DONE',
            },
            {
              userId: 'user3',
              taskId: 'task2',
              status: 'DONE',
            },
            {
              userId: 'user3',
              taskId: 'task3',
              status: 'DONE',
            },
            {
              userId: 'user3',
              taskId: 'task4',
              status: 'REVIEWING',
            },
            {
              userId: 'user3',
              taskId: 'task5',
              status: 'TODO',
            },
            {
              userId: 'user3',
              taskId: 'task6',
              status: 'TODO',
            },
          ],
        }),
        new UserDTO({
          id: 'user4',
          name: 'user4',
          mail: 'user4@example.com',
          status: 'RECESS',
          tasksStatus: [
            {
              userId: 'user4',
              taskId: 'task1',
              status: 'DONE',
            },
            {
              userId: 'user4',
              taskId: 'task2',
              status: 'DONE',
            },
            {
              userId: 'user4',
              taskId: 'task3',
              status: 'DONE',
            },
            {
              userId: 'user4',
              taskId: 'task4',
              status: 'DONE',
            },
            {
              userId: 'user4',
              taskId: 'task5',
              status: 'REVIEWING',
            },
            {
              userId: 'user4',
              taskId: 'task6',
              status: 'TODO',
            },
          ],
        }),
        new UserDTO({
          id: 'user5',
          name: 'user5',
          mail: 'user5@example.com',
          status: 'LEFT',
          tasksStatus: [
            {
              userId: 'user5',
              taskId: 'task1',
              status: 'DONE',
            },
            {
              userId: 'user5',
              taskId: 'task2',
              status: 'DONE',
            },
            {
              userId: 'user5',
              taskId: 'task3',
              status: 'DONE',
            },
            {
              userId: 'user5',
              taskId: 'task4',
              status: 'DONE',
            },
            {
              userId: 'user5',
              taskId: 'task5',
              status: 'DONE',
            },
            {
              userId: 'user5',
              taskId: 'task6',
              status: 'REVIEWING',
            },
          ],
        }),
      ]

      // Act
      const actual = await userQS.findAll()

      // Assert
      expect(actual).toEqual(usersExpected)
    })
  })

  describe('findById', () => {
    it('[正常系]idに合致したuserを取得できる', async () => {
      // Arrange
      const expected = new UserDTO({
        id: 'user1',
        name: 'user1',
        mail: 'user1@example.com',
        status: 'ENROLLMENT',
        tasksStatus: [
          {
            userId: 'user1',
            taskId: 'task1',
            status: 'DONE',
          },
          {
            userId: 'user1',
            taskId: 'task2',
            status: 'REVIEWING',
          },
          {
            userId: 'user1',
            taskId: 'task3',
            status: 'TODO',
          },
          {
            userId: 'user1',
            taskId: 'task4',
            status: 'TODO',
          },
          {
            userId: 'user1',
            taskId: 'task5',
            status: 'TODO',
          },
          {
            userId: 'user1',
            taskId: 'task6',
            status: 'TODO',
          },
        ],
      })

      // Act
      const actual = await userQS.findById('user1')

      // Assert
      expect(actual).toStrictEqual(expected)
    })

    it('[正常系]idに合致したuserが存在しない場合、undefinedを取得できる', async () => {
      // Arrange
      // Act
      const actual = await userQS.findById('evalId')

      // Assert
      expect(actual).toBeUndefined()
    })
  })

  // describe('fetchPageByTaskAndStatus', () => {
  //   test('正常系', async () => {
  //     // Arrange
  //     const expectedPage = new Page(
  //       [
  //         new UserDTO({
  //           id: '1',
  //           name: 'furukawa',
  //           mail: 'furukawa@gmai.com',
  //           status: 'ENROLLMENT',
  //           tasksStatus: [],
  //         }),
  //         new UserDTO({
  //           id: '2',
  //           name: 'nakano',
  //           mail: 'nakano@gmai.com',
  //           status: 'ENROLLMENT',
  //           tasksStatus: [],
  //         }),
  //         new UserDTO({
  //           id: '3',
  //           name: 'sasaki',
  //           mail: 'sasaki@gmai.com',
  //           status: 'ENROLLMENT',
  //           tasksStatus: [],
  //         }),
  //       ],
  //       {
  //         totalCount: 0,
  //         pageSize: 0,
  //         pageNumber: 0,
  //       },
  //     )

  //     // Act
  //     const actual = await userQS.findAll()

  //     // Assert
  //     expect(actual).toEqual(expectedPage)
  //   })
  // })
})

async function setBaseDb(): Promise<void> {
  await prisma.users.createMany({
    data: [
      {
        id: 'user1',
        name: 'user1',
        mail: 'user1@example.com',
        status: 'ENROLLMENT',
      },
      {
        id: 'user2',
        name: 'user2',
        mail: 'user2@example.com',
        status: 'ENROLLMENT',
      },
      {
        id: 'user3',
        name: 'user3',
        mail: 'user3@example.com',
        status: 'ENROLLMENT',
      },
      {
        id: 'user4',
        name: 'user4',
        mail: 'user4@example.com',
        status: 'RECESS',
      },
      {
        id: 'user5',
        name: 'user5',
        mail: 'user5@example.com',
        status: 'LEFT',
      },
    ],
  })
  await prisma.tasks.createMany({
    data: [
      {
        id: 'task1',
        title: 'title1',
        content: 'content1',
      },
      {
        id: 'task2',
        title: 'title2',
        content: 'content2',
      },
      {
        id: 'task3',
        title: 'title3',
        content: 'content3',
      },
      {
        id: 'task4',
        title: 'title4',
        content: 'content4',
      },
      {
        id: 'task5',
        title: 'title5',
        content: 'content5',
      },
      {
        id: 'task6',
        title: 'title6',
        content: 'content6',
      },
    ],
  })
  await prisma.userTaskStatus.createMany({
    data: [
      {
        userId: 'user1',
        taskId: 'task1',
        status: 'DONE',
      },
      {
        userId: 'user1',
        taskId: 'task2',
        status: 'REVIEWING',
      },
      {
        userId: 'user1',
        taskId: 'task3',
        status: 'TODO',
      },
      {
        userId: 'user1',
        taskId: 'task4',
        status: 'TODO',
      },
      {
        userId: 'user1',
        taskId: 'task5',
        status: 'TODO',
      },
      {
        userId: 'user1',
        taskId: 'task6',
        status: 'TODO',
      },
      {
        userId: 'user2',
        taskId: 'task1',
        status: 'DONE',
      },
      {
        userId: 'user2',
        taskId: 'task2',
        status: 'DONE',
      },
      {
        userId: 'user2',
        taskId: 'task3',
        status: 'REVIEWING',
      },
      {
        userId: 'user2',
        taskId: 'task4',
        status: 'TODO',
      },
      {
        userId: 'user2',
        taskId: 'task5',
        status: 'TODO',
      },
      {
        userId: 'user2',
        taskId: 'task6',
        status: 'TODO',
      },
      {
        userId: 'user3',
        taskId: 'task1',
        status: 'DONE',
      },
      {
        userId: 'user3',
        taskId: 'task2',
        status: 'DONE',
      },
      {
        userId: 'user3',
        taskId: 'task3',
        status: 'DONE',
      },
      {
        userId: 'user3',
        taskId: 'task4',
        status: 'REVIEWING',
      },
      {
        userId: 'user3',
        taskId: 'task5',
        status: 'TODO',
      },
      {
        userId: 'user3',
        taskId: 'task6',
        status: 'TODO',
      },
      {
        userId: 'user4',
        taskId: 'task1',
        status: 'DONE',
      },
      {
        userId: 'user4',
        taskId: 'task2',
        status: 'DONE',
      },
      {
        userId: 'user4',
        taskId: 'task3',
        status: 'DONE',
      },
      {
        userId: 'user4',
        taskId: 'task4',
        status: 'DONE',
      },
      {
        userId: 'user4',
        taskId: 'task5',
        status: 'REVIEWING',
      },
      {
        userId: 'user4',
        taskId: 'task6',
        status: 'TODO',
      },
      {
        userId: 'user5',
        taskId: 'task1',
        status: 'DONE',
      },
      {
        userId: 'user5',
        taskId: 'task2',
        status: 'DONE',
      },
      {
        userId: 'user5',
        taskId: 'task3',
        status: 'DONE',
      },
      {
        userId: 'user5',
        taskId: 'task4',
        status: 'DONE',
      },
      {
        userId: 'user5',
        taskId: 'task5',
        status: 'DONE',
      },
      {
        userId: 'user5',
        taskId: 'task6',
        status: 'REVIEWING',
      },
    ],
  })
}
