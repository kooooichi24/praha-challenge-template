import { User } from 'src/domain/user/entity/user'

export interface IUserRepository {
  save(user: User): Promise<User>
  delete(user: User): Promise<User>
}
