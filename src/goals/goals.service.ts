import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGoalDto } from './dto/create-goal.dto';
import { Goal } from './entities/goal.entity';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private goalRepository: Repository<Goal>,
  ) {}

  async create(createDto: CreateGoalDto, user: any): Promise<Goal> {
    const { lifeAreaId, ...rest } = createDto;
    const goal = this.goalRepository.create({
      ...rest,
      user: { id: user.userId },
      lifeArea: lifeAreaId ? { id: lifeAreaId } : null,
    });
    return this.goalRepository.save(goal);
  }

  async findAll(
    user: any,
    lifeAreaId?: string,
    search?: string,
  ): Promise<Goal[]> {
    const query = this.goalRepository
      .createQueryBuilder('goal')
      .leftJoinAndSelect('goal.lifeArea', 'lifeArea')
      .where('goal.userId = :userId', { userId: user.userId });

    if (lifeAreaId) {
      query.andWhere('goal.lifeAreaId = :lifeAreaId', { lifeAreaId });
    }

    if (search) {
      query.andWhere(
        '(LOWER(goal.title) LIKE LOWER(:search) OR LOWER(goal.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    return query.getMany();
  }

  async updateStatus(id: string, status: string, user: any): Promise<Goal> {
    const goal = await this.goalRepository.findOne({
      where: { id, user: { id: user.userId } },
    });
    if (!goal) throw new NotFoundException('Цель не найдена');
    goal.status = status;
    return this.goalRepository.save(goal);
  }
}
