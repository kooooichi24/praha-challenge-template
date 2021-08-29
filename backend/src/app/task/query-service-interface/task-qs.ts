import { UserTaskStatus } from '@prisma/client'

export class TaskDTO {
  public readonly id: string
  public readonly title: string
  public readonly content: string
  public readonly tasksStatus: UserTaskStatus[]
  public constructor(props: {
    id: string
    title: string
    content: string
    tasksStatus: UserTaskStatus[]
  }) {
    const { id, title, content, tasksStatus } = props
    this.id = id
    this.title = title
    this.content = content
    this.tasksStatus = tasksStatus
  }
}

export interface ITaskQS {
  findById(id: string): Promise<TaskDTO | undefined>
}
