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
      // return await this.allUsersQS.getAll()
      return await [
        {
          id: '1',
          name: 'furukawa',
          mail: 'furukawa@gmai.com',
        },
        {
          id: '2',
          name: 'nakano',
          mail: 'nakano@gmai.com',
        },
        {
          id: '3',
          name: 'sasaki',
          mail: 'sasaki@gmai.com',
        },
      ]
    } catch (error) {
      // memo: エラー処理
      throw error
    }
  }
}
