type User = {
  id: string
  name: string
  mail: string
  status: string
}

type Pair = {
  id: string
  name: string
  belongingUsers: User[]
}

export class TeamDTO {
  public readonly id: string
  public readonly name: string
  public readonly belongingPairs: Pair[]

  public constructor(props: {
    id: string
    name: string
    belongingPairs: Pair[]
  }) {
    const { id, name, belongingPairs } = props
    this.id = id
    this.name = name
    this.belongingPairs = belongingPairs
  }
}

export interface ITeamQS {
  findAll(): Promise<TeamDTO[]>
}
