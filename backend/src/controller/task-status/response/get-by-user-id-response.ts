import { ApiProperty } from '@nestjs/swagger'
import { UserTaskStatus } from 'src/domain/user-task-status/entity/user-task-status'

export class GetByUserIdResponse {
  @ApiProperty({ type: () => [TaskStatus] })
  tasks: TaskStatus[]

  public constructor(params: { tasks: UserTaskStatus[] }) {
    this.tasks = params.tasks.map((task) => {
      const { userId, taskId, status } = task.getAllProperties()
      return new TaskStatus({
        userId,
        taskId,
        status,
      })
    })
  }
}

class TaskStatus {
  @ApiProperty()
  userId: string

  @ApiProperty()
  taskId: string

  @ApiProperty()
  status: string

  public constructor(params: {
    userId: string
    taskId: string
    status: string
  }) {
    this.userId = params.userId
    this.taskId = params.taskId
    this.status = params.status
  }
}
