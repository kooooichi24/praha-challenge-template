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
  getAll(): Promise<UserDTO[]>
  findById(id: string): Promise<UserDTO | undefined>
}
