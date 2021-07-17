export class AllUsersDTO {
  public readonly id: string
  public readonly name: string
  public readonly mail: string
  public constructor(props: { id: string; name: string; mail: string }) {
    const { id, name, mail } = props
    this.id = id
    this.name = name
    this.mail = mail
  }
}

export interface IAllUsersQS {
  getAll(): Promise<AllUsersDTO[]>
}
