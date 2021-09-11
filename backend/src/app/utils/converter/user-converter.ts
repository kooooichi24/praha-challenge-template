import { UniqueEntityID } from 'src/domain/shared/UniqueEntityID'
import { User } from 'src/domain/user/user'
import { UserDTO } from '../../user/query-service-interface/user-qs'

export class UserConverter {
  public convertToEntity(userDTO: UserDTO): User {
    return User.create(
      { name: userDTO.name, mail: userDTO.mail, status: userDTO.status },
      new UniqueEntityID(userDTO.id),
    )
  }
}
