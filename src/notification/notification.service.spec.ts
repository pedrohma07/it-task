import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

jest.mock('../../src/prisma/prisma.service', () => {
  return {
    PrismaService: jest.fn().mockImplementation(() => ({
      notification: {
        create: jest.fn(),
      },
    })),
  };
});

describe('NotificationService', () => {
  let service: NotificationService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationService, PrismaService],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a notification', async () => {
      const createNotificationDto: CreateNotificationDto = {
        message: 'New notification',
        recipientId: 1,
        dateTime: new Date(),
      };

      const createdNotification = {
        id: 1,
        message: 'New notification',
        recipientId: 1,
        dateTime: new Date(),
      };

      (prismaService.notification.create as jest.Mock).mockResolvedValue(
        createdNotification,
      );

      const result = await service.create(createNotificationDto);

      expect(result).toEqual(createdNotification);
      expect(prismaService.notification.create).toHaveBeenCalledWith({
        data: createNotificationDto,
      });
    });
  });

  describe('findOne', () => {
    it('should return a specific notification message', async () => {
      const notificationId = 1;
      const expectedMessage = `This action returns a #${notificationId} notification`;

      const result = service.findOne(notificationId);

      expect(result).toEqual(expectedMessage);
    });
  });

  describe('remove', () => {
    it('should return a message about removing a specific notification', async () => {
      const notificationId = 1;
      const expectedMessage = `This action removes a #${notificationId} notification`;

      const result = service.remove(notificationId);

      expect(result).toEqual(expectedMessage);
    });
  });
});
