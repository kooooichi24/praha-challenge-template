import { PairId } from '../pair/pairId'
import { AggregateRoot } from '../shared/AggregateRoot'
import { UniqueEntityID } from '../shared/UniqueEntityID'
import { UserId } from '../user/userId'
import { TeamId } from './teamId'
import { TeamName } from './teamName'

interface TeamProps {
  name: TeamName
  belongingPairIds: PairId[]
  belongingUserIds: UserId[]
}

export class Team extends AggregateRoot<TeamProps> {
  static MINIMUM_BELONGING_USER = 3

  private constructor(props: TeamProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(props: TeamProps, id?: UniqueEntityID): Team {
    if (props.belongingUserIds.length < Team.MINIMUM_BELONGING_USER) {
      throw Error('チームには最低でも参加者が3名いなければならないです')
    }

    return new Team({ ...props }, id)
  }

  public addUser(argUserId: UserId): void {
    this.belongingUserIds = this.belongingUserIds.concat(argUserId)
  }

  public removeUser(argUserId: UserId): void {
    if (this.isMin()) {
      throw Error(`現在、チームに参加者が3名所属しています`)
    }

    this.belongingUserIds = this.belongingUserIds.filter(
      (userId) => !userId.equals(argUserId),
    )
  }

  public isMin(): boolean {
    return this.belongingUserIds.length === Team.MINIMUM_BELONGING_USER
  }

  public getAllProperties() {
    return {
      id: this.id,
      name: this.name,
      belongingPairIds: this.belongingPairIds,
      belongingUserIds: this.belongingUserIds,
    }
  }

  get name(): TeamName {
    return this.props.name
  }

  get belongingPairIds(): PairId[] {
    return this.props.belongingPairIds
  }

  get belongingUserIds(): UserId[] {
    return this.props.belongingUserIds
  }

  set belongingUserIds(value: UserId[]) {
    this.props.belongingUserIds = value
  }

  get teamId(): TeamId {
    return TeamId.create(this.id)
  }
}
