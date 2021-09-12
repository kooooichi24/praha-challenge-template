import { IDomainEvent } from '../../shared/events/IDomainEvent'
import { UniqueEntityID } from '../../shared/UniqueEntityID'
import { Pair } from '../pair'

export class BelongingUserRemovedEvent implements IDomainEvent {
  public dateTimeOccurred: Date
  public pair: Pair

  constructor(pair: Pair) {
    this.dateTimeOccurred = new Date()
    this.pair = pair
  }

  getAggregateId(): UniqueEntityID {
    return this.pair.id
  }
}
