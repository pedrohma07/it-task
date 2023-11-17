import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../src/prisma/prisma.service';
import { HttpStatus, HttpException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const data = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };

    const userExists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    console.log(userExists);

    if (userExists !== null) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    const user = await this.prisma.user.create({ data });

    return {
      ...user,
      password: undefined,
    };
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return users;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const data = updateUserDto;

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });

    return {
      ...updatedUser,
      password: undefined,
    };
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new Error('User not found');
    }

    return this.prisma.user.delete({ where: { id } });
  }
}
