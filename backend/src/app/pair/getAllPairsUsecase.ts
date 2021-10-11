import { UseCase } from '../shared/UseCase'
import { IPairQS, PairDTO } from './query-service-interface/pair-qs'

export class GetAllPairsUsecase
  implements UseCase<undefined, Promise<PairDTO[]>>
{
  private readonly pairQS: IPairQS

  constructor(pairQS: IPairQS) {
    this.pairQS = pairQS
  }

  public async do(): Promise<PairDTO[]> {
    console.log('called GetAllPairsUsecase.do()')

    try {
      return await this.pairQS.findAll()
    } catch (error) {
      // memo: error handling
      throw error
    }
  }
}
