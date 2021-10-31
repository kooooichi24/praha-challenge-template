import { Entity } from 'src/domain/shared/Entity'
import { UniqueEntityID } from 'src/domain/shared/UniqueEntityID'
import { UserId } from '../user/userId'

interface BelongingUsersProps {
  userIds: UserId[]
}

export class BelongingUsers extends Entity<BelongingUsersProps> {
  static MINIMUM_BELONGING_NUMBER = 2
  static MAXIMUM_BELONGING_NUMBER = 3

  private constructor(props: BelongingUsersProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(
    props: BelongingUsersProps,
    id?: UniqueEntityID,
  ): BelongingUsers {
    if (!(2 <= props.userIds.length && props.userIds.length <= 3)) {
      throw Error('ペアに所属できるユーザ数は2名以上3名以下です')
    }
    return new BelongingUsers(props, id)
  }

  public addUser(userId: UserId): void {
    if (this.isMax()) {
      // TODO pair分解
      throw Error('現在、ペアに参加者が3名所属しています')
    }
    this.userIds = this.userIds.concat(userId)
  }

  public removeUser(argUserId: UserId): void {
    if (this.isMin()) {
      throw Error('現在、ペアに参加者が2名所属しています')
    }
    this.userIds = this.userIds.filter((userId) => !userId.equals(argUserId))
  }

  public isMax(): boolean {
    return this.userIds.length === BelongingUsers.MAXIMUM_BELONGING_NUMBER
  }

  public isMin(): boolean {
    return this.userIds.length === BelongingUsers.MINIMUM_BELONGING_NUMBER
  }

  get id(): UniqueEntityID {
    return this._id
  }

  get userIds(): UserId[] {
    return this.props.userIds
  }

  set userIds(value: UserId[]) {
    this.props.userIds = value
  }
}
