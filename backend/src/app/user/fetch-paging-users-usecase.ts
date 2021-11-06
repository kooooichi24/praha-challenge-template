import { Page } from '../shared/Paging'
import { IUserQS, UserDTO } from './query-service-interface/user-qs'

export class FetchPagingUsersUseCase {
  public constructor(private userQS: IUserQS) {}

  public async do(
    taskIds: string[],
    taskStatus: 'TODO' | 'REVIEWING' | 'DONE',
    pageSize: number,
    pageNumber: number,
  ): Promise<Page<UserDTO>> {
    try {
      return await this.userQS.fetchPageByTaskAndStatus(taskIds, taskStatus, {
        pageSize,
        pageNumber,
      })
    } catch (error) {
      // memo: エラー処理
      throw error
    }
  }
}
