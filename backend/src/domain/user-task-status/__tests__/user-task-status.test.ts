import { UserTaskStatus } from '../entity/user-task-status'

describe('user-task-status', () => {
  describe('changeStatus', () => {
    test.each`
      before         | after          | expectedStatus
      ${'TODO'}      | ${'REVIEWING'} | ${'REVIEWING'}
      ${'TODO'}      | ${'DONE'}      | ${'DONE'}
      ${'REVIEWING'} | ${'DONE'}      | ${'DONE'}
      ${'REVIEWING'} | ${'TODO'}      | ${'TODO'}
    `(
      '[正常系] Statusを$beforeから$afterへ変更することができる',
      ({ before, after, expectedStatus }) => {
        // Arrange
        const expected = expectedStatus

        // Act
        const userTaskStatus = new UserTaskStatus({
          userId: '1',
          taskId: '1',
          status: before,
        })
        userTaskStatus.changeStatus(after)
        const { status } = userTaskStatus.getAllProperties()

        // Assert
        expect(status).toBe(expected)
      },
    )

    test.each`
      before    | after
      ${'DONE'} | ${'TODO'}
      ${'DONE'} | ${'REVIEWING'}
    `(
      '[異常系] Statusを$beforeから$afterへ変更すると例外が発生する',
      ({ before, after }) => {
        // Arrange
        const ERROR_MESSAGE =
          'DONE状態の課題のステータスは変更することができません。'

        // Act
        const userTaskStatus = new UserTaskStatus({
          userId: '1',
          taskId: '1',
          status: before,
        })
        try {
          userTaskStatus.changeStatus(after)
          fail('should not reach here')
        } catch (e) {
          // Assert
          expect(e.message).toBe(ERROR_MESSAGE)
        }
      },
    )
  })
})
