import { Module } from '@nestjs/common'
import { TaskController } from './controller/task/task.controller'
import { UserController } from './controller/user/user.controller'
import { TaskStatusController } from './controller/task-status/task-status.controller'

// memo: DIコンテナとしては使わないため、controllerの追加だけしてください
@Module({
  imports: [],
  controllers: [UserController, TaskController, TaskStatusController],
  providers: [],
})
export class AppModule {}
