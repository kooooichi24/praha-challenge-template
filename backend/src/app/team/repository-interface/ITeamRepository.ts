import { PairId } from 'src/domain/pair/pairId'
import { Team } from 'src/domain/team/team'
import { UserId } from 'src/domain/user/userId'

export interface ITeamRepository {
  findByUserId(userId: UserId): Promise<Team | null>
  findByPairId(pairId: PairId): Promise<Team | null>
  findOneMinimumTeam(): Promise<Team | null>
  save(team: Team): Promise<void>
  delete(team: Team): Promise<void>
}
