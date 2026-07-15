import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { LifeAreasService } from './life-areas.service';
import { CreateLifeAreaDto } from './dto/create-life-area.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UpdateLifeAreaDto } from './dto/update-life-area.dto';

@Controller('life-areas')
@UseGuards(JwtAuthGuard)
export class LifeAreasController {
  constructor(private lifeAreasService: LifeAreasService) {}

  @Post()
  create(@Body() createDto: CreateLifeAreaDto, @GetUser() user: any) {
    return this.lifeAreasService.create(createDto, user);
  }

  @Get()
  findAll(@GetUser() user: any) {
    return this.lifeAreasService.findAll(user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateLifeAreaDto,
    @GetUser() user: any,
  ) {
    return this.lifeAreasService.update(id, updateDto, user);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @GetUser() user: any) {
    return this.lifeAreasService.delete(id, user);
  }
}
