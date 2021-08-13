import { User } from 'src/domain/user/entity/user'

export interface IUserRepository {
  findAll(): Promise<User[]>
  getByMail(mail: string): Promise<User | undefined>
  save(user: User): Promise<User>
  delete(user: User): Promise<User>
  updateStatus(user: User): Promise<User>
  exist(userId: string): Promise<boolean>
}
