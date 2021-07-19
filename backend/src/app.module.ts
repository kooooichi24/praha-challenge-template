import { Module } from '@nestjs/common'
import { UserController } from './controller/user/user.controller'

// memo: DIコンテナとしては使わないため、controllerの追加だけしてください
@Module({
  imports: [],
  controllers: [UserController],
  providers: [],
})
export class AppModule {}
