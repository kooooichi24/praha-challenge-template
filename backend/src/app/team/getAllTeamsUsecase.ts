import { UseCase } from '../shared/UseCase'
import { ITeamQS, TeamDTO } from './query-service-interface/team-qs'

export class GetAllTeamsUsecase
  implements UseCase<undefined, Promise<TeamDTO[]>>
{
  constructor(private teamQS: ITeamQS) {}

  public async do(): Promise<TeamDTO[]> {
    console.log('called GetAllTeamsUsecase.do()')

    return await this.teamQS.findAll()
  }
}
