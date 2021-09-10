import { User } from 'src/domain/user/user'

export interface IUserRepository {
  findAll(): Promise<User[]>
  getByMail(mail: string): Promise<User | undefined>
  save(user: User): Promise<void>
  delete(user: User): Promise<void>
  updateStatus(user: User): Promise<User>
  exist(userId: string): Promise<boolean>
}
