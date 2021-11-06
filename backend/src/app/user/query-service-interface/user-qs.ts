import { UserTaskStatus } from '@prisma/client'
import { Page, PagingCondition } from 'src/app/shared/Paging'

export class UserDTO {
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

export interface IUserQS {
  findAll(): Promise<UserDTO[]>
  findById(id: string): Promise<UserDTO | undefined>
  fetchPageByTaskAndStatus(
    taskIds: string[],
    taskStatus: 'TODO' | 'REVIEWING' | 'DONE',
    pagingCondition: PagingCondition,
  ): Promise<Page<UserDTO>>
}
