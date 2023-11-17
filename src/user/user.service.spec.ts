import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto = {
      name: 'Test',
      email: 'test@test.com',
      password: 'password',
    };
    const createdUser = {
      id: 1,
      name: 'Test',
      email: 'test@test.com',
      password: 'password',
    };

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
    jest.spyOn(prismaService.user, 'create').mockResolvedValue(createdUser);

    expect(await service.create(createUserDto)).toEqual({
      ...createdUser,
      password: undefined,
    });
  });

  it('should find all users', async () => {
    const users = [
      { id: 1, name: 'Test', email: 'test@test.com', password: 'password' },
    ];

    jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(users);

    expect(await service.findAll()).toEqual(users);
  });

  it('should find one user by id', async () => {
    const user = {
      id: 1,
      name: 'Test',
      email: 'test@test.com',
      password: 'password',
    };

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);

    expect(await service.findOne(1)).toEqual(user);
  });

  // Add more tests for other methods in the service
});
