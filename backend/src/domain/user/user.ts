import { AggregateRoot } from '../shared/AggregateRoot'
import { UniqueEntityID } from '../shared/UniqueEntityID'
import { UserRecessedOrLeftEvent } from './events/userRecessedOrLeftEvent'
import { UserId } from './userId'
import { EnrollmentStatus } from './enrollmentStatus'
import { UserReturnedEvent } from './events/UserReturnedEvent'

interface UserProps {
  name: string
  mail: string
  status: EnrollmentStatus
}

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(
    props: {
      name: string
      mail: string
      status?: EnrollmentStatus
    },
    id?: UniqueEntityID,
  ): User {
    const status = props.status ? props.status : 'ENROLLMENT'
    return new User({ ...props, status }, id)
  }

  public changeStatus(status: EnrollmentStatus) {
    if (status === 'RECESS' || status === 'LEFT') {
      this.addDomainEvent(new UserRecessedOrLeftEvent(this))
    } else {
      this.addDomainEvent(new UserReturnedEvent(this))
    }
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

  get userId(): UserId {
    return UserId.create(this.id)
  }
}
