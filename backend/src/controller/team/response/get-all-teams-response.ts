import { ApiProperty } from '@nestjs/swagger'
import { TeamDTO } from 'src/app/team/query-service-interface/team-qs'

export class GetAllTeamsResponse {
  @ApiProperty({ type: () => [Team] })
  teams: Team[]

  public constructor(params: { teams: TeamDTO[] }) {
    const { teams } = params
    this.teams = teams.map(({ id, name, belongingPairs }) => {
      return new Team({
        id,
        name,
        belongingPairs,
      })
    })
  }
}

class Team {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  belongingPairs: Pair[]

  public constructor(params: {
    id: string
    name: string
    belongingPairs: Pair[]
  }) {
    this.id = params.id
    this.name = params.name
    this.belongingPairs = params.belongingPairs
  }
}

class Pair {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  belongingUsers: User[]

  public constructor(params: {
    id: string
    name: string
    belongingUsers: User[]
  }) {
    this.id = params.id
    this.name = params.name
    this.belongingUsers = params.belongingUsers
  }
}

type User = {
  id: string
  name: string
  mail: string
  status: string
}
