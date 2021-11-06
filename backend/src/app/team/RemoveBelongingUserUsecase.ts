import { Team } from 'src/domain/team/team'
import { UserId } from 'src/domain/user/userId'
import { UseCase } from '../shared/UseCase'
import { ITeamRepository } from './repository-interface/ITeamRepository'

interface Request {
  userId: UserId
}

export class RemoveBelongingUserUsecase
  implements UseCase<Request, Promise<void>>
{
  constructor(private teamRepo: ITeamRepository) {}

  public async do(req: Request): Promise<void> {
    console.log('called RemoveBelongingUserUsecase.do()')

    const team = await this.teamRepo.findByUserId(req.userId)
    if (!team) {
      throw Error('ユーザが所属しているチームが見つかりません')
    }

    if (team.isMin()) {
      await this.moveAndRemove(team, req.userId)
      return
    }

    team.removeUser(req.userId)
    await this.teamRepo.save(team)
  }

  private async moveAndRemove(team: Team, userId: UserId) {
    const targetTeam = await this.teamRepo.findOneMinimumTeam()
    if (!targetTeam) {
      throw Error('チームを取得できませんでした')
    }

    const remainingUserIds = team.belongingUserIds.filter(
      (uid: UserId) => !uid.equals(userId),
    )
    remainingUserIds.forEach((userId) => targetTeam.addUser(userId))

    await this.teamRepo.save(targetTeam)
    await this.teamRepo.delete(team)
  }
}
