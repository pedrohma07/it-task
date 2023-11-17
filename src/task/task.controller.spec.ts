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

  const mockTaskService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockAuthService = {
    validateToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addTask', () => {
    it('should call authService.validateToken and taskService.create', async () => {
      const requestMock = {
        headers: {
          authorization: 'Bearer fakeToken',
        },
      };
      const createTaskDto = {
        title: 'Task Title',
        priority: 'high',
        status: 'in progress',
      };

      mockAuthService.validateToken.mockResolvedValue({ sub: 'userId' });
      mockTaskService.create.mockResolvedValue('task');

      await expect(
        controller.addTask(requestMock as any, createTaskDto),
      ).resolves.not.toThrow();

      await controller.addTask(requestMock as any, createTaskDto);

      expect(mockAuthService.validateToken).toHaveBeenCalledWith('fakeToken');
      expect(mockTaskService.create).toHaveBeenCalledWith(
        createTaskDto,
        'userId',
      );
    });
  });
  describe('findAll', () => {
    it('should call taskService.findAll', async () => {
      mockTaskService.findAll.mockResolvedValue([]);

      await controller.findAll();

      expect(mockTaskService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call taskService.findOne with the correct id', async () => {
      const taskId = '1';
      mockTaskService.findOne.mockResolvedValue({ id: taskId });

      await controller.findOne(taskId);

      expect(mockTaskService.findOne).toHaveBeenCalledWith(Number(taskId));
    });
  });

  describe('editTask', () => {
    it('should call taskService.update with the correct id and data', async () => {
      const taskId = '1';
      const updateTaskDto = {
        title: 'Updated Task Title',
        description: 'Updated Task Description',
      };

      mockTaskService.update.mockResolvedValue({ id: taskId });

      await controller.editTask(taskId, updateTaskDto);

      expect(mockTaskService.update).toHaveBeenCalledWith(
        Number(taskId),
        updateTaskDto,
      );
    });
  });

  describe('deleteTask', () => {
    it('should call taskService.remove with the correct id', async () => {
      const taskId = '1';

      mockTaskService.remove.mockResolvedValue({ id: taskId });

      await controller.deleteTask(taskId);

      expect(mockTaskService.remove).toHaveBeenCalledWith(Number(taskId));
    });
  });
});
