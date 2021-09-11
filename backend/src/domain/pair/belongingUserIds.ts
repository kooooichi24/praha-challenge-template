import { Entity } from 'src/domain/shared/Entity'
import { UniqueEntityID } from 'src/domain/shared/UniqueEntityID'
import { UserId } from '../user/userId'

interface BelongingUserIdsProps {
  belongingUserIds: UserId[]
}

export class BelongingUserIds extends Entity<BelongingUserIdsProps> {
  private readonly MINIMUM_BELONGING_STUDENT_NUMBER = 2
  private readonly MAXIMUM_BELONGING_STUDENT_NUMBER = 3

  private constructor(props: BelongingUserIdsProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(
    props: BelongingUserIdsProps,
    id?: UniqueEntityID,
  ): BelongingUserIds {
    if (
      !(
        2 <= props.belongingUserIds.length && props.belongingUserIds.length <= 3
      )
    ) {
      throw Error('ペアに所属できるユーザ数は2名以上3名以下です')
    }
    return new BelongingUserIds(props, id)
  }

  public addUser(userId: UserId): void {
    if (
      this.belongingUserIds.length === this.MAXIMUM_BELONGING_STUDENT_NUMBER
    ) {
      // TODO pair分解
      throw Error('現在、ペアに参加者が3名所属しています')
    }
    this.belongingUserIds.push(userId)
  }

  public removeUser(userId: UserId): void {
    if (
      this.belongingUserIds.length === this.MINIMUM_BELONGING_STUDENT_NUMBER
    ) {
      // TODO ユーザ移動
      throw Error('現在、ペアに参加者が2名所属しています')
    }

    this.belongingUserIds.filter((id) => id != userId)
  }

  get id(): UniqueEntityID {
    return this._id
  }

  get belongingUserIds(): UserId[] {
    return this.props.belongingUserIds
  }
}
