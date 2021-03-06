import { AggregateRoot } from '../shared/AggregateRoot'
import { UniqueEntityID } from '../shared/UniqueEntityID'
import { UserId } from '../user/userId'
import { BelongingUsers } from './belongingUsers'
import { PairId } from './pairId'
import { PairName } from './pairName'

interface PairProps {
  name: PairName
  belongingUsers: BelongingUsers
}

export class Pair extends AggregateRoot<PairProps> {
  private constructor(props: PairProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(props: PairProps, id?: UniqueEntityID): Pair {
    return new Pair({ ...props }, id)
  }

  public addUser(userId: UserId): void {
    this.belongingUsers.addUser(userId)
  }

  public removeUser(userId: UserId): void {
    this.belongingUsers.removeUser(userId)
  }

  public isMax(): boolean {
    return this.belongingUsers.isMax()
  }

  public isMin(): boolean {
    return this.belongingUsers.isMin()
  }

  public getAllProperties() {
    return {
      id: this.id,
      name: this.name,
      belongingUserIds: this.belongingUsers,
    }
  }

  get pairId(): PairId {
    return PairId.create(this.id)
  }

  get name(): PairName {
    return this.props.name
  }

  get belongingUsers(): BelongingUsers {
    return this.props.belongingUsers
  }
}
