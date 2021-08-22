import { UserDTO, IUserQS } from './query-service-interface/user-qs'

export class GetAllUsersUseCase {
  private readonly userQS: IUserQS
  public constructor(userQS: IUserQS) {
    this.userQS = userQS
  }
  public async do(): Promise<UserDTO[]> {
    try {
      return await this.userQS.findAll()
    } catch (error) {
      // memo: エラー処理
      throw error
    }
  }
}
