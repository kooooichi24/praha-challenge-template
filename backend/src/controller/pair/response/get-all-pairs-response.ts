import { ApiProperty } from '@nestjs/swagger'
import { PairDTO } from 'src/app/pair/query-service-interface/pair-qs'

export class GetAllPairsResponse {
  @ApiProperty({ type: () => [Pair] })
  pairs: Pair[]

  public constructor(params: { pairs: PairDTO[] }) {
    const { pairs } = params
    this.pairs = pairs.map(({ id, name, belongingUsers }) => {
      return new Pair({
        id,
        name,
        belongingUsers,
      })
    })
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
