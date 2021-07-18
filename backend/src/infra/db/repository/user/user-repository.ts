import { PrismaClient } from '@prisma/client'
import { ISomeDataRepository } from 'src/app/sample/repository-interface/some-data-repository'
import { IUserRepository } from 'src/app/user/repository-interface/user-repository'
import { SomeData } from 'src/domain/sample/entity/some-data'
import { User } from 'src/domain/user/entity/user'

export class UserRepository implements IUserRepository {
  private prismaClient: PrismaClient
  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient
  }
  public async save(userEntity: User): Promise<User> {
    // const { id, required, number } = someDataEntity.getAllProperties()
    // const savedSomeDataDatamodel = await this.prismaClient.someData.create({
    //   data: {
    //     id,
    //     required,
    //     number,
    //   },
    // })
    const savedUserEntity = new User({
      // ...savedSomeDataDatamodel,
      id: '1',
      mail: 'mail',
      name: 'name',
    })
    return savedUserEntity
  }
}
