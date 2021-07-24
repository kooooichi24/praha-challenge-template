export class UserTaskStatus {
  private userId: string
  private taskId: string
  private status: 'TODO' | 'REVIEWING' | 'DONE'

  public constructor(props: {
    userId: string
    taskId: string
    status: 'TODO' | 'REVIEWING' | 'DONE'
  }) {
    const { userId, taskId, status } = props
    this.userId = userId
    this.taskId = taskId
    this.status = status
  }

  public getAllProperties() {
    return {
      userId: this.userId,
      taskId: this.taskId,
      status: this.status,
    }
  }

  public changeStatus(status: 'TODO' | 'REVIEWING' | 'DONE') {
    if (this.status === 'DONE') {
      throw Error('DONE状態の課題のステータスは変更することができません。')
    }
    this.status = status
  }
}
