import { IHandle } from 'src/domain/shared/events/IHandle'
import { DomainEvents } from 'src/domain/shared/events/DomainEvents'
import { BelongingUserRemovedEvent } from '../events/belongingUserRemovedEvent'
import { MoveBelongingUserUsecase } from 'src/app/pair/MoveBelongingUserUsecase'

export class AfterBelongingUserRemoved
  implements IHandle<BelongingUserRemovedEvent>
{
  private moveBelongingUserUsecase: MoveBelongingUserUsecase

  constructor(moveBelongingUserUsecase: MoveBelongingUserUsecase) {
    this.setupSubscriptions()
    this.moveBelongingUserUsecase = moveBelongingUserUsecase
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      // @ts-ignore
      this.onBelongingUserRemovedEvent.bind(this),
      BelongingUserRemovedEvent.name,
    )
  }

  private async onBelongingUserRemovedEvent(
    event: BelongingUserRemovedEvent,
  ): Promise<void> {
    const { pair } = event
    try {
      await this.moveBelongingUserUsecase.do({
        currentPairId: pair.pairId.id.toString(),
        userIds: pair.belongingUsers.userIds,
      })
    } catch (e) {}
  }
}
