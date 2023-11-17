import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: number) {
    console.log(createTaskDto);
    const data = { ...createTaskDto, userId };
    console.log(data);

    const task = await this.prisma.task.create({ data });

    const notification = await this.prisma.notification.create({
      data: {
        message: `Task ${task.title} created`,
        dateTime: new Date(),
        recipientId: userId,
      },
    });

    return { ...notification, recipientId: undefined, id: undefined };
  }

  findAll() {
    return `This action returns all task`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const data = updateTaskDto;

    const taskExists = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!taskExists) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.task.update({ where: { id }, data });
  }

  async remove(id: number) {
    const taskExists = await this.prisma.task.findUnique({ where: { id } });

    if (!taskExists) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.task.delete({ where: { id } });
  }
}
