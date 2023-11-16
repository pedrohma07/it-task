import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthService } from '../../src/auth/auth.service';

@Controller('task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async addTask(@Req() request: Request, @Body() createTaskDto: CreateTaskDto) {
    const token = request.headers['authorization'].split(' ')[1];
    const decodedToken = await this.authService.validateToken(token);

    return this.taskService.create(createTaskDto, decodedToken.sub);
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  editTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
