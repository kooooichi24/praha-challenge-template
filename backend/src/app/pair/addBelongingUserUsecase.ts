import { BelongingUsers } from 'src/domain/pair/belongingUsers'
import { Pair } from 'src/domain/pair/pair'
import { PairName } from 'src/domain/pair/pairName'
import { UserId } from 'src/domain/user/userId'
import { createRandomAlphabetChar } from 'src/util/random'
import { UseCase } from '../shared/UseCase'
import { ITeamRepository } from '../team/repository-interface/ITeamRepository'
import { IPairRepository } from './repository-interface/IPairRepository'

interface Request {
  userId: UserId
}

export class AddBelongingUserUsecase
  implements UseCase<Request, Promise<void>>
{
  constructor(
    private pairRepo: IPairRepository,
    private teamRepo: ITeamRepository,
  ) {}

  public async do(req: Request): Promise<void> {
    console.log('called AddBelongingUserUsecase.do()')

    const pair = await this.pairRepo.findOneMinimumPair()
    if (!pair) {
      throw Error('ペアを取得できませんでした')
    }

    if (pair.isMax()) {
      await this.splitPair(pair, req.userId)
      return
    }

    pair.addUser(req.userId)
    await this.pairRepo.save(pair)

    // pairが所属しているteamにも追加する
    const team = await this.teamRepo.findByPairId(pair.pairId)
    if (!team) {
      throw Error('チームが取得できない場合は、pairの更新もロールバックしたい')
    }
    team.addUser(req.userId)
    await this.teamRepo.save(team)
  }

  private async splitPair(pair: Pair, targetUserId: UserId): Promise<void> {
    const threeUserIds = pair.belongingUsers.userIds

    const first = threeUserIds.slice(0, BelongingUsers.MINIMUM_BELONGING_NUMBER)
    const second = threeUserIds.slice(BelongingUsers.MINIMUM_BELONGING_NUMBER)
    second.push(targetUserId)

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
    await this.pairRepo.delete(pair)
  }
}
