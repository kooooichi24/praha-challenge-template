import {
  AllUsersDTO,
  IAllUsersQS,
} from './query-service-interface/all-users-qs'

export class GetAllUsersUseCase {
  private readonly allUsersQS: IAllUsersQS
  public constructor(allUsersQS: IAllUsersQS) {
    this.allUsersQS = allUsersQS
  }
  public async do(): Promise<AllUsersDTO[]> {
    try {
      return await this.allUsersQS.getAll()
    } catch (error) {
      // memo: エラー処理
      throw error
    }
  }
}
