import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { TaskModule } from './task/task.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [UserModule, PrismaModule, TaskModule, NotificationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
