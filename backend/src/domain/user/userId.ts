import { Entity } from 'src/domain/shared/Entity'
import { UniqueEntityID } from 'src/domain/shared/UniqueEntityID'

export class UserId extends Entity<any> {
  get id(): UniqueEntityID {
    return this._id
  }

  private constructor(id?: UniqueEntityID) {
    super(null, id)
  }

  public static create(id?: UniqueEntityID): UserId {
    return new UserId(id)
  }
}
