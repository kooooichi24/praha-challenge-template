import { AggregateRoot } from '../shared/AggregateRoot'
import { UniqueEntityID } from '../shared/UniqueEntityID'

interface UserProps {
  name: string
  mail: string
  status: 'ENROLLMENT' | 'RECESS' | 'LEFT'
}

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(
    props: {
      name: string
      mail: string
      status?: 'ENROLLMENT' | 'RECESS' | 'LEFT'
    },
    id?: UniqueEntityID,
  ): User {
    const status = props.status ? props.status : 'ENROLLMENT'
    return new User({ ...props, status }, id)
  }

  public changeStatus(status: 'ENROLLMENT' | 'RECESS' | 'LEFT') {
    this.props.status = status
  }

  public getAllProperties() {
    return {
      id: this._id,
      name: this.props.name,
      mail: this.props.mail,
      status: this.props.status,
    }
  }
}
