import { PairId } from './pairId'

export class Pair {
  private id: PairId
  private name: string
  private userIds: String[] // TODO userIds: UserId[] に修正したい

  private readonly MINIMUM_BELONGING_STUDENT_NUMBER = 2
  private readonly MAXIMUM_BELONGING_STUDENT_NUMBER = 3

  public constructor(props: { name: string }) {
    const { name } = props

    if (!name || name.length !== 1 || /^[a-zA-Z]+$/.test(name)) {
      throw Error('ペア名は1文字の半角英字のみ可能です')
    }

    this.id = new PairId()
    this.name = name
    this.userIds = []
  }

  public addUser(userId: string): void {
    if (this.userIds.length === this.MAXIMUM_BELONGING_STUDENT_NUMBER) {
      throw Error('ペアに所属している参加者が3名存在します')
    }

    this.userIds.push(userId)
  }

  public removeUser(userId: string): void {
    if (this.userIds.length === this.MINIMUM_BELONGING_STUDENT_NUMBER) {
      throw Error('ペアに所属している参加者が3名存在します')
    }

    this.userIds.filter((id) => id != userId)
  }

  public getAllProperties() {
    return {
      id: this.id,
      name: this.name,
      userIds: this.userIds,
    }
  }
}
