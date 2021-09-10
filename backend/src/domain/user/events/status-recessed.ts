// import { IDomainEvent } from '../../shared/events/IDomainEvent'
// import { UniqueEntityID } from '../../shared/UniqueEntityID'
// import { User } from '../user'

// export class StatusRecessed implements IDomainEvent {
//   public dateTimeOccurred: Date
//   public user: User

//   constructor(user: User) {
//     this.dateTimeOccurred = new Date()
//     this.user = user
//   }

//   getAggregateId(): UniqueEntityID {
//     return this.user.getAllProperties().id
//   }
// }
