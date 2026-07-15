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
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {
  constructor(private goalsService: GoalsService) {}

  @Post()
  create(@Body() createDto: CreateGoalDto, @GetUser() user: any) {
    return this.goalsService.create(createDto, user);
  }

  @Get()
  findAll(
    @GetUser() user: any,
    @Query('lifeAreaId') lifeAreaId?: string,
    @Query('search') search?: string,
  ) {
    return this.goalsService.findAll(user, lifeAreaId, search);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @GetUser() user: any,
  ) {
    return this.goalsService.updateStatus(id, status, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateGoalDto,
    @GetUser() user: any,
  ) {
    return this.goalsService.update(id, updateDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.goalsService.remove(id, user);
  }
}
