import { Module } from '@nestjs/common'
import { TaskController } from './controller/task/task.controller'
import { UserController } from './controller/user/user.controller'

// memo: DIコンテナとしては使わないため、controllerの追加だけしてください
@Module({
  imports: [],
  controllers: [UserController, TaskController],
  providers: [],
})
export class AppModule {}
