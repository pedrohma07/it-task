import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

jest.mock('./notification.service');

describe('NotificationController', () => {
  let controller: NotificationController;
  let notificationService: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [NotificationService],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    notificationService = module.get<NotificationService>(NotificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
        dateTime: new Date(),
        recipientId: 1,
      };
      jest
        .spyOn(notificationService, 'create')
        .mockResolvedValue(createdNotification);

      const result = await controller.create(createNotificationDto);

      expect(result).toEqual(createdNotification);
      expect(notificationService.create).toHaveBeenCalledWith(
        createNotificationDto,
      );
    });
  });

  describe('findOne', () => {
    it('should find a specific notification', async () => {
      const notificationId = '1';
      const notification = {
        id: 1,
        message: 'Notification',
        recipient: 'user@example.com',
      };
      jest
        .spyOn(notificationService, 'findOne')
        .mockReturnValue(notification as any);

      const result = await controller.findOne(notificationId);

      expect(result).toEqual(notification);
      expect(notificationService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('remove', () => {
    it('should remove a specific notification', async () => {
      const notificationId = '1';
      const deletionMessage = `This action removes a #${notificationId} notification`;
      jest
        .spyOn(notificationService, 'remove')
        .mockReturnValue(deletionMessage);

      const result = await controller.remove(notificationId);

      expect(result).toEqual(deletionMessage);
      expect(notificationService.remove).toHaveBeenCalledWith(+notificationId);
    });
  });
});
