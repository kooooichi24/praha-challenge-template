import { AggregateRoot } from '../shared/AggregateRoot'
import { UniqueEntityID } from '../shared/UniqueEntityID'
import { UserId } from '../user/userId'
import { BelongingUserIds } from './belongingUserIds'
import { PairId } from './pairId'
import { PairName } from './pairName'

interface PairProps {
  name: PairName
  belongingUserIds: BelongingUserIds
}

export class Pair extends AggregateRoot<PairProps> {
  private constructor(props: PairProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(props: PairProps, id?: UniqueEntityID): Pair {
    return new Pair({ ...props }, id)
  }

  public addUser(userId: UserId): void {
    this.belongingUserIds.addUser(userId)
  }

  public removeUser(userId: UserId): void {
    this.belongingUserIds.removeUser(userId)
  }

  public getAllProperties() {
    return {
      id: this.id,
      name: this.name,
      belongingUserIds: this.belongingUserIds,
    }
  }

  get pairId(): PairId {
    return PairId.create(this.id)
  }

  get name(): PairName {
    return this.props.name
  }

  get belongingUserIds(): BelongingUserIds {
    return this.props.belongingUserIds
  }
}
