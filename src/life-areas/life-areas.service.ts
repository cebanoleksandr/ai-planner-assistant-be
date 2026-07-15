import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLifeAreaDto } from './dto/create-life-area.dto';
import { LifeArea } from './entities/life-area.entity';
import { UpdateLifeAreaDto } from './dto/update-life-area.dto';

@Injectable()
export class LifeAreasService {
  constructor(
    @InjectRepository(LifeArea)
    private lifeAreaRepository: Repository<LifeArea>,
  ) {}

  async create(createDto: CreateLifeAreaDto, user: any): Promise<LifeArea> {
    const lifeArea = this.lifeAreaRepository.create({
      ...createDto,
      user: { id: user.userId },
    });
    return this.lifeAreaRepository.save(lifeArea);
  }

  async findAll(user: any): Promise<LifeArea[]> {
    return this.lifeAreaRepository.find({
      where: { user: { id: user.userId } },
    });
  }

  async update(
    id: string,
    updateDto: UpdateLifeAreaDto,
    user: any,
  ): Promise<LifeArea> {
    const lifeArea = await this.lifeAreaRepository.findOne({
      where: { id, user: { id: user.userId } },
    });

    if (!lifeArea) {
      throw new NotFoundException(`Сфера життя з ID "${id}" не знайдена`);
    }

    Object.assign(lifeArea, updateDto);

    return this.lifeAreaRepository.save(lifeArea);
  }

  async delete(id: string, user: any): Promise<void> {
    const result = await this.lifeAreaRepository.delete({
      id,
      user: { id: user.userId },
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Сфера жизни с ID "${id}" не найдена`);
    }
  }
}
