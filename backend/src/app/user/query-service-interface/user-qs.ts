import { UserTaskStatus } from '@prisma/client'
import { Page, PagingCondition } from 'src/app/shared/Paging'

export class UserWithTasksStatusDTO {
  public readonly id: string
  public readonly name: string
  public readonly mail: string
  public readonly status: 'ENROLLMENT' | 'RECESS' | 'LEFT'
  public readonly tasksStatus: UserTaskStatus[]
  public constructor(props: {
    id: string
    name: string
    mail: string
    status: 'ENROLLMENT' | 'RECESS' | 'LEFT'
    tasksStatus: UserTaskStatus[]
  }) {
    const { id, name, mail, status, tasksStatus } = props
    this.id = id
    this.name = name
    this.mail = mail
    this.status = status
    this.tasksStatus = tasksStatus
  }
}

export class UserDTO {
  public readonly id: string
  public readonly name: string
  public readonly mail: string
  public readonly status: 'ENROLLMENT' | 'RECESS' | 'LEFT'
  public constructor(props: {
    id: string
    name: string
    mail: string
    status: 'ENROLLMENT' | 'RECESS' | 'LEFT'
  }) {
    const { id, name, mail, status } = props
    this.id = id
    this.name = name
    this.mail = mail
    this.status = status
  }
}

export interface IUserQS {
  findAll(): Promise<UserWithTasksStatusDTO[]>
  findById(id: string): Promise<UserWithTasksStatusDTO | undefined>
  fetchPageByTaskAndStatus(
    taskIds: string[],
    taskStatus: 'TODO' | 'REVIEWING' | 'DONE',
    pagingCondition: PagingCondition,
  ): Promise<Page<UserDTO>>
}
