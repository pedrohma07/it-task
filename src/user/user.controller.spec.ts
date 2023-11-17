import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

jest.mock('./user.service');

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, PrismaService],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const createdUser = {
        id: 1,
        ...createUserDto,
      };
      jest.spyOn(userService, 'create').mockResolvedValue(createdUser);

      const result = await controller.register(createUserDto);

      expect(result).toEqual(createdUser);
      expect(userService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findOne', () => {
    it('should find a user by ID', async () => {
      const userId = '1';
      const user = { id: 1, name: 'John Doe', email: 'john@example.com' };
      jest.spyOn(userService, 'findOne').mockResolvedValue(user);

      const result = await controller.findOne(userId);

      expect(result).toEqual(user);
      expect(userService.findOne).toHaveBeenCalledWith(+userId);
    });
  });

  describe('getByEmail', () => {
    it('should find a user by email', async () => {
      const userEmail = 'john@example.com';
      const user = {
        id: 1,
        name: 'John Doe',
        email: userEmail,
        password: 'password123',
      };
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);

      const result = await controller.getByEmail(userEmail);

      expect(result).toEqual(user);
      expect(userService.findByEmail).toHaveBeenCalledWith(userEmail);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };
      const updatedUser = {
        id: 1,
        name: 'Updated Name',
        email: 'john@example.com',
        password: undefined,
      };
      jest.spyOn(userService, 'update').mockResolvedValue(updatedUser);

      const result = await controller.update(userId, updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(userService.update).toHaveBeenCalledWith(+userId, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = '1';
      const deletionResult = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };
      const deletedUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };
      jest.spyOn(userService, 'remove').mockResolvedValue(deletedUser);

      const result = await controller.remove(userId);

      expect(result).toEqual(deletionResult);
      expect(userService.remove).toHaveBeenCalledWith(+userId);
    });
  });
});
