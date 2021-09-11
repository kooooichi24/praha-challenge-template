import { ValueObject } from 'src/domain/shared/ValueObject'

interface PairNameProps {
  value: string
}

export class PairName extends ValueObject<PairNameProps> {
  get value(): string {
    return this.props.value
  }

  private constructor(props: PairNameProps) {
    super(props)
  }

  public static create(name: string): PairName {
    if (!name || name.length !== 1 || !/^[a-zA-Z]+$/.test(name)) {
      throw Error('ペア名は1文字の半角英字のみ可能です')
    }

    return new PairName({ value: name })
  }
}
