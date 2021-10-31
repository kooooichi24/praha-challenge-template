type User = {
  id: string
  name: string
  mail: string
  status: string
}

export class PairDTO {
  public readonly id: string
  public readonly name: string
  public readonly belongingUsers: User[]
  public constructor(props: {
    id: string
    name: string
    belongingUsers: User[]
  }) {
    const { id, name, belongingUsers } = props
    this.id = id
    this.name = name
    this.belongingUsers = belongingUsers
  }
}

export interface IPairQS {
  findAll(): Promise<PairDTO[]>
}
