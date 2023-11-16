/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AuthService } from '../../src/auth/auth.service';
import { UserService } from '../../src/user/user.service';
import { JwtService } from '@nestjs/jwt';

describe('TaskController', () => {
  let controller: TaskController;
  let prismaservice: PrismaService;
  let authservice: AuthService;
  let userservice: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        TaskService,
        PrismaService,
        AuthService,
        UserService,
        JwtService,
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    prismaservice = module.get<PrismaService>(PrismaService);
    authservice = module.get<AuthService>(AuthService);
    userservice = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
