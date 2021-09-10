import { IHandle } from 'src/domain/shared/events/IHandle'
import { DomainEvents } from 'src/domain/shared/events/DomainEvents'
import { UserRecessedOrLeftEvent } from 'src/domain/user/events/userRecessedOrLeftEvent'
import { AddUserUsecase } from 'src/app/pair/AddUserUsecase'

export class AfterUserRecessedOrLeft
  implements IHandle<UserRecessedOrLeftEvent>
{
  private addUserUsecase: AddUserUsecase

  constructor(addUserUsecase: AddUserUsecase) {
    this.setupSubscriptions()
    this.addUserUsecase = addUserUsecase
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      // @ts-ignore
      this.onUserRecessedOrLeftEvent.bind(this),
      UserRecessedOrLeftEvent.name,
    )
  }

  private async onUserRecessedOrLeftEvent(
    event: UserRecessedOrLeftEvent,
  ): Promise<void> {
    try {
      await this.addUserUsecase.do()
    } catch (e) {}
  }
}
