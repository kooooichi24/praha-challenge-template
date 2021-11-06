import { ValueObject } from 'src/domain/shared/ValueObject'

interface TeamNameProps {
  value: number
}

export class TeamName extends ValueObject<TeamNameProps> {
  get value(): number {
    return this.props.value
  }

  private constructor(props: TeamNameProps) {
    super(props)
  }

  public static create(name: number): TeamName {
    if (!name || name >= 1000 || name <= 0) {
      throw Error('チーム名は1~999までの正の整数のみ可能です')
    }

    return new TeamName({ value: name })
  }
}
