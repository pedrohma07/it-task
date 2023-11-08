import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private app: INestApplication;

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.app = app;
  }

  async onApplicationShutdown(signal: string) {
    if (this.app) {
      await this.app.close();
    }
  }
}
