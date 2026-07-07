import { Module } from '@nestjs/common';
import { LifeAreasService } from './life-areas.service';
import { LifeAreasController } from './life-areas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LifeArea } from './entities/life-area.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LifeArea])],
  providers: [LifeAreasService],
  controllers: [LifeAreasController],
})
export class LifeAreasModule {}
