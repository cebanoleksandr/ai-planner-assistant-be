import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Query,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  create(@Body() createDto: CreateTaskDto, @GetUser() user: any) {
    return this.tasksService.create(createDto, user);
  }

  @Get()
  findAll(
    @GetUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('search') search?: string,
  ) {
    return this.tasksService.findAll(user, { startDate, endDate, search });
  }

  @Patch(':id/toggle')
  toggleComplete(@Param('id') id: string, @GetUser() user: any) {
    return this.tasksService.toggleComplete(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTaskDto,
    @GetUser() user: any,
  ) {
    return this.tasksService.update(id, updateDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.tasksService.remove(id, user);
  }

  @Post('optimize')
  async optimizeTasks(@GetUser() user: any) {
    return this.tasksService.optimizeTasks(user.id);
  }
}
