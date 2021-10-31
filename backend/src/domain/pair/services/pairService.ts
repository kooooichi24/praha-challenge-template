import { IPairRepository } from 'src/app/pair/repository-interface/IPairRepository'
import { UserId } from 'src/domain/user/userId'
import { createRandomAlphabetChar } from 'src/util/random'
import { BelongingUsers } from '../belongingUsers'
import { Pair } from '../pair'
import { PairName } from '../pairName'

export class PairService {
  constructor(private pairRepo: IPairRepository) {}

  async move(
    userId: UserId,
    targetPair: Pair,
    currentPair: Pair,
  ): Promise<void> {
    // 遷移元ペアのユーザ数が最低ではない。かつ遷移先ペアのユーザ数が最大ではない。
    if (!currentPair.isMin() && !targetPair.isMax()) {
      await this.removeAndAdd(currentPair, userId, targetPair)
      return
    }
    // 遷移元ペアのユーザ数が最低。かつ遷移先ペアのユーザ数が最大ではない。
    if (currentPair.isMin() && !targetPair.isMax()) {
      await this.moveOtherUsersAndAdd(currentPair, userId, targetPair)
      return
    }
    // 遷移元ペアのユーザ数が最低ではない。かつ遷移先ペアのユーザ数が最大。
    if (!currentPair.isMin() && targetPair.isMax()) {
      await this.removeAndSplit(currentPair, userId, targetPair)
      return
    }
    // 遷移元ペアのユーザ数が最低。かつ遷移先ペアのユーザ数が最大。
    if (currentPair.isMin() && targetPair.isMax()) {
      await this.moveOtherUsersAndSplit(currentPair, userId, targetPair)
      return
    }
  }

  private async removeAndAdd(
    currentPair: Pair,
    userId: UserId,
    targetPair: Pair,
  ): Promise<void> {
    // current pair processing
    currentPair.removeUser(userId)
    await this.pairRepo.save(currentPair)

    // target pair processing
    targetPair.addUser(userId)
    await this.pairRepo.save(targetPair)
  }

  private async moveOtherUsersAndAdd(
    currentPair: Pair,
    userId: UserId,
    targetPair: Pair,
  ): Promise<void> {
    // current pair processing
    await this.moveOtherUsers(currentPair, userId)

    // target pair processing
    targetPair.addUser(userId)
    await this.pairRepo.save(targetPair)
  }

  private async removeAndSplit(
    currentPair: Pair,
    userId: UserId,
    targetPair: Pair,
  ): Promise<void> {
    // current pair processing
    currentPair.removeUser(userId)
    await this.pairRepo.save(currentPair)

    // target pair processing
    await this.splitPair(targetPair, userId)
  }

  private async moveOtherUsersAndSplit(
    currentPair: Pair,
    userId: UserId,
    targetPair: Pair,
  ): Promise<void> {
    // current pair processing
    await this.moveOtherUsers(currentPair, userId)

    // target pair processing
    await this.splitPair(targetPair, userId)
  }

  private async moveOtherUsers(currentPair: Pair, userId: UserId) {
    let pairs: Pair[] = []
    const otherUserIds = currentPair.props.belongingUsers.userIds.filter(
      (id) => !userId.equals(id),
    )
    try {
      otherUserIds.forEach(async (userId) => {
        const anyMinimumPair = await this.pairRepo.findOneMinimumPair()
        if (!anyMinimumPair) {
          throw Error('ペアを取得できませんでした')
        }

        anyMinimumPair.addUser(userId)
        pairs.push(anyMinimumPair)
      })
    } catch (e) {
      throw Error('移動できません')
    }

    pairs.forEach(async (pair) => await this.pairRepo.save(pair))
    await this.pairRepo.delete(currentPair)
  }

  private async splitPair(targetPair: Pair, userId: UserId) {
    const first = targetPair.belongingUsers.userIds.slice(
      0,
      BelongingUsers.MINIMUM_BELONGING_NUMBER,
    )
    const second = targetPair.belongingUsers.userIds.slice(
      BelongingUsers.MAXIMUM_BELONGING_NUMBER,
    )
    second.push(userId)

    const firstPair = Pair.create({
      name: PairName.create(createRandomAlphabetChar()),
      belongingUsers: BelongingUsers.create({ userIds: first }),
    })
    const secondPair = Pair.create({
      name: PairName.create(createRandomAlphabetChar()),
      belongingUsers: BelongingUsers.create({ userIds: second }),
    })

    await this.pairRepo.save(firstPair)
    await this.pairRepo.save(secondPair)
    await this.pairRepo.delete(targetPair)
  }
}
