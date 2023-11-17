import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

jest.mock('../../src/prisma/prisma.service', () => {
  return {
    PrismaService: jest.fn().mockImplementation(() => ({
      task: {
        findUnique: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
      },
      notification: {
        create: jest.fn(),
      },
    })),
  };
});

describe('TaskService', () => {
  let service: TaskService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService, PrismaService],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a task and a notification', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Task Title',
        description: 'Task Description',
        priority: 'high',
        status: 'open',
      };
      const userId = 1;

      const createdTask = { id: 1, ...createTaskDto, userId };
      const createdNotification = {
        id: 1,
        message: `Task ${createTaskDto.title} created`,
        dateTime: expect.any(Date),
        recipientId: userId,
      };

      jest
        .spyOn(prismaService.task, 'create')
        .mockResolvedValue(createdTask as any);
      jest
        .spyOn(prismaService.notification, 'create')
        .mockResolvedValue(createdNotification);

      const result = await service.create(createTaskDto, userId);

      expect(result).toEqual({
        ...createdNotification,
        recipientId: undefined,
        id: undefined,
      });
      expect(prismaService.task.create).toHaveBeenCalledWith({
        data: { ...createTaskDto, userId },
      } as any);
      expect(prismaService.notification.create).toHaveBeenCalledWith({
        data: {
          message: `Task ${createTaskDto.title} created`,
          dateTime: expect.any(Date),
          recipientId: userId,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all tasks', () => {
      const result = service.findAll();
      expect(result).toEqual('This action returns all task');
    });
  });

  describe('findOne', () => {
    it('should return a specific task', () => {
      const taskId = 1;
      const result = service.findOne(taskId);
      expect(result).toEqual(`This action returns a #${taskId} task`);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const taskId = 1;
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task Title',
        description: 'Updated Task Description',
      };

      jest.spyOn(prismaService.task, 'findUnique').mockResolvedValue({
        id: taskId,
        title: 'Current Title',
        description: 'Current Description',
        dueDate: new Date(),
        priority: 'high',
        status: 'pending',
        userId: 123,
      });

      jest.spyOn(prismaService.task, 'update').mockResolvedValue({
        id: taskId,
        title: 'Current Title',
        description: 'Current Description',
        dueDate: new Date(),
        priority: 'high',
        status: 'pending',
        userId: 123,
      });

      await expect(
        service.update(taskId, updateTaskDto),
      ).resolves.not.toThrow();
      expect(prismaService.task.update).toHaveBeenCalledWith({
        where: { id: taskId },
        data: updateTaskDto,
      });
    });

    it('should throw an error if task does not exist', async () => {
      const taskId = 1;
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task Title',
        description: 'Updated Task Description',
      };

      jest.spyOn(prismaService.task, 'findUnique').mockResolvedValue(null);

      await expect(service.update(taskId, updateTaskDto)).rejects.toThrowError(
        new HttpException('Task not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      const taskId = 1;

      jest.spyOn(prismaService.task, 'findUnique').mockResolvedValue({
        id: taskId,
        title: 'Task Title',
        description: 'Task Description',
        dueDate: new Date(),
        priority: 'high',
        status: 'pending',
        userId: 123,
      });

      jest.spyOn(prismaService.task, 'delete').mockResolvedValue({
        id: taskId,
        title: 'Task Title',
        description: 'Task Description',
        dueDate: new Date(),
        priority: 'high',
        status: 'pending',
        userId: 123,
      });

      await expect(service.remove(taskId)).resolves.not.toThrow();
      expect(prismaService.task.delete).toHaveBeenCalledWith({
        where: { id: taskId },
      });
    });

    it('should throw an error if task does not exist', async () => {
      const taskId = 1;

      jest.spyOn(prismaService.task, 'findUnique').mockResolvedValue(null);

      await expect(service.remove(taskId)).rejects.toThrow(
        new HttpException('Task not found', HttpStatus.NOT_FOUND),
      );
    });
  });
});
