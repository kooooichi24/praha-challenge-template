import { Team } from 'src/domain/team/team'
import { UserId } from 'src/domain/user/userId'

export interface ITeamRepository {
  findByUserId(userId: UserId): Promise<Team | null>
  save(team: Team): Promise<void>
}
