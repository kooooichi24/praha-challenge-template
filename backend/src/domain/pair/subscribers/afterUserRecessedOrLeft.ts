import { IHandle } from 'src/domain/shared/events/IHandle'
import { DomainEvents } from 'src/domain/shared/events/DomainEvents'
import { UserRecessedOrLeftEvent } from 'src/domain/user/events/userRecessedOrLeftEvent'
import { RemoveUserUsecase } from 'src/app/pair/RemoveUserUsecase'

export class AfterUserRecessedOrLeft
  implements IHandle<UserRecessedOrLeftEvent>
{
  private removeUserUsecase: RemoveUserUsecase

  constructor(removeUserUsecase: RemoveUserUsecase) {
    this.setupSubscriptions()
    this.removeUserUsecase = removeUserUsecase
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
    const { user } = event
    try {
      await this.removeUserUsecase.do({ userId: user.userId })
    } catch (e) {}
  }
}
