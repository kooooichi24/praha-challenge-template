import { uuid } from 'uuidv4'

export class PairId {
  private id: string

  public constructor() {
    this.id = uuid()
  }

  public stringValue(): string {
    return this.id
  }
}
