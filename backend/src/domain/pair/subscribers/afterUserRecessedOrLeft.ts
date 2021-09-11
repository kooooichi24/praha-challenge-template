import { IHandle } from 'src/domain/shared/events/IHandle'
import { DomainEvents } from 'src/domain/shared/events/DomainEvents'
import { UserRecessedOrLeftEvent } from 'src/domain/user/events/userRecessedOrLeftEvent'
import { RemoveBelongingUserUsecase } from 'src/app/pair/RemoveBelongingUserUsecase'

export class AfterUserRecessedOrLeft
  implements IHandle<UserRecessedOrLeftEvent>
{
  private RemoveBelongingUserUsecase: RemoveBelongingUserUsecase

  constructor(RemoveBelongingUserUsecase: RemoveBelongingUserUsecase) {
    this.setupSubscriptions()
    this.RemoveBelongingUserUsecase = RemoveBelongingUserUsecase
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
      await this.RemoveBelongingUserUsecase.do({ userId: user.userId })
    } catch (e) {}
  }
}
