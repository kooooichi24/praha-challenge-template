export type PagingCondition = {
  pageSize: number
  pageNumber: number
}

export class Page<T> {
  /** 取得したエンティティ */
  public readonly items: T[]
  /** ページング情報 */
  public readonly paging: Paging

  constructor(items: T[], paging: Paging) {
    this.items = items
    this.paging = paging
  }
}

export type Paging = {
  /** 指定した条件に該当する全件数 */
  totalCount: number
  /** 1ページ当たりの件数 */
  pageSize: number
  /** 取得結果のページ番号 */
  pageNumber: number
}
