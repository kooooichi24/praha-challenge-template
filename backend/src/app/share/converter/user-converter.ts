import { User } from 'src/domain/user/entity/user'
import { UserDTO } from '../../user/query-service-interface/user-qs'

export class UserConverter {
  public convertToDto(userEntity: User): UserDTO {
    return new UserDTO(userEntity.getAllProperties())
  }

  public convertToEntity(userDTO: UserDTO): User {
    return new User({ ...userDTO })
  }
}
