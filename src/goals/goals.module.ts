import { Module } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Goal])],
  providers: [GoalsService],
  controllers: [GoalsController],
})
export class GoalsModule {}
