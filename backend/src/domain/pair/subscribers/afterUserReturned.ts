import { IHandle } from 'src/domain/shared/events/IHandle'
import { DomainEvents } from 'src/domain/shared/events/DomainEvents'
import { UserReturnedEvent } from 'src/domain/user/events/UserReturnedEvent'
import { AddBelongingUserUsecase } from 'src/app/pair/AddBelongingUserUsecase'

export class AfterUserReturned implements IHandle<UserReturnedEvent> {
  private AddBelongingUserUsecase: AddBelongingUserUsecase

  constructor(AddBelongingUserUsecase: AddBelongingUserUsecase) {
    this.setupSubscriptions()
    this.AddBelongingUserUsecase = AddBelongingUserUsecase
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      // @ts-ignore
      this.onUserReturnedEvent.bind(this),
      UserReturnedEvent.name,
    )
  }

  private async onUserReturnedEvent(event: UserReturnedEvent): Promise<void> {
    const { user } = event
    try {
      await this.AddBelongingUserUsecase.do({ userId: user.userId })
    } catch (e) {}
  }
}
