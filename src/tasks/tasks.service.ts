import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createDto: CreateTaskDto, user: any): Promise<Task> {
    const { goalId, ...rest } = createDto;
    const task = this.taskRepository.create({
      ...rest,
      user: { id: user.userId },
      goal: goalId ? { id: goalId } : null,
    });
    return this.taskRepository.save(task);
  }

  async findAll(
    user: any,
    filters: { startDate?: string; endDate?: string; search?: string },
  ): Promise<Task[]> {
    const { startDate, endDate, search } = filters;
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.goal', 'goal')
      .leftJoinAndSelect('goal.lifeArea', 'lifeArea')
      .where('task.userId = :userId', { userId: user.userId });

    if (startDate && endDate) {
      query.andWhere('task.dueDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    return query.getMany();
  }

  async toggleComplete(id: string, user: any): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, user: { id: user.userId } },
    });
    if (!task) throw new NotFoundException('Задача не найдена');
    task.isCompleted = !task.isCompleted;
    return this.taskRepository.save(task);
  }
}
