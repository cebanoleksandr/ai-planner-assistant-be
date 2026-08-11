import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import axios from 'axios';

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
      .addOrderBy('task.createdAt', 'ASC')
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
    if (!task) throw new NotFoundException('Task not found');
    task.isCompleted = !task.isCompleted;
    return this.taskRepository.save(task);
  }

  async update(id: string, updateDto: UpdateTaskDto, user: any): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, user: { id: user.userId } },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const { goalId, ...rest } = updateDto;

    Object.assign(task, rest);

    if (goalId !== undefined) {
      task.goal = goalId ? ({ id: goalId } as any) : null;
    }

    return this.taskRepository.save(task);
  }

  async remove(id: string, user: any): Promise<void> {
    const result = await this.taskRepository.delete({
      id,
      user: { id: user.userId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }

  async optimizeTasks(userId: string) {
    const tasks = await this.taskRepository.find({
      where: {
        user: { id: userId },
      },
    });

    try {
      const n8nWebhookUrl = process.env.N8N_AI_OPTIMIZE_WEBHOOK_URL;

      if (!n8nWebhookUrl) {
        throw new Error(
          'N8N_AI_OPTIMIZE_WEBHOOK_URL is not defined in environment variables',
        );
      }

      const response = await axios.post(n8nWebhookUrl, {
        userId,
        tasks,
      });

      const n8nResult = response.data;

      return {
        message: n8nResult.message || 'Tasks optimized successfully via n8n',
        optimizedTasks: n8nResult.optimizedTasks || tasks,
      };
    } catch (error) {
      console.error('Failed to communicate with n8n workflow:', error.message);

      return {
        message:
          'AI optimization service is temporarily unavailable, returning original tasks.',
        optimizedTasks: tasks,
      };
    }
  }
}
